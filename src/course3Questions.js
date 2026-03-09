// ============================================================
// COURSE 3: Data Extraction & Risk of Bias — 70 Questions (10 per category)
// ============================================================
// 7 categories:
//   0 = Purpose and principles of data extraction
//   1 = What to extract for dichotomous outcomes
//   2 = What to extract for continuous outcomes + conversions
//   3 = Cochrane RoB 2 domains
//   4 = Newcastle-Ottawa Scale for observational studies
//   5 = Dual extraction, disagreement resolution, and error prevention
//   6 = Sensitivity analysis and handling problematic studies
// ============================================================

export const course3Categories = {
  zh: ["數據萃取的目的與原則", "二分類結果的萃取", "連續性結果與轉換", "Cochrane RoB 2 領域", "Newcastle-Ottawa 量表", "雙人萃取與分歧處理", "敏感性分析與問題研究"],
  en: ["Purpose & Principles of Data Extraction", "Dichotomous Outcome Extraction", "Continuous Outcomes & Conversions", "Cochrane RoB 2 Domains", "Newcastle-Ottawa Scale", "Dual Extraction & Disagreement Resolution", "Sensitivity Analysis & Problematic Studies"],
};

export const course3Questions = [

  // ════════════════════════════════════════
  // Category 0: Purpose and principles of data extraction (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c3-001", category: 0,
    zh: { q: "數據萃取在系統性回顧中的主要目的是什麼？", opts: ["快速瀏覽每篇文獻的摘要", "系統性地從每篇納入研究中收集所有相關數據，用於後續統合分析", "只記錄每篇文獻的 p 值", "選擇性地抄錄支持假說的結果"], exp: "數據萃取是系統性地、全面地從每篇納入研究中收集相關資訊，包括研究特徵和結果數據，為統合分析提供基礎。" },
    en: { q: "What is the primary purpose of data extraction in a systematic review?", opts: ["Quickly skim each study's abstract", "Systematically collect all relevant data from each included study for subsequent meta-analysis", "Only record each study's p-value", "Selectively copy results supporting the hypothesis"], exp: "Data extraction systematically and comprehensively collects relevant information from included studies, including study characteristics and outcome data, forming the foundation for meta-analysis." },
    correct: 1
  },
  {
    id: "c3-002", category: 0,
    zh: { q: "「垃圾進，垃圾出」(garbage-in, garbage-out) 在數據萃取中是什麼意思？", opts: ["應該丟棄品質差的研究", "如果萃取的數據不準確或不完整，統合分析結果也會不可靠", "只需要萃取高品質研究的數據", "是一種統計方法的名稱"], exp: "如果萃取數據時出錯（抄錯數字、遺漏重要資訊），後續的統合分析結果就會被汙染。準確的萃取是可靠結果的前提。" },
    en: { q: "What does 'garbage-in, garbage-out' mean in data extraction?", opts: ["Discard poor-quality studies", "If extracted data is inaccurate or incomplete, the meta-analysis results will be unreliable", "Only extract data from high-quality studies", "It's the name of a statistical method"], exp: "If data extraction contains errors (wrong numbers, missing information), the meta-analysis will be contaminated. Accurate extraction is the prerequisite for reliable results." },
    correct: 1
  },
  {
    id: "c3-003", category: 0,
    zh: { q: "以下哪種做法是數據萃取的「壞習慣」？", opts: ["使用標準化表格", "只從摘要中抓取 p 值，不看全文的原始數據", "由兩人獨立萃取", "記錄萃取日期"], exp: "只看摘要中的 p 值會遺漏大量重要資訊（樣本量、事件數、效應量等）。正確做法是閱讀全文並使用結構化表格萃取。" },
    en: { q: "Which is a 'bad habit' in data extraction?", opts: ["Using a standardized form", "Grabbing only p-values from abstracts without examining full-text raw data", "Having two independent extractors", "Recording extraction dates"], exp: "Only taking p-values from abstracts misses crucial information (sample sizes, event counts, effect sizes). The correct approach is reading the full text and using a structured extraction form." },
    correct: 1
  },
  {
    id: "c3-004", category: 0,
    zh: { q: "為什麼數據萃取需要在正式開始之前先進行試行 (pilot)？", opts: ["為了練習打字速度", "為了確保所有萃取者對表格的理解一致，減少差異", "試行不重要，可以跳過", "只有新手才需要試行"], exp: "試行讓團隊成員在 2-3 篇文獻上測試萃取表格，發現理解不一致之處並統一標準。這能大幅減少後續的分歧。" },
    en: { q: "Why should data extraction be piloted before formal extraction begins?", opts: ["To practice typing speed", "To ensure all extractors have consistent understanding of the form, reducing discrepancies", "Piloting is unimportant and can be skipped", "Only beginners need piloting"], exp: "Piloting lets team members test the form on 2-3 studies, identify inconsistencies in understanding, and standardize criteria. This greatly reduces subsequent disagreements." },
    correct: 1
  },
  {
    id: "c3-005", category: 0,
    zh: { q: "數據萃取表格通常不包含以下哪個欄位？", opts: ["作者/年份", "研究設計", "審稿人的主觀評語", "結果數據（事件數、均值等）"], exp: "萃取表格應包含客觀資訊：研究特徵、人口學資料、介入細節、結果數據等。審稿人的主觀評語不屬於標準化萃取內容。" },
    en: { q: "Which field is NOT typically included in a data extraction form?", opts: ["Author/Year", "Study design", "Reviewer's subjective commentary", "Outcome data (event counts, means, etc.)"], exp: "The form should contain objective information: study characteristics, demographics, intervention details, outcome data. Subjective reviewer commentary is not part of standardized extraction." },
    correct: 2
  },
  {
    id: "c3-006", category: 0,
    zh: { q: "數據萃取就像烹飪中的哪個步驟？", opts: ["隨意抓一把食材丟進鍋裡", "精確地量測每種食材再加入鍋中", "只看食譜的照片不看步驟", "只嚐最後的味道"], exp: "就像烹飪前精確量測每種食材一樣，數據萃取需要精確地從每篇研究中取出所需的數據，才能產出可靠的結果。" },
    en: { q: "Data extraction is like which step in cooking?", opts: ["Randomly tossing ingredients into the pot", "Precisely measuring each ingredient before adding it to the pot", "Only looking at the recipe photo without reading the steps", "Only tasting the final dish"], exp: "Just like precisely measuring each ingredient before cooking, data extraction requires carefully pulling needed data from each study to produce reliable results." },
    correct: 1
  },
  {
    id: "c3-007", category: 0,
    zh: { q: "以下哪項最適合描述好的數據萃取？", opts: ["閱讀營養標籤上的每個數字，而不只是看包裝上的宣傳", "只看摘要的結論句", "選擇有利的結果報告", "依賴作者在摘要中的自我評價"], exp: "好的萃取就像仔細閱讀營養標籤——查看原始數據（事件數、樣本量、均值、標準差），而不只是看包裝上的「健康」宣傳（摘要中的結論）。" },
    en: { q: "Which best describes good data extraction?", opts: ["Reading every number on the nutrition label, not just the food packaging claims", "Only reading the abstract's conclusion", "Selectively reporting favorable results", "Relying on the author's self-assessment in the abstract"], exp: "Good extraction is like reading nutrition labels — examining raw data (event counts, sample sizes, means, SDs), not just the packaging claims (abstract conclusions)." },
    correct: 0
  },
  {
    id: "c3-008", category: 0,
    zh: { q: "萃取數據時發現某研究的表格和文字描述的數字不一致，應該怎麼做？", opts: ["選擇較大的數字", "選擇文字中的數字", "標記此不一致，嘗試釐清或聯繫作者", "忽略該研究"], exp: "數字不一致是常見問題。應標記不一致之處，嘗試從其他資訊推算正確值，或聯繫通訊作者確認。" },
    en: { q: "While extracting, you find the table and text report different numbers. What should you do?", opts: ["Use the larger number", "Use the number from the text", "Flag the inconsistency, try to clarify, or contact the authors", "Exclude the study"], exp: "Numeric inconsistencies are common. Flag the discrepancy, try to deduce the correct value from other information, or contact the corresponding author for clarification." },
    correct: 2
  },
  {
    id: "c3-009", category: 0,
    zh: { q: "「數據萃取」和「文獻篩選」有什麼關係？", opts: ["它們是同一件事", "數據萃取在篩選之後進行——只從已確認納入的研究中萃取", "數據萃取在搜尋之前進行", "它們可以同時進行以節省時間"], exp: "先篩選確定哪些研究符合納入標準，然後才從這些納入的研究中進行數據萃取。順序不可顛倒。" },
    en: { q: "What is the relationship between 'data extraction' and 'study screening'?", opts: ["They are the same thing", "Extraction happens after screening — only from confirmed included studies", "Extraction happens before searching", "They can be done simultaneously to save time"], exp: "First screening determines which studies meet inclusion criteria, then data extraction is performed on those included studies. The sequence cannot be reversed." },
    correct: 1
  },
  {
    id: "c3-010", category: 0,
    zh: { q: "以下哪一項「不」是數據萃取表格的好處？", opts: ["確保每篇研究收集相同的資訊", "減少遺漏重要數據的機會", "保證萃取的數據完全正確", "方便比較不同研究的特徵"], exp: "標準化表格有助於一致性和完整性，但無法保證萃取的數據完全正確。仍需雙人萃取和核實來減少錯誤。" },
    en: { q: "Which is NOT a benefit of a data extraction form?", opts: ["Ensures same information is collected from each study", "Reduces chance of missing important data", "Guarantees extracted data is completely correct", "Facilitates comparison of study characteristics"], exp: "A standardized form helps consistency and completeness but cannot guarantee correctness. Double extraction and verification are still needed to reduce errors." },
    correct: 2
  },

  // ════════════════════════════════════════
  // Category 1: What to extract for dichotomous outcomes (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c3-011", category: 1,
    zh: { q: "二分類結局（dichotomous outcome）指的是什麼？", opts: ["可以測量為任何數值的結果", "只有兩種可能結果的結局，例如死亡/存活、治癒/未治癒", "中位數和四分位距", "只有連續性數據"], exp: "二分類結局只有兩種結果（是/否），例如死亡率、治癒率、復發與否。這是臨床試驗中最常見的結局類型之一。" },
    en: { q: "What is a dichotomous outcome?", opts: ["A result measured as any numerical value", "An outcome with only two possible results, e.g., death/survival, cured/not cured", "Median and interquartile range", "Only continuous data"], exp: "A dichotomous outcome has only two results (yes/no), e.g., mortality, cure rate, recurrence. This is one of the most common outcome types in clinical trials." },
    correct: 1
  },
  {
    id: "c3-012", category: 1,
    zh: { q: "一項試驗報告死亡率：治療組 15/100 vs 對照組 22/100。你需要萃取哪些數字？", opts: ["只需要 p 值", "每組的事件數和總人數：治療組 15 人死亡/100 人，對照組 22 人死亡/100 人", "只需百分比 15% 和 22%", "只需兩組的差異 7%"], exp: "需要原始的事件數和每組總人數。這讓統合分析軟體計算風險比或勝算比及其精確度。" },
    en: { q: "A trial reports mortality: treatment 15/100 vs control 22/100. What numbers do you need to extract?", opts: ["Just the p-value", "Events and totals per group: treatment 15 deaths/100, control 22 deaths/100", "Just the percentages 15% and 22%", "Just the difference of 7%"], exp: "You need raw event counts and total per group. This lets meta-analysis software calculate risk ratios or odds ratios with their precision." },
    correct: 1
  },
  {
    id: "c3-013", category: 1,
    zh: { q: "為什麼只萃取百分比（而非原始事件數和總人數）是不夠的？", opts: ["百分比比原始數字更準確", "因為百分比丟失了樣本量資訊——100 人中 15% 和 1000 人中 15% 的精確度不同", "百分比無法用於計算", "只有原始數字才能做圖表"], exp: "15/100 和 150/1000 的百分比都是 15%，但後者更精確，在統合分析中應獲得更大的權重。缺少樣本量就無法正確加權。" },
    en: { q: "Why is extracting only percentages (without raw events and totals) insufficient?", opts: ["Percentages are more accurate", "Percentages lose sample size information — 15% of 100 vs 15% of 1000 have different precision", "Percentages can't be used for calculations", "Only raw numbers can make charts"], exp: "15/100 and 150/1000 both give 15%, but the latter is more precise and should receive greater weight. Without sample size, proper weighting is impossible." },
    correct: 1
  },
  {
    id: "c3-014", category: 1,
    zh: { q: "二分類數據中的 2×2 表格包含哪四個格？", opts: ["均值、標準差、最小值、最大值", "治療組事件數、治療組非事件數、對照組事件數、對照組非事件數", "OR、RR、RD、NNT", "標題、作者、年份、期刊"], exp: "2×2 表格的四個格是：治療組事件/非事件、對照組事件/非事件。從這四個數字可以計算所有二分類效應量。" },
    en: { q: "What four cells does a 2×2 table for dichotomous data contain?", opts: ["Mean, SD, min, max", "Treatment events, treatment non-events, control events, control non-events", "OR, RR, RD, NNT", "Title, author, year, journal"], exp: "The 2×2 table has: treatment events/non-events, control events/non-events. All dichotomous effect sizes can be calculated from these four numbers." },
    correct: 1
  },
  {
    id: "c3-015", category: 1,
    zh: { q: "一篇文章只報告了風險比 (RR) 和 95% 信賴區間，沒有原始事件數。你該怎麼做？", opts: ["直接使用 RR 和 CI 進行統合分析", "排除該研究", "嘗試從其他表格或補充資料推算原始數據，或聯繫作者", "只記錄 p 值"], exp: "首選是取得原始數據。可以嘗試從文章其他部分推算，或聯繫作者。如果無法取得，可直接使用 RR 和 CI（但這是次選方案）。" },
    en: { q: "A paper reports only RR with 95% CI, no raw event counts. What should you do?", opts: ["Directly use RR and CI for meta-analysis", "Exclude the study", "Try to back-calculate raw data from other tables or supplementary materials, or contact authors", "Only record the p-value"], exp: "Getting raw data is preferred. Try deriving it from other information or contact authors. If unavailable, RR and CI can be used directly (but this is a secondary approach)." },
    correct: 2
  },
  {
    id: "c3-016", category: 1,
    zh: { q: "在萃取二分類數據時，「intention-to-treat (ITT)」和「per-protocol (PP)」人數可能不同。你應該用哪個？", opts: ["總是用最小的數字", "優先使用 ITT 分析的數據，因為它保持了隨機化的完整性", "只用 PP 數據", "取兩者的平均"], exp: "ITT 分析包含所有隨機分配的患者，保持了隨機化帶來的組間可比性。PP 分析可能引入偏差。大多數指南優先推薦 ITT。" },
    en: { q: "When extracting dichotomous data, ITT and per-protocol numbers may differ. Which should you use?", opts: ["Always the smallest number", "Prefer ITT analysis data because it maintains randomization integrity", "Only use PP data", "Average the two"], exp: "ITT includes all randomized patients, maintaining comparability between groups. PP analysis may introduce bias. Most guidelines recommend preferring ITT." },
    correct: 1
  },
  {
    id: "c3-017", category: 1,
    zh: { q: "一項研究報告：「治療組顯著減少了住院率 (p < 0.01)」但沒給原始數據。為什麼這不夠？", opts: ["p < 0.01 已經告訴你一切", "因為沒有事件數和樣本量，無法計算效應量或正確地在統合分析中加權", "文字描述比數字更可靠", "只要有 p 值就能做統合分析"], exp: "p 值不能取代原始數據。你需要每組的事件數和樣本量來計算效應量並在統合分析中正確加權。" },
    en: { q: "A study reports: 'Treatment significantly reduced hospitalization (p < 0.01)' with no raw data. Why is this insufficient?", opts: ["p < 0.01 tells you everything", "Without event counts and sample sizes, you can't calculate effect size or properly weight in meta-analysis", "Text descriptions are more reliable than numbers", "You can do a meta-analysis with just p-values"], exp: "A p-value cannot replace raw data. You need events and sample sizes per group to calculate effect sizes and properly weight in meta-analysis." },
    correct: 1
  },
  {
    id: "c3-018", category: 1,
    zh: { q: "如果治療組和對照組的「總人數」在文章不同表格中不一致，你應該怎麼做？", opts: ["選最大的數字", "選最小的數字", "比對全文確認差異原因（可能是遺失數據、排除標準不同等），並記錄決策", "忽略差異"], exp: "人數不一致常見於 ITT vs PP 分析或遺失數據處理差異。應比對全文、記錄你的判斷依據，並在必要時聯繫作者。" },
    en: { q: "If the 'total' for treatment and control groups is inconsistent across tables, what should you do?", opts: ["Use the largest number", "Use the smallest number", "Cross-check the full text to identify the reason (missing data, different criteria, etc.) and document your decision", "Ignore the difference"], exp: "Inconsistent totals often reflect ITT vs PP analysis or missing data handling. Cross-check the paper, document your reasoning, and contact authors if needed." },
    correct: 2
  },
  {
    id: "c3-019", category: 1,
    zh: { q: "以下哪個是二分類結局的常見效應量？", opts: ["均數差 (MD)", "勝算比 (OR) 或風險比 (RR)", "標準化均數差 (SMD)", "相關係數 (r)"], exp: "二分類結局最常用的效應量是勝算比 (OR)、風險比 (RR) 和風險差 (RD)。MD 和 SMD 用於連續性結局。" },
    en: { q: "Which is a common effect size for dichotomous outcomes?", opts: ["Mean difference (MD)", "Odds ratio (OR) or risk ratio (RR)", "Standardized mean difference (SMD)", "Correlation coefficient (r)"], exp: "The most common effect sizes for dichotomous outcomes are odds ratio (OR), risk ratio (RR), and risk difference (RD). MD and SMD are for continuous outcomes." },
    correct: 1
  },
  {
    id: "c3-020", category: 1,
    zh: { q: "萃取二分類數據時，你應該萃取的是哪個時間點的結果？", opts: ["任何時間點都可以", "預先在方案中定義的主要時間點", "最短追蹤期的結果", "p 值最小的時間點"], exp: "應在方案中預先定義要萃取的時間點（如 30 天、90 天或研究結束時）。避免在看到數據後才選擇對假說最有利的時間點。" },
    en: { q: "When extracting dichotomous data, which time point should you extract?", opts: ["Any time point is fine", "The primary time point pre-specified in the protocol", "The shortest follow-up period", "The time point with the smallest p-value"], exp: "The time point should be pre-specified in the protocol (e.g., 30-day, 90-day, or end-of-study). Avoid selecting time points after seeing data to pick the most favorable result." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 2: Continuous outcomes + conversions (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c3-021", category: 2,
    zh: { q: "連續性結局（continuous outcome）需要萃取哪三個關鍵數字？", opts: ["p 值、信賴區間、樣本量", "均值 (mean)、標準差 (SD)、每組樣本量 (n)", "中位數、最小值、最大值", "勝算比、風險比、風險差"], exp: "連續性結局的統合分析需要每組的均值、標準差和樣本量。這三個數字缺一不可。" },
    en: { q: "What three key numbers do you need for a continuous outcome?", opts: ["p-value, CI, sample size", "Mean, standard deviation (SD), and sample size (n) per group", "Median, minimum, maximum", "OR, RR, RD"], exp: "Meta-analysis of continuous outcomes requires mean, SD, and sample size per group. All three numbers are essential." },
    correct: 1
  },
  {
    id: "c3-022", category: 2,
    zh: { q: "一項研究報告結果為中位數和四分位距 (IQR)，而非均值和標準差。為什麼？", opts: ["作者計算錯誤", "可能因為數據分布偏斜（非常態分布），此時中位數比均值更能反映中央趨勢", "中位數總是比均值好", "沒有理由，只是偏好"], exp: "當數據偏斜時，均值會被極端值拉偏，中位數更穩定。因此偏斜數據的研究常報告中位數和 IQR 而非均值和 SD。" },
    en: { q: "A study reports median and IQR instead of mean and SD. Why?", opts: ["The authors made a calculation error", "Likely because the data is skewed (non-normal), where median better represents central tendency", "Median is always better than mean", "No reason, just preference"], exp: "When data is skewed, means are pulled by extreme values while medians are more stable. Studies with skewed data often report median and IQR instead of mean and SD." },
    correct: 1
  },
  {
    id: "c3-023", category: 2,
    zh: { q: "如何處理報告中位數/IQR 的研究，使其可納入均值/SD 的統合分析？", opts: ["直接將中位數當作均值使用", "使用已驗證的轉換公式（如 Wan 或 Luo 等人的方法）估計均值和 SD", "排除這些研究", "使用原始數據不做轉換"], exp: "Wan 等人和 Luo 等人開發了經驗證的公式，可從中位數、範圍和/或 IQR 估計均值和 SD。使用後應在方法中註明。" },
    en: { q: "How can studies reporting median/IQR be included in a mean/SD meta-analysis?", opts: ["Directly treat median as mean", "Use validated conversion formulas (e.g., Wan or Luo methods) to estimate mean and SD", "Exclude these studies", "Use raw data without conversion"], exp: "Wan et al. and Luo et al. developed validated formulas to estimate mean and SD from median, range, and/or IQR. Document the conversion in your methods." },
    correct: 1
  },
  {
    id: "c3-024", category: 2,
    zh: { q: "如果一項研究報告標準誤 (SE) 而非標準差 (SD)，如何轉換？", opts: ["SE 和 SD 是同一件事", "SD = SE × √n（n 為樣本量）", "無法轉換", "SD = SE / n"], exp: "SD = SE × √n。SE 和 SD 的關係是 SE = SD / √n，因此只要知道樣本量就能互相轉換。" },
    en: { q: "If a study reports standard error (SE) instead of SD, how do you convert?", opts: ["SE and SD are the same thing", "SD = SE × √n (where n is sample size)", "Cannot be converted", "SD = SE / n"], exp: "SD = SE × √n. The relationship is SE = SD / √n, so with sample size known, they can be converted interchangeably." },
    correct: 1
  },
  {
    id: "c3-025", category: 2,
    zh: { q: "一項研究只報告了 95% 信賴區間但沒有標準差。你能估算 SD 嗎？", opts: ["不能，必須排除該研究", "可以——用 CI 的寬度和樣本量反推 SD", "需要聯繫統計學家", "只有 Cochrane 團隊才能做"], exp: "95% CI = mean ± 1.96 × SE，因此 SE = (上界 - 下界) / (2 × 1.96)，再用 SD = SE × √n 計算。" },
    en: { q: "A study only reports 95% CI without SD. Can you estimate the SD?", opts: ["No, must exclude the study", "Yes — back-calculate SD from CI width and sample size", "Need to contact a statistician", "Only Cochrane teams can do this"], exp: "95% CI = mean ± 1.96 × SE, so SE = (upper - lower) / (2 × 1.96), then SD = SE × √n." },
    correct: 1
  },
  {
    id: "c3-026", category: 2,
    zh: { q: "當不同研究使用不同的量表測量同一結局（如憂鬱症用 HAM-D vs BDI）時，應該用什麼效應量？", opts: ["均數差 (MD)", "標準化均數差 (SMD)", "風險比 (RR)", "勝算比 (OR)"], exp: "SMD 將不同量表的效應量標準化到共同尺度（用 SD 為單位），使不同量表的研究可以合併。MD 只能用於相同量表。" },
    en: { q: "When studies use different scales for the same outcome (e.g., HAM-D vs BDI for depression), which effect size should you use?", opts: ["Mean difference (MD)", "Standardized mean difference (SMD)", "Risk ratio (RR)", "Odds ratio (OR)"], exp: "SMD standardizes effects to a common scale (in SD units), allowing studies using different scales to be combined. MD only works for the same scale." },
    correct: 1
  },
  {
    id: "c3-027", category: 2,
    zh: { q: "萃取「變化值」(change from baseline) 和「終點值」(final value) 有什麼差別？", opts: ["沒有差別", "變化值是治療前後的差異，終點值是治療後的絕對數值——兩者的 SD 不同，通常不能直接混合", "終點值更準確", "變化值只用於觀察性研究"], exp: "變化值的 SD 通常比終點值小（因扣除了基線變異）。混合兩者可能有問題，但 Cochrane 允許在 MD 統合分析中混合。" },
    en: { q: "What's the difference between extracting 'change from baseline' and 'final value'?", opts: ["No difference", "Change scores are pre-post differences, final values are absolute post-treatment numbers — their SDs differ and usually shouldn't be mixed directly", "Final values are more accurate", "Change scores are only for observational studies"], exp: "Change-score SDs are usually smaller (baseline variance is removed). Mixing can be problematic, though Cochrane allows it for MD meta-analyses." },
    correct: 1
  },
  {
    id: "c3-028", category: 2,
    zh: { q: "Wan 等人的轉換公式需要哪些資訊才能從中位數估計均值和 SD？", opts: ["只需要中位數", "中位數、樣本量，以及最小值/最大值或 Q1/Q3", "p 值和信賴區間", "勝算比和風險比"], exp: "Wan 的方法根據不同的報告格式（中位數+範圍、中位數+IQR、或兩者皆有）使用不同公式，都需要樣本量。" },
    en: { q: "What information does the Wan et al. conversion formula require to estimate mean and SD from median?", opts: ["Only the median", "Median, sample size, plus min/max or Q1/Q3", "p-value and CI", "OR and RR"], exp: "Wan's method uses different formulas depending on reporting format (median+range, median+IQR, or both), all requiring sample size." },
    correct: 1
  },
  {
    id: "c3-029", category: 2,
    zh: { q: "使用轉換公式估計均值和 SD 有什麼局限？", opts: ["完全沒有局限", "轉換值是估計值而非精確值，當數據嚴重偏斜時估計可能不準確", "轉換後的數據一定更準確", "只有在中文文獻中才有限制"], exp: "轉換公式假設底層分布近似常態。如果數據嚴重偏斜，轉換出的均值和 SD 可能偏離實際值。應在方法中揭露此限制。" },
    en: { q: "What are the limitations of using conversion formulas to estimate mean and SD?", opts: ["No limitations at all", "Converted values are estimates, not exact; accuracy decreases with severely skewed data", "Converted data is always more accurate", "Limitations only apply to Chinese publications"], exp: "Conversion formulas assume approximately normal distributions. With severely skewed data, estimated mean and SD may deviate from actual values. Report this limitation." },
    correct: 1
  },
  {
    id: "c3-030", category: 2,
    zh: { q: "一項研究的連續性結局同時報告了 ITT 人群 (n=200) 和 PP 人群 (n=180) 的結果。你應如何處理？", opts: ["取平均", "優先萃取 ITT 的結果，並記錄兩組人數的差異", "只用 PP 因為數據更乾淨", "兩組數據都萃取然後合併"], exp: "ITT 保持了隨機化的完整性，是優先選擇。PP 可以作為敏感性分析使用。應記錄你使用的是哪個人群。" },
    en: { q: "A study reports continuous outcomes for both ITT (n=200) and PP (n=180). How do you handle this?", opts: ["Average them", "Prefer ITT results and document the difference between the two populations", "Only use PP as the data is cleaner", "Extract both and combine them"], exp: "ITT preserves randomization integrity and is preferred. PP can be used in sensitivity analysis. Document which population you used." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 3: Cochrane RoB 2 domains (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c3-031", category: 3,
    zh: { q: "Cochrane RoB 2 工具用於評估什麼類型的研究？", opts: ["觀察性研究", "隨機對照試驗 (RCT)", "病例報告", "所有類型的研究"], exp: "RoB 2（Risk of Bias 2）是專門為評估隨機對照試驗設計的偏倚風險評估工具。觀察性研究使用其他工具如 NOS。" },
    en: { q: "What type of studies is the Cochrane RoB 2 tool designed to assess?", opts: ["Observational studies", "Randomized controlled trials (RCTs)", "Case reports", "All study types"], exp: "RoB 2 (Risk of Bias 2) is specifically designed to assess risk of bias in randomized controlled trials. Observational studies use other tools like NOS." },
    correct: 1
  },
  {
    id: "c3-032", category: 3,
    zh: { q: "RoB 2 有幾個領域 (domain)？", opts: ["3 個", "5 個", "7 個", "10 個"], exp: "RoB 2 包含 5 個領域：隨機化過程、偏離預設干預、遺失結局數據、結局測量、選擇性報告。" },
    en: { q: "How many domains does RoB 2 have?", opts: ["3", "5", "7", "10"], exp: "RoB 2 has 5 domains: randomization process, deviations from intended intervention, missing outcome data, outcome measurement, and selective reporting." },
    correct: 1
  },
  {
    id: "c3-033", category: 3,
    zh: { q: "RoB 2 的第一個領域「隨機化過程產生的偏倚」主要評估什麼？", opts: ["樣本量是否夠大", "隨機序列是否正確產生、分配是否被隱藏", "統計方法是否正確", "結局是否被盲法測量"], exp: "此領域評估：隨機序列是否用適當方法產生（如電腦亂數）、分配隱藏是否足以防止事先知道分組結果。" },
    en: { q: "What does RoB 2's first domain 'bias from the randomization process' mainly assess?", opts: ["Whether sample size is adequate", "Whether random sequence was properly generated and allocation was concealed", "Whether statistical methods are correct", "Whether outcomes were measured with blinding"], exp: "This domain assesses: whether the random sequence was generated by an appropriate method (e.g., computer random), and whether allocation concealment prevented foreknowledge of group assignment." },
    correct: 1
  },
  {
    id: "c3-034", category: 3,
    zh: { q: "RoB 2 使用什麼系統來判斷每個領域的偏倚風險？", opts: ["1-10 分的數字評分", "低風險、有些疑慮、高風險的交通燈系統", "通過/不通過", "A/B/C/D 等級"], exp: "RoB 2 使用三級交通燈系統：綠色（低風險）、黃色（有些疑慮）、紅色（高風險）。這使結果直觀易懂。" },
    en: { q: "What system does RoB 2 use to judge bias risk for each domain?", opts: ["1-10 numerical scores", "Low risk, some concerns, high risk — a traffic-light system", "Pass/fail", "A/B/C/D grades"], exp: "RoB 2 uses a three-level traffic-light system: green (low risk), yellow (some concerns), red (high risk). This makes results intuitive and visual." },
    correct: 1
  },
  {
    id: "c3-035", category: 3,
    zh: { q: "「偏離預設干預所產生的偏倚」這個領域主要關注什麼？", opts: ["隨機序列的產生", "參與者或研究人員是否偏離了原定的治療方案（如換藥、依從性差）", "結局評估者是否知道分組", "數據是否選擇性報告"], exp: "此領域關注：參與者是否接受了預定的治療、是否有交叉使用、依從性如何、以及偏離是否與結局相關。" },
    en: { q: "What does the 'bias due to deviations from intended interventions' domain focus on?", opts: ["Random sequence generation", "Whether participants or researchers deviated from the planned treatment protocol (switching, poor adherence)", "Whether outcome assessors knew group allocation", "Whether data was selectively reported"], exp: "This domain addresses: whether participants received intended treatment, crossover, adherence levels, and whether deviations were related to outcomes." },
    correct: 1
  },
  {
    id: "c3-036", category: 3,
    zh: { q: "RoB 2 的「遺失結局數據」領域評估什麼？", opts: ["是否有研究未被搜尋到", "納入研究中的結局數據是否完整，遺失是否可能與真實結果有關", "是否遺漏了重要的資料庫", "資金來源是否透明"], exp: "此領域評估失訪比例、各組失訪是否平衡、以及遺失數據是否可能與結局相關（會引入偏差）。" },
    en: { q: "What does RoB 2's 'missing outcome data' domain assess?", opts: ["Whether some studies weren't found", "Whether outcome data is complete and whether missingness may be related to true outcomes", "Whether important databases were missed", "Whether funding sources are transparent"], exp: "This domain assesses dropout rates, balance of dropout across groups, and whether missing data may be related to outcomes (which would introduce bias)." },
    correct: 1
  },
  {
    id: "c3-037", category: 3,
    zh: { q: "「結局測量的偏倚」這個領域主要涉及什麼？", opts: ["測量儀器的精確度", "結局評估者是否知道分組（盲法），以及測量方法是否可能受此影響", "樣本量計算", "統計分析方法的選擇"], exp: "如果評估結局的人知道患者屬於哪一組，可能會無意中偏向某個方向。客觀結局（如死亡）受影響較小，主觀結局（如疼痛評分）更易受影響。" },
    en: { q: "What does the 'bias in measurement of the outcome' domain involve?", opts: ["Precision of measurement instruments", "Whether outcome assessors knew group allocation (blinding) and whether measurement could be influenced", "Sample size calculation", "Choice of statistical method"], exp: "If those assessing outcomes knew group allocation, they might unconsciously bias results. Objective outcomes (death) are less affected; subjective outcomes (pain scores) are more vulnerable." },
    correct: 1
  },
  {
    id: "c3-038", category: 3,
    zh: { q: "「選擇性報告結果的偏倚」指的是什麼？", opts: ["研究者選擇性地報告對假說有利的結局或分析方法", "只納入英文文獻", "選擇特定的隨機方法", "選擇最好的研究設計"], exp: "如果研究者測量了多個結局但只報告顯著的結果，或事後改變主要結局，就產生了選擇性報告偏倚。可對比研究方案和最終報告來發現。" },
    en: { q: "What is 'bias in selection of the reported result'?", opts: ["Researchers selectively report outcomes or analyses favorable to their hypothesis", "Only including English-language studies", "Choosing specific randomization methods", "Choosing the best study design"], exp: "If researchers measure multiple outcomes but only report significant ones, or change the primary outcome post-hoc, selection reporting bias occurs. Compare protocols to final reports to detect it." },
    correct: 0
  },
  {
    id: "c3-039", category: 3,
    zh: { q: "如果一項 RCT 在 5 個 RoB 2 領域中有 4 個是「低風險」但 1 個是「高風險」，整體判斷應該是什麼？", opts: ["低風險（因為多數領域是低風險）", "有些疑慮", "高風險（一個高風險領域就足以影響整體判斷）", "需要投票決定"], exp: "RoB 2 的整體判斷取最嚴重的領域判斷。只要有一個領域是「高風險」，整體就判為「高風險」。" },
    en: { q: "If an RCT has 4 'low risk' and 1 'high risk' domain in RoB 2, what should the overall judgment be?", opts: ["Low risk (majority are low)", "Some concerns", "High risk (one high-risk domain is enough to affect overall judgment)", "A vote is needed"], exp: "RoB 2's overall judgment takes the worst domain judgment. If any domain is 'high risk,' the overall study is judged 'high risk.'" },
    correct: 2
  },
  {
    id: "c3-040", category: 3,
    zh: { q: "RoB 2 的交通燈圖表是用來做什麼的？", opts: ["顯示每項研究的樣本量", "以視覺化方式呈現所有納入研究在各領域的偏倚風險判斷", "計算合併效應量", "繪製漏斗圖"], exp: "交通燈圖表用紅、黃、綠色塊呈現每項研究在每個領域的評估結果，讓讀者一目了然地看出證據品質。" },
    en: { q: "What is the RoB 2 traffic-light table used for?", opts: ["Showing each study's sample size", "Visually displaying bias risk judgments across all domains for all included studies", "Calculating pooled effect size", "Drawing funnel plots"], exp: "The traffic-light table uses red, yellow, green blocks to show each study's assessment per domain, giving readers an at-a-glance view of evidence quality." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 4: Newcastle-Ottawa Scale for observational studies (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c3-041", category: 4,
    zh: { q: "Newcastle-Ottawa Scale (NOS) 用於評估什麼類型的研究？", opts: ["隨機對照試驗", "觀察性研究（世代研究和病例對照研究）", "體外實驗", "質性研究"], exp: "NOS 是專為觀察性研究設計的品質評估工具，主要用於世代研究和病例對照研究。RCT 使用 RoB 2。" },
    en: { q: "What type of studies does the Newcastle-Ottawa Scale (NOS) assess?", opts: ["Randomized controlled trials", "Observational studies (cohort and case-control studies)", "In vitro experiments", "Qualitative studies"], exp: "NOS is designed specifically for observational studies, primarily cohort and case-control studies. RCTs use RoB 2." },
    correct: 1
  },
  {
    id: "c3-042", category: 4,
    zh: { q: "NOS 評估品質的三個大類別是什麼？", opts: ["設計、統計、結論", "選擇 (Selection)、可比性 (Comparability)、結局 (Outcome)", "方法、結果、討論", "篩選、萃取、分析"], exp: "NOS 從三個面向評估品質：選擇（研究對象如何被選取）、可比性（是否控制了干擾因子）、結局（如何評估結果）。" },
    en: { q: "What are the three categories NOS uses to assess quality?", opts: ["Design, statistics, conclusions", "Selection, Comparability, Outcome", "Methods, results, discussion", "Screening, extraction, analysis"], exp: "NOS assesses quality from three aspects: Selection (how subjects were selected), Comparability (whether confounders were controlled), and Outcome (how results were assessed)." },
    correct: 1
  },
  {
    id: "c3-043", category: 4,
    zh: { q: "NOS 使用什麼方式評分？", opts: ["百分比評分", "星星評分系統，最高 9 顆星（世代研究）", "A-F 字母等級", "交通燈系統"], exp: "NOS 使用星星系統：選擇最多 4 顆星、可比性最多 2 顆星、結局最多 3 顆星，總計最高 9 顆星。" },
    en: { q: "What scoring system does NOS use?", opts: ["Percentage scores", "A star rating system, maximum 9 stars (for cohort studies)", "A-F letter grades", "Traffic-light system"], exp: "NOS uses stars: Selection up to 4 stars, Comparability up to 2 stars, Outcome up to 3 stars, for a maximum of 9 stars." },
    correct: 1
  },
  {
    id: "c3-044", category: 4,
    zh: { q: "在 NOS 的「可比性」類別中，主要評估什麼？", opts: ["樣本量是否足夠", "研究是否控制了最重要的干擾因子（如年齡、性別或其他關鍵變項）", "追蹤時間是否夠長", "結局評估是否盲法"], exp: "可比性評估研究是否控制了關鍵干擾因子。最多給 2 顆星：一顆給最重要的因子，一顆給其他重要因子。" },
    en: { q: "What does the NOS 'Comparability' category mainly assess?", opts: ["Whether sample size is adequate", "Whether the study controlled for the most important confounders (e.g., age, sex, or other key variables)", "Whether follow-up was long enough", "Whether outcome assessment was blinded"], exp: "Comparability assesses confounder control. Up to 2 stars: one for the most important factor, one for other important factors." },
    correct: 1
  },
  {
    id: "c3-045", category: 4,
    zh: { q: "NOS 的「選擇」類別在世代研究中評估哪些方面？", opts: ["統計分析方法", "暴露組的代表性、非暴露組的選取、暴露的確認方法、研究開始時結局是否尚未發生", "只評估隨機化方法", "只評估盲法"], exp: "選擇類別評估：暴露組是否有代表性、非暴露組是否來自同一族群、暴露如何被確認、以及是否排除了已有結局的個案。" },
    en: { q: "What aspects does the NOS 'Selection' category assess in cohort studies?", opts: ["Statistical methods", "Representativeness of exposed cohort, selection of non-exposed, ascertainment of exposure, outcome not present at start", "Only randomization methods", "Only blinding"], exp: "Selection assesses: representativeness of exposed cohort, whether non-exposed come from the same population, how exposure was ascertained, and whether existing cases were excluded at baseline." },
    correct: 1
  },
  {
    id: "c3-046", category: 4,
    zh: { q: "NOS 通常以幾顆星作為「高品質」和「低品質」的分界？", opts: ["3 顆星", "常用 7 顆星以上為高品質，但沒有統一標準", "一定是 5 顆星", "只有 9 顆星才算高品質"], exp: "沒有統一的截斷值，但許多系統性回顧使用 ≥7 星為高品質。應在方案中預先定義品質分級標準。" },
    en: { q: "How many NOS stars are typically used as the cutoff between 'high quality' and 'low quality'?", opts: ["3 stars", "Often 7+ stars is high quality, but there's no universal standard", "Must be 5 stars", "Only 9 stars counts as high quality"], exp: "No universal cutoff exists, but many reviews use ≥7 stars as high quality. Pre-define quality thresholds in your protocol." },
    correct: 1
  },
  {
    id: "c3-047", category: 4,
    zh: { q: "NOS 和 RoB 2 的主要差異是什麼？", opts: ["它們完全一樣", "NOS 用於觀察性研究（星星系統），RoB 2 用於 RCT（交通燈系統）", "NOS 用於 RCT", "RoB 2 用於觀察性研究"], exp: "兩者是針對不同研究設計的品質評估工具。NOS 評估觀察性研究（用星星），RoB 2 評估 RCT（用交通燈）。" },
    en: { q: "What is the key difference between NOS and RoB 2?", opts: ["They are identical", "NOS is for observational studies (star system), RoB 2 is for RCTs (traffic-light system)", "NOS is for RCTs", "RoB 2 is for observational studies"], exp: "They assess different study designs. NOS evaluates observational studies (stars), RoB 2 evaluates RCTs (traffic lights)." },
    correct: 1
  },
  {
    id: "c3-048", category: 4,
    zh: { q: "在 NOS 的「結局」類別中，「追蹤時間是否夠長」為什麼重要？", opts: ["更長的追蹤總是更好", "因為太短的追蹤可能無法偵測到結局事件，低估了真實風險", "追蹤時間不影響結果", "只對罕見疾病重要"], exp: "如果研究追蹤時間太短，某些結局可能尚未發生，導致低估真實的事件率。例如研究癌症存活率需要足夠長的追蹤期。" },
    en: { q: "In NOS's 'Outcome' category, why does 'adequate follow-up duration' matter?", opts: ["Longer follow-up is always better", "Too-short follow-up may miss outcome events, underestimating true risk", "Follow-up duration doesn't affect results", "Only matters for rare diseases"], exp: "If follow-up is too short, some outcomes may not yet have occurred, underestimating true event rates. Cancer survival studies, for example, need sufficiently long follow-up." },
    correct: 1
  },
  {
    id: "c3-049", category: 4,
    zh: { q: "NOS 的一個已知限制是什麼？", opts: ["它太複雜無法使用", "評分者之間的一致性（inter-rater reliability）可能不高", "它只能用於英文文獻", "它已經被淘汰了"], exp: "研究顯示 NOS 的評分者間一致性有待改善。為此應詳細定義各項目的評分標準，並使用多人評估。" },
    en: { q: "What is a known limitation of the NOS?", opts: ["It's too complex to use", "Inter-rater reliability can be moderate to low", "It only works for English studies", "It has been retired"], exp: "Studies show NOS inter-rater reliability needs improvement. Detailed definitions for scoring items and multiple assessors help mitigate this." },
    correct: 1
  },
  {
    id: "c3-050", category: 4,
    zh: { q: "如果你的統合分析同時包含 RCT 和觀察性研究，你應該怎麼評估品質？", opts: ["只用一種工具評估所有研究", "對 RCT 使用 RoB 2，對觀察性研究使用 NOS（或其他適當工具）", "不需要評估品質", "只評估樣本量最大的研究"], exp: "不同研究設計使用不同評估工具。RCT 用 RoB 2、觀察性研究用 NOS 或 ROBINS-I。在方法中說明每類研究的評估工具。" },
    en: { q: "If your meta-analysis includes both RCTs and observational studies, how should you assess quality?", opts: ["Use one tool for all studies", "Use RoB 2 for RCTs and NOS (or other appropriate tool) for observational studies", "No quality assessment needed", "Only assess the largest study"], exp: "Different study designs require different tools. RCTs use RoB 2, observational studies use NOS or ROBINS-I. Specify the tool for each study type in your methods." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 5: Dual extraction, disagreement resolution, error prevention (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c3-051", category: 5,
    zh: { q: "為什麼建議至少由兩人獨立進行數據萃取？", opts: ["一個人太累", "為了減少錯誤和偏差——兩人各自萃取後比對可以發現差異", "兩人萃取更快", "只有 Cochrane 要求這樣做"], exp: "單人萃取的錯誤率可能很高。兩人獨立萃取後比對，可以發現抄錯數字、遺漏數據等錯誤，大幅提高準確性。" },
    en: { q: "Why is it recommended to have at least two people independently extract data?", opts: ["One person gets tired", "To reduce errors and bias — comparing two independent extractions reveals discrepancies", "Two people are faster", "Only Cochrane requires this"], exp: "Single-extractor error rates can be high. Comparing two independent extractions catches transposed numbers, missed data, and other errors, greatly improving accuracy." },
    correct: 1
  },
  {
    id: "c3-052", category: 5,
    zh: { q: "當兩位萃取者對某個數據有分歧時，最佳的解決方式是什麼？", opts: ["由較資深的人說了算", "討論後取兩人結果的平均值", "先各自回去重新檢查原文，再討論；如仍無法解決，請第三人仲裁", "丟銅板決定"], exp: "解決分歧的標準流程：先各自重新核對原文，再面對面討論。如果仍無法達成共識，由第三位獨立審查者做出最終判斷。" },
    en: { q: "When two extractors disagree on a data point, what is the best resolution method?", opts: ["The senior person decides", "Average the two results", "Each re-checks the source independently, then discusses; if unresolved, a third person arbitrates", "Flip a coin"], exp: "Standard process: each independently re-checks the original paper, then discusses face-to-face. If consensus is impossible, a third independent reviewer makes the final judgment." },
    correct: 2
  },
  {
    id: "c3-053", category: 5,
    zh: { q: "「萃取者間一致性」(inter-rater agreement) 常用什麼指標來衡量？", opts: ["p 值", "Cohen's kappa 值", "I² 統計量", "勝算比"], exp: "Kappa 值衡量兩位萃取者之間超越機率的一致程度。一般 kappa > 0.80 表示良好一致性，> 0.60 為中等一致性。" },
    en: { q: "What metric is commonly used to measure 'inter-rater agreement' in extraction?", opts: ["p-value", "Cohen's kappa", "I² statistic", "Odds ratio"], exp: "Kappa measures agreement beyond chance between two extractors. Generally, kappa > 0.80 indicates good agreement; > 0.60 is moderate." },
    correct: 1
  },
  {
    id: "c3-054", category: 5,
    zh: { q: "以下哪種做法可以減少萃取錯誤？", opts: ["加快萃取速度", "使用預設的萃取表格和下拉選單，減少自由文字輸入", "只看摘要不看全文", "只由一人萃取以保持一致性"], exp: "結構化表格和下拉選單減少了輸入錯誤。自由文字容易出現拼寫和格式不一致。" },
    en: { q: "Which practice can reduce extraction errors?", opts: ["Speed up extraction", "Use pre-designed forms with dropdown menus to minimize free-text entry", "Only read abstracts, not full text", "Have only one extractor for consistency"], exp: "Structured forms with dropdowns reduce input errors. Free text is prone to spelling errors and format inconsistencies." },
    correct: 1
  },
  {
    id: "c3-055", category: 5,
    zh: { q: "如果資源有限，只能由一人進行完整萃取，有什麼替代方案？", opts: ["不需要品質控制", "由第二人核查一定比例的萃取結果（如 20%），如果錯誤率低則繼續", "只萃取一半的研究", "只萃取摘要中的數據"], exp: "完整雙人萃取是金標準，但資源有限時，第二人至少核查一部分萃取結果。如果發現錯誤率高，需要擴大核查範圍。" },
    en: { q: "If resources are limited and only one person can do full extraction, what's an alternative?", opts: ["No quality control needed", "Have a second person verify a subset (e.g., 20%) of extractions; if error rate is low, continue", "Only extract half the studies", "Only extract data from abstracts"], exp: "Full dual extraction is the gold standard, but with limited resources, a second person should verify a subset. If error rates are high, expand verification scope." },
    correct: 1
  },
  {
    id: "c3-056", category: 5,
    zh: { q: "在偏倚風險評估（如 RoB 2）中，雙人獨立評估的重要性是什麼？", opts: ["不需要雙人評估", "品質評估涉及主觀判斷，雙人獨立評估可以減少個人偏見的影響", "兩人一起評估比獨立更好", "只有萃取數字時才需要雙人"], exp: "偏倚風險評估比數據萃取更具主觀性。雙人獨立評估後比對，可以減少個人對研究品質的偏頗判斷。" },
    en: { q: "Why is independent dual assessment important for risk of bias (e.g., RoB 2)?", opts: ["Dual assessment is unnecessary", "Quality assessment involves subjective judgment; dual independent assessment reduces individual bias", "Assessing together is better than independently", "Dual assessment is only for numeric data"], exp: "Risk of bias assessment is more subjective than data extraction. Independent dual assessment followed by comparison reduces biased quality judgments." },
    correct: 1
  },
  {
    id: "c3-057", category: 5,
    zh: { q: "記錄分歧的解決過程有什麼好處？", opts: ["只是浪費時間", "可以增加研究的透明度和可重複性，並幫助識別系統性問題", "不需要記錄", "只需記錄最終決定"], exp: "記錄分歧的性質和解決過程有助於透明度。如果某類分歧反覆出現，可能需要修改萃取表格或重新定義標準。" },
    en: { q: "What is the benefit of documenting the disagreement resolution process?", opts: ["Just a waste of time", "Increases transparency and reproducibility, and helps identify systematic issues", "No documentation needed", "Only final decisions need recording"], exp: "Documenting disagreement nature and resolution aids transparency. Recurring disagreements may indicate need to revise forms or redefine criteria." },
    correct: 1
  },
  {
    id: "c3-058", category: 5,
    zh: { q: "萃取試行 (pilot extraction) 通常需要多少篇文獻？", opts: ["全部文獻都要試行", "通常 2-5 篇有代表性的文獻", "只需 1 篇", "不需要試行"], exp: "2-5 篇涵蓋不同研究設計或報告格式的代表性文獻。試行後討論分歧、修改表格、統一標準，再進行正式萃取。" },
    en: { q: "How many studies are typically needed for pilot extraction?", opts: ["All studies need piloting", "Usually 2-5 representative studies", "Just 1 study", "Piloting is unnecessary"], exp: "2-5 representative studies covering different designs or reporting formats. After piloting, discuss disagreements, revise forms, standardize criteria, then proceed with formal extraction." },
    correct: 1
  },
  {
    id: "c3-059", category: 5,
    zh: { q: "使用電子萃取工具（如 Covidence、RevMan）比紙本表格有什麼優勢？", opts: ["沒有優勢", "可以自動比對兩位萃取者的結果、追蹤分歧、匯出數據供分析", "電子工具更容易出錯", "只適合大型團隊"], exp: "電子工具能自動高亮差異、追蹤分歧解決過程、直接匯出到統合分析軟體，大幅提高效率和準確性。" },
    en: { q: "What advantage do electronic extraction tools (e.g., Covidence, RevMan) have over paper forms?", opts: ["No advantage", "Automatic comparison of two extractors' results, disagreement tracking, and data export for analysis", "Electronic tools are more error-prone", "Only suitable for large teams"], exp: "Electronic tools auto-highlight differences, track resolution processes, and export directly to meta-analysis software, greatly improving efficiency and accuracy." },
    correct: 1
  },
  {
    id: "c3-060", category: 5,
    zh: { q: "為什麼萃取者在萃取數據和評估品質時不應該相互討論？", opts: ["討論會讓過程更慢", "因為獨立性是減少偏差的關鍵——先獨立完成再比對，才能真正發現分歧", "討論不影響結果", "只有初學者才需要獨立"], exp: "如果兩人在萃取過程中相互討論，就失去了獨立性。一個人的錯誤可能影響另一個人。先各自獨立萃取，再比對，才有意義。" },
    en: { q: "Why should extractors NOT discuss with each other during extraction and quality assessment?", opts: ["Discussion slows the process", "Independence is key to reducing bias — complete independently first, then compare to truly identify disagreements", "Discussion doesn't affect results", "Only beginners need independence"], exp: "If extractors discuss during the process, independence is lost. One person's errors may influence the other. Independent extraction followed by comparison is essential." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 6: Sensitivity analysis and handling problematic studies (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c3-061", category: 6,
    zh: { q: "什麼是敏感性分析 (sensitivity analysis)？", opts: ["測試患者對藥物的敏感程度", "改變分析中的某些假設或條件，看主要結論是否改變", "只分析統計顯著的研究", "計算 I² 值"], exp: "敏感性分析透過改變條件（如排除高風險研究、改變效應量等）來測試結果的穩健性。如果結論不變，代表結果穩健。" },
    en: { q: "What is a sensitivity analysis?", opts: ["Testing patients' drug sensitivity", "Changing certain assumptions or conditions in the analysis to see if the main conclusion changes", "Only analyzing statistically significant studies", "Calculating I²"], exp: "Sensitivity analysis tests robustness by changing conditions (excluding high-risk studies, changing effect measures, etc.). If conclusions hold, results are robust." },
    correct: 1
  },
  {
    id: "c3-062", category: 6,
    zh: { q: "你的統合分析包含 8 項研究，其中 1 項被評為「高偏倚風險」。你應該怎麼做？", opts: ["自動排除該研究", "保留該研究在主要分析中，但進行排除該研究的敏感性分析", "忽略品質評估結果", "只包含該研究如果它支持你的假說"], exp: "不應自動排除高風險研究，而是在主要分析中包含所有研究，然後做敏感性分析排除高風險研究，比較結果是否改變。" },
    en: { q: "Your meta-analysis includes 8 studies, 1 rated 'high risk of bias.' What should you do?", opts: ["Automatically exclude it", "Keep it in the main analysis but perform a sensitivity analysis excluding it", "Ignore the quality assessment", "Include it only if it supports your hypothesis"], exp: "Don't auto-exclude high-risk studies. Include all in the main analysis, then perform sensitivity analysis excluding high-risk studies to compare whether results change." },
    correct: 1
  },
  {
    id: "c3-063", category: 6,
    zh: { q: "如果排除一項高偏倚風險的研究後，合併效應量從顯著變為不顯著，這意味著什麼？", opts: ["原始結果是正確的", "結果對該研究「敏感」——主要結論可能不穩健，需要謹慎解讀", "排除的研究一定是錯的", "應該排除更多研究"], exp: "這表示該研究對整體結果有過大影響。結論的穩健性存疑，應在討論中明確指出此限制。" },
    en: { q: "If excluding a high-risk study changes the pooled effect from significant to non-significant, what does this mean?", opts: ["The original result was correct", "The result is 'sensitive' to that study — the main conclusion may not be robust and needs cautious interpretation", "The excluded study must be wrong", "More studies should be excluded"], exp: "This means that study had outsized influence on the overall result. Robustness is questionable; clearly state this limitation in the discussion." },
    correct: 1
  },
  {
    id: "c3-064", category: 6,
    zh: { q: "除了排除高風險研究外，還有哪些常見的敏感性分析？", opts: ["沒有其他類型", "改變效應量（OR vs RR）、使用不同統計模型（固定 vs 隨機）、排除小型研究等", "只有排除高風險研究才叫敏感性分析", "改變研究的語言"], exp: "常見的敏感性分析包括：更換效應量指標、更換統計模型、排除特定研究、使用不同的轉換公式、改變納入標準等。" },
    en: { q: "Besides excluding high-risk studies, what other sensitivity analyses are common?", opts: ["No other types exist", "Changing effect measures (OR vs RR), different statistical models (fixed vs random), excluding small studies, etc.", "Only excluding high-risk studies counts", "Changing the language of studies"], exp: "Common sensitivity analyses include: switching effect measures, switching statistical models, excluding specific studies, using different conversion formulas, modifying inclusion criteria." },
    correct: 1
  },
  {
    id: "c3-065", category: 6,
    zh: { q: "「leave-one-out 分析」是什麼？", opts: ["只留一篇研究進行分析", "逐一移除每項研究，觀察合併結果如何變化", "移除所有研究重新分析", "一種搜尋方法"], exp: "Leave-one-out 分析逐一排除每項研究並重新計算合併效應量。如果移除某項研究後結果大幅改變，該研究對結論有重大影響。" },
    en: { q: "What is a 'leave-one-out analysis'?", opts: ["Analyzing with only one study", "Removing each study one at a time and observing how the pooled result changes", "Removing all studies and re-analyzing", "A type of search method"], exp: "Leave-one-out analysis sequentially excludes each study and recalculates the pooled effect. If removing one study dramatically changes results, it has disproportionate influence." },
    correct: 1
  },
  {
    id: "c3-066", category: 6,
    zh: { q: "檢查食材的新鮮度（偏倚風險評估）就像烹飪中的什麼？", opts: ["直接把食材丟進鍋裡", "在烹飪前檢查每種食材是否新鮮——過期的食材會毀了整道菜", "不需要檢查", "只嚐最後的味道"], exp: "就像不新鮮的食材會毀了一道菜，高偏倚風險的研究可能扭曲統合分析的結果。在「烹飪」前檢查品質至關重要。" },
    en: { q: "Checking ingredient freshness (risk of bias assessment) is like which cooking step?", opts: ["Tossing ingredients straight into the pot", "Checking each ingredient's freshness before cooking — spoiled ingredients ruin the whole dish", "No checking needed", "Only tasting the final dish"], exp: "Just as spoiled ingredients ruin a dish, high-risk studies can distort meta-analysis results. Checking quality before 'cooking' is essential." },
    correct: 1
  },
  {
    id: "c3-067", category: 6,
    zh: { q: "一項研究的結果是異常值（outlier），效應量遠大於其他研究。你應該怎麼做？", opts: ["自動排除", "調查原因（可能是研究人口、介入、方法不同），並進行包含和排除該研究的分析", "假設它是正確的", "增加它的權重"], exp: "異常值不應自動排除。先調查原因（不同人群？不同劑量？方法學問題？），然後在主要和敏感性分析中分別呈現結果。" },
    en: { q: "A study's result is an outlier with a much larger effect than others. What should you do?", opts: ["Automatically exclude it", "Investigate the reason (population, intervention, or methodology differences) and analyze with and without it", "Assume it is correct", "Increase its weight"], exp: "Outliers shouldn't be auto-excluded. Investigate causes (different population? dosage? methods?), then present results from main and sensitivity analyses separately." },
    correct: 1
  },
  {
    id: "c3-068", category: 6,
    zh: { q: "為什麼不建議只根據偏倚風險自動排除研究？", opts: ["因為品質評估不重要", "因為排除研究減少了可用證據、可能引入選擇偏差，且品質判斷本身有主觀性", "高風險研究的數據總是正確的", "排除研究會讓分析看起來更差"], exp: "自動排除可能減少統計效力、引入新的選擇偏差。更好的做法是包含所有研究，用敏感性分析探索品質對結果的影響。" },
    en: { q: "Why is it NOT recommended to automatically exclude studies based on risk of bias alone?", opts: ["Quality assessment doesn't matter", "Exclusion reduces evidence, may introduce selection bias, and quality judgments are subjective", "High-risk studies always have correct data", "Exclusion makes analysis look worse"], exp: "Auto-exclusion may reduce power, introduce selection bias, and quality judgments are inherently subjective. Better to include all and use sensitivity analysis to explore impact." },
    correct: 1
  },
  {
    id: "c3-069", category: 6,
    zh: { q: "交通燈彙總表（traffic-light summary table）如何幫助讀者？", opts: ["只是裝飾", "讀者可以一目了然地看出哪些研究品質高、哪些有問題，並理解證據的整體可信度", "用來計算合併效應量", "替代了統合分析"], exp: "交通燈表格用顏色編碼（紅/黃/綠）清楚呈現每項研究在每個偏倚領域的評估，幫助讀者快速掌握證據品質全貌。" },
    en: { q: "How does a traffic-light summary table help readers?", opts: ["It's just decoration", "Readers can instantly see which studies are high quality and which are problematic, understanding overall evidence credibility", "Used to calculate pooled effects", "Replaces the meta-analysis"], exp: "The traffic-light table uses color coding (red/yellow/green) to clearly show each study's assessment per bias domain, helping readers quickly grasp overall evidence quality." },
    correct: 1
  },
  {
    id: "c3-070", category: 6,
    zh: { q: "做完數據萃取和偏倚風險評估後，應該記錄哪些資訊？", opts: ["只記錄最終數字", "萃取表格、品質評估表、分歧記錄和解決方式——一切都要透明可追溯", "不需要額外記錄", "只需要記錄排除的研究"], exp: "完整的記錄包括：所有萃取數據、品質評估判斷及依據、所有分歧及其解決過程。這是確保透明度和可重複性的基礎。" },
    en: { q: "After completing data extraction and risk of bias assessment, what should be documented?", opts: ["Only the final numbers", "Extraction forms, quality assessment tables, disagreement records, and resolution methods — everything must be transparent and traceable", "No additional records needed", "Only excluded studies need recording"], exp: "Complete documentation includes: all extracted data, quality assessment judgments and reasoning, all disagreements and their resolution. This ensures transparency and reproducibility." },
    correct: 1
  },
];

