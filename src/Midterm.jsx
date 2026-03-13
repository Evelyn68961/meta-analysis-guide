import { useState, useEffect, useRef, useCallback } from "react";
import { useI18n } from "./i18n";
import SiteNav from "./SiteNav";

// ═══ DESIGN TOKENS ═══
const GOLD = "#8B6914";
const GOLD_LIGHT = "#F5F0E0";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const GREEN = "#3DA87A";
const RED = "#D94B2E";
const AMBER = "#D4A843";
const FONT = "'Noto Sans TC', 'Outfit', sans-serif";

// ═══ BILINGUAL TEXT (inline — not in i18n.js since this is a standalone workshop) ═══
const T = {
  zh: {
    title: "研究工作坊：規劃篇",
    subtitle: "定義研究問題、搜尋文獻、萃取資料",
    step1: "定義 PICO",
    step2: "搜尋策略",
    step3: "納入研究",
    step4: "資料萃取",
    step5: "偏差風險評估",
    next: "下一步",
    prev: "上一步",
    save: "儲存進度",
    topicLabel: "你想回答什麼臨床問題？",
    topicPlaceholder: "例如：SGLT2 抑制劑是否能延緩慢性腎臟病進展？",
    topicHint: "輸入一個具體的臨床問題。AI 會幫你確認 PICO 是否完整。",
    picoP: "族群 (Population)",
    picoI: "介入措施 (Intervention)",
    picoC: "對照 (Comparator)",
    picoO: "結局指標 (Outcome)",
    picoPPh: "例如：第二型糖尿病合併 CKD 3-4 期成人",
    picoIPh: "例如：SGLT2 抑制劑 (dapagliflozin, empagliflozin)",
    picoCPh: "例如：安慰劑或標準治療",
    picoOPh: "例如：eGFR 下降速率、腎臟替代治療發生率",
    aiCheck: "AI 檢查",
    aiChecking: "AI 分析中...",
    aiPass: "✅ PICO 通過檢查",
    aiFail: "需要修改 — 請參考 AI 建議",
    // Step 2
    dbLabel: "選擇搜尋資料庫",
    boolLabel: "Boolean 搜尋策略",
    boolHint: "使用 AND / OR / NOT 組合你的搜尋詞",
    boolPlaceholder: "(population terms) AND (intervention terms) AND (outcome terms)",
    greyLabel: "灰色文獻來源（選填）",
    greyPlaceholder: "例如：ClinicalTrials.gov、WHO ICTRP、會議摘要",
    searchAiCheck: "AI 檢查搜尋策略",
    // Step 3
    addStudy: "＋ 新增研究",
    studyCitation: "引用格式",
    studyCitationPh: "例如：Chen et al., 2023, Lancet",
    studyDesign: "研究設計",
    studyN: "樣本數 (N)",
    studyPop: "研究族群",
    studyIntv: "介入措施",
    studyComp: "對照",
    studyOutcome: "結局指標",
    include: "納入",
    exclude: "排除",
    excludeReason: "排除原因",
    excludeReasonPh: "例如：非 RCT、結局不符",
    minStudies: "至少需要 3 篇納入研究才能繼續",
    studyCount: (n) => `已納入 ${n} 篇研究`,
    removeStudy: "移除",
    // Step 4
    outcomeType: "結局類型",
    binary: "二元 (Binary)",
    continuous: "連續 (Continuous)",
    events: "事件數",
    total: "總人數",
    mean: "平均值",
    sd: "標準差",
    nGroup: "人數",
    txGroup: "介入組",
    ctrlGroup: "對照組",
    effectAuto: "效果量將自動計算。如需進行次群組分析或統合迴歸，可新增調節變項欄位。",
    addModerator: "＋ 新增調節變項",
    moderatorName: "變項名稱",
    moderatorNamePh: "例如：研究地區、劑量 (mg)、追蹤時間 (週)",
    removeModerator: "移除此欄位",
    moderatorHint: "調節變項可用於分析篇的次群組分析和統合迴歸。",
    // Step 5
    robDomains: ["隨機化", "盲化", "流失", "選擇性報告", "其他"],
    robLow: "低",
    robSome: "部分疑慮",
    robHigh: "高",
    robOverall: "整體偏差風險",
    // Phase gate
    gateTitle: "Phase 1 完成！",
    gateDesc: "你已完成規劃階段。前往分析篇繼續你的統合分析。",
    goToFinal: "前往分析篇 →",
    gateBlocked: "尚未達成條件",
    gateNeedPico: "PICO 需通過 AI 檢查",
    gateNeedStudies: "至少需要 3 篇納入研究",
    // Demo
    tryDemo: "試用範例資料",
    demoLoaded: "已載入範例資料",
    // Misc
    collapse: "收合",
    expand: "展開",
    study: "研究",
    downloadTable: "下載摘要表格",
  },
  en: {
    title: "MA Workshop: Planning",
    subtitle: "Define your question, search literature, extract data",
    step1: "Define PICO",
    step2: "Search Strategy",
    step3: "Add Studies",
    step4: "Data Extraction",
    step5: "Risk of Bias",
    next: "Next",
    prev: "Back",
    save: "Save Progress",
    topicLabel: "What clinical question do you want to answer?",
    topicPlaceholder: "e.g., Do SGLT2 inhibitors slow CKD progression?",
    topicHint: "Enter a specific clinical question. AI will help validate your PICO.",
    picoP: "Population",
    picoI: "Intervention",
    picoC: "Comparator",
    picoO: "Outcome",
    picoPPh: "e.g., Adults with T2DM and CKD stage 3–4",
    picoIPh: "e.g., SGLT2 inhibitors (dapagliflozin, empagliflozin)",
    picoCPh: "e.g., Placebo or standard of care",
    picoOPh: "e.g., Rate of eGFR decline, incidence of renal replacement therapy",
    aiCheck: "AI Check",
    aiChecking: "AI analyzing...",
    aiPass: "✅ PICO passed review",
    aiFail: "Revision needed — see AI suggestions",
    // Step 2
    dbLabel: "Select search databases",
    boolLabel: "Boolean search strategy",
    boolHint: "Use AND / OR / NOT to combine your search terms",
    boolPlaceholder: "(population terms) AND (intervention terms) AND (outcome terms)",
    greyLabel: "Grey literature sources (optional)",
    greyPlaceholder: "e.g., ClinicalTrials.gov, WHO ICTRP, conference abstracts",
    searchAiCheck: "AI Check Search Strategy",
    // Step 3
    addStudy: "+ Add Study",
    studyCitation: "Citation",
    studyCitationPh: "e.g., Chen et al., 2023, Lancet",
    studyDesign: "Study Design",
    studyN: "Sample Size (N)",
    studyPop: "Population",
    studyIntv: "Intervention",
    studyComp: "Comparator",
    studyOutcome: "Outcome",
    include: "Include",
    exclude: "Exclude",
    excludeReason: "Exclusion Reason",
    excludeReasonPh: "e.g., Not RCT, outcome mismatch",
    minStudies: "At least 3 included studies required to proceed",
    studyCount: (n) => `${n} studies included`,
    removeStudy: "Remove",
    // Step 4
    outcomeType: "Outcome Type",
    binary: "Binary",
    continuous: "Continuous",
    events: "Events",
    total: "Total",
    mean: "Mean",
    sd: "SD",
    nGroup: "N",
    txGroup: "Intervention",
    ctrlGroup: "Control",
    effectAuto: "Effect size will be computed automatically. Add moderator columns if you plan to run subgroup analysis or meta-regression.",
    addModerator: "+ Add Moderator Column",
    moderatorName: "Column Name",
    moderatorNamePh: "e.g., Region, Dosage (mg), Follow-up (weeks)",
    removeModerator: "Remove column",
    moderatorHint: "Moderator variables enable subgroup analysis and meta-regression in the Analysis workshop.",
    // Step 5
    robDomains: ["Randomization", "Blinding", "Attrition", "Selective Reporting", "Other"],
    robLow: "Low",
    robSome: "Some Concerns",
    robHigh: "High",
    robOverall: "Overall Risk of Bias",
    // Phase gate
    gateTitle: "Phase 1 Complete!",
    gateDesc: "You've finished the planning phase. Continue to the analysis workshop.",
    goToFinal: "Go to Analysis Workshop →",
    gateBlocked: "Requirements not met",
    gateNeedPico: "PICO must pass AI check",
    gateNeedStudies: "At least 3 included studies required",
    // Demo
    tryDemo: "Try with example data",
    demoLoaded: "Example data loaded",
    // Misc
    collapse: "Collapse",
    expand: "Expand",
    study: "Study",
    downloadTable: "Download Summary Table",
  },
};

// ═══ DEMO DATA ═══
const DEMO_PROJECT = {
  topic: "Do SGLT2 inhibitors reduce CKD progression compared to placebo in adults with type 2 diabetes?",
  pico: {
    p: "Adults with type 2 diabetes and CKD stage 2–4 (eGFR 20–90 mL/min/1.73 m²)",
    i: "SGLT2 inhibitors (dapagliflozin 10 mg, empagliflozin 10 mg, or canagliflozin 100 mg)",
    c: "Matching placebo",
    o: "Composite kidney outcome: ≥40% sustained eGFR decline, ESKD, or renal death",
  },
  studies: [
    { id: "s1", citation: "Perkovic et al., 2019, NEJM (CREDENCE)", design: "RCT", n: 4401, population: "T2DM + CKD, eGFR 30-90", intervention: "Canagliflozin 100mg", comparator: "Placebo", outcome: "Composite kidney outcome", included: true, excludeReason: "", outcomeType: "binary", tx: { events: 245, total: 2202 }, ctrl: { events: 340, total: 2199 }, rob: { randomization: "low", blinding: "low", attrition: "low", reporting: "low", other: "some", overall: "low" }, moderators: { "Population Focus": "CKD-specific", "Drug": "Canagliflozin" } },
    { id: "s2", citation: "Heerspink et al., 2020, NEJM (DAPA-CKD)", design: "RCT", n: 4304, population: "CKD ± T2DM, eGFR 25-75", intervention: "Dapagliflozin 10mg", comparator: "Placebo", outcome: "Composite kidney outcome", included: true, excludeReason: "", outcomeType: "binary", tx: { events: 197, total: 2152 }, ctrl: { events: 312, total: 2152 }, rob: { randomization: "low", blinding: "low", attrition: "low", reporting: "low", other: "low", overall: "low" }, moderators: { "Population Focus": "CKD-specific", "Drug": "Dapagliflozin" } },
    { id: "s3", citation: "EMPA-KIDNEY Collaborative, 2023, NEJM", design: "RCT", n: 6609, population: "CKD ± T2DM, eGFR 20-45 or 45-90+ACR", intervention: "Empagliflozin 10mg", comparator: "Placebo", outcome: "Composite kidney outcome", included: true, excludeReason: "", outcomeType: "binary", tx: { events: 432, total: 3304 }, ctrl: { events: 558, total: 3305 }, rob: { randomization: "low", blinding: "low", attrition: "low", reporting: "low", other: "low", overall: "low" }, moderators: { "Population Focus": "CKD-specific", "Drug": "Empagliflozin" } },
    { id: "s4", citation: "Zinman et al., 2015, NEJM (EMPA-REG OUTCOME)", design: "RCT", n: 7020, population: "T2DM + high CV risk", intervention: "Empagliflozin 10/25mg", comparator: "Placebo", outcome: "Incident/worsening nephropathy", included: true, excludeReason: "", outcomeType: "binary", tx: { events: 525, total: 4687 }, ctrl: { events: 388, total: 2333 }, rob: { randomization: "low", blinding: "low", attrition: "some", reporting: "low", other: "low", overall: "low" }, moderators: { "Population Focus": "High CV risk", "Drug": "Empagliflozin" } },
    { id: "s5", citation: "Neal et al., 2017, NEJM (CANVAS)", design: "RCT", n: 10142, population: "T2DM + high CV risk", intervention: "Canagliflozin 100/300mg", comparator: "Placebo", outcome: "Renal composite", included: true, excludeReason: "", outcomeType: "binary", tx: { events: 245, total: 5795 }, ctrl: { events: 186, total: 4347 }, rob: { randomization: "low", blinding: "low", attrition: "some", reporting: "low", other: "some", overall: "some" }, moderators: { "Population Focus": "High CV risk", "Drug": "Canagliflozin" } },
  ],
  moderatorColumns: ["Population Focus", "Drug"],
};

// ═══ HELPER: Empty study template ═══
function newStudy(id) {
  return {
    id, citation: "", design: "RCT", n: "", population: "", intervention: "",
    comparator: "", outcome: "", included: true, excludeReason: "",
    outcomeType: "binary",
    tx: { events: "", total: "" },
    ctrl: { events: "", total: "" },
    txCont: { mean: "", sd: "", n: "" },
    ctrlCont: { mean: "", sd: "", n: "" },
    rob: { randomization: "", blinding: "", attrition: "", reporting: "", other: "", overall: "" },
    moderators: {},
  };
}

// ═══ REUSABLE UI COMPONENTS ═══
function StepIndicator({ steps, current, onStepClick }) {
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 32, overflowX: "auto", padding: "0 0 8px" }}>
      {steps.map((label, i) => {
        const active = i === current;
        const done = i < current;
        const clickable = done || active;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 0 }}>
            <div
              onClick={() => clickable && onStepClick && onStepClick(i)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                borderRadius: 10, background: active ? `${GOLD}14` : "transparent",
                transition: "all 0.3s", minWidth: 0,
                cursor: clickable ? "pointer" : "default",
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                background: done ? GREEN : active ? GOLD : LIGHT_BORDER,
                color: done || active ? "#FFF" : MUTED,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, transition: "all 0.3s",
              }}>
                {done ? "✓" : i + 1}
              </div>
              <span style={{
                fontSize: 12, fontWeight: active ? 600 : 400,
                color: active ? DARK : MUTED,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, background: done ? GREEN : LIGHT_BORDER, minWidth: 12, margin: "0 4px", transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline, style = {} }) {
  const shared = {
    width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`,
    fontSize: 14, fontFamily: FONT, color: DARK, background: CARD_BG, outline: "none",
    transition: "border 0.2s", boxSizing: "border-box", ...style,
  };
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6 }}>{label}</label>}
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          rows={3} style={{ ...shared, resize: "vertical" }}
          onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = LIGHT_BORDER} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={shared}
          onFocus={e => e.target.style.borderColor = GOLD} onBlur={e => e.target.style.borderColor = LIGHT_BORDER} />
      )}
    </div>
  );
}

function Btn({ children, onClick, primary, disabled, small, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        padding: small ? "6px 16px" : "10px 24px",
        borderRadius: 10, fontSize: small ? 12 : 14, fontWeight: 600, fontFamily: FONT,
        cursor: disabled ? "not-allowed" : "pointer",
        border: primary ? "none" : `1.5px solid ${LIGHT_BORDER}`,
        background: disabled ? "#DDD" : primary ? (hov ? "#A07B1A" : GOLD) : (hov ? "#F5F4F0" : CARD_BG),
        color: primary ? "#FFF" : DARK,
        transition: "all 0.2s", opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >{children}</button>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: CARD_BG, borderRadius: 16, border: `1px solid ${LIGHT_BORDER}`,
      padding: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.03)", ...style,
    }}>{children}</div>
  );
}

function Hint({ children }) {
  return (
    <div style={{
      background: `${GOLD}08`, border: `1px solid ${GOLD}22`, borderRadius: 10,
      padding: "10px 14px", fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 16,
    }}>
      💡 {children}
    </div>
  );
}

function AiFeedbackBox({ feedback, loading, lang }) {
  if (loading) return (
    <div style={{ background: `${GOLD}08`, borderRadius: 12, padding: 16, marginTop: 12, textAlign: "center" }}>
      <div style={{ fontSize: 13, color: GOLD }}>
        {lang === "zh" ? "AI 分析中..." : "AI analyzing..."}
        <span style={{ display: "inline-block", animation: "pulse 1.2s infinite" }}> ⏳</span>
      </div>
    </div>
  );
  if (!feedback) return null;
  const isPass = feedback.includes("✅");
  return (
    <div style={{
      background: isPass ? `${GREEN}08` : `${AMBER}08`,
      border: `1px solid ${isPass ? GREEN : AMBER}30`,
      borderRadius: 12, padding: 16, marginTop: 12,
    }}>
      <div style={{ fontSize: 13, color: DARK, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{feedback}</div>
    </div>
  );
}

// ═══ STEP 1: PICO ═══
function Step1Pico({ project, setProject, lang }) {
  const tx = T[lang];
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(project._picoFeedback || null);
  const [picoPass, setPicoPass] = useState(project._picoPass || false);

  const { pico } = project;
  const setPico = (field, val) => setProject(prev => ({ ...prev, pico: { ...prev.pico, [field]: val }, _picoPass: false, _picoFeedback: null }));

  const canCheck = pico.p.trim() && pico.i.trim() && pico.c.trim() && pico.o.trim() && project.topic.trim();

  const handleAiCheck = async () => {
    setAiLoading(true);
    setAiFeedback(null);
    setPicoPass(false);
    const isZh = lang === "zh";
    const systemPrompt = isZh
      ? `你是一位統合分析方法學專家。學生正在為自己的統合分析定義 PICO。
請評估：
1. 每個元素是否具體且可搜尋？
2. 這個問題是否適合以系統性文獻回顧回答？
3. 是否可能有足夠的研究來回答？
若 PICO 合理且可行，以「✅」開頭回答。
若需要修改，以「⚠️」開頭，並給出具體建議。
用繁體中文簡潔回答（4-6句）。不要使用 Markdown 格式。`
      : `You are a meta-analysis methodology expert. The student is defining a PICO for their own meta-analysis.
Evaluate:
1. Is each component specific and searchable?
2. Is the question answerable via systematic review?
3. Are there likely enough studies on this topic?
If the PICO is reasonable and feasible, start with "✅".
If revisions are needed, start with "⚠️" and give specific suggestions.
Be concise (4-6 sentences). No Markdown formatting.`;

    const userMsg = `Clinical question: ${project.topic}\nP: ${pico.p}\nI: ${pico.i}\nC: ${pico.c}\nO: ${pico.o}`;

    try {
      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, userMessage: userMsg }),
      });
      const data = await response.json();
      const text = data.content?.map(item => item.text || "").join("") || (isZh ? "無法取得回饋" : "Could not get feedback");
      const pass = text.includes("✅");
      setAiFeedback(text);
      setPicoPass(pass);
      setProject(prev => ({ ...prev, _picoFeedback: text, _picoPass: pass }));
    } catch (err) {
      setAiFeedback(isZh ? "連線錯誤，請稍後重試。" : "Connection error. Please try again.");
    }
    setAiLoading(false);
  };

  return (
    <div>
      <InputField
        label={tx.topicLabel}
        value={project.topic}
        onChange={val => setProject(prev => ({ ...prev, topic: val, _picoPass: false, _picoFeedback: null }))}
        placeholder={tx.topicPlaceholder}
        multiline
      />
      <Hint>{tx.topicHint}</Hint>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 8 }}>
        <InputField label={tx.picoP} value={pico.p} onChange={v => setPico("p", v)} placeholder={tx.picoPPh} />
        <InputField label={tx.picoI} value={pico.i} onChange={v => setPico("i", v)} placeholder={tx.picoIPh} />
        <InputField label={tx.picoC} value={pico.c} onChange={v => setPico("c", v)} placeholder={tx.picoCPh} />
        <InputField label={tx.picoO} value={pico.o} onChange={v => setPico("o", v)} placeholder={tx.picoOPh} />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
        <Btn primary onClick={handleAiCheck} disabled={!canCheck || aiLoading}>
          {aiLoading ? tx.aiChecking : `🤖 ${tx.aiCheck}`}
        </Btn>
        {picoPass && <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>{tx.aiPass}</span>}
      </div>

      <AiFeedbackBox feedback={aiFeedback} loading={aiLoading} lang={lang} />
    </div>
  );
}

// ═══ STEP 2: SEARCH STRATEGY ═══
const DATABASES = [
  "PubMed", "Embase", "Cochrane CENTRAL", "CINAHL", "Web of Science",
  "Scopus", "PsycINFO", "LILACS",
];

function Step2Search({ project, setProject, lang }) {
  const tx = T[lang];
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(project._searchFeedback || null);

  const search = project.search || { databases: [], booleanQuery: "", greyLiterature: "" };
  const setSearch = (field, val) => setProject(prev => ({
    ...prev,
    search: { ...prev.search, [field]: val },
    _searchFeedback: null,
  }));

  const toggleDb = (db) => {
    const dbs = search.databases.includes(db)
      ? search.databases.filter(d => d !== db)
      : [...search.databases, db];
    setSearch("databases", dbs);
  };

  const canCheck = search.databases.length >= 2 && search.booleanQuery.trim().length > 10;

  const handleAiCheck = async () => {
    setAiLoading(true);
    setAiFeedback(null);
    const isZh = lang === "zh";
    const systemPrompt = isZh
      ? `你是一位系統性文獻回顧搜尋策略專家。學生正在為以下 PICO 設計搜尋策略：
P: ${project.pico.p} | I: ${project.pico.i} | C: ${project.pico.c} | O: ${project.pico.o}
請評估：
1. 資料庫選擇是否充足且合理？
2. Boolean 語法是否正確？(AND/OR/NOT 使用是否恰當）
3. 搜尋詞是否涵蓋同義詞與 MeSH 詞？
4. 是否有遺漏的重要搜尋概念？
以「✅」或「⚠️」開頭簡潔回答（4-6句）。用繁體中文。不要使用 Markdown。`
      : `You are a systematic review search strategy expert. The student is designing a search for:
P: ${project.pico.p} | I: ${project.pico.i} | C: ${project.pico.c} | O: ${project.pico.o}
Evaluate:
1. Are the database choices sufficient and appropriate?
2. Is the Boolean syntax correct? (proper use of AND/OR/NOT)
3. Do search terms cover synonyms and MeSH terms?
4. Any missing important search concepts?
Start with "✅" or "⚠️". Be concise (4-6 sentences). No Markdown.`;

    const userMsg = `Databases: ${search.databases.join(", ")}\nBoolean: ${search.booleanQuery}\nGrey literature: ${search.greyLiterature || "none specified"}`;
    try {
      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, userMessage: userMsg }),
      });
      const data = await response.json();
      const text = data.content?.map(item => item.text || "").join("") || (isZh ? "無法取得回饋" : "Could not get feedback");
      setAiFeedback(text);
      setProject(prev => ({ ...prev, _searchFeedback: text }));
    } catch (err) {
      setAiFeedback(isZh ? "連線錯誤" : "Connection error");
    }
    setAiLoading(false);
  };

  return (
    <div>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>{tx.dbLabel}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {DATABASES.map(db => {
          const selected = search.databases.includes(db);
          return (
            <button key={db} onClick={() => toggleDb(db)} style={{
              padding: "6px 14px", borderRadius: 20, fontSize: 13, fontFamily: FONT,
              border: `1.5px solid ${selected ? GOLD : LIGHT_BORDER}`,
              background: selected ? `${GOLD}14` : CARD_BG,
              color: selected ? GOLD : MUTED, cursor: "pointer",
              fontWeight: selected ? 600 : 400, transition: "all 0.2s",
            }}>{db}</button>
          );
        })}
      </div>

      <InputField
        label={tx.boolLabel}
        value={search.booleanQuery}
        onChange={v => setSearch("booleanQuery", v)}
        placeholder={tx.boolPlaceholder}
        multiline
      />
      <Hint>{tx.boolHint}</Hint>

      <InputField
        label={tx.greyLabel}
        value={search.greyLiterature}
        onChange={v => setSearch("greyLiterature", v)}
        placeholder={tx.greyPlaceholder}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
        <Btn primary onClick={handleAiCheck} disabled={!canCheck || aiLoading}>
          {aiLoading ? tx.aiChecking : `🤖 ${tx.searchAiCheck}`}
        </Btn>
      </div>

      <AiFeedbackBox feedback={aiFeedback} loading={aiLoading} lang={lang} />
    </div>
  );
}

// ═══ STEP 3: ADD STUDIES ═══
function Step3Studies({ project, setProject, lang }) {
  const tx = T[lang];
  const studies = project.studies || [];
  const [expandedId, setExpandedId] = useState(null);

  const addStudy = () => {
    const id = `s${Date.now()}`;
    setProject(prev => ({ ...prev, studies: [...(prev.studies || []), newStudy(id)] }));
    setExpandedId(id);
  };

  const updateStudy = (id, field, val) => {
    setProject(prev => ({
      ...prev,
      studies: prev.studies.map(s => s.id === id ? { ...s, [field]: val } : s),
    }));
  };

  const removeStudy = (id) => {
    setProject(prev => ({
      ...prev,
      studies: prev.studies.filter(s => s.id !== id),
    }));
    if (expandedId === id) setExpandedId(null);
  };

  const includedCount = studies.filter(s => s.included).length;
  const designOptions = ["RCT", "Quasi-RCT", "Cohort", "Case-Control", "Cross-Sectional", "Before-After"];

  return (
    <div>
      <Hint>
        {lang === "zh"
          ? "輸入你要納入統合分析的研究。至少需要 3 篇。在真實的系統性文獻回顧中，你會篩選數百篇——這裡只需要輸入最終納入的研究。"
          : "Enter the studies you'll include in your meta-analysis. You need at least 3. In a real SR you'd screen hundreds — here, just enter your final included studies."}
      </Hint>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: includedCount >= 3 ? GREEN : MUTED }}>
          {tx.studyCount(includedCount)}
        </span>
        <Btn primary small onClick={addStudy}>{tx.addStudy}</Btn>
      </div>

      {studies.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: MUTED, fontSize: 14 }}>
          {lang === "zh" ? "尚未新增研究。點擊上方按鈕開始。" : "No studies added yet. Click the button above to start."}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {studies.map((study, idx) => {
          const isExpanded = expandedId === study.id;
          return (
            <Card key={study.id} style={{ padding: 0, overflow: "hidden", border: `1px solid ${study.included ? LIGHT_BORDER : `${RED}30`}` }}>
              {/* Header row — always visible */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : study.id)}
                style={{
                  padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  background: study.included ? CARD_BG : `${RED}06`,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                  background: study.included ? `${GREEN}14` : `${RED}14`,
                  color: study.included ? GREEN : RED,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                }}>{idx + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {study.citation || `${tx.study} ${idx + 1}`}
                  </div>
                  {study.design && <div style={{ fontSize: 12, color: MUTED }}>{study.design}{study.n ? ` · N=${study.n}` : ""}</div>}
                </div>
                <span style={{ fontSize: 11, color: study.included ? GREEN : RED, fontWeight: 600, flexShrink: 0 }}>
                  {study.included ? tx.include : tx.exclude}
                </span>
                <span style={{ fontSize: 14, color: MUTED, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "none" }}>▼</span>
              </div>

              {/* Expanded form */}
              {isExpanded && (
                <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${LIGHT_BORDER}` }}>
                  <div style={{ paddingTop: 16 }}>
                    <InputField label={tx.studyCitation} value={study.citation} onChange={v => updateStudy(study.id, "citation", v)} placeholder={tx.studyCitationPh} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6 }}>{tx.studyDesign}</label>
                        <select value={study.design} onChange={e => updateStudy(study.id, "design", e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1px solid ${LIGHT_BORDER}`, fontSize: 14, fontFamily: FONT, color: DARK, background: CARD_BG }}>
                          {designOptions.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <InputField label={tx.studyN} value={study.n} onChange={v => updateStudy(study.id, "n", v)} placeholder="e.g., 4401" />
                    </div>
                    <InputField label={tx.studyPop} value={study.population} onChange={v => updateStudy(study.id, "population", v)} placeholder="" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <InputField label={tx.studyIntv} value={study.intervention} onChange={v => updateStudy(study.id, "intervention", v)} />
                      <InputField label={tx.studyComp} value={study.comparator} onChange={v => updateStudy(study.id, "comparator", v)} />
                    </div>
                    <InputField label={tx.studyOutcome} value={study.outcome} onChange={v => updateStudy(study.id, "outcome", v)} />

                    {/* Include/Exclude toggle */}
                    <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                      <button onClick={() => updateStudy(study.id, "included", true)} style={{
                        flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
                        border: `1.5px solid ${study.included ? GREEN : LIGHT_BORDER}`,
                        background: study.included ? `${GREEN}14` : CARD_BG, color: study.included ? GREEN : MUTED,
                      }}>✓ {tx.include}</button>
                      <button onClick={() => updateStudy(study.id, "included", false)} style={{
                        flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
                        border: `1.5px solid ${!study.included ? RED : LIGHT_BORDER}`,
                        background: !study.included ? `${RED}14` : CARD_BG, color: !study.included ? RED : MUTED,
                      }}>✗ {tx.exclude}</button>
                    </div>
                    {!study.included && (
                      <InputField label={tx.excludeReason} value={study.excludeReason} onChange={v => updateStudy(study.id, "excludeReason", v)} placeholder={tx.excludeReasonPh} />
                    )}

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                      <Btn small onClick={() => removeStudy(study.id)} style={{ color: RED, borderColor: `${RED}30` }}>{tx.removeStudy}</Btn>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {includedCount < 3 && studies.length > 0 && (
        <div style={{ marginTop: 12, padding: "8px 14px", borderRadius: 10, background: `${AMBER}08`, border: `1px solid ${AMBER}22`, fontSize: 13, color: AMBER }}>
          ⚠️ {tx.minStudies}
        </div>
      )}
    </div>
  );
}

// ═══ STEP 4: DATA EXTRACTION ═══
function Step4Extraction({ project, setProject, lang }) {
  const tx = T[lang];
  const included = (project.studies || []).filter(s => s.included);
  const [expandedId, setExpandedId] = useState(included[0]?.id || null);
  const [newModName, setNewModName] = useState("");
  const [showModInput, setShowModInput] = useState(false);

  const modColumns = project.moderatorColumns || [];

  const updateStudy = (id, field, val) => {
    setProject(prev => ({
      ...prev,
      studies: prev.studies.map(s => s.id === id ? { ...s, [field]: val } : s),
    }));
  };

  const updateNested = (id, group, field, val) => {
    setProject(prev => ({
      ...prev,
      studies: prev.studies.map(s => s.id === id ? { ...s, [group]: { ...s[group], [field]: val } } : s),
    }));
  };

  const updateModerator = (id, colName, val) => {
    setProject(prev => ({
      ...prev,
      studies: prev.studies.map(s => s.id === id ? { ...s, moderators: { ...(s.moderators || {}), [colName]: val } } : s),
    }));
  };

  const addModeratorColumn = () => {
    const name = newModName.trim();
    if (!name || modColumns.includes(name)) return;
    setProject(prev => ({
      ...prev,
      moderatorColumns: [...(prev.moderatorColumns || []), name],
      studies: prev.studies.map(s => ({ ...s, moderators: { ...(s.moderators || {}), [name]: "" } })),
    }));
    setNewModName("");
    setShowModInput(false);
  };

  const removeModeratorColumn = (colName) => {
    setProject(prev => ({
      ...prev,
      moderatorColumns: (prev.moderatorColumns || []).filter(c => c !== colName),
      studies: prev.studies.map(s => {
        const mods = { ...(s.moderators || {}) };
        delete mods[colName];
        return { ...s, moderators: mods };
      }),
    }));
  };

  if (included.length === 0) {
    return <div style={{ textAlign: "center", padding: 40, color: MUTED }}>{lang === "zh" ? "請先在上一步新增納入研究" : "Please add included studies in the previous step"}</div>;
  }

  return (
    <div>
      <Hint>{tx.effectAuto}</Hint>

      {included.map((study, idx) => {
        const isExpanded = expandedId === study.id;
        const isBinary = study.outcomeType === "binary";
        return (
          <Card key={study.id} style={{ marginBottom: 12, padding: 0, overflow: "hidden" }}>
            <div onClick={() => setExpandedId(isExpanded ? null : study.id)}
              style={{ padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{study.citation || `${tx.study} ${idx + 1}`}</span>
              <span style={{ fontSize: 14, color: MUTED, transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
            </div>

            {isExpanded && (
              <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${LIGHT_BORDER}` }}>
                <div style={{ paddingTop: 16 }}>
                  {/* Outcome type toggle */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6 }}>{tx.outcomeType}</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["binary", "continuous"].map(type => (
                        <button key={type} onClick={() => updateStudy(study.id, "outcomeType", type)} style={{
                          flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
                          border: `1.5px solid ${study.outcomeType === type ? GOLD : LIGHT_BORDER}`,
                          background: study.outcomeType === type ? `${GOLD}14` : CARD_BG,
                          color: study.outcomeType === type ? GOLD : MUTED,
                        }}>{type === "binary" ? tx.binary : tx.continuous}</button>
                      ))}
                    </div>
                  </div>

                  {isBinary ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: GOLD, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{tx.txGroup}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <InputField label={tx.events} value={study.tx?.events ?? ""} onChange={v => updateNested(study.id, "tx", "events", v)} placeholder="e.g., 245" />
                          <InputField label={tx.total} value={study.tx?.total ?? ""} onChange={v => updateNested(study.id, "tx", "total", v)} placeholder="e.g., 2202" />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{tx.ctrlGroup}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                          <InputField label={tx.events} value={study.ctrl?.events ?? ""} onChange={v => updateNested(study.id, "ctrl", "events", v)} placeholder="e.g., 340" />
                          <InputField label={tx.total} value={study.ctrl?.total ?? ""} onChange={v => updateNested(study.id, "ctrl", "total", v)} placeholder="e.g., 2199" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: GOLD, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{tx.txGroup}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                          <InputField label={tx.mean} value={study.txCont?.mean ?? ""} onChange={v => updateNested(study.id, "txCont", "mean", v)} placeholder="e.g., -1.2" />
                          <InputField label={tx.sd} value={study.txCont?.sd ?? ""} onChange={v => updateNested(study.id, "txCont", "sd", v)} placeholder="e.g., 0.8" />
                          <InputField label={tx.nGroup} value={study.txCont?.n ?? ""} onChange={v => updateNested(study.id, "txCont", "n", v)} placeholder="e.g., 225" />
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{tx.ctrlGroup}</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                          <InputField label={tx.mean} value={study.ctrlCont?.mean ?? ""} onChange={v => updateNested(study.id, "ctrlCont", "mean", v)} placeholder="e.g., -0.3" />
                          <InputField label={tx.sd} value={study.ctrlCont?.sd ?? ""} onChange={v => updateNested(study.id, "ctrlCont", "sd", v)} placeholder="e.g., 0.7" />
                          <InputField label={tx.nGroup} value={study.ctrlCont?.n ?? ""} onChange={v => updateNested(study.id, "ctrlCont", "n", v)} placeholder="e.g., 225" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Moderator columns */}
                  {modColumns.length > 0 && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px dashed ${LIGHT_BORDER}` }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: GOLD, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                        {lang === "zh" ? "調節變項" : "Moderators"}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: modColumns.length > 2 ? "1fr 1fr 1fr" : modColumns.length === 2 ? "1fr 1fr" : "1fr", gap: 8 }}>
                        {modColumns.map(col => (
                          <InputField key={col} label={col} value={(study.moderators || {})[col] || ""} onChange={v => updateModerator(study.id, col, v)} placeholder="" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        );
      })}

      {/* Moderator column management */}
      <div style={{ marginTop: 20, padding: 16, background: `${GOLD}06`, borderRadius: 12, border: `1px solid ${GOLD}20` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: modColumns.length > 0 ? 12 : 0 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: DARK }}>
            {lang === "zh" ? "調節變項欄位" : "Moderator Columns"}
          </span>
          <Btn small onClick={() => setShowModInput(true)} style={{ fontSize: 12 }}>{tx.addModerator}</Btn>
        </div>

        {modColumns.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: showModInput ? 12 : 0 }}>
            {modColumns.map(col => (
              <div key={col} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 12px", borderRadius: 20, background: `${GOLD}14`, border: `1px solid ${GOLD}30`, fontSize: 13, color: DARK }}>
                {col}
                <button onClick={() => removeModeratorColumn(col)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 14, padding: 0, lineHeight: 1 }} title={tx.removeModerator}>×</button>
              </div>
            ))}
          </div>
        )}

        {showModInput && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <InputField label={tx.moderatorName} value={newModName} onChange={setNewModName} placeholder={tx.moderatorNamePh} />
            </div>
            <div style={{ display: "flex", gap: 6, paddingBottom: 16 }}>
              <Btn small primary onClick={addModeratorColumn} disabled={!newModName.trim()}>{lang === "zh" ? "新增" : "Add"}</Btn>
              <Btn small onClick={() => { setShowModInput(false); setNewModName(""); }}>{lang === "zh" ? "取消" : "Cancel"}</Btn>
            </div>
          </div>
        )}

        {modColumns.length === 0 && !showModInput && (
          <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{tx.moderatorHint}</div>
        )}
      </div>
    </div>
  );
}

// ═══ STEP 5: RISK OF BIAS ═══
const ROB_LEVELS = ["low", "some", "high"];
const ROB_COLORS = { low: GREEN, some: AMBER, high: RED };
const ROB_ICONS = { low: "🟢", some: "🟡", high: "🔴" };

function Step5RoB({ project, setProject, lang }) {
  const tx = T[lang];
  const included = (project.studies || []).filter(s => s.included);
  const domains = ["randomization", "blinding", "attrition", "reporting", "other"];
  const domainLabels = tx.robDomains;
  const levelLabels = { low: tx.robLow, some: tx.robSome, high: tx.robHigh };

  const updateRob = (studyId, domain, val) => {
    setProject(prev => ({
      ...prev,
      studies: prev.studies.map(s => {
        if (s.id !== studyId) return s;
        const newRob = { ...s.rob, [domain]: val };
        // Auto-derive overall: worst domain
        const vals = domains.map(d => newRob[d]).filter(Boolean);
        const overall = vals.includes("high") ? "high" : vals.includes("some") ? "some" : (vals.length === domains.length ? "low" : "");
        return { ...s, rob: { ...newRob, overall } };
      }),
    }));
  };

  if (included.length === 0) {
    return <div style={{ textAlign: "center", padding: 40, color: MUTED }}>{lang === "zh" ? "請先新增研究" : "Please add studies first"}</div>;
  }

  return (
    <div>
      <Hint>
        {lang === "zh"
          ? "為每篇研究的每個偏差風險領域評分。整體評分會自動根據最差的領域計算。"
          : "Rate each risk of bias domain for every study. Overall rating is auto-derived from the worst domain."}
      </Hint>

      {/* Traffic light matrix */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 10px", color: DARK, fontWeight: 600, borderBottom: `2px solid ${LIGHT_BORDER}`, position: "sticky", left: 0, background: LIGHT_BG, zIndex: 1, minWidth: 120 }}>
                {tx.study}
              </th>
              {domainLabels.map((d, i) => (
                <th key={i} style={{ textAlign: "center", padding: "8px 6px", color: MUTED, fontWeight: 500, borderBottom: `2px solid ${LIGHT_BORDER}`, fontSize: 11, minWidth: 70 }}>
                  {d}
                </th>
              ))}
              <th style={{ textAlign: "center", padding: "8px 6px", color: DARK, fontWeight: 700, borderBottom: `2px solid ${LIGHT_BORDER}`, fontSize: 11, minWidth: 70 }}>
                {tx.robOverall}
              </th>
            </tr>
          </thead>
          <tbody>
            {included.map((study, idx) => (
              <tr key={study.id}>
                <td style={{ padding: "8px 10px", fontWeight: 500, color: DARK, borderBottom: `1px solid ${LIGHT_BORDER}`, position: "sticky", left: 0, background: CARD_BG, zIndex: 1, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {study.citation || `${tx.study} ${idx + 1}`}
                </td>
                {domains.map((domain) => (
                  <td key={domain} style={{ textAlign: "center", padding: "6px 4px", borderBottom: `1px solid ${LIGHT_BORDER}` }}>
                    <div style={{ display: "flex", gap: 3, justifyContent: "center" }}>
                      {ROB_LEVELS.map(level => (
                        <button key={level} onClick={() => updateRob(study.id, domain, level)}
                          title={levelLabels[level]}
                          style={{
                            width: 24, height: 24, borderRadius: "50%", border: "none", cursor: "pointer",
                            background: study.rob[domain] === level ? ROB_COLORS[level] : `${ROB_COLORS[level]}20`,
                            color: study.rob[domain] === level ? "#FFF" : ROB_COLORS[level],
                            fontSize: 10, fontWeight: 700, transition: "all 0.15s",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                          {level[0].toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </td>
                ))}
                <td style={{ textAlign: "center", padding: "6px 4px", borderBottom: `1px solid ${LIGHT_BORDER}`, fontSize: 18 }}>
                  {study.rob.overall ? ROB_ICONS[study.rob.overall] : "—"}
                  <div style={{ fontSize: 10, color: study.rob.overall ? ROB_COLORS[study.rob.overall] : MUTED }}>
                    {study.rob.overall ? levelLabels[study.rob.overall] : ""}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══ PHASE GATE ═══
function PhaseGate({ project, onNavigate, lang }) {
  const tx = T[lang];
  const picoPass = project._picoPass;
  const includedCount = (project.studies || []).filter(s => s.included).length;
  const canProceed = picoPass && includedCount >= 3;

  return (
    <Card style={{ textAlign: "center", padding: 32 }}>
      {canProceed ? (
        <>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 8 }}>{tx.gateTitle}</h3>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>{tx.gateDesc}</p>
          <Btn primary onClick={() => onNavigate("final")} style={{ fontSize: 16, padding: "14px 32px" }}>{tx.goToFinal}</Btn>
        </>
      ) : (
        <>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: DARK, marginBottom: 16 }}>{tx.gateBlocked}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <div style={{ fontSize: 14, color: picoPass ? GREEN : RED, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{picoPass ? "✅" : "❌"}</span> {tx.gateNeedPico}
            </div>
            <div style={{ fontSize: 14, color: includedCount >= 3 ? GREEN : RED, display: "flex", alignItems: "center", gap: 8 }}>
              <span>{includedCount >= 3 ? "✅" : "❌"}</span> {tx.gateNeedStudies} ({includedCount}/3)
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

// ═══ MAIN MIDTERM COMPONENT ═══
export default function Midterm({ onNavigate, user, onLogin, onLogout }) {
  const { t, lang } = useI18n();
  const tx = T[lang];
  const [step, setStep] = useState(0);
  const [demoLoaded, setDemoLoaded] = useState(false);

  // Project state — single source of truth
  const [project, setProject] = useState(() => {
    // Try to load from sessionStorage for anonymous persistence
    try {
      const saved = sessionStorage.getItem("ma_project_midterm");
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      topic: "",
      pico: { p: "", i: "", c: "", o: "" },
      search: { databases: [], booleanQuery: "", greyLiterature: "" },
      studies: [],
      _picoPass: false,
      _picoFeedback: null,
      _searchFeedback: null,
    };
  });

  // Auto-save to sessionStorage
  useEffect(() => {
    try { sessionStorage.setItem("ma_project_midterm", JSON.stringify(project)); } catch {}
  }, [project]);

  const loadDemo = () => {
    setProject(prev => ({
      ...prev,
      ...DEMO_PROJECT,
      search: { databases: ["PubMed", "Embase", "Cochrane CENTRAL"], booleanQuery: "(\"SGLT2 inhibitors\" OR dapagliflozin OR empagliflozin OR canagliflozin) AND (\"chronic kidney disease\" OR CKD OR \"renal outcome\" OR nephropathy) AND (\"randomized controlled trial\" OR RCT)", greyLiterature: "ClinicalTrials.gov, EMPA-KIDNEY supplementary appendix" },
      _picoPass: false,
      _picoFeedback: null,
      _searchFeedback: null,
    }));
    setDemoLoaded(true);
    setTimeout(() => setDemoLoaded(false), 3000);
  };

  const steps = [tx.step1, tx.step2, tx.step3, tx.step4, tx.step5, lang === "zh" ? "完成" : "Done"];
  const totalSteps = steps.length;

  const canGoNext = () => {
    if (step === 0) return project.topic.trim() && project.pico.p.trim();
    if (step === 1) return (project.search?.databases?.length || 0) >= 1;
    if (step === 2) return (project.studies || []).length > 0;
    return true;
  };

  return (
    <div style={{ fontFamily: "'Noto Sans TC', 'Outfit', sans-serif", background: LIGHT_BG, minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${GOLD}22; color: ${DARK}; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        input:focus, textarea:focus, select:focus { border-color: ${GOLD} !important; box-shadow: 0 0 0 3px ${GOLD}12; }
      `}</style>
      <SiteNav onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} courseId="midterm" courseLabel={tx.title} courseColor={GOLD} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 20px 60px" }}>
        {/* Header */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div style={{ width: 24, height: 2, background: GOLD, borderRadius: 1 }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: GOLD }}>Phase 1</span>
          </div>
          <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.15, color: DARK, marginBottom: 16 }}>{tx.title}</h1>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 4 }}>{tx.subtitle}</p>
          {/* Hidden demo link */}
          <div style={{ textAlign: "right", marginTop: -20 }}>
            <button onClick={loadDemo} style={{
              background: "none", border: "none", fontSize: 11, color: `${MUTED}80`, cursor: "pointer",
              fontFamily: FONT, textDecoration: "underline", padding: "4px 0",
            }}>{tx.tryDemo}</button>
            {demoLoaded && <span style={{ fontSize: 11, color: GREEN, marginLeft: 8 }}>✓ {tx.demoLoaded}</span>}
          </div>
        </div>

        {/* Stepper */}
        <StepIndicator steps={steps} current={step} onStepClick={setStep} />

        {/* Step content */}
        <Card style={{ marginBottom: 24 }}>
          {step === 0 && <Step1Pico project={project} setProject={setProject} lang={lang} />}
          {step === 1 && <Step2Search project={project} setProject={setProject} lang={lang} />}
          {step === 2 && <Step3Studies project={project} setProject={setProject} lang={lang} />}
          {step === 3 && <Step4Extraction project={project} setProject={setProject} lang={lang} />}
          {step === 4 && <Step5RoB project={project} setProject={setProject} lang={lang} />}
          {step === 5 && <PhaseGate project={project} onNavigate={onNavigate} lang={lang} />}
        </Card>

        {/* Navigation buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Btn onClick={() => setStep(s => s - 1)} disabled={step === 0}>{tx.prev}</Btn>
          <div style={{ fontSize: 12, color: MUTED }}>
            {step + 1} / {totalSteps}
          </div>
          {step < 5 ? (
            <Btn primary onClick={() => setStep(s => s + 1)} disabled={!canGoNext()}>
              {step === 4 ? (lang === "zh" ? "檢視結果" : "Review") : tx.next}
            </Btn>
          ) : (
            <div style={{ width: 100 }} /> /* spacer to keep layout balanced */
          )}
        </div>

        {/* Back to hub */}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <button onClick={() => onNavigate("hub")} style={{
            background: "none", border: "none", fontSize: 13, color: MUTED, cursor: "pointer", fontFamily: FONT,
          }}>← {lang === "zh" ? "返回課程主頁" : "Back to Course Hub"}</button>
        </div>
      </div>
    </div>
  );
}
