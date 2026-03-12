import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";
import SiteNav from "./SiteNav";
import DinoHomeSave from "./DinoHomeSave";

// ═══ DESIGN TOKENS ═══
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const GOLD = "#D4A843";
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
      <div style={{ width: 24, height: 2, background: GOLD, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: GOLD }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, ...style }}>{children}</p>;
}

const btnPrimary = { background: GOLD, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ═══ INTERACTIVE EXTRACTION TABLE DEMO (Section 2) ═══
function ExtractionTableDemo({ lang }) {
  const [activeCol, setActiveCol] = useState(null);

  const columns = [
    { key: "author", en: "Author/Year", zh: "作者/年份", icon: "📝", example: { en: "Chen et al. 2023", zh: "Chen et al. 2023" }, desc: { en: "Who conducted the study and when it was published", zh: "誰做了這項研究，何時發表" } },
    { key: "design", en: "Study Design", zh: "研究設計", icon: "🔬", example: { en: "Double-blind RCT", zh: "雙盲隨機對照試驗" }, desc: { en: "Type of study (RCT, cohort, case-control, etc.)", zh: "研究類型（RCT、世代研究、病例對照等）" } },
    { key: "pop", en: "Population (n)", zh: "族群 (n)", icon: "👥", example: { en: "T2DM adults, n=450", zh: "第二型糖尿病成人，n=450" }, desc: { en: "Who was studied and how many participants", zh: "研究對象及參與者人數" } },
    { key: "intervention", en: "Intervention", zh: "介入措施", icon: "💊", example: { en: "Metformin 1000mg BID × 24wk", zh: "Metformin 1000mg 每日兩次 × 24週" }, desc: { en: "Treatment details: drug, dose, frequency, duration", zh: "治療細節：藥物、劑量、頻率、時間" } },
    { key: "comparator", en: "Comparator", zh: "對照", icon: "⚖", example: { en: "Placebo BID × 24wk", zh: "安慰劑 每日兩次 × 24週" }, desc: { en: "What the intervention was compared against", zh: "介入措施與什麼做比較" } },
    { key: "outcome", en: "Outcome", zh: "結局指標", icon: "📊", example: { en: "HbA1c change at 24wk", zh: "24週 HbA1c 變化" }, desc: { en: "What was measured and at what time point", zh: "測量了什麼及在何時" } },
    { key: "results", en: "Results", zh: "結果數據", icon: "🔢", example: { en: "Tx: −1.2 (SD 0.8), Ctrl: −0.3 (SD 0.7)", zh: "治療: −1.2 (SD 0.8), 對照: −0.3 (SD 0.7)" }, desc: { en: "Raw numbers: events/totals or mean/SD/n per group", zh: "原始數據：事件數/總數 或 均值/SD/n" } },
    { key: "notes", en: "Notes", zh: "備註", icon: "📋", example: { en: "Industry-funded, ITT analysis", zh: "產業贊助，ITT 分析" }, desc: { en: "Funding, limitations, special considerations", zh: "資金來源、限制、特殊考量" } },
  ];

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 8, textAlign: "center" }}>
        {lang === "zh" ? "📋 標準化數據萃取表格" : "📋 Standardized Data Extraction Form"}
      </h3>
      <p style={{ fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "點擊每個欄位，看看該填什麼" : "Click each column to see what goes in it"}
      </p>

      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
        {columns.map((col) => (
          <button key={col.key} onClick={() => setActiveCol(activeCol === col.key ? null : col.key)}
            style={{
              background: activeCol === col.key ? `${GOLD}15` : "#FAFAF7",
              border: `1.5px solid ${activeCol === col.key ? GOLD : LIGHT_BORDER}`,
              borderRadius: 12, padding: "14px 8px", textAlign: "center",
              cursor: "pointer", transition: "all 0.2s",
            }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{col.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: activeCol === col.key ? GOLD : MUTED, lineHeight: 1.35 }}>
              {col[lang]}
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{
        minHeight: 80, padding: "16px 18px",
        background: activeCol ? `${GOLD}08` : "transparent",
        borderRadius: 12, transition: "all 0.3s",
        border: activeCol ? `1px solid ${GOLD}22` : "1px solid transparent",
      }}>
        {activeCol ? (() => {
          const col = columns.find(c => c.key === activeCol);
          return (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, color: GOLD, marginBottom: 6 }}>{col.icon} {col[lang]}</div>
              <div style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, marginBottom: 8 }}>{col.desc[lang]}</div>
              <div style={{ background: `${GOLD}0D`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: DARK, fontWeight: 500 }}>
                {lang === "zh" ? "範例：" : "Example: "}{col.example[lang]}
              </div>
            </>
          );
        })() : (
          <div style={{ fontSize: 13, color: "#B0AFAA", textAlign: "center", paddingTop: 12 }}>
            {lang === "zh" ? "👆 點擊上方欄位查看詳細說明" : "👆 Click a column above to see details"}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ DICHOTOMOUS vs CONTINUOUS TRACKS (Section 3) ═══
function OutcomeTracksDemo({ lang }) {
  const [activeTrack, setActiveTrack] = useState(null); // "dich" | "cont" | null

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 20px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {/* Dichotomous track */}
        <div onClick={() => setActiveTrack(activeTrack === "dich" ? null : "dich")}
          style={{
            background: activeTrack === "dich" ? "#E6F5F0" : "#FAFAF7",
            border: `2px solid ${activeTrack === "dich" ? GREEN : LIGHT_BORDER}`,
            borderRadius: 14, padding: "18px 16px", cursor: "pointer", transition: "all 0.3s",
          }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📊</div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: activeTrack === "dich" ? "#2A7A5A" : DARK, marginBottom: 6 }}>
            {lang === "zh" ? "二分類結局" : "Dichotomous"}
          </h4>
          <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
            {lang === "zh" ? "是/否、死亡/存活" : "Yes/No, Death/Survival"}
          </p>
        </div>
        {/* Continuous track */}
        <div onClick={() => setActiveTrack(activeTrack === "cont" ? null : "cont")}
          style={{
            background: activeTrack === "cont" ? "#FFF8EE" : "#FAFAF7",
            border: `2px solid ${activeTrack === "cont" ? GOLD : LIGHT_BORDER}`,
            borderRadius: 14, padding: "18px 16px", cursor: "pointer", transition: "all 0.3s",
          }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📈</div>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: activeTrack === "cont" ? "#9A7B2E" : DARK, marginBottom: 6 }}>
            {lang === "zh" ? "連續性結局" : "Continuous"}
          </h4>
          <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
            {lang === "zh" ? "均值、分數、測量值" : "Means, scores, measurements"}
          </p>
        </div>
      </div>

      {/* Detail panel */}
      {activeTrack === "dich" && (
        <div style={{ background: "#E6F5F0", borderRadius: 12, padding: "16px 18px", border: "1px solid #3DA87A22", animation: "fadeInTrack 0.3s ease-out" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#2A7A5A", marginBottom: 10 }}>
            {lang === "zh" ? "需要萃取的數據" : "What to Extract"}
          </h4>
          <div style={{ background: "white", borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: DARK, lineHeight: 1.8 }}>
              <div>{lang === "zh" ? "治療組：" : "Treatment: "}<strong style={{ color: GREEN }}>15</strong> / <strong>100</strong>{lang === "zh" ? "（事件/總人數）" : " (events/total)"}</div>
              <div>{lang === "zh" ? "對照組：" : "Control: "}<strong style={{ color: CORAL }}>22</strong> / <strong>100</strong>{lang === "zh" ? "（事件/總人數）" : " (events/total)"}</div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6 }}>
            {lang === "zh" ? "→ 可計算勝算比 (OR)、風險比 (RR)、風險差 (RD)" : "→ Enables calculation of OR, RR, RD"}
          </p>
        </div>
      )}
      {activeTrack === "cont" && (
        <div style={{ background: "#FFF8EE", borderRadius: 12, padding: "16px 18px", border: `1px solid ${GOLD}22`, animation: "fadeInTrack 0.3s ease-out" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#9A7B2E", marginBottom: 10 }}>
            {lang === "zh" ? "需要萃取的數據" : "What to Extract"}
          </h4>
          <div style={{ background: "white", borderRadius: 8, padding: 14, marginBottom: 10 }}>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: DARK, lineHeight: 1.8 }}>
              <div>{lang === "zh" ? "治療組：" : "Treatment: "}<strong style={{ color: GOLD }}>Mean</strong>, <strong style={{ color: GOLD }}>SD</strong>, <strong>n</strong></div>
              <div>{lang === "zh" ? "對照組：" : "Control: "}<strong style={{ color: GOLD }}>Mean</strong>, <strong style={{ color: GOLD }}>SD</strong>, <strong>n</strong></div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, marginBottom: 8 }}>
            {lang === "zh" ? "→ 可計算均數差 (MD) 或標準化均數差 (SMD)" : "→ Enables MD or SMD calculation"}
          </p>
          <div style={{ background: `${GOLD}0D`, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#9A7B2E" }}>
            💡 {lang === "zh"
              ? "報告中位數/IQR？用 Wan/Luo 公式轉換為均值/SD"
              : "Median/IQR reported? Use Wan/Luo formulas to convert to mean/SD"}
          </div>
        </div>
      )}
      <style>{`@keyframes fadeInTrack { 0% { opacity:0; transform:translateY(6px); } 100% { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

// ═══ EXTRACTION DRILL (added to S3) ═══
function ExtractionDrill({ lang }) {
  const studies = [
    {
      id: "dich",
      typeZh: "二分類結局", typeEn: "Dichotomous Outcome",
      scenarioZh: "一項 RCT 比較 Dapagliflozin vs 安慰劑在心衰竭患者的療效。結果報告：主要結局（心血管死亡或因心衰住院）發生在治療組 386/2373 人 (16.3%) 和安慰劑組 502/2371 人 (21.2%)，HR 0.74 (95% CI 0.65–0.85, p<0.001)。追蹤 18.2 個月。",
      scenarioEn: "An RCT compared Dapagliflozin vs placebo in HF patients. Results: Primary outcome (CV death or HF hospitalization) occurred in 386/2373 (16.3%) treatment vs 502/2371 (21.2%) placebo, HR 0.74 (95% CI 0.65–0.85, p<0.001). Median follow-up 18.2 months.",
      options: [
        { zh: "HR 0.74, p<0.001", en: "HR 0.74, p<0.001", correct: false, expZh: "HR 和 p 值不夠——缺少原始事件數和樣本量。", expEn: "HR and p-value aren't enough — missing raw event counts and sample sizes." },
        { zh: "治療 386/2373, 對照 502/2371", en: "Treatment 386/2373, Control 502/2371", correct: true, expZh: "正確！每組的事件數/總人數是計算 OR、RR 所需的原始數據。", expEn: "Correct! Events/total per group is the raw data needed to calculate OR, RR." },
        { zh: "16.3% vs 21.2%", en: "16.3% vs 21.2%", correct: false, expZh: "百分比丟失了樣本量資訊。2373 人中 16.3% 和 100 人中 16.3% 的精確度不同。", expEn: "Percentages lose sample size info. 16.3% of 2373 and 16.3% of 100 have different precision." },
        { zh: "p<0.001，有顯著差異", en: "p<0.001, significant difference", correct: false, expZh: "只有 p 值無法進行統合分析——需要原始數據來計算效應量。", expEn: "A p-value alone can't be meta-analyzed — need raw data to compute effect sizes." },
      ],
    },
    {
      id: "cont",
      typeZh: "連續性結局", typeEn: "Continuous Outcome",
      scenarioZh: "一項 RCT 比較 Metformin vs 安慰劑對 HbA1c 的影響。24 週後，Metformin 組 (n=225) 的 HbA1c 變化為 −1.2% (SD 0.8)，安慰劑組 (n=225) 為 −0.3% (SD 0.7)。組間差異 −0.9% (95% CI −1.05 to −0.75, p<0.001)。",
      scenarioEn: "An RCT compared Metformin vs placebo on HbA1c. At 24 weeks, Metformin group (n=225): HbA1c change −1.2% (SD 0.8); placebo (n=225): −0.3% (SD 0.7). Between-group difference −0.9% (95% CI −1.05 to −0.75, p<0.001).",
      options: [
        { zh: "組間差異 −0.9%, p<0.001", en: "Between-group difference −0.9%, p<0.001", correct: false, expZh: "組間差異可用但不理想——統合分析軟體需要每組的 mean、SD、n 來計算加權。", expEn: "Between-group difference can work but isn't ideal — software needs per-group mean, SD, n for proper weighting." },
        { zh: "Metformin: mean −1.2, SD 0.8, n=225; Placebo: mean −0.3, SD 0.7, n=225", en: "Metformin: mean −1.2, SD 0.8, n=225; Placebo: mean −0.3, SD 0.7, n=225", correct: true, expZh: "正確！每組的均值、標準差、樣本量是連續性結局統合分析的標準輸入。", expEn: "Correct! Per-group mean, SD, and n is the standard input for continuous outcome meta-analysis." },
        { zh: "HbA1c 下降了 1.2% vs 0.3%", en: "HbA1c dropped 1.2% vs 0.3%", correct: false, expZh: "缺少標準差和樣本量——沒有 SD 就無法計算精確度和權重。", expEn: "Missing SD and sample sizes — without SD, precision and weights can't be calculated." },
        { zh: "95% CI −1.05 to −0.75", en: "95% CI −1.05 to −0.75", correct: false, expZh: "CI 只描述組間差異的精確度，但缺少每組的獨立數據。", expEn: "CI describes precision of the between-group difference but lacks independent per-group data." },
      ],
    },
  ];

  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (studyId, optIdx) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [studyId]: optIdx }));
  };

  const allAnswered = Object.keys(answers).length === studies.length;
  const score = studies.filter(s => s.options[answers[s.id]]?.correct).length;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 22px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", marginTop: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "萃取練習：你會選哪些數字？" : "Extraction Drill: Which Numbers Would You Extract?"}
      </h3>
      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", marginBottom: 20 }}>
        {lang === "zh" ? "閱讀研究結果，選出最適合統合分析的數據" : "Read the study results and pick the best data for meta-analysis"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {studies.map(study => {
          const picked = answers[study.id];
          const pickedOpt = picked !== undefined ? study.options[picked] : null;
          const isCorrect = pickedOpt?.correct;
          return (
            <div key={study.id} style={{ background: "#FAFAF7", borderRadius: 14, padding: "18px", border: `1px solid ${LIGHT_BORDER}` }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: GOLD, marginBottom: 8 }}>
                {lang === "zh" ? study.typeZh : study.typeEn}
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: DARK, marginBottom: 14 }}>
                {lang === "zh" ? study.scenarioZh : study.scenarioEn}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {study.options.map((opt, oi) => {
                  const isThis = picked === oi;
                  const revealed = showResults && isThis;
                  return (
                    <button key={oi} onClick={() => handleAnswer(study.id, oi)}
                      style={{
                        textAlign: "left", padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500,
                        background: revealed ? (opt.correct ? "#E6F5F0" : "#FDEEEB") : isThis ? `${GOLD}12` : "white",
                        border: `1.5px solid ${revealed ? (opt.correct ? GREEN + "66" : RED + "66") : isThis ? GOLD : LIGHT_BORDER}`,
                        color: DARK, cursor: showResults ? "default" : "pointer", transition: "all 0.2s",
                      }}>
                      {revealed ? (opt.correct ? "✓ " : "✗ ") : ""}{lang === "zh" ? opt.zh : opt.en}
                    </button>
                  );
                })}
              </div>
              {showResults && pickedOpt && (
                <p style={{ fontSize: 13, lineHeight: 1.6, color: isCorrect ? "#2A7A5A" : "#B83A20", marginTop: 10, animation: "fadeInTrack 0.3s ease-out" }}>
                  {lang === "zh" ? pickedOpt.expZh : pickedOpt.expEn}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        {!showResults ? (
          <button onClick={() => allAnswered && setShowResults(true)}
            style={{ ...btnPrimary, background: allAnswered ? GOLD : "#E8E6E1", color: allAnswered ? "#FFF" : MUTED, cursor: allAnswered ? "pointer" : "default" }}>
            {lang === "zh" ? "查看結果" : "Check Answers"}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: score === 2 ? GREEN : GOLD }}>
              {score}/{studies.length} {lang === "zh" ? "正確" : "correct"} {score === 2 ? "🎉" : "📚"}
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

// ═══ RATE THIS STUDY — RoB Exercise (added to S5) ═══
function RateThisStudy({ lang }) {
  const domains = [
    { key: "random", zh: "隨機化過程", en: "Randomization", icon: "🎲",
      infoZh: "隨機序列由電腦生成，但分配隱藏方式未描述。", infoEn: "Random sequence generated by computer, but allocation concealment not described.",
      correct: 1, expZh: "電腦隨機化良好，但分配隱藏不清楚引起疑慮。", expEn: "Computer randomization is good, but unclear allocation concealment raises concerns." },
    { key: "deviate", zh: "偏離預設干預", en: "Deviations from Intervention", icon: "↔",
      infoZh: "雙盲設計，患者和研究者都不知道分組。脫落率兩組相似（5% vs 6%）。", infoEn: "Double-blind design. Patients and investigators blinded. Dropout similar (5% vs 6%).",
      correct: 0, expZh: "雙盲且脫落率平衡——低偏倚風險。", expEn: "Double-blind with balanced dropout — low risk of bias." },
    { key: "missing", zh: "遺失結局數據", en: "Missing Outcome Data", icon: "❓",
      infoZh: "完成率 89%。使用完成者分析（completer analysis），未進行 ITT 分析。", infoEn: "89% completion rate. Used completer analysis, no ITT analysis performed.",
      correct: 2, expZh: "11% 遺失且未用 ITT 分析——高風險。脫落的人可能結局不同。", expEn: "11% missing without ITT — high risk. Dropouts may have had different outcomes." },
    { key: "measure", zh: "結局測量", en: "Outcome Measurement", icon: "📏",
      infoZh: "主要結局為實驗室檢驗值（HbA1c），由中央實驗室統一分析。", infoEn: "Primary outcome was lab value (HbA1c), analyzed by a central laboratory.",
      correct: 0, expZh: "客觀指標由中央實驗室測量——低偏倚風險。", expEn: "Objective measure from central lab — low risk of bias." },
    { key: "select", zh: "選擇性報告", en: "Selective Reporting", icon: "📝",
      infoZh: "試驗已預先註冊，但預先指定的次要結局之一（低血糖事件）在論文中未報告。", infoEn: "Trial was pre-registered, but one pre-specified secondary outcome (hypoglycemic events) was not reported in the paper.",
      correct: 1, expZh: "預先註冊的結局未報告——引起選擇性報告的疑慮。", expEn: "Pre-registered outcome not reported — raises selective reporting concerns." },
  ];

  const levels = [
    { value: 0, zh: "低風險", en: "Low", color: GREEN, bg: "#E6F5F0" },
    { value: 1, zh: "有疑慮", en: "Some Concerns", color: GOLD, bg: "#FFF8EE" },
    { value: 2, zh: "高風險", en: "High", color: RED, bg: "#FDEEEB" },
  ];

  const [ratings, setRatings] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleRate = (domainKey, value) => {
    if (showResults) return;
    setRatings(prev => ({ ...prev, [domainKey]: value }));
  };

  const allRated = Object.keys(ratings).length === domains.length;
  const score = domains.filter(d => ratings[d.key] === d.correct).length;

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "28px 22px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)", marginTop: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 6, textAlign: "center" }}>
        {lang === "zh" ? "評估這篇研究的偏倚風險" : "Rate This Study's Risk of Bias"}
      </h3>
      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", marginBottom: 8 }}>
        {lang === "zh" ? "根據研究描述，為每個 RoB 2 領域指定風險等級" : "Based on the study description, assign a risk level to each RoB 2 domain"}
      </p>
      <div style={{ background: `${GOLD}08`, borderRadius: 10, padding: "10px 14px", marginBottom: 20, textAlign: "center" }}>
        <span style={{ fontSize: 13, color: GOLD, fontWeight: 500 }}>
          {lang === "zh" ? "研究：Metformin vs 安慰劑對 T2DM 患者 HbA1c 的影響（RCT）" : "Study: Metformin vs Placebo on HbA1c in T2DM Patients (RCT)"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {domains.map(d => {
          const picked = ratings[d.key];
          const isCorrect = picked === d.correct;
          const revealed = showResults && picked !== undefined;
          return (
            <div key={d.key} style={{
              background: revealed ? (isCorrect ? "#E6F5F0" : "#FDEEEB") : "#FAFAF7",
              border: `1.5px solid ${revealed ? (isCorrect ? GREEN + "44" : RED + "44") : LIGHT_BORDER}`,
              borderRadius: 14, padding: "16px", transition: "all 0.3s",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>{d.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{lang === "zh" ? d.zh : d.en}</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: MUTED, marginBottom: 12 }}>
                {lang === "zh" ? d.infoZh : d.infoEn}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {levels.map(lv => {
                  const isThis = picked === lv.value;
                  return (
                    <button key={lv.value} onClick={() => handleRate(d.key, lv.value)}
                      style={{
                        flex: 1, padding: "7px 10px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                        background: isThis ? lv.bg : "white",
                        border: `1.5px solid ${isThis ? lv.color : LIGHT_BORDER}`,
                        color: isThis ? lv.color : MUTED,
                        cursor: showResults ? "default" : "pointer", transition: "all 0.2s",
                      }}>
                      {revealed && isThis ? (isCorrect ? "✓ " : "✗ ") : ""}{lang === "zh" ? lv.zh : lv.en}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <p style={{ fontSize: 12, lineHeight: 1.5, color: isCorrect ? "#2A7A5A" : "#B83A20", marginTop: 8, animation: "fadeInTrack 0.3s ease-out" }}>
                  {lang === "zh" ? d.expZh : d.expEn}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        {!showResults ? (
          <button onClick={() => allRated && setShowResults(true)}
            style={{ ...btnPrimary, background: allRated ? GOLD : "#E8E6E1", color: allRated ? "#FFF" : MUTED, cursor: allRated ? "pointer" : "default" }}>
            {lang === "zh" ? "查看結果" : "Check Answers"}
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: score >= 4 ? GREEN : score >= 3 ? GOLD : CORAL }}>
              {score}/{domains.length} {lang === "zh" ? "正確" : "correct"} {score === 5 ? "🎉" : score >= 3 ? "👍" : "📚"}
            </span>
            <button onClick={() => { setRatings({}); setShowResults(false); }}
              style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
              {lang === "zh" ? "重試" : "Try Again"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══ ROB TOOL CARDS (Section 5) ═══
function RoBToolCards({ lang }) {
  const [activeCard, setActiveCard] = useState(null); // "rob2" | "nos" | null

  const rob2Domains = [
    { en: "Randomization process", zh: "隨機化過程", icon: "🎲" },
    { en: "Deviations from intended interventions", zh: "偏離預設干預", icon: "↔" },
    { en: "Missing outcome data", zh: "遺失結局數據", icon: "❓" },
    { en: "Measurement of the outcome", zh: "結局測量", icon: "📏" },
    { en: "Selection of reported result", zh: "選擇性報告", icon: "📝" },
  ];

  const nosCategories = [
    { en: "Selection (max 4★)", zh: "選擇 (最多 4★)", icon: "👥", stars: 4 },
    { en: "Comparability (max 2★)", zh: "可比性 (最多 2★)", icon: "⚖", stars: 2 },
    { en: "Outcome (max 3★)", zh: "結局 (最多 3★)", icon: "📊", stars: 3 },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      {/* RoB 2 Card */}
      <div onClick={() => setActiveCard(activeCard === "rob2" ? null : "rob2")}
        style={{
          background: activeCard === "rob2" ? "#FDF2F2" : CARD_BG,
          border: `2px solid ${activeCard === "rob2" ? CORAL : LIGHT_BORDER}`,
          borderRadius: 16, padding: "20px 18px", cursor: "pointer", transition: "all 0.3s",
        }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: activeCard === "rob2" ? CORAL : DARK, marginBottom: 6 }}>
          🔬 Cochrane RoB 2
        </div>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: 10 }}>
          {lang === "zh" ? "用於隨機對照試驗 (RCT)" : "For Randomized Controlled Trials"}
        </p>
        {activeCard === "rob2" && (
          <div style={{ animation: "fadeInTrack 0.3s ease-out" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: CORAL, marginBottom: 10 }}>
              {lang === "zh" ? "5 個評估領域：" : "5 Assessment Domains:"}
            </div>
            {rob2Domains.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 14 }}>
                <span>{d.icon}</span>
                <span style={{ color: DARK }}>{d[lang]}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {[
                { label: lang === "zh" ? "低" : "Low", color: GREEN, bg: "#E6F5F0" },
                { label: lang === "zh" ? "有疑慮" : "Some", color: GOLD, bg: "#FFF8EE" },
                { label: lang === "zh" ? "高" : "High", color: RED, bg: "#FDEEEB" },
              ].map((level) => (
                <span key={level.label} style={{
                  fontSize: 12, fontWeight: 600, color: level.color,
                  background: level.bg, padding: "4px 10px", borderRadius: 6,
                }}>{level.label}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* NOS Card */}
      <div onClick={() => setActiveCard(activeCard === "nos" ? null : "nos")}
        style={{
          background: activeCard === "nos" ? "#FFF8EE" : CARD_BG,
          border: `2px solid ${activeCard === "nos" ? GOLD : LIGHT_BORDER}`,
          borderRadius: 16, padding: "20px 18px", cursor: "pointer", transition: "all 0.3s",
        }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: activeCard === "nos" ? GOLD : DARK, marginBottom: 6 }}>
          ⭐ Newcastle-Ottawa Scale
        </div>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: 10 }}>
          {lang === "zh" ? "用於觀察性研究" : "For Observational Studies"}
        </p>
        {activeCard === "nos" && (
          <div style={{ animation: "fadeInTrack 0.3s ease-out" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: GOLD, marginBottom: 10 }}>
              {lang === "zh" ? "3 個評估類別（最高 9★）：" : "3 Categories (max 9★):"}
            </div>
            {nosCategories.map((cat, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 14 }}>
                <span>{cat.icon}</span>
                <span style={{ color: DARK }}>{cat[lang]}</span>
                <span style={{ color: GOLD, marginLeft: "auto" }}>{"★".repeat(cat.stars)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeInTrack { 0% { opacity:0; transform:translateY(6px); } 100% { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}

// ═══ TRAFFIC LIGHT MATRIX DEMO (Section 6) ═══
function TrafficLightDemo({ lang }) {
  const [excludeHighRisk, setExcludeHighRisk] = useState(false);

  const domains = lang === "zh"
    ? ["隨機化", "偏離干預", "遺失數據", "結局測量", "選擇性報告"]
    : ["Random.", "Deviat.", "Missing", "Measure.", "Select."];

  // Mock 5 studies with RoB ratings: 0=low(green), 1=some(yellow), 2=high(red)
  const studies = [
    { name: "Chen 2023", ratings: [0, 0, 0, 0, 0], weight: 0.25, effect: -0.8 },
    { name: "Kim 2022", ratings: [0, 1, 0, 0, 0], weight: 0.20, effect: -0.6 },
    { name: "Smith 2021", ratings: [2, 2, 1, 2, 1], weight: 0.15, effect: -2.1 },
    { name: "Patel 2023", ratings: [0, 0, 1, 0, 0], weight: 0.22, effect: -0.5 },
    { name: "Jones 2020", ratings: [0, 1, 0, 1, 0], weight: 0.18, effect: -0.7 },
  ];

  const ratingColors = [GREEN, GOLD, RED];
  const isHighRisk = (s) => s.ratings.includes(2);

  const activeStudies = excludeHighRisk ? studies.filter(s => !isHighRisk(s)) : studies;
  const totalWeight = activeStudies.reduce((sum, s) => sum + s.weight, 0);
  const pooledEffect = activeStudies.reduce((sum, s) => sum + s.effect * (s.weight / totalWeight), 0);

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "24px 18px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 14, textAlign: "center" }}>
        {lang === "zh" ? "偏倚風險交通燈矩陣" : "Risk of Bias Traffic-Light Matrix"}
      </h4>

      {/* Matrix table */}
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "6px 8px", color: MUTED, fontWeight: 600 }}>
                {lang === "zh" ? "研究" : "Study"}
              </th>
              {domains.map((d, i) => (
                <th key={i} style={{ padding: "6px 4px", color: MUTED, fontWeight: 600, textAlign: "center", fontSize: 10 }}>{d}</th>
              ))}
              <th style={{ padding: "6px 8px", color: MUTED, fontWeight: 600, textAlign: "center" }}>
                {lang === "zh" ? "整體" : "Overall"}
              </th>
            </tr>
          </thead>
          <tbody>
            {studies.map((s, si) => {
              const highRisk = isHighRisk(s);
              const excluded = excludeHighRisk && highRisk;
              const overallRating = Math.max(...s.ratings);
              return (
                <tr key={si} style={{ opacity: excluded ? 0.3 : 1, transition: "opacity 0.3s", textDecoration: excluded ? "line-through" : "none" }}>
                  <td style={{ padding: "6px 8px", fontWeight: 500, color: DARK }}>
                    {s.name} {highRisk && <span style={{ color: RED, fontSize: 10 }}>⚠</span>}
                  </td>
                  {s.ratings.map((r, ri) => (
                    <td key={ri} style={{ textAlign: "center", padding: "4px" }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%",
                        background: ratingColors[r], margin: "0 auto",
                        opacity: 0.85,
                      }} />
                    </td>
                  ))}
                  <td style={{ textAlign: "center", padding: "4px" }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%",
                      background: ratingColors[overallRating], margin: "0 auto",
                    }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sensitivity analysis toggle */}
      <div style={{
        background: excludeHighRisk ? "#FDEEEB" : "#F8F7F4",
        borderRadius: 12, padding: "14px 16px",
        border: `1px solid ${excludeHighRisk ? RED + "22" : LIGHT_BORDER}`,
        transition: "all 0.3s",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <button onClick={() => setExcludeHighRisk(!excludeHighRisk)}
            style={{
              background: excludeHighRisk ? RED : "#E8E6E1",
              border: "none", color: excludeHighRisk ? "#FFF" : MUTED,
              padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: "pointer", transition: "all 0.2s",
            }}>
            {excludeHighRisk
              ? (lang === "zh" ? "✕ 恢復全部研究" : "✕ Restore All")
              : (lang === "zh" ? "🔍 排除高風險研究" : "🔍 Exclude High-Risk")}
          </button>
          <span style={{ fontSize: 12, color: MUTED }}>
            {lang === "zh" ? "← 敏感性分析" : "← Sensitivity analysis"}
          </span>
        </div>
        <div style={{ fontSize: 13, color: DARK, fontWeight: 500 }}>
          {lang === "zh" ? "合併效應量：" : "Pooled effect: "}
          <strong style={{ color: excludeHighRisk ? CORAL : GOLD }}>
            {pooledEffect.toFixed(2)}
          </strong>
          {excludeHighRisk && (
            <span style={{ fontSize: 12, color: CORAL, marginLeft: 8 }}>
              {lang === "zh"
                ? "（排除高風險研究後，效應量從 −0.92 降到 −0.63）"
                : " (dropped from −0.92 to −0.63 after excluding high-risk study)"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


// ═══ MAIN COURSE 3 COMPONENT ═══
export default function Course3({ onNavigate, user, onLogin, onLogout }) {
  const { t, lang, toggleLang } = useI18n();
  const [activeSection, setActiveSection] = useState("hero");

  // Track which section is in view
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
    { id: "s1", num: 1, label: lang === "zh" ? "為什麼重要" : "Why It Matters" },
    { id: "s2", num: 2, label: lang === "zh" ? "萃取表格" : "Extraction Table" },
    { id: "s3", num: 3, label: lang === "zh" ? "提取哪些數字" : "What Numbers" },
    { id: "s4", num: 4, label: lang === "zh" ? "偏倚風險" : "Risk of Bias" },
    { id: "s5", num: 5, label: lang === "zh" ? "評估工具" : "RoB Tools" },
    { id: "s6", num: 6, label: lang === "zh" ? "整合應用" : "Putting It Together" },
    { id: "s7", num: 7, label: lang === "zh" ? "雙人萃取" : "Dual Extraction" },
    { id: "game", num: 8, label: lang === "zh" ? "恐龍守護家園" : "Dino Home Save" },
  ];

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${GOLD}22; color: ${DARK}; }
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
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: GOLD, marginBottom: 10, fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
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
              borderLeft: `2.5px solid ${isActive ? GOLD : "transparent"}`,
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: isActive ? GOLD : "#C0BFB9",
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
        courseId="course3"
        courseLabel={t("c3Label")}
        courseColor="#D4A843"
      />

      {/* HERO */}
      <section id="hero" style={{ paddingTop: 90, paddingBottom: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.15, backgroundImage: `radial-gradient(circle, ${GOLD}55 0.8px, transparent 0.8px)`, backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 20, background: `${GOLD}0D`, border: `1px solid ${GOLD}22`, fontSize: 12, color: GOLD, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>{t("c3Label")}</div>
          <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16, color: DARK }}>
            {t("c3Title")}
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 28px" }}>
            {t("c3Desc")}
          </p>
          <button onClick={() => scrollTo("s1")} style={{ ...btnPrimary, boxShadow: `0 4px 20px ${GOLD}33` }}>{t("c3StartBtn")}</button>
        </div>
      </section>

      {/* S1: Why Data Extraction Matters */}
      <section id="s1" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c3s1Label")} /><SectionTitle>{t("c3s1Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c3s1Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14, marginBottom: 28 }}>
            <FadeIn delay={0.15}>
              <div style={{ background: "#FDEEEB", border: `1px solid ${RED}22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: RED, marginBottom: 10 }}>{t("c3s1Bad")}</h4>
                <p style={{ fontSize: 15, fontWeight: 600, color: RED, marginBottom: 10, lineHeight: 1.5 }}>{t("c3s1BadEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("c3s1BadWhy")}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ background: "#E6F5F0", border: `1px solid ${GREEN}22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10 }}>{t("c3s1Good")}</h4>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10, lineHeight: 1.5 }}>{t("c3s1GoodEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("c3s1GoodWhy")}</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s2")} style={btnPrimary}>{t("c3s1Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S2: The Extraction Table */}
      <section id="s2" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c3s2Label")} /><SectionTitle>{t("c3s2Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c3s2Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><ExtractionTableDemo lang={lang} /></FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}1A`, borderRadius: 14, padding: "16px 20px", marginTop: 24, marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: GOLD }}>🍳 {t("c3s2Tip")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s3")} style={btnPrimary}>{t("c3s2Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S3: What Numbers to Extract */}
      <section id="s3" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c3s3Label")} /><SectionTitle>{t("c3s3Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c3s3Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><OutcomeTracksDemo lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><ExtractionDrill lang={lang} /></FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s4")} style={btnPrimary}>{t("c3s3Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S4: Risk of Bias: Why Quality Matters */}
      <section id="s4" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c3s4Label")} /><SectionTitle>{t("c3s4Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c3s4Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: GOLD }}>🧑‍🍳 {t("c3s4Analogy")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s5")} style={btnPrimary}>{t("c3s4Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S5: RoB Tools */}
      <section id="s5" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c3s5Label")} /><SectionTitle>{t("c3s5Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c3s5Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><RoBToolCards lang={lang} /></FadeIn>
          <FadeIn delay={0.2}><RateThisStudy lang={lang} /></FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s6")} style={btnPrimary}>{t("c3s5Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S6: Putting It Together */}
      <section id="s6" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c3s6Label")} /><SectionTitle>{t("c3s6Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("c3s6Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><TrafficLightDemo lang={lang} /></FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}1A`, borderRadius: 14, padding: "16px 20px", marginTop: 24, marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: GOLD }}>📝 {t("c3s6Tip")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}>
            <div style={{ textAlign: "center" }}>
              <button onClick={() => scrollTo("s7")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>{t("c3s6Next")}</button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* S7: NEW — Dual Extraction & Disagreement Resolution */}
      <section id="s7" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={lang === "zh" ? "雙人萃取" : "Dual Extraction"} /><SectionTitle>{lang === "zh" ? "雙人獨立萃取與分歧處理" : "Dual Independent Extraction & Disagreement Resolution"}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>
            {lang === "zh"
              ? "一個人萃取數據難免犯錯。系統性回顧要求至少兩人獨立萃取——各自完成後再比對，用 Cohen's kappa 衡量一致性。不一致的地方由第三人裁決或討論解決。"
              : "One person extracting data will inevitably make mistakes. Systematic reviews require at least two independent extractors — each completes their work separately, then results are compared using Cohen's kappa for agreement. Disagreements are resolved by a third reviewer or discussion."}
          </Paragraph></FadeIn>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 28 }}>
            {[
              { numZh: "1", titleZh: "獨立萃取", titleEn: "Extract Independently", descZh: "兩名審查者各自萃取數據，過程中不互相討論。使用相同的標準化表格。", descEn: "Two reviewers extract data separately without discussing. Use the same standardized form." },
              { numZh: "2", titleZh: "比對結果", titleEn: "Compare Results", descZh: "比較兩份萃取結果。計算 Cohen's kappa 評估一致性（>0.8 = 優秀，0.6-0.8 = 良好）。", descEn: "Compare both extractions. Calculate Cohen's kappa for agreement (>0.8 = excellent, 0.6-0.8 = good)." },
              { numZh: "3", titleZh: "處理分歧", titleEn: "Resolve Disagreements", descZh: "不一致的地方回到原文核實。無法達成共識時由第三位審查者裁決。記錄所有分歧和解決方式。", descEn: "Disagreements are verified against the original text. If unresolved, a third reviewer decides. Document all disagreements and resolutions." },
              { numZh: "4", titleZh: "試行校準", titleEn: "Pilot & Calibrate", descZh: "正式萃取前，先用 2-3 篇文獻進行試行，讓團隊統一萃取標準和判斷。", descEn: "Before formal extraction, pilot with 2-3 studies to calibrate the team's extraction standards and judgments." },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.05 + 0.15}>
                <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "22px 20px", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: `${GOLD}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: GOLD, flexShrink: 0 }}>{step.numZh}</div>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{lang === "zh" ? step.titleZh : step.titleEn}</h4>
                  </div>
                  <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{lang === "zh" ? step.descZh : step.descEn}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.35}>
            <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: GOLD }}>
                💡 {lang === "zh"
                  ? "常見工具：Covidence 和 Rayyan 支援雙人萃取的盲篩模式和衝突標記。Excel 也可以，但缺少自動比對功能。"
                  : "Common tools: Covidence and Rayyan support blinded dual extraction with conflict flagging. Excel works too, but lacks automatic comparison features."}
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.4}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("game")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>{lang === "zh" ? "挑戰小遊戲 →" : "Challenge Yourself →"}</button></div></FadeIn>
        </div>
      </section>

      {/* GAME */}
      <section id="game" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("c3gameLabel")} /></FadeIn>
          <FadeIn delay={0.1}><DinoHomeSave t={t} lang={lang} /></FadeIn>
        </div>
      </section>

      </div>{/* end .main-content */}

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG, marginLeft: 0 }}>
        {onNavigate && (
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("course2")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "← 回到 Course 2" : "← Back to Course 2"}
            </button>
            <button onClick={() => onNavigate("hub")} style={{ background: "transparent", border: `1.5px solid ${LIGHT_BORDER}`, color: MUTED, padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.borderColor = TEAL; e.target.style.color = TEAL; }}
              onMouseLeave={(e) => { e.target.style.borderColor = LIGHT_BORDER; e.target.style.color = MUTED; }}>
              {lang === "zh" ? "課程總覽" : "Course Hub"}
            </button>
            <button onClick={() => onNavigate("course4")} style={{ background: GOLD, border: "none", color: "#FFF", padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.target.style.boxShadow = `0 4px 16px ${GOLD}44`; }}
              onMouseLeave={(e) => { e.target.style.boxShadow = "none"; }}>
              {lang === "zh" ? "Course 4：效應量與森林圖 →" : "Course 4: Effect Sizes →"}
            </button>
          </div>
        )}
        <p style={{ fontSize: 13, color: "#B0AFAA", lineHeight: 1.8 }}>Meta-Analysis 101 — {t("c3Label")}: {t("c3Subtitle")}</p>
        <div style={{ marginTop: 12, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>統合分析 101</div>
      </footer>
    </div>
  );
}
