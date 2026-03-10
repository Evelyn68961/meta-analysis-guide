import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";
import SiteNav from "./SiteNav";
import DinoFoodRescue from "./DinoFoodRescue";

// ═══ DESIGN TOKENS (matching existing site) ═══
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const PURPLE = "#7B68C8";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";

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
      <div style={{ width: 24, height: 2, background: PURPLE, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: PURPLE }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 640, ...style }}>{children}</p>;
}

const btnPrimary = { background: PURPLE, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };

// ═══ DATABASE CARD ═══
function DatabaseCard({ icon, name, desc, color, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ background: CARD_BG, border: `1.5px solid ${hovered ? color + "55" : LIGHT_BORDER}`, borderRadius: 16, padding: "24px 22px", transition: "all 0.3s", boxShadow: hovered ? `0 8px 28px ${color}15` : "none", transform: hovered ? "translateY(-3px)" : "translateY(0)", height: "100%" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 6 }}>{name}</h4>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: MUTED }}>{desc}</p>
      </div>
    </FadeIn>
  );
}

// ═══ BOOLEAN LOGIC VISUALIZER ═══
function BooleanVisualizer({ t, lang }) {
  const [activeOp, setActiveOp] = useState(null);

  const operators = [
    {
      op: "AND",
      color: "#3DA87A",
      icon: "∩",
      titleKey: "c2boolAndTitle",
      descKey: "c2boolAndDesc",
      exampleKey: "c2boolAndExample",
      // Venn: intersection only
      render: (size) => {
        const r = size * 0.32;
        const cx1 = size * 0.38, cx2 = size * 0.62, cy = size * 0.5;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <clipPath id="clip-left"><circle cx={cx1} cy={cy} r={r} /></clipPath>
              <clipPath id="clip-right"><circle cx={cx2} cy={cy} r={r} /></clipPath>
            </defs>
            <circle cx={cx1} cy={cy} r={r} fill="#3DA87A22" stroke="#3DA87A" strokeWidth="2" />
            <circle cx={cx2} cy={cy} r={r} fill="#3DA87A22" stroke="#3DA87A" strokeWidth="2" />
            <circle cx={cx2} cy={cy} r={r} fill="#3DA87A66" clipPath="url(#clip-left)" />
            <text x={cx1 - r * 0.4} y={cy - r * 0.1} fontSize="10" fill={MUTED} textAnchor="middle">{lang === "zh" ? "心衰竭" : "Heart Failure"}</text>
            <text x={cx2 + r * 0.4} y={cy - r * 0.1} fontSize="10" fill={MUTED} textAnchor="middle">SGLT2i</text>
            <text x={size * 0.5} y={cy + 4} fontSize="10" fill="#2A7A5A" fontWeight="700" textAnchor="middle">AND</text>
          </svg>
        );
      }
    },
    {
      op: "OR",
      color: "#7B68C8",
      icon: "∪",
      titleKey: "c2boolOrTitle",
      descKey: "c2boolOrDesc",
      exampleKey: "c2boolOrExample",
      render: (size) => {
        const r = size * 0.32;
        const cx1 = size * 0.38, cx2 = size * 0.62, cy = size * 0.5;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle cx={cx1} cy={cy} r={r} fill="#7B68C844" stroke="#7B68C8" strokeWidth="2" />
            <circle cx={cx2} cy={cy} r={r} fill="#7B68C844" stroke="#7B68C8" strokeWidth="2" />
            <text x={cx1 - r * 0.35} y={cy + 4} fontSize="9" fill={MUTED} textAnchor="middle">{lang === "zh" ? "糖尿病" : "Diabetes"}</text>
            <text x={cx2 + r * 0.35} y={cy + 4} fontSize="9" fill={MUTED} textAnchor="middle">{lang === "zh" ? "血糖" : "Glycemia"}</text>
            <text x={size * 0.5} y={size - 10} fontSize="10" fill="#7B68C8" fontWeight="700" textAnchor="middle">OR</text>
          </svg>
        );
      }
    },
    {
      op: "NOT",
      color: "#D94B2E",
      icon: "−",
      titleKey: "c2boolNotTitle",
      descKey: "c2boolNotDesc",
      exampleKey: "c2boolNotExample",
      render: (size) => {
        const r = size * 0.32;
        const cx1 = size * 0.38, cx2 = size * 0.62, cy = size * 0.5;
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <defs>
              <clipPath id="clip-not-right"><circle cx={cx2} cy={cy} r={r} /></clipPath>
            </defs>
            <circle cx={cx1} cy={cy} r={r} fill="#D94B2E33" stroke="#D94B2E" strokeWidth="2" />
            <circle cx={cx2} cy={cy} r={r} fill="#F5F5F3" stroke="#CCC" strokeWidth="1.5" strokeDasharray="4 3" />
            <circle cx={cx1} cy={cy} r={r} fill="white" clipPath="url(#clip-not-right)" />
            <circle cx={cx1} cy={cy} r={r} fill="#D94B2E33" clipPath="url(#clip-not-right)" opacity="0" />
            <text x={cx1 - r * 0.4} y={cy + 4} fontSize="9" fill={MUTED} textAnchor="middle">{lang === "zh" ? "癌症" : "Cancer"}</text>
            <text x={cx2 + r * 0.35} y={cy + 4} fontSize="9" fill="#CCC" textAnchor="middle">{lang === "zh" ? "動物" : "Animal"}</text>
            <text x={size * 0.5} y={size - 10} fontSize="10" fill="#D94B2E" fontWeight="700" textAnchor="middle">NOT</text>
          </svg>
        );
      }
    }
  ];

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 8, textAlign: "center" }}>{t("c2boolTitle")}</h3>
      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", marginBottom: 24 }}>{t("c2boolDesc")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {operators.map((op, i) => (
          <div key={op.op} onClick={() => setActiveOp(activeOp === i ? null : i)}
            style={{ background: activeOp === i ? `${op.color}0A` : "#FAFAF7", border: `2px solid ${activeOp === i ? op.color : LIGHT_BORDER}`, borderRadius: 14, padding: "16px 12px", textAlign: "center", cursor: "pointer", transition: "all 0.3s" }}>
            <div style={{ marginBottom: 8 }}>{op.render(120)}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: op.color, letterSpacing: 1 }}>{op.op}</div>
          </div>
        ))}
      </div>

      {/* Explanation panel */}
      <div style={{ minHeight: 80, padding: "14px 18px", background: activeOp !== null ? `${operators[activeOp].color}08` : "transparent", borderRadius: 12, transition: "all 0.3s", border: activeOp !== null ? `1px solid ${operators[activeOp].color}22` : "1px solid transparent" }}>
        {activeOp !== null ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: operators[activeOp].color, marginBottom: 6 }}>{t(operators[activeOp].titleKey)}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, marginBottom: 8 }}>{t(operators[activeOp].descKey)}</div>
            <div style={{ background: `${operators[activeOp].color}0D`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: operators[activeOp].color, fontWeight: 500, fontFamily: "monospace" }}>{t(operators[activeOp].exampleKey)}</div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: "#B0AFAA", textAlign: "center", paddingTop: 12 }}>{t("c2boolClickHint")}</div>
        )}
      </div>
    </div>
  );
}

// ═══ INTERACTIVE PRISMA FLOW DIAGRAM ═══
function PrismaFlowDiagram({ t, lang }) {
  const [activeStep, setActiveStep] = useState(null);
  const [animPhase, setAnimPhase] = useState("idle"); // idle | running | done

  const steps = [
    { id: "identification", color: "#7B68C8", numKey: "c2prismaIdNum", labelKey: "c2prismaIdLabel", descKey: "c2prismaIdDesc", icon: "🔍" },
    { id: "duplicates", color: "#D4A843", numKey: "c2prismaDupNum", labelKey: "c2prismaDupLabel", descKey: "c2prismaDupDesc", icon: "📋" },
    { id: "screening", color: "#E8734A", numKey: "c2prismaScreenNum", labelKey: "c2prismaScreenLabel", descKey: "c2prismaScreenDesc", icon: "📄" },
    { id: "eligibility", color: "#5B9E5F", numKey: "c2prismaEligNum", labelKey: "c2prismaEligLabel", descKey: "c2prismaEligDesc", icon: "✅" },
    { id: "included", color: "#0E7C86", numKey: "c2prismaInclNum", labelKey: "c2prismaInclLabel", descKey: "c2prismaInclDesc", icon: "📊" },
  ];

  const runAnimation = () => {
    setAnimPhase("running");
    setActiveStep(null);
    let i = 0;
    const interval = setInterval(() => {
      setActiveStep(i);
      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => setAnimPhase("done"), 600);
      }
    }, 900);
  };

  const reset = () => { setAnimPhase("idle"); setActiveStep(null); };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 6 }}>{t("c2prismaTitle")}</h3>
        <p style={{ fontSize: 14, color: MUTED }}>{t("c2prismaDesc")}</p>
      </div>

      {/* Flow diagram */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, marginBottom: 24 }}>
        {steps.map((step, i) => {
          const isActive = activeStep !== null && i <= activeStep;
          const isCurrent = activeStep === i;
          const isExcluded = step.id === "duplicates" || step.id === "screening" || step.id === "eligibility";
          const nums = t(step.numKey);

          return (
            <div key={step.id} style={{ width: "100%", maxWidth: 480 }}>
              {/* Arrow connector */}
              {i > 0 && (
                <div style={{ display: "flex", justifyContent: "center", height: 28 }}>
                  <div style={{ width: 2, height: "100%", background: isActive ? step.color : LIGHT_BORDER, transition: "background 0.5s" }} />
                </div>
              )}

              {/* Step box */}
              <div style={{ display: "flex", gap: 12, alignItems: "stretch" }}>
                <div onClick={() => animPhase !== "running" && setActiveStep(activeStep === i ? null : i)}
                  style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 14,
                    background: isCurrent ? `${step.color}12` : isActive ? `${step.color}08` : "#FAFAF7",
                    border: `2px solid ${isCurrent ? step.color : isActive ? step.color + "44" : LIGHT_BORDER}`,
                    borderRadius: 14, padding: "16px 18px", cursor: "pointer",
                    transition: "all 0.5s", transform: isCurrent ? "scale(1.02)" : "scale(1)",
                    boxShadow: isCurrent ? `0 4px 20px ${step.color}22` : "none",
                  }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: isActive ? step.color : "#E8E6E1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, transition: "all 0.5s", flexShrink: 0 }}>
                    {isActive ? <span style={{ filter: "brightness(10)" }}>{step.icon}</span> : step.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? step.color : MUTED, marginBottom: 2 }}>{t(step.labelKey)}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: isActive ? step.color : "#C0BFB9", transition: "color 0.5s" }}>{nums}</div>
                  </div>
                </div>

                {/* Exclusion branch for screening steps */}
                {isExcluded && (
                  <div style={{
                    width: 140, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isActive ? "#FDEEEB" : "#F5F5F3", border: `1.5px dashed ${isActive ? "#D94B2E66" : LIGHT_BORDER}`,
                    borderRadius: 10, padding: "8px 12px", fontSize: 12, color: isActive ? "#B83A20" : "#C0BFB9",
                    transition: "all 0.5s", textAlign: "center", lineHeight: 1.4,
                  }}>
                    {t(`c2prisma${step.id.charAt(0).toUpperCase() + step.id.slice(1)}Excl`)}
                  </div>
                )}
              </div>

              {/* Expanded description */}
              {activeStep === i && animPhase !== "running" && (
                <div style={{ margin: "10px 0 0", padding: "12px 16px", background: `${step.color}06`, borderRadius: 10, border: `1px solid ${step.color}18`, fontSize: 13.5, lineHeight: 1.65, color: MUTED, animation: "fadeInUp 0.3s ease-out" }}>
                  {t(step.descKey)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {animPhase === "idle" && (
          <button onClick={runAnimation} style={btnPrimary}>{t("c2prismaRunBtn")}</button>
        )}
        {animPhase === "done" && (
          <button onClick={reset} style={{ background: "transparent", border: `1.5px solid ${PURPLE}`, color: PURPLE, padding: "11px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {t("c2prismaResetBtn")}
          </button>
        )}
        {animPhase === "running" && (
          <span style={{ fontSize: 13, color: PURPLE, fontWeight: 500 }}>{t("c2prismaRunning")}</span>
        )}
      </div>
    </div>
  );
}



// ═══ AI SEARCH STRATEGY WORKSHOP ═══
function AISearchWorkshop({ t, lang }) {
  const [topic, setTopic] = useState("");
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setStrategy(null);

    const systemPrompt = lang === "zh"
      ? `你是一位系統性文獻回顧搜尋策略教學助手。學生會給你一個研究主題，請用繁體中文幫助他們建立搜尋策略。回覆格式：
1. 先用一句話確認研究主題
2. 建議 3-4 個搜尋概念（基於 PICO）
3. 每個概念列出 3-5 個關鍵字/MeSH 詞
4. 示範如何用 AND/OR 組合
5. 給一個完整的 PubMed 搜尋語法範例
保持簡潔，不要使用 Markdown 格式。用純文字和換行。`
      : `You are a systematic review search strategy teaching assistant. The student gives you a research topic. Help them build a search strategy. Format:
1. Confirm the research topic in one sentence
2. Suggest 3-4 search concepts (based on PICO)
3. List 3-5 keywords/MeSH terms per concept
4. Show how to combine with AND/OR
5. Give a complete PubMed search syntax example
Be concise. Don't use Markdown formatting. Use plain text with line breaks.`;

    try {
      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: systemPrompt,
          userMessage: topic,
        }),
      });
      const data = await response.json();
      const text = data.content?.map(item => item.text || "").join("") || (lang === "zh" ? "無法取得回饋" : "Could not get feedback.");
      setStrategy(text);
    } catch (err) {
      setStrategy(lang === "zh" ? "連線錯誤，請檢查網路後重試。" : "Connection error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 12 }}>{t("c2aiInstructions")}</h4>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <textarea
          value={topic}
          onChange={(e) => { setTopic(e.target.value); setStrategy(null); }}
          placeholder={t("c2aiPlaceholder")}
          rows={3}
          style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${LIGHT_BORDER}`, fontSize: 14, lineHeight: 1.6, color: DARK, background: "#FAFAF7", resize: "vertical", outline: "none", transition: "border-color 0.2s" }}
        />
      </div>
      <button
        onClick={generateStrategy}
        disabled={!topic.trim() || loading}
        style={{
          background: topic.trim() ? PURPLE : "#E8E6E1",
          border: "none", color: topic.trim() ? "#FFF" : MUTED,
          padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600,
          cursor: topic.trim() ? "pointer" : "default",
          transition: "all 0.2s", width: "100%",
          boxShadow: topic.trim() ? `0 2px 12px ${PURPLE}33` : "none",
        }}
      >
        {loading ? (lang === "zh" ? "正在生成搜尋策略…" : "Generating search strategy…") : t("c2aiGenerate")}
      </button>

      {strategy && (
        <div style={{ marginTop: 16, padding: "18px 20px", borderRadius: 14, background: `${PURPLE}06`, border: `1.5px solid ${PURPLE}22`, fontSize: 14, lineHeight: 1.7, color: DARK, whiteSpace: "pre-wrap", animation: "fadeInUp 0.3s ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE, marginBottom: 8 }}>{lang === "zh" ? "AI 生成的搜尋策略" : "AI-Generated Search Strategy"}</div>
          {strategy}
        </div>
      )}
    </div>
  );
}

// ═══ MAIN COURSE COMPONENT ═══
export default function Course2({ onNavigate, user, onLogin, onLogout }) {
  const { t, lang, toggleLang } = useI18n();
  const [activeSection, setActiveSection] = useState("hero");

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // Track which section is in view
  useEffect(() => {
    const sectionIds = ["hero", "s1", "s2", "s3", "s4", "s5", "game", "ai-workshop"];
    const observers = [];
    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: "-60px 0px -40% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const catalogItems = [
    { id: "s1", num: 1, label: lang === "zh" ? "為什麼要系統性搜尋" : "Why Systematic Search" },
    { id: "s2", num: 2, label: lang === "zh" ? "文獻資料庫" : "Database Overview" },
    { id: "s3", num: 3, label: lang === "zh" ? "布林邏輯" : "Boolean Operators" },
    { id: "s4", num: 4, label: lang === "zh" ? "PRISMA 流程圖" : "PRISMA Flow" },
    { id: "s5", num: 5, label: lang === "zh" ? "篩選技巧" : "Screening Tips" },
    { id: "game", num: 6, label: lang === "zh" ? "恐龍食物救援" : "Dino Food Rescue" },
    { id: "ai-workshop", num: 7, label: lang === "zh" ? "AI 工作坊" : "AI Workshop" },
  ];

  return (
    <div style={{ background: LIGHT_BG, color: DARK, minHeight: "100vh", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${PURPLE}22; color: ${DARK}; }
        @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
        textarea:focus { border-color: ${PURPLE}66 !important; box-shadow: 0 0 0 3px ${PURPLE}0D; }
        @media (max-width: 1099px) {
          .sidebar-catalog { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>

      {/* SIDEBAR CATALOG — sticky on left, desktop ≥1100px only */}
      <div className="sidebar-catalog" style={{
        position: "fixed", top: 76, left: 0, width: 200, zIndex: 50,
        padding: "20px 16px 20px 20px",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: PURPLE, marginBottom: 10, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
          {lang === "zh" ? "課程大綱" : "Contents"}
        </div>
        {catalogItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 8,
              transition: "all 0.25s",
              borderLeft: `2.5px solid ${isActive ? PURPLE : "transparent"}`,
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: isActive ? PURPLE : "#C0BFB9",
                fontFamily: "'Noto Sans TC', 'Outfit', sans-serif",
                minWidth: 16, textAlign: "right",
                transition: "color 0.25s",
              }}>{item.num}</span>
              <span style={{
                fontSize: 12.5, fontWeight: isActive ? 600 : 400,
                color: isActive ? DARK : MUTED,
                fontFamily: "'Noto Sans TC', 'Outfit', sans-serif",
                textAlign: "left", lineHeight: 1.35,
                transition: "all 0.25s",
              }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT — shifted right on wide screens for sidebar */}
      <div className="main-content" style={{ marginLeft: 200 }}>

      {/* NAV */}
      <SiteNav
        onNavigate={onNavigate}
        user={user} onLogin={onLogin} onLogout={onLogout}
        courseId="course2"
        courseLabel={t("c2Label")}
        courseColor="#7B68C8"
      />

      {/* HERO */}
      <section id="hero" style={{ paddingTop: 100, paddingBottom: 64, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #C8C6C0 0.8px, transparent 0.8px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${PURPLE}0A, transparent 70%)`, pointerEvents: "none" }} />
        <FadeIn>
          <div style={{ padding: "0 24px", maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
            <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: DARK }}>
              {t("c2Title")}
            </h1>
            <p style={{ fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 32px" }}>{t("c2Desc")}</p>
            <button onClick={() => scrollTo("s1")} style={{ ...btnPrimary, padding: "14px 32px", fontSize: 15, borderRadius: 12, boxShadow: `0 4px 20px ${PURPLE}33` }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 28px ${PURPLE}44`; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 20px ${PURPLE}33`; }}>
              {t("c2StartBtn")}
            </button>
          </div>
        </FadeIn>
      </section>

      {/* S1: Why Systematic Search Matters */}
      <section id="s1" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s1Label")} /><SectionTitle>{t("c2s1Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c2s1Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
            <FadeIn delay={0.15}>
              <div style={{ background: "#FDEEEB", border: `1px solid ${CORAL}22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: CORAL, marginBottom: 10 }}>{t("c2s1Bad")}</h4>
                <p style={{ fontSize: 17, fontWeight: 600, color: "#B83A20", marginBottom: 10, fontStyle: "italic" }}>{t("c2s1BadEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("c2s1BadWhy")}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ background: "#E6F5F0", border: `1px solid #3DA87A22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10 }}>{t("c2s1Good")}</h4>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10, lineHeight: 1.5 }}>{t("c2s1GoodEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("c2s1GoodWhy")}</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s2")} style={btnPrimary}>{t("c2s1Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S2: Database Overview */}
      <section id="s2" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s2Label")} /><SectionTitle>{t("c2s2Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c2s2Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 32 }}>
            <DatabaseCard icon="🏥" name="PubMed / MEDLINE" desc={t("c2dbPubmed")} color={PURPLE} delay={0.15} />
            <DatabaseCard icon="🔬" name="Embase" desc={t("c2dbEmbase")} color="#D4A843" delay={0.2} />
            <DatabaseCard icon="📚" name="Cochrane Library" desc={t("c2dbCochrane")} color={TEAL} delay={0.25} />
            <DatabaseCard icon="🧪" name="Web of Science" desc={t("c2dbWos")} color={CORAL} delay={0.3} />
            <DatabaseCard icon="📖" name="CINAHL" desc={t("c2dbCinahl")} color="#5B9E5F" delay={0.35} />
            <DatabaseCard icon="🌐" name={t("c2dbGreyName")} desc={t("c2dbGrey")} color="#C45B8A" delay={0.4} />
          </div>
          <FadeIn delay={0.45}>
            <div style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: PURPLE }}>💡 {t("c2s2Tip")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.5}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s3")} style={btnPrimary}>{t("c2s2Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S3: Boolean Operators */}
      <section id="s3" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s3Label")} /><SectionTitle>{t("c2s3Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c2s3Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><BooleanVisualizer t={t} lang={lang} /></FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ marginTop: 28, background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 16, padding: "24px 22px" }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 14 }}>{t("c2s3ComboTitle")}</h4>
              <div style={{ background: "#FAFAF7", borderRadius: 10, padding: "14px 18px", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8, color: DARK, overflowX: "auto" }}>
                (<span style={{ color: CORAL }}>heart failure</span> <span style={{ color: "#7B68C8", fontWeight: 700 }}>OR</span> <span style={{ color: CORAL }}>cardiac insufficiency</span> <span style={{ color: "#7B68C8", fontWeight: 700 }}>OR</span> <span style={{ color: CORAL }}>HFrEF</span>)<br />
                <span style={{ color: "#3DA87A", fontWeight: 700 }}>AND</span><br />
                (<span style={{ color: "#D4A843" }}>SGLT2 inhibitor</span> <span style={{ color: "#7B68C8", fontWeight: 700 }}>OR</span> <span style={{ color: "#D4A843" }}>dapagliflozin</span> <span style={{ color: "#7B68C8", fontWeight: 700 }}>OR</span> <span style={{ color: "#D4A843" }}>empagliflozin</span>)<br />
                <span style={{ color: "#3DA87A", fontWeight: 700 }}>AND</span><br />
                (<span style={{ color: "#5B9E5F" }}>mortality</span> <span style={{ color: "#7B68C8", fontWeight: 700 }}>OR</span> <span style={{ color: "#5B9E5F" }}>hospitalization</span> <span style={{ color: "#7B68C8", fontWeight: 700 }}>OR</span> <span style={{ color: "#5B9E5F" }}>clinical outcome</span>)
              </div>
              <p style={{ fontSize: 13, color: MUTED, marginTop: 12, lineHeight: 1.6 }}>{t("c2s3ComboDesc")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s4")} style={btnPrimary}>{t("c2s3Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S4: PRISMA Flow */}
      <section id="s4" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s4Label")} /><SectionTitle>{t("c2s4Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c2s4Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><PrismaFlowDiagram t={t} lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s5")} style={btnPrimary}>{t("c2s4Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S5: Screening Tips */}
      <section id="s5" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s5Label")} /><SectionTitle>{t("c2s5Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c2s5Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {[1, 2, 3, 4].map(n => (
              <FadeIn key={n} delay={n * 0.05}>
                <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "22px 20px", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${PURPLE}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: PURPLE, flexShrink: 0 }}>{n}</div>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{t(`c2tip${n}Title`)}</h4>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t(`c2tip${n}Desc`)}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign: "center", marginTop: 32 }}><button onClick={() => scrollTo("game")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>{t("c2s5Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* GAME */}
      <section id="game" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2gameLabel")} /></FadeIn>
          <FadeIn delay={0.1}><DinoFoodRescue t={t} lang={lang} /></FadeIn>
        </div>
      </section>

      {/* AI WORKSHOP */}
      <section id="ai-workshop" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2aiLabel")} /><SectionTitle>{t("c2aiTitle")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c2aiDesc")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><AISearchWorkshop t={t} lang={lang} /></FadeIn>
        </div>
      </section>

      </div>{/* end .main-content */}

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG, marginLeft: 0 }}>
        {onNavigate && (
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("course1")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "← 回到 Course 1" : "← Back to Course 1"}
            </button>
            <button onClick={() => onNavigate("hub")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "課程總覽" : "Course Hub"}
            </button>
            <button onClick={() => onNavigate("course3")} style={{ background: PURPLE, border: "none", color: "#FFF", padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", boxShadow: `0 2px 12px ${PURPLE}33` }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; }}>
              {lang === "zh" ? "前往 Course 3：數據萃取 →" : "Next: Course 3 — Data Extraction →"}
            </button>
          </div>
        )}
        <p style={{ fontSize: 13, color: "#B0AFAA", lineHeight: 1.8 }}>Meta-Analysis 101 — {t("c2Label")}: {t("c2Subtitle")}</p>
        <div style={{ marginTop: 12, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>統合分析 101</div>
      </footer>
    </div>
  );
}
