import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";

// ═══ DESIGN TOKENS (matching existing site) ═══
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const DINO_COLORS = ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6", "#E67E22", "#95A5A6"];

// ═══ REUSABLE COMPONENTS ═══
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>
      {children}
    </div>
  );
}

function SectionLabel({ text }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
      <div style={{ width: 24, height: 2, background: TEAL, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: TEAL }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 640, ...style }}>{children}</p>;
}

const btnPrimary = { background: TEAL, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };

// ═══ SVG DRAGON EGG ═══
function DragonEgg({ color = "#3498DB", size = 80, state = "idle", delay = 0 }) {
  const w = Math.round(size * 0.77);
  const h = size;
  const id = `degg-${Math.random().toString(36).slice(2, 8)}`;
  const lighten = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt].map(v => Math.min(255, Math.round(v)).toString(16).padStart(2, "0")).join(""); };
  const darken = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r * (1 - amt), g * (1 - amt), b * (1 - amt)].map(v => Math.max(0, Math.round(v)).toString(16).padStart(2, "0")).join(""); };

  const animStyle = state === "idle" ? { animation: `eggFloat 3s ease-in-out ${delay}s infinite` } : state === "crack" ? { animation: "eggShake 0.5s ease-in-out" } : state === "frozen" ? { filter: "saturate(0.15) brightness(1.35)", animation: "eggFreeze 0.8s ease-out forwards" } : {};

  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: w + 16, height: h + 16, position: "relative", ...animStyle }}>
      <svg width={w} height={h} viewBox="0 0 62 80" fill="none">
        <defs>
          <radialGradient id={`${id}-bg`} cx="38%" cy="30%" r="65%"><stop offset="0%" stopColor={lighten(color, 0.3)} /><stop offset="60%" stopColor={color} /><stop offset="100%" stopColor={darken(color, 0.2)} /></radialGradient>
          <radialGradient id={`${id}-hi`} cx="35%" cy="25%" r="35%"><stop offset="0%" stopColor="white" stopOpacity="0.5" /><stop offset="100%" stopColor="white" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="31" cy="76" rx="18" ry="3" fill={darken(color, 0.3)} opacity="0.15" />
        <ellipse cx="31" cy="43" rx="27" ry="35" fill={`url(#${id}-bg)`} />
        <path d="M10 38 Q18 33 24 37 Q31 42 38 36 Q45 30 52 36" stroke={lighten(color, 0.4)} strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M10 46 Q18 51 24 47 Q31 42 38 48 Q45 54 52 48" stroke={lighten(color, 0.4)} strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M14 42 Q22 38 31 42 Q40 38 48 42" stroke={lighten(color, 0.35)} strokeWidth="1.5" fill="none" opacity="0.3" />
        <ellipse cx="20" cy="36" rx="3" ry="4" fill={lighten(color, 0.6)} opacity="0.5" transform="rotate(-10 20 36)" />
        <ellipse cx="42" cy="36" rx="3" ry="4" fill={lighten(color, 0.6)} opacity="0.5" transform="rotate(10 42 36)" />
        <circle cx="31" cy="30" r="3" fill={lighten(color, 0.7)} opacity="0.4" />
        <ellipse cx="22" cy="28" rx="10" ry="14" fill={`url(#${id}-hi)`} transform="rotate(-12 22 28)" />
        <circle cx="20" cy="22" r="1.5" fill="white" opacity="0.7" />
        <circle cx="17" cy="26" r="0.8" fill="white" opacity="0.4" />
        {state === "frozen" && (<><ellipse cx="31" cy="43" rx="27" ry="35" fill="none" stroke="#B8E4F0" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 3" /><path d="M18 25 L22 30 L18 35" stroke="#9ED8EA" strokeWidth="1.5" fill="none" opacity="0.5" /><path d="M44 25 L40 30 L44 35" stroke="#9ED8EA" strokeWidth="1.5" fill="none" opacity="0.5" /><text x="31" y="47" textAnchor="middle" fontSize="20" fill="#9ED8EA" opacity="0.7">❄</text></>)}
        {state === "crack" && (<><path d="M24 28 L28 36 L22 42 L28 48" stroke={darken(color, 0.3)} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M38 30 L35 37 L40 43" stroke={darken(color, 0.3)} strokeWidth="1.5" fill="none" strokeLinecap="round" /></>)}
      </svg>
    </div>
  );
}

// ═══ SVG CUTE DINOSAUR ═══
function CuteDino({ color = "#E8734A", size = 100, name = "", delay = 0 }) {
  const lighten = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt].map(v => Math.min(255, Math.round(v)).toString(16).padStart(2, "0")).join(""); };
  const darken = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r * (1 - amt), g * (1 - amt), b * (1 - amt)].map(v => Math.max(0, Math.round(v)).toString(16).padStart(2, "0")).join(""); };
  const id = `dino-${Math.random().toString(36).slice(2, 8)}`;
  const belly = lighten(color, 0.55);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", animation: `dinoAppear 0.8s ease-out ${delay}s both` }}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <defs><radialGradient id={`${id}-b`} cx="45%" cy="40%" r="55%"><stop offset="0%" stopColor={lighten(color, 0.15)} /><stop offset="100%" stopColor={darken(color, 0.1)} /></radialGradient></defs>
        {/* Tail */}
        <path d="M30 75 Q15 80 10 70 Q5 60 15 55" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Back spikes */}
        <path d="M48 35 L52 22 L56 35" fill={darken(color, 0.15)} />
        <path d="M56 32 L60 20 L64 32" fill={darken(color, 0.15)} />
        <path d="M64 35 L67 24 L70 35" fill={darken(color, 0.15)} />
        {/* Body */}
        <ellipse cx="60" cy="65" rx="28" ry="30" fill={`url(#${id}-b)`} />
        {/* Belly */}
        <ellipse cx="62" cy="72" rx="16" ry="18" fill={belly} />
        {/* Head */}
        <circle cx="78" cy="42" r="20" fill={color} />
        {/* Cheek blush */}
        <circle cx="88" cy="50" r="5" fill={lighten(color, 0.4)} opacity="0.6" />
        {/* Eye */}
        <circle cx="82" cy="38" r="6" fill="white" />
        <circle cx="83" cy="37" r="3.5" fill={DARK} />
        <circle cx="84.5" cy="35.5" r="1.5" fill="white" />
        {/* Horn */}
        <path d="M76 24 L78 16 L82 24" fill={darken(color, 0.2)} />
        {/* Smile */}
        <path d="M82 48 Q86 52 90 48" stroke={darken(color, 0.3)} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Arms */}
        <path d="M42 58 Q34 55 32 60 Q30 65 36 66" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M78 58 Q86 54 90 58 Q94 62 88 65" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Legs */}
        <ellipse cx="48" cy="92" rx="9" ry="6" fill={darken(color, 0.1)} />
        <ellipse cx="72" cy="92" rx="9" ry="6" fill={darken(color, 0.1)} />
        {/* Toes */}
        <circle cx="42" cy="95" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="48" cy="96" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="54" cy="95" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="66" cy="95" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="72" cy="96" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="78" cy="95" r="2.5" fill={darken(color, 0.15)} />
      </svg>
      {name && <span style={{ fontSize: 12, fontWeight: 600, color, marginTop: 4, letterSpacing: 0.5 }}>{name}</span>}
    </div>
  );
}

// ═══ PICO CARD ═══
function PicoCard({ letter, color, title, desc, example, tip, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ background: CARD_BG, border: `1.5px solid ${hovered ? color + "55" : LIGHT_BORDER}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.3s", boxShadow: hovered ? `0 8px 28px ${color}15` : "none", transform: hovered ? "translateY(-3px)" : "translateY(0)", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color, flexShrink: 0 }}>{letter}</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{title}</h3>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: MUTED, marginBottom: 14 }}>{desc}</p>
        <div style={{ background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color, fontWeight: 600 }}>{example}</span>
        </div>
        <p style={{ fontSize: 12.5, color: `${MUTED}BB`, fontStyle: "italic", lineHeight: 1.6 }}>💡 {tip}</p>
      </div>
    </FadeIn>
  );
}

// ═══ TRAP CARD ═══
function TrapCard({ number, title, bad, good, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "22px 20px", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${CORAL}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: CORAL, flexShrink: 0 }}>{number}</div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{title}</h4>
        </div>
        <div style={{ background: "#FDF2F0", borderRadius: 8, padding: "8px 12px", marginBottom: 8, fontSize: 13, color: "#B83A20", lineHeight: 1.6 }}>✗ {bad}</div>
        <div style={{ background: "#E6F5F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#2A7A5A", lineHeight: 1.6 }}>✓ {good}</div>
      </div>
    </FadeIn>
  );
}

// ═══ DRAGON EGG HATCHING GAME ═══
function DragonEggGame({ t }) {
  const [phase, setPhase] = useState("welcome");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]);
  const [eggState, setEggState] = useState("idle");

  const questions = [
    { q: t("c1q1"), opts: [t("c1q1a"), t("c1q1b"), t("c1q1c"), t("c1q1d")], correct: t("c1q1correct"), exp: t("c1q1exp") },
    { q: t("c1q2"), opts: [t("c1q2a"), t("c1q2b"), t("c1q2c"), t("c1q2d")], correct: t("c1q2correct"), exp: t("c1q2exp") },
    { q: t("c1q3"), opts: [t("c1q3a"), t("c1q3b"), t("c1q3c"), t("c1q3d")], correct: t("c1q3correct"), exp: t("c1q3exp") },
    { q: t("c1q4"), opts: [t("c1q4a"), t("c1q4b"), t("c1q4c"), t("c1q4d")], correct: t("c1q4correct"), exp: t("c1q4exp") },
    { q: t("c1q5"), opts: [t("c1q5a"), t("c1q5b"), t("c1q5c"), t("c1q5d")], correct: t("c1q5correct"), exp: t("c1q5exp") },
    { q: t("c1q6"), opts: [t("c1q6a"), t("c1q6b"), t("c1q6c"), t("c1q6d")], correct: t("c1q6correct"), exp: t("c1q6exp") },
    { q: t("c1q7"), opts: [t("c1q7a"), t("c1q7b"), t("c1q7c"), t("c1q7d")], correct: t("c1q7correct"), exp: t("c1q7exp") },
  ];

  const startGame = () => { setCurrent(0); setSelected(null); setAnswered(false); setResults([]); setEggState("idle"); setPhase("playing"); };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === questions[current].correct;
    setResults(prev => [...prev, isCorrect]);
    setEggState(isCorrect ? "crack" : "frozen");
  };

  const nextQuestion = () => {
    if (current < 6) { setCurrent(c => c + 1); setSelected(null); setAnswered(false); setEggState("idle"); }
    else { setPhase("results"); }
  };

  const score = results.filter(Boolean).length;
  const wrongCount = results.filter(r => !r).length;
  const hatched = wrongCount < 3;

  if (phase === "welcome") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          {DINO_COLORS.map((c, i) => <DragonEgg key={i} color={c} size={56} state="idle" delay={i * 0.4} />)}
        </div>
        <h3 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 10 }}>{t("c1gameTitle")}</h3>
        <p style={{ fontSize: 15, color: MUTED, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>{t("c1gameDesc")}</p>
        <button onClick={startGame} style={{ ...btnPrimary, padding: "14px 32px", fontSize: 16 }}>{t("c1gameStart")}</button>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 28px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        {hatched ? (
          <>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 8 }}>{t("c1gameHatched")}</h3>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 8 }}>{t("c1gameHatchedDesc")}</p>
            <p style={{ fontSize: 17, color: TEAL, fontWeight: 600, marginBottom: 28 }}>{t("c1gameScore")(score)}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              {DINO_COLORS.map((c, i) => <CuteDino key={i} color={c} size={100} name={t("c1dinoNames")[i]} delay={i * 0.3} />)}
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: "#6BA3C4", marginBottom: 8 }}>{t("c1gameFrozen")}</h3>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 8 }}>{t("c1gameFrozenDesc")}</p>
            <p style={{ fontSize: 17, color: CORAL, fontWeight: 600, marginBottom: 28 }}>{t("c1gameScore")(score)}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              {DINO_COLORS.map((c, i) => <DragonEgg key={i} color={c} size={64} state="frozen" delay={i * 0.15} />)}
            </div>
          </>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={startGame} style={{ ...btnPrimary, background: hatched ? TEAL : CORAL }}>{t("c1gameRetry")}</button>
          {hatched && <button style={{ background: "transparent", border: `1.5px solid ${TEAL}`, color: TEAL, padding: "11px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("c1gameContinue")}</button>}
        </div>
      </div>
    );
  }

  // Playing
  const q = questions[current];
  const isCorrect = selected !== null && selected === q.correct;
  const currentColor = DINO_COLORS[current];

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{t("c1gameQ")(current + 1)}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2, 3, 4, 5, 6].map(i => {
            let bg = LIGHT_BORDER;
            if (i < current) bg = results[i] ? "#3DA87A" : CORAL;
            else if (i === current) bg = currentColor;
            return <div key={i} style={{ width: 28, height: 6, borderRadius: 3, background: bg, transition: "all 0.3s" }} />;
          })}
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <DragonEgg color={currentColor} size={80} state={eggState} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: DARK, marginBottom: 18, lineHeight: 1.5 }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {q.opts.map((opt, idx) => {
          let bg = "#FAFAF7", border = LIGHT_BORDER, col = DARK;
          if (answered) {
            if (idx === q.correct) { bg = "#E6F5F0"; border = "#3DA87A"; col = "#2A7A5A"; }
            else if (idx === selected && idx !== q.correct) { bg = "#FDEEEB"; border = "#D94B2E"; col = "#B83A20"; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: "12px 16px", textAlign: "left", fontSize: 14, color: col, cursor: answered ? "default" : "pointer", transition: "all 0.2s", fontWeight: answered && idx === q.correct ? 600 : 400, lineHeight: 1.5 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${border}`, fontSize: 12, fontWeight: 600, marginRight: 10, background: answered && idx === q.correct ? "#3DA87A" : "transparent", color: answered && idx === q.correct ? "#FFF" : col }}>{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ background: isCorrect ? "#E6F5F0" : "#FDEEEB", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13.5, lineHeight: 1.65, color: MUTED, border: `1px solid ${isCorrect ? "#3DA87A33" : "#D94B2E33"}` }}>
          <strong style={{ color: isCorrect ? "#2A7A5A" : "#B83A20" }}>{isCorrect ? t("c1gameCorrect") : t("c1gameWrong")}</strong>{" "}{q.exp}
        </div>
      )}
      {answered && (
        <div style={{ textAlign: "right" }}>
          <button onClick={nextQuestion} style={btnPrimary}>{current < 6 ? t("c1gameNext") : t("c1gameResults")}</button>
        </div>
      )}
    </div>
  );
}

// ═══ INTERACTIVE PICO BUILDER ═══
function PicoBuilder({ t }) {
  const [scenario, setScenario] = useState("A");
  const [inputs, setInputs] = useState({ p: "", i: "", c: "", o: "" });
  const [showRef, setShowRef] = useState(false);

  const refs = { A: t("c1scenarioARef"), B: t("c1scenarioBRef"), C: t("c1scenarioCRef") };
  const ref = refs[scenario];

  const handleScenarioChange = (s) => { setScenario(s); setInputs({ p: "", i: "", c: "", o: "" }); setShowRef(false); };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 12 }}>{t("c1s4Scenario")}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {["A", "B", "C"].map(s => (
          <button key={s} onClick={() => handleScenarioChange(s)} style={{ background: scenario === s ? `${TEAL}0D` : "#FAFAF7", border: `1.5px solid ${scenario === s ? TEAL + "44" : LIGHT_BORDER}`, borderRadius: 12, padding: "12px 16px", textAlign: "left", fontSize: 14, color: scenario === s ? TEAL : DARK, fontWeight: scenario === s ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
            {t(`scenario${s}`)}
          </button>
        ))}
      </div>
      {[
        { field: "p", color: CORAL },
        { field: "i", color: "#7B68C8" },
        { field: "c", color: "#D4A843" },
        { field: "o", color: "#5B9E5F" },
      ].map(({ field, color }) => (
        <div key={field} style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 6, background: `${color}15`, fontSize: 11, fontWeight: 700, color }}>{field.toUpperCase()}</span>
            {t(`s4Your${field.toUpperCase()}`)}
          </label>
          <textarea value={inputs[field]} onChange={(e) => setInputs(prev => ({ ...prev, [field]: e.target.value }))} placeholder={t(`s4Placeholder${field.toUpperCase()}`)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${LIGHT_BORDER}`, fontSize: 14, lineHeight: 1.6, color: DARK, background: "#FAFAF7", resize: "vertical", minHeight: 48, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", marginTop: 6 }} />
        </div>
      ))}
      <button onClick={() => setShowRef(!showRef)} style={{ background: "transparent", border: `1.5px solid ${TEAL}`, color: TEAL, padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4, transition: "all 0.2s" }}>
        {showRef ? t("c1s4HideAnswer") : t("c1s4ShowAnswer")}
      </button>
      {showRef && ref && (
        <div style={{ marginTop: 16, background: `${TEAL}06`, border: `1px solid ${TEAL}18`, borderRadius: 14, padding: "20px 22px" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 14 }}>📋 {t("c1s4RefTitle")}</h4>
          {[{ label: "P", value: ref.p, color: CORAL }, { label: "I", value: ref.i, color: "#7B68C8" }, { label: "C", value: ref.c, color: "#D4A843" }, { label: "O", value: ref.o, color: "#5B9E5F" }].map(item => (
            <div key={item.label} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ minWidth: 26, height: 26, borderRadius: 7, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: item.color, flexShrink: 0 }}>{item.label}</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, margin: "2px 0 0" }}>{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══ MAIN COURSE COMPONENT ═══
export default function Course1PICO({ onNavigate }) {
  const { t, lang, toggleLang } = useI18n();

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: LIGHT_BG, color: DARK, minHeight: "100vh", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${TEAL}22; color: ${DARK}; }
        @keyframes eggFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes eggShake { 0% { transform: rotate(0); } 20% { transform: rotate(8deg); } 40% { transform: rotate(-8deg); } 60% { transform: rotate(5deg); } 80% { transform: rotate(-3deg); } 100% { transform: rotate(0); } }
        @keyframes eggFreeze { 0% { transform: scale(1); filter: saturate(1) brightness(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); filter: saturate(0.15) brightness(1.35); } }
        @keyframes dinoAppear { 0% { transform: scale(0) translateY(20px); opacity: 0; } 60% { transform: scale(1.1) translateY(-5px); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        textarea:focus { border-color: ${TEAL}66 !important; box-shadow: 0 0 0 3px ${TEAL}0D; }
        @media (max-width: 640px) {
          .pico-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(248,247,244,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${LIGHT_BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {onNavigate && (
            <button onClick={() => onNavigate("hub")} style={{ background: "none", border: "none", color: MUTED, fontSize: 13, cursor: "pointer", padding: "4px 8px", borderRadius: 6, transition: "color 0.2s" }}
              onMouseEnter={(e) => e.target.style.color = TEAL} onMouseLeave={(e) => e.target.style.color = MUTED}>
              ←
            </button>
          )}
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: TEAL, background: `${TEAL}0D`, padding: "3px 8px", borderRadius: 5, border: `1px solid ${TEAL}22` }}>{t("c1Label")}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{t("c1Subtitle")}</span>
        </div>
        <button onClick={toggleLang} style={{ background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, color: TEAL, padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.target.style.background = TEAL; e.target.style.color = "#FFF"; }}
          onMouseLeave={(e) => { e.target.style.background = `${TEAL}0D`; e.target.style.color = TEAL; }}>
          {t("langSwitch")}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 100, paddingBottom: 64, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #C8C6C0 0.8px, transparent 0.8px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${CORAL}0A, transparent 70%)`, pointerEvents: "none" }} />
        <FadeIn>
          <div style={{ padding: "0 24px", maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
              {DINO_COLORS.map((c, i) => <DragonEgg key={i} color={c} size={44} state="idle" delay={i * 0.5} />)}
            </div>
            <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: DARK }}>
              {t("c1Title")}
            </h1>
            <p style={{ fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 32px" }}>{t("c1Desc")}</p>
            <button onClick={() => scrollTo("s1")} style={{ ...btnPrimary, padding: "14px 32px", fontSize: 15, borderRadius: 12, boxShadow: `0 4px 20px ${TEAL}33` }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 28px ${TEAL}44`; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 20px ${TEAL}33`; }}>
              {t("c1StartBtn")}
            </button>
          </div>
        </FadeIn>
      </section>

      {/* S1: Why PICO */}
      <section id="s1" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s1Label")} /><SectionTitle>{t("c1s1Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1s1Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
            <FadeIn delay={0.15}>
              <div style={{ background: "#FDEEEB", border: `1px solid ${CORAL}22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: CORAL, marginBottom: 10 }}>{t("c1s1Bad")}</h4>
                <p style={{ fontSize: 17, fontWeight: 600, color: "#B83A20", marginBottom: 10, fontStyle: "italic" }}>{t("c1s1BadEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("c1s1BadWhy")}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ background: "#E6F5F0", border: `1px solid #3DA87A22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10 }}>{t("c1s1Good")}</h4>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10, lineHeight: 1.5 }}>{t("c1s1GoodEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("c1s1GoodWhy")}</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s2")} style={btnPrimary}>{t("c1s1Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S2: PICO Elements */}
      <section id="s2" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s2Label")} /><SectionTitle>{t("c1s2Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1s2Intro")}</Paragraph></FadeIn>
          <div className="pico-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
            <PicoCard letter="P" color={CORAL} title={t("c1pTitle")} desc={t("c1pDesc")} example={t("c1pExample")} tip={t("c1pTip")} delay={0.1} />
            <PicoCard letter="I" color="#7B68C8" title={t("c1iTitle")} desc={t("c1iDesc")} example={t("c1iExample")} tip={t("c1iTip")} delay={0.15} />
            <PicoCard letter="C" color="#D4A843" title={t("c1cTitle")} desc={t("c1cDesc")} example={t("c1cExample")} tip={t("c1cTip")} delay={0.2} />
            <PicoCard letter="O" color="#5B9E5F" title={t("c1oTitle")} desc={t("c1oDesc")} example={t("c1oExample")} tip={t("c1oTip")} delay={0.25} />
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s3")} style={btnPrimary}>{t("c1s2Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S3: PICOS */}
      <section id="s3" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s3Label")} /><SectionTitle>{t("c1s3Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c1s3Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 16, padding: "28px 24px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${TEAL}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: TEAL }}>S</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK }}>{t("c1sTitle")}</h3>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: MUTED, marginBottom: 16 }}>{t("c1sDesc")}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>{t("c1sOptions")}</p>
              {[{ text: t("c1sRCT"), color: "#2A7A5A", bg: "#E6F5F0" }, { text: t("c1sCohort"), color: "#7B68C8", bg: "#F0EDF8" }, { text: t("c1sCaseControl"), color: "#D4A843", bg: "#FDF8EC" }, { text: t("c1sAny"), color: MUTED, bg: "#F5F5F3" }].map((item, i) => (
                <div key={i} style={{ background: item.bg, borderRadius: 8, padding: "8px 14px", marginBottom: 6, fontSize: 13.5, color: item.color, fontWeight: 500, lineHeight: 1.5 }}>{item.text}</div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: TEAL }}>💡 {t("c1s3Tip")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s4")} style={btnPrimary}>{t("c1s3Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S4: Interactive Builder */}
      <section id="s4" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s4Label")} /><SectionTitle>{t("c1s4Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1s4Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><PicoBuilder t={t} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s5")} style={btnPrimary}>{t("c1s4Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S5: Common Mistakes */}
      <section id="s5" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1s5Label")} /><SectionTitle>{t("c1s5Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c1s5Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <TrapCard key={n} number={n} title={t(`trap${n}Title`)} bad={t(`trap${n}Bad`)} good={t(`trap${n}Good`)} delay={n * 0.05} />
            ))}
          </div>
          <FadeIn delay={0.35}><div style={{ textAlign: "center", marginTop: 32 }}><button onClick={() => scrollTo("game")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>{t("c1s5Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* GAME */}
      <section id="game" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c1gameLabel")} /></FadeIn>
          <FadeIn delay={0.1}><DragonEggGame t={t} /></FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG }}>
        {onNavigate && (
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("course0")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "← 回到 Course 0" : "← Back to Course 0"}
            </button>
            <button onClick={() => onNavigate("hub")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "課程總覽" : "Course Hub"}
            </button>
            <button onClick={() => onNavigate("course2")} style={{ background: TEAL, border: "none", color: "#FFF", padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: `0 2px 12px ${TEAL}33`, opacity: 0.5, cursor: "default" }}>
              {lang === "zh" ? "Course 2：即將推出" : "Course 2: Coming Soon"}
            </button>
          </div>
        )}
        <p style={{ fontSize: 13, color: "#B0AFAA", lineHeight: 1.8 }}>Meta-Analysis 101 — {t("c1Label")}: {t("c1Subtitle")}</p>
        <div style={{ marginTop: 12, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>統合分析 101</div>
      </footer>
    </div>
  );
}
