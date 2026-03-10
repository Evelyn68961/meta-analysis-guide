// ═══════════════════════════════════════════════════════════
//  DinoDoorEscape.jsx — "Dino Door Escape" game for Course 5
//
//  The dinos have the key — now find the RIGHT DOOR to their new home!
//  Navigate a mysterious corridor and eliminate wrong doors.
//
//  Mechanics:
//    - Pick 1 of 7 dinos → 9 questions (3 foundation + 6 advanced)
//    - Foundation: 3 MCQ → must pass ≥2/3 to unlock advanced
//    - Advanced: 6 mixed types (true/false, multi-select, ordering, spot-error)
//    - Correct → illuminate a door (reveals it's safe)
//    - Wrong → door slams shut (eliminated)
//    - Final: find the glowing door to your new home
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import CuteDino from "./CuteDino";
import { pickBalanced, pickAdvancedMix } from "./questionHelpers";
import { course5Questions } from "./course5Questions";

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
const DINO_COLORS = ["#2ECC71","#3498DB","#F1C40F","#E74C3C","#9B59B6","#E67E22","#95A5A6"];
const DINO_NAMES_EN = ["Rex","Azure","Zephyr","Blaze","Thistle","Velo","Dome"];
const DINO_NAMES_ZH = ["翠牙龍","蒼瀾龍","金翼龍","焰角龍","紫棘龍","珀爪龍","鐵穹龍"];
const FONT = "'Noto Sans TC','Outfit',sans-serif";

const btnPrimary = (bg) => ({
  background: bg, border: "none", color: "#FFF", padding: "12px 28px",
  borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
  fontFamily: FONT, transition: "all 0.2s",
});

// ═══ DOOR SVG ═══
function DoorIcon({ state = "closed", index = 0 }) {
  // states: closed, open (correct), locked (wrong)
  const doorColors = ["#8B4513","#A0522D","#6B3410","#7B3F00","#9B6330","#5C3317","#804020"];
  const baseColor = doorColors[index % doorColors.length];
  const w = 32, h = 44;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* Door frame */}
      <rect x="2" y="2" width={w-4} height={h-4} rx="3" fill={state==="locked"?"#333":"#5C4033"} stroke={state==="open"?GOLD:"#3A2A1A"} strokeWidth="2"/>
      {/* Door panel */}
      <rect x="5" y="5" width={w-10} height={h-10} rx="2"
        fill={state==="open"?`${GOLD}88`:state==="locked"?"#222":baseColor}
        opacity={state==="locked"?0.4:1}/>
      {/* Doorknob */}
      <circle cx={w-10} cy={h/2} r="2.5" fill={state==="open"?GOLD:state==="locked"?"#555":"#DAA520"}/>
      {/* Open glow */}
      {state==="open" && (
        <rect x="5" y="5" width={w-10} height={h-10} rx="2" fill={GOLD} opacity="0.25">
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="2s" repeatCount="indefinite"/>
        </rect>
      )}
      {/* Locked X */}
      {state==="locked" && (
        <g stroke={RED} strokeWidth="2.5" strokeLinecap="round" opacity="0.8">
          <line x1="10" y1="14" x2={w-10} y2={h-14}/>
          <line x1={w-10} y1="14" x2="10" y2={h-14}/>
        </g>
      )}
    </svg>
  );
}

// ═══ CORRIDOR BACKGROUND ═══
function CorridorBackground({ phase, children }) {
  return (
    <div style={{
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
      <style>{`@keyframes deFlicker{0%{opacity:0.25;transform:scale(0.8)}100%{opacity:0.55;transform:scale(1.15)}}`}</style>
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

// ═══ QUESTION RENDERERS (same logic, different accent) ═══
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
      {data.statements.map((stmt,i)=>{
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

// ═══ MAIN GAME ═══
export default function DinoDoorEscape({ lang: langProp }) {
  const lang = langProp || "en";
  const [phase, setPhase] = useState("select");
  const [selectedDino, setSelectedDino] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [foundScore, setFoundScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [sel, setSel] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [doors, setDoors] = useState(Array(9).fill("closed")); // closed|open|locked
  const [shake, setShake] = useState(false);

  const startGame = useCallback((dinoIdx) => {
    setSelectedDino(dinoIdx);
    const mcqPool = course5Questions.filter(q => !q.type || q.type === "mcq");
    const foundation = pickBalanced(mcqPool, 3);
    const advanced = pickAdvancedMix(course5Questions, 6);
    setQuestions([...foundation, ...advanced]);
    setPhase("foundation"); setQi(0); setScore(0); setFoundScore(0);
    setAnswered(false); setSel(null); setDoors(Array(9).fill("closed"));
  }, []);

  const handleAnswer = useCallback((answer, isCorrect) => {
    if (answered) return;
    setAnswered(true); setSel(answer); setCorrect(isCorrect);
    if (isCorrect) {
      setScore(s => s+1);
      if (qi < 3) setFoundScore(s => s+1);
      setDoors(prev => { const n=[...prev]; n[qi]="open"; return n; });
    } else {
      setDoors(prev => { const n=[...prev]; n[qi]="locked"; return n; });
      setShake(true); setTimeout(() => setShake(false), 500);
    }
  }, [answered, qi]);

  const nextQ = () => {
    const next = qi + 1;
    if (next === 3) {
      if (foundScore >= 2) {
        setPhase("gate");
        setTimeout(() => { setPhase("advanced"); setQi(next); setAnswered(false); setSel(null); }, 2500);
      } else { setPhase("result"); }
      return;
    }
    if (next >= questions.length) { setPhase("result"); return; }
    setQi(next); setAnswered(false); setSel(null);
  };

  // ── SELECT ──
  if (phase === "select") {
    return (
      <CorridorBackground phase="select">
        <div style={{ textAlign:"center", padding:"20px 0" }}>
          <h2 style={{ color:DOOR_GLOW, fontSize:"clamp(22px,4vw,30px)", fontFamily:FONT, marginBottom:4 }}>
            {lang==="zh"?"🚪 恐龍找門大逃脫":"🚪 Dino Door Escape"}
          </h2>
          <p style={{ color:"#9988BB", fontSize:14, fontFamily:FONT, maxWidth:500, margin:"8px auto 24px", lineHeight:1.6 }}>
            {lang==="zh"
              ?"恐龍們拿到了鑰匙，但走廊裡有 9 扇門——只有答對的才能打開！先通過 3 題基礎題，再挑戰 6 題進階題（是非、複選、排序、找錯）。找到通往新家的門！"
              :"The dinos have the key, but the corridor has 9 doors — only correct answers open them! Pass 3 foundation questions, then face 6 advanced challenges (true/false, multi-select, ordering, spot-the-error). Find the door to your new home!"}
          </p>
          <p style={{ color:GOLD, fontSize:13, fontFamily:FONT, marginBottom:20 }}>
            {lang==="zh"?"選擇你的恐龍夥伴：":"Choose your dino companion:"}
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:12 }}>
            {DINO_NAMES_EN.map((_,i) => (
              <button key={i} onClick={()=>startGame(i)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:14, padding:"14px 10px", cursor:"pointer", width:100,
                display:"flex", flexDirection:"column", alignItems:"center", gap:6, transition:"all 0.2s",
              }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(192,57,43,0.2)";e.currentTarget.style.borderColor=CRIMSON;}}
                 onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
                <div style={{ transform:"scale(0.6)", transformOrigin:"center" }}><CuteDino species={i} size={80} color={DINO_COLORS[i]}/></div>
                <span style={{ color:"#CCC", fontSize:11, fontFamily:FONT, fontWeight:600 }}>{lang==="zh"?DINO_NAMES_ZH[i]:DINO_NAMES_EN[i]}</span>
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
          <div style={{ fontSize:48, marginBottom:16 }}>🔓</div>
          <h3 style={{ color:GOLD, fontSize:22, fontFamily:FONT, marginBottom:8 }}>{lang==="zh"?"進階走廊已解鎖！":"Advanced Corridor Unlocked!"}</h3>
          <p style={{ color:"#9988BB", fontSize:14, fontFamily:FONT }}>
            {lang==="zh"?`基礎題通過 (${foundScore}/3)！前方有 6 扇更難的門等著你。`:`Foundation passed (${foundScore}/3)! 6 tougher doors await.`}
          </p>
        </div>
      </CorridorBackground>
    );
  }

  // ── RESULT ──
  if (phase === "result") {
    const openCount = doors.filter(d=>d==="open").length;
    const tier = foundScore<2?"locked":score>=8?"master":score>=6?"navigator":score>=4?"seeker":"lost";
    const T = {
      locked:    { zh:{t:"走廊被封鎖 🔒",m:"需要通過至少 2/3 基礎題。再試一次！"}, en:{t:"Corridor Locked 🔒",m:"Need 2/3 foundation to proceed. Try again!"}, c:MUTED },
      master:    { zh:{t:"門之大師 🚪✨",m:`太強了！打開了 ${openCount}/9 扇門——你已完全掌握異質性與發表偏倚！`}, en:{t:"Door Master 🚪✨",m:`Outstanding! ${openCount}/9 doors open — heterogeneity & bias mastered!`}, c:GOLD },
      navigator: { zh:{t:"走廊導航者 🚪",m:`做得好！打開了 ${openCount}/9 扇門——幾乎找到新家了！`}, en:{t:"Corridor Navigator 🚪",m:`Well done! ${openCount}/9 doors — nearly home!`}, c:CRIMSON_LIGHT },
      seeker:    { zh:{t:"探門學徒 🔍",m:`不錯！打開了 ${openCount}/9 扇門——繼續練習！`}, en:{t:"Door Seeker 🔍",m:`Good start! ${openCount}/9 doors — keep practicing!`}, c:CORAL },
      lost:      { zh:{t:"迷路冒險家 🌀",m:`打開了 ${openCount}/9 扇門——回顧課程再試！`}, en:{t:"Lost Adventurer 🌀",m:`${openCount}/9 doors — review the course and try again!`}, c:"#95A5A6" },
    };
    const info = T[tier];
    return (
      <CorridorBackground phase="result">
        <div style={{ textAlign:"center", padding:"24px 16px" }}>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20, flexWrap:"wrap" }}>
            {doors.map((d,i) => <DoorIcon key={i} state={d} index={i}/>)}
          </div>
          <div style={{ marginBottom:16 }}><CuteDino species={selectedDino} size={100} color={DINO_COLORS[selectedDino]}/></div>
          <h2 style={{ color:info.c, fontSize:24, fontFamily:FONT, marginBottom:8 }}>{info[lang].t}</h2>
          <p style={{ color:"#AAB8CC", fontSize:14, fontFamily:FONT, maxWidth:400, margin:"0 auto 24px", lineHeight:1.6 }}>{info[lang].m}</p>
          <button onClick={()=>{setPhase("select");setSelectedDino(null);}} style={btnPrimary(CRIMSON)}>
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
          <div style={{ transform:"scale(0.4)", transformOrigin:"left center", marginRight:-24 }}><CuteDino species={selectedDino} size={70} color={DINO_COLORS[selectedDino]}/></div>
          <span style={{ color:"#9988BB", fontSize:12, fontFamily:FONT, fontWeight:600 }}>{phaseLabel}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {doors.map((d,i) => <DoorIcon key={i} state={i<=qi?d:"closed"} index={i}/>)}
        </div>
      </div>

      {/* Question */}
      <div style={{ animation:shake?"deShake 0.4s ease":"none" }}>
        <style>{`@keyframes deShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
        <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
          <TypeBadge type={type} lang={lang}/>
          {isFound && <span style={{ fontSize:10, color:GOLD, background:`${GOLD}22`, padding:"2px 8px", borderRadius:8, fontFamily:FONT }}>
            {lang==="zh"?"通過 ≥2/3 解鎖進階":"Pass ≥2/3 to unlock"}
          </span>}
        </div>
        <h3 style={{ color:"#F0F0F0", fontSize:"clamp(15px,3vw,18px)", fontFamily:FONT, fontWeight:600, lineHeight:1.6, marginBottom:16 }}>
          {q[lang].q}
        </h3>

        {type==="mcq"&&<MCQRenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}
        {type==="true_false"&&<TFRenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}
        {type==="multi_select"&&<MSRenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered}/>}
        {type==="ordering"&&<OrderRenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered}/>}
        {type==="spot_error"&&<SERenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}

        {/* Feedback */}
        {answered && (
          <div style={{ marginTop:16, padding:"14px 16px", borderRadius:10, background:correct?`${GREEN}22`:`${RED}22`, border:`1px solid ${correct?GREEN:RED}44` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:18 }}>{correct?"🚪":"🔒"}</span>
              <span style={{ color:correct?GREEN:CORAL, fontWeight:700, fontSize:14, fontFamily:FONT }}>
                {correct?(lang==="zh"?"正確！門已打開！":"Correct! Door opened!"):(lang==="zh"?"不正確——門被鎖住了":"Wrong — door locked")}
              </span>
            </div>
            <p style={{ color:"#AAB8CC", fontSize:13, fontFamily:FONT, margin:0, lineHeight:1.6 }}>{q[lang].exp}</p>
            <button onClick={nextQ} style={{ ...btnPrimary(CRIMSON), marginTop:12, fontSize:13, padding:"10px 24px" }}>
              {qi>=questions.length-1?(lang==="zh"?"查看結果":"See Results"):qi===2?(lang==="zh"?"進入進階走廊 →":"Enter Advanced Corridor →"):(lang==="zh"?"下一扇門 →":"Next Door →")}
            </button>
          </div>
        )}
      </div>
    </CorridorBackground>
  );
}
