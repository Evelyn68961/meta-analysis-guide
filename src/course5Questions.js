// ============================================================
// COURSE 5: Heterogeneity & Publication Bias — 70 Questions (10 per category)
// ============================================================
// 7 categories:
//   0 = What heterogeneity is and why it matters
//   1 = I², Q statistic, and prediction intervals
//   2 = Sources of heterogeneity (clinical, methodological, statistical)
//   3 = Subgroup analysis and meta-regression
//   4 = Publication bias concept and funnel plots
//   5 = Egger's test, trim-and-fill, and other detection methods
//   6 = PRISMA reporting and overall interpretation pitfalls
// ============================================================

export const course5Categories = {
  zh: ["異質性的概念", "I²、Q 統計量與預測區間", "異質性來源", "亞組分析與統合迴歸", "發表偏倚與漏斗圖", "Egger 檢定與修剪填補法", "PRISMA 報告與綜合解讀"],
  en: ["What Heterogeneity Is", "I², Q Statistic & Prediction Intervals", "Sources of Heterogeneity", "Subgroup Analysis & Meta-Regression", "Publication Bias & Funnel Plots", "Egger's Test & Trim-and-Fill", "PRISMA Reporting & Interpretation"],
};

export const course5Questions = [

  // ════════════════════════════════════════
  // Category 0: What heterogeneity is and why it matters (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c5-001", category: 0,
    zh: { q: "統合分析中的「異質性」(heterogeneity) 指的是什麼？", opts: ["所有研究結果完全一致", "合併研究之間效應量的差異或不一致程度", "只有一個研究的情況", "統計軟體的一種功能"], exp: "異質性指納入統合分析的各研究之間效應量存在差異，超出了隨機抽樣誤差所能解釋的範圍。" },
    en: { q: "What does 'heterogeneity' mean in meta-analysis?", opts: ["All study results are perfectly consistent", "The degree of variation or inconsistency in effect sizes among pooled studies", "Having only one study", "A software feature"], exp: "Heterogeneity refers to variation in effect sizes among studies that exceeds what would be expected from sampling error alone." },
    correct: 1
  },
  {
    id: "c5-002", category: 0,
    zh: { q: "用「平均溫度」來比喻，為什麼高異質性下的合併效應量可能無意義？", opts: ["因為溫度不能平均", "如果一個城市在北極、一個在撒哈拉，平均溫度既不代表北極也不代表撒哈拉", "因為只需要看最大的城市", "平均溫度永遠有意義"], exp: "就像平均北極和撒哈拉的溫度一樣——結果是一個不代表任何地方的數字。當研究差異極大時，合併效應也可能如此。" },
    en: { q: "Using a 'mean temperature' analogy, why might a pooled effect be meaningless under high heterogeneity?", opts: ["Temperatures can't be averaged", "If one city is Arctic and one is Sahara, the mean represents neither place", "Only the largest city matters", "Mean temperature is always meaningful"], exp: "Like averaging Arctic and Sahara temperatures — the result represents neither location. When studies differ wildly, the pooled effect may be equally meaningless." },
    correct: 1
  },
  {
    id: "c5-003", category: 0,
    zh: { q: "異質性為什麼重要？", opts: ["它不重要，可以忽略", "它告訴我們合併效應量是否可靠、以及是否需要進一步探究研究間差異的原因", "它只是一個統計學術語", "只有大型研究才需要考慮"], exp: "高異質性意味著「一刀切」的合併結論可能不可靠，需要探索為什麼研究結果不一致。" },
    en: { q: "Why does heterogeneity matter?", opts: ["It doesn't; it can be ignored", "It tells us whether the pooled effect is reliable and whether we should investigate why studies differ", "It's just a statistical term", "Only relevant for large studies"], exp: "High heterogeneity means a 'one-size-fits-all' pooled conclusion may be unreliable — we need to explore why results are inconsistent." },
    correct: 1
  },
  {
    id: "c5-004", category: 0,
    zh: { q: "如果所有研究的效應量幾乎完全相同，異質性會是？", opts: ["非常高", "很低或接近零", "無法判斷", "和效應量無關"], exp: "效應量一致代表研究間差異很小，異質性接近零——這是合併結果最可信的情況。" },
    en: { q: "If all studies have nearly identical effect sizes, heterogeneity will be?", opts: ["Very high", "Very low or near zero", "Cannot determine", "Unrelated to effect sizes"], exp: "Consistent effect sizes mean little between-study variation — heterogeneity near zero. This is when pooled results are most trustworthy." },
    correct: 1
  },
  {
    id: "c5-005", category: 0,
    zh: { q: "從森林圖上，如何初步判斷異質性的高低？", opts: ["看菱形的大小", "看各研究的 CI 是否有大量重疊（重疊多 = 低異質性）、效應量方向是否一致", "看研究數量", "看無效線位置"], exp: "如果各研究的 CI 大量重疊且效應量方向一致，異質性可能較低。如果散布很廣、方向不一，可能異質性高。" },
    en: { q: "How can you initially judge heterogeneity from a forest plot?", opts: ["By diamond size", "By whether study CIs overlap substantially (more overlap = lower heterogeneity) and effect directions are consistent", "By study count", "By null line position"], exp: "If CIs overlap substantially and effects point in the same direction, heterogeneity is likely low. Wide scatter with varying directions suggests high heterogeneity." },
    correct: 1
  },
  {
    id: "c5-006", category: 0,
    zh: { q: "以下哪個說法是正確的？", opts: ["異質性只在隨機效應模型中存在", "異質性是統合分析中不可避免的問題，無論用什麼模型都應該評估", "異質性高就不能做統合分析", "異質性只看 p 值就能判斷"], exp: "異質性是任何統合分析都應該評估的。高異質性不代表不能做統合分析，但可能需要更謹慎的解讀和進一步探索。" },
    en: { q: "Which statement is correct?", opts: ["Heterogeneity only exists in random-effects models", "Heterogeneity is unavoidable and should be assessed regardless of the model used", "High heterogeneity means you can't do meta-analysis", "Heterogeneity can be judged by p-value alone"], exp: "Heterogeneity should be assessed in any meta-analysis. High heterogeneity doesn't prohibit meta-analysis but calls for cautious interpretation and further exploration." },
    correct: 1
  },
  {
    id: "c5-007", category: 0,
    zh: { q: "「研究間變異」和「研究內變異」的差別是什麼？", opts: ["沒有差別", "研究間變異是不同研究效應量的差異；研究內變異是同一研究內的抽樣誤差", "研究內變異比較重要", "研究間變異就是偏誤"], exp: "研究內變異來自抽樣誤差（每個研究的 SE），研究間變異反映真實效應在不同研究間的差異（τ²）。異質性主要關注後者。" },
    en: { q: "What is the difference between 'between-study' and 'within-study' variation?", opts: ["No difference", "Between-study: differences in effect sizes across studies; within-study: sampling error within a single study", "Within-study is more important", "Between-study variation is bias"], exp: "Within-study variation comes from sampling error (each study's SE); between-study variation reflects true differences in effects across studies (τ²). Heterogeneity focuses on the latter." },
    correct: 1
  },
  {
    id: "c5-008", category: 0,
    zh: { q: "統合分析如果只報告合併效應量而不報告異質性，有什麼問題？", opts: ["沒有問題", "讀者無法判斷合併結果是否可信，以及各研究是否一致", "異質性不需要報告", "只有審稿人需要看"], exp: "不報告異質性就像公布民調結果但不告訴你調查的地區是否一致——讀者無法評估結論的可靠性。" },
    en: { q: "What's the problem if a meta-analysis reports the pooled effect but NOT heterogeneity?", opts: ["No problem", "Readers cannot judge if the pooled result is trustworthy or if studies are consistent", "Heterogeneity doesn't need reporting", "Only reviewers need it"], exp: "Not reporting heterogeneity is like announcing poll results without saying whether regions agree — readers can't assess how reliable the conclusion is." },
    correct: 1
  },
  {
    id: "c5-009", category: 0,
    zh: { q: "以下哪個不是異質性帶來的挑戰？", opts: ["合併效應量可能不具代表性", "需要探索為什麼研究結果不同", "讓統合分析完全不必要", "合併效應的信賴區間可能被低估（如果忽略）"], exp: "異質性帶來解讀挑戰，但不會讓統合分析「不必要」。反而更需要探索原因和使用合適的模型。" },
    en: { q: "Which is NOT a challenge caused by heterogeneity?", opts: ["Pooled effect may not be representative", "Need to explore why results differ", "Makes meta-analysis completely unnecessary", "CI may be underestimated if ignored"], exp: "Heterogeneity creates interpretive challenges but doesn't make meta-analysis unnecessary — it actually makes exploration and appropriate modeling more important." },
    correct: 2
  },
  {
    id: "c5-010", category: 0,
    zh: { q: "「期望零異質性是不現實的」——為什麼？", opts: ["因為統計軟體總會算出一些異質性", "因為不同研究的人群、設定、方法學很難完全相同，總會有些差異", "因為異質性是隨機的", "因為只有理論研究沒有異質性"], exp: "現實中，不同研究在人群特徵、劑量、追蹤時間、研究設計上總有差異。完全零異質性在實踐中幾乎不會出現。" },
    en: { q: "'Expecting zero heterogeneity is unrealistic' — why?", opts: ["Software always calculates some", "Different studies' populations, settings, and methods are never perfectly identical", "Heterogeneity is random", "Only theoretical studies have zero heterogeneity"], exp: "In reality, studies always differ in population, dose, follow-up, design. Zero heterogeneity is virtually never achieved in practice." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 1: I², Q statistic, and prediction intervals (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c5-011", category: 1,
    zh: { q: "Cochran's Q 檢定的目的是什麼？", opts: ["計算合併效應量", "檢測研究間的變異是否超出抽樣誤差可解釋的範圍", "測量效應量的大小", "決定使用哪種效應量"], exp: "Q 檢定是一個卡方類的統計檢定，檢驗「所有研究效應量相同」的虛無假設——即異質性是否顯著。" },
    en: { q: "What is the purpose of Cochran's Q test?", opts: ["Calculate pooled effect", "Test whether between-study variation exceeds what sampling error alone can explain", "Measure effect size magnitude", "Decide which effect size to use"], exp: "The Q test is a chi-squared type test that tests the null hypothesis that all studies share the same effect — i.e., whether heterogeneity is statistically significant." },
    correct: 1
  },
  {
    id: "c5-012", category: 1,
    zh: { q: "Q 檢定的一個主要限制是什麼？", opts: ["太敏感，永遠顯著", "當研究數量少時統計效力低（容易漏掉真實異質性），研究數量多時又容易達顯著", "它完美無缺", "只能用於連續性結局"], exp: "Q 的效力取決於研究數量：少量研究可能無法偵測到異質性（假陰性），大量研究可能對微小異質性也顯著。" },
    en: { q: "What is a major limitation of the Q test?", opts: ["Too sensitive; always significant", "Low power with few studies (may miss real heterogeneity) and oversensitive with many studies", "It's flawless", "Only for continuous outcomes"], exp: "Q's power depends on the number of studies: few studies may miss heterogeneity (false negatives), while many studies can make even trivial heterogeneity significant." },
    correct: 1
  },
  {
    id: "c5-013", category: 1,
    zh: { q: "I² 統計量衡量的是什麼？", opts: ["效應量的大小", "研究間變異占總變異的百分比——即多少比例的差異來自真實異質性而非抽樣誤差", "研究數量", "合併效應的精確度"], exp: "I² = (Q − df)/Q × 100%，表示總變異中有多少是由真實的研究間差異造成的，範圍 0% 到接近 100%。" },
    en: { q: "What does the I² statistic measure?", opts: ["Effect size magnitude", "The percentage of total variation due to real between-study differences rather than sampling error", "Number of studies", "Precision of pooled effect"], exp: "I² = (Q − df)/Q × 100%, representing the proportion of total variation attributable to genuine between-study differences, ranging from 0% to near 100%." },
    correct: 1
  },
  {
    id: "c5-014", category: 1,
    zh: { q: "I² = 75% 通常被解讀為什麼程度的異質性？", opts: ["無異質性", "低度異質性", "中度異質性", "高度異質性"], exp: "Cochrane 的慣例：I² ≈ 25% 為低，≈ 50% 為中，≈ 75% 為高。75% 代表大部分差異來自真實的研究間差異。" },
    en: { q: "I² = 75% is generally interpreted as what level of heterogeneity?", opts: ["No heterogeneity", "Low", "Moderate", "High"], exp: "Cochrane conventions: I² ≈ 25% is low, ≈ 50% moderate, ≈ 75% high. 75% means most variation comes from real between-study differences." },
    correct: 3
  },
  {
    id: "c5-015", category: 1,
    zh: { q: "I² = 0% 一定代表研究間沒有異質性嗎？", opts: ["是的，I² = 0% 代表完全沒有異質性", "不一定——可能只是研究太少，I² 的估計不精確", "I² = 0% 代表異質性最高", "I² 不能等於 0%"], exp: "I² = 0% 可能是因為真的沒有異質性，也可能因為研究數太少導致 I² 的精確度差。不應僅憑 I² = 0% 就下結論。" },
    en: { q: "Does I² = 0% definitely mean no heterogeneity?", opts: ["Yes, I² = 0% means absolutely no heterogeneity", "Not necessarily — few studies may make I² imprecise", "I² = 0% means highest heterogeneity", "I² cannot equal 0%"], exp: "I² = 0% could mean genuine homogeneity or simply imprecise estimation due to too few studies. Don't conclude 'no heterogeneity' from I² = 0% alone." },
    correct: 1
  },
  {
    id: "c5-016", category: 1,
    zh: { q: "預測區間 (prediction interval) 和合併效應量的 CI 有什麼不同？", opts: ["完全相同", "預測區間表示未來一個新研究的真實效應可能落在的範圍，通常比合併 CI 更寬", "預測區間更窄", "預測區間不需要計算"], exp: "合併 CI 是合併效應量的不確定性。預測區間考慮了研究間的異質性，預測一個新研究的效應可能在哪裡——通常寬得多。" },
    en: { q: "How does a prediction interval differ from the CI of the pooled effect?", opts: ["They're identical", "Prediction interval shows where a future study's true effect would likely fall — usually much wider than the pooled CI", "Prediction interval is narrower", "Prediction interval doesn't need calculation"], exp: "The pooled CI reflects uncertainty around the mean effect. The prediction interval accounts for between-study variability, showing where a NEW study's effect might fall — usually much wider." },
    correct: 1
  },
  {
    id: "c5-017", category: 1,
    zh: { q: "如果 I² = 80% 但合併效應的 CI 不包含無效值，這意味著？", opts: ["結果完全可靠，不需要擔心", "合併效應平均而言顯著，但由於高異質性，不同研究之間的效果差異很大，需要探索原因", "統計錯誤", "I² 一定算錯了"], exp: "統計顯著不代表研究一致。I² = 80% 說明研究間差異極大，即使合併效應顯著，也需要探索為什麼，不能一概而論。" },
    en: { q: "If I² = 80% but pooled CI excludes the null, this means?", opts: ["Completely reliable; no worries", "The pooled effect is significant on average, but high heterogeneity means effects vary greatly — investigation needed", "Statistical error", "I² must be wrong"], exp: "Significance doesn't mean consistency. I² = 80% indicates huge variation — even though the pooled effect is significant, you must investigate why studies differ so much." },
    correct: 1
  },
  {
    id: "c5-018", category: 1,
    zh: { q: "以下哪個指標不受研究數量多少的影響？", opts: ["Cochran's Q p 值", "I² 統計量（相對穩定）", "研究的總權重", "效應量的數量"], exp: "I² 是一個百分比指標，不直接受研究數量影響（不像 Q 的 p 值）。但少量研究時 I² 的精確度仍然較差。" },
    en: { q: "Which measure is least affected by the number of studies?", opts: ["Cochran's Q p-value", "I² statistic (relatively stable)", "Total study weight", "Number of effect sizes"], exp: "I² is a percentage metric not directly affected by study count (unlike Q's p-value). However, with very few studies, I² estimates are still imprecise." },
    correct: 1
  },
  {
    id: "c5-019", category: 1,
    zh: { q: "τ²（tau-squared）和 I² 的關係是？", opts: ["完全無關", "τ² 是研究間變異的絕對值，I² 是研究間變異占總變異的百分比", "τ² 和 I² 是相同的", "τ² 只在固定效應中使用"], exp: "τ² 是研究間變異的絕對量（absolute measure），I² 是相對量（百分比）。兩者互補，共同描述異質性。" },
    en: { q: "What is the relationship between τ² and I²?", opts: ["Completely unrelated", "τ² is the absolute between-study variance; I² is the percentage of total variation due to between-study variance", "They're identical", "τ² only used in fixed-effect"], exp: "τ² is the absolute measure of between-study variance; I² is the relative measure (percentage). They complement each other in describing heterogeneity." },
    correct: 1
  },
  {
    id: "c5-020", category: 1,
    zh: { q: "報告異質性時，最佳做法是？", opts: ["只報告 I²", "只報告 Q 的 p 值", "同時報告 Q 統計量及其 p 值、I² 及其 CI、以及 τ²", "不需要報告"], exp: "完整報告應包括 Q（及 p 值）、I²（及其 CI）、τ²。這樣讀者可以全面評估異質性。" },
    en: { q: "Best practice for reporting heterogeneity is?", opts: ["Only I²", "Only Q's p-value", "Report Q statistic with p-value, I² with CI, and τ² together", "No need to report"], exp: "Complete reporting includes Q (with p-value), I² (with its CI), and τ². This gives readers a comprehensive picture of heterogeneity." },
    correct: 2
  },

  // ════════════════════════════════════════
  // Category 2: Sources of heterogeneity (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c5-021", category: 2,
    zh: { q: "「臨床異質性」(clinical diversity) 指的是什麼？", opts: ["研究使用不同的統計方法", "研究在族群特徵、介入劑量、結局定義或追蹤時間等臨床方面的差異", "研究的品質不同", "研究數量不同"], exp: "臨床異質性來自臨床層面的差異：不同病人族群、藥物劑量、治療時間、結局定義等。" },
    en: { q: "What does 'clinical diversity' refer to?", opts: ["Studies use different statistical methods", "Differences in populations, intervention doses, outcome definitions, or follow-up duration across studies", "Studies have different quality", "Different numbers of studies"], exp: "Clinical diversity arises from clinical-level differences: different patient populations, drug doses, treatment durations, outcome definitions, etc." },
    correct: 1
  },
  {
    id: "c5-022", category: 2,
    zh: { q: "「方法學異質性」(methodological diversity) 的例子是？", opts: ["不同研究的病人年齡不同", "研究設計不同（如 RCT vs 觀察性研究）、偏倚風險水平不同", "使用不同劑量", "追蹤時間不同"], exp: "方法學異質性來自研究方法的差異：RCT vs 觀察性、開放標籤 vs 雙盲、高偏倚 vs 低偏倚等。" },
    en: { q: "An example of 'methodological diversity' is?", opts: ["Patient ages differ across studies", "Different study designs (RCT vs observational), different risk of bias levels", "Different doses", "Different follow-up times"], exp: "Methodological diversity comes from differences in research methods: RCT vs observational, open-label vs double-blind, high vs low risk of bias, etc." },
    correct: 1
  },
  {
    id: "c5-023", category: 2,
    zh: { q: "「統計異質性」(statistical heterogeneity) 與前兩者的關係是？", opts: ["完全獨立", "統計異質性是臨床和/或方法學異質性在數據上的反映", "統計異質性更重要", "統計異質性不需要關注"], exp: "統計異質性（I²、Q）是臨床和方法學異質性在效應量上的「量化表現」。看到統計異質性高時，應回頭找臨床或方法學原因。" },
    en: { q: "How does 'statistical heterogeneity' relate to clinical and methodological diversity?", opts: ["Completely independent", "Statistical heterogeneity is the data-level manifestation of clinical and/or methodological diversity", "Statistical heterogeneity is more important", "Doesn't need attention"], exp: "Statistical heterogeneity (I², Q) is the 'quantified reflection' of clinical and methodological differences. When it's high, look for clinical or methodological explanations." },
    correct: 1
  },
  {
    id: "c5-024", category: 2,
    zh: { q: "以下哪個不是臨床異質性的來源？", opts: ["納入的病人年齡範圍不同", "藥物劑量不同", "使用了不同的隨機分配方法", "結局測量時間點不同"], exp: "不同的隨機分配方法屬於方法學異質性，不是臨床異質性。其餘三項都是臨床層面的差異。" },
    en: { q: "Which is NOT a source of clinical heterogeneity?", opts: ["Different patient age ranges", "Different drug doses", "Different randomization methods used", "Different outcome measurement time points"], exp: "Different randomization methods is methodological heterogeneity, not clinical. The other three are clinical-level differences." },
    correct: 2
  },
  {
    id: "c5-025", category: 2,
    zh: { q: "當異質性高時，正確的做法是？", opts: ["直接忽略異質性報告合併結果", "只報告 I² 就夠了", "探索異質性的來源（臨床、方法學），而不只是報告 I²", "刪除所有結果不同的研究"], exp: "高異質性是一個信號，提示需要探索原因。可以透過亞組分析或統合迴歸來找出哪些因素解釋了差異。" },
    en: { q: "When heterogeneity is high, the correct approach is?", opts: ["Ignore it and report pooled results", "Reporting I² alone is sufficient", "Investigate the sources of heterogeneity (clinical, methodological), not just report I²", "Delete all studies with different results"], exp: "High heterogeneity is a signal to investigate causes. Subgroup analysis or meta-regression can help identify which factors explain the differences." },
    correct: 2
  },
  {
    id: "c5-026", category: 2,
    zh: { q: "一項關於降血壓藥的統合分析發現 I² = 85%。可能的臨床異質性原因包括？", opts: ["只有統計方法不同", "納入的試驗有不同劑量、不同病人族群（年輕 vs 老年）、不同基線血壓", "所有研究完全相同", "只是隨機波動"], exp: "I² = 85% 很高。不同劑量（10mg vs 20mg）、不同人群（年輕人 vs 老年人）、不同基線血壓都是常見的臨床異質性來源。" },
    en: { q: "A BP-lowering drug meta-analysis finds I² = 85%. Possible clinical heterogeneity sources?", opts: ["Only statistical methods differ", "Trials used different doses, different populations (young vs elderly), different baseline BP", "All studies identical", "Just random fluctuation"], exp: "I² = 85% is high. Different doses (10mg vs 20mg), populations (young vs elderly), and baseline BP levels are common sources of clinical heterogeneity." },
    correct: 1
  },
  {
    id: "c5-027", category: 2,
    zh: { q: "「無法解釋的異質性」(unexplained heterogeneity) 指的是？", opts: ["異質性不存在", "即使探索了臨床和方法學因素，仍有部分研究間差異無法解釋", "異質性太低不需要解釋", "異質性來自統計錯誤"], exp: "即使做了亞組分析和統合迴歸，有時仍有殘餘異質性無法完全歸因於已知因素——這很正常，應如實報告。" },
    en: { q: "'Unexplained heterogeneity' refers to?", opts: ["Heterogeneity doesn't exist", "Between-study variation that remains even after exploring clinical and methodological factors", "Heterogeneity too low to explain", "From statistical errors"], exp: "Even after subgroup analysis and meta-regression, some residual heterogeneity may remain unexplained — this is normal and should be honestly reported." },
    correct: 1
  },
  {
    id: "c5-028", category: 2,
    zh: { q: "如果不同研究對同一結局的定義不同（如「腎功能惡化」的標準不同），這屬於什麼異質性？", opts: ["統計異質性", "臨床異質性（結局定義差異）", "方法學異質性", "無異質性"], exp: "結局定義的差異是臨床層面的差異——雖然都叫「腎功能惡化」，但標準不同（eGFR 下降 30% vs 40%），會導致效應量不同。" },
    en: { q: "If studies define the same outcome differently (e.g., different thresholds for 'renal decline'), this is what type of heterogeneity?", opts: ["Statistical", "Clinical heterogeneity (outcome definition differences)", "Methodological", "No heterogeneity"], exp: "Differences in outcome definitions are clinical-level: even though all called 'renal decline,' different thresholds (eGFR drop 30% vs 40%) lead to different effect sizes." },
    correct: 1
  },
  {
    id: "c5-029", category: 2,
    zh: { q: "以下哪種做法無法幫助探索異質性？", opts: ["亞組分析", "統合迴歸", "增加小數位數報告 I²", "敏感性分析"], exp: "把 I² 報告到更多小數位不會幫助理解異質性的原因。亞組分析、統合迴歸和敏感性分析才是探索工具。" },
    en: { q: "Which approach does NOT help explore heterogeneity?", opts: ["Subgroup analysis", "Meta-regression", "Reporting I² to more decimal places", "Sensitivity analysis"], exp: "Reporting I² to more decimal places doesn't help understand why heterogeneity exists. Subgroup analysis, meta-regression, and sensitivity analysis are actual exploration tools." },
    correct: 2
  },
  {
    id: "c5-030", category: 2,
    zh: { q: "在 protocol 階段就應該預先設定可能的異質性探索因素，這是為什麼？", opts: ["為了讓分析更複雜", "為了避免事後（post-hoc）挖掘數據、製造虛假發現", "因為審稿人要求", "因為 I² 的計算需要"], exp: "預先設定探索因素可以避免在看到數據後才選擇性地做亞組分析——這會增加偶然發現的風險（釣魚式分析）。" },
    en: { q: "Why should potential heterogeneity exploration factors be pre-specified in the protocol?", opts: ["To make analysis more complex", "To avoid post-hoc data dredging and false findings", "Because reviewers require it", "Because I² calculations need it"], exp: "Pre-specifying factors prevents selective subgroup analysis after seeing data — which increases the risk of chance findings (data-dredging/fishing)." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 3: Subgroup analysis and meta-regression (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c5-031", category: 3,
    zh: { q: "亞組分析 (subgroup analysis) 的基本原理是什麼？", opts: ["把所有研究合在一起", "按照某個預設因素（如劑量高低）把研究分組，分別計算合併效應並比較", "只看最大的研究", "用統計方法消除異質性"], exp: "亞組分析是把研究按某個特徵（如高劑量 vs 低劑量）分成小組，分別做統合分析並比較，看該因素是否解釋了異質性。" },
    en: { q: "What is the basic principle of subgroup analysis?", opts: ["Pool all studies together", "Split studies by a pre-specified factor (e.g., high vs low dose), calculate pooled effects separately, and compare", "Only look at the largest study", "Statistically remove heterogeneity"], exp: "Subgroup analysis splits studies by a characteristic (e.g., high vs low dose), pools each group separately, and compares — testing whether that factor explains heterogeneity." },
    correct: 1
  },
  {
    id: "c5-032", category: 3,
    zh: { q: "亞組分析的一個重要注意事項是？", opts: ["可以隨意選擇分組因素", "分組因素最好在 protocol 中預先設定，且不宜太多（避免多重比較）", "亞組越多越好", "不需要做統計檢定"], exp: "亞組因素應預先設定（而非看到數據後才選），且數量有限。太多亞組比較會增加偶然顯著的風險。" },
    en: { q: "An important caveat of subgroup analysis is?", opts: ["You can choose factors freely", "Factors should be pre-specified in the protocol, and limited in number (avoid multiple comparisons)", "More subgroups are better", "No statistical test needed"], exp: "Subgroup factors should be pre-specified (not chosen after seeing data) and limited in number. Too many comparisons increase the risk of chance findings." },
    correct: 1
  },
  {
    id: "c5-033", category: 3,
    zh: { q: "統合迴歸 (meta-regression) 和亞組分析的主要區別是？", opts: ["完全相同", "統合迴歸處理連續型共變數（如劑量 10-50mg），亞組分析處理類別型分組", "統合迴歸更簡單", "亞組分析更精確"], exp: "亞組分析適用於類別變數（高/低劑量），統合迴歸適用於連續變數（可以看劑量從 10mg 到 50mg 的效應趨勢）。" },
    en: { q: "The main difference between meta-regression and subgroup analysis is?", opts: ["Identical", "Meta-regression handles continuous covariates (e.g., dose 10-50mg); subgroup analysis handles categorical splits", "Meta-regression is simpler", "Subgroup analysis is more precise"], exp: "Subgroup analysis works with categorical variables (high/low dose); meta-regression works with continuous covariates (examining the trend from 10mg to 50mg)." },
    correct: 1
  },
  {
    id: "c5-034", category: 3,
    zh: { q: "統合迴歸的圖形展示通常是什麼？", opts: ["森林圖", "氣泡圖 (bubble plot)：x 軸是共變數、y 軸是效應量、氣泡大小代表權重", "盒鬚圖", "漏斗圖"], exp: "氣泡圖顯示每個研究的效應量（y）對共變數（x），氣泡大小 = 權重，加上一條迴歸線顯示趨勢。" },
    en: { q: "Meta-regression results are typically shown as?", opts: ["Forest plot", "Bubble plot: x-axis = covariate, y-axis = effect size, bubble size = weight", "Box plot", "Funnel plot"], exp: "A bubble plot shows each study's effect (y) vs covariate (x), with bubble size = weight, plus a regression line showing the trend." },
    correct: 1
  },
  {
    id: "c5-035", category: 3,
    zh: { q: "統合迴歸的一個主要限制是？", opts: ["不需要足夠的研究數量", "至少需要 10 個研究才有足夠的統計效力，否則容易過度擬合", "它可以完美解釋所有異質性", "只能用一個共變數"], exp: "統合迴歸需要足夠多的研究（通常建議每個共變數至少 10 個研究），否則統計效力不足且容易產生不可靠的結果。" },
    en: { q: "A major limitation of meta-regression is?", opts: ["Doesn't need enough studies", "Needs at least ~10 studies per covariate for adequate power; otherwise risks overfitting", "Can perfectly explain all heterogeneity", "Only one covariate allowed"], exp: "Meta-regression needs sufficient studies (~10 per covariate) for adequate statistical power; otherwise results may be unreliable and overfit." },
    correct: 1
  },
  {
    id: "c5-036", category: 3,
    zh: { q: "在亞組分析中，如果兩個亞組的效應量方向相反（一組 OR < 1，一組 OR > 1），這暗示什麼？", opts: ["數據有錯", "該分組因素可能是異質性的重要來源——效果在不同亞組中真的不同", "統合分析完全失敗", "應該刪除結果相反的亞組"], exp: "方向相反的亞組結果強烈暗示該因素是效果修飾因子（effect modifier），解釋了為什麼整體合併結果的異質性高。" },
    en: { q: "In subgroup analysis, if two subgroups have opposite effect directions (one OR < 1, other OR > 1), this suggests?", opts: ["Data error", "The grouping factor may be an important source of heterogeneity — effects genuinely differ across subgroups", "Meta-analysis has completely failed", "Delete the opposing subgroup"], exp: "Opposite directions strongly suggest the factor is an effect modifier, explaining why overall pooled results show high heterogeneity." },
    correct: 1
  },
  {
    id: "c5-037", category: 3,
    zh: { q: "「生態謬誤」(ecological fallacy) 在統合迴歸中指什麼？", opts: ["把環境因素當成共變數", "用研究層級的資料推論個人層級的關係（如：研究平均年齡大→效果好，不代表年長個體效果更好）", "使用太多共變數", "只能用於生態學研究"], exp: "統合迴歸用的是研究層級平均值，不能直接推論到個體。例如，研究平均年齡高的效果好，不代表每個老年人效果都好。" },
    en: { q: "What is the 'ecological fallacy' in meta-regression?", opts: ["Using environmental factors as covariates", "Inferring individual-level relationships from study-level data (e.g., higher mean age → better effect doesn't mean older individuals respond better)", "Using too many covariates", "Only for ecology studies"], exp: "Meta-regression uses study-level averages, not individual data. E.g., studies with older populations showing better effects doesn't mean each older person responds better." },
    correct: 1
  },
  {
    id: "c5-038", category: 3,
    zh: { q: "亞組分析的結果應該如何在森林圖中呈現？", opts: ["只顯示整體合併結果", "森林圖按亞組分段，每個亞組有自己的菱形，最下方有整體菱形", "不能用森林圖", "只用數字表格"], exp: "分亞組的森林圖讓讀者一眼看到每個亞組的合併效應和整體效應，是最直觀的呈現方式。" },
    en: { q: "How should subgroup analysis results be presented in a forest plot?", opts: ["Only show overall pooled result", "Forest plot split by subgroup, each with its own diamond, plus an overall diamond at the bottom", "Can't use forest plots", "Only numeric tables"], exp: "A subgroup forest plot lets readers see each subgroup's pooled effect and the overall effect at a glance — the most intuitive presentation." },
    correct: 1
  },
  {
    id: "c5-039", category: 3,
    zh: { q: "亞組之間的差異檢定 (test for subgroup differences) 的 p 值 < 0.05 代表什麼？", opts: ["亞組一定有差異", "有統計證據表明亞組之間的合併效應不同，但需謹慎解讀", "亞組完全相同", "每個亞組的結果都顯著"], exp: "亞組差異檢定 p < 0.05 表示亞組間效應有統計顯著差異，但仍需考慮是否預先設定、是否有生物學合理性。" },
    en: { q: "If the test for subgroup differences yields p < 0.05, what does it mean?", opts: ["Subgroups definitely differ", "There's statistical evidence that pooled effects differ between subgroups, but cautious interpretation is needed", "Subgroups are identical", "Each subgroup result is significant"], exp: "p < 0.05 for subgroup differences suggests statistically different effects, but interpretation requires considering pre-specification and biological plausibility." },
    correct: 1
  },
  {
    id: "c5-040", category: 3,
    zh: { q: "統合迴歸中 R² 的意義是什麼？", opts: ["與個體研究的 R² 相同", "該共變數解釋了多少比例的研究間變異（τ²）", "是效應量的一種", "與異質性無關"], exp: "統合迴歸的 R² 表示共變數解釋了多少比例的 τ²（研究間變異）。R² = 40% 意味著該因素解釋了 40% 的異質性。" },
    en: { q: "What does R² mean in meta-regression?", opts: ["Same as individual study R²", "The proportion of between-study variance (τ²) explained by the covariate", "A type of effect size", "Unrelated to heterogeneity"], exp: "In meta-regression, R² indicates how much of τ² (between-study variance) the covariate explains. R² = 40% means 40% of heterogeneity is explained." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 4: Publication bias concept and funnel plots (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c5-041", category: 4,
    zh: { q: "「發表偏倚」(publication bias) 的核心問題是什麼？", opts: ["所有研究都被發表", "結果顯著的研究比不顯著的更容易被發表，導致「可得證據」是有偏差的", "只有大型研究被發表", "期刊偏好某些作者"], exp: "核心問題是「抽屜問題」：結果不顯著的研究更容易被束之高閣，導致統合分析只看到「陽性」結果，高估效應。" },
    en: { q: "What is the core problem of publication bias?", opts: ["All studies get published", "Studies with significant results are more likely to be published, making available evidence biased", "Only large studies get published", "Journals prefer certain authors"], exp: "The core is the 'file drawer problem': non-significant studies are more likely to remain unpublished, causing meta-analyses to see only 'positive' results and overestimate effects." },
    correct: 1
  },
  {
    id: "c5-042", category: 4,
    zh: { q: "「抽屜問題」(file drawer problem) 是什麼意思？", opts: ["研究者把文件放在抽屜裡", "結果不顯著的研究被擱置在研究者的抽屜裡不發表", "期刊的存檔問題", "統計檔案遺失"], exp: "Rosenthal 1979 年提出的概念：有多少「不顯著」的研究躺在抽屜裡沒被發表？如果有很多，我們看到的文獻是有偏差的。" },
    en: { q: "What does the 'file drawer problem' mean?", opts: ["Researchers store files in drawers", "Studies with non-significant results are shelved in researchers' drawers, unpublished", "Journal archiving issues", "Statistical file loss"], exp: "Concept from Rosenthal (1979): how many 'non-significant' studies sit in drawers unpublished? If many, the published literature we see is biased." },
    correct: 1
  },
  {
    id: "c5-043", category: 4,
    zh: { q: "漏斗圖 (funnel plot) 的 x 軸和 y 軸分別是什麼？", opts: ["x = 研究年份，y = 效應量", "x = 效應量，y = 精確度（如標準誤的倒數或樣本量）", "x = p 值，y = 效應量", "x = 權重，y = 研究數"], exp: "漏斗圖：x 軸 = 效應量，y 軸 = 精確度指標（標準誤或其倒數）。大型精確研究在上方，小型不精確研究在下方。" },
    en: { q: "What are the x and y axes of a funnel plot?", opts: ["x = publication year, y = effect size", "x = effect size, y = precision (e.g., SE or its inverse)", "x = p-value, y = effect size", "x = weight, y = study count"], exp: "Funnel plot: x = effect size, y = precision (SE or its inverse). Large precise studies cluster at the top; small imprecise ones spread at the bottom." },
    correct: 1
  },
  {
    id: "c5-044", category: 4,
    zh: { q: "一個對稱的漏斗圖暗示什麼？", opts: ["一定有發表偏倚", "沒有明顯的發表偏倚跡象", "研究品質都很高", "效應量都很大"], exp: "對稱漏斗圖表示小型研究的效應量均勻地分布在合併估計兩側——沒有明顯的系統性缺失，暗示發表偏倚風險較低。" },
    en: { q: "A symmetrical funnel plot suggests?", opts: ["Publication bias is present", "No obvious signs of publication bias", "All studies are high quality", "Effect sizes are all large"], exp: "A symmetrical funnel means small studies' effects are evenly distributed around the pooled estimate — no systematic gaps, suggesting lower risk of publication bias." },
    correct: 1
  },
  {
    id: "c5-045", category: 4,
    zh: { q: "漏斗圖不對稱時，底部一角的研究缺失，最可能的解釋是？", opts: ["隨機波動", "小型、結果不顯著的研究可能沒被發表（發表偏倚）", "大型研究被排除", "統計計算錯誤"], exp: "如果底部一角（小型、效應量小或方向不利的研究）缺失，最常見的解釋是這些研究存在但未被發表。" },
    en: { q: "When a funnel plot is asymmetric with a gap in one bottom corner, the most likely explanation is?", opts: ["Random variation", "Small studies with non-significant results may be unpublished (publication bias)", "Large studies excluded", "Statistical calculation error"], exp: "A gap in the bottom corner (small, non-significant, or unfavorable studies) most commonly suggests those studies exist but were never published." },
    correct: 1
  },
  {
    id: "c5-046", category: 4,
    zh: { q: "漏斗圖的不對稱一定是因為發表偏倚嗎？", opts: ["是的，只有發表偏倚會造成", "不一定——也可能是真正的異質性、小型研究效應、研究品質差異等原因", "漏斗圖永遠是對稱的", "不對稱代表數據有錯"], exp: "不對稱有多種可能原因：發表偏倚、小型研究效應（小型研究品質較差或選擇性報告）、真正的異質性等。需要綜合判斷。" },
    en: { q: "Is funnel plot asymmetry always due to publication bias?", opts: ["Yes, only publication bias causes it", "Not necessarily — could also be true heterogeneity, small-study effects, or quality differences", "Funnel plots are always symmetric", "Asymmetry means data errors"], exp: "Asymmetry has multiple possible causes: publication bias, small-study effects (lower quality or selective reporting), genuine heterogeneity. Comprehensive judgment is needed." },
    correct: 1
  },
  {
    id: "c5-047", category: 4,
    zh: { q: "漏斗圖至少需要多少個研究才有意義？", opts: ["3 個就夠了", "通常建議至少 10 個研究，否則漏斗圖的判讀不可靠", "1 個就可以畫", "越少越好"], exp: "研究數量太少（<10）時，漏斗圖的形狀幾乎無法判讀是否對稱。通常建議至少 10 個研究。" },
    en: { q: "How many studies are needed for a meaningful funnel plot?", opts: ["3 is enough", "Usually at least 10 studies; fewer makes interpretation unreliable", "1 study can make a funnel plot", "Fewer is better"], exp: "With fewer than ~10 studies, funnel plot shape is nearly impossible to interpret. At least 10 studies are generally recommended." },
    correct: 1
  },
  {
    id: "c5-048", category: 4,
    zh: { q: "發表偏倚如果存在，會對統合分析的合併效應量產生什麼影響？", opts: ["使效應量更接近零", "傾向於高估效應量（因為不顯著的小效應研究缺失）", "沒有影響", "使效應量變成負數"], exp: "如果不顯著（效應小）的研究沒被發表，合併效應會被那些「成功」發表的研究拉高——系統性地高估真實效果。" },
    en: { q: "If publication bias exists, how does it affect the pooled effect?", opts: ["Makes it closer to zero", "Tends to overestimate the effect (because non-significant small-effect studies are missing)", "No effect", "Makes the effect negative"], exp: "If studies with small/null effects aren't published, the pooled effect is pulled upward by the 'successfully published' studies — systematically overestimating the true effect." },
    correct: 1
  },
  {
    id: "c5-049", category: 4,
    zh: { q: "以下哪個不是減少發表偏倚的方法？", opts: ["搜尋灰色文獻（未發表的論文、會議摘要）", "註冊研究方案（如 PROSPERO）", "只搜尋 PubMed 一個資料庫", "搜尋臨床試驗登錄資料庫"], exp: "只搜尋一個資料庫會增加漏掉研究的風險。搜尋灰色文獻、註冊方案、多資料庫搜尋都是減少發表偏倚的策略。" },
    en: { q: "Which is NOT a method to reduce publication bias?", opts: ["Searching grey literature (unpublished papers, conference abstracts)", "Registering review protocol (e.g., PROSPERO)", "Searching only PubMed", "Searching clinical trial registries"], exp: "Only searching one database increases the risk of missing studies. Grey literature, protocol registration, and multi-database searching all help reduce publication bias." },
    correct: 2
  },
  {
    id: "c5-050", category: 4,
    zh: { q: "為什麼「結果導向報告」(outcome reporting bias) 也是發表偏倚的一種？", opts: ["因為所有結局都被完整報告", "因為研究者可能只報告顯著的結局而隱藏不顯著的結局，扭曲可得證據", "因為結局不重要", "這不屬於偏倚"], exp: "即使研究被發表了，如果只報告了有利的結局而隱藏了不利的，統合分析仍會受到偏差影響。" },
    en: { q: "Why is 'outcome reporting bias' also a form of publication bias?", opts: ["All outcomes are fully reported", "Researchers may report only significant outcomes while hiding non-significant ones, distorting available evidence", "Outcomes don't matter", "Not a form of bias"], exp: "Even if a study is published, selectively reporting only favorable outcomes while hiding unfavorable ones still biases the meta-analysis." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 5: Egger's test, trim-and-fill, and other detection methods (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c5-051", category: 5,
    zh: { q: "Egger's test 的目的是什麼？", opts: ["計算合併效應量", "對漏斗圖的不對稱進行統計檢定", "測量異質性", "評估研究品質"], exp: "Egger's test 是一個迴歸方法，統計檢定漏斗圖是否不對稱——即是否有小型研究效應/發表偏倚的證據。" },
    en: { q: "What is the purpose of Egger's test?", opts: ["Calculate pooled effect", "Statistically test funnel plot asymmetry", "Measure heterogeneity", "Assess study quality"], exp: "Egger's test is a regression method that statistically tests whether the funnel plot is asymmetric — i.e., whether there's evidence of small-study effects/publication bias." },
    correct: 1
  },
  {
    id: "c5-052", category: 5,
    zh: { q: "Egger's test 的 p < 0.05 代表什麼？", opts: ["合併效應顯著", "有統計證據顯示漏斗圖不對稱（可能存在發表偏倚）", "異質性很高", "研究品質很差"], exp: "Egger's test p < 0.05 表示漏斗圖統計上不對稱，提示可能存在發表偏倚或小型研究效應。但需結合其他資訊判斷。" },
    en: { q: "Egger's test p < 0.05 indicates?", opts: ["Pooled effect is significant", "Statistical evidence of funnel asymmetry (possible publication bias)", "High heterogeneity", "Poor study quality"], exp: "Egger's p < 0.05 means statistically significant funnel asymmetry, suggesting possible publication bias or small-study effects. But must be interpreted alongside other evidence." },
    correct: 1
  },
  {
    id: "c5-053", category: 5,
    zh: { q: "Egger's test 的主要限制是什麼？", opts: ["太簡單", "研究數量少時（<10）統計效力不足，且可能有很高的偽陽性或偽陰性率", "不需要漏斗圖", "只能用於 OR"], exp: "和漏斗圖一樣，Egger's test 在研究數量少時表現不佳——可能漏掉真正的發表偏倚，或在沒有偏倚時給出假警報。" },
    en: { q: "The main limitation of Egger's test is?", opts: ["Too simple", "Low power with <10 studies, and may have high false-positive or false-negative rates", "Doesn't need a funnel plot", "Only works for OR"], exp: "Like funnel plots, Egger's test performs poorly with few studies — may miss real bias or give false alarms when none exists." },
    correct: 1
  },
  {
    id: "c5-054", category: 5,
    zh: { q: "「修剪填補法」(trim-and-fill) 做了什麼？", opts: ["刪除所有小型研究", "假設漏斗圖應該對稱，估計「缺失」的研究並填補進去，重新計算合併效應", "只修剪極端值", "增加新的研究"], exp: "修剪填補法透過統計方法估計「缺失」的研究（填補漏斗圖的空白處），然後重新計算調整後的合併效應量。" },
    en: { q: "What does the 'trim-and-fill' method do?", opts: ["Deletes all small studies", "Assumes the funnel should be symmetric, imputes 'missing' studies, and recalculates the pooled effect", "Only trims extreme values", "Adds new studies"], exp: "Trim-and-fill statistically estimates 'missing' studies (filling funnel gaps), then recalculates the adjusted pooled effect." },
    correct: 1
  },
  {
    id: "c5-055", category: 5,
    zh: { q: "修剪填補法調整後的合併效應通常會？", opts: ["變大", "變小（更接近無效值），因為「填補」的研究通常效應較小", "不變", "變得不顯著"], exp: "填補的「缺失」研究通常是小型、效應小/不顯著的研究，所以加入後會把合併效應拉向無效值（變小）。" },
    en: { q: "After trim-and-fill adjustment, the pooled effect usually?", opts: ["Gets larger", "Gets smaller (closer to null), because imputed studies typically have smaller effects", "Stays the same", "Becomes non-significant"], exp: "Imputed 'missing' studies are typically small with weak effects, pulling the pooled effect toward the null (making it smaller) after inclusion." },
    correct: 1
  },
  {
    id: "c5-056", category: 5,
    zh: { q: "除了 Egger's test，還有哪些發表偏倚的檢測方法？", opts: ["只有 Egger's test", "Begg's rank correlation test、Peters' test、Harbord's test 等", "只有漏斗圖", "p 值就夠了"], exp: "多種方法可用：Begg's test（秩相關）、Peters' test、Harbord's test（針對 OR）。不同方法適用不同情況，可互補。" },
    en: { q: "Besides Egger's test, what other publication bias detection methods exist?", opts: ["Only Egger's", "Begg's rank correlation test, Peters' test, Harbord's test, etc.", "Only funnel plots", "p-value alone suffices"], exp: "Multiple methods: Begg's test (rank correlation), Peters' test, Harbord's test (for OR). Different methods suit different situations and complement each other." },
    correct: 1
  },
  {
    id: "c5-057", category: 5,
    zh: { q: "敏感性分析 (sensitivity analysis) 如何幫助評估發表偏倚的影響？", opts: ["不相關", "可以逐一排除最小的研究或最極端的結果，觀察合併效應是否穩定", "只是換個統計方法", "只看最大的研究"], exp: "透過逐一移除研究（leave-one-out）或排除特定特徵的研究，如果合併效應大幅改變，可能暗示結果受少數研究過度影響。" },
    en: { q: "How does sensitivity analysis help assess publication bias impact?", opts: ["Not related", "By sequentially excluding smallest or most extreme studies to see if the pooled effect is stable", "Just changing statistical methods", "Only looking at largest study"], exp: "By leave-one-out analysis or excluding specific studies, if the pooled effect changes drastically, this may suggest the result is overly influenced by a few studies." },
    correct: 1
  },
  {
    id: "c5-058", category: 5,
    zh: { q: "以下哪項是正確的？", opts: ["如果 Egger's test 不顯著，就一定沒有發表偏倚", "發表偏倚的檢測工具都有限制，沒有任何單一方法能確定發表偏倚的存在", "修剪填補法可以完全消除發表偏倚", "漏斗圖對稱就絕對沒有偏倚"], exp: "所有檢測工具都有局限性。Egger's test 不顯著可能只是統計效力不足；漏斗圖對稱也可能有其他偏倚形式存在。" },
    en: { q: "Which statement is correct?", opts: ["Non-significant Egger's test means no publication bias", "All detection tools have limitations; no single method can definitively prove publication bias exists or not", "Trim-and-fill completely eliminates publication bias", "Symmetric funnel means absolutely no bias"], exp: "All detection tools are limited. Non-significant Egger's may just lack power; symmetric funnels may hide other forms of bias. No single tool is definitive." },
    correct: 1
  },
  {
    id: "c5-059", category: 5,
    zh: { q: "Fail-safe N（安全數量）的概念是什麼？", opts: ["需要淘汰多少研究", "需要多少個效應為零的「缺失」研究才能使合併效應變得不顯著", "最少需要幾個研究做統合分析", "研究的品質門檻"], exp: "Fail-safe N 計算需要多少個「零效應」研究才能讓目前顯著的合併效應變為不顯著。數字越大，結果越穩健。" },
    en: { q: "What is the concept of 'Fail-safe N'?", opts: ["Number of studies to eliminate", "How many null-effect 'missing' studies would be needed to make the pooled effect non-significant", "Minimum studies for meta-analysis", "Quality threshold"], exp: "Fail-safe N calculates how many 'zero-effect' studies would be needed to turn the current significant pooled effect non-significant. Higher = more robust." },
    correct: 1
  },
  {
    id: "c5-060", category: 5,
    zh: { q: "在報告發表偏倚評估結果時，最佳做法是？", opts: ["不需要報告", "綜合報告漏斗圖（視覺）+ Egger's test（統計）+ 修剪填補結果（調整後效應），並討論局限性", "只畫漏斗圖", "只報告 Egger's p 值"], exp: "最佳做法是多方法並行：漏斗圖（視覺判斷）、統計檢定（Egger's）、校正方法（修剪填補），並明確討論每種方法的局限。" },
    en: { q: "Best practice for reporting publication bias assessment?", opts: ["No need to report", "Comprehensive: funnel plot (visual) + Egger's test (statistical) + trim-and-fill results (adjusted effect), with limitations discussed", "Just draw funnel plot", "Only report Egger's p-value"], exp: "Best practice: use multiple methods — funnel plot (visual), Egger's test (statistical), trim-and-fill (adjusted effect) — and explicitly discuss each method's limitations." },
    correct: 1
  },

  // ════════════════════════════════════════
  // Category 6: PRISMA reporting and overall interpretation pitfalls (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c5-061", category: 6,
    zh: { q: "PRISMA 2020 是什麼？", opts: ["一種統計方法", "系統性回顧和統合分析報告的國際準則（清單和流程圖）", "一個資料庫", "一種研究設計"], exp: "PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) 是報告系統性回顧的國際標準，包含清單項目和流程圖。" },
    en: { q: "What is PRISMA 2020?", opts: ["A statistical method", "International reporting guideline for systematic reviews and meta-analyses (checklist + flow diagram)", "A database", "A study design"], exp: "PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) is the international standard for reporting systematic reviews, including a checklist and flow diagram." },
    correct: 1
  },
  {
    id: "c5-062", category: 6,
    zh: { q: "PRISMA 流程圖的目的是什麼？", opts: ["顯示統計分析結果", "透明地展示從文獻搜尋到最終納入研究的每一步篩選過程和數量", "列出所有效應量", "只顯示納入的研究"], exp: "PRISMA 流程圖記錄了搜尋的總數量、篩選過程、排除原因和最終納入數量——讓讀者能追蹤和重複研究過程。" },
    en: { q: "What is the purpose of the PRISMA flow diagram?", opts: ["Display statistical results", "Transparently show each screening step from search to final inclusion, with numbers", "List all effect sizes", "Only show included studies"], exp: "The PRISMA flow diagram documents total searches, screening steps, exclusion reasons, and final inclusion numbers — enabling readers to trace and replicate the process." },
    correct: 1
  },
  {
    id: "c5-063", category: 6,
    zh: { q: "為什麼 PRISMA 2020 強調事先註冊 protocol？", opts: ["為了增加工作量", "增加透明度，讓讀者能比較計畫和實際執行是否一致，減少選擇性報告", "只是形式要求", "和結果無關"], exp: "事先註冊（如在 PROSPERO）讓讀者能檢查：研究者是否按照原計畫分析，還是在看到數據後改變了分析策略。" },
    en: { q: "Why does PRISMA 2020 emphasize protocol registration?", opts: ["To increase workload", "Increases transparency — lets readers compare planned vs actual methods, reducing selective reporting", "Just a formality", "Unrelated to results"], exp: "Registration (e.g., PROSPERO) lets readers verify: did researchers follow their original plan, or did they change analysis strategies after seeing data?" },
    correct: 1
  },
  {
    id: "c5-064", category: 6,
    zh: { q: "以下哪項不是 PRISMA 2020 清單要求報告的？", opts: ["搜尋策略的完整細節", "每個研究的偏倚風險評估", "作者的個人財務狀況", "效應量及其 CI"], exp: "PRISMA 要求報告搜尋策略、偏倚風險、效應量等——但不要求作者個人財務狀況（雖然利益衝突聲明是常見慣例）。" },
    en: { q: "Which is NOT required by the PRISMA 2020 checklist?", opts: ["Full search strategy details", "Risk of bias for each study", "Authors' personal financial status", "Effect sizes and CIs"], exp: "PRISMA requires search strategies, risk of bias assessments, effect sizes, etc. — but not authors' personal finances (though conflict of interest disclosure is common practice)." },
    correct: 2
  },
  {
    id: "c5-065", category: 6,
    zh: { q: "統合分析報告應該包含非顯著的結果嗎？", opts: ["不需要，只報告顯著的就好", "是的——選擇性只報告顯著結果本身就是一種偏倚", "只有審稿人需要看", "非顯著結果不重要"], exp: "完整報告包括所有結果，包括非顯著的。只報告「好看的」結果是報告偏倚的一種形式，違反 PRISMA 精神。" },
    en: { q: "Should a meta-analysis report include non-significant results?", opts: ["No, only significant ones", "Yes — selectively reporting only significant results is itself a form of bias", "Only reviewers need them", "Non-significant results don't matter"], exp: "Complete reporting includes all results, including non-significant ones. Only reporting 'favorable' results is a form of reporting bias, violating PRISMA principles." },
    correct: 1
  },
  {
    id: "c5-066", category: 6,
    zh: { q: "GRADE 評估的目的是什麼？", opts: ["計算效應量", "評估統合分析結論的證據確定性（certainty of evidence），從高到很低", "搜尋文獻", "評估個別研究品質"], exp: "GRADE 系統評估整體證據體 (body of evidence) 的品質/確定性，考慮偏倚風險、不精確性、不一致性、間接性和發表偏倚。" },
    en: { q: "What is the purpose of GRADE assessment?", opts: ["Calculate effect sizes", "Evaluate the certainty of evidence for meta-analysis conclusions, from high to very low", "Search literature", "Assess individual study quality"], exp: "GRADE evaluates the overall body of evidence quality/certainty, considering risk of bias, imprecision, inconsistency, indirectness, and publication bias." },
    correct: 1
  },
  {
    id: "c5-067", category: 6,
    zh: { q: "以下哪個是統合分析結果解讀的常見陷阱？", opts: ["同時考慮效應量和信賴區間", "報告異質性指標", "假設統合分析的結論可以直接應用到所有個別病人", "確認是否有發表偏倚"], exp: "統合分析提供的是「平均」效應，不代表每個病人都會有相同的反應。直接一概而論是常見的過度推論。" },
    en: { q: "Which is a common pitfall in interpreting meta-analysis results?", opts: ["Considering both effect size and CI", "Reporting heterogeneity measures", "Assuming meta-analysis conclusions directly apply to every individual patient", "Checking for publication bias"], exp: "Meta-analysis provides an 'average' effect — it doesn't mean every patient will respond the same way. Direct generalization to all individuals is a common over-interpretation." },
    correct: 2
  },
  {
    id: "c5-068", category: 6,
    zh: { q: "系統性回顧和統合分析的數據應該公開分享嗎？", opts: ["不需要", "PRISMA 2020 鼓勵公開數據，以促進透明度和可重複性", "數據永遠是保密的", "只有期刊可以看"], exp: "PRISMA 2020 鼓勵研究者公開萃取的數據和分析代碼，讓其他人可以驗證和重複分析，增進科學透明度。" },
    en: { q: "Should systematic review and meta-analysis data be shared publicly?", opts: ["No need", "PRISMA 2020 encourages open data to promote transparency and reproducibility", "Data is always confidential", "Only journals can see it"], exp: "PRISMA 2020 encourages researchers to share extracted data and analysis code so others can verify and reproduce analyses, promoting scientific transparency." },
    correct: 1
  },
  {
    id: "c5-069", category: 6,
    zh: { q: "完成一個完整的統合分析需要覆蓋哪些核心步驟（從 Course 0-5）？", opts: ["只需要搜尋文獻和計算效應量", "提出問題(PICO) → 搜尋 → 篩選(PRISMA) → 萃取 → 品質評估 → 合併分析 → 異質性評估 → 偏倚檢測 → 報告", "只需要畫森林圖", "只需要計算 I²"], exp: "統合分析是一個完整的流程：從研究問題到搜尋、篩選、萃取、品質評估、效應量合併、異質性探索、偏倚評估到最終報告。" },
    en: { q: "A complete meta-analysis covers which core steps (from Courses 0-5)?", opts: ["Only search and calculate effect sizes", "Formulate question (PICO) → search → screen (PRISMA) → extract → quality assessment → pool analysis → heterogeneity assessment → bias detection → report", "Only draw forest plots", "Only calculate I²"], exp: "Meta-analysis is a complete workflow: from research question to searching, screening, extraction, quality assessment, pooling, heterogeneity exploration, bias assessment, and final reporting." },
    correct: 1
  },
  {
    id: "c5-070", category: 6,
    zh: { q: "整個 6 課程旅程結束後，下列哪個觀念最重要？", opts: ["只要 p < 0.05 就夠了", "統合分析是絕對正確的", "統合分析是強大的工具，但其品質取決於輸入數據的品質、方法學的嚴謹性、以及對結果的批判性解讀", "統合分析可以取代所有其他研究"], exp: "統合分析的力量和局限並存。它依賴嚴謹的方法學和批判性思維——永遠問：數據可靠嗎？合併合理嗎？結論穩健嗎？" },
    en: { q: "After completing all 6 courses, which concept is most important?", opts: ["p < 0.05 is all that matters", "Meta-analysis is absolutely correct", "Meta-analysis is a powerful tool, but its quality depends on input data quality, methodological rigor, and critical interpretation of results", "Meta-analysis replaces all other research"], exp: "Meta-analysis has both power and limitations. It depends on rigorous methods and critical thinking — always ask: is the data reliable? Is pooling reasonable? Are conclusions robust?" },
    correct: 2
  },
];
