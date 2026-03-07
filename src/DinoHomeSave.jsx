// ═══════════════════════════════════════════════════════════
//  DinoHomeSave.jsx — "Save Dino's Home" game for Course 3
//
//  Dino's home is getting frozen by a snowstorm!
//  Answer questions within 10 seconds to keep the fire burning.
//
//  Mechanics:
//    - Pick 1 of 7 dinos → 7 shuffled questions (balanced categories)
//    - 10-second timer per question — snow keeps falling!
//    - Correct → fire grows brighter, dino warms up
//    - Wrong/timeout → fire dims, dino shivers
//    - Win: ≥5 correct → home saved!
//    - Lose: ≥3 wrong → home frozen!
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from "react";
import CuteDino from "./CuteDino";
import { course3Questions, pickBalanced } from "./questionBank";

// ═══ DESIGN TOKENS ═══
const GOLD = "#D4A843";
const DARK = "#1D2B3A";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const CARD_BG = "#FFFFFF";
const CORAL = "#E8734A";
const FIRE_ORANGE = "#F77F00";
const FIRE_RED = "#D62828";
const ICE_BLUE = "#A8D8EA";
const WARM_BG = "#FFF8EE";
const COLD_BG = "#EDF5FA";
const DINO_COLORS = ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6", "#E67E22", "#95A5A6"];
const DINO_NAMES_EN = ["Rex", "Azure", "Zephyr", "Blaze", "Thistle", "Velo", "Dome"];
const DINO_NAMES_ZH = ["翠牙龍", "蒼瀾龍", "金翼龍", "焰角龍", "紫棘龍", "珀爪龍", "鐵穹龍"];

const btnPrimary = {
  background: GOLD, border: "none", color: "#FFF",
  padding: "12px 28px", borderRadius: 10, fontSize: 14,
  fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
};

const TIME_LIMIT = 10; // seconds per question

// ═══ FIREPLACE SVG ═══
function Fireplace({ fireLevel = 3, frozen = false }) {
  // fireLevel: 0 (out) to 5 (roaring)
  const flameH = 8 + fireLevel * 9; // 8 to 53
  const flameW = 10 + fireLevel * 5; // 10 to 35
  const glowR = 10 + fireLevel * 8;
  const glowOpacity = 0.05 + fireLevel * 0.08;
  const flameColor1 = fireLevel > 2 ? "#FFBE0B" : fireLevel > 0 ? "#F4845F" : "#8899AA";
  const flameColor2 = fireLevel > 2 ? FIRE_ORANGE : fireLevel > 0 ? "#C44536" : "#667788";
  const flameColor3 = fireLevel > 3 ? FIRE_RED : fireLevel > 1 ? "#E76F51" : "#556677";

  return (
    <svg width="120" height="100" viewBox="0 0 120 100" style={{ overflow: "visible" }}>
      {/* Warm glow behind fireplace */}
      {fireLevel > 0 && (
        <circle cx="60" cy="55" r={glowR} fill={FIRE_ORANGE} opacity={glowOpacity}>
          <animate attributeName="r" values={`${glowR};${glowR + 4};${glowR}`} dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values={`${glowOpacity};${glowOpacity + 0.03};${glowOpacity}`} dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Fireplace frame - stone/brick */}
      <rect x="15" y="40" width="90" height="58" rx="4" fill="#8B7355" />
      <rect x="18" y="43" width="84" height="52" rx="3" fill="#2A1F14" />
      {/* Mantel */}
      <rect x="10" y="35" width="100" height="8" rx="3" fill="#6B5B3D" />
      {/* Hearth base */}
      <rect x="12" y="95" width="96" height="5" rx="2" fill="#8B7355" />
      {/* Logs */}
      <ellipse cx="45" cy="88" rx="18" ry="5" fill="#5C3D1E" />
      <ellipse cx="70" cy="90" rx="16" ry="4.5" fill="#4A3219" />
      <ellipse cx="58" cy="86" rx="14" ry="4" fill="#6B4C2A" />
      {/* Flames */}
      {fireLevel > 0 && (
        <g>
          {/* Main flame */}
          <ellipse cx="58" cy={92 - flameH * 0.5} rx={flameW * 0.45} ry={flameH * 0.5} fill={flameColor1} opacity="0.9">
            <animate attributeName="rx" values={`${flameW * 0.45};${flameW * 0.5};${flameW * 0.4};${flameW * 0.45}`} dur="0.6s" repeatCount="indefinite" />
            <animate attributeName="ry" values={`${flameH * 0.5};${flameH * 0.55};${flameH * 0.48};${flameH * 0.5}`} dur="0.8s" repeatCount="indefinite" />
          </ellipse>
          {/* Inner flame */}
          <ellipse cx="56" cy={92 - flameH * 0.35} rx={flameW * 0.28} ry={flameH * 0.35} fill={flameColor2} opacity="0.85">
            <animate attributeName="rx" values={`${flameW * 0.28};${flameW * 0.32};${flameW * 0.25};${flameW * 0.28}`} dur="0.5s" repeatCount="indefinite" />
          </ellipse>
          {/* Core flame */}
          {fireLevel > 1 && (
            <ellipse cx="57" cy={92 - flameH * 0.22} rx={flameW * 0.15} ry={flameH * 0.22} fill={flameColor3} opacity="0.8">
              <animate attributeName="ry" values={`${flameH * 0.22};${flameH * 0.26};${flameH * 0.2};${flameH * 0.22}`} dur="0.4s" repeatCount="indefinite" />
            </ellipse>
          )}
          {/* Sparks */}
          {fireLevel > 3 && [0, 1, 2].map(i => (
            <circle key={i} cx={50 + i * 8} cy={60 - flameH * 0.3} r="1.5" fill="#FFE066" opacity="0.7">
              <animate attributeName="cy" values={`${60 - flameH * 0.3};${40 - flameH * 0.3};${60 - flameH * 0.3}`} dur={`${0.8 + i * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.7;0;0.7" dur={`${0.8 + i * 0.3}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}
      {/* Frost overlay when frozen */}
      {frozen && (
        <g>
          <rect x="15" y="40" width="90" height="58" rx="4" fill={ICE_BLUE} opacity="0.4" />
          <text x="60" y="72" textAnchor="middle" fontSize="28" opacity="0.6">❄</text>
        </g>
      )}
    </svg>
  );
}

// ═══ SNOW PARTICLES ═══
function SnowParticles({ intensity = 1, active = true }) {
  // intensity: 0 (no snow) to 3 (blizzard)
  if (!active || intensity === 0) return null;
  const count = intensity * 8;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", borderRadius: 20 }}>
      {[...Array(count)].map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 3;
        const dur = 2 + Math.random() * 2;
        const size = 3 + Math.random() * 5;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${left}%`,
            top: -10,
            width: size,
            height: size,
            background: "white",
            borderRadius: "50%",
            opacity: 0.5 + Math.random() * 0.4,
            animation: `snowFall ${dur}s linear ${delay}s infinite`,
            boxShadow: "0 0 3px rgba(255,255,255,0.5)",
          }} />
        );
      })}
    </div>
  );
}

// ═══ TIMER BAR ═══
function TimerBar({ timeLeft, total }) {
  const pct = (timeLeft / total) * 100;
  const color = pct > 50 ? "#3DA87A" : pct > 25 ? FIRE_ORANGE : FIRE_RED;
  return (
    <div style={{ width: "100%", height: 6, background: "#E8E6E1", borderRadius: 3, marginBottom: 12, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`,
        height: "100%",
        background: color,
        borderRadius: 3,
        transition: "width 0.3s linear, background 0.3s",
      }} />
    </div>
  );
}

// ═══ PROGRESS INDICATORS ═══
function GameProgress({ correctCount, wrongCount }) {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[...Array(5)].map((_, i) => (
          <div key={`s-${i}`} style={{
            width: 18, height: 18, borderRadius: "50%",
            background: i < correctCount ? "#FFB800" : "#F0EDE8",
            border: `2px solid ${i < correctCount ? "#E6A600" : "#D8D5CE"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, transition: "all 0.3s",
          }}>
            {i < correctCount ? "🔥" : ""}
          </div>
        ))}
      </div>
      <div style={{ width: 1, background: LIGHT_BORDER }} />
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {[...Array(3)].map((_, i) => (
          <div key={`w-${i}`} style={{
            width: 18, height: 18, borderRadius: "50%",
            background: i < wrongCount ? ICE_BLUE : "#F0EDE8",
            border: `2px solid ${i < wrongCount ? "#7BB8D0" : "#D8D5CE"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, transition: "all 0.3s",
          }}>
            {i < wrongCount ? "❄" : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══ MAIN GAME COMPONENT ═══
export default function DinoHomeSave({ t, lang }) {
  const [phase, setPhase] = useState("welcome"); // welcome | playing | result_pause | results
  const [chosenDino, setChosenDino] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [fireLevel, setFireLevel] = useState(3); // 0-5
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [timedOut, setTimedOut] = useState(false);
  const [gameResult, setGameResult] = useState(null); // "win" | "lose" | null
  const timerRef = useRef(null);

  const dinoName = chosenDino !== null ? (lang === "zh" ? DINO_NAMES_ZH[chosenDino] : DINO_NAMES_EN[chosenDino]) : "";
  const dinoColor = chosenDino !== null ? DINO_COLORS[chosenDino] : GOLD;

  const snowIntensity = Math.max(0, 3 - fireLevel); // more fire = less snow

  // ── Timer logic ──
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(TIME_LIMIT);
    setTimedOut(false);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setTimedOut(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [stopTimer]);

  // Handle timeout
  useEffect(() => {
    if (timedOut && !answered) {
      setAnswered(true);
      setIsCorrect(false);
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setFireLevel(prev => Math.max(0, prev - 1));
      if (newWrong >= 3) {
        setTimeout(() => {
          setGameResult("lose");
          setPhase("results");
        }, 2000);
      }
    }
  }, [timedOut, answered, wrongCount]);

  // Cleanup on unmount
  useEffect(() => () => stopTimer(), [stopTimer]);

  const startGame = (dinoIdx) => {
    setChosenDino(dinoIdx);
    const picked = pickBalanced(course3Questions, 7, 7);
    setQuestions(picked);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setWrongCount(0);
    setFireLevel(3);
    setTimeLeft(TIME_LIMIT);
    setTimedOut(false);
    setGameResult(null);
    setPhase("playing");
    // Timer will start via effect
  };

  // Start timer when phase is playing and a new question loads
  useEffect(() => {
    if (phase === "playing" && !answered) {
      startTimer();
    }
    return () => stopTimer();
  }, [phase, current, answered, startTimer, stopTimer]);

  const handleSelect = (idx) => {
    if (answered) return;
    stopTimer();
    setSelected(idx);
    setAnswered(true);
    const correct = idx === questions[current].correct;
    setIsCorrect(correct);

    if (correct) {
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setFireLevel(prev => Math.min(5, prev + 1));
      if (newCorrect >= 5) {
        setTimeout(() => {
          setGameResult("win");
          setPhase("results");
        }, 2000);
      }
    } else {
      const newWrong = wrongCount + 1;
      setWrongCount(newWrong);
      setFireLevel(prev => Math.max(0, prev - 1));
      if (newWrong >= 3) {
        setTimeout(() => {
          setGameResult("lose");
          setPhase("results");
        }, 2000);
      }
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1 && !gameResult) {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setIsCorrect(false);
      setTimedOut(false);
      setTimeLeft(TIME_LIMIT);
    } else if (!gameResult) {
      // Reached end of questions without triggering win/lose
      const result = correctCount >= 5 ? "win" : "lose";
      setGameResult(result);
      setPhase("results");
    }
  };

  const reset = () => {
    stopTimer();
    setPhase("welcome");
    setChosenDino(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setIsCorrect(false);
    setCorrectCount(0);
    setWrongCount(0);
    setFireLevel(3);
    setTimeLeft(TIME_LIMIT);
    setTimedOut(false);
    setGameResult(null);
  };

  // ═══ Background color based on fire level ═══
  const bgColor = fireLevel >= 3 ? WARM_BG : fireLevel >= 1 ? "#F5F0E8" : COLD_BG;

  // ═══ WELCOME: Pick a Dino ═══
  if (phase === "welcome") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 28px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <style>{gameAnimations}</style>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏠</div>
        <h3 style={{ fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 8 }}>
          {lang === "zh" ? "拯救恐龍的家" : "Save Dino's Home"}
        </h3>
        <p style={{ fontSize: 15, color: MUTED, maxWidth: 480, margin: "0 auto 8px", lineHeight: 1.6 }}>
          {lang === "zh"
            ? "暴風雪來襲！恐龍的家快被凍住了！在 10 秒內答對數據萃取與偏倚風險的問題，讓壁爐的火焰燃燒，保住恐龍溫暖的家！"
            : "A blizzard is coming! Dino's home is freezing! Answer data extraction & risk of bias questions within 10 seconds to keep the fireplace burning and save dino's warm home!"}
        </p>
        <p style={{ fontSize: 13, color: MUTED, maxWidth: 400, margin: "0 auto 8px", lineHeight: 1.5 }}>
          {lang === "zh"
            ? "🔥 答對 5 題 → 家被拯救！　❄ 答錯 3 題 → 家被凍住！"
            : "🔥 5 correct → Home saved!　❄ 3 wrong → Home frozen!"}
        </p>
        <p style={{ fontSize: 14, color: GOLD, fontWeight: 600, marginBottom: 28 }}>
          {lang === "zh" ? "選一隻恐龍開始 ↓" : "Pick a dino to start ↓"}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
          {DINO_COLORS.map((c, i) => (
            <div key={i} onClick={() => startGame(i)} style={{ cursor: "pointer", textAlign: "center", transition: "all 0.2s", padding: "8px 6px", borderRadius: 12 }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.background = `${c}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "transparent"; }}>
              <CuteDino color={c} size={56} index={i} />
              <div style={{ fontSize: 11, fontWeight: 600, color: c, marginTop: 2 }}>
                {lang === "zh" ? DINO_NAMES_ZH[i] : DINO_NAMES_EN[i]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ═══ RESULTS ═══
  if (phase === "results") {
    const won = gameResult === "win";
    return (
      <div style={{
        background: won ? WARM_BG : COLD_BG,
        borderRadius: 20,
        border: `1px solid ${won ? "#E6D5A8" : "#B8D8EA"}`,
        padding: "48px 28px",
        textAlign: "center",
        boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
        position: "relative",
        overflow: "hidden",
      }}>
        <style>{gameAnimations}</style>
        <SnowParticles intensity={won ? 0 : 2} active={!won} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 48, marginBottom: 12, animation: "foodBounce 0.8s ease-out" }}>
            {won ? "🏠" : "🥶"}
          </div>
          <h3 style={{ fontSize: 26, fontWeight: 700, color: DARK, marginBottom: 8 }}>
            {won
              ? (lang === "zh" ? "家被拯救了！" : "Home Saved!")
              : (lang === "zh" ? "家被凍住了..." : "Home Frozen...")}
          </h3>
          <p style={{ fontSize: 15, color: MUTED, marginBottom: 6, lineHeight: 1.6 }}>
            {won
              ? (lang === "zh"
                ? `${dinoName} 的壁爐熊熊燃燒！你答對了 ${correctCount} 題，成功抵禦了暴風雪！`
                : `${dinoName}'s fireplace is roaring! You got ${correctCount} correct and fought off the blizzard!`)
              : (lang === "zh"
                ? `暴風雪太猛了...${dinoName} 答錯了 ${wrongCount} 題，壁爐的火熄滅了。再試一次！`
                : `The blizzard was too strong... ${dinoName} got ${wrongCount} wrong and the fire went out. Try again!`)}
          </p>

          {/* Dino + fireplace scene */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 16, marginTop: 24, marginBottom: 32 }}>
            <div style={{ animation: won ? "dinoHappyBounce 1s ease-in-out infinite" : "dinoShiver 0.5s ease-in-out infinite" }}>
              <CuteDino color={dinoColor} size={won ? 100 : 80} index={chosenDino} />
            </div>
            <Fireplace fireLevel={won ? 5 : 0} frozen={!won} />
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button onClick={reset} style={btnPrimary}>
              {lang === "zh" ? "再玩一次" : "Play Again"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══ PLAYING ═══
  const q = questions[current];
  const qData = q[lang];

  return (
    <div style={{
      background: bgColor,
      borderRadius: 20,
      border: `1px solid ${fireLevel >= 3 ? "#E6D5A8" : LIGHT_BORDER}`,
      padding: "28px 22px",
      boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
      position: "relative",
      overflow: "hidden",
      transition: "background 0.5s, border-color 0.5s",
    }}>
      <style>{gameAnimations}</style>
      <SnowParticles intensity={snowIntensity} active={phase === "playing"} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Progress */}
        <GameProgress correctCount={correctCount} wrongCount={wrongCount} />

        {/* Scene: Dino + Fireplace */}
        <div style={{
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          gap: 12, marginBottom: 16, minHeight: 110,
        }}>
          <div style={{
            animation: answered
              ? (isCorrect ? "dinoHappyBounce 0.6s ease-in-out" : "dinoShiver 0.5s ease-in-out infinite")
              : (fireLevel <= 1 ? "dinoShiver 2s ease-in-out infinite" : "none"),
          }}>
            <CuteDino color={dinoColor} size={64} index={chosenDino} />
          </div>
          <Fireplace fireLevel={fireLevel} frozen={false} />
        </div>

        {/* Timer */}
        {!answered && <TimerBar timeLeft={timeLeft} total={TIME_LIMIT} />}

        {/* Question counter + timer display */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>
            {lang === "zh" ? `第 ${current + 1} / ${questions.length} 題` : `Q ${current + 1} / ${questions.length}`}
          </span>
          {!answered && (
            <span style={{
              fontSize: 14, fontWeight: 700,
              color: timeLeft <= 3 ? FIRE_RED : timeLeft <= 5 ? FIRE_ORANGE : "#3DA87A",
              animation: timeLeft <= 3 ? "timerPulse 0.5s ease-in-out infinite" : "none",
            }}>
              ⏱ {timeLeft}s
            </span>
          )}
        </div>

        {/* Question */}
        <h3 style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 16, lineHeight: 1.55 }}>{qData.q}</h3>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
          {qData.opts.map((opt, idx) => {
            let bg = "#FAFAF7", border = LIGHT_BORDER, col = DARK, fw = 400;
            if (answered) {
              if (idx === q.correct) { bg = "#E6F5F0"; border = "#3DA87A"; col = "#2A7A5A"; fw = 600; }
              else if (idx === selected && idx !== q.correct) { bg = "#FDEEEB"; border = "#D94B2E"; col = "#B83A20"; }
              else if (timedOut && idx !== q.correct) { /* leave default */ }
            } else if (idx === selected) {
              bg = `${GOLD}12`; border = GOLD;
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} disabled={answered}
                style={{
                  background: bg, border: `1.5px solid ${border}`, borderRadius: 12,
                  padding: "11px 14px", textAlign: "left", fontSize: 14, color: col,
                  cursor: answered ? "default" : "pointer", transition: "all 0.2s",
                  fontWeight: fw, lineHeight: 1.5, opacity: 1,
                }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: "50%",
                  border: `1.5px solid ${answered && idx === q.correct ? "#3DA87A" : border}`,
                  fontSize: 11, fontWeight: 600, marginRight: 10,
                  background: answered && idx === q.correct ? "#3DA87A" : "transparent",
                  color: answered && idx === q.correct ? "#FFF" : col,
                }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Timeout feedback */}
        {timedOut && !isCorrect && answered && (
          <div style={{
            background: "#FDEEEB", borderRadius: 12, padding: "14px 16px",
            marginBottom: 14, fontSize: 13.5, lineHeight: 1.65, color: MUTED,
            border: "1px solid #D94B2E33",
            animation: "fadeInUp 0.3s ease-out",
          }}>
            <strong style={{ color: "#B83A20" }}>
              {lang === "zh" ? "⏰ 時間到！火焰變弱了..." : "⏰ Time's up! The fire dims..."}
            </strong>{" "}{qData.exp}
            {!gameResult && (
              <div style={{ textAlign: "right", marginTop: 10 }}>
                <button onClick={nextQuestion} style={btnPrimary}>
                  {current < questions.length - 1
                    ? (lang === "zh" ? "下一題 →" : "Next →")
                    : (lang === "zh" ? "看結果" : "See Results")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Wrong answer feedback */}
        {answered && !isCorrect && !timedOut && (
          <div style={{
            background: "#FDEEEB", borderRadius: 12, padding: "14px 16px",
            marginBottom: 14, fontSize: 13.5, lineHeight: 1.65, color: MUTED,
            border: "1px solid #D94B2E33",
            animation: "fadeInUp 0.3s ease-out",
          }}>
            <strong style={{ color: "#B83A20" }}>
              {lang === "zh" ? "❌ 答錯了！火焰變弱了..." : "❌ Wrong! The fire dims..."}
            </strong>{" "}{qData.exp}
            {!gameResult && (
              <div style={{ textAlign: "right", marginTop: 10 }}>
                <button onClick={nextQuestion} style={btnPrimary}>
                  {current < questions.length - 1
                    ? (lang === "zh" ? "下一題 →" : "Next →")
                    : (lang === "zh" ? "看結果" : "See Results")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Correct feedback */}
        {answered && isCorrect && (
          <div style={{
            background: "#FFF8EE", borderRadius: 12, padding: "14px 16px",
            marginBottom: 14, fontSize: 13.5, lineHeight: 1.65, color: MUTED,
            border: `1px solid ${GOLD}33`,
            animation: "fadeInUp 0.3s ease-out",
          }}>
            <strong style={{ color: "#9A7B2E" }}>
              {lang === "zh" ? "🔥 答對了！火焰更旺了！" : "🔥 Correct! The fire grows!"}
            </strong>{" "}{qData.exp}
            {!gameResult && (
              <div style={{ textAlign: "right", marginTop: 10 }}>
                <button onClick={nextQuestion} style={btnPrimary}>
                  {current < questions.length - 1
                    ? (lang === "zh" ? "下一題 →" : "Next →")
                    : (lang === "zh" ? "看結果" : "See Results")}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ CSS ANIMATIONS ═══
const gameAnimations = `
@keyframes snowFall {
  0% { transform: translateY(-10px) rotate(0deg); opacity: 0; }
  10% { opacity: 0.7; }
  90% { opacity: 0.5; }
  100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
}
@keyframes dinoHappyBounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(-3deg); }
  75% { transform: translateY(-4px) rotate(3deg); }
}
@keyframes dinoShiver {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-3px); }
  40% { transform: translateX(3px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}
@keyframes timerPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
@keyframes fadeInUp {
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes foodBounce {
  0% { transform: translateY(0); }
  30% { transform: translateY(-12px); }
  50% { transform: translateY(0); }
  70% { transform: translateY(-6px); }
  100% { transform: translateY(0); }
}
`;
