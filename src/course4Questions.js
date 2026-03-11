// ============================================================
// COURSE 4: Effect Sizes & Forest Plots — 70 Questions (10 per category)
// ============================================================
// 7 categories:
//   0 = What effect sizes are and why they matter
//   1 = Odds Ratio and Risk Ratio (calculation, interpretation)
//   2 = Mean Difference and SMD (when to use, interpretation)
//   3 = Weighting and inverse-variance method
//   4 = Fixed-effect vs. random-effects models
//   5 = Forest plot anatomy and reading
//   6 = Common mistakes (confusing OR with RR, misreading CIs, etc.)
// ============================================================

export const course4Categories = {
  zh: ["效應量的意義", "勝算比與風險比", "均差與標準化均差", "加權與反變異數法", "固定效應 vs 隨機效應", "森林圖解剖與判讀", "常見錯誤"],
  en: ["What Effect Sizes Are", "Odds Ratio & Risk Ratio", "Mean Difference & SMD", "Weighting & Inverse-Variance", "Fixed vs Random Effects", "Forest Plot Anatomy & Reading", "Common Mistakes"],
};

export const course4Questions = [

  // ════════════════════════════════════════
  // Category 0: What effect sizes are and why they matter (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c4-001", category: 0, type: "mcq",
    zh: { q: "效應量 (effect size) 最好的定義是什麼？", opts: ["p 值的另一種說法", "一個量化研究發現之大小和方向的數值", "只有統合分析才用的統計量", "研究的樣本量"], exp: "效應量是一個數值，告訴我們介入措施的效果有多大、方向如何——不只是「有沒有效」，而是「有多有效」。" },
    en: { q: "What is the best definition of an effect size?", opts: ["Another name for p-value", "A numerical value that quantifies the magnitude and direction of a finding", "A statistic only used in meta-analysis", "The sample size of a study"], exp: "An effect size is a number that tells us how large and in what direction an intervention's effect is — not just 'does it work?' but 'how much does it work?'" },
    correct: 1
  },
  {
    id: "c4-002", category: 0, type: "mcq",
    zh: { q: "為什麼光看 p 值不夠，還需要效應量？", opts: ["p 值已經包含效應量的資訊", "p 值只告訴你結果是否達統計顯著，但不告訴你效果有多大", "效應量和 p 值完全相同", "p 值更重要"], exp: "p 值只反映「是否有差異」的概率，不反映差異的大小。一個很小的效果在大樣本中也能達到統計顯著。" },
    en: { q: "Why isn't the p-value alone sufficient — why do we need effect sizes?", opts: ["p-value already contains effect size information", "p-value only tells if results are statistically significant, not how large the effect is", "Effect size and p-value are the same thing", "p-value is more important"], exp: "A p-value only reflects the probability of observing such results by chance — not how big the effect is. A tiny effect can be 'significant' with a large enough sample." },
    correct: 1
  },
  {
    id: "c4-003", category: 0, type: "mcq",
    zh: { q: "用餐廳評價來比喻，效應量類似什麼？", opts: ["餐廳是否營業中", "1到5星的評分——不只是推薦/不推薦，而是具體幾分", "餐廳的地址", "用餐人數"], exp: "效應量就像星級評分：給你一個具體的「分數」，而不只是好或不好的二元判斷。" },
    en: { q: "Using a restaurant review analogy, what is an effect size most like?", opts: ["Whether the restaurant is open", "A 1-to-5-star rating — not just thumbs up/down, but a specific score", "The restaurant's address", "The number of diners"], exp: "An effect size is like a star rating: it gives you a specific 'score' rather than just a binary good-or-bad judgment." },
    correct: 1
  },
  {
    id: "c4-004", category: 0, type: "mcq",
    zh: { q: "以下哪項不是效應量？", opts: ["勝算比 (OR)", "風險比 (RR)", "p 值", "均差 (MD)"], exp: "p 值是統計顯著性的檢定結果，不是效應量。OR、RR、MD 都是常見的效應量指標。" },
    en: { q: "Which of the following is NOT an effect size?", opts: ["Odds Ratio (OR)", "Risk Ratio (RR)", "p-value", "Mean Difference (MD)"], exp: "The p-value is a significance test result, not an effect size. OR, RR, and MD are all common effect size measures." },
    correct: 2
  },
  {
    id: "c4-005", category: 0, type: "mcq",
    zh: { q: "為什麼在統合分析中需要用效應量來合併研究？", opts: ["因為效應量提供了統一的尺度來量化每個研究的結果", "因為效應量是唯一的統計量", "因為不需要看原始數據", "因為效應量可以取代所有其他統計量"], exp: "不同研究可能用不同方式報告結果。效應量提供了一個標準化的數值，讓我們能在統一尺度上合併和比較。" },
    en: { q: "Why do we need effect sizes to pool studies in a meta-analysis?", opts: ["Because effect sizes provide a common scale to quantify each study's result", "Because effect size is the only statistic that exists", "Because we don't need to look at raw data", "Because effect sizes replace all other statistics"], exp: "Different studies may report results in different ways. Effect sizes provide a standardized value that allows pooling and comparison on a common scale." },
    correct: 0
  },
  {
    id: "c4-006", category: 0, type: "mcq",
    zh: { q: "一個效應量的「方向」告訴我們什麼？", opts: ["研究的品質", "效果是有利於介入組還是對照組", "研究發表的年份", "樣本量的大小"], exp: "效應量的方向（正或負、大於或小於 1）指出哪一組表現較好——介入組還是對照組。" },
    en: { q: "What does the 'direction' of an effect size tell us?", opts: ["The quality of the study", "Whether the effect favors the intervention or control group", "The year the study was published", "The sample size"], exp: "The direction of the effect size (positive/negative, above/below 1) indicates which group performed better — intervention or control." },
    correct: 1
  },
  {
    id: "c4-007", category: 0, type: "mcq",
    zh: { q: "以下哪種情境最適合用效應量來溝通研究發現？", opts: ["只需要知道有沒有統計顯著差異", "想比較不同研究中治療效果的大小", "只想看有幾篇研究", "只需要描述研究設計"], exp: "效應量的價值在於量化效果的大小，特別適合在不同研究間比較治療效果——這正是統合分析的核心。" },
    en: { q: "In which scenario is an effect size most useful for communicating findings?", opts: ["Only need to know if there's a significant difference", "Want to compare the magnitude of treatment effects across different studies", "Only want to count how many studies exist", "Only need to describe study designs"], exp: "The value of effect sizes lies in quantifying how big the effect is — particularly useful for comparing treatment effects across studies, which is the core of meta-analysis." },
    correct: 1
  },
  {
    id: "c4-008", category: 0, type: "mcq",
    zh: { q: "效應量通常會搭配什麼一起報告？", opts: ["只報告數值就好", "信賴區間 (CI)，顯示估計值的精確度", "作者的主觀評論", "只報告 p 值就好"], exp: "效應量搭配信賴區間報告，CI 顯示真實效應可能落在的範圍，反映估計的精確程度。" },
    en: { q: "What is an effect size usually reported alongside?", opts: ["Just the number alone", "A confidence interval (CI), showing the precision of the estimate", "The author's subjective commentary", "Just the p-value alone"], exp: "Effect sizes are reported with confidence intervals. The CI shows the range in which the true effect likely falls, reflecting the precision of the estimate." },
    correct: 1
  },
  {
    id: "c4-009", category: 0, type: "mcq",
    zh: { q: "一個研究的效應量很大但 p 值不顯著，最可能的原因是？", opts: ["效應量計算錯誤", "樣本量太小，導致信賴區間很寬", "效應量和 p 值永遠一致", "該研究一定有偏誤"], exp: "小樣本研究的信賴區間很寬，即使點估計看起來很大，CI 仍可能跨越無效線，導致 p 值不顯著。" },
    en: { q: "A study has a large effect size but non-significant p-value. What is the most likely reason?", opts: ["The effect size was calculated wrong", "Sample size was too small, making the confidence interval very wide", "Effect size and p-value always agree", "The study must have bias"], exp: "With a small sample, the CI is wide. Even if the point estimate looks large, the CI may cross the null, resulting in a non-significant p-value." },
    correct: 1
  },
  {
    id: "c4-010", category: 0, type: "mcq",
    zh: { q: "在統合分析中，每個研究都需要計算出一個效應量及其什麼？", opts: ["p 值和樣本量", "效應量的標準誤 (SE) 或變異數", "研究設計和年份", "作者姓名和期刊名"], exp: "統合分析需要每個研究的效應量和其標準誤（或變異數），以便計算加權平均和信賴區間。" },
    en: { q: "In a meta-analysis, what does each study need in addition to its effect size?", opts: ["p-value and sample size", "The standard error (SE) or variance of the effect size", "Study design and year", "Author name and journal"], exp: "Meta-analysis requires each study's effect size AND its standard error (or variance) to compute weighted averages and confidence intervals." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 1: Odds Ratio and Risk Ratio (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c4-011", category: 1, type: "mcq",
    zh: { q: "勝算比 (Odds Ratio, OR) 適用於什麼類型的結果？", opts: ["連續性結果（如血壓值）", "二分類結果（如事件發生/未發生）", "排序資料", "時間序列資料"], exp: "OR 用於二分類（是/否）結果，比較兩組中事件發生的「勝算」。" },
    en: { q: "What type of outcome is the Odds Ratio (OR) used for?", opts: ["Continuous outcomes (e.g., blood pressure)", "Binary/dichotomous outcomes (e.g., event/no event)", "Ordinal data", "Time-series data"], exp: "OR is used for binary (yes/no) outcomes, comparing the 'odds' of an event between two groups." },
    correct: 1
  },
  {
    id: "c4-012", category: 1, type: "mcq",
    zh: { q: "在 2×2 表格中，介入組有 20 人發生事件、80 人未發生，對照組有 30 人發生、70 人未發生。介入組的勝算 (odds) 是多少？", opts: ["20/100 = 0.20", "20/80 = 0.25", "80/20 = 4.0", "20/30 = 0.67"], exp: "勝算 = 事件數 ÷ 非事件數 = 20/80 = 0.25。注意勝算不是風險（風險是 20/100）。" },
    en: { q: "In a 2×2 table, the intervention group has 20 events and 80 non-events; control has 30 events and 70 non-events. What are the odds in the intervention group?", opts: ["20/100 = 0.20", "20/80 = 0.25", "80/20 = 4.0", "20/30 = 0.67"], exp: "Odds = events ÷ non-events = 20/80 = 0.25. Note that odds are NOT the same as risk (risk would be 20/100)." },
    correct: 1
  },
  {
    id: "c4-013", category: 1, type: "mcq",
    zh: { q: "承上題，該研究的 OR 是多少？", opts: ["(20/80) ÷ (30/70) = 0.58", "(20/100) ÷ (30/100) = 0.67", "(80/20) ÷ (70/30) = 1.71", "20 × 70 ÷ (80 × 30) = 0.58"], exp: "OR = 介入組勝算 ÷ 對照組勝算 = (20/80) ÷ (30/70) = 0.25/0.4286 ≈ 0.58。也可用交叉相乘：(20×70)/(80×30) ≈ 0.58。" },
    en: { q: "Continuing from above, what is the OR?", opts: ["(20/80) ÷ (30/70) = 0.58", "(20/100) ÷ (30/100) = 0.67", "(80/20) ÷ (70/30) = 1.71", "20 × 70 ÷ (80 × 30) = 0.58"], exp: "OR = intervention odds ÷ control odds = (20/80) ÷ (30/70) = 0.25/0.4286 ≈ 0.58. Cross-multiplication also works: (20×70)/(80×30) ≈ 0.58." },
    correct: 0
  },
  {
    id: "c4-014", category: 1, type: "mcq",
    zh: { q: "風險比 (Risk Ratio, RR) 的計算方式是？", opts: ["介入組勝算 ÷ 對照組勝算", "介入組風險 ÷ 對照組風險（即事件數/總人數的比值）", "兩組風險的差值", "兩組勝算的乘積"], exp: "RR = 介入組風險(事件數/總人數) ÷ 對照組風險(事件數/總人數)。" },
    en: { q: "How is the Risk Ratio (RR) calculated?", opts: ["Intervention odds ÷ control odds", "Intervention risk ÷ control risk (i.e., events/total in each group)", "Difference between group risks", "Product of the two odds"], exp: "RR = intervention risk (events/total) ÷ control risk (events/total)." },
    correct: 1
  },
  {
    id: "c4-015", category: 1, type: "mcq",
    zh: { q: "OR = 1 代表什麼意思？", opts: ["介入組的勝算是對照組的兩倍", "兩組之間沒有差異", "介入組的風險是 100%", "結果無法解釋"], exp: "OR = 1 表示兩組的勝算相等，即介入措施與對照之間沒有差異。這就是「無效線」的位置。" },
    en: { q: "What does OR = 1 mean?", opts: ["The intervention odds are twice the control", "There is no difference between the two groups", "The intervention risk is 100%", "The result cannot be interpreted"], exp: "OR = 1 means the odds are equal in both groups — i.e., no difference between intervention and control. This is the 'line of no effect.'" },
    correct: 1
  },
  {
    id: "c4-016", category: 1, type: "mcq",
    zh: { q: "如果 RR = 0.70 (95% CI: 0.55–0.89)，如何解釋？", opts: ["介入組的風險增加了 30%", "介入組的風險比對照組低 30%，且統計顯著（CI 不包含 1）", "結果不顯著", "介入組比對照組差"], exp: "RR = 0.70 表示介入組風險是對照組的 70%（降低 30%）。CI 完全在 1 以下，表示顯著有利於介入組。" },
    en: { q: "If RR = 0.70 (95% CI: 0.55–0.89), how should it be interpreted?", opts: ["Intervention risk increased by 30%", "Intervention risk is 30% lower than control, and statistically significant (CI excludes 1)", "The result is not significant", "Intervention is worse than control"], exp: "RR = 0.70 means the intervention group's risk is 70% of the control's (30% reduction). The CI is entirely below 1, indicating a significant benefit." },
    correct: 1
  },
  {
    id: "c4-017", category: 1, type: "mcq",
    zh: { q: "OR 和 RR 在什麼情況下數值會非常接近？", opts: ["事件發生率很高時", "事件發生率很低時（稀少事件）", "樣本量很大時", "研究品質很好時"], exp: "當事件很稀少（<10%）時，OR 和 RR 數值非常接近。隨著事件率升高，OR 會比 RR 更偏離 1。" },
    en: { q: "When do OR and RR have very similar values?", opts: ["When event rates are high", "When event rates are very low (rare events)", "When sample sizes are large", "When study quality is high"], exp: "When events are rare (<10%), OR and RR are nearly identical. As event rates increase, OR becomes more extreme than RR." },
    correct: 1
  },
  {
    id: "c4-018", category: 1, type: "mcq",
    zh: { q: "在 case-control（病例對照）研究中，應該用 OR 還是 RR？", opts: ["只能用 RR", "只能用 OR，因為無法直接計算風險", "兩者都可以", "都不能用"], exp: "在病例對照研究中，研究者是先選定「有病」和「無病」的人，無法直接計算發生率（風險），因此只能用 OR。" },
    en: { q: "In a case-control study, should you use OR or RR?", opts: ["Only RR", "Only OR, because you cannot directly calculate risk", "Either one", "Neither"], exp: "In case-control studies, participants are selected based on disease status, so you cannot directly calculate incidence (risk) — only OR can be used." },
    correct: 1
  },
  {
    id: "c4-019", category: 1, type: "mcq",
    zh: { q: "OR < 1 的 95% CI 為 (0.45, 1.12)，如何判斷？", opts: ["介入明顯有效", "CI 跨過 1，因此差異不具統計顯著性", "介入明顯有害", "需要更多資訊"], exp: "CI 包含 1（從 0.45 到 1.12），跨越了「無效線」。這表示我們不能排除兩組沒有差異的可能，結果不顯著。" },
    en: { q: "An OR < 1 has 95% CI of (0.45, 1.12). What is the conclusion?", opts: ["The intervention clearly works", "The CI crosses 1, so the difference is not statistically significant", "The intervention is clearly harmful", "More information needed"], exp: "The CI includes 1 (from 0.45 to 1.12), crossing the 'line of no effect.' We cannot rule out no difference, so the result is not significant." },
    correct: 1
  },
  {
    id: "c4-020", category: 1, type: "mcq",
    zh: { q: "以下哪個藥學情境最適合使用 OR？", opts: ["比較兩組的平均血壓下降值", "比較新藥 vs 安慰劑的住院率（二分類）", "比較兩組的平均住院天數", "比較三組的 HbA1c 趨勢"], exp: "住院率是二分類結果（住院 / 未住院），適合使用 OR 或 RR。平均值比較則用均差。" },
    en: { q: "Which pharmacy scenario is most appropriate for using OR?", opts: ["Comparing mean blood pressure reduction between groups", "Comparing hospitalization rates (binary) of new drug vs placebo", "Comparing mean length of hospital stay", "Comparing HbA1c trends across three groups"], exp: "Hospitalization rate is binary (hospitalized/not), making it suitable for OR or RR. Mean values use mean difference instead." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 2: Mean Difference and SMD (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c4-021", category: 2, type: "mcq",
    zh: { q: "均差 (Mean Difference, MD) 適用於什麼情況？", opts: ["所有研究都用二分類結果", "所有研究都用相同量表測量連續性結果", "不同研究用不同量表", "只有觀察性研究"], exp: "MD 適用於所有研究使用相同量表（如所有研究都量 HbA1c、都用 mmHg 量血壓）的連續性結果。" },
    en: { q: "When is Mean Difference (MD) appropriate?", opts: ["All studies use binary outcomes", "All studies measure a continuous outcome on the same scale", "Different studies use different scales", "Only for observational studies"], exp: "MD is appropriate when all studies measure a continuous outcome using the same scale (e.g., all measure HbA1c, all use mmHg for blood pressure)." },
    correct: 1
  },
  {
    id: "c4-022", category: 2, type: "mcq",
    zh: { q: "介入組的平均血壓下降 12 mmHg (SD 5)，對照組下降 7 mmHg (SD 4)。MD 是多少？", opts: ["12 − 7 = 5 mmHg", "12 / 7 = 1.71", "(12 − 7) / 5 = 1.0", "7 − 12 = −5 mmHg"], exp: "MD = 介入組均值 − 對照組均值 = 12 − 7 = 5 mmHg。就是兩組平均值的差。" },
    en: { q: "Intervention group: mean BP reduction 12 mmHg (SD 5). Control: 7 mmHg (SD 4). What is the MD?", opts: ["12 − 7 = 5 mmHg", "12 / 7 = 1.71", "(12 − 7) / 5 = 1.0", "7 − 12 = −5 mmHg"], exp: "MD = intervention mean − control mean = 12 − 7 = 5 mmHg. It's simply the difference between group means." },
    correct: 0
  },
  {
    id: "c4-023", category: 2, type: "mcq",
    zh: { q: "什麼是標準化均差 (SMD / Cohen's d)？", opts: ["兩組均值差除以共同標準差", "兩組均值的和", "兩組標準差的比值", "均值差除以樣本量"], exp: "SMD = (介入組均值 − 對照組均值) ÷ 共同 SD。它把差異「標準化」成 SD 的倍數，讓不同量表的研究可以比較。" },
    en: { q: "What is the Standardized Mean Difference (SMD / Cohen's d)?", opts: ["The difference in group means divided by the pooled standard deviation", "The sum of group means", "The ratio of standard deviations", "Mean difference divided by sample size"], exp: "SMD = (intervention mean − control mean) ÷ pooled SD. It 'standardizes' the difference into SD units, making studies on different scales comparable." },
    correct: 0
  },
  {
    id: "c4-024", category: 2, type: "mcq",
    zh: { q: "什麼時候必須使用 SMD 而不是 MD？", opts: ["所有研究都使用相同量表", "不同研究使用不同量表測量同一個概念（如疼痛用 VAS 和 NRS）", "結果是二分類的", "只有一個研究"], exp: "當研究使用不同量表（如 VAS 0-100 vs NRS 0-10）測量相同概念時，MD 無法直接比較，必須用 SMD 標準化。" },
    en: { q: "When must you use SMD instead of MD?", opts: ["All studies use the same scale", "Different studies use different scales to measure the same concept (e.g., pain with VAS and NRS)", "The outcome is binary", "There's only one study"], exp: "When studies use different scales (e.g., VAS 0-100 vs NRS 0-10) to measure the same concept, MD cannot be compared directly, so SMD standardizes the comparison." },
    correct: 1
  },
  {
    id: "c4-025", category: 2, type: "mcq",
    zh: { q: "Cohen's d = 0.5 在慣例上被視為什麼程度的效果？", opts: ["微小效果", "中等效果", "大效果", "無效果"], exp: "Cohen 的慣例：d ≈ 0.2 為小效果，d ≈ 0.5 為中等效果，d ≈ 0.8 為大效果。但這些只是經驗法則。" },
    en: { q: "By convention, Cohen's d = 0.5 is considered what size effect?", opts: ["Trivial effect", "Medium effect", "Large effect", "No effect"], exp: "Cohen's conventions: d ≈ 0.2 is small, d ≈ 0.5 is medium, d ≈ 0.8 is large. These are rules of thumb, not absolute cutoffs." },
    correct: 1
  },
  {
    id: "c4-026", category: 2, type: "mcq",
    zh: { q: "MD = 0 或 SMD = 0 代表什麼？", opts: ["介入組更好", "對照組更好", "兩組之間沒有差異", "數據有錯誤"], exp: "MD 或 SMD = 0 表示兩組的平均值相同，沒有差異。這就是連續性結果的「無效線」位置（對比 OR/RR 的無效線 = 1）。" },
    en: { q: "What does MD = 0 or SMD = 0 mean?", opts: ["Intervention is better", "Control is better", "No difference between groups", "Data error"], exp: "MD or SMD = 0 means the group means are equal — no difference. This is the 'line of no effect' for continuous outcomes (vs. 1 for OR/RR)." },
    correct: 2
  },
  {
    id: "c4-027", category: 2, type: "mcq",
    zh: { q: "計算 MD 時，需要從每個研究萃取哪些數據？", opts: ["只需要 p 值", "每組的均值、標準差 (SD) 和樣本量 (n)", "只需要中位數", "只需要效應量"], exp: "MD 需要每組的均值、SD 和 n。有了這些，可以計算 MD 及其標準誤，用於統合分析。" },
    en: { q: "What data must be extracted from each study to compute MD?", opts: ["Only the p-value", "Mean, standard deviation (SD), and sample size (n) for each group", "Only the median", "Only the effect size"], exp: "MD requires the mean, SD, and n for each group. With these, you can calculate the MD and its standard error for meta-analysis." },
    correct: 1
  },
  {
    id: "c4-028", category: 2, type: "mcq",
    zh: { q: "SMD 的一個主要缺點是什麼？", opts: ["不能用於統合分析", "失去原始測量單位，較難有臨床直覺", "計算太簡單不夠精確", "只能用於二分類結果"], exp: "SMD 以 SD 為單位而非原始單位（如 mmHg），因此臨床上較難直觀理解 0.3 個 SD 到底代表多大的差異。" },
    en: { q: "What is a major drawback of SMD?", opts: ["Cannot be used in meta-analysis", "Loses the original measurement unit, making clinical intuition harder", "Too simple to be precise", "Only works for binary outcomes"], exp: "SMD is in SD units rather than natural units (e.g., mmHg), making it harder to intuitively understand what a 0.3 SD difference means clinically." },
    correct: 1
  },
  {
    id: "c4-029", category: 2, type: "mcq",
    zh: { q: "五個研究比較新藥對 HbA1c 的影響，全部用 % 報告 HbA1c。應該用？", opts: ["OR", "MD（因為量表相同）", "SMD（因為量表不同）", "RR"], exp: "所有研究都用相同單位 (%) 報告 HbA1c，所以用 MD（均差）即可，不需要 SMD。" },
    en: { q: "Five studies compare a new drug's effect on HbA1c, all reporting HbA1c in %. Which measure?", opts: ["OR", "MD (same scale)", "SMD (different scales)", "RR"], exp: "All studies use the same unit (%) for HbA1c, so MD (mean difference) is appropriate — no need for SMD." },
    correct: 1
  },
  {
    id: "c4-030", category: 2, type: "mcq",
    zh: { q: "如果 MD = −1.2% (95% CI: −1.8 to −0.6)，代表什麼？", opts: ["介入組的 HbA1c 平均比對照組高 1.2%", "介入組的 HbA1c 平均比對照組低 1.2%，且統計顯著", "結果不顯著", "對照組更好"], exp: "MD = −1.2% 表示介入組 HbA1c 平均比對照組低 1.2 個百分點。CI 完全在 0 以下，表示顯著。" },
    en: { q: "If MD = −1.2% (95% CI: −1.8 to −0.6), what does it mean?", opts: ["Intervention HbA1c is 1.2% higher than control", "Intervention HbA1c is 1.2% lower than control, and statistically significant", "Not significant", "Control is better"], exp: "MD = −1.2% means intervention group's HbA1c is 1.2 percentage points lower than control. CI entirely below 0 means it's significant." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 3: Weighting and inverse-variance method (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c4-031", category: 3, type: "mcq",
    zh: { q: "在統合分析中，為什麼不能簡單地對所有研究的效應量取平均？", opts: ["因為不同研究有不同的精確度（變異數），應給予不同權重", "因為效應量都一樣", "因為平均值沒有意義", "因為只能看最大的研究"], exp: "大型、精確的研究比小型、不精確的研究提供更可靠的估計。簡單平均會讓小型研究與大型研究擁有相同影響力，不合理。" },
    en: { q: "Why can't we simply average all studies' effect sizes in a meta-analysis?", opts: ["Because different studies have different precision (variance) and should receive different weights", "Because effect sizes are all the same", "Because averages are meaningless", "Because only the largest study matters"], exp: "Larger, more precise studies provide more reliable estimates. Simple averaging gives small and large studies equal influence, which is inappropriate." },
    correct: 0
  },
  {
    id: "c4-032", category: 3, type: "mcq",
    zh: { q: "反變異數加權 (inverse-variance weighting) 的原則是什麼？", opts: ["變異數大的研究權重大", "變異數小（精確度高）的研究獲得更大的權重", "所有研究權重相同", "只看 p 值決定權重"], exp: "權重 = 1/變異數。變異數越小（越精確），權重越大。這讓更精確的研究對合併結果有更大的貢獻。" },
    en: { q: "What is the principle of inverse-variance weighting?", opts: ["Studies with larger variance get more weight", "Studies with smaller variance (higher precision) get more weight", "All studies get equal weight", "Weight is determined by p-value"], exp: "Weight = 1/variance. Smaller variance (more precise) = larger weight. This lets more precise studies contribute more to the pooled result." },
    correct: 1
  },
  {
    id: "c4-033", category: 3, type: "mcq",
    zh: { q: "用民意調查來比喻，反變異數加權像什麼？", opts: ["不管調查人數多少都一樣重要", "你更信任 10,000 人的民調，而不是 10 人的民調", "你只看最新的民調", "你只看結果和自己一樣的民調"], exp: "就像你更信任大規模民調——10,000 人的結果比 10 人的更可靠。反變異數加權的邏輯相同：給更精確的估計更大權重。" },
    en: { q: "Using a poll analogy, inverse-variance weighting is like...?", opts: ["All polls are equally important regardless of size", "Trusting a poll of 10,000 people more than a poll of 10", "Only looking at the latest poll", "Only looking at polls that agree with you"], exp: "Just as you trust a large poll more — 10,000 respondents are more reliable than 10. Inverse-variance weighting follows the same logic: more precise estimates get more weight." },
    correct: 1
  },
  {
    id: "c4-034", category: 3, type: "mcq",
    zh: { q: "在森林圖中，研究的權重如何視覺呈現？", opts: ["線段的長度", "正方形（點估計）的大小", "研究標籤的字體大小", "背景顏色的深淺"], exp: "在森林圖中，每個研究的正方形大小與其權重成正比——正方形越大，代表該研究在合併結果中的影響力越大。" },
    en: { q: "How is a study's weight visually represented in a forest plot?", opts: ["Length of the line", "Size of the square (point estimate)", "Font size of the study label", "Shade of background color"], exp: "In a forest plot, each study's square size is proportional to its weight — a larger square means the study has more influence on the pooled result." },
    correct: 1
  },
  {
    id: "c4-035", category: 3, type: "mcq",
    zh: { q: "研究 A 有 30 名受試者，研究 B 有 3,000 名受試者。在典型情況下，哪個研究的權重更大？", opts: ["研究 A（小型研究更特別）", "研究 B（大型研究的標準誤更小、變異數更小、精確度更高）", "兩者權重相同", "無法判斷"], exp: "研究 B 的大樣本量使其標準誤更小、變異數更小，因此在反變異數加權下獲得更大的權重。" },
    en: { q: "Study A has 30 participants; Study B has 3,000. Which typically gets more weight?", opts: ["Study A (small studies are special)", "Study B (larger sample = smaller SE = smaller variance = higher precision)", "Equal weight", "Cannot determine"], exp: "Study B's larger sample gives it a smaller standard error and variance, so it gets more weight under inverse-variance weighting." },
    correct: 1
  },
  {
    id: "c4-036", category: 3, type: "mcq",
    zh: { q: "權重 (weight) 的公式 w = 1/V 中，V 代表什麼？", opts: ["效應量的數值", "效應量估計的變異數 (variance)", "研究品質分數", "研究發表年份"], exp: "V 是效應量估計的變異數。變異數越小（SE 越小），權重越大——精確度越高的研究「投票權」越大。" },
    en: { q: "In the weight formula w = 1/V, what does V represent?", opts: ["The value of the effect size", "The variance of the effect size estimate", "A study quality score", "The publication year"], exp: "V is the variance of the effect size estimate. Smaller variance (smaller SE) = larger weight — more precise studies get a bigger 'vote.'" },
    correct: 1
  },
  {
    id: "c4-037", category: 3, type: "mcq",
    zh: { q: "如果一個小型研究恰好有非常大的效應量，加權後會怎樣？", opts: ["這個大效應會主導合併結果", "因為權重小，它對合併結果的影響有限", "權重不影響結果", "它會被自動排除"], exp: "雖然效應量大，但小樣本意味著高變異數、低權重。因此對合併結果的拉力有限——這正是加權的價值。" },
    en: { q: "If a small study has a very large effect size, what happens after weighting?", opts: ["It dominates the pooled result", "Its influence is limited because its weight is small", "Weighting has no effect on results", "It's automatically excluded"], exp: "Despite the large effect, a small sample means high variance and low weight. Its pull on the pooled result is limited — that's exactly why weighting matters." },
    correct: 1
  },
  {
    id: "c4-038", category: 3, type: "mcq",
    zh: { q: "合併效應量的計算可以簡化為什麼概念？", opts: ["所有研究效應量的簡單平均", "各研究效應量的加權平均，權重為 1/變異數", "只看最大研究的效應量", "所有研究效應量的中位數"], exp: "合併效應量 = Σ(wi × ESi) / Σ(wi)，本質上是一個加權平均，權重反映每個研究的精確度。" },
    en: { q: "The pooled effect size can be conceptualized as?", opts: ["Simple average of all effect sizes", "Weighted average of effect sizes, with weights = 1/variance", "Just the effect size of the largest study", "Median of all effect sizes"], exp: "Pooled effect = Σ(wi × ESi) / Σ(wi) — essentially a weighted average where weights reflect each study's precision." },
    correct: 1
  },
  {
    id: "c4-039", category: 3, type: "mcq",
    zh: { q: "如果統合分析中只有兩個研究，一個 n=50 權重 30%，另一個 n=500 權重 70%，合併結果會更接近哪一個？", opts: ["更接近 n=50 的研究", "更接近 n=500 的研究", "正好在兩者中間", "無法預測"], exp: "合併結果會更靠近權重較大（n=500）的研究，因為它的 70% 權重意味著它對合併估計有更大的拉力。" },
    en: { q: "If a meta-analysis has two studies — one n=50 with 30% weight, one n=500 with 70% weight — the pooled result will be closer to?", opts: ["The n=50 study", "The n=500 study", "Exactly in between", "Unpredictable"], exp: "The pooled result will be closer to the n=500 study because its 70% weight means it has a stronger pull on the pooled estimate." },
    correct: 1
  },
  {
    id: "c4-040", category: 3, type: "mcq",
    zh: { q: "反變異數加權的一個重要假設是什麼？", opts: ["所有研究品質相同", "每個研究的效應量估計和其標準誤已被正確計算", "大型研究一定正確", "小型研究一定有偏誤"], exp: "反變異數法假設每個研究的效應量和標準誤是準確的。如果計算有誤（如 SD 和 SE 搞混），權重也會錯。" },
    en: { q: "What is an important assumption of inverse-variance weighting?", opts: ["All studies have the same quality", "Each study's effect size and standard error have been correctly calculated", "Large studies are always correct", "Small studies always have bias"], exp: "Inverse-variance weighting assumes each study's effect size and SE are accurate. If calculations are wrong (e.g., confusing SD with SE), weights will be wrong too." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 4: Fixed-effect vs random-effects models (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c4-041", category: 4, type: "mcq",
    zh: { q: "固定效應模型 (fixed-effect model) 假設什麼？", opts: ["每個研究有不同的真實效應", "所有研究都在估計同一個真實效應，差異只來自抽樣誤差", "異質性一定很高", "只適用於小型研究"], exp: "固定效應模型假設一個「真實效應」存在，所有研究都在估計它，觀察到的差異僅僅來自隨機抽樣誤差。" },
    en: { q: "What does the fixed-effect model assume?", opts: ["Each study has a different true effect", "All studies estimate the same true effect; differences are due only to sampling error", "Heterogeneity is always high", "Only suitable for small studies"], exp: "The fixed-effect model assumes one 'true effect' exists and all studies are estimating it — observed differences arise only from random sampling error." },
    correct: 1
  },
  {
    id: "c4-042", category: 4, type: "mcq",
    zh: { q: "隨機效應模型 (random-effects model) 假設什麼？", opts: ["所有研究的真實效應完全相同", "不同研究的真實效應本身也有變異（因為人群、劑量、設定不同）", "只有一個真實效應", "不需要考慮研究間差異"], exp: "隨機效應模型假設真實效應在不同研究間有所不同（因為人群、劑量等差異），合併的是效應的分布的平均值。" },
    en: { q: "What does the random-effects model assume?", opts: ["All studies have exactly the same true effect", "True effects genuinely vary across studies (due to different populations, doses, settings)", "Only one true effect exists", "Between-study differences don't matter"], exp: "The random-effects model assumes true effects vary across studies (different populations, doses, settings) — it estimates the mean of a distribution of effects." },
    correct: 1
  },
  {
    id: "c4-043", category: 4, type: "mcq",
    zh: { q: "使用隨機效應模型時，合併效應量的信賴區間通常會？", opts: ["比固定效應更窄", "比固定效應更寬", "和固定效應完全相同", "不包含任何數值"], exp: "隨機效應模型增加了研究間變異 (τ²) 的成分，使整體不確定性增加，CI 通常比固定效應模型更寬。" },
    en: { q: "Under a random-effects model, the pooled CI is usually?", opts: ["Narrower than fixed-effect", "Wider than fixed-effect", "Exactly the same as fixed-effect", "Doesn't contain any values"], exp: "Random-effects adds between-study variance (τ²) to the uncertainty, making the CI typically wider than the fixed-effect model." },
    correct: 1
  },
  {
    id: "c4-044", category: 4, type: "mcq",
    zh: { q: "當異質性 (I²) 很低（如 0%）時，固定效應和隨機效應的結果會？", opts: ["完全不同", "非常相似", "隨機效應結果會大很多", "無法比較"], exp: "異質性很低時，研究間變異 (τ²) 接近 0，隨機效應模型退化為固定效應模型，結果非常接近。" },
    en: { q: "When heterogeneity (I²) is very low (e.g., 0%), fixed and random effects results will?", opts: ["Be completely different", "Be very similar", "Random effects will be much larger", "Be incomparable"], exp: "With low heterogeneity, between-study variance (τ²) is near 0, and the random-effects model converges to the fixed-effect model — results are nearly identical." },
    correct: 1
  },
  {
    id: "c4-045", category: 4, type: "mcq",
    zh: { q: "在隨機效應模型中，小型研究的權重相對於固定效應模型會？", opts: ["變得更小", "變得相對較大（因為加上了 τ² 使大小研究權重更均勻）", "保持不變", "被排除"], exp: "在隨機效應模型中，權重 = 1/(Vi + τ²)。τ² 的加入使各研究的權重差距縮小，小型研究獲得相對更多的權重。" },
    en: { q: "In a random-effects model, small studies' relative weights compared to fixed-effect will?", opts: ["Become smaller", "Become relatively larger (τ² addition makes weights more uniform)", "Stay the same", "Be excluded"], exp: "In random-effects, weight = 1/(Vi + τ²). Adding τ² narrows the weight range, giving small studies relatively more weight than under fixed-effect." },
    correct: 1
  },
  {
    id: "c4-046", category: 4, type: "mcq",
    zh: { q: "τ² (tau-squared) 在隨機效應模型中代表什麼？", opts: ["抽樣誤差", "研究間真實效應的變異數（between-study variance）", "研究內的變異數", "效應量的平方"], exp: "τ² 量化的是研究間真實效應的差異程度。如果 τ² = 0，就等於固定效應模型。" },
    en: { q: "What does τ² (tau-squared) represent in the random-effects model?", opts: ["Sampling error", "Between-study variance in true effects", "Within-study variance", "Effect size squared"], exp: "τ² quantifies how much true effects vary between studies. If τ² = 0, the random-effects model reduces to fixed-effect." },
    correct: 1
  },
  {
    id: "c4-047", category: 4, type: "mcq",
    zh: { q: "以下哪種情況最適合使用隨機效應模型？", opts: ["所有研究的設計、人群、劑量完全相同", "研究在人群、劑量或環境上有明顯差異", "只有一個研究", "研究品質完美"], exp: "當研究在臨床設定上有差異（不同人群、劑量、設定），效應很可能真的不同，適合用隨機效應模型。" },
    en: { q: "When is the random-effects model most appropriate?", opts: ["All studies have identical design, population, and dose", "Studies differ notably in population, dose, or setting", "Only one study", "Study quality is perfect"], exp: "When studies differ in clinical settings (different populations, doses, settings), effects likely genuinely vary — random-effects is appropriate." },
    correct: 1
  },
  {
    id: "c4-048", category: 4, type: "mcq",
    zh: { q: "如果用互動切換器在同一批數據上切換固定/隨機效應，最明顯的變化是？", opts: ["效應量的方向會反轉", "隨機效應的 CI 通常會變寬", "固定效應的 CI 會消失", "所有數字都不變"], exp: "最明顯的變化是 CI 在隨機效應模型下變寬，反映了額外的研究間不確定性。點估計也可能略有變動。" },
    en: { q: "When toggling fixed/random effects on the same data, the most noticeable change is?", opts: ["Effect direction reverses", "Random-effects CI typically widens", "Fixed-effect CI disappears", "Nothing changes"], exp: "The most noticeable change is a wider CI under random-effects, reflecting additional between-study uncertainty. The point estimate may also shift slightly." },
    correct: 1
  },
  {
    id: "c4-049", category: 4, type: "mcq",
    zh: { q: "許多藥學統合分析預設使用隨機效應模型，原因是？", opts: ["計算更簡單", "在實際情況中，不同研究的人群和設定幾乎不可能完全相同", "隨機效應結果總是更好看", "固定效應已被淘汰"], exp: "藥學研究涉及不同國家、劑量、人群。假設所有研究測量的是完全相同的效應過於嚴格，因此隨機效應模型更常用。" },
    en: { q: "Many pharmacy meta-analyses default to random-effects because?", opts: ["It's simpler to compute", "In practice, populations and settings across studies are rarely identical", "Random-effects always look better", "Fixed-effect is obsolete"], exp: "Pharmacy studies involve different countries, doses, and populations. Assuming all studies measure exactly the same effect is too strict — random-effects is more realistic." },
    correct: 1
  },
  {
    id: "c4-050", category: 4, type: "mcq",
    zh: { q: "以下關於固定效應模型的敘述，哪一個是正確的？", opts: ["它考慮了研究間的異質性", "它假設觀察到的差異只來自抽樣變異", "它的 CI 通常比隨機效應寬", "它不需要計算權重"], exp: "固定效應模型假設只有一個真實效應，所有觀察到的研究間差異都是抽樣誤差造成的。" },
    en: { q: "Which statement about the fixed-effect model is correct?", opts: ["It accounts for between-study heterogeneity", "It assumes observed differences arise only from sampling variability", "Its CI is usually wider than random-effects", "It doesn't require weight calculations"], exp: "The fixed-effect model assumes a single true effect — all observed between-study differences are due to sampling error only." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 5: Forest plot anatomy and reading (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c4-051", category: 5, type: "mcq",
    zh: { q: "森林圖 (forest plot) 中，每個研究的「正方形」代表什麼？", opts: ["研究的品質", "該研究的點估計（效應量）", "研究的發表年份", "研究的樣本量"], exp: "正方形的中心位置代表該研究的點估計（效應量數值），是森林圖最核心的元素之一。" },
    en: { q: "In a forest plot, what does each study's 'square' represent?", opts: ["Study quality", "The study's point estimate (effect size)", "Publication year", "Sample size"], exp: "The center of the square represents the study's point estimate (effect size value) — one of the most core elements of a forest plot." },
    correct: 1
  },
  {
    id: "c4-052", category: 5, type: "mcq",
    zh: { q: "森林圖中穿過正方形的水平線代表什麼？", opts: ["時間軸", "該研究效應量的 95% 信賴區間", "研究的持續時間", "研究者的信心程度"], exp: "水平線代表 95% CI：線越短表示估計越精確，線越長表示不確定性越大。" },
    en: { q: "What does the horizontal line through each square represent?", opts: ["Timeline", "The 95% confidence interval of that study's effect size", "Study duration", "Researcher confidence level"], exp: "The horizontal line represents the 95% CI: shorter lines indicate more precise estimates, longer lines indicate greater uncertainty." },
    correct: 1
  },
  {
    id: "c4-053", category: 5, type: "mcq",
    zh: { q: "正方形的大小代表什麼？", opts: ["效應量的大小", "該研究在統合分析中的權重", "研究的重要性", "作者的知名度"], exp: "正方形面積與權重成正比。大正方形 = 高權重（通常是大樣本、高精確度的研究）。" },
    en: { q: "What does the size of the square represent?", opts: ["Magnitude of the effect size", "The study's weight in the meta-analysis", "Study importance", "Author reputation"], exp: "Square area is proportional to weight. Larger square = higher weight (typically large sample, high precision studies)." },
    correct: 1
  },
  {
    id: "c4-054", category: 5, type: "mcq",
    zh: { q: "森林圖底部的「菱形」(diamond) 代表什麼？", opts: ["最大的研究", "合併（池化）效應量及其 CI", "最小的研究", "中位數效應量"], exp: "菱形是合併（pooled）估計：菱形中心 = 合併效應量，菱形寬度 = 合併效應量的 95% CI。" },
    en: { q: "What does the 'diamond' at the bottom of a forest plot represent?", opts: ["The largest study", "The pooled effect size and its CI", "The smallest study", "Median effect size"], exp: "The diamond is the pooled estimate: center = pooled effect size, width = 95% CI of the pooled effect." },
    correct: 1
  },
  {
    id: "c4-055", category: 5, type: "mcq",
    zh: { q: "森林圖中的「無效線」(line of no effect) 在 OR/RR 圖上位於？", opts: ["0", "1", "0.5", "−1"], exp: "對於 OR 和 RR，無效線在 1（比值 = 1 表示沒有差異）。對於 MD，無效線在 0。" },
    en: { q: "In a forest plot for OR/RR, where is the 'line of no effect'?", opts: ["0", "1", "0.5", "−1"], exp: "For OR and RR, the line of no effect is at 1 (ratio = 1 means no difference). For MD, it's at 0." },
    correct: 1
  },
  {
    id: "c4-056", category: 5, type: "mcq",
    zh: { q: "如果菱形完全在無效線的左邊（OR < 1），這意味著？", opts: ["對照組更好", "合併結果顯著有利於介入組（假設左邊代表介入更好）", "結果不顯著", "數據有錯"], exp: "菱形不跨越無效線，且完全在 1 的左邊（假設約定左側 = 介入更好），表示合併效應顯著有利於介入組。" },
    en: { q: "If the diamond is entirely to the left of the null line (OR < 1), this means?", opts: ["Control is better", "Pooled result significantly favors the intervention (assuming left = intervention better)", "Not significant", "Data error"], exp: "The diamond doesn't cross the null line and is entirely below 1 (assuming left = intervention better), indicating a statistically significant benefit for the intervention." },
    correct: 1
  },
  {
    id: "c4-057", category: 5, type: "mcq",
    zh: { q: "如何從森林圖上判斷哪個研究權重最大？", opts: ["看哪個研究排在最上面", "看哪個正方形最大", "看哪個 CI 最長", "看哪個效應量最極端"], exp: "正方形面積 = 權重。最大的正方形代表權重最大的研究，通常是樣本量最大、估計最精確的研究。" },
    en: { q: "How can you identify the most heavily weighted study on a forest plot?", opts: ["It's listed first", "It has the largest square", "It has the longest CI line", "It has the most extreme effect"], exp: "Square area = weight. The largest square represents the highest-weighted study, typically the one with the largest sample and most precise estimate." },
    correct: 1
  },
  {
    id: "c4-058", category: 5, type: "mcq",
    zh: { q: "森林圖的左側通常顯示什麼資訊？", opts: ["效應量數值", "研究標籤（作者/年份）和基本資訊", "信賴區間", "統計檢定結果"], exp: "左側列出每個研究的標籤（通常是「第一作者, 年份」的格式），讓讀者能識別每個研究。" },
    en: { q: "What information is typically shown on the left side of a forest plot?", opts: ["Effect size values", "Study labels (author/year) and basic information", "Confidence intervals", "Statistical test results"], exp: "The left side lists study labels (usually 'First Author, Year' format), letting readers identify each study." },
    correct: 1
  },
  {
    id: "c4-059", category: 5, type: "mcq",
    zh: { q: "如果某個研究的 CI 線段跨越了無效線，代表？", opts: ["該研究的結果具統計顯著性", "該研究的結果不具統計顯著性（不能排除無效果的可能）", "該研究被排除了", "數據有誤"], exp: "CI 跨越無效線表示 95% CI 包含「無差異」的值，因此該研究單獨來看不具統計顯著性。" },
    en: { q: "If a study's CI line crosses the line of no effect, it means?", opts: ["The result is statistically significant", "The result is not statistically significant (cannot rule out no effect)", "The study was excluded", "Data error"], exp: "CI crossing the null line means the 95% CI includes the 'no difference' value, so that individual study is not statistically significant on its own." },
    correct: 1
  },
  {
    id: "c4-060", category: 5, type: "mcq",
    zh: { q: "一個好的森林圖通常會同時顯示哪些數值資訊？", opts: ["只有圖形就夠了", "效應量數值、95% CI 和權重百分比", "只有 p 值", "只有樣本量"], exp: "完整的森林圖在右側會列出每個研究的效應量數值、95% CI 和權重 (%)，讓讀者可以同時讀取圖形和數字。" },
    en: { q: "A good forest plot usually also displays which numerical information?", opts: ["The graphic alone is sufficient", "Effect size values, 95% CI, and weight percentages", "Only p-values", "Only sample sizes"], exp: "A complete forest plot lists each study's effect size, 95% CI, and weight (%) on the right side, allowing readers to read both graphics and numbers." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 6: Common mistakes (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c4-061", category: 6, type: "mcq",
    zh: { q: "一個常見錯誤是將 OR 直接解讀為 RR。當事件率較高時，OR 和 RR 的關係是？", opts: ["OR 和 RR 完全相同", "OR 會比 RR 更誇大效果的大小（遠離 1）", "RR 會比 OR 更大", "沒有關係"], exp: "當事件率高時，OR 會比 RR 更極端。例如 OR = 0.5 可能對應 RR = 0.7。把 OR 說成「風險降低 50%」是不正確的。" },
    en: { q: "A common mistake is interpreting OR as if it were RR. When event rates are high, OR vs RR?", opts: ["OR and RR are identical", "OR exaggerates the effect more than RR (further from 1)", "RR is larger than OR", "No relationship"], exp: "With high event rates, OR is more extreme than RR. E.g., OR = 0.5 might correspond to RR = 0.7. Saying 'risk reduced by 50%' from an OR of 0.5 is incorrect." },
    correct: 1
  },
  {
    id: "c4-062", category: 6, type: "mcq",
    zh: { q: "誤將標準差 (SD) 當成標準誤 (SE) 使用，會對統合分析有什麼影響？", opts: ["沒有影響", "會嚴重扭曲權重和信賴區間（SD 通常遠大於 SE）", "只影響 p 值", "會使效應量變大"], exp: "SD 反映數據的離散程度，SE = SD/√n 反映估計的精確度。用 SD 代替 SE 會使 CI 過寬、權重不正確。" },
    en: { q: "Confusing SD for SE in a meta-analysis will?", opts: ["Have no effect", "Severely distort weights and CIs (SD is usually much larger than SE)", "Only affect p-values", "Make effect sizes larger"], exp: "SD reflects data spread; SE = SD/√n reflects estimate precision. Using SD instead of SE makes CIs too wide and weights incorrect." },
    correct: 1
  },
  {
    id: "c4-063", category: 6, type: "mcq",
    zh: { q: "以下哪個說法是錯誤的？", opts: ["合併效應量不顯著不代表沒有效果", "CI 跨越無效線 = 結果不顯著", "p < 0.05 一定代表臨床上重要", "森林圖的菱形代表合併估計"], exp: "p < 0.05 只代表統計顯著，不一定臨床重要。一個很小的效果在大樣本中可能「顯著」但臨床無意義。" },
    en: { q: "Which statement is INCORRECT?", opts: ["Non-significant pooled effect doesn't mean no effect", "CI crossing the null = not significant", "p < 0.05 always means clinically important", "The diamond represents the pooled estimate"], exp: "p < 0.05 means statistically significant, not necessarily clinically important. A tiny effect in a huge sample can be 'significant' but clinically meaningless." },
    correct: 2
  },
  {
    id: "c4-064", category: 6, type: "mcq",
    zh: { q: "在解讀 MD 時，忘記考慮什麼會導致誤判臨床意義？", opts: ["p 值", "效應量的方向", "最小臨床重要差異 (MCID)", "研究數量"], exp: "MD = 2 mmHg 統計顯著，但如果 MCID 是 5 mmHg，這個差異在臨床上可能沒有意義。必須結合 MCID 來判斷。" },
    en: { q: "When interpreting MD, forgetting to consider what can lead to misjudging clinical significance?", opts: ["p-value", "Effect direction", "Minimal Clinically Important Difference (MCID)", "Number of studies"], exp: "MD = 2 mmHg might be significant, but if the MCID is 5 mmHg, this difference may be clinically meaningless. Always consider MCID." },
    correct: 2
  },
  {
    id: "c4-065", category: 6, type: "mcq",
    zh: { q: "以下哪個是讀森林圖時的常見錯誤？", opts: ["先看菱形位置和是否跨越無效線", "只看 p 值而忽略效應量的大小和 CI 寬度", "注意各研究 CI 是否重疊", "確認正方形大小代表權重"], exp: "只看 p 值就下結論是最常見的錯誤。應該綜合看效應量大小、CI 寬度、權重分布和異質性。" },
    en: { q: "What is a common mistake when reading a forest plot?", opts: ["Looking at the diamond and whether it crosses the null", "Focusing only on p-value while ignoring effect magnitude and CI width", "Checking if study CIs overlap", "Checking that square size represents weight"], exp: "Only looking at the p-value is the most common mistake. You should consider effect magnitude, CI width, weight distribution, and heterogeneity together." },
    correct: 1
  },
  {
    id: "c4-066", category: 6, type: "mcq",
    zh: { q: "在報告效應量時，以下哪個做法是錯誤的？", opts: ["報告效應量及其 95% CI", "報告效應量類型（OR、RR 或 MD）", "只報告 p 值，不報告效應量和 CI", "註明使用的模型（固定或隨機效應）"], exp: "只報告 p 值而不報告效應量和 CI 是不完整的。讀者需要知道效果有多大和多精確，不只是是否顯著。" },
    en: { q: "Which reporting practice is WRONG?", opts: ["Reporting effect size with 95% CI", "Specifying the type of effect size (OR, RR, or MD)", "Reporting only the p-value without effect size or CI", "Stating the model used (fixed or random effects)"], exp: "Reporting only the p-value without effect size and CI is incomplete. Readers need to know how big and how precise the effect is, not just whether it's significant." },
    correct: 2
  },
  {
    id: "c4-067", category: 6, type: "mcq",
    zh: { q: "有人說「OR = 2.5 代表風險增加了 2.5 倍」，這個說法？", opts: ["完全正確", "不正確——OR = 2.5 代表勝算增加 2.5 倍，不是風險增加 2.5 倍", "只是換個說法", "和 RR 的解讀一樣"], exp: "OR = 2.5 表示勝算是 2.5 倍，不等於風險是 2.5 倍。當事件率高時，差異更大。這是最常見的 OR 誤解之一。" },
    en: { q: "Someone says 'OR = 2.5 means the risk increased 2.5 times.' Is this correct?", opts: ["Completely correct", "Incorrect — OR = 2.5 means 2.5 times the odds, not 2.5 times the risk", "Just different wording", "Same as RR interpretation"], exp: "OR = 2.5 means 2.5 times the odds, NOT 2.5 times the risk. When event rates are high, the distinction matters greatly. This is one of the most common OR misconceptions." },
    correct: 1
  },
  {
    id: "c4-068", category: 6, type: "mcq",
    zh: { q: "在統合分析中混合使用 OR 和 RR 會導致什麼問題？", opts: ["沒有問題", "效應量在不同尺度上，不能直接合併比較", "結果會更精確", "可以但需要額外轉換"], exp: "OR 和 RR 是不同的效應量指標，不能混在同一個統合分析中直接合併。必須統一轉換為同一種效應量。" },
    en: { q: "What problem occurs if you mix OR and RR in the same meta-analysis?", opts: ["No problem", "Effect sizes are on different scales and cannot be directly pooled", "Results become more precise", "It's fine but needs extra conversion"], exp: "OR and RR are different measures — they cannot be mixed in the same analysis without conversion to a common metric first." },
    correct: 1
  },
  {
    id: "c4-069", category: 6, type: "mcq",
    zh: { q: "一個常見的圖表誤讀：森林圖的 CI 很窄（精確），就一定代表結果正確嗎？", opts: ["是的，CI 窄就代表結果可靠", "不一定——CI 窄表示精確，但如果研究有偏誤，精確的結果也可能是錯誤的", "CI 寬才代表可靠", "CI 和偏誤無關"], exp: "高精確度 ≠ 正確。如果研究本身有系統性偏誤，非常精確的結果可能只是「精確地錯了」。" },
    en: { q: "A narrow CI (precise estimate) on a forest plot means the result is definitely correct?", opts: ["Yes, narrow CI means reliable", "Not necessarily — narrow CI means precise, but a biased study can be 'precisely wrong'", "Wide CI means reliable", "CI is unrelated to bias"], exp: "High precision ≠ correctness. If a study has systematic bias, a very precise result may just be 'precisely wrong.'" },
    correct: 1
  },
  {
    id: "c4-070", category: 6, type: "mcq",
    zh: { q: "選擇效應量類型（OR vs RR vs MD vs SMD）最重要的依據是？", opts: ["作者偏好", "結果的資料類型（二分類 vs 連續性）以及研究是否使用相同量表", "p 值的大小", "研究的年份"], exp: "二分類結果用 OR/RR，連續性結果用 MD（相同量表）或 SMD（不同量表）。資料類型決定效應量類型。" },
    en: { q: "What is the most important basis for choosing the effect size type (OR vs RR vs MD vs SMD)?", opts: ["Author preference", "The data type of the outcome (binary vs continuous) and whether studies use the same scale", "Size of the p-value", "Publication year"], exp: "Binary outcomes → OR/RR; continuous outcomes → MD (same scale) or SMD (different scales). Data type dictates effect size choice." },
    correct: 1
  },,

  // ════════════════════════════════════════════════════════════
  // NEW ADVANCED QUESTIONS (c4-071 to c4-105): 35 questions
  // Types: true_false, multi_select, ordering, spot_error
  // 5 per category (categories 0-6)
  // ════════════════════════════════════════════════════════════

  // ── Category 0: Advanced (5 Qs) ──
  {
    id: "c4-071", category: 0, type: "true_false",
    zh: { q: "「效應量越大，p 值就一定越小。」", exp: "不一定。p 值同時受效應量和樣本量影響。小效應量 + 超大樣本也可以有極小的 p 值。" },
    en: { q: "\'A larger effect size always means a smaller p-value.\'", exp: "Not necessarily. The p-value depends on both effect size AND sample size. A small effect + huge sample can yield a tiny p-value." },
    correct: false
  },
  {
    id: "c4-072", category: 0, type: "true_false",
    zh: { q: "「效應量可以為負值。」", exp: "正確。負值的效應量（如 MD = −3）表示介入組的數值低於對照組，方向性是效應量的重要特徵。" },
    en: { q: "\'An effect size can be negative.\'", exp: "True. A negative effect size (e.g., MD = −3) means the intervention group had lower values than control — direction is a key feature of effect sizes." },
    correct: true
  },
  {
    id: "c4-073", category: 0, type: "multi_select",
    zh: { q: "以下哪些是效應量的指標？（選出所有正確答案）", opts: ["勝算比 (OR)", "p 值", "均差 (MD)", "標準化均差 (SMD)", "風險比 (RR)"], exp: "OR、MD、SMD、RR 都是效應量。p 值是統計顯著性的指標，不是效應量。" },
    en: { q: "Which of the following are effect size measures? (Select ALL correct)", opts: ["Odds Ratio (OR)", "p-value", "Mean Difference (MD)", "Standardized Mean Difference (SMD)", "Risk Ratio (RR)"], exp: "OR, MD, SMD, and RR are all effect sizes. The p-value measures statistical significance, not effect magnitude." },
    correctAll: [0, 2, 3, 4]
  },
  {
    id: "c4-074", category: 0, type: "spot_error",
    zh: { q: "以下段落中有一個錯誤，找出來：", statements: ["效應量量化了介入效果的大小和方向。", "信賴區間顯示效應量估計的精確度。", "p 值告訴我們效果有多大。", "大樣本研究通常有較窄的信賴區間。"], exp: "p 值只告訴我們結果是否具統計顯著性（不太可能是偶然造成的），不告訴我們效果有多大——那是效應量的工作。" },
    en: { q: "Find the error in the following statements:", statements: ["Effect sizes quantify the magnitude and direction of an intervention's impact.", "Confidence intervals show the precision of the effect size estimate.", "The p-value tells us how large the effect is.", "Larger studies typically have narrower confidence intervals."], exp: "The p-value only tells us whether the result is statistically significant (unlikely due to chance) — it does NOT tell us how large the effect is. That's the job of the effect size." },
    correct: 2
  },
  {
    id: "c4-075", category: 0, type: "ordering",
    zh: { q: "將以下步驟按正確順序排列：從原始研究到統合分析中的效應量", items: ["從每個研究提取原始數據", "計算每個研究的效應量和 SE", "用反變異數法賦予權重", "計算加權合併效應量及其 CI"], exp: "流程：提取數據 → 計算效應量和 SE → 加權 → 合併。這是統合分析合併研究的核心步驟順序。" },
    en: { q: "Arrange in correct order: from raw studies to pooled effect size", items: ["Extract raw data from each study", "Calculate each study's effect size and SE", "Assign weights using inverse-variance method", "Compute weighted pooled effect size and CI"], exp: "Flow: extract data → calculate effect size & SE → weight → pool. This is the core sequence for combining studies in meta-analysis." },
    correctOrder: [0, 1, 2, 3]
  },

  // ── Category 1: Advanced (5 Qs) ──
  {
    id: "c4-076", category: 1, type: "true_false",
    zh: { q: "「在病例對照研究中，可以直接計算風險比 (RR)。」", exp: "錯誤。病例對照研究是先選定有病/無病的人，無法得知真正的發生率，因此只能計算 OR，不能直接算 RR。" },
    en: { q: "\'In a case-control study, you can directly calculate Risk Ratio (RR).\'", exp: "False. Case-control studies select by disease status — you cannot determine true incidence rates, so only OR (not RR) can be calculated." },
    correct: false
  },
  {
    id: "c4-077", category: 1, type: "multi_select",
    zh: { q: "OR = 0.60 (95% CI: 0.42–0.85) 表示什麼？（選出所有正確答案）", opts: ["介入組的勝算是對照組的 60%", "結果具統計顯著性", "介入組的「風險」降低了 40%", "CI 不包含 1"], exp: "OR = 0.60 表示介入組勝算是對照組的 60%（正確），CI 不含 1 所以顯著（正確）。但不能說「風險降低 40%」——那是 RR 的語言，不是 OR。" },
    en: { q: "OR = 0.60 (95% CI: 0.42–0.85) means? (Select ALL correct)", opts: ["Intervention odds are 60% of control's", "The result is statistically significant", "Intervention 'risk' is reduced by 40%", "The CI excludes 1"], exp: "OR = 0.60 means intervention odds are 60% of control (correct), CI excludes 1 so significant (correct). But 'risk reduced by 40%' is RR language, not OR." },
    correctAll: [0, 1, 3]
  },
  {
    id: "c4-078", category: 1, type: "spot_error",
    zh: { q: "找出以下統合分析報告中的錯誤：", statements: ["我們納入了 12 個 RCT 進行統合分析。", "使用勝算比 (OR) 作為二分類結果的效應量。", "合併 OR = 0.5，表示介入組的風險降低了 50%。", "使用隨機效應模型因為研究存在臨床異質性。"], exp: "OR = 0.5 代表介入組的「勝算」是對照組的 50%（降低 50%），而非「風險」降低 50%。風險降低需要用 RR 來描述。" },
    en: { q: "Find the error in this meta-analysis report excerpt:", statements: ["We included 12 RCTs in the meta-analysis.", "Odds Ratio (OR) was used as the effect measure for binary outcomes.", "Pooled OR = 0.5, meaning the intervention reduced risk by 50%.", "Random-effects model was used due to clinical heterogeneity."], exp: "OR = 0.5 means the intervention ODDS are 50% of control — NOT that risk is reduced by 50%. Risk reduction language requires RR." },
    correct: 2
  },
  {
    id: "c4-079", category: 1, type: "true_false",
    zh: { q: "「當事件發生率低於 10% 時，OR 和 RR 的數值非常接近。」", exp: "正確。這就是「稀少事件假設」。事件率很低時，勝算（events/non-events）≈ 風險（events/total），因為分母幾乎相同。" },
    en: { q: "\'When event rates are below 10%, OR and RR values are very similar.\'", exp: "True. This is the rare disease assumption. With low event rates, odds ≈ risk because denominators are nearly identical." },
    correct: true
  },
  {
    id: "c4-080", category: 1, type: "ordering",
    zh: { q: "排列計算 OR 的步驟（從 2×2 表格開始）：", items: ["建立 2×2 表格（事件/非事件 × 介入/對照）", "計算介入組勝算 = 事件數/非事件數", "計算對照組勝算 = 事件數/非事件數", "OR = 介入組勝算 ÷ 對照組勝算"], exp: "OR 計算流程：建表 → 算介入組勝算 → 算對照組勝算 → 相除得 OR。" },
    en: { q: "Arrange the steps for calculating OR (from a 2×2 table):", items: ["Set up 2×2 table (events/non-events × intervention/control)", "Calculate intervention odds = events/non-events", "Calculate control odds = events/non-events", "OR = intervention odds ÷ control odds"], exp: "OR calculation flow: set up table → calculate intervention odds → calculate control odds → divide to get OR." },
    correctOrder: [0, 1, 2, 3]
  },

  // ── Category 2: Advanced (5 Qs) ──
  {
    id: "c4-081", category: 2, type: "true_false",
    zh: { q: "「SMD = 0.5 在所有臨床情境中都代表中等效果。」", exp: "不一定正確。Cohen 的 0.5 = 中等只是「慣例」，不是絕對標準。在某些臨床情境中，0.5 可能是很大或很小的效果。" },
    en: { q: "\'SMD = 0.5 always represents a medium effect in all clinical contexts.\'", exp: "Not necessarily. Cohen's 0.5 = medium is a convention, not an absolute standard. In some contexts, 0.5 may be a large or small effect." },
    correct: false
  },
  {
    id: "c4-082", category: 2, type: "multi_select",
    zh: { q: "什麼時候應該選 MD 而非 SMD？（選出所有正確答案）", opts: ["所有研究使用相同量表", "你想保留原始臨床單位", "不同研究使用不同量表測同一概念", "你想讓結果更容易被臨床醫師理解"], exp: "MD 適用於相同量表（保留原始單位，更直觀）。不同量表時需要 SMD 來標準化。" },
    en: { q: "When should MD be chosen over SMD? (Select ALL correct)", opts: ["All studies use the same scale", "You want to preserve original clinical units", "Studies use different scales for the same concept", "You want results easily understood by clinicians"], exp: "MD is for same-scale studies (preserves units, more intuitive). Different scales require SMD." },
    correctAll: [0, 1, 3]
  },
  {
    id: "c4-083", category: 2, type: "spot_error",
    zh: { q: "找出這段結果描述中的錯誤：", statements: ["三個研究分別使用 PHQ-9、BDI 和 HAMD 測量憂鬱。", "由於量表不同，我們使用 MD 來合併。", "合併效應量為 −0.45 (95% CI: −0.72 to −0.18)。", "效應具統計顯著性 (p = 0.001)。"], exp: "不同量表（PHQ-9、BDI、HAMD）不能用 MD 合併——應該用 SMD。MD 只適用於所有研究使用相同量表。" },
    en: { q: "Find the error in this results description:", statements: ["Three studies measured depression using PHQ-9, BDI, and HAMD respectively.", "Because scales differed, we used MD to pool results.", "Pooled effect was −0.45 (95% CI: −0.72 to −0.18).", "The effect was statistically significant (p = 0.001)."], exp: "Different scales (PHQ-9, BDI, HAMD) cannot be pooled using MD — SMD is needed. MD only works when all studies use the same scale." },
    correct: 1
  },
  {
    id: "c4-084", category: 2, type: "true_false",
    zh: { q: "「MD = 0 表示兩組之間沒有差異。」", exp: "正確。對於連續性結果，MD = 0 表示介入組和對照組的平均值完全相同，即無效線的位置。" },
    en: { q: "\'MD = 0 means no difference between the two groups.\'", exp: "True. For continuous outcomes, MD = 0 means the intervention and control group means are identical — this is the line of no effect." },
    correct: true
  },
  {
    id: "c4-085", category: 2, type: "ordering",
    zh: { q: "將以下效應量從最小到最大排列（Cohen's 慣例）：", items: ["d = 0.8（大效果）", "d = 0.2（小效果）", "d = 0.5（中效果）", "d = 1.2（極大效果）"], exp: "Cohen's 慣例：0.2（小）→ 0.5（中）→ 0.8（大）→ 1.2（極大）。" },
    en: { q: "Arrange these effect sizes from smallest to largest (Cohen's conventions):", items: ["d = 0.8 (large effect)", "d = 0.2 (small effect)", "d = 0.5 (medium effect)", "d = 1.2 (very large effect)"], exp: "Cohen's conventions: 0.2 (small) → 0.5 (medium) → 0.8 (large) → 1.2 (very large)." },
    correctOrder: [1, 2, 0, 3]
  },

  // ── Category 3: Advanced (5 Qs) ──
  {
    id: "c4-086", category: 3, type: "true_false",
    zh: { q: "「在反變異數法中，權重最大的研究一定是樣本量最大的研究。」", exp: "不一定。權重 = 1/SE²，SE 取決於樣本量和數據的離散程度。一個中等樣本但低離散的研究可能比大樣本高離散的研究更精確。" },
    en: { q: "\'In inverse-variance weighting, the highest-weighted study always has the largest sample size.\'", exp: "Not always. Weight = 1/SE², and SE depends on both sample size and data variability." },
    correct: false
  },
  {
    id: "c4-087", category: 3, type: "multi_select",
    zh: { q: "反變異數加權法的優點包括？（選出所有正確答案）", opts: ["精確的研究貢獻更多", "可同時用於二分類和連續性結果", "完全消除異質性", "數學上可推導出最小變異數的合併估計"], exp: "反變異數法讓精確研究貢獻更多（正確），適用於所有結果類型（正確），數學上最優（正確）。但它不能消除異質性。" },
    en: { q: "Advantages of inverse-variance weighting include? (Select ALL correct)", opts: ["More precise studies contribute more", "Applicable to both binary and continuous outcomes", "Completely eliminates heterogeneity", "Mathematically yields the minimum-variance pooled estimate"], exp: "Inverse-variance gives more weight to precise studies, works for all types, is mathematically optimal. But doesn't eliminate heterogeneity." },
    correctAll: [0, 1, 3]
  },
  {
    id: "c4-088", category: 3, type: "spot_error",
    zh: { q: "找出以下加權計算描述中的錯誤：", statements: ["Study A: effect = 0.5, SE = 0.1 → weight = 1/0.1² = 100", "Study B: effect = 0.8, SE = 0.2 → weight = 1/0.2² = 25", "加權合併效應 = (100×0.5 + 25×0.8) / (100+25) = 0.56", "合併 SE = 1/√(100+25) = 1/√125 = 0.089"], exp: "所有計算都是正確的！這是一個陷阱題——所有步驟都正確。" },
    en: { q: "Find the error in this weighting calculation:", statements: ["Study A: effect = 0.5, SE = 0.1 → weight = 1/0.1² = 100", "Study B: effect = 0.8, SE = 0.2 → weight = 1/0.2² = 25", "Weighted pooled effect = (100×0.5 + 25×0.8) / (100+25) = 0.56", "Pooled SE = 1/√(100+25) = 1/√125 = 0.089"], exp: "All calculations are correct! This is a trick question — all steps check out." },
    correct: -1
  },
  {
    id: "c4-089", category: 3, type: "true_false",
    zh: { q: "「合併更多精確的研究會使合併效應量的信賴區間變窄。」", exp: "正確。更多精確研究增加了權重總和，使合併 SE 更小，CI 因此變窄。" },
    en: { q: "\'Including more precise studies narrows the pooled effect confidence interval.\'", exp: "True. More precise studies increase the weight sum, making pooled SE smaller, thus narrowing the CI." },
    correct: true
  },
  {
    id: "c4-090", category: 3, type: "ordering",
    zh: { q: "將以下研究從權重最大到最小排列（固定效應模型中）：", items: ["研究 A: SE = 0.05", "研究 B: SE = 0.20", "研究 C: SE = 0.10", "研究 D: SE = 0.50"], exp: "權重 = 1/SE²。A: 400, C: 100, B: 25, D: 4。SE 越小 → 權重越大。" },
    en: { q: "Rank these studies from highest to lowest weight (fixed-effect model):", items: ["Study A: SE = 0.05", "Study B: SE = 0.20", "Study C: SE = 0.10", "Study D: SE = 0.50"], exp: "Weight = 1/SE². A: 400, C: 100, B: 25, D: 4. Smaller SE → higher weight." },
    correctOrder: [0, 2, 1, 3]
  },

  // ── Category 4: Advanced (5 Qs) ──
  {
    id: "c4-091", category: 4, type: "true_false",
    zh: { q: "「隨機效應模型的合併效應量永遠比固定效應模型的更接近零。」", exp: "不正確。方向不一定——隨機效應可能更大或更小。最明顯的區別是 CI 更寬。" },
    en: { q: "\'The random-effects pooled estimate is always closer to zero than fixed-effect.\'", exp: "False. Direction is not guaranteed — the most consistent difference is a wider CI under random-effects." },
    correct: false
  },
  {
    id: "c4-092", category: 4, type: "multi_select",
    zh: { q: "隨機效應模型比固定效應模型更常用的原因？（選出所有正確答案）", opts: ["不同研究的設定通常有差異", "它考慮了研究間的真實差異", "計算更簡單", "結論更容易推廣到新的研究設定"], exp: "研究設定通常有差異（正確），考慮真實差異（正確），推廣性更好（正確）。但計算不是更簡單。" },
    en: { q: "Reasons random-effects is more commonly used? (Select ALL correct)", opts: ["Study settings usually differ", "It accounts for real between-study differences", "Simpler to compute", "Conclusions generalize better to new settings"], exp: "Settings differ, accounts for real differences, generalizes better — all correct. But NOT simpler to compute." },
    correctAll: [0, 1, 3]
  },
  {
    id: "c4-093", category: 4, type: "spot_error",
    zh: { q: "找出以下模型選擇討論中的錯誤：", statements: ["我們的統合分析納入了來自不同國家和劑量的研究。", "由於研究設定差異大，我們選擇了隨機效應模型。", "隨機效應模型假設所有研究測量的是同一個真實效應。", "DerSimonian-Laird 方法用於估計 τ²。"], exp: "「所有研究測量同一個真實效應」是固定效應模型的假設。隨機效應假設每個研究可能有不同的真實效應。" },
    en: { q: "Find the error in this model selection discussion:", statements: ["Our meta-analysis included studies from different countries and doses.", "Due to setting differences, we chose the random-effects model.", "The random-effects model assumes all studies measure the same true effect.", "The DerSimonian-Laird method was used to estimate τ²."], exp: "All studies measure the same true effect is the FIXED-effect assumption. Random-effects assumes each study may have a different true effect." },
    correct: 2
  },
  {
    id: "c4-094", category: 4, type: "true_false",
    zh: { q: "「當 τ² = 0 時，隨機效應模型和固定效應模型給出完全相同的結果。」", exp: "正確。τ² = 0 代表沒有研究間變異。此時隨機效應的權重公式退化為固定效應的 1/Vi。" },
    en: { q: "\'When τ² = 0, random-effects and fixed-effect models give identical results.\'", exp: "True. τ² = 0 means no between-study variance. The random-effects weight reduces to the fixed-effect weight." },
    correct: true
  },
  {
    id: "c4-095", category: 4, type: "ordering",
    zh: { q: "將以下情境從「最適合固定效應」到「最適合隨機效應」排列：", items: ["完全相同方案的多中心 RCT", "相同藥物但不同劑量、不同人群的研究", "相同藥物、相同劑量、相似人群", "跨疾病領域的療效比較"], exp: "完全相同方案→相同藥/劑量/人群→不同劑量/人群→跨領域。差異越大，越適合隨機效應。" },
    en: { q: "Rank from most suitable for fixed-effect to most suitable for random-effects:", items: ["Multi-center RCT with identical protocol", "Same drug but different doses and populations", "Same drug, same dose, similar populations", "Cross-disease efficacy comparison"], exp: "Identical protocol → same drug/dose/pop → different doses → cross-disease. More variability → random-effects." },
    correctOrder: [0, 2, 1, 3]
  },

  // ── Category 5: Advanced (5 Qs) ──
  {
    id: "c4-096", category: 5, type: "true_false",
    zh: { q: "「如果森林圖中所有研究的 CI 都重疊，就一定沒有異質性。」", exp: "不完全正確。CI 大量重疊暗示低異質性，但 I² 仍可能非零。" },
    en: { q: "\'If all study CIs overlap on a forest plot, there is definitely no heterogeneity.\'", exp: "Not exactly. Substantial overlap suggests low heterogeneity, but I² may still be nonzero." },
    correct: false
  },
  {
    id: "c4-097", category: 5, type: "multi_select",
    zh: { q: "森林圖中可以讀取的資訊包括？（選出所有正確答案）", opts: ["每個研究的效應量大小", "每個研究的權重", "各研究 CI 的重疊程度（初步判斷異質性）", "研究的資金來源"], exp: "森林圖顯示效應量、權重（正方形大小）、CI 重疊程度。但不顯示資金來源。" },
    en: { q: "What information can be read from a forest plot? (Select ALL correct)", opts: ["Each study's effect size", "Each study's weight", "CI overlap across studies", "Study funding sources"], exp: "Forest plots show effect sizes, weights (square sizes), CI overlap. But NOT funding sources." },
    correctAll: [0, 1, 2]
  },
  {
    id: "c4-098", category: 5, type: "spot_error",
    zh: { q: "找出以下森林圖描述中的錯誤：", statements: ["每個研究以正方形和水平線表示。", "正方形面積代表效應量的大小。", "底部菱形代表合併效應量。", "菱形寬度代表合併效應量的 95% CI。"], exp: "正方形面積代表「權重」，不是效應量的大小。效應量的大小由正方形在 x 軸上的位置決定。" },
    en: { q: "Find the error in this forest plot description:", statements: ["Each study is shown as a square with a horizontal line.", "Square area represents the magnitude of the effect size.", "The diamond at the bottom represents the pooled effect.", "Diamond width represents the 95% CI of the pooled effect."], exp: "Square area represents WEIGHT, not effect size magnitude. Magnitude is determined by position on the x-axis." },
    correct: 1
  },
  {
    id: "c4-099", category: 5, type: "true_false",
    zh: { q: "「在 OR/RR 的森林圖中，無效線位於 0。」", exp: "錯誤。OR/RR 的無效線在 1（比值 = 1 = 無差異）。無效線在 0 的是 MD/SMD 的森林圖。" },
    en: { q: "\'In an OR/RR forest plot, the line of no effect is at 0.\'", exp: "False. For OR/RR, the null line is at 1. The null at 0 applies to MD/SMD forest plots." },
    correct: false
  },
  {
    id: "c4-100", category: 5, type: "ordering",
    zh: { q: "閱讀森林圖的建議順序：", items: ["先整體瀏覽：有多少個研究？效應方向是否一致？", "看菱形：合併效應量的位置和是否跨越無效線", "看各研究的正方形大小和 CI 重疊情況", "檢查異質性統計量（I², Q p-value）"], exp: "先整體瀏覽 → 看個別研究 → 看合併結果 → 檢查異質性。" },
    en: { q: "Recommended order for reading a forest plot:", items: ["Overall scan: how many studies? Are effect directions consistent?", "Check diamond: pooled effect position and whether it crosses the null", "Examine square sizes and CI overlap across studies", "Check heterogeneity statistics (I², Q p-value)"], exp: "Overall scan → individual studies → pooled result → heterogeneity." },
    correctOrder: [0, 2, 1, 3]
  },

  // ── Category 6: Advanced (5 Qs) ──
  {
    id: "c4-101", category: 6, type: "true_false",
    zh: { q: "「p < 0.05 的效應量一定具有臨床意義。」", exp: "錯誤。統計顯著 ≠ 臨床重要。MD = 1 mmHg 可以在大樣本中達 p < 0.05，但臨床意義可能為零。" },
    en: { q: "\'A statistically significant effect (p < 0.05) is always clinically meaningful.\'", exp: "False. Statistical significance ≠ clinical importance. MD = 1 mmHg can reach p < 0.05 in large samples but have zero clinical relevance." },
    correct: false
  },
  {
    id: "c4-102", category: 6, type: "multi_select",
    zh: { q: "以下哪些是解讀效應量時的常見錯誤？（選出所有正確答案）", opts: ["把 OR 當成 RR 來解釋", "忘記考慮 CI 寬度", "混淆 SD 和 SE", "同時報告效應量和 CI"], exp: "把 OR 當 RR、忘記 CI 寬度、混淆 SD/SE 都是常見錯誤。同時報告效應量和 CI 是正確做法。" },
    en: { q: "Common mistakes when interpreting effect sizes? (Select ALL correct)", opts: ["Interpreting OR as RR", "Ignoring CI width", "Confusing SD and SE", "Reporting both effect size and CI"], exp: "OR as RR, ignoring CI width, confusing SD/SE are common mistakes. Reporting both is correct practice." },
    correctAll: [0, 1, 2]
  },
  {
    id: "c4-103", category: 6, type: "spot_error",
    zh: { q: "找出以下結論中的錯誤：", statements: ["合併 OR = 1.02 (95% CI: 0.95–1.10, p = 0.55)。", "效應量接近 1 且 CI 跨越無效線。", "結論：該藥物無效，應停止使用。", "需要更多研究來確認結果。"], exp: "結果不顯著不代表「藥物無效」。只能說「未能證明有效」。" },
    en: { q: "Find the error in these conclusions:", statements: ["Pooled OR = 1.02 (95% CI: 0.95–1.10, p = 0.55).", "The effect is near null and the CI crosses the line of no effect.", "Conclusion: The drug is ineffective and should be discontinued.", "More research is needed to confirm results."], exp: "Non-significant does NOT mean ineffective. We can only say unable to demonstrate effectiveness." },
    correct: 2
  },
  {
    id: "c4-104", category: 6, type: "true_false",
    zh: { q: "「在同一個統合分析中可以直接合併 OR 和 RR。」", exp: "錯誤。OR 和 RR 在不同尺度上，必須先統一轉換為同一種效應量才能合併。" },
    en: { q: "\'OR and RR can be directly pooled in the same meta-analysis.\'", exp: "False. OR and RR are on different scales — you must convert all to the same metric before pooling." },
    correct: false
  },
  {
    id: "c4-105", category: 6, type: "ordering",
    zh: { q: "將以下錯誤從「最常見」到「最少見」排列：", items: ["只看 p 值不看效應量大小", "把 OR 的數字直接當成 RR 解讀", "混淆 SD 和 SE", "忘記指定使用的效應量類型"], exp: "最常見的是只看 p 值→OR/RR 混淆→SD/SE 混用→忘記指定類型。" },
    en: { q: "Rank these mistakes from most common to least common:", items: ["Only looking at p-value without effect size", "Interpreting OR numbers as if they were RR", "Confusing SD and SE", "Forgetting to specify the effect size type used"], exp: "Most common: p-value only → OR/RR confusion → SD/SE mix-up → forgetting to specify type." },
    correctOrder: [0, 1, 2, 3]
  },

];
