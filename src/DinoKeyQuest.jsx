// ═══════════════════════════════════════════════════════════
//  DinoKeyQuest.jsx — "Dino Key Quest" game for Course 4
//
//  The dinos need to find the KEY to their new home!
//  Explore a crystal cave and collect key fragments.
//
//  Mechanics:
//    - Pick 1 of 7 dinos → 9 questions (3 foundation + 6 advanced)
//    - Foundation: 3 MCQ → must pass ≥2/3 to unlock advanced
//    - Advanced: 6 mixed types (true/false, multi-select, ordering, spot-error)
//    - Each correct → earn a glowing key fragment
//    - Tiered final score within progressive structure
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import CuteDino from "./CuteDino";
import { pickBalanced, pickAdvancedMix } from "./questionHelpers";
import { course4Questions } from "./course4Questions";

// ═══ DESIGN TOKENS ═══
const BLUE = "#2E86C1";
const BLUE_LIGHT = "#3498DB";
const DARK = "#1D2B3A";
const MUTED = "#6B7A8D";
const CARD_BG = "#FFFFFF";
const GOLD = "#F4D03F";
const CORAL = "#E8734A";
const GREEN = "#27AE60";
const RED = "#C0392B";
const CAVE_BG = "#1B1F3B";
const CAVE_FLOOR = "#2C3054";
const CRYSTAL_GLOW = "#7FB3D8";
const DINO_COLORS = ["#2ECC71","#3498DB","#F1C40F","#E74C3C","#9B59B6","#E67E22","#95A5A6"];
const DINO_NAMES_EN = ["Rex","Azure","Zephyr","Blaze","Thistle","Velo","Dome"];
const DINO_NAMES_ZH = ["翠牙龍","蒼瀾龍","金翼龍","焰角龍","紫棘龍","珀爪龍","鐵穹龍"];
const FONT = "'Noto Sans TC','Outfit',sans-serif";

const btnPrimary = (bg) => ({
  background: bg, border: "none", color: "#FFF", padding: "12px 28px",
  borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
  fontFamily: FONT, transition: "all 0.2s",
});

// ═══ KEY FRAGMENT SVG ═══
function KeyFragment({ filled, index }) {
  const isHandle = index < 3;
  const hue = isHandle ? 45 : 200 + (index - 3) * 15;
  const color = filled ? `hsl(${hue},70%,60%)` : "#3A3F5C";
  const glow = filled ? `hsl(${hue},80%,75%)` : "transparent";
  return (
    <svg width="26" height="26" viewBox="0 0 28 28">
      {filled && <circle cx="14" cy="14" r="12" fill={glow} opacity="0.3"><animate attributeName="r" values="10;13;10" dur="2s" repeatCount="indefinite"/></circle>}
      {isHandle
        ? <circle cx="14" cy="14" r="9" fill={color} stroke={filled ? glow : "#4A4F6C"} strokeWidth="2"/>
        : <polygon points="14,3 24,10 24,20 14,27 4,20 4,10" fill={color} stroke={filled ? glow : "#4A4F6C"} strokeWidth="1.5"/>}
      {filled && <text x="14" y="18" textAnchor="middle" fontSize="12" fill="#FFF" fontWeight="bold">✦</text>}
    </svg>
  );
}

// ═══ CAVE BACKGROUND ═══
function CaveBackground({ phase, children }) {
  return (
    <div style={{
      background: `linear-gradient(180deg,${CAVE_BG} 0%,${CAVE_FLOOR} 60%,#1E2245 100%)`,
      borderRadius: 16, padding: "32px clamp(20px,4vw,48px)", position: "relative", overflow: "hidden", minHeight: 480,
    }}>
      {[...Array(12)].map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: `${8+(i*7.5)%85}%`, top: `${5+(i*13)%70}%`,
          width: 3, height: 3, borderRadius: "50%",
          background: [CRYSTAL_GLOW, GOLD, "#B39DDB"][i % 3],
          opacity: 0.3 + (i%3)*0.2,
          animation: `kqSparkle ${1.5+i*0.3}s ease-in-out infinite alternate`,
        }}/>
      ))}
      {phase === "advanced" && <div style={{
        position: "absolute", inset: 0, borderRadius: 16,
        background: "radial-gradient(ellipse at 50% 80%,rgba(244,208,63,0.12) 0%,transparent 70%)",
        pointerEvents: "none",
      }}/>}
      <style>{`@keyframes kqSparkle{0%{opacity:0.2;transform:scale(0.8)}100%{opacity:0.7;transform:scale(1.2)}}`}</style>
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

// ═══ TYPE BADGE ═══
function TypeBadge({ type, lang }) {
  const L = {
    mcq:         { zh:"選擇題", en:"Multiple Choice", c: BLUE },
    true_false:  { zh:"是非題", en:"True / False",    c: "#8E44AD" },
    multi_select:{ zh:"複選題", en:"Select ALL",      c: CORAL },
    ordering:    { zh:"排序題", en:"Ordering",         c: GREEN },
    spot_error:  { zh:"找錯題", en:"Spot the Error",   c: RED },
  };
  const info = L[type] || L.mcq;
  return (
    <span style={{
      display:"inline-block", padding:"3px 10px", borderRadius:20, fontSize:11,
      fontWeight:700, letterSpacing:1, background:`${info.c}22`, color:info.c,
      border:`1px solid ${info.c}44`, textTransform:"uppercase", fontFamily:FONT,
    }}>{lang==="zh" ? info.zh : info.en}</span>
  );
}

// ═══ MCQ RENDERER ═══
function MCQRenderer({ q, lang, onAnswer, answered, sel }) {
  const data = q[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      {data.opts.map((opt, i) => {
        let bg = "rgba(255,255,255,0.08)", border = "1px solid rgba(255,255,255,0.15)";
        if (answered) {
          if (i === q.correct) { bg=`${GREEN}33`; border=`2px solid ${GREEN}`; }
          else if (sel === i) { bg=`${RED}33`; border=`2px solid ${RED}`; }
        } else if (sel === i) { bg="rgba(46,134,193,0.25)"; border=`2px solid ${BLUE_LIGHT}`; }
        return (
          <button key={i} disabled={answered} onClick={() => onAnswer(i, i === q.correct)} style={{
            background:bg, border, color:"#E0E0E0", borderRadius:10, padding:"12px 16px",
            fontSize:15, fontFamily:FONT, cursor:answered?"default":"pointer",
            textAlign:"left", transition:"all 0.2s", lineHeight:1.5,
          }}>
            <span style={{ fontWeight:600, marginRight:8, opacity:0.6 }}>{String.fromCharCode(65+i)}</span>{opt}
          </button>
        );
      })}
    </div>
  );
}

// ═══ TRUE/FALSE RENDERER ═══
function TFRenderer({ q, lang, onAnswer, answered, sel }) {
  const opts = lang==="zh" ? ["正確 ✓","錯誤 ✗"] : ["True ✓","False ✗"];
  const correctIdx = q.correct === true ? 0 : 1;
  return (
    <div style={{ display:"flex", gap:12, justifyContent:"center", marginTop:8 }}>
      {opts.map((opt,i) => {
        let bg = "rgba(255,255,255,0.08)", border = "1px solid rgba(255,255,255,0.15)";
        if (answered) {
          if (i===correctIdx) { bg=`${GREEN}33`; border=`2px solid ${GREEN}`; }
          else if (sel===i) { bg=`${RED}33`; border=`2px solid ${RED}`; }
        } else if (sel===i) { bg=`${BLUE}33`; border=`2px solid ${BLUE_LIGHT}`; }
        return (
          <button key={i} disabled={answered} onClick={() => onAnswer(i, i===correctIdx)} style={{
            background:bg, border, color:"#FFF", borderRadius:12, padding:"16px 36px",
            fontSize:17, fontWeight:700, fontFamily:FONT, cursor:answered?"default":"pointer",
            transition:"all 0.2s", minWidth:120,
          }}>{opt}</button>
        );
      })}
    </div>
  );
}

// ═══ MULTI-SELECT RENDERER ═══
function MSRenderer({ q, lang, onAnswer, answered }) {
  const [selected, setSelected] = useState([]);
  const data = q[lang];
  const correctSet = new Set(q.correctAll);
  const toggle = (i) => { if (!answered) setSelected(p => p.includes(i) ? p.filter(x=>x!==i) : [...p,i]); };
  const submit = () => {
    const ok = selected.length===q.correctAll.length && selected.every(i=>correctSet.has(i));
    onAnswer(selected, ok);
  };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontSize:13, color:CRYSTAL_GLOW, margin:0, fontFamily:FONT }}>
        {lang==="zh" ? `💡 選出所有正確答案（共 ${q.correctAll.length} 個）` : `💡 Select ALL correct answers (${q.correctAll.length} total)`}
      </p>
      {data.opts.map((opt,i) => {
        const isSel = selected.includes(i);
        let bg = isSel ? "rgba(46,134,193,0.25)" : "rgba(255,255,255,0.08)";
        let border = isSel ? `2px solid ${BLUE_LIGHT}` : "1px solid rgba(255,255,255,0.15)";
        if (answered) {
          if (correctSet.has(i)) { bg=`${GREEN}33`; border=`2px solid ${GREEN}`; }
          else if (isSel) { bg=`${RED}33`; border=`2px solid ${RED}`; }
        }
        return (
          <button key={i} disabled={answered} onClick={()=>toggle(i)} style={{
            background:bg, border, color:"#E0E0E0", borderRadius:10, padding:"11px 16px",
            fontSize:15, fontFamily:FONT, cursor:answered?"default":"pointer",
            textAlign:"left", transition:"all 0.2s", lineHeight:1.5,
            display:"flex", alignItems:"center", gap:10,
          }}>
            <span style={{
              width:20, height:20, borderRadius:4, flexShrink:0,
              border:`2px solid ${isSel?BLUE_LIGHT:"rgba(255,255,255,0.3)"}`,
              background:isSel?BLUE:"transparent", display:"flex", alignItems:"center",
              justifyContent:"center", fontSize:12, color:"#FFF",
            }}>{isSel?"✓":""}</span>
            {opt}
          </button>
        );
      })}
      {!answered && (
        <button onClick={submit} disabled={selected.length===0}
          style={{ ...btnPrimary(selected.length>0?BLUE:MUTED), marginTop:4, alignSelf:"center", opacity:selected.length>0?1:0.5 }}>
          {lang==="zh"?"確認答案":"Confirm"}
        </button>
      )}
    </div>
  );
}

// ═══ ORDERING RENDERER ═══
function OrderRenderer({ q, lang, onAnswer, answered }) {
  const data = q[lang];
  const [order, setOrder] = useState(() => {
    const idx = data.items.map((_,i)=>i);
    for (let i=idx.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [idx[i],idx[j]]=[idx[j],idx[i]]; }
    return idx;
  });
  const move = (from, to) => { if (answered) return; const n=[...order]; const [m]=n.splice(from,1); n.splice(to,0,m); setOrder(n); };
  const submit = () => { onAnswer(order, order.every((v,i)=>v===q.correctOrder[i])); };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      <p style={{ fontSize:13, color:CRYSTAL_GLOW, margin:0, fontFamily:FONT }}>
        {lang==="zh"?"🔄 使用箭頭調整順序":"🔄 Use arrows to reorder"}
      </p>
      {order.map((itemIdx,pos) => {
        let bg="rgba(255,255,255,0.08)", border="1px solid rgba(255,255,255,0.15)";
        if (answered) {
          if (q.correctOrder.indexOf(itemIdx)===pos) { bg=`${GREEN}33`; border=`2px solid ${GREEN}`; }
          else { bg=`${RED}22`; border=`2px solid ${RED}66`; }
        }
        return (
          <div key={itemIdx} style={{ background:bg, border, borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", gap:10, transition:"all 0.2s" }}>
            <span style={{
              width:24, height:24, borderRadius:"50%", flexShrink:0,
              background:answered?(q.correctOrder.indexOf(itemIdx)===pos?GREEN:RED):BLUE,
              color:"#FFF", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center",
            }}>{pos+1}</span>
            <span style={{ flex:1, color:"#E0E0E0", fontSize:15, fontFamily:FONT, lineHeight:1.5 }}>{data.items[itemIdx]}</span>
            {!answered && (
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                <button onClick={()=>pos>0&&move(pos,pos-1)} disabled={pos===0}
                  style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:4, color:pos===0?"#555":"#CCC", cursor:pos===0?"default":"pointer", padding:"2px 6px", fontSize:10 }}>▲</button>
                <button onClick={()=>pos<order.length-1&&move(pos,pos+1)} disabled={pos===order.length-1}
                  style={{ background:"rgba(255,255,255,0.1)", border:"none", borderRadius:4, color:pos===order.length-1?"#555":"#CCC", cursor:pos===order.length-1?"default":"pointer", padding:"2px 6px", fontSize:10 }}>▼</button>
              </div>
            )}
          </div>
        );
      })}
      {!answered && <button onClick={submit} style={{ ...btnPrimary(BLUE), marginTop:4, alignSelf:"center" }}>{lang==="zh"?"確認順序":"Confirm Order"}</button>}
    </div>
  );
}

// ═══ SPOT ERROR RENDERER ═══
function SERenderer({ q, lang, onAnswer, answered, sel }) {
  const data = q[lang];
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <p style={{ fontSize:13, color:CRYSTAL_GLOW, margin:0, fontFamily:FONT }}>
        {lang==="zh"?"🔍 點擊你認為有錯的敘述":"🔍 Click the statement containing an error"}
      </p>
      {data.statements.map((stmt,i) => {
        let bg="rgba(255,255,255,0.08)", border="1px solid rgba(255,255,255,0.15)";
        if (answered) {
          if (i===q.correct) { bg=`${RED}33`; border=`2px solid ${RED}`; }
          else if (sel===i) { bg=`${CORAL}22`; border=`2px solid ${CORAL}66`; }
          else { bg=`${GREEN}15`; border=`1px solid ${GREEN}44`; }
        }
        return (
          <button key={i} disabled={answered} onClick={()=>onAnswer(i, i===q.correct)} style={{
            background:bg, border, color:"#E0E0E0", borderRadius:10, padding:"11px 16px",
            fontSize:15, fontFamily:FONT, cursor:answered?"default":"pointer",
            textAlign:"left", transition:"all 0.2s", lineHeight:1.5,
            display:"flex", alignItems:"flex-start", gap:10,
          }}>
            <span style={{ fontWeight:700, color:answered&&i===q.correct?RED:MUTED, fontSize:13, flexShrink:0, marginTop:1 }}>
              {answered?(i===q.correct?"✗":"✓"):`${i+1}.`}
            </span>
            {stmt}
          </button>
        );
      })}
      {q.correct===-1 && !answered && (
        <button onClick={()=>onAnswer(-1,true)} style={{ ...btnPrimary("rgba(255,255,255,0.15)"), fontSize:13, padding:"10px 20px" }}>
          {lang==="zh"?"全部正確（無錯誤）":"All correct (no error)"}
        </button>
      )}
    </div>
  );
}

// ═══ MAIN GAME ═══
export default function DinoKeyQuest({ lang: langProp }) {
  const lang = langProp || "en";
  const [phase, setPhase] = useState("select"); // select|foundation|gate|advanced|result
  const [selectedDino, setSelectedDino] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [foundScore, setFoundScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [sel, setSel] = useState(null);
  const [correct, setCorrect] = useState(false);
  const [fragments, setFragments] = useState(Array(9).fill(false));
  const [shake, setShake] = useState(false);

  const startGame = useCallback((dinoIdx) => {
    setSelectedDino(dinoIdx);
    const mcqPool = course4Questions.filter(q => !q.type || q.type === "mcq");
    const foundation = pickBalanced(mcqPool, 3);
    const advanced = pickAdvancedMix(course4Questions, 6);
    setQuestions([...foundation, ...advanced]);
    setPhase("foundation"); setQi(0); setScore(0); setFoundScore(0);
    setAnswered(false); setSel(null); setFragments(Array(9).fill(false));
  }, []);

  const handleAnswer = useCallback((answer, isCorrect) => {
    if (answered) return;
    setAnswered(true); setSel(answer); setCorrect(isCorrect);
    if (isCorrect) {
      setScore(s => s+1);
      if (qi < 3) setFoundScore(s => s+1);
      setFragments(prev => { const n=[...prev]; n[qi]=true; return n; });
    } else {
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

  // ── SELECT SCREEN ──
  if (phase === "select") {
    return (
      <CaveBackground phase="select">
        <div style={{ textAlign:"center", padding:"28px 0" }}>
          <h2 style={{ color:CRYSTAL_GLOW, fontSize:"clamp(24px,4.5vw,32px)", fontFamily:FONT, marginBottom:6 }}>
            {lang==="zh"?"🔑 恐龍鑰匙探索":"🔑 Dino Key Quest"}
          </h2>
          <p style={{ color:"#8899BB", fontSize:16, fontFamily:FONT, maxWidth:580, margin:"8px auto 28px", lineHeight:1.7 }}>
            {lang==="zh"
              ?"恐龍們需要找到通往新家的鑰匙！在水晶洞穴中收集鑰匙碎片。先通過 3 題基礎題解鎖進階關卡，再挑戰 6 題不同類型的進階問題（是非、複選、排序、找錯）。"
              :"The dinos need the KEY to their new home! Collect key fragments in the crystal cave. Pass 3 foundation questions to unlock 6 advanced mixed-type challenges (true/false, multi-select, ordering, spot-the-error)."}
          </p>
          <p style={{ color:GOLD, fontSize:15, fontFamily:FONT, marginBottom:20 }}>
            {lang==="zh"?"選擇你的恐龍夥伴：":"Choose your dino companion:"}
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(110px, 1fr))", gap:14, maxWidth:600, margin:"0 auto" }}>
            {DINO_NAMES_EN.map((_,i) => (
              <button key={i} onClick={()=>startGame(i)} style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:14, padding:"18px 10px", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:8, transition:"all 0.2s",
              }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(46,134,193,0.2)";e.currentTarget.style.borderColor=BLUE;}}
                 onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.06)";e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";}}>
                <div style={{ transform:"scale(0.7)", transformOrigin:"center" }}><CuteDino index={i} size={80} color={DINO_COLORS[i]}/></div>
                <span style={{ color:"#CCC", fontSize:13, fontFamily:FONT, fontWeight:600 }}>{lang==="zh"?DINO_NAMES_ZH[i]:DINO_NAMES_EN[i]}</span>
              </button>
            ))}
          </div>
        </div>
      </CaveBackground>
    );
  }

  // ── GATE TRANSITION ──
  if (phase === "gate") {
    return (
      <CaveBackground phase="gate">
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔓</div>
          <h3 style={{ color:GOLD, fontSize:22, fontFamily:FONT, marginBottom:8 }}>{lang==="zh"?"進階關卡已解鎖！":"Advanced Phase Unlocked!"}</h3>
          <p style={{ color:"#8899BB", fontSize:14, fontFamily:FONT }}>
            {lang==="zh"?`基礎題通過 (${foundScore}/3)！接下來是 6 題進階挑戰。`:`Foundation passed (${foundScore}/3)! Now face 6 advanced challenges.`}
          </p>
        </div>
      </CaveBackground>
    );
  }

  // ── RESULT SCREEN ──
  if (phase === "result") {
    const tier = foundScore < 2 ? "locked" : score >= 8 ? "master" : score >= 6 ? "explorer" : score >= 4 ? "apprentice" : "novice";
    const T = {
      locked:     { zh:{t:"基礎不足 🔒",m:"需要通過至少 2/3 基礎題才能解鎖進階。再試一次！"}, en:{t:"Foundation Locked 🔒",m:"Need at least 2/3 foundation to unlock. Try again!"}, c:MUTED },
      master:     { zh:{t:"鑰匙大師 🔑✨",m:`太強了！${score}/9 正確——完全掌握效應量與森林圖！`}, en:{t:"Key Master 🔑✨",m:`Outstanding! ${score}/9 — you've mastered effect sizes & forest plots!`}, c:GOLD },
      explorer:   { zh:{t:"洞穴探索者 🔑",m:`做得好！${score}/9 正確——鑰匙幾乎完整了！`}, en:{t:"Cave Explorer 🔑",m:`Well done! ${score}/9 — your key is nearly complete!`}, c:BLUE_LIGHT },
      apprentice: { zh:{t:"探索學徒 🗝️",m:`不錯！${score}/9 正確——繼續學習，鑰匙會更亮。`}, en:{t:"Apprentice 🗝️",m:`Good start! ${score}/9 — keep learning for a brighter key.`}, c:CORAL },
      novice:     { zh:{t:"新手冒險家 🔍",m:`${score}/9 正確——回顧課程再試！`}, en:{t:"Novice 🔍",m:`${score}/9 — review the course and try again!`}, c:"#95A5A6" },
    };
    const info = T[tier];
    return (
      <CaveBackground phase="result">
        <div style={{ textAlign:"center", padding:"24px 16px" }}>
          <div style={{ display:"flex", justifyContent:"center", gap:6, marginBottom:20 }}>
            {fragments.map((f,i) => <KeyFragment key={i} filled={f} index={i}/>)}
          </div>
          <div style={{ marginBottom:16 }}><CuteDino index={selectedDino} size={100} color={DINO_COLORS[selectedDino]}/></div>
          <h2 style={{ color:info.c, fontSize:24, fontFamily:FONT, marginBottom:8 }}>{info[lang].t}</h2>
          <p style={{ color:"#AAB8CC", fontSize:14, fontFamily:FONT, maxWidth:400, margin:"0 auto 24px", lineHeight:1.6 }}>{info[lang].m}</p>
          <button onClick={()=>{setPhase("select");setSelectedDino(null);}} style={btnPrimary(BLUE)}>
            {lang==="zh"?"再玩一次 🔄":"Play Again 🔄"}
          </button>
        </div>
      </CaveBackground>
    );
  }

  // ── GAMEPLAY ──
  const q = questions[qi];
  if (!q) return null;
  const type = q.type || "mcq";
  const isFound = qi < 3;
  const phaseLabel = isFound ? (lang==="zh"?`基礎題 ${qi+1}/3`:`Foundation ${qi+1}/3`) : (lang==="zh"?`進階題 ${qi-2}/6`:`Advanced ${qi-2}/6`);

  return (
    <CaveBackground phase={phase}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ transform:"scale(0.8)", transformOrigin:"left center", marginRight:-16 }}><CuteDino index={selectedDino} size={70} color={DINO_COLORS[selectedDino]}/></div>
          <span style={{ color:"#8899BB", fontSize:14, fontFamily:FONT, fontWeight:600 }}>{phaseLabel}</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4 }}>
          {fragments.map((f,i) => <KeyFragment key={i} filled={f} index={i}/>)}
        </div>
      </div>

      {/* Question */}
      <div style={{ animation:shake?"kqShake 0.4s ease":"none" }}>
        <style>{`@keyframes kqShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}`}</style>
        <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
          <TypeBadge type={type} lang={lang}/>
          {isFound && <span style={{ fontSize:12, color:GOLD, background:`${GOLD}22`, padding:"2px 8px", borderRadius:8, fontFamily:FONT }}>
            {lang==="zh"?"通過 ≥2/3 解鎖進階":"Pass ≥2/3 to unlock"}
          </span>}
        </div>
        <h3 style={{ color:"#F0F0F0", fontSize:"clamp(17px,3vw,20px)", fontFamily:FONT, fontWeight:600, lineHeight:1.6, marginBottom:16 }}>
          {q[lang].q}
        </h3>

        {type==="mcq" && <MCQRenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}
        {type==="true_false" && <TFRenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}
        {type==="multi_select" && <MSRenderer key={qi} q={q} lang={lang} onAnswer={handleAnswer} answered={answered}/>}
        {type==="ordering" && <OrderRenderer key={qi} q={q} lang={lang} onAnswer={handleAnswer} answered={answered}/>}
        {type==="spot_error" && <SERenderer q={q} lang={lang} onAnswer={handleAnswer} answered={answered} sel={sel}/>}

        {/* Feedback */}
        {answered && (
          <div style={{ marginTop:16, padding:"14px 16px", borderRadius:10, background:correct?`${GREEN}22`:`${RED}22`, border:`1px solid ${correct?GREEN:RED}44` }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
              <span style={{ fontSize:18 }}>{correct?"✨":"💫"}</span>
              <span style={{ color:correct?GREEN:CORAL, fontWeight:700, fontSize:16, fontFamily:FONT }}>
                {correct?(lang==="zh"?"正確！獲得鑰匙碎片！":"Correct! Key fragment earned!"):(lang==="zh"?"不正確":"Not quite")}
              </span>
            </div>
            <p style={{ color:"#AAB8CC", fontSize:15, fontFamily:FONT, margin:0, lineHeight:1.6 }}>{q[lang].exp}</p>
            <button onClick={nextQ} style={{ ...btnPrimary(BLUE), marginTop:12, fontSize:14, padding:"10px 24px" }}>
              {qi>=questions.length-1?(lang==="zh"?"查看結果":"See Results"):qi===2?(lang==="zh"?"進入進階關卡 →":"Enter Advanced →"):(lang==="zh"?"下一題 →":"Next →")}
            </button>
          </div>
        )}
      </div>
    </CaveBackground>
  );
}
