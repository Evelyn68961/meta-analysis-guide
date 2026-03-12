// ═══════════════════════════════════════════════════════════
//  DinoEggHunt.jsx — "Egg Hunt" game for Course 0
//
//  7 egg categories, each with 5 questions in the question bank.
//  Answer correctly to crack eggs and unlock cheatsheets.
//
//  Extracted from Course0.jsx to match Course1/2 architecture:
//    Course0.jsx         → course content & layout
//    DinoEggHunt.jsx     → game component (this file)
//    course0Questions.js → question data
//    questionHelpers.js  → shared pickBalanced/pickQuestions
// ═══════════════════════════════════════════════════════════

import { useState } from "react";
import { pickBalanced } from "./questionHelpers";
import { course0Questions } from "./course0Questions";
import { supabase } from "./supabaseClient";

// ═══ DESIGN TOKENS ═══
const TEAL = "#0E7C86";
const DARK = "#1D2B3A";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";

const btnPrimary = { background: TEAL, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", transition: "all 0.2s" };
const btnSecondary = { background: "transparent", border: `1.5px solid ${TEAL}`, color: TEAL, padding: "11px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" };

// ═══ EGG COLORS & CATEGORIES ═══
export const EGG_COLORS = {
  "what-why": "#2ECC71",
  "data": "#3498DB",
  "forest": "#F1C40F",
  "heterogeneity": "#E74C3C",
  "search": "#9B59B6",
  "bias": "#E67E22",
  "interpretation": "#95A5A6",
};

// Category IDs map to questionBank category numbers:
//   0 = what-why, 1 = data, 2 = forest, 3 = heterogeneity,
//   4 = search, 5 = bias, 6 = interpretation
const CATEGORY_ID_TO_NUM = {
  "what-why": 0, "data": 1, "forest": 2, "heterogeneity": 3,
  "search": 4, "bias": 5, "interpretation": 6,
};
const CATEGORY_NUM_TO_ID = Object.fromEntries(
  Object.entries(CATEGORY_ID_TO_NUM).map(([k, v]) => [v, k])
);

export const EGG_CATEGORIES = [
  { id: "what-why", nameKey: "eggCatDiscovery", sheetKey: "eggSheetDiscovery", sheetLink: "/cheatsheets/cheatsheet_discovery_egg.png" },
  { id: "data", nameKey: "eggCatData", sheetKey: "eggSheetData", sheetLink: "/cheatsheets/cheatsheet_data_egg.png" },
  { id: "forest", nameKey: "eggCatForest", sheetKey: "eggSheetForest", sheetLink: "/cheatsheets/cheatsheet_forest_egg.png" },
  { id: "heterogeneity", nameKey: "eggCatVariety", sheetKey: "eggSheetVariety", sheetLink: "/cheatsheets/cheatsheet_variety_egg.png" },
  { id: "search", nameKey: "eggCatSearch", sheetKey: "eggSheetSearch", sheetLink: "/cheatsheets/cheatsheet_search_egg.png" },
  { id: "bias", nameKey: "eggCatBias", sheetKey: "eggSheetBias", sheetLink: "/cheatsheets/cheatsheet_bias_egg.png" },
  { id: "interpretation", nameKey: "eggCatWisdom", sheetKey: "eggSheetWisdom", sheetLink: "/cheatsheets/cheatsheet_wisdom_egg.png" },
];

// ═══ STYLISH SVG EGG ═══
export function StylishEgg({ color = "#3498DB", size = 64, variant = "solid", animate = null, delay = 0, style = {} }) {
  const w = Math.round(size * 0.77);
  const h = size;
  const id = `egg-${color.replace("#", "")}-${size}-${Math.random().toString(36).slice(2, 6)}`;

  const hexToRgb = (hex) => {
    const c = hex.replace("#", "");
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  };
  const rgbToHex = (r, g, b) => "#" + [r, g, b].map(v => Math.min(255, Math.max(0, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const lighten = (hex, amt) => { const [r, g, b] = hexToRgb(hex); return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt); };
  const darken = (hex, amt) => { const [r, g, b] = hexToRgb(hex); return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt)); };

  const animationName =
    animate === "bob" ? "eggBob" :
    animate === "collect" ? "eggCollect" :
    animate === "crack" ? "eggCrack" : "none";

  const wrapperStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: w,
    height: h,
    animation: animationName !== "none" ? `${animationName} ${animate === "bob" ? "2s" : "0.6s"} ease-${animate === "bob" ? "in-out" : "out"} ${delay}s ${animate === "bob" ? "infinite" : "1"}` : "none",
    transition: "all 0.3s",
    ...style,
  };

  if (variant === "ghost") {
    return (
      <div style={wrapperStyle}>
        <svg width={w} height={h} viewBox="0 0 60 78" fill="none">
          <ellipse cx="30" cy="42" rx="26" ry="34" fill="#E8E6E1" opacity="0.5" />
        </svg>
      </div>
    );
  }

  if (variant === "dashed") {
    return (
      <div style={wrapperStyle}>
        <svg width={w} height={h} viewBox="0 0 60 78" fill="none">
          <defs>
            <radialGradient id={`${id}-bg`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor={lighten(color, 0.85)} />
              <stop offset="100%" stopColor={lighten(color, 0.7)} />
            </radialGradient>
          </defs>
          <ellipse cx="30" cy="42" rx="26" ry="34" fill={`url(#${id}-bg)`} />
          <ellipse cx="30" cy="42" rx="26" ry="34" fill="none"
            stroke={color} strokeWidth="2" strokeDasharray="5 4" opacity="0.55" />
          <ellipse cx="22" cy="30" rx="8" ry="12" fill="white" opacity="0.25" transform="rotate(-15 22 30)" />
        </svg>
      </div>
    );
  }

  if (variant === "cracked-correct" || variant === "cracked-wrong") {
    const isCorrect = variant === "cracked-correct";
    const baseColor = isCorrect ? color : "#CCCCCC";
    return (
      <div style={wrapperStyle}>
        <svg width={w} height={h} viewBox="0 0 60 78" fill="none">
          <defs>
            <radialGradient id={`${id}-bg`} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor={lighten(baseColor, 0.3)} />
              <stop offset="100%" stopColor={darken(baseColor, 0.1)} />
            </radialGradient>
            <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.35" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
          </defs>
          <ellipse cx="30" cy="42" rx="26" ry="34" fill={`url(#${id}-bg)`} />
          <path d="M8 40 Q20 35 30 37 Q40 35 52 40" stroke={darken(baseColor, 0.2)} strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M8 44 Q20 48 30 46 Q40 48 52 44" stroke={darken(baseColor, 0.2)} strokeWidth="1.5" fill="none" opacity="0.4" />
          <path d="M24 30 L28 38 L22 42 L30 48 L26 54" stroke={isCorrect ? darken(color, 0.3) : "#999"}
            strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.6" />
          <ellipse cx="22" cy="28" rx="9" ry="14" fill={`url(#${id}-shine)`} transform="rotate(-15 22 28)" />
          {isCorrect ? (
            <text x="30" y="46" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">✓</text>
          ) : (
            <text x="30" y="46" textAnchor="middle" fontSize="16" fill="#999">✗</text>
          )}
        </svg>
      </div>
    );
  }

  // Default "solid" variant
  return (
    <div style={wrapperStyle}>
      <svg width={w} height={h} viewBox="0 0 60 78" fill="none">
        <defs>
          <radialGradient id={`${id}-bg`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor={lighten(color, 0.25)} />
            <stop offset="70%" stopColor={color} />
            <stop offset="100%" stopColor={darken(color, 0.15)} />
          </radialGradient>
          <radialGradient id={`${id}-hi`} cx="50%" cy="30%" r="40%">
            <stop offset="0%" stopColor="white" stopOpacity="0.45" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-sh`} cx="50%" cy="95%" r="40%">
            <stop offset="0%" stopColor={darken(color, 0.35)} stopOpacity="0.3" />
            <stop offset="100%" stopColor={darken(color, 0.35)} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="30" cy="74" rx="18" ry="3" fill={darken(color, 0.3)} opacity="0.12" />
        <ellipse cx="30" cy="42" rx="26" ry="34" fill={`url(#${id}-bg)`} />
        <path d="M6 38 Q15 33 22 36 Q30 40 38 35 Q46 30 54 36" stroke={lighten(color, 0.35)} strokeWidth="2.5" fill="none" opacity="0.5" />
        <path d="M6 43 Q15 48 22 45 Q30 41 38 46 Q46 51 54 45" stroke={lighten(color, 0.35)} strokeWidth="2.5" fill="none" opacity="0.5" />
        <circle cx="18" cy="40" r="2" fill={lighten(color, 0.5)} opacity="0.5" />
        <circle cx="30" cy="39" r="2.5" fill={lighten(color, 0.5)} opacity="0.5" />
        <circle cx="42" cy="40" r="2" fill={lighten(color, 0.5)} opacity="0.5" />
        <ellipse cx="22" cy="28" rx="10" ry="15" fill={`url(#${id}-hi)`} transform="rotate(-12 22 28)" />
        <ellipse cx="30" cy="42" rx="26" ry="34" fill={`url(#${id}-sh)`} />
        <circle cx="20" cy="22" r="2" fill="white" opacity="0.6" />
        <circle cx="17" cy="26" r="1" fill="white" opacity="0.35" />
      </svg>
    </div>
  );
}

// ═══ MAIN GAME COMPONENT ═══
export default function DinoEggHunt({ t, lang, user }) {
  const [phase, setPhase] = useState("welcome"); // welcome | playing | results
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]); // { category, correct }
  const [cracked, setCracked] = useState(false);

  const font = "'Noto Sans TC', 'Outfit', sans-serif";
  const serifFont = "'Noto Sans TC', 'Source Serif 4', serif";

  const startHunt = () => {
    const picked = pickBalanced(course0Questions, 7, 7);
    setQuestions(picked);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setResults([]);
    setCracked(false);
    setPhase("playing");
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    setCracked(true);
    const isCorrect = idx === questions[current].correct;
    const catId = CATEGORY_NUM_TO_ID[questions[current].category];
    setResults(prev => [...prev, { category: catId, correct: isCorrect }]);
    // Save collected egg to Supabase (if logged in + correct)
    if (isCorrect && user) {
      supabase.from("progress").insert({
        user_id: user.id,
        course: 0,
        game_type: "egg_hunt",
        dino_index: questions[current].category,
        score: 1,
        max_score: 1,
        result: "collected",
      }).then();
    }
  };

  const nextEgg = () => {
    if (current < 6) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setCracked(false);
    } else {
      setPhase("results");
    }
  };

  const score = results.filter(r => r.correct).length;
  const catObj = (catId) => EGG_CATEGORIES.find(c => c.id === catId);

  // Helper to get localized text from a question
  const qText = (q) => lang === "zh" ? q.zh : q.en;

  // Welcome screen
  if (phase === "welcome") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 28 }}>
          {[EGG_COLORS["what-why"], EGG_COLORS["data"], EGG_COLORS["forest"], EGG_COLORS["heterogeneity"], EGG_COLORS["search"], EGG_COLORS["bias"], EGG_COLORS["interpretation"]].map((color, i) => (
            <StylishEgg key={i} color={color} size={48} variant="dashed" animate="bob" delay={i * 0.3} />
          ))}
        </div>
        <h3 style={{ fontFamily: serifFont, fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 10 }}>
          {t("eggHuntTitle")}
        </h3>
        <p style={{ fontSize: 15, color: MUTED, fontFamily: font, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
          {t("eggHuntDesc")}
        </p>
        <button onClick={startHunt} style={{ ...btnPrimary, padding: "14px 32px", fontSize: 16 }}>{t("eggHuntStart")}</button>
        <style>{`@keyframes eggBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
      </div>
    );
  }

  // Results screen
  if (phase === "results") {
    const tierEmoji = score >= 7 ? "\uD83C\uDFC6" : score >= 5 ? "\uD83E\uDD48" : score >= 3 ? "\uD83E\uDD49" : "\uD83D\uDD0D";
    const tierLabel = score >= 7 ? t("eggHuntMaster") : score >= 5 ? t("eggHuntExplorer") : score >= 3 ? t("eggHuntApprentice") : t("eggHuntKeepTrying");
    const unlockAll = score >= 5;

    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "40px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{tierEmoji}</div>
          <h3 style={{ fontFamily: serifFont, fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 8 }}>{tierLabel}</h3>
          <p style={{ fontSize: 17, color: TEAL, fontWeight: 600, fontFamily: font }}>{t("eggHuntScore", score)}</p>
        </div>

        {/* Basket */}
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {results.map((r, i) => {
            const cat = catObj(r.category);
            const color = EGG_COLORS[r.category];
            return (
              <div key={i} style={{ textAlign: "center" }}>
                <StylishEgg color={color} size={54} variant={r.correct ? "cracked-correct" : "cracked-wrong"} />
                <span style={{ fontSize: 11, color: r.correct ? DARK : MUTED, fontFamily: font, fontWeight: r.correct ? 600 : 400, marginTop: 6, display: "block" }}>
                  {t(cat.nameKey)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Cheat sheet downloads */}
        {score >= 3 && (
          <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}1A`, borderRadius: 14, padding: "20px 22px", marginBottom: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 12, fontFamily: font }}>
              {t("eggHuntDownload")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {results.map((r, i) => {
                const cat = catObj(r.category);
                const color = EGG_COLORS[r.category];
                const canDownload = unlockAll || r.correct;
                return (
                  <a key={i} href={cat.sheetLink} download target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                    background: canDownload ? CARD_BG : "#F5F5F3", borderRadius: 10,
                    border: `1px solid ${canDownload ? color + "44" : LIGHT_BORDER}`,
                    textDecoration: "none", opacity: canDownload ? 1 : 0.5,
                    pointerEvents: canDownload ? "auto" : "none",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ width: 28, height: 36, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: canDownload ? color : "#DDD", flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: canDownload ? DARK : MUTED, fontFamily: font }}>{t(cat.sheetKey)}</div>
                      <div style={{ fontSize: 11, color: MUTED, fontFamily: font }}>{t(cat.nameKey)}</div>
                    </div>
                    {canDownload && <span style={{ fontSize: 12, color: TEAL, fontWeight: 600 }}>↓</span>}
                  </a>
                );
              })}
              {score >= 7 && (
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    EGG_CATEGORIES.forEach((c, idx) => {
                      setTimeout(() => {
                        const a = document.createElement("a");
                        a.href = c.sheetLink;
                        a.download = c.sheetLink.split("/").pop();
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      }, idx * 300);
                    });
                  }} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
                  background: `${TEAL}0D`, borderRadius: 10, border: `1.5px solid ${TEAL}33`,
                  textDecoration: "none", marginTop: 4, transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: 20 }}>{"\uD83C\uDFC6"}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEAL, fontFamily: font }}>{t("eggHuntAllSheets")}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, color: TEAL, fontWeight: 600 }}>↓</span>
                </a>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <button onClick={startHunt} style={btnPrimary}>{t("eggHuntPlayAgain")}</button>
        </div>
      </div>
    );
  }

  // Playing phase
  const q = questions[current];
  const catId = CATEGORY_NUM_TO_ID[q.category];
  const cat = catObj(catId);
  const eggColor = EGG_COLORS[catId];
  const isCorrect = selected !== null && selected === q.correct;
  const localized = qText(q);

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 28px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      {/* Progress eggs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, color: MUTED, fontFamily: font }}>{t("eggHuntProgress", current + 1)}</span>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const pastResult = results[i];
            let bg = "#E8E6E1";
            if (i < current) bg = pastResult?.correct ? EGG_COLORS[pastResult.category] : "#DDD";
            else if (i === current) bg = eggColor;
            return (
              <StylishEgg key={i} color={bg} size={22} variant={i <= current ? "solid" : "ghost"} />
            );
          })}
        </div>
      </div>

      {/* Egg display */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ margin: "0 auto 12px" }}>
          <StylishEgg color={eggColor} size={82}
            variant={cracked && answered ? (isCorrect ? "cracked-correct" : "cracked-wrong") : "solid"}
            animate={cracked ? (isCorrect ? "collect" : "crack") : null} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: eggColor, fontFamily: font, letterSpacing: 1, textTransform: "uppercase" }}>
          {t(cat.nameKey)}
        </span>
      </div>

      {/* Question */}
      <h3 style={{ fontFamily: serifFont, fontSize: 19, fontWeight: 600, color: DARK, marginBottom: 18, lineHeight: 1.45 }}>{localized.q}</h3>

      {/* Options */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {localized.opts.map((opt, idx) => {
          let bg = "#FAFAF7", border = LIGHT_BORDER, color = DARK;
          if (answered) {
            if (idx === q.correct) { bg = "#E6F5F0"; border = "#3DA87A"; color = "#2A7A5A"; }
            else if (idx === selected && idx !== q.correct) { bg = "#FDEEEB"; border = "#D94B2E"; color = "#B83A20"; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{
              background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
              padding: "14px 18px", textAlign: "left", fontSize: 15, color,
              fontFamily: font, cursor: answered ? "default" : "pointer",
              transition: "all 0.2s", fontWeight: answered && idx === q.correct ? 600 : 400,
            }}>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${border}`,
                fontSize: 12, fontWeight: 600, marginRight: 12,
                background: answered && idx === q.correct ? "#3DA87A" : "transparent",
                color: answered && idx === q.correct ? "#FFF" : color,
              }}>{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div style={{
          background: isCorrect ? "#E6F5F0" : "#FDEEEB", borderRadius: 12,
          padding: "14px 18px", marginBottom: 16, fontSize: 14, lineHeight: 1.65,
          color: MUTED, fontFamily: font,
          border: `1px solid ${isCorrect ? "#3DA87A33" : "#D94B2E33"}`,
        }}>
          <strong style={{ color: isCorrect ? "#2A7A5A" : "#B83A20" }}>
            {isCorrect ? t("eggHuntCorrect", t(cat.nameKey)) : t("eggHuntWrong")}
          </strong>{" "}
          {localized.exp}
        </div>
      )}

      {/* Next button */}
      {answered && (
        <div style={{ textAlign: "right" }}>
          <button onClick={nextEgg} style={btnPrimary}>
            {current < 6 ? t("eggHuntNext") : t("eggHuntResults")}
          </button>
        </div>
      )}

      <style>{`
        @keyframes eggCollect {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes eggCrack {
          0% { transform: scale(1); }
          30% { transform: scale(1.1) rotate(5deg); }
          60% { transform: scale(0.95) rotate(-3deg); }
          100% { transform: scale(1) rotate(0); }
        }
      `}</style>
    </div>
  );
}
