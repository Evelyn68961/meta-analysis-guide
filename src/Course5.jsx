import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";

// ═══ DESIGN TOKENS ═══
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const CRIMSON = "#C0392B";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const GREEN = "#3DA87A";
const BLUE = "#2E86C1";

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
      <div style={{ width: 24, height: 2, background: CRIMSON, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: CRIMSON }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 640, ...style }}>{children}</p>;
}

const btnPrimary = { background: CRIMSON, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}


// ═══ INTERACTIVE: I² SLIDER (Section 2) ═══
function HeterogeneitySlider({ lang }) {
  const [i2, setI2] = useState(50);

  const getLabel = (val) => {
    if (val <= 25) return { en: "Low", zh: "低", color: GREEN, emoji: "🟢" };
    if (val <= 50) return { en: "Moderate", zh: "中等", color: "#D4A843", emoji: "🟡" };
    if (val <= 75) return { en: "High", zh: "高", color: CORAL, emoji: "🟠" };
    return { en: "Very High", zh: "非常高", color: CRIMSON, emoji: "🔴" };
  };
  const info = getLabel(i2);

  const baseEffects = [0.3, 0.4, 0.35, 0.45, 0.25];
  const spread = i2 / 100;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "📊 I² 互動滑桿" : "📊 Interactive I² Slider"}
      </h3>
      <p style={{ fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "拖動滑桿，看看研究結果如何「散開」" : "Drag the slider to see how study results 'spread apart'"}
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: "0 10px" }}>
        <span style={{ fontSize: 12, color: MUTED }}>0%</span>
        <input type="range" min="0" max="95" value={i2} onChange={e => setI2(Number(e.target.value))}
          style={{ flex: 1, accentColor: info.color, height: 6, cursor: "pointer" }} />
        <span style={{ fontSize: 12, color: MUTED }}>95%</span>
      </div>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: info.color, transition: "color 0.3s" }}>I² = {i2}%</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: info.color, transition: "color 0.3s" }}>{info.emoji} {info[lang]}</div>
      </div>

      <div style={{ position: "relative", height: 120, background: "#F8F7F4", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: `${MUTED}33` }} />
        {baseEffects.map((base, i) => {
          const offset = (base - 0.35) * spread * 300;
          const y = 15 + i * 20;
          return (
            <div key={i} style={{
              position: "absolute", left: `calc(50% + ${offset}px)`, top: y,
              width: 10, height: 10, borderRadius: 5, background: info.color,
              transform: "translateX(-50%)", transition: "all 0.5s ease", opacity: 0.7 + (i * 0.06),
            }} />
          );
        })}
        <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", fontSize: 10, color: MUTED }}>
          {lang === "zh" ? "合併效應" : "Pooled effect"}
        </div>
      </div>

      <div style={{ background: `${info.color}0D`, border: `1px solid ${info.color}22`, borderRadius: 10, padding: "12px 16px", fontSize: 13, lineHeight: 1.6, color: info.color, transition: "all 0.3s" }}>
        {i2 <= 25
          ? (lang === "zh" ? "研究結果高度一致。合併效應量可以放心解讀。" : "Study results are highly consistent. The pooled effect can be interpreted with confidence.")
          : i2 <= 50
          ? (lang === "zh" ? "有些許差異，但合併效應仍有意義。值得探索異質性來源。" : "Some variation exists, but the pooled effect is still meaningful. Worth exploring sources.")
          : i2 <= 75
          ? (lang === "zh" ? "大量差異！合併效應需謹慎解讀。應進行亞組分析或統合迴歸來找出原因。" : "Substantial variation! Interpret the pooled effect cautiously. Conduct subgroup analysis or meta-regression.")
          : (lang === "zh" ? "研究結果極度不一致。合併效應可能無代表性——就像平均北極和撒哈拉的溫度。必須探索原因！" : "Results are extremely inconsistent. The pooled effect may be meaningless — like averaging Arctic and Sahara temperatures. Must investigate!")}
      </div>
    </div>
  );
}


// ═══ INTERACTIVE: SOURCES OF HETEROGENEITY CARDS (Section 3) ═══
function HeterogeneitySourceCards({ lang }) {
  const [active, setActive] = useState(null);

  const cards = [
    {
      key: "clinical", icon: "👥", color: BLUE,
      en: "Clinical Diversity", zh: "臨床異質性",
      descEn: "Different patient populations (age, severity), drug doses, treatment durations, or outcome definitions across studies.",
      descZh: "不同研究的病人族群（年齡、嚴重度）、藥物劑量、治療時間或結局定義不同。",
      exEn: "Study A: 10mg in elderly. Study B: 20mg in young adults.",
      exZh: "研究 A：老年人用 10mg。研究 B：年輕人用 20mg。",
    },
    {
      key: "method", icon: "🔬", color: "#7B68C8",
      en: "Methodological Diversity", zh: "方法學異質性",
      descEn: "Different study designs (RCT vs observational), blinding approaches, or risk of bias levels.",
      descZh: "不同的研究設計（RCT vs 觀察性）、盲法方式或偏倚風險水平。",
      exEn: "Study A: double-blind RCT. Study B: open-label observational.",
      exZh: "研究 A：雙盲 RCT。研究 B：開放標籤觀察性研究。",
    },
    {
      key: "stat", icon: "📐", color: "#D4A843",
      en: "Statistical Diversity", zh: "統計異質性",
      descEn: "Different outcome measurements or time points. The quantified reflection (I², Q) of clinical and methodological differences.",
      descZh: "不同的結局測量方式或時間點。是臨床和方法學差異在數據上的量化反映（I²、Q）。",
      exEn: "Study A measures at 6 months. Study B at 12 months.",
      exZh: "研究 A 在 6 個月測量。研究 B 在 12 個月測量。",
    },
    {
      key: "unknown", icon: "❓", color: MUTED,
      en: "Unexplained", zh: "無法解釋",
      descEn: "Residual variation that remains even after exploring all known factors. This is normal and should be reported honestly.",
      descZh: "即使探索了所有已知因素後仍存在的殘餘差異。這是正常的，應如實報告。",
      exEn: "After subgroup analysis and meta-regression, some heterogeneity remains.",
      exZh: "做了亞組分析和統合迴歸後，仍有部分異質性無法解釋。",
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
      {cards.map((c) => {
        const isActive = active === c.key;
        return (
          <div key={c.key} onClick={() => setActive(isActive ? null : c.key)}
            style={{
              background: isActive ? `${c.color}08` : CARD_BG,
              border: `2px solid ${isActive ? c.color : LIGHT_BORDER}`,
              borderRadius: 16, padding: "20px 18px", cursor: "pointer",
              transition: "all 0.3s", boxShadow: isActive ? `0 4px 20px ${c.color}15` : "0 2px 12px rgba(0,0,0,0.03)",
            }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: isActive ? c.color : DARK, marginBottom: 6 }}>{c[lang]}</h4>
            {isActive && (
              <div style={{ animation: "fadeInCard 0.3s ease-out" }}>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 8 }}>{lang === "zh" ? c.descZh : c.descEn}</p>
                <div style={{ fontSize: 12, color: c.color, background: `${c.color}0D`, borderRadius: 8, padding: "6px 10px" }}>
                  {lang === "zh" ? c.exZh : c.exEn}
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


// ═══ INTERACTIVE: SUBGROUP FOREST PLOT (Section 4) ═══
function SubgroupDemo({ lang }) {
  const [showSubgroups, setShowSubgroups] = useState(false);

  const studies = [
    { label: "High dose A", es: 0.55, group: "high" },
    { label: "High dose B", es: 0.60, group: "high" },
    { label: "High dose C", es: 0.50, group: "high" },
    { label: "Low dose D",  es: 0.20, group: "low" },
    { label: "Low dose E",  es: 0.15, group: "low" },
    { label: "Low dose F",  es: 0.25, group: "low" },
  ];

  const pooledAll = 0.38;
  const pooledHigh = 0.55;
  const pooledLow = 0.20;

  const barW = (es) => Math.max(20, es * 280);

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "🔀 亞組分析示範" : "🔀 Subgroup Analysis Demo"}
      </h3>
      <p style={{ fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "按劑量高低分組，看效應如何不同" : "Split by dose level to see how effects differ"}
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 24 }}>
        <button onClick={() => setShowSubgroups(false)}
          style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${!showSubgroups ? CRIMSON : LIGHT_BORDER}`, background: !showSubgroups ? `${CRIMSON}0D` : "transparent", color: !showSubgroups ? CRIMSON : MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          {lang === "zh" ? "整體合併" : "Overall Pooled"}
        </button>
        <button onClick={() => setShowSubgroups(true)}
          style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${showSubgroups ? BLUE : LIGHT_BORDER}`, background: showSubgroups ? `${BLUE}0D` : "transparent", color: showSubgroups ? BLUE : MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          {lang === "zh" ? "按劑量分組" : "Split by Dose"}
        </button>
      </div>

      {/* Bar chart representation */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {showSubgroups && (
          <div style={{ fontSize: 11, fontWeight: 700, color: CORAL, padding: "4px 0", borderBottom: `1px solid ${CORAL}22`, marginBottom: 4 }}>
            {lang === "zh" ? "高劑量組" : "High Dose Subgroup"}
          </div>
        )}
        {studies.filter(s => !showSubgroups || s.group === "high").filter(s => showSubgroups ? s.group === "high" : true).slice(0, showSubgroups ? 3 : 6).map((s, i) => (
          <div key={`h-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, height: 24 }}>
            <div style={{ width: 100, fontSize: 11, color: DARK, textAlign: "right" }}>{s.label}</div>
            <div style={{ width: barW(s.es), height: 14, borderRadius: 4, background: showSubgroups ? (s.group === "high" ? CORAL : BLUE) : CRIMSON, transition: "all 0.4s", opacity: 0.7 }} />
            <div style={{ fontSize: 11, color: MUTED }}>{s.es.toFixed(2)}</div>
          </div>
        ))}
        {showSubgroups && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 24, paddingTop: 4, borderTop: `1px dashed ${LIGHT_BORDER}` }}>
              <div style={{ width: 100, fontSize: 11, fontWeight: 700, color: CORAL, textAlign: "right" }}>{lang === "zh" ? "高劑量合併" : "High pooled"}</div>
              <div style={{ width: barW(pooledHigh), height: 14, borderRadius: 4, background: CORAL, transition: "all 0.4s" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: CORAL }}>{pooledHigh.toFixed(2)}</div>
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: BLUE, padding: "8px 0 4px", borderBottom: `1px solid ${BLUE}22` }}>
              {lang === "zh" ? "低劑量組" : "Low Dose Subgroup"}
            </div>
            {studies.filter(s => s.group === "low").map((s, i) => (
              <div key={`l-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, height: 24 }}>
                <div style={{ width: 100, fontSize: 11, color: DARK, textAlign: "right" }}>{s.label}</div>
                <div style={{ width: barW(s.es), height: 14, borderRadius: 4, background: BLUE, transition: "all 0.4s", opacity: 0.7 }} />
                <div style={{ fontSize: 11, color: MUTED }}>{s.es.toFixed(2)}</div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", gap: 10, height: 24, paddingTop: 4, borderTop: `1px dashed ${LIGHT_BORDER}` }}>
              <div style={{ width: 100, fontSize: 11, fontWeight: 700, color: BLUE, textAlign: "right" }}>{lang === "zh" ? "低劑量合併" : "Low pooled"}</div>
              <div style={{ width: barW(pooledLow), height: 14, borderRadius: 4, background: BLUE, transition: "all 0.4s" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: BLUE }}>{pooledLow.toFixed(2)}</div>
            </div>
          </>
        )}
        {!showSubgroups && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 24, paddingTop: 8, borderTop: `1px dashed ${LIGHT_BORDER}` }}>
            <div style={{ width: 100, fontSize: 11, fontWeight: 700, color: CRIMSON, textAlign: "right" }}>{lang === "zh" ? "整體合併" : "Overall"}</div>
            <div style={{ width: barW(pooledAll), height: 14, borderRadius: 4, background: CRIMSON, transition: "all 0.4s" }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: CRIMSON }}>{pooledAll.toFixed(2)}</div>
          </div>
        )}
      </div>

      <div style={{ background: showSubgroups ? `${BLUE}08` : `${CRIMSON}08`, borderRadius: 10, padding: "12px 16px", marginTop: 20, fontSize: 13, lineHeight: 1.6, color: showSubgroups ? BLUE : CRIMSON, transition: "all 0.3s" }}>
        {showSubgroups
          ? (lang === "zh"
            ? "分組後發現：高劑量組效應 (0.55) 遠大於低劑量組 (0.20)。劑量是異質性的重要來源！整體合併的 0.38 掩蓋了這個差異。"
            : "After splitting: high-dose effect (0.55) is much larger than low-dose (0.20). Dose is a key source of heterogeneity! The overall 0.38 masked this difference.")
          : (lang === "zh"
            ? "整體合併效應 = 0.38，I² 可能很高。但這個數字掩蓋了高劑量和低劑量之間的真實差異。試試按劑量分組！"
            : "Overall pooled = 0.38 with likely high I². But this number hides the real difference between high and low doses. Try splitting by dose!")}
      </div>
    </div>
  );
}


// ═══ INTERACTIVE: FUNNEL PLOT (Section 5) ═══
function FunnelPlotDemo({ lang }) {
  const [biasMode, setBiasMode] = useState("symmetric"); // "symmetric" | "biased"

  const symmetricDots = [
    { es: 0.35, se: 0.05 }, { es: 0.30, se: 0.06 }, { es: 0.40, se: 0.07 },
    { es: 0.25, se: 0.12 }, { es: 0.45, se: 0.11 }, { es: 0.32, se: 0.10 },
    { es: 0.20, se: 0.18 }, { es: 0.50, se: 0.17 }, { es: 0.15, se: 0.20 }, { es: 0.55, se: 0.19 },
  ];

  const biasedDots = [
    { es: 0.35, se: 0.05 }, { es: 0.30, se: 0.06 }, { es: 0.40, se: 0.07 },
    { es: 0.45, se: 0.11 }, { es: 0.38, se: 0.10 },
    { es: 0.50, se: 0.17 }, { es: 0.55, se: 0.19 }, { es: 0.60, se: 0.22 },
    // Missing: small studies with small effects (bottom-left gap)
  ];

  const dots = biasMode === "symmetric" ? symmetricDots : biasedDots;
  const pooledES = 0.35;

  // Map to SVG coords: x = effect size, y = SE (inverted: low SE = top)
  const mapX = (es) => 40 + (es / 0.8) * 220;
  const mapY = (se) => 20 + se * 500;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "📐 漏斗圖互動示範" : "📐 Interactive Funnel Plot"}
      </h3>
      <p style={{ fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "比較對稱 vs 不對稱漏斗圖" : "Compare symmetric vs asymmetric funnel plots"}
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setBiasMode("symmetric")}
          style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${biasMode === "symmetric" ? GREEN : LIGHT_BORDER}`, background: biasMode === "symmetric" ? `${GREEN}0D` : "transparent", color: biasMode === "symmetric" ? GREEN : MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          {lang === "zh" ? "對稱（良好）" : "Symmetric (Good)"}
        </button>
        <button onClick={() => setBiasMode("biased")}
          style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${biasMode === "biased" ? CRIMSON : LIGHT_BORDER}`, background: biasMode === "biased" ? `${CRIMSON}0D` : "transparent", color: biasMode === "biased" ? CRIMSON : MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>
          {lang === "zh" ? "不對稱（可疑）" : "Asymmetric (Suspicious)"}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <svg width="320" height="180" viewBox="0 0 320 180" style={{ background: "#FAFAF7", borderRadius: 12 }}>
          {/* Funnel outline */}
          <line x1={mapX(pooledES)} y1="20" x2={mapX(pooledES) - 80} y2="160" stroke={`${MUTED}33`} strokeWidth="1" strokeDasharray="4 3" />
          <line x1={mapX(pooledES)} y1="20" x2={mapX(pooledES) + 80} y2="160" stroke={`${MUTED}33`} strokeWidth="1" strokeDasharray="4 3" />
          {/* Pooled line */}
          <line x1={mapX(pooledES)} y1="15" x2={mapX(pooledES)} y2="165" stroke={`${MUTED}55`} strokeWidth="1" />
          {/* Dots */}
          {dots.map((d, i) => (
            <circle key={i} cx={mapX(d.es)} cy={mapY(d.se)} r={5}
              fill={biasMode === "symmetric" ? GREEN : CRIMSON} opacity={0.6}
              style={{ transition: "all 0.5s ease" }} />
          ))}
          {/* Missing zone highlight for biased */}
          {biasMode === "biased" && (
            <rect x={mapX(pooledES) - 80} y="100" width="60" height="60" rx="6"
              fill={CRIMSON} opacity={0.08} stroke={CRIMSON} strokeWidth="1" strokeDasharray="4 3" />
          )}
          {biasMode === "biased" && (
            <text x={mapX(pooledES) - 52} y="135" fontSize="9" fill={CRIMSON} textAnchor="middle" fontWeight="600">
              {lang === "zh" ? "缺失？" : "Missing?"}
            </text>
          )}
          {/* Axis labels */}
          <text x="160" y="175" fontSize="10" fill={MUTED} textAnchor="middle">
            {lang === "zh" ? "效應量" : "Effect Size"}
          </text>
          <text x="12" y="100" fontSize="10" fill={MUTED} textAnchor="middle" transform="rotate(-90, 12, 100)">
            {lang === "zh" ? "標準誤" : "SE"}
          </text>
          {/* Top/bottom labels */}
          <text x={mapX(pooledES)} y="12" fontSize="9" fill={MUTED} textAnchor="middle">
            {lang === "zh" ? "精確" : "Precise"}
          </text>
        </svg>
      </div>

      <div style={{ background: biasMode === "symmetric" ? `${GREEN}0D` : `${CRIMSON}0D`, borderRadius: 10, padding: "12px 16px", marginTop: 16, fontSize: 13, lineHeight: 1.6, color: biasMode === "symmetric" ? GREEN : CRIMSON, transition: "all 0.3s" }}>
        {biasMode === "symmetric"
          ? (lang === "zh"
            ? "✅ 漏斗圖對稱：小型研究的效應量均勻分布在合併估計兩側。沒有明顯的發表偏倚跡象。"
            : "✅ Symmetric funnel: small studies spread evenly around the pooled estimate. No obvious signs of publication bias.")
          : (lang === "zh"
            ? "⚠ 漏斗圖不對稱：左下角（小型、效應小的研究）缺失。這些研究可能存在但未被發表——「抽屜問題」！"
            : "⚠ Asymmetric funnel: bottom-left corner (small studies with small effects) is missing. These studies may exist but remain unpublished — the 'file drawer problem'!")}
      </div>
    </div>
  );
}


// ═══ INTERACTIVE: PRISMA CHECKLIST HIGHLIGHTS (Section 6) ═══
function PrismaHighlights({ lang }) {
  const [activeItem, setActiveItem] = useState(null);

  const items = [
    { key: "protocol", icon: "📝", en: "Register your protocol", zh: "註冊你的研究方案",
      descEn: "Register on PROSPERO before starting. Lets readers verify you followed the original plan.", descZh: "在開始前於 PROSPERO 註冊。讓讀者能驗證你是否按照原計畫執行。" },
    { key: "search", icon: "🔍", en: "Document complete search strategy", zh: "記錄完整搜尋策略",
      descEn: "Report all databases searched, exact search strings, and dates. Others should be able to reproduce your search.", descZh: "報告所有搜尋的資料庫、精確搜尋字串和日期。他人應能重複你的搜尋。" },
    { key: "flow", icon: "📊", en: "PRISMA flow diagram", zh: "PRISMA 流程圖",
      descEn: "Show screening steps: identified → screened → eligible → included, with exclusion reasons.", descZh: "展示篩選步驟：發現 → 篩選 → 合格 → 納入，含排除原因。" },
    { key: "rob", icon: "🚦", en: "Risk of bias assessment", zh: "偏倚風險評估",
      descEn: "Report RoB for each study and discuss how it affects confidence in results.", descZh: "報告每項研究的 RoB，並討論其如何影響結果的可信度。" },
    { key: "all", icon: "📄", en: "Report ALL results", zh: "報告所有結果",
      descEn: "Include non-significant findings. Selective reporting is itself a form of bias.", descZh: "包含不顯著的結果。選擇性報告本身就是一種偏倚。" },
    { key: "data", icon: "💾", en: "Share your data", zh: "公開你的數據",
      descEn: "PRISMA 2020 encourages open data and analysis code for transparency and reproducibility.", descZh: "PRISMA 2020 鼓勵公開數據和分析代碼，促進透明度和可重複性。" },
  ];

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 16, textAlign: "center" }}>
        {lang === "zh" ? "📋 PRISMA 2020 重點清單" : "📋 PRISMA 2020 Key Checklist Items"}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 8 }}>
        {items.map((item) => {
          const isActive = activeItem === item.key;
          return (
            <button key={item.key} onClick={() => setActiveItem(isActive ? null : item.key)}
              style={{
                background: isActive ? `${CRIMSON}08` : "#FAFAF7",
                border: `1.5px solid ${isActive ? CRIMSON : LIGHT_BORDER}`,
                borderRadius: 12, padding: "14px 12px", cursor: "pointer",
                textAlign: "center", transition: "all 0.2s",
              }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{item.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: isActive ? CRIMSON : MUTED, lineHeight: 1.3 }}>
                {item[lang]}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{
        minHeight: 60, padding: activeItem ? "14px 18px" : "10px 18px", marginTop: 14,
        background: activeItem ? `${CRIMSON}08` : "transparent",
        border: activeItem ? `1px solid ${CRIMSON}22` : "1px solid transparent",
        borderRadius: 12, transition: "all 0.3s",
      }}>
        {activeItem ? (
          <p style={{ fontSize: 13, color: CRIMSON, lineHeight: 1.6, margin: 0 }}>
            {items.find(i => i.key === activeItem)[lang === "zh" ? "descZh" : "descEn"]}
          </p>
        ) : (
          <p style={{ fontSize: 13, color: "#B0AFAA", textAlign: "center", margin: 0 }}>
            {lang === "zh" ? "👆 點擊上方項目查看說明" : "👆 Click an item above for details"}
          </p>
        )}
      </div>
    </div>
  );
}


// ═══ MAIN COURSE 5 COMPONENT ═══
export default function Course5({ onNavigate }) {
  const { t, lang, toggleLang } = useI18n();
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sectionIds = ["hero", "s1", "s2", "s3", "s4", "s5", "s6", "game"];
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
    { id: "s1", num: 1, label: lang === "zh" ? "什麼是異質性" : "What Is Heterogeneity" },
    { id: "s2", num: 2, label: lang === "zh" ? "衡量異質性" : "Measuring Heterogeneity" },
    { id: "s3", num: 3, label: lang === "zh" ? "異質性來源" : "Sources" },
    { id: "s4", num: 4, label: lang === "zh" ? "探索異質性" : "Exploring" },
    { id: "s5", num: 5, label: lang === "zh" ? "發表偏倚" : "Publication Bias" },
    { id: "s6", num: 6, label: lang === "zh" ? "報告你的分析" : "Reporting" },
    { id: "game", num: 7, label: lang === "zh" ? "恐龍小遊戲" : "Dino Game" },
  ];

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${CRIMSON}22; color: ${DARK}; }
        @media (max-width: 1099px) {
          .sidebar-catalog { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>

      {/* SIDEBAR */}
      <div className="sidebar-catalog" style={{
        position: "fixed", top: 76, left: 0, width: 200, zIndex: 50,
        padding: "20px 16px 20px 20px", display: "flex", flexDirection: "column", gap: 2,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: CRIMSON, marginBottom: 10 }}>
          {lang === "zh" ? "課程大綱" : "Contents"}
        </div>
        {catalogItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 10px", borderRadius: 8, transition: "all 0.25s",
              borderLeft: `2.5px solid ${isActive ? CRIMSON : "transparent"}`,
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: isActive ? CRIMSON : "#C0BFB9", minWidth: 16, textAlign: "right", transition: "color 0.25s" }}>{item.num}</span>
              <span style={{ fontSize: 12.5, fontWeight: isActive ? 600 : 400, color: isActive ? DARK : MUTED, textAlign: "left", lineHeight: 1.35, transition: "all 0.25s" }}>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content" style={{ marginLeft: 200 }}>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(248,247,244,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${LIGHT_BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onNavigate && <button onClick={() => onNavigate("hub")} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: MUTED, padding: 4 }}>←</button>}
          <div style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 15, fontWeight: 700, color: CRIMSON, letterSpacing: -0.3 }}>
            Course 5 <span style={{ fontWeight: 400, color: MUTED, fontSize: 13 }}>{t("c5Subtitle")}</span>
          </div>
        </div>
        <button onClick={toggleLang} style={{ background: `${CRIMSON}0D`, border: `1px solid ${CRIMSON}22`, color: CRIMSON, padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.target.style.background = CRIMSON; e.target.style.color = "#FFF"; }}
          onMouseLeave={(e) => { e.target.style.background = `${CRIMSON}0D`; e.target.style.color = CRIMSON; }}>
          {t("langSwitch")}
        </button>
      </nav>

      {/* HERO */}
      <section id="hero" style={{ paddingTop: 90, paddingBottom: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: `radial-gradient(circle, ${CRIMSON}55 0.8px, transparent 0.8px)`, backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 20, background: `${CRIMSON}0D`, border: `1px solid ${CRIMSON}22`, fontSize: 12, color: CRIMSON, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>{t("c5Label")}</div>
          <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16, color: DARK }}>
            {t("c5Title")}
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 28px" }}>
            {t("c5Desc")}
          </p>
          <button onClick={() => scrollTo("s1")} style={{ ...btnPrimary, boxShadow: `0 4px 20px ${CRIMSON}33` }}>{t("c5StartBtn")}</button>
        </div>
      </section>

      {/* S1: What Is Heterogeneity? */}
      <section id="s1" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c5s1Label")} /><SectionTitle>{t("c5s1Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c5s1Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: `${CRIMSON}08`, border: `1px solid ${CRIMSON}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: CRIMSON }}>🌡 {t("c5s1Analogy")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s2")} style={btnPrimary}>{t("c5s1Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S2: Measuring Heterogeneity */}
      <section id="s2" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c5s2Label")} /><SectionTitle>{t("c5s2Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c5s2Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><HeterogeneitySlider lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s3")} style={btnPrimary}>{t("c5s2Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S3: Sources of Heterogeneity */}
      <section id="s3" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c5s3Label")} /><SectionTitle>{t("c5s3Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c5s3Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><HeterogeneitySourceCards lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s4")} style={btnPrimary}>{t("c5s3Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S4: Exploring Heterogeneity */}
      <section id="s4" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c5s4Label")} /><SectionTitle>{t("c5s4Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c5s4Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><SubgroupDemo lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s5")} style={btnPrimary}>{t("c5s4Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S5: Publication Bias */}
      <section id="s5" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c5s5Label")} /><SectionTitle>{t("c5s5Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c5s5Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><FunnelPlotDemo lang={lang} /></FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: `${CRIMSON}08`, border: `1px solid ${CRIMSON}1A`, borderRadius: 14, padding: "16px 20px", marginTop: 24, marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: CRIMSON }}>
                🔬 {t("c5s5Tip")}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s6")} style={btnPrimary}>{t("c5s5Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S6: Reporting Your Meta-Analysis */}
      <section id="s6" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c5s6Label")} /><SectionTitle>{t("c5s6Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c5s6Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><PrismaHighlights lang={lang} /></FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: `${CRIMSON}08`, border: `1px solid ${CRIMSON}1A`, borderRadius: 14, padding: "16px 20px", marginTop: 24, marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: CRIMSON }}>🎓 {t("c5s6Tip")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div style={{ textAlign: "center" }}>
              <button onClick={() => scrollTo("game")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>{t("c5s6Next")}</button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* GAME PLACEHOLDER */}
      <section id="game" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <FadeIn><SectionLabel text={t("c5gameLabel")} /></FadeIn>
          <FadeIn delay={0.1}>
            <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎮</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: DARK, marginBottom: 8 }}>
                {lang === "zh" ? "恐龍小遊戲即將推出" : "Dino Game Coming Soon"}
              </h3>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6 }}>
                {lang === "zh" ? "70 題知識庫已經準備好了！遊戲組件開發中。" : "70-question bank is ready! Game component in development."}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      </div>{/* end .main-content */}

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG, marginLeft: 0 }}>
        {onNavigate && (
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("course4")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "← 回到 Course 4" : "← Back to Course 4"}
            </button>
            <button onClick={() => onNavigate("hub")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "課程總覽" : "Course Hub"}
            </button>
            <button style={{ background: CRIMSON, border: "none", color: "#FFF", padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "default", opacity: 0.5 }}>
              {lang === "zh" ? "🎓 課程完成！" : "🎓 Course Complete!"}
            </button>
          </div>
        )}
        <p style={{ fontSize: 13, color: "#B0AFAA", lineHeight: 1.8 }}>Meta-Analysis 101 — {t("c5Label")}: {t("c5Subtitle")}</p>
        <div style={{ marginTop: 12, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>統合分析 101</div>
      </footer>
    </div>
  );
}
