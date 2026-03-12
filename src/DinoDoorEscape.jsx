// ═══════════════════════════════════════════════════════════
//  DinoDoorEscape.jsx — "Dino Door Escape" game for Course 5
//
//  The dinos must find pieces of a treasure map to discover
//  which door leads to their new home!
//
//  Mechanics:
//    - Pick 1 of 7 dinos → 9 questions (3 foundation + 6 advanced)
//    - Foundation: 3 MCQ → must pass ≥2/3 to unlock advanced
//    - Advanced: 6 mixed types (true/false, multi-select, ordering, spot-error)
//    - Correct → earn a map piece (reveals part of the escape route)
//    - Wrong → map piece stays hidden (fog remains)
//    - Final: collected map pieces reveal which door is correct
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import CuteDino from "./CuteDino";
import { pickBalanced, pickAdvancedMix } from "./questionHelpers";
import { course5Questions } from "./course5Questions";
import { supabase, saveProgress } from "./supabaseClient";

// ═══ DESIGN TOKENS ═══
const CRIMSON = "#C0392B";
const CRIMSON_LIGHT = "#E74C3C";
const DARK = "#1D2B3A";
const MUTED = "#6B7A8D";
const GOLD = "#F4D03F";
const GOLD_DARK = "#D4A843";
const CORAL = "#E8734A";
const GREEN = "#27AE60";
const RED = "#C0392B";
const BLUE = "#2E86C1";
const CORRIDOR_BG = "#1A0F2E";
const CORRIDOR_FLOOR = "#2D1B4E";
const DOOR_GLOW = "#E8D5B7";
const MAP_BG = "#F5E6C8";
const MAP_BORDER = "#C4A265";
const DINO_COLORS = ["#2ECC71","#3498DB","#F1C40F","#E74C3C","#9B59B6","#E67E22","#95A5A6"];
const DINO_NAMES_EN = ["Rex","Azure","Zephyr","Blaze","Thistle","Velo","Dome"];
const DINO_NAMES_ZH = ["翠牙龍","蒼瀾龍","金翼龍","焰角龍","紫棘龍","珀爪龍","鐵穹龍"];
const FONT = "'Noto Sans TC','Outfit',sans-serif";

const btnPrimary = (bg) => ({
  background: bg, border: "none", color: "#FFF", padding: "12px 28px",
  borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
  fontFamily: FONT, transition: "all 0.2s",
});

// ═══ TREASURE MAP — 3×3 SVG GRID ═══
// Path route is randomly generated each game.
// Each tile is 80×80. Revealed tiles show the path; hidden tiles show fog.
const TILE = 80;
const PATH_COLOR = "#D4A843";
const PATH_W = 6;
const LAND_COLOR = "#E8D5B0";
const LAND_DARK = "#D6C49E";
const FOG_COLOR = "#2A1B3E";

// ═══ RANDOM PATH GENERATOR ═══
// Generates a path through the 3×3 grid from a random top-row cell
// to a random bottom-row cell. Returns { cells: Set of "r-c" strings, correctDoor: 0|1|2 }
// The path always visits exactly one cell per row and can move left, right, or straight down.
// Additionally, one random decoy branch is added to make the map harder to read.
function generateMapRoute() {
  // Pick random start column (row 0) and random end column (row 2 = door)
  const startCol = Math.floor(Math.random() * 3);
  const endCol = Math.floor(Math.random() * 3);

  // Build path row by row, stepping toward endCol but with some randomness
  const path = [{ r: 0, c: startCol }];
  let col = startCol;

  // Row 1: step toward endCol, but allow a random detour
  if (col < endCol) col = col + 1;
  else if (col > endCol) col = col - 1;
  else {
    // Already aligned — randomly stay or wiggle
    const wiggle = [-1, 0, 1].filter(d => col + d >= 0 && col + d <= 2);
    col = col + wiggle[Math.floor(Math.random() * wiggle.length)];
  }
  path.push({ r: 1, c: col });

  // Row 2: must reach endCol
  path.push({ r: 2, c: endCol });

  const cells = new Set(path.map(p => `${p.r}-${p.c}`));

  // Add a decoy branch: pick a non-path cell adjacent to the path
  // that could mislead the player into thinking the path goes elsewhere
  const decoyOptions = [];
  for (const p of path) {
    for (const dc of [-1, 1]) {
      const nc = p.c + dc;
      const key = `${p.r}-${nc}`;
      if (nc >= 0 && nc <= 2 && !cells.has(key)) {
        decoyOptions.push(key);
      }
    }
  }
  // Also try adding a cell below a non-end path cell to fake another door
  for (const p of path) {
    if (p.r < 2) {
      const below = `${p.r + 1}-${p.c}`;
      if (!cells.has(below)) decoyOptions.push(below);
    }
  }
  // Pick 1-2 unique decoys
  const shuffled = decoyOptions.sort(() => Math.random() - 0.5);
  const decoys = new Set();
  for (let i = 0; i < Math.min(2, shuffled.length); i++) decoys.add(shuffled[i]);

  // Build edge connections for path drawing
  // edges: for each cell, which directions connect (up/down/left/right)
  const allCells = new Set([...cells, ...decoys]);
  const edges = {};
  const addEdge = (key, dir) => { if (!edges[key]) edges[key] = new Set(); edges[key].add(dir); };

  // True path edges
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    const ka = `${a.r}-${a.c}`, kb = `${b.r}-${b.c}`;
    if (b.r > a.r) { addEdge(ka, "down"); addEdge(kb, "up"); }
    if (b.c > a.c) { addEdge(ka, "right"); addEdge(kb, "left"); }
    if (b.c < a.c) { addEdge(ka, "left"); addEdge(kb, "right"); }
    // diagonal = right/left + down/up
    if (b.r > a.r && b.c !== a.c) { addEdge(ka, "down"); addEdge(kb, "up"); }
  }

  // Decoy edges: connect each decoy to its nearest path neighbor
  for (const dk of decoys) {
    const [dr, dc] = dk.split("-").map(Number);
    // Find which path cell it's adjacent to
    for (const p of path) {
      if (p.r === dr && Math.abs(p.c - dc) === 1) {
        const pk = `${p.r}-${p.c}`;
        if (dc > p.c) { addEdge(pk, "right"); addEdge(dk, "left"); }
        else { addEdge(pk, "left"); addEdge(dk, "right"); }
      }
      if (p.c === dc && Math.abs(p.r - dr) === 1) {
        const pk = `${p.r}-${p.c}`;
        if (dr > p.r) { addEdge(pk, "down"); addEdge(dk, "up"); }
        else { addEdge(pk, "up"); addEdge(dk, "down"); }
      }
    }
  }

  return { pathCells: cells, decoyCells: decoys, allCells, edges, correctDoor: endCol, startCol };
}

// ═══ DYNAMIC MAP TILE ═══
function MapTile({ row, col, state, route }) {
  if (state !== "found") {
    return (
      <g>
        <rect width={TILE} height={TILE} fill={FOG_COLOR} />
        <text x={TILE/2} y={TILE/2+6} fontSize="20" fill="#555" textAnchor="middle" fontWeight="700">?</text>
        {state === "hidden" && (
          <circle cx={TILE/2} cy={TILE/2} r="12" fill="#444" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite"/>
          </circle>
        )}
      </g>
    );
  }

  const key = `${row}-${col}`;
  const mid = TILE / 2;
  const isOnPath = route.pathCells.has(key) || route.decoyCells.has(key);
  const dirs = route.edges[key] || new Set();
  const isDoor = row === 2;
  const isStart = row === 0 && col === route.startCol;
  const isCorrectDoor = row === 2 && col === route.correctDoor;

  // Deterministic decoration based on position (no randomness at render time)
  const seed = row * 7 + col * 13;
  const decoType = seed % 3; // 0=tree, 1=rocks, 2=bush

  return (
    <g>
      <rect width={TILE} height={TILE} fill={LAND_COLOR} />
      <line x1="0" y1={20+row*7} x2={TILE} y2={22+row*5} stroke={LAND_DARK} strokeWidth="0.5" opacity="0.5"/>
      <line x1="0" y1={50+col*5} x2={TILE} y2={48+col*7} stroke={LAND_DARK} strokeWidth="0.5" opacity="0.4"/>

      {/* Path segments */}
      {isOnPath && <>
        {dirs.has("right") && <path d={`M${mid} ${mid} L${TILE} ${mid}`} stroke={PATH_COLOR} strokeWidth={PATH_W} fill="none" strokeLinecap="round"/>}
        {dirs.has("left") && <path d={`M0 ${mid} L${mid} ${mid}`} stroke={PATH_COLOR} strokeWidth={PATH_W} fill="none" strokeLinecap="round"/>}
        {dirs.has("down") && <path d={`M${mid} ${mid} L${mid} ${TILE}`} stroke={PATH_COLOR} strokeWidth={PATH_W} fill="none" strokeLinecap="round"/>}
        {dirs.has("up") && <path d={`M${mid} 0 L${mid} ${mid}`} stroke={PATH_COLOR} strokeWidth={PATH_W} fill="none" strokeLinecap="round"/>}
        {/* Junction dot */}
        <circle cx={mid} cy={mid} r={PATH_W/2+1} fill={PATH_COLOR} opacity="0.6"/>
      </>}

      {/* Start marker */}
      {isStart && <>
        <circle cx={mid} cy={mid-16} r="3" fill="#2ECC71"/>
        <text x={mid} y={mid-22} fontSize="16" textAnchor="middle">🦕</text>
      </>}

      {/* Door tiles (bottom row) */}
      {isDoor && <>
        {isCorrectDoor && isOnPath && <>
          <path d={`M${mid} 0 L${mid} 10`} stroke={PATH_COLOR} strokeWidth={PATH_W} fill="none" strokeLinecap="round"/>
          <rect x={mid-14} y={12} width={28} height={38} rx="3" fill="#DAA520" opacity="0.3"/>
        </>}
        <rect x={mid-12} y={isDoor&&isCorrectDoor&&isOnPath?14:10} width={24} height={isDoor&&isCorrectDoor&&isOnPath?34:36} rx="3" fill="#8B4513"/>
        <rect x={mid-10} y={isDoor&&isCorrectDoor&&isOnPath?16:12} width={20} height={isDoor&&isCorrectDoor&&isOnPath?30:32} rx="2" fill={isCorrectDoor&&isOnPath?"#6B4423":"#6B3410"}/>
        <circle cx={mid+6} cy={isDoor&&isCorrectDoor&&isOnPath?32:30} r="2.5" fill={isCorrectDoor&&isOnPath?GOLD:"#DAA520"}/>
        <text x={mid} y={isDoor&&isCorrectDoor&&isOnPath?66:62} fontSize="10" fill={isCorrectDoor&&isOnPath?GOLD_DARK:"#8B6914"} textAnchor="middle" fontWeight={isCorrectDoor&&isOnPath?"900":"700"}>{col+1}</text>
        {isCorrectDoor && isOnPath && (
          <rect x={mid-14} y={12} width={28} height={38} rx="3" fill={GOLD} opacity="0.12">
            <animate attributeName="opacity" values="0.06;0.18;0.06" dur="2s" repeatCount="indefinite"/>
          </rect>
        )}
      </>}

      {/* Decorations for non-path, non-door tiles */}
      {!isOnPath && !isDoor && <>
        {decoType===0 && <>
          <circle cx={25} cy={35} r="10" fill="#5B8C5A" opacity="0.5"/>
          <rect x={23.5} y={41} width={3} height={10} fill="#8B6914" opacity="0.4" rx="1"/>
          <circle cx={60} cy={55} r="7" fill="#4A7A49" opacity="0.4"/>
        </>}
        {decoType===1 && <>
          <ellipse cx={30} cy={45} rx="12" ry="8" fill="#B8A88A" opacity="0.5"/>
          <ellipse cx={55} cy={30} rx="8" ry="6" fill="#C4B494" opacity="0.4"/>
        </>}
        {decoType===2 && <>
          <circle cx={20} cy={28} r="6" fill="#5B8C5A" opacity="0.4"/>
          <circle cx={55} cy={50} r="9" fill="#4A7A49" opacity="0.45"/>
          <circle cx={38} cy={60} r="5" fill="#6B9F6A" opacity="0.35"/>
        </>}
      </>}
    </g>
  );
}

function TreasureMap({ pieces, lang, compact = false, route }) {
  const foundCount = pieces.filter(p => p === "found").length;
  const total = pieces.length;
  const scale = compact ? 0.65 : 1;
  const tileSize = TILE * scale;
  const gap = 2 * scale;
  const gridW = tileSize * 3 + gap * 2;
  const gridH = tileSize * 3 + gap * 2;

  // Map 9 pieces to 3×3 grid: index 0-2 = row 0, 3-5 = row 1, 6-8 = row 2
  const getState = (row, col) => {
    const idx = row * 3 + col;
    return pieces[idx] || "hidden";
  };

  return (
    <div style={{
      background: `linear-gradient(135deg, ${MAP_BG} 0%, #EDD9B3 100%)`,
      border: `2px solid ${MAP_BORDER}`,
      borderRadius: compact ? 10 : 14, padding: compact ? "10px 12px" : "14px 16px",
      position: "relative", overflow: "hidden",
      boxShadow: "inset 0 1px 4px rgba(139,105,20,0.15)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: compact ? 6 : 10 }}>
        <span style={{ fontSize: compact ? 11 : 12, fontWeight: 700, color: "#8B6914", fontFamily: FONT }}>
          🗺️ {lang === "zh" ? "藏寶地圖" : "Treasure Map"}
        </span>
        <span style={{ fontSize: compact ? 10 : 11, color: "#A0894A", fontFamily: FONT, fontWeight: 600 }}>
          {foundCount}/{total} {lang === "zh" ? "碎片" : "pieces"}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width={gridW} height={gridH} viewBox={`0 0 ${gridW} ${gridH}`}>
          {/* Border */}
          <rect x="0" y="0" width={gridW} height={gridH} rx={compact ? 6 : 8} fill={MAP_BORDER} />
          {[0,1,2].map(row =>
            [0,1,2].map(col => {
              const x = col * (tileSize + gap) + gap/2;
              const y = row * (tileSize + gap) + gap/2;
              const state = getState(row, col);
              return (
                <g key={`${row}-${col}`} transform={`translate(${x},${y}) scale(${scale})`}>
                  <rect width={TILE} height={TILE} rx="4" fill={state === "found" ? LAND_COLOR : FOG_COLOR} />
                  <MapTile row={row} col={col} state={state} route={route} />
                </g>
              );
            })
          )}
        </svg>
      </div>
    </div>
  );
}

// ═══ CORRIDOR BACKGROUND ═══
function CorridorBackground({ phase, children }) {
  return (
    <div className="corridor-bg" style={{
      background: `linear-gradient(180deg,${CORRIDOR_BG} 0%,${CORRIDOR_FLOOR} 60%,#1F0F35 100%)`,
      borderRadius: 16, padding: "24px 20px", position: "relative", overflow: "hidden", minHeight: 400,
    }}>
      {/* Torch-like flickering lights */}
      {[...Array(6)].map((_,i) => (
        <div key={i} style={{
          position:"absolute", left:`${10+i*16}%`, top: i%2===0?"8%":"75%",
          width:6, height:6, borderRadius:"50%",
          background: i%2===0 ? "#FF9F43" : "#FECA57",
          opacity: 0.4,
          animation:`deFlicker ${1.2+i*0.4}s ease-in-out infinite alternate`,
          boxShadow: `0 0 12px ${i%2===0?"#FF9F43":"#FECA57"}66`,
        }}/>
      ))}
      {phase === "advanced" && <div style={{
        position:"absolute", inset:0, borderRadius:16,
        background:"radial-gradient(ellipse at 50% 50%,rgba(192,57,43,0.08) 0%,transparent 70%)",
        pointerEvents:"none",
      }}/>}
      <style>{`@keyframes deFlicker{0%{opacity:0.25;transform:scale(0.8)}100%{opacity:0.55;transform:scale(1.15)}} .corridor-bg ::selection{background:#E8D5B766;color:#FFF}`}</style>
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );
}

// ═══ TYPE BADGE ═══
function TypeBadge({ type, lang }) {
  const L = {
    mcq:         { zh:"選擇題", en:"Multiple Choice", c: CRIMSON },
    true_false:  { zh:"是非題", en:"True / False",    c: "#8E44AD" },
    multi_select:{ zh:"複選題", en:"Select ALL",      c: CORAL },
    ordering:    { zh:"排序題", en:"Ordering",         c: GREEN },
    spot_error:  { zh:"找錯題", en:"Spot the Error",   c: BLUE },
  };
  const info = L[type] || L.mcq;
  return (
    <span style={{
      display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11,
      fontWeight:700, letterSpacing:1, background:`${info.c}22`, color:info.c,
      border:`1px solid ${info.c}44`, textTransform:"uppercase", fontFamily:FONT,
    }}>{lang==="zh"?info.zh:info.en}</span>
  );
}

// ═══ QUESTION RENDERERS ═══
function MCQRenderer({ q, lang, onAnswer, answered, sel }) {
  const data = q[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {data.opts.map((opt,i) => {
        let bg="rgba(255,255,255,0.08)", border="1px solid rgba(255,255,255,0.15)";
        if (answered) {
          if (i===q.correct) { bg=`${GREEN}33`; border=`2px solid ${GREEN}`; }
          else if (sel===i) { bg=`${RED}33`; border=`2px solid ${RED}`; }
        } else if (sel===i) { bg="rgba(192,57,43,0.25)"; border=`2px solid ${CRIMSON_LIGHT}`; }
        return (
          <button key={i} disabled={answered} onClick={()=>onAnswer(i,i===q.correct)} style={{
            background:bg, border, color:"#E0E0E0", borderRadius:10, padding:"12px 16px",
            fontSize:14, fontFamily:FONT, cursor:answered?"default":"pointer",
            textAlign:"left", transition:"all 0.2s", lineHeight:1.5,
          }}>
            <span style={{ fontWeight:600, marginRight:8, opacity:0.6 }}>{String.fromCharCode(65+i)}</span>{opt}
          </button>
        );
      })}
    </div>
  );
}

function TFRenderer({ q, lang, onAnswer, answered, sel }) {
  const opts = lang==="zh"?["正確 ✓","錯誤 ✗"]:["True ✓","False ✗"];
  const ci = q.correct===true?0:1;
  return (
    <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:8 }}>
      {opts.map((opt,i) => {
        let bg="rgba(255,255,255,0.08)", border="1px solid rgba(255,255,255,0.15)";
        if (answered) { if(i===ci){bg=`${GREEN}33`;border=`2px solid ${GREEN}`;}else if(sel===i){bg=`${RED}33`;border=`2px solid ${RED}`;}}
        else if (sel===i) { bg=`${CRIMSON}33`; border=`2px solid ${CRIMSON_LIGHT}`; }
        return (
          <button key={i} disabled={answered} onClick={()=>onAnswer(i,i===ci)} style={{
            background:bg, border, color:"#FFF", borderRadius:12, padding:"16px 36px",
            fontSize:16, fontWeight:700, fontFamily:FONT, cursor:answered?"default":"pointer",
            transition:"all 0.2s", minWidth:120,
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

function MSRenderer({ q, lang, onAnswer, answered }) {
  const [selected, setSelected] = useState([]);
  const data = q[lang]; const cs = new Set(q.correctAll);
  const toggle = (i) => { if(!answered) setSelected(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]); };
  const submit = () => { const ok=selected.length===q.correctAll.length&&selected.every(i=>cs.has(i)); onAnswer(selected,ok); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontSize:12, color:DOOR_GLOW, margin:0, fontFamily:FONT }}>
        {lang==="zh"?`💡 選出所有正確答案（共 ${q.correctAll.length} 個）`:`💡 Select ALL correct (${q.correctAll.length} total)`}
      </p>
      {data.opts.map((opt,i) => {
        const isSel=selected.includes(i);
        let bg=isSel?"rgba(192,57,43,0.2)":"rgba(255,255,255,0.08)";
        let border=isSel?`2px solid ${CRIMSON_LIGHT}`:"1px solid rgba(255,255,255,0.15)";
        if(answered){if(cs.has(i)){bg=`${GREEN}33`;border=`2px solid ${GREEN}`;}else if(isSel){bg=`${RED}33`;border=`2px solid ${RED}`;}}
        return (
          <button key={i} disabled={answered} onClick={()=>toggle(i)} style={{
            background:bg, border, color:"#E0E0E0", borderRadius:10, padding:"11px 16px",
            fontSize:14, fontFamily:FONT, cursor:answered?"default":"pointer",
            textAlign:"left", transition:"all 0.2s", lineHeight:1.5, display:"flex", alignItems:"center", gap:10,
          }}>
            <span style={{ width:20, height:20, borderRadius:4, flexShrink:0,
              border:`2px solid ${isSel?CRIMSON_LIGHT:"rgba(255,255,255,0.3)"}`,
              background:isSel?CRIMSON:"transparent", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:12, color:"#FFF",
            }}>{isSel?"✓":""}</span>{opt}
          </button>
        );
      })}
      {!answered && <button onClick={submit} disabled={selected.length===0}
        style={{...btnPrimary(selected.length>0?CRIMSON:MUTED), marginTop:4, alignSelf:"center", opacity:selected.length>0?1:0.5}}>
        {lang==="zh"?"確認答案":"Confirm"}</button>}
    </div>
  );
}

function OrderRenderer({ q, lang, onAnswer, answered }) {
  const data = q[lang];
  const [order,setOrder] = useState(()=>{const idx=data.items.map((_,i)=>i);for(let i=idx.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}return idx;});
  const move=(f,t)=>{if(answered)return;const n=[...order];const[m]=n.splice(f,1);n.splice(t,0,m);setOrder(n);};
  const submit=()=>{onAnswer(order,order.every((v,i)=>v===q.correctOrder[i]));};
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <p style={{ fontSize:12, color:DOOR_GLOW, margin:0, fontFamily:FONT }}>{lang==="zh"?"🔄 使用箭頭調整順序":"🔄 Use arrows to reorder"}</p>
      {order.map((itemIdx,pos)=>{
        let bg="rgba(255,255,255,0.08)",border="1px solid rgba(255,255,255,0.15)";
        if(answered){if(q.correctOrder.indexOf(itemIdx)===pos){bg=`${GREEN}33`;border=`2px solid ${GREEN}`;}else{bg=`${RED}22`;border=`2px solid ${RED}66`;}}
        return(
          <div key={itemIdx} style={{background:bg,border,borderRadius:10,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>
            <span style={{width:24,height:24,borderRadius:"50%",flexShrink:0,background:answered?(q.correctOrder.indexOf(itemIdx)===pos?GREEN:RED):CRIMSON,color:"#FFF",fontSize:12,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{pos+1}</span>
            <span style={{flex:1,color:"#E0E0E0",fontSize:13,fontFamily:FONT,lineHeight:1.5}}>{data.items[itemIdx]}</span>
            {!answered&&(<div style={{display:"flex",flexDirection:"column",gap:2}}>
              <button onClick={()=>pos>0&&move(pos,pos-1)} disabled={pos===0} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:4,color:pos===0?"#555":"#CCC",cursor:pos===0?"default":"pointer",padding:"2px 6px",fontSize:10}}>▲</button>
              <button onClick={()=>pos<order.length-1&&move(pos,pos+1)} disabled={pos===order.length-1} style={{background:"rgba(255,255,255,0.1)",border:"none",borderRadius:4,color:pos===order.length-1?"#555":"#CCC",cursor:pos===order.length-1?"default":"pointer",padding:"2px 6px",fontSize:10}}>▼</button>
            </div>)}
          </div>
        );
      })}
      {!answered&&<button onClick={submit} style={{...btnPrimary(CRIMSON),marginTop:4,alignSelf:"center"}}>{lang==="zh"?"確認順序":"Confirm Order"}</button>}
    </div>
  );
}

function SERenderer({ q, lang, onAnswer, answered, sel }) {
  const data = q[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontSize:12, color:DOOR_GLOW, margin:0, fontFamily:FONT }}>{lang==="zh"?"🔍 點擊有錯的敘述":"🔍 Click the statement with an error"}</p>
      {(data.statements || data.opts).map((stmt,i)=>{
        let bg="rgba(255,255,255,0.08)",border="1px solid rgba(255,255,255,0.15)";
        if(answered){if(i===q.correct){bg=`${RED}33`;border=`2px solid ${RED}`;}else if(sel===i){bg=`${CORAL}22`;border=`2px solid ${CORAL}66`;}else{bg=`${GREEN}15`;border=`1px solid ${GREEN}44`;}}
        return(
          <button key={i} disabled={answered} onClick={()=>onAnswer(i,i===q.correct)} style={{
            background:bg,border,color:"#E0E0E0",borderRadius:10,padding:"11px 16px",fontSize:13,fontFamily:FONT,
            cursor:answered?"default":"pointer",textAlign:"left",transition:"all 0.2s",lineHeight:1.5,display:"flex",alignItems:"flex-start",gap:10,
          }}>
            <span style={{fontWeight:700,color:answered&&i===q.correct?RED:MUTED,fontSize:13,flexShrink:0,marginTop:1}}>{answered?(i===q.correct?"✗":"✓"):`${i+1}.`}</span>{stmt}
          </button>
        );
      })}
      {q.correct===-1&&!answered&&<button onClick={()=>onAnswer(-1,true)} style={{...btnPrimary("rgba(255,255,255,0.15)"),fontSize:13,padding:"10px 20px"}}>{lang==="zh"?"全部正確":"All correct"}</button>}
    </div>
  );
}

// ═══ DOOR CHOICE SCENE ═══
function DoorChoiceScene({ pieces, selectedDino, lang, onChoose, route }) {
  const foundCount = pieces.filter(p => p === "found").length;
  const correctDoor = route.correctDoor;
  const [hoveredDoor, setHoveredDoor] = useState(null);

  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ marginBottom: 16 }}>
        <CuteDino index={selectedDino} size={80} color={DINO_COLORS[selectedDino]} />
      </div>
      <h3 style={{ color: GOLD, fontSize: 20, fontFamily: FONT, marginBottom: 6 }}>
        {lang === "zh" ? "🚪 看地圖，選擇正確的門！" : "🚪 Read the Map, Pick the Door!"}
      </h3>
      <p style={{ color: "#9988BB", fontSize: 14, fontFamily: FONT, maxWidth: 480, margin: "0 auto 20px", lineHeight: 1.6 }}>
        {lang === "zh"
          ? `你收集了 ${foundCount}/9 張地圖碎片。地圖上的路徑通往正確的門——碎片越多，路徑越清楚！`
          : `You collected ${foundCount}/9 map pieces. The path on the map leads to the correct door — more pieces = clearer path!`}
      </p>

      {/* Show the assembled map */}
      <div style={{ marginBottom: 24 }}>
        <TreasureMap pieces={pieces} lang={lang} route={route} />
      </div>

      {/* 3 doors to choose */}
      <p style={{ color: GOLD, fontSize: 13, fontFamily: FONT, marginBottom: 12, fontWeight: 600 }}>
        {lang === "zh" ? "選擇一扇門：" : "Choose a door:"}
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
        {[0, 1, 2].map((idx) => {
          const isHovered = hoveredDoor === idx;
          return (
            <button key={idx}
              onClick={() => onChoose(idx, idx === correctDoor)}
              onMouseEnter={() => setHoveredDoor(idx)}
              onMouseLeave={() => setHoveredDoor(null)}
              style={{
                background: isHovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)",
                border: `2px solid ${isHovered ? GOLD : "rgba(255,255,255,0.15)"}`,
                borderRadius: 14, padding: "16px 28px", cursor: "pointer",
                transition: "all 0.2s", transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
              <svg width="48" height="64" viewBox="0 0 48 64">
                <rect x="4" y="4" width="40" height="56" rx="4" fill="#3A2A1A" stroke={isHovered ? GOLD : "#5C4033"} strokeWidth="2"/>
                <rect x="8" y="8" width="32" height="48" rx="3" fill={isHovered ? "#7B5B3A" : "#6B4423"}/>
                <rect x="12" y="12" width="24" height="18" rx="2" fill="rgba(0,0,0,0.15)"/>
                <rect x="12" y="34" width="24" height="18" rx="2" fill="rgba(0,0,0,0.15)"/>
                <circle cx="34" cy="34" r="3" fill={isHovered ? GOLD : "#DAA520"}/>
                {isHovered && (
                  <rect x="8" y="8" width="32" height="48" rx="3" fill={GOLD} opacity="0.1">
                    <animate attributeName="opacity" values="0.05;0.15;0.05" dur="1.5s" repeatCount="indefinite"/>
                  </rect>
                )}
              </svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: isHovered ? GOLD : "#AAA", fontFamily: FONT, transition: "color 0.2s" }}>
                {lang === "zh" ? `門 ${idx + 1}` : `Door ${idx + 1}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


// ═══ MAIN GAME ═══
export default function DinoDoorEscape({ lang: langProp, user }) {
  const lang = langProp || "en";
  const [phase, setPhase] = useState("select"); // select|foundation|gate|advanced|choose|result
  const [selectedDino, setSelectedDino] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [foundScore, setFoundScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [sel, setSel] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [mapPieces, setMapPieces] = useState(Array(9).fill("hidden")); // hidden|found|missed
  const [shake, setShake] = useState(false);
  const [doorChoice, setDoorChoice] = useState(null); // null | { door, correct }
  const [route, setRoute] = useState(() => generateMapRoute());
  const [availableDinos, setAvailableDinos] = useState([0,1,2,3,4,5,6]);

  useEffect(() => {
    if (!user) return;
    const fetchAvailable = async () => {
      const { data } = await supabase.from("progress").select("dino_index").eq("user_id", user.id).eq("course", 4).eq("result", "unlocked");
      if (data && data.length > 0) setAvailableDinos([...new Set(data.map(r => r.dino_index))]);
    };
    fetchAvailable();
  }, [user]);

  const startGame = useCallback((dinoIdx) => {
    setSelectedDino(dinoIdx);
    const mcqPool = course5Questions.filter(q => !q.type || q.type === "mcq");
    const foundation = pickBalanced(mcqPool, 3);
    const advanced = pickAdvancedMix(course5Questions, 6);
    setQuestions([...foundation, ...advanced]);
    setPhase("foundation"); setQi(0); setScore(0); setFoundScore(0);
    setAnswered(false); setSel(null); setMapPieces(Array(9).fill("hidden"));
    setDoorChoice(null); setRoute(generateMapRoute());
  }, []);

  const handleAnswer = useCallback((answer, isCorrect) => {
    if (answered) return;
    setAnswered(true); setSel(answer); setCorrect(isCorrect);
    if (isCorrect) {
      setScore(s => s+1);
      if (qi < 3) setFoundScore(s => s+1);
      setMapPieces(prev => { const n=[...prev]; n[qi]="found"; return n; });
    } else {
      setMapPieces(prev => { const n=[...prev]; n[qi]="missed"; return n; });
      setShake(true); setTimeout(() => setShake(false), 500);
    }
  }, [answered, qi]);

  const nextQ = () => {
    const next = qi + 1;
    if (next === 3) {
      if (foundScore >= 2) {
        setPhase("gate");
        setTimeout(() => { setPhase("advanced"); setQi(next); setAnswered(false); setSel(null); }, 2500);
      } else {
        if (user) { saveProgress(user, { course: 5, game_type: "door_escape", dino_index: selectedDino, score, max_score: 9, result: "trapped" }); }
        setPhase("result");
      }
      return;
    }
    if (next >= questions.length) {
      // All questions done → go to door choice phase
      setPhase("choose");
      return;
    }
    setQi(next); setAnswered(false); setSel(null);
  };

  const handleDoorChoice = (doorIdx, isCorrect) => {
    setDoorChoice({ door: doorIdx, correct: isCorrect });
    const didEscape = foundScore >= 2 && isCorrect && score >= 6;
    if (user) { saveProgress(user, { course: 5, game_type: "door_escape", dino_index: selectedDino, score, max_score: 9, result: didEscape ? "escaped" : "trapped" }); }
    setTimeout(() => setPhase("result"), 1500);
  };

  // ── SELECT ──
  if (phase === "select") {
    return (
      <CorridorBackground phase="select">
        <div style={{ textAlign:"center", padding:"28px 0" }}>
          <h2 style={{ color:DOOR_GLOW, fontSize:"clamp(24px,4.5vw,32px)", fontFamily:FONT, marginBottom:6 }}>
            {lang==="zh"?"🗺️ 恐龍地圖大逃脫":"🗺️ Dino Map Escape"}
          </h2>
          <p style={{ color:"#9988BB", fontSize:16, fontFamily:FONT, maxWidth:580, margin:"8px auto 28px", lineHeight:1.7 }}>
            {lang==="zh"
              ?"恐龍們需要找到藏寶地圖的碎片，才能知道哪扇門通往新家！答對題目就能獲得地圖碎片，碎片越多，線索越清楚。先通過 3 題基礎題，再挑戰 6 題進階題！"
              :"The dinos need to find pieces of a treasure map to discover which door leads home! Correct answers earn map pieces — the more you find, the clearer the clues. Pass 3 foundation questions, then face 6 advanced challenges!"}
          </p>
          <p style={{ color:GOLD, fontSize:15, fontFamily:FONT, marginBottom:20 }}>
            {lang==="zh"?"選擇你的恐龍夥伴：":"Choose your dino companion:"}
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(110px, 1fr))", gap:14, maxWidth:600, margin:"0 auto" }}>
            {DINO_NAMES_EN.map((_,i) => (
              <button key={i} onClick={()=> availableDinos.includes(i) && startGame(i)} disabled={!availableDinos.includes(i)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:14, padding:"18px 10px", cursor: availableDinos.includes(i) ? "pointer" : "not-allowed",
                display:"flex", flexDirection:"column", alignItems:"center", gap:8, transition:"all 0.2s",
                opacity: availableDinos.includes(i) ? 1 : 0.25,
              }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(192,57,43,0.2)";e.currentTarget.style.borderColor=CRIMSON;}}
                 onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
                <div style={{ transform:"scale(0.7)", transformOrigin:"center" }}><CuteDino index={i} size={80} color={DINO_COLORS[i]}/></div>
                <span style={{ color:"#CCC", fontSize:13, fontFamily:FONT, fontWeight:600 }}>{lang==="zh"?DINO_NAMES_ZH[i]:DINO_NAMES_EN[i]}</span>
              </button>
            ))}
          </div>
        </div>
      </CorridorBackground>
    );
  }

  // ── GATE ──
  if (phase === "gate") {
    return (
      <CorridorBackground phase="gate">
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🗺️</div>
          <h3 style={{ color:GOLD, fontSize:22, fontFamily:FONT, marginBottom:8 }}>{lang==="zh"?"進階走廊已解鎖！":"Advanced Corridor Unlocked!"}</h3>
          <p style={{ color:"#9988BB", fontSize:14, fontFamily:FONT }}>
            {lang==="zh"?`基礎題通過 (${foundScore}/3)！前方有 6 張更珍貴的地圖碎片等你收集。`:`Foundation passed (${foundScore}/3)! 6 more precious map pieces await.`}
          </p>
          <div style={{ marginTop: 20 }}>
            <TreasureMap pieces={mapPieces} lang={lang} route={route} />
          </div>
        </div>
      </CorridorBackground>
    );
  }

  // ── DOOR CHOICE ──
  if (phase === "choose") {
    return (
      <CorridorBackground phase="choose">
        {/* Show completed map */}
        <div style={{ marginBottom: 16 }}>
          <TreasureMap pieces={mapPieces} lang={lang} route={route} />
        </div>
        {doorChoice ? (
          <div style={{ textAlign: "center", padding: "30px 16px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{doorChoice.correct ? "🎉" : "😢"}</div>
            <h3 style={{ color: doorChoice.correct ? GREEN : CORAL, fontSize: 20, fontFamily: FONT }}>
              {doorChoice.correct
                ? (lang === "zh" ? "找到正確的門了！" : "You found the right door!")
                : (lang === "zh" ? "不是這扇門..." : "Not this door...")}
            </h3>
          </div>
        ) : (
          <DoorChoiceScene pieces={mapPieces} selectedDino={selectedDino} lang={lang} onChoose={handleDoorChoice} route={route} />
        )}
      </CorridorBackground>
    );
  }

  // ── RESULT ──
  if (phase === "result") {
    const foundCount = mapPieces.filter(p => p === "found").length;
    const choseDoorCorrectly = doorChoice?.correct ?? false;
    const tier = foundScore < 2 ? "locked"
      : choseDoorCorrectly && score >= 8 ? "master"
      : choseDoorCorrectly && score >= 6 ? "navigator"
      : choseDoorCorrectly ? "seeker"
      : score >= 6 ? "close"
      : "lost";
    const T = {
      locked:    { zh:{t:"走廊被封鎖 🔒",m:"需要通過至少 2/3 基礎題。再試一次！"}, en:{t:"Corridor Locked 🔒",m:"Need 2/3 foundation to proceed. Try again!"}, c:MUTED },
      master:    { zh:{t:"地圖大師 🗺️✨",m:`完美！收集了 ${foundCount}/9 張碎片並找到正確的門——你已完全掌握異質性與發表偏倚！`}, en:{t:"Map Master 🗺️✨",m:`Perfect! ${foundCount}/9 pieces collected and the right door found — heterogeneity & bias mastered!`}, c:GOLD },
      navigator: { zh:{t:"地圖導航者 🧭",m:`很棒！收集了 ${foundCount}/9 張碎片並成功逃脫——幾乎完美！`}, en:{t:"Map Navigator 🧭",m:`Great job! ${foundCount}/9 pieces and escaped successfully — nearly perfect!`}, c:CRIMSON_LIGHT },
      seeker:    { zh:{t:"碎片探索者 🔍",m:`不錯！收集了 ${foundCount}/9 張碎片並找到了路——繼續練習！`}, en:{t:"Piece Seeker 🔍",m:`Good start! ${foundCount}/9 pieces and found the way — keep practicing!`}, c:CORAL },
      close:     { zh:{t:"差一點！ 🚪",m:`收集了 ${foundCount}/9 張碎片，但選錯了門。線索不夠清楚嗎？再試一次！`}, en:{t:"So Close! 🚪",m:`${foundCount}/9 pieces collected, but wrong door. Not enough clues? Try again!`}, c:BLUE },
      lost:      { zh:{t:"迷路冒險家 🌀",m:`收集了 ${foundCount}/9 張碎片——回顧課程再試！`}, en:{t:"Lost Adventurer 🌀",m:`${foundCount}/9 pieces — review the course and try again!`}, c:"#95A5A6" },
    };
    const info = T[tier];
    return (
      <CorridorBackground phase="result">
        <div style={{ textAlign:"center", padding:"24px 16px" }}>
          {/* Final map display */}
          <div style={{ maxWidth: 320, margin: "0 auto 20px" }}>
            <TreasureMap pieces={mapPieces} lang={lang} route={route} />
          </div>
          <div style={{ marginBottom:16 }}><CuteDino index={selectedDino} size={100} color={DINO_COLORS[selectedDino]}/></div>
          <h2 style={{ color:info.c, fontSize:24, fontFamily:FONT, marginBottom:8 }}>{info[lang].t}</h2>
          <p style={{ color:"#AAB8CC", fontSize:14, fontFamily:FONT, maxWidth:400, margin:"0 auto 24px", lineHeight:1.6 }}>{info[lang].m}</p>
          <button onClick={()=>{setPhase("select");setSelectedDino(null);setDoorChoice(null);}} style={btnPrimary(CRIMSON)}>
            {lang==="zh"?"再玩一次 🔄":"Play Again 🔄"}
          </button>
        </div>
      </CorridorBackground>
    );
  }

  // ── GAMEPLAY ──
  const q = questions[qi];
  if (!q) return null;
  const type = q.type || "mcq";
  const isFound = qi < 3;
  const phaseLabel = isFound?(lang==="zh"?`基礎題 ${qi+1}/3`:`Foundation ${qi+1}/3`):(lang==="zh"?`進階題 ${qi-2}/6`:`Advanced ${qi-2}/6`);

  return (
    <CorridorBackground phase={phase}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ transform:"scale(0.8)", transformOrigin:"left center", marginRight:-16 }}><CuteDino index={selectedDino} size={70} color={DINO_COLORS[selectedDino]}/></div>
          <span style={{ color:"#9988BB", fontSize:14, fontFamily:FONT, fontWeight:600 }}>{phaseLabel}</span>
        </div>
        <span style={{ color:GOLD_DARK, fontSize:13, fontFamily:FONT, fontWeight:600 }}>
          🗺️ {mapPieces.filter(p=>p==="found").length}/9
        </span>
      </div>

      {/* Mini map display */}
      <div style={{ marginBottom: 16 }}>
        <TreasureMap pieces={mapPieces.map((s, i) => i <= qi ? s : "hidden")} lang={lang} compact route={route} />
      </div>

      {/* Question */}
      <div style={{ animation:shake?"deShake 0.4s ease":"none" }}>
        <style>{`@keyframes deShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
        <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
          <TypeBadge type={type} lang={lang}/>
          {isFound && <span style={{ fontSize:12, color:GOLD, background:`${GOLD}22`, padding:"2px 8px", borderRadius:8, fontFamily:FONT }}>
            {lang==="zh"?"通過 ≥2/3 解鎖進階":"Pass ≥2/3 to unlock"}
          </span>}
        </div>
        <h3 style={{ color:"#F0F0F0", fontSize:"clamp(17px,3vw,20px)", fontFamily:FONT, fontWeight:600, lineHeight:1.6, marginBottom:16 }}>
          {q[lang].q}
        </h3>

        {type==="mcq"&&<MCQRenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}
        {type==="true_false"&&<TFRenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}
        {type==="multi_select"&&<MSRenderer key={qi} q={q} lang={lang} onAnswer={handleAnswer} answered={answered}/>}
        {type==="ordering"&&<OrderRenderer key={qi} q={q} lang={lang} onAnswer={handleAnswer} answered={answered}/>}
        {type==="spot_error"&&<SERenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}

        {/* Feedback */}
        {answered && (
          <div style={{ marginTop:16, padding:"14px 16px", borderRadius:10, background:correct?`${GREEN}22`:`${RED}22`, border:`1px solid ${correct?GREEN:RED}44` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:18 }}>{correct?"🗺️":"❌"}</span>
              <span style={{ color:correct?GREEN:CORAL, fontWeight:700, fontSize:16, fontFamily:FONT }}>
                {correct?(lang==="zh"?"正確！獲得地圖碎片！":"Correct! Map piece found!"):(lang==="zh"?"不正確——碎片遺失了":"Wrong — piece stays hidden")}
              </span>
            </div>
            <p style={{ color:"#AAB8CC", fontSize:15, fontFamily:FONT, margin:0, lineHeight:1.6 }}>{q[lang].exp}</p>
            <button onClick={nextQ} style={{ ...btnPrimary(CRIMSON), marginTop:12, fontSize:14, padding:"10px 24px" }}>
              {qi>=questions.length-1?(lang==="zh"?"前往選門 →":"Choose Your Door →"):qi===2?(lang==="zh"?"進入進階走廊 →":"Enter Advanced Corridor →"):(lang==="zh"?"下一題 →":"Next Question →")}
            </button>
          </div>
        )}
      </div>
    </CorridorBackground>
  );
}
