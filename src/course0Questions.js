// ============================================================
// COURSE 0: Meta-Analysis Basics — 35 Questions (5 per category)
// ============================================================
// 7 categories (matching 7 egg colors):
//   0 = What & Why (Discovery)         — #2ECC71
//   1 = Data Extraction                — #3498DB
//   2 = Forest Plot                    — #F1C40F
//   3 = Heterogeneity                  — #E74C3C
//   4 = Search Strategy                — #9B59B6
//   5 = Bias & Quality                 — #E67E22
//   6 = Interpretation & Wisdom        — #95A5A6
// ============================================================

export const course0Categories = {
  0: "what-why",
  1: "data",
  2: "forest",
  3: "heterogeneity",
  4: "search",
  5: "bias",
  6: "interpretation",
};

export const course0Questions = [
  // ── Category 0: What & Why (Discovery) ──
  {
    id: "c0-WW01", category: 0,
    zh: { q: "什麼是統合分析？", opts: ["一項收集患者新數據的研究", "一種統計方法，將同一主題的多項研究結果合併", "一種僅用文字總結研究結果的文獻綜述", "一項有很多參與者的大型臨床試驗"], exp: "統合分析使用統計技術將多項獨立研究的數值結果合併，產生一個總體估計值。與敘述性綜述不同，它使用數學——而不僅僅是文字——來綜合證據。" },
    en: { q: "What is a meta-analysis?", opts: ["A study that collects new data from patients", "A statistical method that combines results from multiple studies on the same topic", "A type of literature review that summarizes study findings in words only", "A single large clinical trial with many participants"], exp: "A meta-analysis uses statistical techniques to combine numerical results from multiple independent studies, producing a single overall estimate. Unlike a narrative review, it uses math — not just words — to synthesize evidence." },
    correct: 1
  },
  {
    id: "c0-WW02", category: 0,
    zh: { q: "為什麼研究者要做統合分析，而不是只閱讀個別研究？", opts: ["比閱讀個別論文更快", "它允許研究者只選擇支持性的研究", "合併數據增加了統計效力，可以揭示單個研究可能遺漏的模式", "它消除了同儕審查的需要"], exp: "個別研究，特別是小型研究，可能缺乏檢測真實效應的統計效力。匯集數據可以檢測出較小但有意義的效應，並提供更精確的整體估計值。" },
    en: { q: "Why would a researcher do a meta-analysis instead of just reading individual studies?", opts: ["It is faster than reading individual papers", "It allows the researcher to pick only supportive studies", "Combining data increases statistical power and can reveal patterns that single studies might miss", "It eliminates the need for peer review"], exp: "Individual studies, especially small ones, may lack power to detect a real effect. Pooling data can detect smaller but meaningful effects and provide a more precise overall estimate." },
    correct: 2
  },
  {
    id: "c0-WW03", category: 0,
    zh: { q: "系統性綜論和統合分析有什麼區別？", opts: ["它們完全一樣", "系統性綜論有方法地搜索和評估研究；統合分析增加了統計合併結果的步驟", "統合分析總是在系統性綜論之前進行", "系統性綜論只包括隨機對照試驗"], exp: "系統性綜論是查找、篩選和評價研究的結構化過程。統合分析是其中的可選統計匯總步驟。你可以有沒有統合分析的系統性綜論，但反過來不行。" },
    en: { q: "What is the difference between a systematic review and a meta-analysis?", opts: ["They are exactly the same thing", "A systematic review searches and evaluates studies methodically; a meta-analysis adds the step of statistically combining results", "A meta-analysis is always done before a systematic review", "A systematic review only includes randomized controlled trials"], exp: "A systematic review is the structured process of finding, screening, and appraising studies. A meta-analysis is the optional statistical pooling step within it. You can have a systematic review without a meta-analysis, but not the reverse." },
    correct: 1
  },
  {
    id: "c0-WW04", category: 0,
    zh: { q: "以下哪項不是進行統合分析的好處？", opts: ["它可以解決研究間矛盾的結果", "它通過匯集參與者增加了總體樣本量", "它保證合併結果是正確的", "它可以探索研究之間結果不同的原因"], exp: "統合分析很強大，但不能保證真實性。如果納入的研究有偏差，合併它們可能產生更精確的錯誤答案——有時被稱為「垃圾進，垃圾出」。" },
    en: { q: "Which of the following is NOT a benefit of conducting a meta-analysis?", opts: ["It can settle conflicting results across studies", "It increases the overall sample size by pooling participants", "It guarantees that the combined result is correct", "It can explore why results differ between studies"], exp: "A meta-analysis is powerful but does not guarantee truth. If included studies are biased, combining them can produce a more precise wrong answer — sometimes called \"garbage in, garbage out.\"" },
    correct: 2
  },
  {
    id: "c0-WW05", category: 0,
    zh: { q: "「我找到了10項研究——6項說藥物有效，4項說無效，所以它可能有效。」這個推理有什麼問題？", opts: ["沒問題——多數決是有效的", "同事應該只計算隨機試驗", "計算陽性與陰性研究忽略了研究規模、質量和效應量的差異——統合分析會適當地給每項研究加權", "你需要至少20項研究才能得出結論"], exp: "這種「計票」方法平等對待所有研究，但一項設計良好的5000名參與者的大型試驗應該比只有30名參與者的小型先導研究更有份量。統合分析使用統計加權來考慮這些差異。" },
    en: { q: "\"I found 10 studies — 6 say the drug works, 4 say it doesn't, so it probably works.\" What is wrong with this reasoning?", opts: ["Nothing — majority rules is valid", "The colleague should only count randomized trials", "Counting positive vs. negative studies ignores differences in study size, quality, and effect size — a meta-analysis weighs each study appropriately", "You need at least 20 studies to draw any conclusion"], exp: "This \"vote counting\" approach treats all studies equally, but a large, well-designed trial with 5,000 participants should carry more weight than a small pilot study with 30. Meta-analysis uses statistical weighting to account for these differences." },
    correct: 2
  },

  // ── Category 1: Data Extraction ──
  {
    id: "c0-DE01", category: 1,
    zh: { q: "在統合分析中，什麼是「效應量」？", opts: ["研究中的參與者數量", "一個標準化的數字，衡量組間差異或關係的大小", "原始研究中報告的p值", "分析中納入的研究數量"], exp: "效應量量化了研究發現的大小。常見類型包括比值比、風險比和均數差。它不僅告訴你某種治療是否有效，還告訴你效果有多大。" },
    en: { q: "In a meta-analysis, what is an \"effect size\"?", opts: ["The number of participants in a study", "A standardized number that measures how large the difference or relationship is between groups", "The p-value reported in the original study", "The number of studies included in the analysis"], exp: "An effect size quantifies the magnitude of a finding. Common types include odds ratios, risk ratios, and mean differences. It tells you not just whether something works, but how much." },
    correct: 1
  },
  {
    id: "c0-DE02", category: 1,
    zh: { q: "一項試驗報告死亡率為治療組15/100和對照組22/100。你需要提取哪些關鍵數字？", opts: ["只需要論文中的p值", "每組的事件數（死亡數）和總參與者數", "只需要百分比（15%和22%）", "只需要兩組之間的差異（7%）"], exp: "你需要每組的原始事件計數和樣本量。這讓統合分析軟體計算效應量及其精確度。僅有百分比會丟失關於樣本量的信息，而樣本量影響研究獲得的權重。" },
    en: { q: "A trial reports mortality as 15/100 (treatment) and 22/100 (control). What key numbers do you need to extract?", opts: ["Only the p-value from the paper", "The number of events (deaths) and total participants in each group", "Only the percentages (15% and 22%)", "Just the difference between the two groups (7%)"], exp: "You need raw event counts and sample sizes for each group. This lets meta-analysis software calculate the effect size and its precision. Percentages alone lose information about sample size, which affects how much weight a study gets." },
    correct: 1
  },
  {
    id: "c0-DE03", category: 1,
    zh: { q: "為什麼指南建議由兩人獨立從每項研究中提取數據？", opts: ["為了加快過程", "因為一個人無法理解統計結果", "為了減少錯誤和偏差——分歧可以被識別和解決", "這只有Cochrane綜述才需要"], exp: "數據提取錯誤可能改變結果。兩個獨立提取者可以發現錯誤並減少主觀偏差。分歧通過討論或第三位審查者解決。" },
    en: { q: "Why do guidelines recommend two people independently extract data from each study?", opts: ["To make the process faster", "Because one person cannot understand statistical results", "To reduce errors and bias — disagreements can be identified and resolved", "It is only required for Cochrane reviews"], exp: "Data extraction errors can change results. Two independent extractors catch mistakes and reduce subjective bias. Disagreements are resolved by discussion or a third reviewer." },
    correct: 2
  },
  {
    id: "c0-DE04", category: 1,
    zh: { q: "一項研究報告結果為中位數和四分位距，而非均值和標準差。你應該怎麼做？", opts: ["排除該研究——無法使用", "將中位數當作均值處理", "使用已建立的轉換公式估計均值和標準差，並在方法中註明", "聯繫期刊編輯要求提供正確的統計數據"], exp: "經過驗證的公式（例如Wan等人或Luo等人的方法）可以從中位數和範圍估計均值和標準差。這是常見做法——只需報告使用了轉換公式。" },
    en: { q: "A study reports results as median and interquartile range instead of mean and SD. What should you do?", opts: ["Exclude the study — it cannot be used", "Treat the median as if it were the mean", "Use established conversion formulas to estimate the mean and SD, and note this in your methods", "Contact the journal editor to demand the correct statistics"], exp: "Validated formulas (e.g., by Wan et al. or Luo et al.) can estimate means and SDs from medians and ranges. This is common practice — just report that conversions were used." },
    correct: 2
  },
  {
    id: "c0-DE05", category: 1,
    zh: { q: "一項研究報告治療組零死亡。這應該如何處理？", opts: ["排除該研究，因為無法用零計算比率", "將其記錄為一例死亡而非零", "應用小的連續性校正（例如，向每個格添加0.5）使計算成為可能，並記錄此操作", "忽略治療組，只使用對照組數據"], exp: "零事件格使比率計算不可能。連續性校正（通常為0.5）是一種標準方法，允許將該研究納入。務必在方法中報告此操作。" },
    en: { q: "One study reports zero deaths in the treatment group. How should this be handled?", opts: ["Exclude the study because you cannot calculate a ratio with zero", "Record it as one death instead of zero", "Apply a small continuity correction (e.g., adding 0.5 to each cell) so the calculation is possible, and document this", "Ignore the treatment group and only use the control data"], exp: "Zero-event cells make ratio calculations impossible. A continuity correction (typically 0.5) is a standard approach that allows the study to be included. Always report this in your methods." },
    correct: 2
  },

  // ── Category 2: Forest Plot ──
  {
    id: "c0-FP01", category: 2,
    zh: { q: "在森林圖中，每條水平線代表什麼？", opts: ["每項研究發表的時間線", "一項研究效應估計值的信賴區間——線越短=估計值越精確", "每項研究的參與者數量", "每項研究的質量評級"], exp: "每條水平線是一項研究的信賴區間（通常95%）。線上的方塊標記點估計值。較大的研究往往有較短的線，因為它們提供更精確的估計。" },
    en: { q: "In a forest plot, what does each horizontal line represent?", opts: ["The timeline of when each study was published", "The confidence interval of one study's effect estimate — shorter line = more precise estimate", "The number of participants in each study", "The quality rating of each study"], exp: "Each horizontal line is a confidence interval (usually 95%) for one study. The square on the line marks the point estimate. Larger studies tend to have shorter lines because they provide more precise estimates." },
    correct: 1
  },
  {
    id: "c0-FP02", category: 2,
    zh: { q: "森林圖上在1（比率）或0（差異）處的垂直虛線表示什麼？", opts: ["所有研究的平均效應", "「無效線」——研究穿過它意味著結果在統計學上不顯著", "臨床重要性所需的最小效應量", "發表偏倚的截斷值"], exp: "這是「無效線」。對於風險比/比值比，1=無差異。對於均數差，0=無差異。信賴區間穿過此線意味著我們不能確信存在真實效應。" },
    en: { q: "What does the vertical dashed line at 1 (for ratios) or 0 (for differences) on a forest plot mean?", opts: ["The average effect across all studies", "The \"line of no effect\" — a study crossing it means the result is not statistically significant", "The minimum effect size needed for clinical importance", "The cutoff for publication bias"], exp: "This is the \"line of no effect.\" For risk/odds ratios, 1 = no difference. For mean differences, 0 = no difference. A confidence interval crossing this line means we cannot confidently say there is a real effect." },
    correct: 1
  },
  {
    id: "c0-FP03", category: 2,
    zh: { q: "森林圖上的方塊大小不同。大小告訴你什麼？", opts: ["研究花了多少年", "研究的質量評分", "給予該研究的權重——較大的方塊意味著對整體結果的影響更大", "結果是否具有統計學意義"], exp: "方塊大小反映研究的權重，通常由樣本量和精確度決定。較大、更精確的研究獲得更大的方塊，對合併菱形的影響更大。" },
    en: { q: "The squares on a forest plot are different sizes. What does the size tell you?", opts: ["How many years the study took", "The quality score of the study", "The weight given to that study — larger squares mean more influence on the overall result", "Whether the result was statistically significant"], exp: "Square size reflects the study's weight, typically determined by sample size and precision. Larger, more precise studies get bigger squares and more influence on the pooled diamond." },
    correct: 2
  },
  {
    id: "c0-FP04", category: 2,
    zh: { q: "森林圖底部的菱形代表什麼？", opts: ["最重要的單項研究", "總體合併效應——其寬度顯示合併結果的信賴區間", "對下一項研究的預測", "納入的研究數量"], exp: "菱形是「底線」。其中心=合併效應估計值，其寬度=95%信賴區間。如果菱形不觸及無效線，則整體結果在統計學上是顯著的。" },
    en: { q: "What does the diamond at the bottom of a forest plot represent?", opts: ["The single most important study", "The overall pooled effect — its width shows the confidence interval of the combined result", "A prediction for the next study", "The number of studies included"], exp: "The diamond is the \"bottom line.\" Its center = pooled effect estimate, its width = 95% CI. If the diamond does not touch the line of no effect, the overall result is statistically significant." },
    correct: 1
  },
  {
    id: "c0-FP05", category: 2,
    zh: { q: "所有8個方塊和菱形完全位於無效線的左側。你能得出什麼結論？", opts: ["治療有害", "你需要檢查軸標籤——「左」可能有利於治療或對照，取決於圖表的設置方式", "所有8項研究的參與者數量相同", "統合分析沒有異質性"], exp: "森林圖可以兩種方向設置！始終檢查底部的標籤（例如「有利於治療 ← → 有利於對照」）。永遠不要假設哪個方向是「好的」。" },
    en: { q: "All 8 squares and the diamond sit entirely on the left side of the no-effect line. What can you conclude?", opts: ["The treatment is harmful", "You need to check the axis labels — \"left\" could favor treatment OR control depending on how the plot is set up", "All 8 studies had the same number of participants", "The meta-analysis has no heterogeneity"], exp: "Forest plots can be oriented either way! Always check the label at the bottom (e.g., \"Favors Treatment ← → Favors Control\"). Never assume which direction is \"good.\"" },
    correct: 1
  },

  // ── Category 3: Heterogeneity ──
  {
    id: "c0-HT01", category: 3,
    zh: { q: "在統合分析中，「異質性」是什麼意思？", opts: ["研究都是低質量的", "研究使用了不同的語言", "研究間的結果差異超出了僅由隨機因素所預期的", "統合分析包含了太多研究"], exp: "異質性意味著結果之間的差異超過了隨機變異所能解釋的。高異質性表明某些因素——患者群體、劑量、研究設計——正在導致結果分歧。" },
    en: { q: "In meta-analysis, what does \"heterogeneity\" mean?", opts: ["The studies are all of low quality", "The studies used different languages", "The results vary across studies more than expected from chance alone", "The meta-analysis includes too many studies"], exp: "Heterogeneity means results are more different than random variation would explain. High heterogeneity suggests something — patient populations, dosing, study design — is causing results to diverge." },
    correct: 2
  },
  {
    id: "c0-HT02", category: 3,
    zh: { q: "你的統合分析顯示I² = 85%。這告訴你什麼？", opts: ["85%的研究發現了顯著結果", "85%的研究間變異是由真實差異造成的，而非偶然", "統合分析的準確率為85%", "85%的研究應該被排除"], exp: "I²描述了總變異中有多少百分比是真正的異質性而非抽樣誤差。85%很高——你應該探索結果為何不同（例如，通過亞組分析或Meta回歸）。" },
    en: { q: "Your meta-analysis shows I² = 85%. What does this tell you?", opts: ["85% of studies found a significant result", "85% of variability across studies is due to real differences, not chance", "The meta-analysis is 85% accurate", "85% of studies should be excluded"], exp: "I² describes what percentage of total variation is genuine heterogeneity rather than sampling error. 85% is high — you should explore why results differ (e.g., through subgroup analysis or meta-regression)." },
    correct: 1
  },
  {
    id: "c0-HT03", category: 3,
    zh: { q: "固定效應和隨機效應模型的主要區別是什麼？", opts: ["固定效應用於小型研究，隨機效應用於大型研究", "固定效應假設所有研究共享一個真實效應；隨機效應假設每項研究估計的是略有不同的真實效應", "隨機效應總是給出更大的效應量", "它們總是給出相同的答案"], exp: "固定效應：一個普遍的真實效應。隨機效應：真實效應在研究間變化，我們估計的是平均值。當異質性高時，隨機效應通常更合適。" },
    en: { q: "What is the main difference between fixed-effect and random-effects models?", opts: ["Fixed-effect is for small studies, random-effects for large ones", "Fixed-effect assumes one true effect shared by all studies; random-effects assumes each study estimates a slightly different true effect", "Random-effects always gives a larger effect size", "They always give the same answer"], exp: "Fixed-effect: one universal true effect. Random-effects: the true effect varies across studies, and we estimate the average. When heterogeneity is high, random-effects is usually more appropriate." },
    correct: 1
  },
  {
    id: "c0-HT04", category: 3,
    zh: { q: "你的統合分析I² = 75%。最佳的下一步是什麼？", opts: ["刪除研究直到I²降到50%以下", "報告結果並忽略異質性", "通過亞組分析或Meta回歸調查異質性的來源", "切換到固定效應模型以隱藏異質性"], exp: "高異質性是一個需要探索的信號，而不是忽略或人為減少。亞組分析和Meta回歸有助於識別什麼驅動了差異。在沒有科學理由的情況下刪除研究是不恰當的。" },
    en: { q: "Your meta-analysis has I² = 75%. What is the BEST next step?", opts: ["Remove studies until I² drops below 50%", "Report the result and ignore heterogeneity", "Investigate sources of heterogeneity through subgroup analysis or meta-regression", "Switch to fixed-effect model to hide the heterogeneity"], exp: "High heterogeneity is a signal to explore, not ignore or artificially reduce. Subgroup analysis and meta-regression help identify what drives differences. Removing studies without scientific justification is inappropriate." },
    correct: 2
  },
  {
    id: "c0-HT05", category: 3,
    zh: { q: "一項包含4項研究的統合分析顯示I² = 0%且Q檢驗p = 0.85。你能自信地說沒有異質性嗎？", opts: ["是的——I² = 0%證明結果相同", "不能——只有4項研究時，I²和Q檢驗都缺乏檢測真實異質性的統計效力", "是的——Q檢驗確認了這一點", "這取決於固定效應還是隨機效應"], exp: "I²和Cochran's Q在研究數量少時統計效力都很低。4項研究的I² = 0%並不意味著不存在異質性——可能只是無法檢測到。一些專家建議始終使用隨機效應作為謹慎的默認選擇。" },
    en: { q: "A meta-analysis of 4 studies shows I² = 0% and Q-test p = 0.85. Can you confidently say there is no heterogeneity?", opts: ["Yes — I² = 0% proves identical results", "No — with only 4 studies, both I² and Q have low power to detect real heterogeneity", "Yes — the Q-test confirms it", "It depends on fixed vs. random-effects"], exp: "Both I² and Cochran's Q have low power with few studies. I² = 0% with 4 studies does not mean heterogeneity is absent — it may just be undetectable. Some experts recommend always using random-effects as a cautious default." },
    correct: 1
  },

  // ── Category 4: Search Strategy ──
  {
    id: "c0-SS01", category: 4,
    zh: { q: "在系統性綜論的背景下，PRISMA是什麼？", opts: ["用於運行統合分析的統計軟體包", "一個報告指南，提供清單和流程圖，用於透明地報告系統性綜論", "已發表臨床試驗的數據庫", "一種計算效應量的方法"], exp: "PRISMA（系統性綜論和統合分析的首選報告項目）是一套指南，幫助作者透明地報告其綜述過程。流程圖顯示了找到、篩選、排除和納入了多少研究。" },
    en: { q: "What is PRISMA in the context of a systematic review?", opts: ["A statistical software package for running meta-analyses", "A reporting guideline that provides a checklist and flow diagram for transparent reporting of systematic reviews", "A database of published clinical trials", "A method for calculating effect sizes"], exp: "PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses) is a set of guidelines to help authors report their review process transparently. The flow diagram shows how many studies were found, screened, excluded, and included." },
    correct: 1
  },
  {
    id: "c0-SS02", category: 4,
    zh: { q: "為什麼系統性綜論應該搜索多個數據庫（如PubMed、Embase、CENTRAL）？", opts: ["不同數據庫有不同格式，所以結果看起來更好", "沒有單一數據庫索引所有已發表的研究——使用多個數據庫可以減少遺漏相關證據的機會", "只有在主題罕見時才有必要", "期刊編輯要求至少三個數據庫才能發表"], exp: "每個數據庫覆蓋不同的期刊和研究類型。PubMed在生物醫學文獻方面很強，Embase增加了歐洲和藥理學內容，CENTRAL專注於臨床試驗。只搜索一個數據庫有遺漏重要研究的風險。" },
    en: { q: "Why should a systematic review search more than one database (e.g., PubMed, Embase, CENTRAL)?", opts: ["Different databases have different formatting, so results look better", "No single database indexes all published studies — using multiple databases reduces the chance of missing relevant evidence", "It is only necessary if the topic is rare", "Journal editors require at least three databases for publication"], exp: "Each database covers a different set of journals and study types. PubMed is strong in biomedical literature, Embase adds European and pharmacological content, and CENTRAL focuses on clinical trials. Searching only one risks missing important studies." },
    correct: 1
  },
  {
    id: "c0-SS03", category: 4,
    zh: { q: "系統性綜論中的「納入和排除標準」是什麼？", opts: ["期刊用來決定是否發表綜述的規則", "預先定義的規則，指定哪些研究符合綜述資格，哪些不符合", "允許為綜述做貢獻的作者名單", "決定結果是否顯著的統計閾值"], exp: "在搜索之前，審查者定義資格標準——通常使用PICO框架（人群、干預、對照、結果）。這確保了研究選擇是系統的和可重複的，而不是基於審查者的偏好。" },
    en: { q: "What are \"inclusion and exclusion criteria\" in a systematic review?", opts: ["Rules the journal uses to decide whether to publish the review", "Pre-defined rules that specify which studies qualify for the review and which do not", "A list of authors who are allowed to contribute to the review", "Statistical thresholds for deciding whether a result is significant"], exp: "Before searching, reviewers define eligibility criteria — often using the PICO framework (Population, Intervention, Comparison, Outcome). This ensures study selection is systematic and reproducible, not based on the reviewers' preferences." },
    correct: 1
  },
  {
    id: "c0-SS04", category: 4,
    zh: { q: "在篩選過程中，你找到了一篇相關的會議摘要但沒有完整發表的論文。你應該怎麼做？", opts: ["自動排除——只有完整論文才算", "自動納入——任何證據都是好證據", "記錄它，嘗試聯繫作者獲取數據，並記錄你納入或排除它的決定和理由", "用類似的已發表研究替代它"], exp: "灰色文獻（會議摘要、學位論文、報告）可能包含重要證據並有助於減少發表偏倚。最佳做法是嘗試獲取數據。如果排除，要說明原因。" },
    en: { q: "During screening, you find a relevant conference abstract but no full published paper. What should you do?", opts: ["Automatically exclude it — only full papers count", "Automatically include it — any evidence is good evidence", "Note it, attempt to contact the authors for data, and document your decision to include or exclude it with a reason", "Replace it with a similar published study"], exp: "Grey literature (conference abstracts, dissertations, reports) can contain important evidence and help reduce publication bias. Best practice is to try to obtain the data. If you exclude it, state why." },
    correct: 2
  },
  {
    id: "c0-SS05", category: 4,
    zh: { q: "一位同事建議添加一項通過閱讀另一篇納入論文的參考文獻列表找到的研究。這可以接受嗎？", opts: ["不行——所有研究必須來自數據庫搜索", "可以——「參考文獻列表搜索」（滾雪球法）是一種推薦的補充方法，應予以記錄", "只有在研究是在最近5年內發表的情況下", "只有在你重新運行整個數據庫搜索的情況下"], exp: "檢查納入研究的參考文獻列表是一種標準的推薦技術，可以捕獲你的數據庫搜索可能遺漏的研究。PRISMA指南包含一個專門的位置來報告以這種方式識別的研究。" },
    en: { q: "A colleague suggests adding a study found by reading the reference list of another included paper. Is this acceptable?", opts: ["No — all studies must come from the database search", "Yes — \"reference list searching\" (snowballing) is a recommended supplementary method and should be documented", "Only if the study was published in the last 5 years", "Only if you re-run the entire database search"], exp: "Checking reference lists of included studies is a standard and recommended technique to catch studies your database search may have missed. PRISMA guidelines include a specific spot to report studies identified this way." },
    correct: 1
  },

  // ── Category 5: Bias & Quality ──
  {
    id: "c0-BQ01", category: 5,
    zh: { q: "統合分析中的「發表偏倚」是什麼？", opts: ["當期刊只發表知名研究者的研究時", "當具有陽性或顯著結果的研究比陰性或無效結果的研究更可能被發表時", "當統合分析包含太多來自同一期刊的研究時", "當統合分析本身未能發表時"], exp: "顯示顯著結果的研究更可能被發表。如果你的統合分析只找到這些「贏家」，合併估計值可能高估了真實效應。這是統合分析有效性的最大威脅之一。" },
    en: { q: "What is \"publication bias\" in meta-analysis?", opts: ["When journals only publish studies from famous researchers", "When studies with positive or significant results are more likely to be published than those with negative or null results", "When a meta-analysis includes too many studies from one journal", "When the meta-analysis itself fails to get published"], exp: "Studies showing significant results are more likely to be published. If your meta-analysis only finds these \"winners,\" the pooled estimate may overestimate the true effect. This is one of the biggest threats to meta-analysis validity." },
    correct: 1
  },
  {
    id: "c0-BQ02", category: 5,
    zh: { q: "漏斗圖用於什麼？", opts: ["顯示研究發表的時間線", "視覺評估是否可能存在發表偏倚——對稱性表明風險低，不對稱性表明可能存在偏倚", "比較所有納入研究的質量評分", "顯示PRISMA流程圖"], exp: "漏斗圖將每項研究的效應量與其精確度作圖。沒有偏倚時，小型研究均勻地散佈在合併估計值周圍，形成對稱的漏斗。如果一側「缺失」，可能意味著陰性結果的研究未被發表。" },
    en: { q: "What is a funnel plot used for?", opts: ["To show the timeline of study publications", "To visually assess whether publication bias may be present — symmetry suggests low risk, asymmetry suggests possible bias", "To compare the quality scores of all included studies", "To display the PRISMA flow diagram"], exp: "A funnel plot graphs each study's effect size against its precision. Without bias, small studies scatter evenly around the pooled estimate forming a symmetrical funnel. If one side is \"missing,\" it may mean negative-result studies were not published." },
    correct: 1
  },
  {
    id: "c0-BQ03", category: 5,
    zh: { q: "為什麼評估每項納入研究的「偏倚風險」很重要？", opts: ["這是期刊要求的形式，但不影響結果", "因為設計不良的研究可能產生誤導性結果——不經評估就納入它們可能使合併估計值產生偏差", "這只有觀察性研究才需要，隨機試驗不需要", "確定每項研究的樣本量"], exp: "統合分析的質量取決於其納入的研究。Cochrane偏倚風險工具等工具評估隨機化、盲法和不完整結果數據等領域。高風險研究可以在敏感性分析中單獨分析。" },
    en: { q: "Why is it important to assess the \"risk of bias\" in each included study?", opts: ["It is a formality required by journals but does not affect results", "Because poorly designed studies can produce misleading results — including them without assessment can bias the pooled estimate", "It is only needed for observational studies, not randomized trials", "To determine the sample size of each study"], exp: "A meta-analysis is only as good as its included studies. Tools like the Cochrane Risk of Bias tool assess domains such as randomization, blinding, and incomplete outcome data. High-risk studies can be analyzed separately in a sensitivity analysis." },
    correct: 1
  },
  {
    id: "c0-BQ04", category: 5,
    zh: { q: "統合分析中的「敏感性分析」是什麼？", opts: ["對患者對治療敏感程度的測試", "在改變假設的情況下重複分析，看主要發現是否成立", "衡量搜索策略在查找研究方面的敏感度", "僅針對統計顯著研究的單獨分析"], exp: "敏感性分析測試穩健性。如果刪除高風險研究會大幅改變合併估計值，則結論是脆弱的。如果結果保持穩定，你可以更有信心。" },
    en: { q: "What is a \"sensitivity analysis\" in meta-analysis?", opts: ["A test of how sensitive patients were to the treatment", "Repeating the analysis while changing assumptions to see if the main finding holds up", "Measuring how sensitive the search strategy was at finding studies", "A separate analysis only for statistically significant studies"], exp: "Sensitivity analysis tests robustness. If removing high-risk studies changes the pooled estimate dramatically, the conclusion is fragile. If the result stays stable, you can be more confident." },
    correct: 1
  },
  {
    id: "c0-BQ05", category: 5,
    zh: { q: "你的漏斗圖看起來不對稱，左側缺少小型研究。這是否一定意味著發表偏倚？", opts: ["是的——不對稱總是意味著發表偏倚", "不一定——不對稱也可能由真正的異質性、小研究效應或偶然因素造成", "只有在少於10項研究時才是", "漏斗圖無法檢測發表偏倚"], exp: "漏斗圖不對稱是一個警告信號，而非證據。其他原因包括大小研究之間的真實差異、小型研究的較低質量或隨機變異。Egger檢驗等統計檢驗可以補充視覺評估。" },
    en: { q: "Your funnel plot looks asymmetrical, with small studies missing from the left side. Does this definitely mean publication bias?", opts: ["Yes — asymmetry always means publication bias", "No — asymmetry can also be caused by genuine heterogeneity, small-study effects, or chance", "Only if there are fewer than 10 studies", "Funnel plots cannot detect publication bias"], exp: "Funnel plot asymmetry is a warning sign, not proof. Other causes include true differences between small and large studies, lower quality in smaller studies, or random variation. Statistical tests like Egger's test can supplement visual assessment." },
    correct: 1
  },

  // ── Category 6: Interpretation & Wisdom ──
  {
    id: "c0-IN01", category: 6,
    zh: { q: "一項統合分析發現統計學上顯著的結果（p = 0.03）。這是否一定意味著該發現具有臨床重要性？", opts: ["是的——統計顯著性總是意味著臨床重要性", "不——結果可以在統計學上顯著但太小以至於在實踐中無關緊要", "只有在信賴區間窄的情況下", "只有在I²低於50%的情況下"], exp: "有足夠的匯集數據，即使是微小的效應也會變得顯著。血壓降低0.5 mmHg可能在統計學上顯著，但在臨床上毫無意義。始終關注效應量並問：「這個差異是否大到有意義？」" },
    en: { q: "A meta-analysis finds a statistically significant result (p = 0.03). Does this necessarily mean the finding is clinically important?", opts: ["Yes — statistical significance always means clinical importance", "No — a result can be statistically significant but too small to matter in practice", "Only if the confidence interval is narrow", "Only if I² is below 50%"], exp: "With enough pooled data, even tiny effects become significant. A blood pressure reduction of 0.5 mmHg might be significant but meaningless clinically. Always look at the effect size and ask: \"Is this difference large enough to matter?\"" },
    correct: 1
  },
  {
    id: "c0-IN02", category: 6,
    zh: { q: "在統合分析的背景下，什麼是「生態學謬誤」？", opts: ["使用危害環境的研究", "假設在研究層面發現的關係適用於個體患者", "在人類統合分析中包含動物研究", "忘記在分析中包含環境因素"], exp: "Meta回歸可能顯示平均年齡較高的研究有更大的效應，但這並不意味著每項研究中的老年個體反應更好。研究層面的模式不一定反映個體層面的關係。" },
    en: { q: "What is the \"ecological fallacy\" in the context of meta-analysis?", opts: ["Using studies that harm the environment", "Assuming that a relationship found at the study level applies to individual patients", "Including animal studies in a human meta-analysis", "Forgetting to include environmental factors in the analysis"], exp: "Meta-regression might show that studies with higher average age have bigger effects, but this does NOT mean older individuals within each study responded better. Study-level patterns don't necessarily reflect individual-level relationships." },
    correct: 1
  },
  {
    id: "c0-IN03", category: 6,
    zh: { q: "你的統合分析匯集了12項RCT，發現藥物X降低了死亡率。你能說藥物X「導致」了更低的死亡率嗎？", opts: ["是的——RCT的統合分析為因果主張提供了最強的證據", "不能——統合分析永遠不能做出因果主張", "只有在每項研究都單獨顯示顯著結果時", "只有在I²恰好為0%時"], exp: "當納入的研究是設計良好的RCT（通過隨機化建立因果關係）時，統合分析提供了強有力的因果證據。這就是為什麼RCT的統合分析位於證據等級的頂端。" },
    en: { q: "Your meta-analysis pools 12 RCTs and finds Drug X reduces mortality. Can you say Drug X \"causes\" lower mortality?", opts: ["Yes — meta-analysis of RCTs provides the strongest evidence for causal claims", "No — meta-analysis can never make causal claims", "Only if every single study individually showed a significant result", "Only if I² is exactly 0%"], exp: "When included studies are well-conducted RCTs (designed to establish causation through randomization), a meta-analysis provides strong causal evidence. This is why meta-analyses of RCTs sit at the top of the evidence hierarchy." },
    correct: 0
  },
  {
    id: "c0-IN04", category: 6,
    zh: { q: "2015年的一項統合分析包含8項研究，未發現顯著效應。此後，又發表了5項新的大型試驗。應該怎麼辦？", opts: ["2015年的結果不變——統合分析不會過期", "統合分析應該更新以包含新證據", "除非新試驗都一致，否則應忽略", "只有在原作者同意時才更新"], exp: "統合分析是證據的動態摘要。隨著新研究的出現，合併估計值可能改變——有時足以逆轉結論。定期更新或「活性」統合分析越來越被認為是最佳實踐。" },
    en: { q: "A meta-analysis from 2015 included 8 studies and found no significant effect. Since then, 5 new large trials have been published. What should happen?", opts: ["The 2015 result stands — meta-analyses do not expire", "The meta-analysis should be updated to include the new evidence", "The new trials should be ignored unless they all agree", "Only update if the original authors agree"], exp: "Meta-analyses are living summaries of evidence. As new studies appear, the pooled estimate may change — sometimes enough to reverse the conclusion. Regularly updated or \"living\" meta-analyses are increasingly recognized as best practice." },
    correct: 1
  },
  {
    id: "c0-IN05", category: 6,
    zh: { q: "兩項關於同一主題的統合分析得出了相反的結論。這怎麼可能？", opts: ["其中一項一定犯了數學錯誤", "搜索日期、納入標準、結果定義或統計模型的差異可以導致不同結果——兩者在技術上可能都是有效的", "如果兩者都遵循了PRISMA指南，這是不可能的", "包含更多研究的那個自動正確"], exp: "統合分析涉及許多判斷：哪些數據庫、哪些研究、如何定義結果、哪個模型。這些選擇可以導致不同的合併估計值。這就是為什麼提前註冊你的計畫書（例如在PROSPERO上）如此重要。" },
    en: { q: "Two meta-analyses on the same topic reach opposite conclusions. How is this possible?", opts: ["One of them must have made a mathematical error", "Differences in search dates, inclusion criteria, outcome definitions, or statistical models can lead to different results — both may be technically valid", "This is impossible if both followed PRISMA guidelines", "The one with more studies is automatically correct"], exp: "Meta-analyses involve many judgment calls: which databases, which studies, how to define outcomes, which model. These choices can lead to different pooled estimates. This is why registering your protocol in advance (e.g., on PROSPERO) is so important." },
    correct: 1
  },
];

