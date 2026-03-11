import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";
import SiteNav from "./SiteNav";

// ═══ DESIGN TOKENS ═══
const CRIMSON = "#C0392B";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const GREEN = "#3DA87A";
const RED = "#D94B2E";
const AMBER = "#D4A843";
const BLUE = "#2E86C1";
const FONT = "'Noto Sans TC', 'Outfit', sans-serif";

// ═══ BILINGUAL TEXT ═══
const T = {
  zh: {
    title: "研究工作坊：分析篇",
    subtitle: "選擇分析方法、執行統合分析、解讀結果、撰寫結論",
    step1: "效果量與模型",
    step2: "準備資料",
    step3: "執行分析",
    step4: "解讀與報告",
    step5: "撰寫結論",
    next: "下一步",
    prev: "上一步",

    // Step 1: Effect size & model
    effectLabel: "效果量類型",
    effectOR: "勝算比 (OR)",
    effectRR: "相對風險 (RR)",
    effectRD: "風險差 (RD)",
    effectMD: "均值差 (MD)",
    effectSMD: "標準化均值差 (SMD)",
    modelLabel: "統合分析模型",
    modelFixed: "固定效果模型 (Fixed-Effect)",
    modelRandom: "隨機效果模型 (Random-Effects)",
    modelFixedDesc: "假設所有研究估計同一個真實效果。適合同質性高的研究。",
    modelRandomDesc: "假設各研究有不同的真實效果。較常用，尤其當研究間有差異時。",
    rationale: "為什麼選擇這個效果量和模型？",
    rationalePh: "例如：結局為二元變項（事件發生與否），且各研究族群和劑量不同，因此選擇 OR + 隨機效果模型。",
    binaryNote: "你的資料為二元結局 — 建議使用 OR 或 RR。",
    contNote: "你的資料為連續結局 — 建議使用 MD 或 SMD。",
    effectWhy: {
      OR: "OR 適用於病例對照研究和罕見事件。大多數臨床 MA 使用 OR。",
      RR: "RR 較直觀，適用於前瞻性研究。不適合病例對照設計。",
      RD: "RD 直接顯示絕對風險差異，可計算 NNT。但各研究基線風險差異大時不穩定。",
      MD: "MD 適用於所有研究使用相同量表測量結局時。",
      SMD: "SMD (Hedges' g) 適用於不同量表但測量相同構念時。",
    },

    // Step 2: Data prep
    prepTitle: "準備分析資料",
    prepDesc: "下方表格整理了你在規劃篇萃取的資料。你可以：",
    prepOption1: "複製表格到線上計算器",
    prepOption2: "下載 CSV 檔案",
    prepOption3: "複製 R 程式碼",
    copyTable: "複製表格",
    downloadCSV: "下載 CSV",
    copied: "已複製！",
    studyLabel: "研究",
    eventsI: "介入組事件數",
    totalI: "介入組總人數",
    eventsC: "對照組事件數",
    totalC: "對照組總人數",
    meanI: "介入組平均值",
    sdI: "介入組 SD",
    nI: "介入組人數",
    meanC: "對照組平均值",
    sdC: "對照組 SD",
    nC: "對照組人數",

    // Step 3: Run analysis
    runTitle: "執行你的統合分析",
    runDesc: "選擇一種方式執行分析，取得森林圖和統計結果：",
    tabOnline: "線上計算器（免安裝）",
    tabR: "R 程式碼（metafor）",
    onlineTitle: "使用 Onlinemeta 線上計算器",
    onlineSteps: [
      "點擊下方連結開啟 Onlinemeta",
      "在左側選單選擇「Meta」",
      "選擇資料類型（Dichotomous 或 Continuous）",
      "將上一步複製的資料貼入，或上傳 CSV",
      "選擇效果量類型和模型（Fixed/Random）",
      "點擊「Run」產生森林圖和漏斗圖",
      "下載圖片（PDF 或 PNG）用於你的海報",
    ],
    onlineLink: "開啟 Onlinemeta →",
    onlineAlt: "其他線上工具：",
    rTitle: "使用 R + metafor 套件",
    rSteps: [
      "確認已安裝 R 和 RStudio",
      "複製下方程式碼到 RStudio",
      "執行程式碼（Ctrl+A 全選，然後 Ctrl+Enter）",
      "森林圖和漏斗圖會自動產生",
      "使用 RStudio 匯出圖片",
    ],
    rCopyCode: "複製 R 程式碼",
    rInstallNote: "若尚未安裝 metafor，先執行：install.packages(\"metafor\")",

    // Step 4: Interpret & Report
    interpretTitle: "解讀結果與報告",
    reportGuideTitle: "如何報告你的結果",
    reportGuideIntro: "從你的分析工具中，找到以下關鍵數據，並在下方解讀中引用：",
    reportItems: [
      "整體效果量（例如 OR = 0.67）",
      "95% 信賴區間（例如 [0.55, 0.82]）",
      "p 值（例如 p < 0.001）",
      "I² 統計量（例如 I² = 35.2%）",
      "納入研究數",
    ],
    reportExample: "範例寫法",
    reportExampleText: "五項隨機對照試驗（N = 32,476）的統合分析顯示，SGLT2 抑制劑顯著降低複合腎臟結局風險（OR = 0.67, 95% CI: 0.55–0.82, p < 0.001）。研究間異質性為中度（I² = 35.2%）。",
    forestQ1: "整體效果量代表什麼意義？是否具統計顯著性？",
    forestQ1Ph: "例如：OR = 0.67 表示介入組事件發生風險為對照組的 67%，95% CI 不跨越 1，具統計顯著性。",
    forestQ2: "各研究的效果方向是否一致？哪篇權重最大？",
    forestQ2Ph: "例如：5 篇研究效果方向一致，均偏向介入組。EMPA-KIDNEY 權重最大，因樣本數最多且信賴區間最窄。",
    hetInterpret: "你如何解讀異質性？",
    hetInterpretPh: "例如：I²=35% 表示低至中度異質性，研究間差異可能來自族群定義不同（CKD 專屬 vs 高 CV 風險）。",
    funnelInterpret: "你如何解讀漏斗圖？（若有產生）",
    funnelPh: "例如：圖形大致對稱，未見明顯發表偏差。小型研究稍偏右側，但研究數不足以確認。",
    biasTests: "你會考慮使用哪些額外檢測方法？",
    eggers: "Egger's 迴歸測試",
    trimFill: "Trim-and-Fill 法",
    beggs: "Begg's 等級相關檢定",
    failsafe: "Fail-safe N",
    subgroupPlan: "次群組或敏感性分析計畫",
    subgroupPh: "例如：依 eGFR 基線值分組、排除高偏差風險研究、僅納入 CKD 專屬試驗",

    // Step 6: Conclusions
    conclusionTitle: "撰寫結論",
    mainFinding: "主要發現",
    mainFindingPh: "用 1-2 句話總結你的統合分析結果。",
    certainty: "證據確定性 (GRADE)",
    gradeHigh: "高",
    gradeMod: "中等",
    gradeLow: "低",
    gradeVLow: "極低",
    certRationale: "GRADE 評級理由",
    certRationalePh: "例如：因研究間異質性降一級，因部分研究對照組事件率差異降一級。",
    limitations: "主要限制",
    limitationsPh: "例如：納入研究以大型跨國試驗為主，可能對特定族群的推論受限。",
    implications: "臨床意義",
    implicationsPh: "例如：SGLT2 抑制劑對 CKD 合併 T2DM 患者的腎臟保護效果明確，應納入臨床指引考量。",
    aiCheck: "AI 檢查結論",
    aiChecking: "AI 分析中...",

    // Completion
    congrats: "🎉 恭喜完成！",
    congratsDesc: "你已完成一個完整的統合分析流程——從定義 PICO 到撰寫結論。將你的分析結果和圖表加入學術海報吧！",
    summaryTitle: "你的統合分析摘要",
    backToHub: "返回課程主頁",
    noData: "請先完成規劃篇（Phase 1）",
    goToMidterm: "前往規劃篇 →",
  },
  en: {
    title: "MA Workshop: Analysis",
    subtitle: "Choose analysis methods, run your meta-analysis, interpret results, write conclusions",
    step1: "Effect Size & Model",
    step2: "Prepare Data",
    step3: "Run Analysis",
    step4: "Interpret & Report",
    step5: "Conclusions",
    next: "Next",
    prev: "Back",

    effectLabel: "Effect Size Type",
    effectOR: "Odds Ratio (OR)",
    effectRR: "Risk Ratio (RR)",
    effectRD: "Risk Difference (RD)",
    effectMD: "Mean Difference (MD)",
    effectSMD: "Standardized Mean Difference (SMD)",
    modelLabel: "Meta-Analysis Model",
    modelFixed: "Fixed-Effect Model",
    modelRandom: "Random-Effects Model",
    modelFixedDesc: "Assumes all studies estimate the same true effect. Best when studies are homogeneous.",
    modelRandomDesc: "Assumes each study has a different true effect. More common, especially with clinical diversity.",
    rationale: "Why did you choose this effect size and model?",
    rationalePh: "e.g., Outcome is binary (event occurrence), and studies vary in population and dose, so we chose OR + random-effects.",
    binaryNote: "Your data is binary — OR or RR are recommended.",
    contNote: "Your data is continuous — MD or SMD are recommended.",
    effectWhy: {
      OR: "OR works well for case-control studies and rare events. Most clinical MAs use OR.",
      RR: "RR is more intuitive for prospective studies. Not suitable for case-control designs.",
      RD: "RD shows absolute risk difference and allows NNT calculation. Unstable when baseline risks vary.",
      MD: "MD is appropriate when all studies measure the outcome on the same scale.",
      SMD: "SMD (Hedges' g) is appropriate when studies use different scales measuring the same construct.",
    },

    prepTitle: "Prepare Your Data",
    prepDesc: "The table below organizes the data you extracted in the Planning phase. You can:",
    prepOption1: "Copy the table into an online calculator",
    prepOption2: "Download as CSV file",
    prepOption3: "Copy a ready-made R script",
    copyTable: "Copy Table",
    downloadCSV: "Download CSV",
    copied: "Copied!",
    studyLabel: "Study",
    eventsI: "Intervention Events",
    totalI: "Intervention Total",
    eventsC: "Control Events",
    totalC: "Control Total",
    meanI: "Intervention Mean",
    sdI: "Intervention SD",
    nI: "Intervention N",
    meanC: "Control Mean",
    sdC: "Control SD",
    nC: "Control N",

    runTitle: "Run Your Meta-Analysis",
    runDesc: "Choose one method to run the analysis and get your forest plot and statistics:",
    tabOnline: "Online Calculator (no install)",
    tabR: "R Code (metafor)",
    onlineTitle: "Using the Onlinemeta Calculator",
    onlineSteps: [
      "Click the link below to open Onlinemeta",
      "Select \"Meta\" from the left sidebar",
      "Choose your data type (Dichotomous or Continuous)",
      "Paste your copied data or upload the CSV from the previous step",
      "Select your effect size type and model (Fixed/Random)",
      "Click \"Run\" to generate forest plot and funnel plot",
      "Download the plots (PDF or PNG) for your poster",
    ],
    onlineLink: "Open Onlinemeta →",
    onlineAlt: "Alternative online tools:",
    rTitle: "Using R + metafor Package",
    rSteps: [
      "Make sure R and RStudio are installed",
      "Copy the code below into RStudio",
      "Run the code (Ctrl+A to select all, then Ctrl+Enter)",
      "Forest plot and funnel plot will be generated automatically",
      "Export plots using RStudio's plot export feature",
    ],
    rCopyCode: "Copy R Code",
    rInstallNote: "If metafor is not installed, run first: install.packages(\"metafor\")",

    // Step 4: Interpret & Report
    interpretTitle: "Interpret & Report Results",
    reportGuideTitle: "How to report your results",
    reportGuideIntro: "From your analysis tool, locate these key statistics and include them in your interpretation below:",
    reportItems: [
      "Pooled effect size (e.g., OR = 0.67)",
      "95% confidence interval (e.g., [0.55, 0.82])",
      "p-value (e.g., p < 0.001)",
      "I² statistic (e.g., I² = 35.2%)",
      "Number of included studies",
    ],
    reportExample: "Example write-up",
    reportExampleText: "A meta-analysis of five RCTs (N = 32,476) showed that SGLT2 inhibitors significantly reduced the composite kidney outcome (OR = 0.67, 95% CI: 0.55–0.82, p < 0.001). Heterogeneity was moderate (I² = 35.2%).",
    forestQ1: "What does the pooled effect mean? Is it statistically significant?",
    forestQ1Ph: "e.g., OR = 0.67 means the intervention group had 33% lower odds of the event, and the 95% CI does not cross 1, so it's statistically significant.",
    forestQ2: "Are effect directions consistent across studies? Which study has the highest weight?",
    forestQ2Ph: "e.g., All 5 studies favor the intervention. EMPA-KIDNEY has the highest weight due to the largest sample size and narrowest CI.",
    hetInterpret: "How do you interpret the heterogeneity?",
    hetInterpretPh: "e.g., I²=35% suggests low-to-moderate heterogeneity, possibly due to differences in population definitions (CKD-specific vs high CV risk).",
    funnelInterpret: "How do you interpret the funnel plot? (if generated)",
    funnelPh: "e.g., The plot appears roughly symmetric with no obvious publication bias. Smaller studies cluster slightly to one side, but the number of studies is too small to confirm.",
    biasTests: "Which additional detection methods would you consider?",
    eggers: "Egger's regression test",
    trimFill: "Trim-and-Fill method",
    beggs: "Begg's rank correlation test",
    failsafe: "Fail-safe N",
    subgroupPlan: "Subgroup or sensitivity analysis plan",
    subgroupPh: "e.g., Subgroup by baseline eGFR, exclude high RoB studies, restrict to CKD-dedicated trials",

    conclusionTitle: "Write Conclusions",
    mainFinding: "Main Finding",
    mainFindingPh: "Summarize your meta-analysis result in 1-2 sentences.",
    certainty: "Certainty of Evidence (GRADE)",
    gradeHigh: "High",
    gradeMod: "Moderate",
    gradeLow: "Low",
    gradeVLow: "Very Low",
    certRationale: "Rationale for GRADE rating",
    certRationalePh: "e.g., Downgraded one level for heterogeneity, one level for indirectness in some trials.",
    limitations: "Key Limitations",
    limitationsPh: "e.g., Included studies are predominantly large multinational trials, limiting generalizability to specific populations.",
    implications: "Clinical Implications",
    implicationsPh: "e.g., SGLT2 inhibitors show clear renoprotective benefit in T2DM+CKD patients and should be considered in clinical guidelines.",
    aiCheck: "AI Check Conclusions",
    aiChecking: "AI analyzing...",

    congrats: "🎉 Congratulations!",
    congratsDesc: "You've completed a full meta-analysis workflow — from defining PICO to writing conclusions. Add your results and plots to your academic poster!",
    summaryTitle: "Your Meta-Analysis Summary",
    backToHub: "Back to Course Hub",
    noData: "Please complete the Planning phase (Phase 1) first",
    goToMidterm: "Go to Planning Workshop →",
  },
};

// ═══ REUSABLE UI ═══
function InputField({ label, value, onChange, placeholder, multiline, style = {} }) {
  const shared = { width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, fontSize: 14, fontFamily: FONT, color: DARK, background: CARD_BG, outline: "none", transition: "border 0.2s", boxSizing: "border-box", ...style };
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6 }}>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...shared, resize: "vertical" }} onFocus={e => e.target.style.borderColor = CRIMSON} onBlur={e => e.target.style.borderColor = LIGHT_BORDER} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={shared} onFocus={e => e.target.style.borderColor = CRIMSON} onBlur={e => e.target.style.borderColor = LIGHT_BORDER} />}
    </div>
  );
}

function Btn({ children, onClick, primary, disabled, small, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: small ? "6px 16px" : "10px 24px", borderRadius: 10, fontSize: small ? 12 : 14, fontWeight: 600, fontFamily: FONT, cursor: disabled ? "not-allowed" : "pointer", border: primary ? "none" : `1.5px solid ${LIGHT_BORDER}`, background: disabled ? "#DDD" : primary ? (hov ? "#A0312A" : CRIMSON) : (hov ? "#F5F4F0" : CARD_BG), color: primary ? "#FFF" : DARK, transition: "all 0.2s", opacity: disabled ? 0.5 : 1, ...style }}>
      {children}
    </button>
  );
}

function Card({ children, style = {} }) {
  return <div style={{ background: CARD_BG, borderRadius: 16, border: `1px solid ${LIGHT_BORDER}`, padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.03)", ...style }}>{children}</div>;
}

function Hint({ children }) {
  return <div style={{ background: `${CRIMSON}08`, border: `1px solid ${CRIMSON}22`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 16 }}>💡 {children}</div>;
}

function AiFeedbackBox({ feedback, loading, lang }) {
  if (loading) return <div style={{ background: `${CRIMSON}08`, borderRadius: 12, padding: 16, marginTop: 12, textAlign: "center" }}><div style={{ fontSize: 13, color: CRIMSON }}>{lang === "zh" ? "AI 分析中..." : "AI analyzing..."} <span style={{ display: "inline-block", animation: "pulse 1.2s infinite" }}>⏳</span></div></div>;
  if (!feedback) return null;
  const isPass = feedback.includes("✅");
  return <div style={{ background: isPass ? `${GREEN}08` : `${AMBER}08`, border: `1px solid ${isPass ? GREEN : AMBER}30`, borderRadius: 12, padding: 16, marginTop: 12 }}><div style={{ fontSize: 13, color: DARK, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{feedback}</div></div>;
}

function StepIndicator({ steps, current, onStepClick }) {
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 32, overflowX: "auto", padding: "0 0 8px" }}>
      {steps.map((label, i) => {
        const active = i === current, done = i < current;
        const clickable = done || active;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <div onClick={() => clickable && onStepClick && onStepClick(i)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: active ? `${CRIMSON}14` : "transparent", minWidth: 0, cursor: clickable ? "pointer" : "default" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: done ? GREEN : active ? CRIMSON : LIGHT_BORDER, color: done || active ? "#FFF" : MUTED, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{done ? "✓" : i + 1}</div>
              <span style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? DARK : MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: done ? GREEN : LIGHT_BORDER, minWidth: 8, margin: "0 2px" }} />}
          </div>
        );
      })}
    </div>
  );
}

function CopyButton({ text, label, copiedLabel }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };
  return <Btn small onClick={handleCopy} style={{ background: copied ? `${GREEN}14` : CARD_BG, borderColor: copied ? GREEN : LIGHT_BORDER, color: copied ? GREEN : DARK }}>{copied ? `✓ ${copiedLabel}` : label}</Btn>;
}

// ═══ DATA HELPERS ═══
function getIncluded(project) { return (project?.studies || []).filter(s => s.included); }
function isBinary(studies) { return studies.length > 0 && studies[0].outcomeType === "binary"; }

function buildTSV(studies, bin) {
  if (bin) {
    const h = ["Study", "Events_I", "Total_I", "Events_C", "Total_C"].join("\t");
    return [h, ...studies.map(s => [s.citation, s.tx?.events, s.tx?.total, s.ctrl?.events, s.ctrl?.total].join("\t"))].join("\n");
  }
  const h = ["Study", "Mean_I", "SD_I", "N_I", "Mean_C", "SD_C", "N_C"].join("\t");
  return [h, ...studies.map(s => [s.citation, s.txCont?.mean, s.txCont?.sd, s.txCont?.n, s.ctrlCont?.mean, s.ctrlCont?.sd, s.ctrlCont?.n].join("\t"))].join("\n");
}

function buildCSV(studies, bin) {
  const esc = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
  if (bin) {
    return ["Study,Events_I,Total_I,Events_C,Total_C", ...studies.map(s => [esc(s.citation), s.tx?.events, s.tx?.total, s.ctrl?.events, s.ctrl?.total].join(","))].join("\n");
  }
  return ["Study,Mean_I,SD_I,N_I,Mean_C,SD_C,N_C", ...studies.map(s => [esc(s.citation), s.txCont?.mean, s.txCont?.sd, s.txCont?.n, s.ctrlCont?.mean, s.ctrlCont?.sd, s.ctrlCont?.n].join(","))].join("\n");
}

function buildRCode(studies, bin, effectType, model) {
  const method = model === "fixed" ? 'method = "FE"' : 'method = "DL"';
  const measure = effectType || "OR";
  const q = s => `"${s.citation.replace(/"/g, '\\"')}"`;
  let code = `# ══════════════════════════════════════════════════
# Meta-Analysis with metafor
# Generated by 統合分析 101 / Meta-Analysis 101
# ══════════════════════════════════════════════════

# install.packages("metafor")  # Run once if needed
library(metafor)

`;
  if (bin) {
    code += `# ── Study Data (Binary Outcome) ──
dat <- data.frame(
  study = c(${studies.map(q).join(", ")}),
  ai    = c(${studies.map(s => s.tx?.events ?? "NA").join(", ")}),   # intervention events
  n1i   = c(${studies.map(s => s.tx?.total ?? "NA").join(", ")}),  # intervention total
  ci    = c(${studies.map(s => s.ctrl?.events ?? "NA").join(", ")}),   # control events
  n2i   = c(${studies.map(s => s.ctrl?.total ?? "NA").join(", ")})   # control total
)

# ── Calculate Effect Sizes ──
dat <- escalc(measure = "${measure}",
              ai = ai, n1i = n1i,
              ci = ci, n2i = n2i,
              data = dat)

`;
  } else {
    code += `# ── Study Data (Continuous Outcome) ──
dat <- data.frame(
  study = c(${studies.map(q).join(", ")}),
  m1i   = c(${studies.map(s => s.txCont?.mean ?? "NA").join(", ")}),   # intervention mean
  sd1i  = c(${studies.map(s => s.txCont?.sd ?? "NA").join(", ")}),  # intervention SD
  n1i   = c(${studies.map(s => s.txCont?.n ?? "NA").join(", ")}),   # intervention N
  m2i   = c(${studies.map(s => s.ctrlCont?.mean ?? "NA").join(", ")}),   # control mean
  sd2i  = c(${studies.map(s => s.ctrlCont?.sd ?? "NA").join(", ")}),  # control SD
  n2i   = c(${studies.map(s => s.ctrlCont?.n ?? "NA").join(", ")})    # control N
)

# ── Calculate Effect Sizes ──
dat <- escalc(measure = "${measure}",
              m1i = m1i, sd1i = sd1i, n1i = n1i,
              m2i = m2i, sd2i = sd2i, n2i = n2i,
              data = dat)

`;
  }

  const isLog = ["OR", "RR"].includes(measure);
  code += `# ── Run Meta-Analysis ──
res <- rma(yi, vi, data = dat, ${method}, slab = dat$study)

# ── View Results ──
print(res)
cat("\\n--- Key Statistics ---\\n")
cat("Pooled ${measure}:", ${isLog ? "exp(coef(res))" : "coef(res)"}, "\\n")
cat("95% CI:", ${isLog ? "exp(res$ci.lb), \"to\", exp(res$ci.ub)" : "res$ci.lb, \"to\", res$ci.ub"}, "\\n")
cat("p-value:", res$pval, "\\n")
cat("I²:", res$I2, "%\\n")
cat("Q:", res$QE, "(df =", res$k - 1, ", p =", res$QEp, ")\\n")
cat("tau²:", res$tau2, "\\n")

# ── Forest Plot ──
forest(res, header = TRUE,
       ${isLog ? 'atransf = exp,\n       ' : ""}xlab = "${measure} (95% CI)",
       cex = 0.9)

# ── Funnel Plot ──
funnel(res, main = "Funnel Plot")
`;
  return code;
}

function downloadFile(content, filename) {
  const blob = new Blob(["\uFEFF" + content], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.download = filename; a.href = URL.createObjectURL(blob); a.click();
}

const cellSt = { padding: "8px 10px", textAlign: "center", borderBottom: `1px solid ${LIGHT_BORDER}`, fontFamily: "monospace", fontSize: 13 };

// ═══ STEP COMPONENTS ═══

function Step1({ analysis, setA, project, lang }) {
  const tx = T[lang];
  const bin = isBinary(getIncluded(project));
  const opts = bin
    ? [{ key: "OR", label: tx.effectOR }, { key: "RR", label: tx.effectRR }, { key: "RD", label: tx.effectRD }]
    : [{ key: "MD", label: tx.effectMD }, { key: "SMD", label: tx.effectSMD }];

  return (
    <div>
      <Hint>{bin ? tx.binaryNote : tx.contNote}</Hint>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>{tx.effectLabel}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {opts.map(o => (
          <div key={o.key} onClick={() => setA(p => ({ ...p, effectType: o.key }))} style={{ padding: "12px 16px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${analysis.effectType === o.key ? CRIMSON : LIGHT_BORDER}`, background: analysis.effectType === o.key ? `${CRIMSON}08` : CARD_BG, transition: "all 0.2s" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: analysis.effectType === o.key ? CRIMSON : DARK }}>{o.label}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{tx.effectWhy[o.key]}</div>
          </div>
        ))}
      </div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>{tx.modelLabel}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {[{ key: "random", label: tx.modelRandom, desc: tx.modelRandomDesc }, { key: "fixed", label: tx.modelFixed, desc: tx.modelFixedDesc }].map(m => (
          <div key={m.key} onClick={() => setA(p => ({ ...p, model: m.key }))} style={{ padding: "12px 16px", borderRadius: 12, cursor: "pointer", border: `1.5px solid ${analysis.model === m.key ? CRIMSON : LIGHT_BORDER}`, background: analysis.model === m.key ? `${CRIMSON}08` : CARD_BG, transition: "all 0.2s" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: analysis.model === m.key ? CRIMSON : DARK }}>{m.label}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{m.desc}</div>
          </div>
        ))}
      </div>
      <InputField label={tx.rationale} value={analysis.rationale || ""} onChange={v => setA(p => ({ ...p, rationale: v }))} placeholder={tx.rationalePh} multiline />
    </div>
  );
}

function Step2({ project, analysis, lang }) {
  const tx = T[lang]; const inc = getIncluded(project); const bin = isBinary(inc);
  const tsv = buildTSV(inc, bin); const csv = buildCSV(inc, bin);
  const headers = bin ? [tx.studyLabel, tx.eventsI, tx.totalI, tx.eventsC, tx.totalC] : [tx.studyLabel, tx.meanI, tx.sdI, tx.nI, tx.meanC, tx.sdC, tx.nC];

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 8 }}>{tx.prepTitle}</h3>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 6 }}>{tx.prepDesc}</p>
      <ul style={{ fontSize: 13, color: MUTED, marginBottom: 20, paddingLeft: 20, lineHeight: 1.8 }}>
        <li>{tx.prepOption1}</li><li>{tx.prepOption2}</li><li>{tx.prepOption3}</li>
      </ul>
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr>{headers.map((h, i) => <th key={i} style={{ padding: "8px 10px", textAlign: i === 0 ? "left" : "center", color: DARK, fontWeight: 600, borderBottom: `2px solid ${LIGHT_BORDER}`, whiteSpace: "nowrap", fontSize: 12 }}>{h}</th>)}</tr></thead>
          <tbody>{inc.map((s, idx) => (
            <tr key={s.id} style={{ background: idx % 2 === 0 ? CARD_BG : LIGHT_BG }}>
              <td style={{ padding: "8px 10px", borderBottom: `1px solid ${LIGHT_BORDER}`, fontWeight: 500, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.citation || `Study ${idx + 1}`}</td>
              {bin
                ? <><td style={cellSt}>{s.tx?.events}</td><td style={cellSt}>{s.tx?.total}</td><td style={cellSt}>{s.ctrl?.events}</td><td style={cellSt}>{s.ctrl?.total}</td></>
                : <><td style={cellSt}>{s.txCont?.mean}</td><td style={cellSt}>{s.txCont?.sd}</td><td style={cellSt}>{s.txCont?.n}</td><td style={cellSt}>{s.ctrlCont?.mean}</td><td style={cellSt}>{s.ctrlCont?.sd}</td><td style={cellSt}>{s.ctrlCont?.n}</td></>}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <CopyButton text={tsv} label={`📋 ${tx.copyTable}`} copiedLabel={tx.copied} />
        <Btn small onClick={() => downloadFile(csv, "ma_data.csv")} style={{ fontSize: 12 }}>📥 {tx.downloadCSV}</Btn>
      </div>
    </div>
  );
}

function Step3({ project, analysis, lang }) {
  const tx = T[lang]; const [tab, setTab] = useState("online");
  const inc = getIncluded(project); const bin = isBinary(inc);
  const rCode = buildRCode(inc, bin, analysis.effectType, analysis.model);

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 8 }}>{tx.runTitle}</h3>
      <p style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>{tx.runDesc}</p>

      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderRadius: 10, overflow: "hidden", border: `1px solid ${LIGHT_BORDER}` }}>
        {["online", "r"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "10px 16px", fontSize: 13, fontWeight: 600, fontFamily: FONT, background: tab === t ? `${CRIMSON}10` : CARD_BG, color: tab === t ? CRIMSON : MUTED, border: "none", borderRight: t === "online" ? `1px solid ${LIGHT_BORDER}` : "none", cursor: "pointer" }}>
            {t === "online" ? `🌐 ${tx.tabOnline}` : `📟 ${tx.tabR}`}
          </button>
        ))}
      </div>

      {tab === "online" ? (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 12 }}>{tx.onlineTitle}</h4>
          <ol style={{ fontSize: 13, color: MUTED, lineHeight: 2, paddingLeft: 20, marginBottom: 20 }}>
            {tx.onlineSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <a href="https://smuonco.shinyapps.io/Onlinemeta/" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 10, background: CRIMSON, color: "#FFF", fontSize: 14, fontWeight: 600, textDecoration: "none", fontFamily: FONT }}>
            {tx.onlineLink}
          </a>
          <div style={{ marginTop: 20, fontSize: 12, color: MUTED }}>
            {tx.onlineAlt}
            <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
              <a href="https://metaanalysisonline.com/" target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontSize: 12 }}>MetaAnalysisOnline.com</a>
              <a href="https://www.meta-mar.com/" target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontSize: 12 }}>Meta-Mar</a>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 12 }}>{tx.rTitle}</h4>
          <ol style={{ fontSize: 13, color: MUTED, lineHeight: 2, paddingLeft: 20, marginBottom: 12 }}>
            {tx.rSteps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
          <Hint>{tx.rInstallNote}</Hint>
          <div style={{ position: "relative", marginBottom: 16 }}>
            <pre style={{ background: "#1E1E2E", color: "#CDD6F4", borderRadius: 12, padding: 20, fontSize: 14, lineHeight: 1.7, overflowX: "auto", fontFamily: "'Courier New', Courier, monospace", maxHeight: 480, tabSize: 2 }}>{rCode}</pre>
            <div style={{ position: "absolute", top: 10, right: 10 }}>
              <CopyButton text={rCode} label={tx.rCopyCode} copiedLabel={tx.copied} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Step4({ analysis, setA, lang }) {
  const tx = T[lang];
  const biasOpts = [{ key: "eggers", label: tx.eggers }, { key: "trimFill", label: tx.trimFill }, { key: "beggs", label: tx.beggs }, { key: "failsafe", label: tx.failsafe }];
  const toggleTest = k => { const c = analysis.biasTests || []; setA(p => ({ ...p, biasTests: c.includes(k) ? c.filter(x => x !== k) : [...c, k] })); };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 16 }}>{tx.interpretTitle}</h3>

      {/* Reporting guidance box */}
      <div style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}20`, borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
          📋 {tx.reportGuideTitle}
        </h4>
        <p style={{ fontSize: 13, color: MUTED, marginBottom: 10, lineHeight: 1.6 }}>{tx.reportGuideIntro}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          {tx.reportItems.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: DARK }}>
              <span style={{ color: CRIMSON, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ background: CARD_BG, borderRadius: 8, padding: "12px 16px", border: `1px solid ${LIGHT_BORDER}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: CRIMSON, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{tx.reportExample}</div>
          <div style={{ fontSize: 13, color: DARK, lineHeight: 1.7, fontStyle: "italic" }}>{tx.reportExampleText}</div>
        </div>
      </div>

      {/* Interpretation questions */}
      <InputField label={tx.forestQ1} value={analysis.forestQ1 || ""} onChange={v => setA(p => ({ ...p, forestQ1: v }))} placeholder={tx.forestQ1Ph} multiline />
      <InputField label={tx.forestQ2} value={analysis.forestQ2 || ""} onChange={v => setA(p => ({ ...p, forestQ2: v }))} placeholder={tx.forestQ2Ph} multiline />
      <InputField label={tx.hetInterpret} value={analysis.hetInterpretation || ""} onChange={v => setA(p => ({ ...p, hetInterpretation: v }))} placeholder={tx.hetInterpretPh} multiline />
      <InputField label={tx.funnelInterpret} value={analysis.funnelAssessment || ""} onChange={v => setA(p => ({ ...p, funnelAssessment: v }))} placeholder={tx.funnelPh} multiline />

      {/* Bias tests */}
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10, marginTop: 8 }}>{tx.biasTests}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {biasOpts.map(o => { const sel = (analysis.biasTests || []).includes(o.key); return (
          <button key={o.key} onClick={() => toggleTest(o.key)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontFamily: FONT, border: `1.5px solid ${sel ? CRIMSON : LIGHT_BORDER}`, background: sel ? `${CRIMSON}14` : CARD_BG, color: sel ? CRIMSON : MUTED, cursor: "pointer", fontWeight: sel ? 600 : 400 }}>{sel ? "✓ " : ""}{o.label}</button>
        ); })}
      </div>
      <InputField label={tx.subgroupPlan} value={analysis.subgroupPlan || ""} onChange={v => setA(p => ({ ...p, subgroupPlan: v }))} placeholder={tx.subgroupPh} multiline />
    </div>
  );
}

function Step5({ analysis, setA, project, lang }) {
  const tx = T[lang]; const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(analysis._conclusionFeedback || null);
  const gradeOpts = [{ key: "high", label: tx.gradeHigh, color: GREEN }, { key: "moderate", label: tx.gradeMod, color: BLUE }, { key: "low", label: tx.gradeLow, color: AMBER }, { key: "very_low", label: tx.gradeVLow, color: RED }];
  const canCheck = (analysis.mainFinding || "").trim().length > 10;

  const handleAiCheck = async () => {
    setAiLoading(true); setAiFeedback(null);
    const isZh = lang === "zh";
    // AI reads the user's written interpretation instead of structured form fields
    const interpretContext = [analysis.forestQ1, analysis.forestQ2, analysis.hetInterpretation, analysis.funnelAssessment].filter(Boolean).join("\n");
    const systemPrompt = isZh
      ? `你是統合分析方法學專家。學生完成統合分析並撰寫結論。
PICO — P: ${project.pico?.p} | I: ${project.pico?.i} | C: ${project.pico?.c} | O: ${project.pico?.o}
學生的結果解讀：${interpretContext || "（未填寫）"}
納入研究：${getIncluded(project).length} 篇　效果量類型：${analysis.effectType}　模型：${analysis.model}
評估：1. 結論是否與他們描述的結果一致？ 2. GRADE 合理？ 3. 臨床意義具體？ 4. 限制描述恰當？ 5. 結果報告是否包含必要統計數據（效果量、CI、p值、I²）？
以「✅」或「⚠️」開頭。4-6 句繁體中文。不用 Markdown。`
      : `You are a meta-analysis methodology expert. Student completed MA and is writing conclusions.
PICO — P: ${project.pico?.p} | I: ${project.pico?.i} | C: ${project.pico?.c} | O: ${project.pico?.o}
Student's result interpretation: ${interpretContext || "(not provided)"}
Studies: ${getIncluded(project).length} | Effect: ${analysis.effectType} | Model: ${analysis.model}
Evaluate: 1. Are conclusions consistent with their described results? 2. GRADE reasonable? 3. Implications specific? 4. Limitations appropriate? 5. Does their reporting include necessary statistics (effect size, CI, p-value, I²)?
Start with "✅" or "⚠️". 4-6 sentences. No Markdown.`;
    const userMsg = `Finding: ${analysis.mainFinding}\nGRADE: ${analysis.certainty} — ${analysis.certRationale}\nLimitations: ${analysis.limitations}\nImplications: ${analysis.implications}`;
    try {
      const resp = await fetch("/api/ai-feedback", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ system: systemPrompt, userMessage: userMsg }) });
      const data = await resp.json();
      const text = data.content?.map(i => i.text || "").join("") || (isZh ? "無法取得回饋" : "Could not get feedback");
      setAiFeedback(text); setA(p => ({ ...p, _conclusionFeedback: text }));
    } catch { setAiFeedback(isZh ? "連線錯誤" : "Connection error"); }
    setAiLoading(false);
  };

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 16 }}>{tx.conclusionTitle}</h3>
      <InputField label={tx.mainFinding} value={analysis.mainFinding || ""} onChange={v => setA(p => ({ ...p, mainFinding: v }))} placeholder={tx.mainFindingPh} multiline />
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>{tx.certainty}</label>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {gradeOpts.map(g => (
          <button key={g.key} onClick={() => setA(p => ({ ...p, certainty: g.key }))} style={{ flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1.5px solid ${analysis.certainty === g.key ? g.color : LIGHT_BORDER}`, background: analysis.certainty === g.key ? `${g.color}14` : CARD_BG, color: analysis.certainty === g.key ? g.color : MUTED }}>{g.label}</button>
        ))}
      </div>
      <InputField label={tx.certRationale} value={analysis.certRationale || ""} onChange={v => setA(p => ({ ...p, certRationale: v }))} placeholder={tx.certRationalePh} />
      <InputField label={tx.limitations} value={analysis.limitations || ""} onChange={v => setA(p => ({ ...p, limitations: v }))} placeholder={tx.limitationsPh} multiline />
      <InputField label={tx.implications} value={analysis.implications || ""} onChange={v => setA(p => ({ ...p, implications: v }))} placeholder={tx.implicationsPh} multiline />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
        <Btn primary onClick={handleAiCheck} disabled={!canCheck || aiLoading}>{aiLoading ? tx.aiChecking : `🤖 ${tx.aiCheck}`}</Btn>
      </div>
      <AiFeedbackBox feedback={aiFeedback} loading={aiLoading} lang={lang} />
    </div>
  );
}

function Completion({ analysis, project, lang }) {
  const tx = T[lang];
  return (
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: DARK, marginBottom: 8 }}>{tx.congrats}</h2>
      <p style={{ fontSize: 14, color: MUTED, marginBottom: 32, lineHeight: 1.6, maxWidth: 540, margin: "0 auto 32px" }}>{tx.congratsDesc}</p>
      <Card style={{ textAlign: "left", maxWidth: 600, margin: "0 auto" }}>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: DARK, marginBottom: 16 }}>{tx.summaryTitle}</h4>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 2 }}>
          <div><strong style={{ color: DARK }}>PICO:</strong> {project.pico?.p} / {project.pico?.i} / {project.pico?.c} / {project.pico?.o}</div>
          <div><strong style={{ color: DARK }}>{lang === "zh" ? "納入研究" : "Studies"}:</strong> {getIncluded(project).length}</div>
          <div><strong style={{ color: DARK }}>{lang === "zh" ? "效果量" : "Effect"}:</strong> {analysis.effectType} ({analysis.model === "random" ? (lang === "zh" ? "隨機效果" : "Random") : (lang === "zh" ? "固定效果" : "Fixed")})</div>
          {analysis.forestQ1 && <div style={{ background: `${CRIMSON}06`, borderRadius: 8, padding: "8px 12px", margin: "8px 0", fontSize: 13, color: DARK, lineHeight: 1.7 }}>{analysis.forestQ1}</div>}
          {analysis.mainFinding && <div style={{ marginTop: 8 }}><strong style={{ color: DARK }}>{lang === "zh" ? "主要發現" : "Finding"}:</strong> {analysis.mainFinding}</div>}
          {analysis.certainty && <div><strong style={{ color: DARK }}>GRADE:</strong> {analysis.certainty}</div>}
          {analysis.implications && <div><strong style={{ color: DARK }}>{lang === "zh" ? "臨床意義" : "Implications"}:</strong> {analysis.implications}</div>}
        </div>
      </Card>
    </div>
  );
}

// ═══ MAIN ═══
export default function Final({ onNavigate, user, onLogin, onLogout }) {
  const { t, lang } = useI18n(); const tx = T[lang]; const [step, setStep] = useState(0);

  const [project] = useState(() => { try { const s = sessionStorage.getItem("ma_project_midterm"); if (s) return JSON.parse(s); } catch {} return null; });

  const [analysis, setA] = useState(() => {
    try { const s = sessionStorage.getItem("ma_project_final"); if (s) return JSON.parse(s); } catch {}
    const inc = getIncluded(project); const bin = inc.length > 0 ? isBinary(inc) : true;
    return { effectType: bin ? "OR" : "MD", model: "random", rationale: "", forestQ1: "", forestQ2: "", hetInterpretation: "", funnelAssessment: "", biasTests: [], subgroupPlan: "", mainFinding: "", certainty: "", certRationale: "", limitations: "", implications: "", _conclusionFeedback: null };
  });

  useEffect(() => { try { sessionStorage.setItem("ma_project_final", JSON.stringify(analysis)); } catch {} }, [analysis]);

  if (!project || !getIncluded(project).length) {
    return (
      <div style={{ fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", background: LIGHT_BG, minHeight: "100vh" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: ${LIGHT_BG}; }
          ::selection { background: ${CRIMSON}22; color: ${DARK}; }
        `}</style>
        <SiteNav onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} courseId="final" courseLabel={tx.title} courseColor={CRIMSON} />
        <div style={{ maxWidth: 500, margin: "80px auto", textAlign: "center", padding: "0 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 8 }}>{tx.noData}</h2>
          <Btn primary onClick={() => onNavigate("midterm")} style={{ marginTop: 16 }}>{tx.goToMidterm}</Btn>
        </div>
      </div>
    );
  }

  const steps = [tx.step1, tx.step2, tx.step3, tx.step4, tx.step5];
  const isLast = step === steps.length - 1; const isDone = step === steps.length;

  return (
    <div style={{ fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", background: LIGHT_BG, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${CRIMSON}22; color: ${DARK}; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
      <SiteNav onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} courseId="final" courseLabel={tx.title} courseColor={CRIMSON} />
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 60px" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 24, height: 2, background: CRIMSON, borderRadius: 1 }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: CRIMSON }}>Phase 2</span>
          </div>
          <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.15, color: DARK, marginBottom: 16 }}>{tx.title}</h1>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 8 }}>{tx.subtitle}</p>
          <div style={{ background: `${CRIMSON}06`, border: `1px solid ${CRIMSON}15`, borderRadius: 10, padding: "10px 14px", fontSize: 12, color: MUTED }}>
            <strong style={{ color: DARK }}>PICO:</strong> {project.pico?.p} | {project.pico?.i} | {project.pico?.c} | {project.pico?.o}
          </div>
        </div>

        {!isDone && <StepIndicator steps={steps} current={step} onStepClick={setStep} />}

        <Card style={{ marginBottom: 24 }}>
          {step === 0 && <Step1 analysis={analysis} setA={setA} project={project} lang={lang} />}
          {step === 1 && <Step2 project={project} analysis={analysis} lang={lang} />}
          {step === 2 && <Step3 project={project} analysis={analysis} lang={lang} />}
          {step === 3 && <Step4 analysis={analysis} setA={setA} lang={lang} />}
          {step === 4 && <Step5 analysis={analysis} setA={setA} project={project} lang={lang} />}
          {isDone && <Completion analysis={analysis} project={project} lang={lang} />}
        </Card>

        {!isDone ? (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Btn onClick={() => setStep(s => s - 1)} disabled={step === 0}>{tx.prev}</Btn>
            <div style={{ fontSize: 12, color: MUTED }}>{step + 1} / {steps.length}</div>
            <Btn primary onClick={() => setStep(s => s + 1)}>{isLast ? (lang === "zh" ? "完成 🎉" : "Finish 🎉") : tx.next}</Btn>
          </div>
        ) : (
          <div style={{ textAlign: "center" }}><Btn onClick={() => onNavigate("hub")} style={{ marginTop: 16 }}>← {tx.backToHub}</Btn></div>
        )}

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={() => onNavigate("hub")} style={{ background: "none", border: "none", fontSize: 13, color: MUTED, cursor: "pointer", fontFamily: FONT }}>← {tx.backToHub}</button>
        </div>
      </div>
    </div>
  );
}
