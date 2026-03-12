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
const GREEN = "#3DA87A";
const GOLD = "#D4A843";

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

// ═══ S1 UPGRADE: SPOT THE SEARCH — Interactive Quiz ═══
function SpotTheSearch({ lang }) {
  const scenarios = [
    {
      zh: "看到同事分享的一篇 Meta-analysis，直接引用它的結論做決策",
      en: "A colleague shared a meta-analysis, so you cite its conclusions directly for your decision",
      answer: "casual",
      expZh: "直接引用他人結論而不自己搜尋，無法確認是否有更新或更好的證據。",
      expEn: "Citing someone else's conclusions without your own search means you can't verify if newer or better evidence exists.",
    },
    {
      zh: "在 PubMed 和 Embase 用預先寫好的搜尋策略搜尋，記錄每個資料庫的結果數和搜尋日期",
      en: "Search PubMed and Embase using a pre-written strategy, recording result counts and dates for each database",
      answer: "systematic",
      expZh: "這符合系統性搜尋的三個核心要素：預先設計策略、搜尋多個資料庫、完整記錄。",
      expEn: "This meets the three hallmarks of systematic searching: pre-designed strategy, multiple databases, and complete documentation.",
    },
    {
      zh: "在 Google Scholar 搜尋關鍵字，選了前 20 篇看起來最相關的",
      en: "Searched Google Scholar with keywords and picked the first 20 that looked most relevant",
      answer: "casual",
      expZh: "只用一個搜尋引擎、沒有預設策略、主觀選擇文獻 — 典型的隨意搜尋。",
      expEn: "Single search engine, no pre-set strategy, subjective selection — this is a typical casual search.",
    },
    {
      zh: "搜尋 PubMed、Embase、CENTRAL，另外手動搜尋 ClinicalTrials.gov 和相關文獻的參考文獻",
      en: "Searched PubMed, Embase, CENTRAL, plus hand-searched ClinicalTrials.gov and reference lists of included studies",
      answer: "systematic",
      expZh: "搜尋多個資料庫加上灰色文獻和手動引文追蹤，是高品質系統性搜尋的典型做法。",
      expEn: "Multiple databases plus grey literature and hand-searching reference lists is a hallmark of high-quality systematic searching.",
    },
  ];

  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (idx, val) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [idx]: val }));
  };

  const allAnswered = Object.keys(answers).length === scenarios.length;
  const score = scenarios.filter((s, i) => answers[i] === s.answer).length;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 22px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "辨識搜尋類型" : "Spot the Search Type"}
      </h3>
      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", marginBottom: 24 }}>
        {lang === "zh" ? "以下情境是「系統性搜尋」還是「隨意搜尋」？" : "Is each scenario 'systematic' or 'casual' searching?"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {scenarios.map((s, i) => {
          const picked = answers[i];
          const isCorrect = picked === s.answer;
          const revealed = showResults && picked;
          return (
            <div key={i} style={{
              background: revealed ? (isCorrect ? "#E6F5F0" : "#FDEEEB") : "#FAFAF7",
              border: `1.5px solid ${revealed ? (isCorrect ? GREEN + "44" : "#D94B2E44") : LIGHT_BORDER}`,
              borderRadius: 14, padding: "16px 18px", transition: "all 0.3s",
            }}>
              <p style={{ fontSize: 14, color: DARK, lineHeight: 1.6, marginBottom: 12 }}>
                {lang === "zh" ? s.zh : s.en}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {["systematic", "casual"].map(opt => {
                  const isThis = picked === opt;
                  const label = opt === "systematic"
                    ? (lang === "zh" ? "系統性搜尋" : "Systematic")
                    : (lang === "zh" ? "隨意搜尋" : "Casual");
                  const optColor = opt === "systematic" ? GREEN : CORAL;
                  return (
                    <button key={opt} onClick={() => handleAnswer(i, opt)}
                      style={{
                        flex: 1, padding: "8px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                        background: isThis ? `${optColor}15` : "transparent",
                        border: `1.5px solid ${isThis ? optColor : LIGHT_BORDER}`,
                        color: isThis ? optColor : MUTED,
                        cursor: showResults ? "default" : "pointer", transition: "all 0.2s",
                      }}>
                      {isThis && showResults ? (isCorrect ? "✓ " : "✗ ") : ""}{label}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <p style={{ fontSize: 13, lineHeight: 1.6, color: isCorrect ? "#2A7A5A" : "#B83A20", marginTop: 10, animation: "fadeInUp 0.3s ease-out" }}>
                  {lang === "zh" ? s.expZh : s.expEn}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        {!showResults ? (
          <button onClick={() => allAnswered && setShowResults(true)}
            style={{ ...btnPrimary, background: allAnswered ? PURPLE : "#E8E6E1", color: allAnswered ? "#FFF" : MUTED, cursor: allAnswered ? "pointer" : "default" }}>
            {lang === "zh" ? "查看結果" : "Check Answers"}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: score === 4 ? GREEN : score >= 3 ? PURPLE : CORAL }}>
              {score}/{scenarios.length} {lang === "zh" ? "正確" : "correct"} {score === 4 ? "🎉" : score >= 3 ? "👍" : "📚"}
            </span>
            <button onClick={() => { setAnswers({}); setShowResults(false); }}
              style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {lang === "zh" ? "重試" : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
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
            <text x={cx1 - r * 0.4} y={cy - r * 0.1} fontSize="13" fill={MUTED} textAnchor="middle">{lang === "zh" ? "心衰竭" : "Heart Failure"}</text>
            <text x={cx2 + r * 0.4} y={cy - r * 0.1} fontSize="13" fill={MUTED} textAnchor="middle">SGLT2i</text>
            <text x={size * 0.5} y={cy + 4} fontSize="12" fill="#2A7A5A" fontWeight="700" textAnchor="middle">AND</text>
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
            <text x={cx1 - r * 0.35} y={cy + 4} fontSize="13" fill={MUTED} textAnchor="middle">{lang === "zh" ? "糖尿病" : "Diabetes"}</text>
            <text x={cx2 + r * 0.35} y={cy + 4} fontSize="13" fill={MUTED} textAnchor="middle">{lang === "zh" ? "血糖" : "Glycemia"}</text>
            <text x={size * 0.5} y={size - 10} fontSize="12" fill="#7B68C8" fontWeight="700" textAnchor="middle">OR</text>
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
            <text x={cx1 - r * 0.4} y={cy + 4} fontSize="13" fill={MUTED} textAnchor="middle">{lang === "zh" ? "癌症" : "Cancer"}</text>
            <text x={cx2 + r * 0.35} y={cy + 4} fontSize="13" fill="#CCC" textAnchor="middle">{lang === "zh" ? "動物" : "Animal"}</text>
            <text x={size * 0.5} y={size - 10} fontSize="12" fill="#D94B2E" fontWeight="700" textAnchor="middle">NOT</text>
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
            <div style={{ marginBottom: 8 }}>{op.render(180)}</div>
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
            <div style={{ background: `${operators[activeOp].color}0D`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: operators[activeOp].color, fontWeight: 500, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>{t(operators[activeOp].exampleKey)}</div>
          </>
        ) : (
          <div style={{ fontSize: 13, color: "#B0AFAA", textAlign: "center", paddingTop: 12 }}>{t("c2boolClickHint")}</div>
        )}
      </div>
    </div>
  );
}

// ═══ INTERACTIVE BOOLEAN COMBO BUILDER ═══
function BooleanComboBuilder({ lang }) {
  const scenarios = [
    {
      id: "hf",
      labelZh: "SGLT2i 與心衰竭", labelEn: "SGLT2i & Heart Failure",
      groups: [
        { color: CORAL, terms: ["heart failure", "cardiac insufficiency", "HFrEF", "HFpEF"] },
        { color: GOLD, terms: ["SGLT2 inhibitor", "dapagliflozin", "empagliflozin", "canagliflozin"] },
        { color: GREEN, terms: ["mortality", "hospitalization", "clinical outcome", "survival"] },
      ],
      conceptsZh: ["疾病（心衰竭）", "介入（SGLT2i）", "結局"],
      conceptsEn: ["Disease (HF)", "Intervention (SGLT2i)", "Outcome"],
    },
    {
      id: "asthma",
      labelZh: "吸入型類固醇與氣喘", labelEn: "ICS & Asthma",
      groups: [
        { color: CORAL, terms: ["asthma", "bronchial asthma", "reactive airway"] },
        { color: GOLD, terms: ["inhaled corticosteroid", "budesonide", "fluticasone", "beclomethasone"] },
        { color: GREEN, terms: ["exacerbation", "lung function", "FEV1", "quality of life"] },
      ],
      conceptsZh: ["疾病（氣喘）", "介入（ICS）", "結局"],
      conceptsEn: ["Disease (Asthma)", "Intervention (ICS)", "Outcome"],
    },
    {
      id: "ckd",
      labelZh: "GLP-1 RA 與 CKD", labelEn: "GLP-1 RA & CKD",
      groups: [
        { color: CORAL, terms: ["chronic kidney disease", "CKD", "renal insufficiency", "diabetic nephropathy"] },
        { color: GOLD, terms: ["GLP-1 receptor agonist", "semaglutide", "liraglutide", "dulaglutide"] },
        { color: GREEN, terms: ["eGFR decline", "proteinuria", "kidney failure", "dialysis"] },
      ],
      conceptsZh: ["疾病（CKD）", "介入（GLP-1 RA）", "結局"],
      conceptsEn: ["Disease (CKD)", "Intervention (GLP-1 RA)", "Outcome"],
    },
  ];

  const [activeScenario, setActiveScenario] = useState(0);
  const s = scenarios[activeScenario];

  return (
    <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 16, padding: "24px 22px", marginTop: 28 }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 14 }}>
        {lang === "zh" ? "互動搜尋策略：選擇情境" : "Interactive Strategy: Choose a Scenario"}
      </h4>

      {/* Scenario tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {scenarios.map((sc, i) => (
          <button key={sc.id} onClick={() => setActiveScenario(i)}
            style={{
              padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: activeScenario === i ? `${PURPLE}12` : "transparent",
              border: `1.5px solid ${activeScenario === i ? PURPLE : LIGHT_BORDER}`,
              color: activeScenario === i ? PURPLE : MUTED,
              cursor: "pointer", transition: "all 0.2s",
            }}>
            {lang === "zh" ? sc.labelZh : sc.labelEn}
          </button>
        ))}
      </div>

      {/* Generated syntax */}
      <div style={{ background: "#FAFAF7", borderRadius: 10, padding: "14px 18px", fontSize: 13, lineHeight: 2.0, color: DARK, overflowX: "auto" }}>
        {s.groups.map((g, gi) => (
          <div key={gi}>
            {gi > 0 && <div><span style={{ color: GREEN, fontWeight: 700 }}>AND</span></div>}
            <div>
              (<span>
                {g.terms.map((term, ti) => (
                  <span key={ti}>
                    {ti > 0 && <span style={{ color: PURPLE, fontWeight: 700 }}> OR </span>}
                    <span style={{ color: g.color }}>{term}</span>
                  </span>
                ))}
              </span>)
              <span style={{ fontSize: 11, color: "#B0AFAA", marginLeft: 8 }}>
                ← {lang === "zh" ? (s.conceptsZh[gi]) : (s.conceptsEn[gi])}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 13, color: MUTED, marginTop: 12, lineHeight: 1.6 }}>
        {lang === "zh"
          ? "核心原則：用 OR 連接每組概念內的同義詞（橫向擴大），用 AND 連接不同概念（縱向聚焦）。"
          : "Core principle: use OR to connect synonyms within each concept (expand horizontally), use AND between concepts (focus vertically)."}
      </p>
    </div>
  );
}

// ═══ MeSH TREE EXPLORER ═══
function MeSHTreeExplorer({ lang }) {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [activeInfo, setActiveInfo] = useState(null);

  const toggleNode = (id) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const tree = {
    id: "root",
    labelZh: "心臟衰竭 [Heart Failure]",
    labelEn: "Heart Failure [C14.280.434]",
    mesh: "Heart Failure",
    children: [
      {
        id: "hfref",
        labelZh: "射出分率降低的心衰竭 [HFrEF]",
        labelEn: "Heart Failure, Systolic [C14.280.434.611]",
        mesh: "Heart Failure, Systolic",
        children: [],
      },
      {
        id: "hfpef",
        labelZh: "射出分率保留的心衰竭 [HFpEF]",
        labelEn: "Heart Failure, Diastolic [C14.280.434.459]",
        mesh: "Heart Failure, Diastolic",
        children: [],
      },
      {
        id: "cardio",
        labelZh: "心肌病變",
        labelEn: "Cardiomyopathies [C14.280.238]",
        mesh: "Cardiomyopathies",
        children: [
          { id: "dcm", labelZh: "擴張型心肌病", labelEn: "Cardiomyopathy, Dilated", mesh: "Cardiomyopathy, Dilated", children: [] },
        ],
      },
    ],
  };

  const concepts = [
    {
      id: "mesh-vs-free",
      iconZh: "MeSH vs 自由文字", iconEn: "MeSH vs Free Text",
      descZh: "MeSH 是 PubMed 的受控詞彙。索引員會為每篇文獻標記 MeSH 詞，確保同一概念用相同的詞彙表示。搜尋時應同時使用 MeSH 和自由文字，以達到最佳涵蓋範圍。",
      descEn: "MeSH is PubMed's controlled vocabulary. Indexers tag each article with MeSH terms, ensuring the same concept uses the same label. Always combine MeSH and free-text searching for best coverage.",
    },
    {
      id: "explosion",
      iconZh: "Explode 展開搜尋", iconEn: "MeSH Explosion",
      descZh: "搜尋一個 MeSH 主標題時，PubMed 預設會「展開」搜尋——自動包含所有下層子詞。例如搜 'Heart Failure' 會同時找到標記為 'Heart Failure, Systolic' 和 'Heart Failure, Diastolic' 的文獻。",
      descEn: "When you search a MeSH heading, PubMed automatically 'explodes' it — including all narrower terms below it in the tree. Searching 'Heart Failure' automatically finds articles tagged with 'Heart Failure, Systolic' and 'Heart Failure, Diastolic'.",
    },
    {
      id: "subheading",
      iconZh: "副標題 Subheadings", iconEn: "Subheadings / Qualifiers",
      descZh: "MeSH 詞可以搭配副標題縮小範圍，例如 \"Heart Failure/drug therapy\" 只找心衰竭的藥物治療文獻。常用副標題：/therapy, /drug therapy, /prevention, /mortality。",
      descEn: "MeSH terms can be combined with subheadings to narrow focus, e.g. \"Heart Failure/drug therapy\" finds only drug treatment articles. Common subheadings: /therapy, /drug therapy, /prevention, /mortality.",
    },
    {
      id: "truncation",
      iconZh: "截斷搜尋 Truncation (*)", iconEn: "Truncation (*)",
      descZh: "在字根後加 * 可以搜尋所有以該字根開頭的詞。例如 'cardio*' 會找到 cardiology, cardiovascular, cardiomyopathy 等。PubMed 中使用 *，Embase 中也使用 *。",
      descEn: "Add * after a word root to search all words starting with that root. 'cardio*' matches cardiology, cardiovascular, cardiomyopathy, etc. Works in both PubMed and Embase.",
    },
  ];

  const renderNode = (node, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    return (
      <div key={node.id}>
        <div onClick={() => hasChildren && toggleNode(node.id)}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 14px", marginLeft: depth * 24, borderRadius: 10,
            background: isExpanded ? `${PURPLE}08` : "transparent",
            border: `1px solid ${isExpanded ? PURPLE + "22" : "transparent"}`,
            cursor: hasChildren ? "pointer" : "default", transition: "all 0.2s",
            marginBottom: 4,
          }}>
          {hasChildren && (
            <span style={{ fontSize: 12, color: PURPLE, fontWeight: 700, width: 16, textAlign: "center", transition: "transform 0.2s", transform: isExpanded ? "rotate(90deg)" : "rotate(0)" }}>
              ▶
            </span>
          )}
          {!hasChildren && <span style={{ width: 16, textAlign: "center", fontSize: 10, color: "#C0BFB9" }}>●</span>}
          <span style={{ fontSize: 14, color: DARK, fontWeight: depth === 0 ? 600 : 400 }}>
            {lang === "zh" ? node.labelZh : node.labelEn}
          </span>
        </div>
        {isExpanded && node.children.map(child => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 22px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "MeSH 詞彙樹與搜尋技巧" : "MeSH Tree & Search Techniques"}
      </h3>
      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", marginBottom: 24 }}>
        {lang === "zh" ? "點擊展開 MeSH 樹狀結構，了解受控詞彙的階層關係" : "Click to expand the MeSH tree and explore controlled vocabulary hierarchy"}
      </p>

      {/* Tree viewer */}
      <div style={{ background: "#FAFAF7", borderRadius: 14, padding: "16px 12px", marginBottom: 24, border: `1px solid ${LIGHT_BORDER}` }}>
        {renderNode(tree)}
      </div>

      {/* Concept cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
        {concepts.map(c => {
          const isActive = activeInfo === c.id;
          return (
            <div key={c.id} onClick={() => setActiveInfo(isActive ? null : c.id)}
              style={{
                background: isActive ? `${PURPLE}08` : "#FAFAF7",
                border: `1.5px solid ${isActive ? PURPLE : LIGHT_BORDER}`,
                borderRadius: 12, padding: "14px 16px", cursor: "pointer", transition: "all 0.2s",
              }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: isActive ? PURPLE : DARK, marginBottom: isActive ? 8 : 0 }}>
                {lang === "zh" ? c.iconZh : c.iconEn}
              </div>
              {isActive && (
                <p style={{ fontSize: 13, lineHeight: 1.65, color: MUTED, animation: "fadeInUp 0.3s ease-out" }}>
                  {lang === "zh" ? c.descZh : c.descEn}
                </p>
              )}
            </div>
          );
        })}
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
              {i > 0 && (
                <div style={{ display: "flex", justifyContent: "center", height: 28 }}>
                  <div style={{ width: 2, height: "100%", background: isActive ? step.color : LIGHT_BORDER, transition: "background 0.5s" }} />
                </div>
              )}
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
              {activeStep === i && animPhase !== "running" && (
                <div style={{ margin: "10px 0 0", padding: "12px 16px", background: `${step.color}06`, borderRadius: 10, border: `1px solid ${step.color}18`, fontSize: 13.5, lineHeight: 1.65, color: MUTED, animation: "fadeInUp 0.3s ease-out" }}>
                  {t(step.descKey)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        {animPhase === "idle" && <button onClick={runAnimation} style={btnPrimary}>{t("c2prismaRunBtn")}</button>}
        {animPhase === "done" && (
          <button onClick={reset} style={{ background: "transparent", border: `1.5px solid ${PURPLE}`, color: PURPLE, padding: "11px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {t("c2prismaResetBtn")}
          </button>
        )}
        {animPhase === "running" && <span style={{ fontSize: 13, color: PURPLE, fontWeight: 500 }}>{t("c2prismaRunning")}</span>}
      </div>
    </div>
  );
}

// ═══ S5 UPGRADE: SCREENING DRILL ═══
function ScreeningDrill({ lang }) {
  const pico = {
    zh: "PICO：成人心衰竭患者 (P) 使用 SGLT2 抑制劑 (I) vs. 安慰劑 (C)，主要結局為心血管死亡或因心衰竭住院 (O)",
    en: "PICO: Adults with HF (P), SGLT2 inhibitors (I) vs. placebo (C), primary outcome: CV death or HF hospitalization (O)",
  };

  const abstracts = [
    {
      id: 1,
      titleZh: "DAPA-HF: Dapagliflozin 在射出分率降低之心衰竭的療效",
      titleEn: "DAPA-HF: Dapagliflozin in Heart Failure with Reduced Ejection Fraction",
      snippetZh: "隨機雙盲試驗，4744 名 HFrEF 患者，Dapagliflozin 10mg vs 安慰劑，主要結局為心血管死亡或心衰竭惡化。追蹤 18.2 個月。",
      snippetEn: "Randomized double-blind trial, 4744 HFrEF patients, Dapagliflozin 10mg vs placebo, primary outcome: CV death or worsening HF. Median follow-up 18.2 months.",
      answer: "include",
      expZh: "完全符合 PICO：HFrEF 患者、SGLT2i vs 安慰劑、心血管死亡/心衰住院。納入。",
      expEn: "Perfect PICO match: HFrEF patients, SGLT2i vs placebo, CV death/HF hospitalization. Include.",
    },
    {
      id: 2,
      titleZh: "Metformin 對第二型糖尿病合併心衰竭的回顧性分析",
      titleEn: "Metformin in Type 2 Diabetes with Heart Failure: A Retrospective Analysis",
      snippetZh: "回顧性世代研究，分析 1200 名 T2DM 合併 HF 患者使用 Metformin 的死亡率。比較組為未使用 Metformin 的患者。",
      snippetEn: "Retrospective cohort study of 1200 T2DM+HF patients on Metformin. Compared mortality with patients not receiving Metformin.",
      answer: "exclude",
      expZh: "介入是 Metformin 而非 SGLT2i，不符合 PICO 中的 I。排除。",
      expEn: "Intervention is Metformin, not SGLT2i — doesn't match the I in PICO. Exclude.",
    },
    {
      id: 3,
      titleZh: "Empagliflozin 對心衰竭住院風險的統合分析",
      titleEn: "Empagliflozin and Heart Failure Hospitalization Risk: A Meta-Analysis",
      snippetZh: "系統性回顧與統合分析，納入 6 篇 RCT，評估 Empagliflozin 對心衰竭住院的影響。包含 HFrEF 和 HFpEF 患者。",
      snippetEn: "Systematic review and meta-analysis of 6 RCTs evaluating Empagliflozin on HF hospitalization. Included both HFrEF and HFpEF patients.",
      answer: "exclude",
      expZh: "這是一篇統合分析（二次研究），不是原始研究。在系統性回顧中，我們納入原始 RCT，而非其他統合分析。但可以查看它的參考文獻找到原始研究。",
      expEn: "This is a meta-analysis (secondary study), not a primary study. In a systematic review, we include original RCTs, not other meta-analyses. But check its reference list for primary studies.",
    },
    {
      id: 4,
      titleZh: "EMPEROR-Preserved: Empagliflozin 在射出分率保留之心衰竭",
      titleEn: "EMPEROR-Preserved: Empagliflozin in HF with Preserved Ejection Fraction",
      snippetZh: "隨機雙盲試驗，5988 名 HFpEF 患者，Empagliflozin 10mg vs 安慰劑。主要結局為心血管死亡或因心衰竭住院的複合結局。",
      snippetEn: "Randomized double-blind trial, 5988 HFpEF patients, Empagliflozin 10mg vs placebo. Primary outcome: composite of CV death or HF hospitalization.",
      answer: "include",
      expZh: "符合 PICO：HFpEF 患者、SGLT2i vs 安慰劑、心血管死亡/心衰住院。納入。",
      expEn: "Matches PICO: HFpEF patients, SGLT2i vs placebo, CV death/HF hospitalization. Include.",
    },
  ];

  const [decisions, setDecisions] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleDecision = (id, val) => {
    if (showResults) return;
    setDecisions(prev => ({ ...prev, [id]: val }));
  };

  const allDecided = Object.keys(decisions).length === abstracts.length;
  const score = abstracts.filter(a => decisions[a.id] === a.answer).length;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 22px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", marginTop: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 8, textAlign: "center" }}>
        {lang === "zh" ? "篩選模擬練習" : "Screening Practice Drill"}
      </h3>

      {/* PICO reference */}
      <div style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}1A`, borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
        <p style={{ fontSize: 13, color: PURPLE, lineHeight: 1.6, fontWeight: 500 }}>
          {lang === "zh" ? pico.zh : pico.en}
        </p>
      </div>

      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "根據以上 PICO，判斷以下文獻應該「納入」還是「排除」" : "Based on this PICO, decide: Include or Exclude each study?"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {abstracts.map(a => {
          const picked = decisions[a.id];
          const isCorrect = picked === a.answer;
          const revealed = showResults && picked;
          return (
            <div key={a.id} style={{
              background: revealed ? (isCorrect ? "#E6F5F0" : "#FDEEEB") : "#FAFAF7",
              border: `1.5px solid ${revealed ? (isCorrect ? GREEN + "44" : "#D94B2E44") : LIGHT_BORDER}`,
              borderRadius: 14, padding: "16px 18px", transition: "all 0.3s",
            }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: DARK, marginBottom: 6 }}>
                {lang === "zh" ? a.titleZh : a.titleEn}
              </h4>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: MUTED, marginBottom: 12 }}>
                {lang === "zh" ? a.snippetZh : a.snippetEn}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {["include", "exclude"].map(opt => {
                  const isThis = picked === opt;
                  const label = opt === "include"
                    ? (lang === "zh" ? "納入" : "Include")
                    : (lang === "zh" ? "排除" : "Exclude");
                  const optColor = opt === "include" ? GREEN : "#D94B2E";
                  return (
                    <button key={opt} onClick={() => handleDecision(a.id, opt)}
                      style={{
                        flex: 1, padding: "8px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                        background: isThis ? `${optColor}15` : "transparent",
                        border: `1.5px solid ${isThis ? optColor : LIGHT_BORDER}`,
                        color: isThis ? optColor : MUTED,
                        cursor: showResults ? "default" : "pointer", transition: "all 0.2s",
                      }}>
                      {isThis && showResults ? (isCorrect ? "✓ " : "✗ ") : ""}{label}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <p style={{ fontSize: 13, lineHeight: 1.6, color: isCorrect ? "#2A7A5A" : "#B83A20", marginTop: 10, animation: "fadeInUp 0.3s ease-out" }}>
                  {lang === "zh" ? a.expZh : a.expEn}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        {!showResults ? (
          <button onClick={() => allDecided && setShowResults(true)}
            style={{ ...btnPrimary, background: allDecided ? PURPLE : "#E8E6E1", color: allDecided ? "#FFF" : MUTED, cursor: allDecided ? "pointer" : "default" }}>
            {lang === "zh" ? "查看結果" : "Check Answers"}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: score === 4 ? GREEN : score >= 3 ? PURPLE : CORAL }}>
              {score}/{abstracts.length} {lang === "zh" ? "正確" : "correct"} {score === 4 ? "🎉" : score >= 3 ? "👍" : "📚"}
            </span>
            <button onClick={() => { setDecisions({}); setShowResults(false); }}
              style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {lang === "zh" ? "重試" : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ GREY LITERATURE SCAVENGER HUNT ═══
function GreyLitHunt({ lang }) {
  const sources = [
    { id: "ct", labelZh: "ClinicalTrials.gov", labelEn: "ClinicalTrials.gov", correct: true, descZh: "臨床試驗註冊平台，包含未發表的試驗結果和進行中的研究。", descEn: "Clinical trial registry with unpublished results and ongoing studies." },
    { id: "conf", labelZh: "會議摘要 (Conference abstracts)", labelEn: "Conference Abstracts", correct: true, descZh: "學術會議上發表的初步結果，許多最終未正式發表。", descEn: "Preliminary results presented at conferences; many never reach formal publication." },
    { id: "diss", labelZh: "學位論文 (Dissertations)", labelEn: "Dissertations / Theses", correct: true, descZh: "博碩士論文通常包含未發表的原始研究數據。", descEn: "Graduate theses often contain unpublished original research data." },
    { id: "wiki", labelZh: "Wikipedia", labelEn: "Wikipedia", correct: false, descZh: "百科全書，非原始研究來源，不算灰色文獻。", descEn: "An encyclopedia, not an original research source — not grey literature." },
    { id: "gov", labelZh: "政府 / WHO 報告", labelEn: "Government / WHO Reports", correct: true, descZh: "政府機構和國際組織的技術報告，包含大量未在期刊發表的數據。", descEn: "Technical reports from agencies and international organizations, with data often not published in journals." },
    { id: "preprint", labelZh: "預印本 (medRxiv, bioRxiv)", labelEn: "Preprints (medRxiv, bioRxiv)", correct: true, descZh: "未經同行評審的預印本，可以獲取最新研究結果。", descEn: "Non-peer-reviewed preprints provide access to the latest research findings." },
    { id: "pubmed", labelZh: "PubMed 正式索引文獻", labelEn: "PubMed Indexed Articles", correct: false, descZh: "PubMed 索引的是正式發表的文獻，不是灰色文獻。", descEn: "PubMed indexes formally published literature — this is not grey literature." },
    { id: "ref", labelZh: "已納入文獻的參考文獻", labelEn: "Reference Lists of Included Studies", correct: true, descZh: "手動追蹤已納入文獻的參考文獻，可以找到資料庫搜尋遺漏的研究。", descEn: "Hand-searching reference lists can find studies missed by database searches." },
  ];

  const [selected, setSelected] = useState(new Set());
  const [showResults, setShowResults] = useState(false);

  const toggleSelect = (id) => {
    if (showResults) return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const correctSet = new Set(sources.filter(s => s.correct).map(s => s.id));
  const score = sources.filter(s => {
    const userSaid = selected.has(s.id);
    return userSaid === s.correct;
  }).length;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 22px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "灰色文獻大搜索" : "Grey Literature Scavenger Hunt"}
      </h3>
      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "以下哪些是灰色文獻來源？點選所有正確答案" : "Which of these are grey literature sources? Select all that apply."}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 20 }}>
        {sources.map(s => {
          const isSel = selected.has(s.id);
          const revealed = showResults;
          let bg = isSel ? `${PURPLE}10` : "#FAFAF7";
          let borderColor = isSel ? PURPLE : LIGHT_BORDER;
          if (revealed) {
            if (s.correct && isSel) { bg = "#E6F5F0"; borderColor = GREEN + "66"; }
            else if (s.correct && !isSel) { bg = "#FFF8E6"; borderColor = GOLD + "66"; }
            else if (!s.correct && isSel) { bg = "#FDEEEB"; borderColor = "#D94B2E66"; }
            else { bg = "#FAFAF7"; borderColor = LIGHT_BORDER; }
          }
          return (
            <div key={s.id} onClick={() => toggleSelect(s.id)}
              style={{
                background: bg, border: `1.5px solid ${borderColor}`, borderRadius: 12,
                padding: "14px 16px", cursor: showResults ? "default" : "pointer", transition: "all 0.2s",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: revealed ? 6 : 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 6, border: `2px solid ${isSel ? PURPLE : LIGHT_BORDER}`,
                  background: isSel ? PURPLE : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#FFF", flexShrink: 0, transition: "all 0.2s",
                }}>
                  {isSel && "✓"}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500, color: DARK }}>
                  {lang === "zh" ? s.labelZh : s.labelEn}
                </span>
                {revealed && (
                  <span style={{ fontSize: 12, marginLeft: "auto", fontWeight: 600, color: s.correct ? GREEN : "#D94B2E" }}>
                    {s.correct ? "✓" : "✗"}
                  </span>
                )}
              </div>
              {revealed && (
                <p style={{ fontSize: 12, lineHeight: 1.5, color: MUTED, marginLeft: 28, animation: "fadeInUp 0.3s ease-out" }}>
                  {lang === "zh" ? s.descZh : s.descEn}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        {!showResults ? (
          <button onClick={() => setShowResults(true)} style={btnPrimary}>
            {lang === "zh" ? "查看結果" : "Check Answers"}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: score >= 7 ? GREEN : score >= 5 ? PURPLE : CORAL }}>
              {score}/{sources.length} {lang === "zh" ? "正確" : "correct"} {score === 8 ? "🎉" : score >= 6 ? "👍" : "📚"}
            </span>
            <button onClick={() => { setSelected(new Set()); setShowResults(false); }}
              style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {lang === "zh" ? "重試" : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ AI WORKSHOP: BOOLEAN QUERY CHECKER ═══
function AIBooleanChecker({ t, lang }) {
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setFeedback(null);

    const systemPrompt = lang === "zh"
      ? `你是一位系統性文獻搜尋策略審查助手。學生會給你一串 PubMed 搜尋語法，請用繁體中文審查並給予具體改善建議。回覆格式：
1. 判斷整體品質（優秀/良好/需改善）
2. 指出缺少的同義詞或 MeSH 詞
3. 檢查 AND/OR/NOT 的使用是否正確
4. 評估搜尋範圍是否太寬或太窄
5. 給出改善後的搜尋語法
保持簡潔，不要使用 Markdown 格式。用純文字和換行。`
      : `You are a systematic review search strategy reviewer. The student gives you a PubMed search string. Review it and give specific improvement suggestions. Format:
1. Rate overall quality (Excellent/Good/Needs Improvement)
2. Identify missing synonyms or MeSH terms
3. Check if AND/OR/NOT usage is correct
4. Assess if scope is too broad or too narrow
5. Provide an improved search string
Be concise. Don't use Markdown formatting. Use plain text with line breaks.`;

    try {
      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, userMessage: query }),
      });
      const data = await response.json();
      const text = data.content?.map(item => item.text || "").join("") || t("c2aiNoResult");
      setFeedback(text);
    } catch (err) {
      setFeedback(t("c2aiError"));
    }
    setLoading(false);
  };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 12 }}>{t("c2aiInstructions")}</h4>
      <textarea
        value={query}
        onChange={(e) => { setQuery(e.target.value); setFeedback(null); }}
        placeholder={t("c2aiBPlaceholder")}
        rows={4}
        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${LIGHT_BORDER}`, fontSize: 14, lineHeight: 1.6, color: DARK, background: "#FAFAF7", resize: "vertical", outline: "none", transition: "border-color 0.2s", fontFamily: "'Noto Sans TC', 'Outfit', monospace", boxSizing: "border-box", marginBottom: 12 }}
      />
      <button onClick={checkQuery} disabled={!query.trim() || loading}
        style={{
          background: query.trim() ? PURPLE : "#E8E6E1", border: "none", color: query.trim() ? "#FFF" : MUTED,
          padding: "13px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600,
          cursor: query.trim() ? "pointer" : "default", transition: "all 0.2s", width: "100%",
          boxShadow: query.trim() ? `0 2px 12px ${PURPLE}33` : "none",
        }}>
        {loading ? t("c2aiBLoading") : t("c2aiBBtn")}
      </button>

      {feedback && (
        <div style={{ marginTop: 16, padding: "18px 20px", borderRadius: 14, background: `${PURPLE}06`, border: `1.5px solid ${PURPLE}22`, fontSize: 14, lineHeight: 1.7, color: DARK, whiteSpace: "pre-wrap", animation: "fadeInUp 0.3s ease-out" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE, marginBottom: 8 }}>{t("c2aiBResult")}</div>
          {feedback}
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
    const sectionIds = ["hero", "s1", "s2", "s3", "s3b", "s4", "s5", "s6", "s7", "game", "ai-workshop"];
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
    { id: "s3b", num: 4, label: lang === "zh" ? "MeSH 與受控詞彙" : "MeSH & Controlled Vocab" },
    { id: "s4", num: 5, label: lang === "zh" ? "PRISMA 流程圖" : "PRISMA Flow" },
    { id: "s5", num: 6, label: lang === "zh" ? "篩選技巧" : "Screening Tips & Drill" },
    { id: "s6", num: 7, label: lang === "zh" ? "灰色文獻" : "Grey Literature" },
    { id: "s7", num: 8, label: lang === "zh" ? "搜尋策略陷阱" : "Strategy Pitfalls" },
    { id: "game", num: 9, label: lang === "zh" ? "恐龍食物救援" : "Dino Food Rescue" },
    { id: "ai-workshop", num: 10, label: lang === "zh" ? "AI 工作坊" : "AI Workshops" },
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
        textarea:focus, input:focus { border-color: ${PURPLE}66 !important; box-shadow: 0 0 0 3px ${PURPLE}0D; }
        @media (max-width: 1099px) {
          .sidebar-catalog { display: none !important; }
          .main-content { margin-left: 0 !important; }
        }
      `}</style>

      {/* SIDEBAR CATALOG */}
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

      {/* MAIN CONTENT */}
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

      {/* S1: Why Systematic Search — now with interactive quiz */}
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
          {/* NEW: Interactive spot-the-search quiz */}
          <FadeIn delay={0.25}><SpotTheSearch lang={lang} /></FadeIn>
          <FadeIn delay={0.3}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s2")} style={btnPrimary}>{t("c2s1Next")}</button></div></FadeIn>
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

      {/* S3: Boolean Operators — now with interactive combo builder */}
      <section id="s3" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s3Label")} /><SectionTitle>{t("c2s3Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c2s3Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><BooleanVisualizer t={t} lang={lang} /></FadeIn>
          {/* NEW: Interactive combo builder replaces hardcoded example */}
          <FadeIn delay={0.2}><BooleanComboBuilder lang={lang} /></FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s3b")} style={btnPrimary}>{t("c2s3Next2")}</button></div></FadeIn>
        </div>
      </section>

      {/* S3b: NEW — MeSH & Controlled Vocabulary */}
      <section id="s3b" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s3bLabel")} /><SectionTitle>{t("c2s3bTitle")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>
            {t("c2s3bIntro")}
          </Paragraph></FadeIn>
          <FadeIn delay={0.15}><MeSHTreeExplorer lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s4")} style={btnPrimary}>{t("c2s3Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S4: PRISMA Flow */}
      <section id="s4" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s4Label")} /><SectionTitle>{t("c2s4Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("c2s4Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><PrismaFlowDiagram t={t} lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s5")} style={btnPrimary}>{t("c2s4Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S5: Screening Tips — now with screening drill */}
      <section id="s5" style={{ padding: "80px 24px", background: LIGHT_BG }}>
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
          {/* NEW: Screening drill */}
          <FadeIn delay={0.25}><ScreeningDrill lang={lang} /></FadeIn>
          <FadeIn delay={0.3}><div style={{ textAlign: "center", marginTop: 32 }}><button onClick={() => scrollTo("s6")} style={btnPrimary}>{t("c2s5Next2")}</button></div></FadeIn>
        </div>
      </section>

      {/* S6: NEW — Grey Literature */}
      <section id="s6" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s6Label")} /><SectionTitle>{t("c2s6Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 20 }}>
            {t("c2s6Intro")}
          </Paragraph></FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: `${PURPLE}08`, border: `1px solid ${PURPLE}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: PURPLE }}>
                💡 {t("c2s6Tip")}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}><GreyLitHunt lang={lang} /></FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s7")} style={btnPrimary}>{t("c2s6Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S7: NEW — Search Strategy Pitfalls */}
      <section id="s7" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2s7Label")} /><SectionTitle>{t("c2s7Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>
            {t("c2s7Intro")}
          </Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
            {[
              {
                badZh: "限制語言為「只搜英文文獻」", badEn: "Restricting to English-only articles",
                goodZh: "不限制語言，或至少說明語言限制的理由", goodEn: "No language restriction, or justify any restriction applied",
                expZh: "語言限制可能排除重要的非英語研究，造成偏倚。除非有資源限制，否則應搜尋所有語言。",
                expEn: "Language restrictions may exclude important non-English studies, causing bias. Search all languages unless resource constraints require otherwise.",
              },
              {
                badZh: "搜尋策略中加入 Outcome 的搜尋詞", badEn: "Including Outcome terms in the search strategy",
                goodZh: "只用 P 和 I（有時加 C）搜尋，在篩選階段再根據 O 判斷", goodEn: "Search with P and I (sometimes C) only; filter by O during screening",
                expZh: "不同研究描述結局的方式差異極大。加入 O 可能意外排除相關研究。大多數搜尋策略指引建議只搜尋 P 和 I。",
                expEn: "Outcome descriptions vary enormously across studies. Including O terms may miss relevant studies. Most guidelines recommend searching P and I only.",
              },
              {
                badZh: "只用自由文字，不用 MeSH / Emtree", badEn: "Using only free text, no MeSH / Emtree terms",
                goodZh: "同時使用受控詞彙和自由文字，用 OR 連接", goodEn: "Combine controlled vocabulary and free text with OR",
                expZh: "MeSH 確保同一概念的文獻被找到；自由文字捕捉尚未被索引的新文獻。兩者互補。",
                expEn: "MeSH ensures all articles on the same concept are found; free text catches newly indexed articles. They're complementary.",
              },
              {
                badZh: "不查看已納入文獻的參考文獻", badEn: "Skipping reference list checking of included studies",
                goodZh: "手動追蹤已納入文獻的參考文獻（backward citation）和被引用次數（forward citation）", goodEn: "Hand-search reference lists (backward) and citation tracking (forward) of included studies",
                expZh: "資料庫搜尋永遠不可能找到所有文獻。手動追蹤引文是補充搜尋的重要方法。",
                expEn: "Database searches can never find everything. Citation tracking is essential for supplementing your search.",
              },
            ].map((trap, i) => (
              <FadeIn key={i} delay={i * 0.05 + 0.15}>
                <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "22px 20px", height: "100%" }}>
                  <div style={{ background: "#FDEEEB", borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: CORAL }}>❌ </span>
                    <span style={{ fontSize: 13, color: "#B83A20" }}>{lang === "zh" ? trap.badZh : trap.badEn}</span>
                  </div>
                  <div style={{ background: "#E6F5F0", borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: GREEN }}>✅ </span>
                    <span style={{ fontSize: 13, color: "#2A7A5A" }}>{lang === "zh" ? trap.goodZh : trap.goodEn}</span>
                  </div>
                  <p style={{ fontSize: 13, lineHeight: 1.6, color: MUTED }}>{lang === "zh" ? trap.expZh : trap.expEn}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4}><div style={{ textAlign: "center", marginTop: 32 }}><button onClick={() => scrollTo("game")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>{t("c2s5Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* GAME */}
      <section id="game" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2gameLabel")} /></FadeIn>
          <FadeIn delay={0.1}><DinoFoodRescue t={t} lang={lang} /></FadeIn>
        </div>
      </section>

      {/* AI WORKSHOP — Boolean Query Checker */}
      <section id="ai-workshop" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c2aiLabel")} /><SectionTitle>{t("c2aiSectionTitle")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>
            {t("c2aiBDesc")}
          </Paragraph></FadeIn>
          <FadeIn delay={0.15}><AIBooleanChecker t={t} lang={lang} /></FadeIn>
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
