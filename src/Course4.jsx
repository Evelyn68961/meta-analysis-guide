import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";
import SiteNav from "./SiteNav";
import DinoKeyQuest from "./DinoKeyQuest";

// ═══ DESIGN TOKENS ═══
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const BLUE = "#2E86C1";      // Course 4 accent
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const GREEN = "#3DA87A";
const RED = "#D94B2E";

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
      <div style={{ width: 24, height: 2, background: BLUE, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: BLUE }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 880, ...style }}>{children}</p>;
}

const btnPrimary = { background: BLUE, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}


// ═══ INTERACTIVE: EFFECT SIZE TYPE CARDS (Section 2) ═══
function EffectSizeCards({ lang }) {
  const [active, setActive] = useState(null);

  const cards = [
    {
      key: "or", icon: "🎯",
      en: "Odds Ratio (OR)", zh: "勝算比 (OR)",
      tagEn: "Binary outcomes", tagZh: "二分類結果",
      descEn: <>Compares the odds of an event between groups.<br />Used in case-control studies and RCTs with binary outcomes.</>,
      descZh: <>比較兩組事件發生的「勝算」。<br />適用於病例對照研究及二分類結局的 RCT。</>,
      formulaEn: <>(events_A ÷ non-events_A)÷ (events_B ÷ non-events_B)</>,
      formulaZh: <>(A組事件數 ÷ A組非事件數)÷ (B組事件數 ÷ B組非事件數)</>,
      exEn: <>New antibiotic: <br />{" "}15/100 infection vs 30/100 control → OR ≈ 0.42</>,
      exZh: <>新抗生素：<br />{" "}治療組 15/100 感染 vs 對照組 30/100 → OR ≈ 0.42</>,
      nullVal: "1",
    },
    {
      key: "rr", icon: "📊",
      en: "Risk Ratio (RR)", zh: "風險比 (RR)",
      tagEn: "Binary outcomes", tagZh: "二分類結果",
      descEn: <>Compares the risk (probability) of an event between groups.<br />More intuitive than OR for cohort/RCT data.</>,
      descZh: <>比較兩組事件發生的「風險（機率）」。<br />在世代研究或 RCT 中比 OR 更直觀。</>,
      formulaEn: <>(events_A ÷ total_A)÷ (events_B ÷ total_B)</>,
      formulaZh: <>(A組事件數 ÷ A組總人數)÷ (B組事件數 ÷ B組總人數)</>,
      exEn: <>Statin: <br />5% MI vs 8% placebo → RR = 0.625 (37.5% risk reduction)</>,
      exZh: <>Statin 治療：<br />MI 5% vs 安慰劑 8% → RR = 0.625（降低 37.5% 風險）</>,
      nullVal: "1",
    },
    {
      key: "md", icon: "📏",
      en: "Mean Difference (MD)", zh: "均差 (MD)",
      tagEn: "Continuous, same scale", tagZh: "連續性、相同量表",
      descEn: <>The simple difference in means between groups.<br />Used when all studies measure the outcome on the same scale.</>,
      descZh: <>兩組均值的直接差異。<br />當所有研究使用相同量表（如 mmHg）時使用。</>,
      formulaEn: "MD = mean_A − mean_B",
      formulaZh: "MD = A組均值 − B組均值",
      exEn: <>BP drug: <br />treatment −12 mmHg, control −7 mmHg <br />→ MD = −5 mmHg</>,
      exZh: <>降壓藥：<br />治療組降 12 mmHg，對照組降 7 mmHg <br />→ MD = −5 mmHg</>,
      nullVal: "0",
    },
    {
      key: "smd", icon: "📐",
      en: "SMD (Cohen's d)", zh: "標準化均差 (SMD)",
      tagEn: "Continuous, different scales", tagZh: "連續性、不同量表",
      descEn: <>Standardizes the mean difference in SD units.<br />Needed when studies use different scales for the same concept.</>,
      descZh: <>將均差標準化為 SD 倍數。<br />當不同研究用不同量表測量同一概念時使用。</>,
      formulaEn: "SMD = (mean_A − mean_B) ÷ pooled SD",
      formulaZh: "SMD = (A組均值 − B組均值) ÷ 共同標準差",
      exEn: <>Pain: <br />VAS (0-100) and NRS (0-10) → SMD makes them comparable</>,
      exZh: <>疼痛：<br />VAS (0-100) 和 NRS (0-10) → SMD 讓它們可以比較</>,
      nullVal: "0",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
      {cards.map((c) => {
        const isActive = active === c.key;
        return (
          <div key={c.key} onClick={() => setActive(isActive ? null : c.key)}
            style={{
              background: isActive ? `${BLUE}08` : CARD_BG,
              border: `2px solid ${isActive ? BLUE : LIGHT_BORDER}`,
              borderRadius: 16, padding: "24px 22px", cursor: "pointer",
              transition: "all 0.3s", boxShadow: isActive ? `0 4px 20px ${BLUE}15` : "0 2px 12px rgba(0,0,0,0.03)",
            }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{c.icon}</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: isActive ? BLUE : DARK, marginBottom: 6, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{c[lang]}</h4>
            <div style={{ display: "inline-block", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 6, background: `${BLUE}0D`, color: BLUE, marginBottom: 12, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
              {lang === "zh" ? c.tagZh : c.tagEn}
            </div>
            {isActive && (
              <div style={{ animation: "fadeInCard 0.3s ease-out" }}>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 12, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
                  {lang === "zh" ? c.descZh : c.descEn}
                </p>
                <div style={{ background: `${BLUE}08`, borderRadius: 8, padding: "10px 14px", fontFamily: "'Noto Sans TC', monospace", fontSize: 14, color: DARK, marginBottom: 10, lineHeight: 1.6 }}>
                  {lang === "zh" ? c.formulaZh : c.formulaEn}
                </div>
                <div style={{ fontSize: 14, color: GREEN, lineHeight: 1.6, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
                  💊 {lang === "zh" ? c.exZh : c.exEn}
                </div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 10, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
                  {lang === "zh" ? `無效線：${c.nullVal}` : `Line of no effect: ${c.nullVal}`}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes fadeInCard { 0% { opacity:0; transform:translateY(6px); } 100% { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}


// ═══ INTERACTIVE: WEIGHTING DEMO (Section 3) ═══
function WeightingDemo({ lang }) {
  const [showWeighted, setShowWeighted] = useState(true);
  // Two studies: small (n=30, ES=0.8) vs large (n=3000, ES=0.3)
  const studies = [
    { label: lang === "zh" ? "小型研究 (n=30)" : "Small Study (n=30)", es: 0.80, se: 0.37, n: 30 },
    { label: lang === "zh" ? "大型研究 (n=3000)" : "Large Study (n=3000)", es: 0.30, se: 0.037, n: 3000 },
  ];

  const w1 = 1 / (studies[0].se ** 2);
  const w2 = 1 / (studies[1].se ** 2);
  const totalW = w1 + w2;
  const pct1 = (w1 / totalW * 100).toFixed(1);
  const pct2 = (w2 / totalW * 100).toFixed(1);
  const weightedES = (w1 * studies[0].es + w2 * studies[1].es) / totalW;
  const simpleES = (studies[0].es + studies[1].es) / 2;

  const pooled = showWeighted ? weightedES : simpleES;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "⚖ 反變異數加權示範" : "⚖ Inverse-Variance Weighting Demo"}
      </h3>
      <p style={{ fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "看看加權如何改變合併結果" : "See how weighting changes the pooled result"}
      </p>

      {/* Toggle */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setShowWeighted(true)}
          style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${showWeighted ? BLUE : LIGHT_BORDER}`, background: showWeighted ? `${BLUE}0D` : "transparent", color: showWeighted ? BLUE : MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          {lang === "zh" ? "加權平均" : "Weighted Average"}
        </button>
        <button onClick={() => setShowWeighted(false)}
          style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${!showWeighted ? CORAL : LIGHT_BORDER}`, background: !showWeighted ? `${CORAL}0D` : "transparent", color: !showWeighted ? CORAL : MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          {lang === "zh" ? "簡單平均" : "Simple Average"}
        </button>
      </div>

      {/* Visual comparison */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
        {studies.map((s, i) => {
          const weight = showWeighted ? (i === 0 ? pct1 : pct2) : "50.0";
          const sqSize = Math.max(12, Math.sqrt(parseFloat(weight)) * 8);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 140, fontSize: 12, fontWeight: 500, color: DARK, textAlign: "right" }}>{s.label}</div>
              <div style={{ flex: 1, position: "relative", height: 40, display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: LIGHT_BORDER }} />
                {/* CI line */}
                <div style={{ position: "absolute", left: `${(s.es - 1.96 * s.se + 0.5) / 2 * 100}%`, right: `${100 - (s.es + 1.96 * s.se + 0.5) / 2 * 100}%`, height: 2, background: BLUE, borderRadius: 1 }} />
                {/* Square */}
                <div style={{ position: "absolute", left: `${(s.es + 0.5) / 2 * 100}%`, transform: "translate(-50%, -50%)", top: "50%", width: sqSize, height: sqSize, background: BLUE, borderRadius: 2, transition: "all 0.4s" }} />
              </div>
              <div style={{ width: 60, fontSize: 12, color: MUTED, textAlign: "left" }}>{weight}%</div>
            </div>
          );
        })}
        {/* Pooled */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8, borderTop: `1px dashed ${LIGHT_BORDER}` }}>
          <div style={{ width: 140, fontSize: 12, fontWeight: 700, color: BLUE, textAlign: "right" }}>
            {lang === "zh" ? "合併效應" : "Pooled Effect"}
          </div>
          <div style={{ flex: 1, position: "relative", height: 30, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 1, background: LIGHT_BORDER }} />
            {/* Diamond */}
            <div style={{
              position: "absolute", left: `${(pooled + 0.5) / 2 * 100}%`, transform: "translate(-50%, -50%) rotate(45deg)", top: "50%",
              width: 14, height: 14, background: BLUE, transition: "all 0.5s ease",
            }} />
          </div>
          <div style={{ width: 60, fontSize: 13, fontWeight: 700, color: BLUE, textAlign: "left" }}>{pooled.toFixed(2)}</div>
        </div>
      </div>

      <div style={{ background: `${BLUE}08`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: BLUE, lineHeight: 1.6 }}>
        {showWeighted
          ? (lang === "zh"
            ? `🗳 大型研究 (n=3000) 獲得 ${pct2}% 的權重，主導了合併結果（更接近 0.30）。小型研究 (n=30) 只有 ${pct1}%。`
            : `🗳 The large study (n=3000) gets ${pct2}% weight, dominating the pooled result (closer to 0.30). The small study (n=30) gets only ${pct1}%.`)
          : (lang === "zh"
            ? "⚠ 簡單平均 = (0.80 + 0.30) / 2 = 0.55。這讓 n=30 的小型研究和 n=3000 的大型研究有相同影響力——不合理！"
            : "⚠ Simple average = (0.80 + 0.30) / 2 = 0.55. This gives equal influence to the n=30 and n=3000 studies — inappropriate!")
        }
      </div>
    </div>
  );
}


// ═══ INTERACTIVE: FIXED vs RANDOM EFFECTS TOGGLE (Section 4) ═══
function FixedRandomToggle({ lang }) {
  const [model, setModel] = useState("random"); // "fixed" | "random"

  // Simulated 5-study data under each model
  const studies = [
    { label: "Chen 2020", fe: { es: 0.35, lo: 0.10, hi: 0.60, w: 28 }, re: { es: 0.35, lo: 0.05, hi: 0.65, w: 22 } },
    { label: "Patel 2021", fe: { es: 0.50, lo: 0.20, hi: 0.80, w: 18 }, re: { es: 0.50, lo: 0.15, hi: 0.85, w: 19 } },
    { label: "Kim 2019",   fe: { es: 0.15, lo: -0.15, hi: 0.45, w: 22 }, re: { es: 0.15, lo: -0.20, hi: 0.50, w: 21 } },
    { label: "Jones 2022", fe: { es: 0.60, lo: 0.25, hi: 0.95, w: 12 }, re: { es: 0.60, lo: 0.20, hi: 1.00, w: 18 } },
    { label: "Liu 2020",   fe: { es: 0.25, lo: 0.05, hi: 0.45, w: 20 }, re: { es: 0.25, lo: -0.00, hi: 0.50, w: 20 } },
  ];
  const pooled = { fixed: { es: 0.33, lo: 0.20, hi: 0.46 }, random: { es: 0.37, lo: 0.15, hi: 0.59 } };
  const p = pooled[model];

  const scaleX = (val) => 50 + val * 40; // maps effect size to % position
  const nullX = scaleX(0);

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "🔄 固定效應 vs 隨機效應" : "🔄 Fixed vs Random Effects"}
      </h3>
      <p style={{ fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "切換模型，觀察 CI 的變化" : "Toggle models and watch the CI change"}
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setModel("fixed")}
          style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${model === "fixed" ? BLUE : LIGHT_BORDER}`, background: model === "fixed" ? `${BLUE}0D` : "transparent", color: model === "fixed" ? BLUE : MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          {lang === "zh" ? "固定效應" : "Fixed Effect"}
        </button>
        <button onClick={() => setModel("random")}
          style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${model === "random" ? CORAL : LIGHT_BORDER}`, background: model === "random" ? `${CORAL}0D` : "transparent", color: model === "random" ? CORAL : MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          {lang === "zh" ? "隨機效應" : "Random Effects"}
        </button>
      </div>

      {/* Mini forest plot */}
      <div style={{ position: "relative", paddingTop: 8 }}>
        {/* Null line */}
        <div style={{ position: "absolute", left: `${nullX}%`, top: 0, bottom: 0, width: 1, background: `${MUTED}44`, zIndex: 0 }} />
        <div style={{ position: "absolute", left: `${nullX}%`, top: -2, transform: "translateX(-50%)", fontSize: 10, color: MUTED }}>0</div>

        {studies.map((s, i) => {
          const d = s[model === "fixed" ? "fe" : "re"];
          const sqSize = Math.max(10, Math.sqrt(d.w) * 3.2);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, height: 28 }}>
              <div style={{ width: 90, fontSize: 12, fontWeight: 500, color: DARK, textAlign: "right" }}>{s.label}</div>
              <div style={{ flex: 1, position: "relative", height: 28 }}>
                {/* CI line */}
                <div style={{ position: "absolute", left: `${scaleX(d.lo)}%`, width: `${scaleX(d.hi) - scaleX(d.lo)}%`, top: "50%", height: 2, background: model === "fixed" ? BLUE : CORAL, borderRadius: 1, transform: "translateY(-50%)", transition: "all 0.4s" }} />
                {/* Square */}
                <div style={{ position: "absolute", left: `${scaleX(d.es)}%`, top: "50%", transform: "translate(-50%, -50%)", width: sqSize, height: sqSize, background: model === "fixed" ? BLUE : CORAL, borderRadius: 2, transition: "all 0.4s" }} />
              </div>
              <div style={{ width: 50, fontSize: 11, color: MUTED, textAlign: "left" }}>{d.w}%</div>
            </div>
          );
        })}

        {/* Pooled diamond row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, paddingTop: 10, borderTop: `1px dashed ${LIGHT_BORDER}`, height: 32 }}>
          <div style={{ width: 90, fontSize: 12, fontWeight: 700, color: model === "fixed" ? BLUE : CORAL, textAlign: "right" }}>
            {lang === "zh" ? "合併效應" : "Pooled"}
          </div>
          <div style={{ flex: 1, position: "relative", height: 28 }}>
            {/* Diamond CI span */}
            <div style={{ position: "absolute", left: `${scaleX(p.lo)}%`, width: `${scaleX(p.hi) - scaleX(p.lo)}%`, top: "50%", height: 16, transform: "translateY(-50%)", transition: "all 0.5s" }}>
              <svg width="100%" height="16" viewBox="0 0 100 16" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                <polygon points="0,8 50,0 100,8 50,16" fill={model === "fixed" ? BLUE : CORAL} opacity={0.8} />
              </svg>
            </div>
          </div>
          <div style={{ width: 50, fontSize: 12, fontWeight: 700, color: model === "fixed" ? BLUE : CORAL, textAlign: "left" }}>
            {p.es.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div style={{ background: model === "fixed" ? `${BLUE}08` : `${CORAL}08`, borderRadius: 10, padding: "12px 16px", marginTop: 20, fontSize: 13, lineHeight: 1.6, color: model === "fixed" ? BLUE : CORAL, transition: "all 0.3s" }}>
        {model === "fixed"
          ? (lang === "zh"
            ? "固定效應：假設所有研究測量同一個真實效應。CI 較窄 (0.20–0.46)。大型研究主導權重。"
            : "Fixed effect: assumes one true effect across all studies. CI is narrower (0.20–0.46). Large studies dominate weights.")
          : (lang === "zh"
            ? "隨機效應：假設真實效應在不同研究間有所不同。CI 較寬 (0.15–0.59)，反映研究間的額外不確定性。小型研究獲得相對更多權重。"
            : "Random effects: assumes true effects vary across studies. CI is wider (0.15–0.59), reflecting additional between-study uncertainty. Small studies get relatively more weight.")
        }
      </div>
    </div>
  );
}


// ═══ INTERACTIVE: FOREST PLOT ANATOMY (Section 5) ═══
function ForestPlotAnatomy({ lang }) {
  const [activeTooltip, setActiveTooltip] = useState(null);
  const studies = [
    { name: "Smith 2018", effect: 0.65, ci: [0.42, 0.92], weight: 28 },
    { name: "Lee 2019",   effect: 0.78, ci: [0.55, 1.10], weight: 22 },
    { name: "Garcia 2020", effect: 0.50, ci: [0.33, 0.76], weight: 30 },
    { name: "Ahmed 2021",  effect: 0.90, ci: [0.48, 1.68], weight: 8 },
    { name: "Brown 2022",  effect: 0.58, ci: [0.35, 0.97], weight: 12 },
  ];
  const pooled = { effect: 0.63, ci: [0.50, 0.80] };
  const xMin = 0.2, xMax = 2.0;
  const toX = (val) => ((Math.log(val) - Math.log(xMin)) / (Math.log(xMax) - Math.log(xMin))) * 100;
  const explanations = {
    square: { titleKey: "forestSquareTitle", textKey: "forestSquareText",
      title: { en: "Point Estimates (Squares)", zh: "點估計（正方形）" },
      text: { en: "The center of each square is the study's effect size (OR). Larger squares = more weight in the pooled estimate.", zh: "每個正方形的中心代表該研究的效應量 (OR)。正方形越大代表在合併估計中權重越高。" } },
    line: { titleKey: "forestLineTitle", textKey: "forestLineText",
      title: { en: "Confidence Intervals (Lines)", zh: "信賴區間（橫線）" },
      text: { en: "The horizontal line shows the 95% CI. Shorter = more precise. If it crosses OR=1, the result is not statistically significant.", zh: "水平線顯示 95% CI。越短代表越精確。若跨越 OR=1，表示結果不具統計顯著性。" } },
    center: { titleKey: "forestCenterTitle", textKey: "forestCenterText",
      title: { en: "Line of No Effect (OR=1)", zh: "無效線（OR=1）" },
      text: { en: "OR = 1 means no difference between groups. If a study's CI crosses this line, its result is not statistically significant.", zh: "OR = 1 表示兩組無差異。如果研究的 CI 跨越此線，結果不具統計顯著性。" } },
    diamond: { titleKey: "forestDiamondTitle", textKey: "forestDiamondText",
      title: { en: "Pooled Estimate (Diamond)", zh: "合併估計（菱形）" },
      text: { en: "The diamond's center = pooled effect size; its width = pooled 95% CI. If the diamond doesn't cross OR=1, the overall result is significant.", zh: "菱形中心 = 合併效應量；寬度 = 合併 95% CI。若菱形未跨越 OR=1，整體結果具統計顯著性。" } },
  };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <h3 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 6 }}>
          {lang === "zh" ? "🌲 森林圖解剖" : "🌲 Forest Plot Anatomy"}
        </h3>
        <p style={{ fontSize: 14, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
          {lang === "zh" ? "點擊圖中各元素查看說明" : "Click each element for explanations"}
        </p>
      </div>
      <div style={{ minHeight: 72, padding: "12px 16px", marginBottom: 16, background: activeTooltip ? `${BLUE}08` : "transparent", borderRadius: 12, transition: "all 0.3s", border: activeTooltip ? `1px solid ${BLUE}22` : "1px solid transparent" }}>
        {activeTooltip ? (
          <>
            <div style={{ fontSize: 14, fontWeight: 600, color: BLUE, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", marginBottom: 4 }}>{explanations[activeTooltip].title[lang]}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{explanations[activeTooltip].text[lang]}</div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: "#B0AFAA", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", textAlign: "center", paddingTop: 8 }}>
            {lang === "zh" ? "👆 點擊圖中的各元素查看說明" : "👆 Click on elements in the plot to learn more"}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginLeft: 120, marginRight: 8, marginBottom: 6, fontSize: 10, color: "#B0AFAA", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
        <span>{lang === "zh" ? "← 有利治療" : "← Favors treatment"}</span><span>{lang === "zh" ? "有利對照 →" : "Favors control →"}</span>
      </div>
      <div style={{ position: "relative" }}>
        {studies.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", height: 40, padding: "0 4px" }}>
            <div style={{ width: 116, fontSize: 13, color: MUTED, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{s.name}</div>
            <div style={{ flex: 1, position: "relative", height: "100%" }}>
              <div onClick={() => setActiveTooltip(activeTooltip === "center" ? null : "center")} style={{ position: "absolute", left: `${toX(1)}%`, top: 0, bottom: 0, width: 0, borderLeft: activeTooltip === "center" ? `2px solid ${CORAL}` : "1px dashed #CCC", cursor: "pointer", zIndex: 5, padding: "0 5px", borderLeftClip: "content-box", transition: "all 0.3s" }} />
              <div onClick={() => setActiveTooltip(activeTooltip === "line" ? null : "line")} style={{ position: "absolute", left: `${toX(s.ci[0])}%`, width: `${toX(s.ci[1]) - toX(s.ci[0])}%`, top: "50%", height: activeTooltip === "line" ? 3 : 2, background: activeTooltip === "line" ? CORAL : BLUE, transform: "translateY(-50%)", cursor: "pointer", transition: "all 0.3s", borderRadius: 1 }} />
              <div onClick={() => setActiveTooltip(activeTooltip === "square" ? null : "square")} style={{ position: "absolute", left: `${toX(s.effect)}%`, top: "50%", width: Math.max(10, s.weight * 0.6), height: Math.max(10, s.weight * 0.6), background: activeTooltip === "square" ? CORAL : BLUE, borderRadius: 3, transform: "translate(-50%, -50%)", cursor: "pointer", transition: "all 0.3s", boxShadow: activeTooltip === "square" ? `0 0 0 3px ${CORAL}33` : "none" }} />
            </div>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", height: 44, marginTop: 4, borderTop: `1px solid ${LIGHT_BORDER}`, paddingTop: 8 }}>
          <div style={{ width: 116, fontSize: 13, fontWeight: 700, color: BLUE, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{lang === "zh" ? "合併" : "Pooled"}</div>
          <div style={{ flex: 1, position: "relative", height: "100%" }}>
            <div style={{ position: "absolute", left: `${toX(1)}%`, top: 0, bottom: 0, width: 0, borderLeft: "1px dashed #CCC" }} />
            <svg onClick={() => setActiveTooltip(activeTooltip === "diamond" ? null : "diamond")} style={{ position: "absolute", left: `${toX(pooled.ci[0])}%`, top: "50%", width: `${toX(pooled.ci[1]) - toX(pooled.ci[0])}%`, height: 22, transform: "translateY(-50%)", overflow: "visible", cursor: "pointer" }} viewBox="0 0 100 22" preserveAspectRatio="none">
              <polygon points="0,11 50,1 100,11 50,21" fill={activeTooltip === "diamond" ? CORAL : BLUE} style={{ transition: "fill 0.3s" }} />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", marginLeft: 120, marginRight: 8, marginTop: 10, height: 16 }}>
        {[0.3, 0.5, 0.7, 1.0, 1.3, 1.6].map((v) => <span key={v} style={{ position: "absolute", left: `${toX(v)}%`, transform: "translateX(-50%)", fontSize: 10, color: "#C0BFB9", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{v === 1.0 ? "1" : v.toFixed(1)}</span>)}
      </div>
    </div>
  );
}


// ═══ INTERACTIVE: READING FOREST PLOTS EXERCISE (Section 6) ═══
function ForestPlotExercise({ lang }) {
  const [currentPlot, setCurrentPlot] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const plots = [
    {
      titleEn: "Practice Plot 1: Antibiotic vs Placebo for UTI Prevention",
      titleZh: "練習圖 1：抗生素 vs 安慰劑預防尿道感染",
      descEn: "Pooled OR = 0.52 (95% CI: 0.38–0.71). Diamond is entirely left of OR=1.",
      descZh: "合併 OR = 0.52 (95% CI: 0.38–0.71)。菱形完全在 OR=1 的左邊。",
      qEn: "Does the pooled effect cross the line of no effect?",
      qZh: "合併效應是否跨越無效線？",
      opts: { en: ["Yes, it crosses OR=1", "No, the diamond is entirely below 1"], zh: ["是，跨越了 OR=1", "否，菱形完全在 1 以下"] },
      correct: 1,
      expEn: "Correct! The CI (0.38–0.71) is entirely below 1, meaning the result is statistically significant — antibiotics reduce UTI risk.",
      expZh: "正確！CI (0.38–0.71) 完全在 1 以下，表示結果具統計顯著性——抗生素降低了尿道感染風險。",
    },
    {
      titleEn: "Practice Plot 2: New Statin vs Standard Statin",
      titleZh: "練習圖 2：新型 Statin vs 標準 Statin",
      descEn: "Study A (n=2000, weight 45%): OR=0.85. Study B (n=150, weight 8%): OR=0.60. Study C (n=800, weight 30%): OR=0.90.",
      descZh: "研究 A (n=2000, 權重 45%)：OR=0.85。研究 B (n=150, 權重 8%)：OR=0.60。研究 C (n=800, 權重 30%)：OR=0.90。",
      qEn: "Which study has the most weight?",
      qZh: "哪個研究的權重最大？",
      opts: { en: ["Study B (n=150)", "Study A (n=2000)", "Study C (n=800)"], zh: ["研究 B (n=150)", "研究 A (n=2000)", "研究 C (n=800)"] },
      correct: 1,
      expEn: "Correct! Study A has the largest sample (n=2000) and highest weight (45%). Its square would be the largest on the forest plot.",
      expZh: "正確！研究 A 樣本量最大 (n=2000)、權重最高 (45%)。在森林圖上它的正方形會最大。",
    },
    {
      titleEn: "Practice Plot 3: Pain Medication Meta-Analysis",
      titleZh: "練習圖 3：止痛藥統合分析",
      descEn: "Pooled MD = −1.5 (95% CI: −3.2 to 0.2). The diamond crosses MD=0. I² = 72%.",
      descZh: "合併 MD = −1.5 (95% CI: −3.2 到 0.2)。菱形跨越了 MD=0。I² = 72%。",
      qEn: "Is the overall result statistically significant?",
      qZh: "整體結果是否具統計顯著性？",
      opts: { en: ["Yes, MD = −1.5 shows a reduction", "No, the CI crosses 0 (line of no effect)"], zh: ["是，MD = −1.5 顯示有減少", "否，CI 跨越了 0（無效線）"] },
      correct: 1,
      expEn: "Correct! Even though the point estimate is −1.5, the CI crosses 0 (−3.2 to 0.2), so we can't rule out no difference. Plus I² = 72% indicates high heterogeneity.",
      expZh: "正確！雖然點估計是 −1.5，但 CI 跨越了 0（−3.2 到 0.2），不能排除無差異。且 I² = 72% 顯示高異質性。",
    },
  ];

  const current = plots[currentPlot];

  const handleAnswer = (idx) => {
    setSelectedAnswer(idx);
    setShowResult(true);
  };

  const nextPlot = () => {
    setCurrentPlot((currentPlot + 1) % plots.length);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        {plots.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: 4, background: i === currentPlot ? BLUE : LIGHT_BORDER, transition: "all 0.3s" }} />
        ))}
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 8 }}>{current[lang === "zh" ? "titleZh" : "titleEn"]}</h4>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 16, background: "#F8F7F4", borderRadius: 10, padding: "12px 16px" }}>
        {current[lang === "zh" ? "descZh" : "descEn"]}
      </p>
      <p style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 12 }}>
        {current[lang === "zh" ? "qZh" : "qEn"]}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {current.opts[lang].map((opt, i) => {
          const isSelected = selectedAnswer === i;
          const isCorrect = i === current.correct;
          let bg = "#FAFAF7", border = LIGHT_BORDER, color = DARK;
          if (showResult && isSelected && isCorrect) { bg = "#E6F5F0"; border = GREEN; color = "#2A7A5A"; }
          else if (showResult && isSelected && !isCorrect) { bg = "#FDEEEB"; border = RED; color = RED; }
          else if (showResult && isCorrect) { bg = "#E6F5F0"; border = GREEN; color = "#2A7A5A"; }

          return (
            <button key={i} onClick={() => !showResult && handleAnswer(i)}
              disabled={showResult}
              style={{
                background: bg, border: `1.5px solid ${border}`, borderRadius: 10,
                padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 500,
                color, cursor: showResult ? "default" : "pointer", transition: "all 0.2s",
              }}>
              {opt}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div style={{ background: selectedAnswer === current.correct ? "#E6F5F0" : "#FDEEEB", borderRadius: 10, padding: "12px 16px", marginBottom: 16, animation: "fadeInCard 0.3s ease-out" }}>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: selectedAnswer === current.correct ? "#2A7A5A" : RED }}>
            {selectedAnswer === current.correct ? "✅ " : "❌ "}{current[lang === "zh" ? "expZh" : "expEn"]}
          </p>
        </div>
      )}

      {showResult && (
        <div style={{ textAlign: "center" }}>
          <button onClick={nextPlot} style={btnPrimary}>
            {currentPlot < plots.length - 1
              ? (lang === "zh" ? "下一題 →" : "Next Plot →")
              : (lang === "zh" ? "再練一次" : "Practice Again")}
          </button>
        </div>
      )}
    </div>
  );
}


// ═══ INTERACTIVE: COMMON PITFALLS (Section 7) ═══
function CommonPitfalls({ lang }) {
  const [active, setActive] = useState(null);

  const pitfalls = [
    {
      icon: "⚠️",
      en: "Significant ≠ Meaningful",
      zh: "顯著 ≠ 有意義",
      descEn: "A statistically significant result (p < 0.05) does NOT automatically mean the effect is clinically important. With a large enough sample, even a tiny, trivial effect can reach significance. Always ask: is the effect SIZE large enough to matter in practice?",
      descZh: "統計顯著 (p < 0.05) 不代表臨床上有意義。樣本夠大時，即使微小到無關緊要的效果也能達到顯著。永遠要問：效應量的「大小」在臨床實務中真的重要嗎？",
      exEn: "MD = 1 mmHg blood pressure reduction can be p < 0.05 with n = 10,000 — but no doctor would change treatment for 1 mmHg.",
      exZh: "降壓 MD = 1 mmHg 在 n = 10,000 時可達 p < 0.05——但沒有醫生會因為 1 mmHg 改變處方。",
    },
    {
      icon: "🔄",
      en: "OR ≠ RR",
      zh: "OR ≠ RR",
      descEn: "Odds Ratios and Risk Ratios are NOT interchangeable. OR = 0.5 does NOT mean '50% risk reduction.' OR overestimates the effect compared to RR when the event rate is high (> 10%). Never interpret an OR value as if it were an RR.",
      descZh: "勝算比和風險比不能互換使用。OR = 0.5 不代表「風險降低 50%」。當事件發生率高（> 10%）時，OR 會高估效果。絕不能把 OR 的數值當成 RR 來解讀。",
      exEn: "If event rate is 40%: RR = 0.75 but OR = 0.56 — same data, very different numbers!",
      exZh: "若事件發生率 40%：RR = 0.75 但 OR = 0.56——相同數據，數字差很多！",
    },
    {
      icon: "📏",
      en: "Don't Ignore CI Width",
      zh: "別忽略 CI 的寬度",
      descEn: "A point estimate without its confidence interval is only half the story. A wide CI means the estimate is imprecise — the true effect could be much larger or smaller. Two studies can have the same point estimate but very different precision.",
      descZh: "只看點估計不看信賴區間等於只看了一半。CI 很寬代表估計不精確——真實效果可能大很多或小很多。兩個研究可以有相同的點估計，但精確度截然不同。",
      exEn: "OR = 0.60 (95% CI: 0.55–0.65) is very convincing. OR = 0.60 (95% CI: 0.10–3.50) tells you almost nothing.",
      exZh: "OR = 0.60 (95% CI: 0.55–0.65) 非常有說服力。OR = 0.60 (95% CI: 0.10–3.50) 幾乎什麼都說明不了。",
    },
    {
      icon: "📊",
      en: "SD ≠ SE",
      zh: "SD ≠ SE",
      descEn: "Standard Deviation (SD) measures how spread out the data are. Standard Error (SE) measures how precise the mean estimate is. SE = SD ÷ √n. Mixing them up leads to wrong effect sizes and wrong confidence intervals.",
      descZh: "標準差 (SD) 衡量資料的離散程度。標準誤 (SE) 衡量平均值估計的精確度。SE = SD ÷ √n。混淆兩者會導致錯誤的效應量和信賴區間。",
      exEn: "Using SE instead of SD in SMD calculation will massively overestimate the effect size.",
      exZh: "在計算 SMD 時用 SE 代替 SD，會嚴重高估效應量。",
    },
    {
      icon: "🚫",
      en: "Non-Significant ≠ No Effect",
      zh: "不顯著 ≠ 沒有效果",
      descEn: "A non-significant p-value does NOT prove that a treatment doesn't work. It only means we failed to detect an effect — possibly because the study was too small. 'Absence of evidence is not evidence of absence.'",
      descZh: "p 值不顯著不代表治療無效。只代表我們未能偵測到效果——可能是因為研究太小。「沒有證據不等於沒有效果。」",
      exEn: "OR = 1.02 (p = 0.55) → correct: 'unable to demonstrate effectiveness.' Wrong: 'the drug is ineffective.'",
      exZh: "OR = 1.02 (p = 0.55) → 正確：「未能證明有效」。錯誤：「這個藥物無效」。",
    },
    {
      icon: "🧩",
      en: "Don't Mix Effect Size Types",
      zh: "別混合不同類型的效應量",
      descEn: "You cannot directly pool OR and RR (or MD and SMD) in the same meta-analysis. They are on different scales. All studies must be converted to the same effect size metric before pooling.",
      descZh: "不能在同一個統合分析中直接合併 OR 和 RR（或 MD 和 SMD）。它們的尺度不同。所有研究必須先統一轉換為同一種效應量才能合併。",
      exEn: "If 3 studies report OR and 2 report RR, convert all to OR (or all to RR) before running the meta-analysis.",
      exZh: "若 3 篇報告 OR、2 篇報告 RR，必須全部轉換為 OR（或全部轉為 RR）後再進行統合分析。",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
      {pitfalls.map((p, i) => {
        const isActive = active === i;
        return (
          <div key={i} onClick={() => setActive(isActive ? null : i)}
            style={{
              background: isActive ? `${RED}08` : CARD_BG,
              border: `2px solid ${isActive ? RED : LIGHT_BORDER}`,
              borderRadius: 16, padding: "24px 22px", cursor: "pointer",
              transition: "all 0.3s", boxShadow: isActive ? `0 4px 20px ${RED}15` : "0 2px 12px rgba(0,0,0,0.03)",
            }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>{p.icon}</div>
            <h4 style={{ fontSize: 18, fontWeight: 700, color: isActive ? RED : DARK, marginBottom: 8, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
              {lang === "zh" ? p.zh : p.en}
            </h4>
            {isActive && (
              <div style={{ animation: "fadeInCard 0.3s ease-out" }}>
                <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.7, marginBottom: 12, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
                  {lang === "zh" ? p.descZh : p.descEn}
                </p>
                <div style={{ background: `${RED}08`, borderRadius: 8, padding: "10px 14px", fontSize: 14, color: DARK, lineHeight: 1.6, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
                  💊 {lang === "zh" ? p.exZh : p.exEn}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <style>{`@keyframes fadeInCard { 0% { opacity:0; transform:translateY(6px); } 100% { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}


// ═══ MAIN COURSE 4 COMPONENT ═══
export default function Course4({ onNavigate, user, onLogin, onLogout }) {
  const { t, lang, toggleLang } = useI18n();
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sectionIds = ["hero", "s1", "s2", "s3", "s4", "s5", "s6", "s7", "game"];
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
    { id: "s1", num: 1, label: lang === "zh" ? "什麼是效應量" : "What Is an Effect Size" },
    { id: "s2", num: 2, label: lang === "zh" ? "效應量類型" : "Types of Effect Sizes" },
    { id: "s3", num: 3, label: lang === "zh" ? "加權方法" : "Weighting" },
    { id: "s4", num: 4, label: lang === "zh" ? "固定 vs 隨機效應" : "Fixed vs Random" },
    { id: "s5", num: 5, label: lang === "zh" ? "森林圖解剖" : "Forest Plot Anatomy" },
    { id: "s6", num: 6, label: lang === "zh" ? "判讀森林圖" : "Reading Forest Plots" },
    { id: "s7", num: 7, label: lang === "zh" ? "常見陷阱" : "Common Pitfalls" },
    { id: "game", num: 8, label: lang === "zh" ? "恐龍鑰匙探索" : "Dino Key Quest" },
  ];

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${BLUE}22; color: ${DARK}; }
        @media (max-width: 1099px) {
          .sidebar-catalog { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="sidebar-catalog" style={{
        position: "fixed", top: 76, left: 0, width: 200, zIndex: 50,
        padding: "20px 16px 20px 20px",
        display: "flex", flexDirection: "column", gap: 2,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: BLUE, marginBottom: 10 }}>
          {lang === "zh" ? "課程大綱" : "Contents"}
        </div>
        {catalogItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 8, transition: "all 0.25s",
              borderLeft: `2.5px solid ${isActive ? BLUE : "transparent"}`,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? BLUE : "#C0BFB9", minWidth: 16, textAlign: "right", transition: "color 0.25s" }}>{item.num}</span>
              <span style={{ fontSize: 12.5, fontWeight: isActive ? 600 : 400, color: isActive ? DARK : MUTED, textAlign: "left", lineHeight: 1.35, transition: "all 0.25s" }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content" style={{ marginLeft: 200 }}>

      {/* NAV */}
      <SiteNav
        onNavigate={onNavigate}
        user={user} onLogin={onLogin} onLogout={onLogout}
        courseId="course4"
        courseLabel={t("c4Label")}
        courseColor="#2E86C1"
      />

      {/* HERO */}
      <section id="hero" style={{ paddingTop: 90, paddingBottom: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: `radial-gradient(circle, ${BLUE}55 0.8px, transparent 0.8px)`, backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 20, background: `${BLUE}0D`, border: `1px solid ${BLUE}22`, fontSize: 12, color: BLUE, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>{t("c4Label")}</div>
          <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16, color: DARK }}>
            {t("c4Title")}
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 28px" }}>
            {t("c4Desc")}
          </p>
          <button onClick={() => scrollTo("s1")} style={{ ...btnPrimary, boxShadow: `0 4px 20px ${BLUE}33` }}>{t("c4StartBtn")}</button>
        </div>
      </section>

      {/* S1: What Is an Effect Size? */}
      <section id="s1" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c4s1Label")} /><SectionTitle>{t("c4s1Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c4s1Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: `${BLUE}08`, border: `1px solid ${BLUE}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: BLUE }}>
                ⭐ {t("c4s1Analogy")}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s2")} style={btnPrimary}>{t("c4s1Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S2: Types of Effect Sizes */}
      <section id="s2" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c4s2Label")} /><SectionTitle>{t("c4s2Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c4s2Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><EffectSizeCards lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s3")} style={btnPrimary}>{t("c4s2Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S3: Weighting */}
      <section id="s3" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c4s3Label")} /><SectionTitle>{t("c4s3Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c4s3Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><WeightingDemo lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s4")} style={btnPrimary}>{t("c4s3Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S4: Fixed vs Random Effects */}
      <section id="s4" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c4s4Label")} /><SectionTitle>{t("c4s4Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c4s4Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><FixedRandomToggle lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s5")} style={btnPrimary}>{t("c4s4Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S5: Forest Plot Anatomy */}
      <section id="s5" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c4s5Label")} /><SectionTitle>{t("c4s5Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c4s5Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><ForestPlotAnatomy lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s6")} style={btnPrimary}>{t("c4s5Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S6: Reading Forest Plots */}
      <section id="s6" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c4s6Label")} /><SectionTitle>{t("c4s6Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c4s6Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><ForestPlotExercise lang={lang} /></FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button onClick={() => scrollTo("s7")} style={{ ...btnPrimary }}>{lang === "zh" ? "下一節：常見陷阱 →" : "Next: Common Pitfalls →"}</button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* S7: Common Pitfalls */}
      <section id="s7" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={lang === "zh" ? "常見陷阱" : "Common Pitfalls"} />
            <SectionTitle>{lang === "zh" ? "六個最常犯的統計錯誤" : "Six Mistakes Everyone Makes"}</SectionTitle>
          </FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>
            {lang === "zh"
              ? "學會了效應量和森林圖，還有一些陷阱要小心。以下是臨床研究中最常見的解讀錯誤——點擊每張卡片了解問題所在和正確做法。"
              : "Now that you can read effect sizes and forest plots, watch out for these traps. Here are the most common interpretation mistakes in clinical research — click each card to learn what goes wrong and how to get it right."}
          </Paragraph></FadeIn>
          <FadeIn delay={0.15}><CommonPitfalls lang={lang} /></FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <button onClick={() => scrollTo("game")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>
                {lang === "zh" ? "準備好了嗎？來玩遊戲！🎮" : "Ready? Let's play the game! 🎮"}
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* DINO KEY QUEST GAME */}
      <section id="game" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c4gameLabel")} /></FadeIn>
          <FadeIn delay={0.1}>
            <DinoKeyQuest lang={lang} />
          </FadeIn>
        </div>
      </section>

      </div>{/* end .main-content */}

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG, marginLeft: 0 }}>
        {onNavigate && (
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("course3")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "← 回到 Course 3" : "← Back to Course 3"}
            </button>
            <button onClick={() => onNavigate("hub")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "課程總覽" : "Course Hub"}
            </button>
            <button onClick={() => onNavigate("course5")} style={{ ...btnPrimary, padding: "10px 22px", fontSize: 13 }}>
              {lang === "zh" ? "Course 5：異質性與發表偏倚 →" : "Course 5: Heterogeneity →"}
            </button>
          </div>
        )}
        <p style={{ fontSize: 13, color: "#B0AFAA", lineHeight: 1.8 }}>Meta-Analysis 101 — {t("c4Label")}: {t("c4Subtitle")}</p>
        <div style={{ marginTop: 12, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>統合分析 101</div>
      </footer>
    </div>
  );
}
