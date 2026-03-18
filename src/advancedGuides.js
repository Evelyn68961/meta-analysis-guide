// ═══ Advanced Analysis Mini-Lessons ═══
// Structured guides: 📖 what → 🎯 when → 📊 how to read → ✅ decision rule
// Used by WebRRunner.jsx Layer 2 — shown BEFORE user runs each analysis

const ADVANCED_GUIDES = {
  zh: {
    leaveOneOut: `📖 這是什麼：逐一排除每篇研究，重新計算整體效果量，觀察結果是否因某篇研究的排除而大幅改變。

🎯 何時使用：當你想確認結論是否穩健，不是只靠某一篇關鍵研究撐起來的。這是最基本的敏感性分析。

📊 怎麼看結果：表格每一列是排除一篇研究後的效果量（estimate）、信賴區間（ci.lb, ci.ub）和 p 值。比較每列的 estimate 與原始整體結果。

✅ 判斷規則：如果排除任何一篇研究後效果量都沒有大幅改變（方向不變、顯著性不變），結論具穩健性。若排除某篇後結果翻轉（例如從顯著變不顯著），該研究需特別關注。`,

    trimFill: `📖 這是什麼：假設漏斗圖不對稱是因為小型或負面研究未發表，Trim-and-Fill 會估計「缺失研究」的數量和位置，並補入假設性的研究來校正整體效果量。

🎯 何時使用：當漏斗圖看起來不對稱，或你想量化發表偏差對結論的潛在影響。

📊 怎麼看結果：R 輸出會顯示估計的缺失研究數（通常在左側）。比較校正前後的效果量和 p 值。漏斗圖中空心點 ○ 是補入的假設性研究。

✅ 判斷規則：若缺失研究數為 0，無明顯發表偏差。若補入後效果量大幅改變或顯著性翻轉，發表偏差可能影響結論的可靠性。`,

    eggers: `📖 這是什麼：Egger's 迴歸檢定用統計方法檢測漏斗圖是否不對稱。它以標準誤為預測變項，對效果量進行迴歸分析。

🎯 何時使用：當納入研究數 ≥ 10 篇時。少於 10 篇時統計效力不足，結果不可靠。通常搭配漏斗圖目視檢查一起使用。

📊 怎麼看結果：重點看 p 值和迴歸係數（b）。z 值的大小反映不對稱的程度。

✅ 判斷規則：若 p < 0.05，漏斗圖具統計顯著不對稱，提示可能存在發表偏差（但也可能是異質性造成）。若 p ≥ 0.05，無顯著不對稱證據。記住：不顯著 ≠ 沒有偏差，尤其研究數少時。`,

    influence: `📖 這是什麼：影響力診斷找出對整體結果有「不成比例」影響的研究。像是找出班上拉高或拉低全班平均分的那位同學。

🎯 何時使用：當 leave-one-out 顯示某些研究排除後結果變化很大，或你想系統性檢視每篇研究的影響。

📊 怎麼看結果：重點指標：(1) Cook's distance — 愈大表示影響力愈大。(2) DFFITS — 衡量排除該研究後擬合值的變化。(3) hat — 該研究的槓桿值（權重大小）。(4) cov.r — 排除後共變數比。圖表中標紅點 ● 的為潛在影響力過大的研究。

✅ 判斷規則：沒有絕對的 cutoff 值，但明顯高於其他研究的點需要注意。若影響力大的研究同時有高偏差風險（RoB），考慮在敏感性分析中排除後重新分析。`,

    subgroup: `📖 這是什麼：將研究依某個特徵（調節變項）分組，分別計算各組的效果量，然後檢定組間是否有統計顯著差異。

🎯 何時使用：當 I² 偏高、臨床上有理由懷疑某個變項會影響結果（例如藥物劑量、疾病嚴重度、研究設計），且該變項在資料中有變異。

📊 怎麼看結果：(1) 各組的效果量、信賴區間和 p 值。(2) QM 檢定（組間差異檢定）— 這是最重要的統計量。(3) 各組的 I² 表示組內異質性。

✅ 判斷規則：若 QM 檢定 p < 0.05，各組之間有統計顯著差異，該調節變項可能解釋部分異質性。但也要看臨床意義 — 統計顯著的差異不一定有臨床重要性。注意各組的研究數是否足夠。`,

    metareg: `📖 這是什麼：統合迴歸是次群組分析的延伸，可處理連續型調節變項（如平均年齡、追蹤時間）。它用迴歸模型檢驗調節變項是否與效果量有線性關係。

🎯 何時使用：當調節變項是連續型（不適合分組），或你想同時控制多個潛在調節變項。通常需要至少 10 篇研究，每個迴歸變項至少需 10 篇。

📊 怎麼看結果：(1) 迴歸係數（estimate）— 調節變項每增加一個單位，效果量預期的改變量。(2) p 值 — 該變項是否顯著。(3) QM 檢定 — 調節變項整體是否顯著。(4) R² — 被解釋的異質性比例。

✅ 判斷規則：若 p < 0.05 且 R² > 0，該變項能解釋部分研究間異質性。R² 愈高表示解釋力愈強。但注意：研究數少時 R² 可能不穩定，且統合迴歸是觀察性分析，不能推論因果。`,
  },

  en: {
    leaveOneOut: `📖 What it is: Remove each study one at a time, recalculate the overall effect, and check whether the result changes substantially. This is the most basic sensitivity analysis.

🎯 When to use it: When you want to confirm your conclusion isn't being driven by a single influential study.

📊 How to read the output: Each row shows the effect size (estimate), confidence interval (ci.lb, ci.ub), and p-value after removing that study. Compare each row's estimate to your original pooled result.

✅ Decision rule: If removing any single study doesn't substantially change the effect (same direction, same significance), your conclusion is robust. If removing one study flips the result (e.g., significant → non-significant), that study needs closer scrutiny.`,

    trimFill: `📖 What it is: Assumes funnel plot asymmetry is caused by unpublished small or negative studies. Trim-and-Fill estimates the number and location of 'missing studies' and imputes them to produce an adjusted effect size.

🎯 When to use it: When the funnel plot looks asymmetric, or you want to quantify how publication bias might affect your conclusion.

📊 How to read the output: The R output shows the number of estimated missing studies (usually on the left side). Compare the original vs. adjusted effect size and p-value. In the funnel plot, open circles ○ are the imputed hypothetical studies.

✅ Decision rule: If zero missing studies are estimated, there's no strong evidence of publication bias. If the adjusted effect changes substantially or loses significance after imputation, publication bias may threaten the reliability of your conclusion.`,

    eggers: `📖 What it is: Egger's regression test statistically detects funnel plot asymmetry by regressing effect sizes on their standard errors.

🎯 When to use it: When you have ≥ 10 studies. With fewer than 10, the test has insufficient power and results are unreliable. Usually used alongside visual inspection of the funnel plot.

📊 How to read the output: Focus on the p-value and regression coefficient (b). The z-value reflects the degree of asymmetry.

✅ Decision rule: If p < 0.05, the funnel plot shows statistically significant asymmetry, suggesting possible publication bias (though heterogeneity can also cause asymmetry). If p ≥ 0.05, no significant evidence of asymmetry. Remember: non-significant ≠ no bias, especially with few studies.`,

    influence: `📖 What it is: Influence diagnostics identify studies that have a disproportionate effect on the overall result — like finding the one student pulling the class average up or down.

🎯 When to use it: When leave-one-out analysis suggests some studies cause large shifts, or when you want to systematically examine each study's leverage on the result.

📊 How to read the output: Key metrics: (1) Cook's distance — larger = more influential. (2) DFFITS — measures change in fitted value when that study is removed. (3) hat — the study's leverage (weight). (4) cov.r — covariance ratio after removal. Red dots ● in plots flag potentially over-influential studies.

✅ Decision rule: There's no absolute cutoff, but points clearly higher than others deserve attention. If a high-influence study also has high risk of bias, consider re-running the analysis excluding it as a sensitivity check.`,

    subgroup: `📖 What it is: Split studies into groups based on a characteristic (moderator variable), calculate the effect size within each group, then test whether groups differ significantly.

🎯 When to use it: When I² is high and you have a clinical reason to suspect a variable affects the result (e.g., drug dose, disease severity, study design), and that variable varies across your included studies.

📊 How to read the output: (1) Each subgroup's effect size, confidence interval, and p-value. (2) The QM test (test of moderators) — this is the key statistic. (3) Each subgroup's I² shows within-group heterogeneity.

✅ Decision rule: If QM test p < 0.05, there's a statistically significant difference between subgroups, and the moderator may explain some heterogeneity. But also consider clinical significance — a statistically significant difference isn't always clinically important. Check that each subgroup has enough studies.`,

    metareg: `📖 What it is: Meta-regression extends subgroup analysis to handle continuous moderators (e.g., mean age, follow-up duration). It fits a regression model testing whether the moderator has a linear relationship with the effect size.

🎯 When to use it: When the moderator is continuous (not suitable for grouping), or when you want to control for multiple potential moderators simultaneously. Generally needs at least 10 studies per regression variable.

📊 How to read the output: (1) Regression coefficient (estimate) — the expected change in effect size per one-unit increase in the moderator. (2) p-value — whether the moderator is significant. (3) QM test — overall significance of the moderator. (4) R² — proportion of heterogeneity explained.

✅ Decision rule: If p < 0.05 and R² > 0, the variable explains some between-study heterogeneity. Higher R² = stronger explanatory power. Caveats: R² can be unstable with few studies, and meta-regression is observational — it cannot prove causation.`,
  },
};

export default ADVANCED_GUIDES;
