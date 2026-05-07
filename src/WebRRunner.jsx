import { useState, useEffect, useRef, useCallback } from "react";
import { useWorkshopField, resetWorkshop } from "./useWorkshopField";
import ADVANCED_GUIDES from "./advancedGuides";

// ═══ DESIGN TOKENS (matches Final.jsx) ═══
const CRIMSON = "#C0392B";
const DARK = "#1D2B3A";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const GREEN = "#3DA87A";
const AMBER = "#D4A843";
const BLUE = "#2E86C1";
const PURPLE = "#8E44AD";
const FONT = "'Noto Sans TC', 'Outfit', sans-serif";

// ═══ BILINGUAL TEXT ═══
const TX = {
  zh: {
    initTitle: "載入 R 統計引擎",
    initEngine: "正在下載 WebR 引擎...",
    initPackage: "正在安裝 metafor 套件...",
    initReady: "R 引擎已就緒",
    initFailed: "R 引擎載入失敗",
    initRetry: "重試",
    runBtn: "▶ 執行統合分析",
    running: "正在執行 R 程式碼...",
    forestTitle: "森林圖 (Forest Plot)",
    funnelTitle: "漏斗圖 (Funnel Plot)",
    outputTitle: "R 輸出結果",
    codeTitle: "R 程式碼",
    showCode: "顯示程式碼",
    hideCode: "隱藏程式碼",
    aiInterpret: "🤖 AI 解讀結果",
    aiInterpreting: "AI 分析中...",
    interpretTitle: "AI 結果解讀",
    downloadForest: "下載森林圖",
    downloadFunnel: "下載漏斗圖",
    forestGuideBtn: "📖 如何解讀森林圖？",
    forestGuide: "◆ 每條橫線 = 一篇研究的效果量與 95% 信賴區間\n◆ 橫線越短 = 精確度越高（通常樣本越大）\n◆ 方塊大小 = 該研究的權重（越大 = 權重越高）\n◆ 底部菱形 = 合併效果量（菱形寬度 = 信賴區間）\n◆ 垂直虛線 = 無效線（OR=1 或 MD=0）\n◆ 若菱形未跨越無效線 → 合併效果達統計顯著",
    funnelGuideBtn: "📖 如何解讀漏斗圖？",
    funnelGuide: "◆ 每個點 = 一篇研究\n◆ X 軸 = 效果量，Y 軸 = 標準誤（越上方 = 精確度越高）\n◆ 理想狀態：點應對稱分布在合併效果線兩側，形成倒漏斗形\n◆ 若一側明顯缺少研究 → 可能存在發表偏差\n◆ 底部離散的點 = 小型研究（精確度低，變異大屬正常）\n◆ 研究數少於 10 篇時，漏斗圖的判讀力有限",
    errorTitle: "執行錯誤",
    errorHint: "如遇到問題，可使用「線上計算器」或「R 程式碼」分頁。",
    desktopNote: "建議使用桌面瀏覽器以獲得最佳體驗",
    stepEngine: "R 引擎",
    stepPackage: "安裝套件",
    stepReady: "就緒",

    // Layer 2: Advanced Analysis
    advTitle: "進階分析",
    advSubtitle: "根據基本分析結果，選擇進一步的統計檢測。AI 會根據你的資料推薦適合的分析。",
    advRecommend: "🤖 AI 推薦分析",
    advRecommending: "AI 評估中...",
    advRecommendTitle: "AI 推薦",
    advRun: "▶ 執行進階分析",
    advRunning: "正在執行進階分析...",
    advInterpret: "🤖 AI 解讀進階結果",
    advInterpretTitle: "AI 進階解讀",
    advOutputTitle: "進階分析 R 輸出",
    advPlotTitle: "進階分析圖表",
    advDownloadPlot: "下載圖表",
    advSelectType: "選擇分析類型",
    advSelectMod: "選擇調節變項",
    advNoMod: "請在規劃篇新增調節變項以啟用此分析",
    advRecommendBadge: "AI 推薦",
    advHistory: "已執行的分析",
    advRunAnother: "執行另一項分析",
    advShowCode: "顯示 R 程式碼",
    advHideCode: "隱藏 R 程式碼",
    advLearnFirst: "📚 先了解這個分析",

    // Analysis type names
    leaveOneOut: "逐一排除敏感性分析",
    leaveOneOutDesc: "逐一排除每篇研究，觀察整體結果的穩定性。",
    trimFill: "Trim-and-Fill 法",
    trimFillDesc: "估計並校正可能的發表偏差。",
    eggers: "Egger's 迴歸檢定",
    eggersDesc: "以統計方法檢測漏斗圖不對稱（發表偏差指標）。",
    influence: "影響力診斷",
    influenceDesc: "辨識對整體結果有不成比例影響的研究。",
    subgroup: "次群組分析",
    subgroupDesc: "依調節變項分組，比較各組效果差異。",
    metareg: "統合迴歸分析",
    metaregDesc: "檢驗調節變項是否能解釋研究間異質性。",

    // Output Reading Guide (side-by-side)
    outputGuideBtn: "📖 看不懂？點此查看解讀指南",
    outputGuideHide: "收起解讀指南",
    guideTip: "💡 p 值 = 效果是否顯著 ｜ I² = 各研究是否一致 ｜ tau² = 差異有多大。三者搭配解讀。",
  },
  en: {
    initTitle: "Loading R Statistical Engine",
    initEngine: "Downloading WebR engine...",
    initPackage: "Installing metafor package...",
    initReady: "R engine ready",
    initFailed: "R engine failed to load",
    initRetry: "Retry",
    runBtn: "▶ Run Meta-Analysis",
    running: "Executing R code...",
    forestTitle: "Forest Plot",
    funnelTitle: "Funnel Plot",
    outputTitle: "R Output",
    codeTitle: "R Code",
    showCode: "Show Code",
    hideCode: "Hide Code",
    aiInterpret: "🤖 AI Interpret Results",
    aiInterpreting: "AI analyzing...",
    interpretTitle: "AI Interpretation",
    downloadForest: "Download Forest Plot",
    downloadFunnel: "Download Funnel Plot",
    forestGuideBtn: "📖 How to read the forest plot?",
    forestGuide: "◆ Each horizontal line = one study's effect size and 95% CI\n◆ Shorter line = more precise (usually larger sample)\n◆ Square size = study weight (bigger = more weight)\n◆ Diamond at bottom = pooled effect (width = CI)\n◆ Vertical dashed line = line of no effect (OR=1 or MD=0)\n◆ If diamond doesn't cross the no-effect line → pooled effect is statistically significant",
    funnelGuideBtn: "📖 How to read the funnel plot?",
    funnelGuide: "◆ Each dot = one study\n◆ X-axis = effect size, Y-axis = standard error (higher = more precise)\n◆ Ideally: dots should be symmetrically distributed around the pooled effect line, forming an inverted funnel\n◆ If one side has noticeably fewer studies → possible publication bias\n◆ Dots at the bottom = smaller studies (less precise, more scatter is normal)\n◆ With fewer than 10 studies, funnel plot interpretation has limited power",
    errorTitle: "Execution Error",
    errorHint: "If you encounter issues, try the Online Calculator or R Code tabs.",
    desktopNote: "Desktop browser recommended for best experience",
    stepEngine: "R Engine",
    stepPackage: "Packages",
    stepReady: "Ready",

    // Layer 2: Advanced Analysis
    advTitle: "Advanced Analysis",
    advSubtitle: "Based on your basic results, select further statistical tests. AI can recommend analyses suited to your data.",
    advRecommend: "🤖 AI Recommend Analyses",
    advRecommending: "AI evaluating...",
    advRecommendTitle: "AI Recommendations",
    advRun: "▶ Run Advanced Analysis",
    advRunning: "Running advanced analysis...",
    advInterpret: "🤖 AI Interpret Advanced Results",
    advInterpretTitle: "AI Advanced Interpretation",
    advOutputTitle: "Advanced Analysis R Output",
    advPlotTitle: "Advanced Analysis Plot",
    advDownloadPlot: "Download Plot",
    advSelectType: "Select analysis type",
    advSelectMod: "Select moderator variable",
    advNoMod: "Add moderator columns in the Planning workshop to enable this analysis",
    advRecommendBadge: "AI Recommended",
    advHistory: "Completed Analyses",
    advRunAnother: "Run Another Analysis",
    advShowCode: "Show R Code",
    advHideCode: "Hide R Code",
    advLearnFirst: "📚 Learn About This Analysis",

    // Analysis type names
    leaveOneOut: "Leave-One-Out Sensitivity",
    leaveOneOutDesc: "Remove each study one at a time to check result stability.",
    trimFill: "Trim-and-Fill",
    trimFillDesc: "Estimate and adjust for potential publication bias.",
    eggers: "Egger's Regression Test",
    eggersDesc: "Statistically test for funnel plot asymmetry (publication bias indicator).",
    influence: "Influence Diagnostics",
    influenceDesc: "Identify studies with disproportionate influence on overall results.",
    subgroup: "Subgroup Analysis",
    subgroupDesc: "Compare effect sizes across subgroups defined by a moderator variable.",
    metareg: "Meta-Regression",
    metaregDesc: "Test whether a moderator variable explains between-study heterogeneity.",

    // Output Reading Guide (side-by-side)
    outputGuideBtn: "📖 Not sure what this means? Open the reading guide",
    outputGuideHide: "Hide reading guide",
    guideTip: "💡 p-value = is the effect significant? ｜ I² = are studies consistent? ｜ tau² = how large is the variation? Read all three together.",
  },
};

// ═══ LOADING STATES ═══
const STATUS = {
  IDLE: "idle",
  LOADING_ENGINE: "loading_engine",
  LOADING_PACKAGES: "loading_packages",
  READY: "ready",
  RUNNING: "running",
  DONE: "done",
  ERROR: "error",
};

// ═══ ANALYSIS TYPES ═══
const ANALYSIS_TYPES = [
  { key: "leaveOneOut", icon: "🔍", needsMod: false },
  { key: "trimFill", icon: "📐", needsMod: false },
  { key: "eggers", icon: "📏", needsMod: false },
  { key: "influence", icon: "⚖️", needsMod: false },
  { key: "subgroup", icon: "📊", needsMod: true },
  { key: "metareg", icon: "📈", needsMod: true },
];

// ═══ LAYER 2: STATIC R TEMPLATE BLOCKS ═══
// AI never writes R code. These are pre-tested templates.
// JS validates analysis type against whitelist, slots moderator name if needed.

function buildAdvancedRCode(analysisType, moderator, model, studies) {
  const method = model === "fixed" ? 'method="FE"' : 'method="REML"';

  switch (analysisType) {
    case "leaveOneOut":
      return `# ── Leave-One-Out Sensitivity Analysis ──
l1o <- leave1out(res)
l1o_df <- as.data.frame(l1o)
cat("══════════════════════════════════════\\n")
cat("  Leave-One-Out Sensitivity Analysis\\n")
cat("══════════════════════════════════════\\n\\n")
for (i in 1:nrow(l1o_df)) {
  cat(rownames(l1o_df)[i], "\\n")
  cat("  Effect:", round(l1o_df$estimate[i], 4),
      "  95% CI:", round(l1o_df$ci.lb[i], 4), "to", round(l1o_df$ci.ub[i], 4),
      "  p:", formatC(l1o_df$pval[i], format="g", digits=4), "\\n")
}
cat("\\n── Summary ──\\n")
cat("Original effect:", round(coef(res), 4), "\\n")
range_est <- range(l1o_df$estimate)
cat("Range after removal:", round(range_est[1], 4), "to", round(range_est[2], 4), "\\n")
cat("Max change:", round(max(abs(l1o_df$estimate - coef(res))), 4), "\\n")`;

    case "trimFill":
      return `# ── Trim-and-Fill Analysis ──
tf <- trimfill(res)
cat("══════════════════════════════════════\\n")
cat("  Trim-and-Fill Analysis\\n")
cat("══════════════════════════════════════\\n\\n")
cat("Estimated missing studies:", tf$k0, "(", tf$side, "side )\\n\\n")
cat("── Adjusted Results ──\\n")
cat("Effect:", round(coef(tf), 4), "\\n")
cat("95% CI:", round(tf$ci.lb, 4), "to", round(tf$ci.ub, 4), "\\n")
cat("p-value:", formatC(tf$pval, format="g", digits=4), "\\n\\n")
cat("── Comparison ──\\n")
cat("Original effect:", round(coef(res), 4), "\\n")
cat("Adjusted effect:", round(coef(tf), 4), "\\n")
cat("Change:", round(abs(coef(tf) - coef(res)), 4), "\\n")
funnel(tf, main = "Funnel Plot (Trim-and-Fill)")`;

    case "eggers":
      return `# ── Egger's Regression Test ──
reg_test <- regtest(res)
cat("══════════════════════════════════════\\n")
cat("  Egger's Regression Test\\n")
cat("══════════════════════════════════════\\n\\n")
cat("Tests for funnel plot asymmetry\\n")
cat("(asymmetry suggests possible publication bias)\\n\\n")
cat("z-value:", round(reg_test$zval, 4), "\\n")
cat("p-value:", formatC(reg_test$pval, format="g", digits=4), "\\n\\n")
if (reg_test$pval < 0.05) cat("Result: Significant asymmetry detected (p < 0.05)\\n") else cat("Result: No significant asymmetry (p >= 0.05)\\n")
if (res$k < 10) cat("Note: Test has low power with fewer than 10 studies (k =", res$k, ")\\n")`;

    case "influence":
          return `# ── Influence Diagnostics ──
inf <- influence(res)
inf_df <- as.data.frame(inf$inf)
k <- nrow(inf_df)
cat("══════════════════════════════════════\\n")
cat("  Influence Diagnostics\\n")
cat("══════════════════════════════════════\\n\\n")
for (i in 1:k) {
  cat(res$slab[i], "\\n")
  cat("  Cook's D:", round(inf_df$cook.d[i], 4),
      "  DFFITS:", round(inf_df$dffits[i], 4),
      "  hat:", round(inf_df$hat[i], 4), "\\n")
}
cat("\\n── Potential Outliers ──\\n")
cd_threshold <- 4 / k
dffits_threshold <- 3 * sqrt(1 / (k - 1))
cd_flag <- which(inf_df$cook.d > cd_threshold)
df_flag <- which(abs(inf_df$dffits) > dffits_threshold)
rs_flag <- which(abs(inf_df$rstudent) > 2)
all_flag <- sort(unique(c(cd_flag, df_flag, rs_flag)))
if (length(all_flag) > 0) {
  cat("Flagged studies:\\n")
  for (j in all_flag) {
    reasons <- c()
    if (j %in% cd_flag) reasons <- c(reasons, paste0("Cook's D = ", round(inf_df$cook.d[j], 4), " > ", round(cd_threshold, 4)))
    if (j %in% df_flag) reasons <- c(reasons, paste0("|DFFITS| = ", round(abs(inf_df$dffits[j]), 4), " > ", round(dffits_threshold, 4)))
    if (j %in% rs_flag) reasons <- c(reasons, paste0("|rstudent| = ", round(abs(inf_df$rstudent[j]), 4), " > 2"))
    cat("  ", res$slab[j], ":", paste(reasons, collapse="; "), "\\n")
  }
} else {
  cat("No studies with unusually high influence\\n")
}
plot(inf)`;

    case "subgroup": {
      if (!moderator) return null;
      const safemod = moderator.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
      const vals = [...new Set(studies.map(s => s.moderators?.[moderator]).filter(v => v != null && v !== ""))];
      if (vals.length === 0) return null;

      let code = `# ── Subgroup Analysis by "${moderator}" ──\n`;
      code += `cat("══════════════════════════════════════\\n")\n`;
      code += `cat("  Subgroup Analysis: ${moderator}\\n")\n`;
      code += `cat("══════════════════════════════════════\\n\\n")\n`;
      vals.forEach((val) => {
        const valStr = String(val);
        const safeVal = valStr.replace(/"/g, '\\"');
        const safeVarName = valStr.replace(/[^a-zA-Z0-9]/g, "_");
        code += `\nres_sub_${safeVarName} <- tryCatch(\n`;
        code += `  rma(yi, vi, data = dat, subset = (${safemod} == "${safeVal}"), ${method}, slab = dat$study),\n`;
        code += `  error = function(e) NULL)\n`;
        code += `cat("── ${moderator} = ${safeVal} ──\\n")\n`;
        code += `if (!is.null(res_sub_${safeVarName})) {\n`;
        code += `  cat("Studies:", res_sub_${safeVarName}$k, "\\n")\n`;
        code += `  cat("Effect:", round(coef(res_sub_${safeVarName}), 4), "\\n")\n`;
        code += `  cat("95% CI:", round(res_sub_${safeVarName}$ci.lb, 4), "to", round(res_sub_${safeVarName}$ci.ub, 4), "\\n")\n`;
        code += `  cat("p-value:", formatC(res_sub_${safeVarName}$pval, format="g", digits=4), "\\n")\n`;
        code += `  cat("I²:", round(res_sub_${safeVarName}$I2, 1), "%\\n\\n")\n`;
        code += `} else { cat("(too few studies to analyze)\\n\\n") }\n`;
      });
      code += `\ncat("── Between-Group Test ──\\n")\n`;
      code += `res_mod <- rma(yi, vi, mods = ~ factor(${safemod}), data = dat, ${method})\n`;
      code += `cat("QM:", round(res_mod$QM, 4), "  df:", res_mod$m, "  p:", formatC(res_mod$QMp, format="g", digits=4), "\\n")\n`;
      code += `if (res_mod$QMp < 0.05) cat("Result: Significant difference between subgroups\\n") else cat("Result: No significant difference between subgroups\\n")\n`;
      return code;
    }

    case "metareg": {
      if (!moderator) return null;
      const safemod = moderator.replace(/[^a-zA-Z0-9_]/g, "_").toLowerCase();
      return `# ── Meta-Regression: ${moderator} ──
res_reg <- rma(yi, vi, mods = ~ ${safemod}, data = dat, ${method})
cat("══════════════════════════════════════\\n")
cat("  Meta-Regression: ${moderator}\\n")
cat("══════════════════════════════════════\\n\\n")
cat("── Coefficients ──\\n")
ct <- coef(summary(res_reg))
for (i in 1:nrow(ct)) {
  cat(rownames(ct)[i], "\\n")
  cat("  Estimate:", round(ct[i, "estimate"], 4),
      "  SE:", round(ct[i, "se"], 4),
      "  p:", formatC(ct[i, "pval"], format="g", digits=4), "\\n")
}
cat("\\n── Model Fit ──\\n")
cat("QM (test of moderator):", round(res_reg$QM, 4), "  p:", formatC(res_reg$QMp, format="g", digits=4), "\\n")
r2_val <- ifelse(is.null(res_reg$R2), NA, res_reg$R2)
cat("R²:", ifelse(is.na(r2_val), "N/A", paste0(round(r2_val, 1), "%")), "of heterogeneity explained\\n")
cat("Residual I²:", round(res_reg$I2, 1), "%\\n")
if (res_reg$QMp < 0.05) cat("\\nResult: ${moderator} significantly predicts effect size\\n") else cat("\\nResult: ${moderator} does not significantly predict effect size\\n")`;
    }

    default:
      return null;
  }
}

// ═══ AI PROMPTS FOR LAYER 2 ═══

function getAdvancedInterpretPrompt(analysisType, moderator, lang, pico, effectType, model) {
  const isZh = lang === "zh";
  const picoStr = `P: ${pico?.p || "?"} | I: ${pico?.i || "?"} | C: ${pico?.c || "?"} | O: ${pico?.o || "?"}`;
  const modelStr = isZh ? (model === "random" ? "隨機效果" : "固定效果") : (model === "random" ? "Random-Effects" : "Fixed-Effect");

  const prompts = {
    leaveOneOut: {
      zh: `你是統合分析專家。以下是逐一排除敏感性分析結果。
研究主題 — ${picoStr}　效果量：${effectType}　模型：${modelStr}
請解讀：
1. 排除哪篇研究後效果量變化最大？
2. 整體結論是否穩健？
3. 是否有任何研究對結果有不成比例的影響？
3-5 句繁體中文。不用 Markdown。`,
      en: `You are a meta-analysis expert. These are leave-one-out sensitivity results.
Study topic — ${picoStr} | Effect: ${effectType} | Model: ${modelStr}
Interpret:
1. Which study's removal most changes the effect?
2. Is the overall conclusion robust?
3. Does any study have disproportionate influence?
3-5 sentences. No Markdown.`,
    },
    trimFill: {
      zh: `你是統合分析專家。以下是 Trim-and-Fill 分析結果。
研究主題 — ${picoStr}　效果量：${effectType}　模型：${modelStr}
請解讀：
1. 估計了多少篇缺失研究？
2. 校正後的效果量與原始結果差異大嗎？
3. 是否有發表偏差的證據？
3-5 句繁體中文。不用 Markdown。`,
      en: `You are a meta-analysis expert. These are trim-and-fill results.
Study topic — ${picoStr} | Effect: ${effectType} | Model: ${modelStr}
Interpret:
1. How many missing studies were estimated?
2. Does the adjusted effect differ substantially from the original?
3. Is there evidence of publication bias?
3-5 sentences. No Markdown.`,
    },
    eggers: {
      zh: `你是統合分析專家。以下是 Egger's 迴歸檢定結果。
研究主題 — ${picoStr}　效果量：${effectType}　模型：${modelStr}
請解讀：
1. 檢定結果是否顯著（p 值）？
2. 這對發表偏差意味著什麼？
3. 結合研究數量，你對此結果的信心如何？
3-5 句繁體中文。不用 Markdown。`,
      en: `You are a meta-analysis expert. These are Egger's regression test results.
Study topic — ${picoStr} | Effect: ${effectType} | Model: ${modelStr}
Interpret:
1. Is the test significant (p-value)?
2. What does this imply about publication bias?
3. Given the number of studies, how confident are you in this result?
3-5 sentences. No Markdown.`,
    },
    influence: {
      zh: `你是統合分析專家。以下是影響力診斷結果。
研究主題 — ${picoStr}　效果量：${effectType}　模型：${modelStr}
請解讀：
1. 哪些研究的影響力指標（如 Cook's distance、DFFITS）最高？
2. 是否有研究需要特別注意或考慮排除？
3. 移除高影響力研究後，結論是否可能改變？
3-5 句繁體中文。不用 Markdown。`,
      en: `You are a meta-analysis expert. These are influence diagnostics results.
Study topic — ${picoStr} | Effect: ${effectType} | Model: ${modelStr}
Interpret:
1. Which studies have the highest influence metrics (e.g., Cook's distance, DFFITS)?
2. Do any studies warrant special attention or potential exclusion?
3. Could removing high-influence studies change the conclusions?
3-5 sentences. No Markdown.`,
    },
    subgroup: {
      zh: `你是統合分析專家。以下是依「${moderator}」分組的次群組分析結果。
研究主題 — ${picoStr}　效果量：${effectType}　模型：${modelStr}
請解讀：
1. 各組效果量及方向
2. 組間差異是否有統計意義（QM 檢定）
3. 可能的臨床解釋
3-5 句繁體中文。不用 Markdown。`,
      en: `You are a meta-analysis expert. These are subgroup analysis results by "${moderator}".
Study topic — ${picoStr} | Effect: ${effectType} | Model: ${modelStr}
Interpret:
1. Effect size and direction per subgroup
2. Whether between-group differences are statistically significant (QM test)
3. Possible clinical explanations
3-5 sentences. No Markdown.`,
    },
    metareg: {
      zh: `你是統合分析專家。以下是以「${moderator}」為調節變項的統合迴歸結果。
研究主題 — ${picoStr}　效果量：${effectType}　模型：${modelStr}
請解讀：
1. 調節變項的係數及顯著性
2. 是否能解釋研究間異質性
3. 臨床意義
3-5 句繁體中文。不用 Markdown。`,
      en: `You are a meta-analysis expert. These are meta-regression results with "${moderator}" as moderator.
Study topic — ${picoStr} | Effect: ${effectType} | Model: ${modelStr}
Interpret:
1. Moderator coefficient and significance
2. Whether it explains between-study heterogeneity
3. Clinical significance
3-5 sentences. No Markdown.`,
    },
  };

  return prompts[analysisType]?.[lang] || prompts[analysisType]?.en || "";
}

function getRecommendPrompt(lang, pico, effectType, model, moderatorColumns, studyCount) {
  const picoStr = `P: ${pico?.p || "?"} | I: ${pico?.i || "?"} | C: ${pico?.c || "?"} | O: ${pico?.o || "?"}`;
  const modList = moderatorColumns.length > 0 ? moderatorColumns.join(", ") : "none";

  if (lang === "zh") {
    return `你是統合分析方法學專家。根據基本分析的 R 輸出結果，為研究者推薦 2-3 項最適合的進階分析。

研究主題 — ${picoStr}
效果量：${effectType}　模型：${model === "random" ? "隨機效果" : "固定效果"}
納入研究數：${studyCount}
可用調節變項：${modList}

可選分析類型：
- leaveOneOut：逐一排除敏感性分析
- trimFill：Trim-and-Fill 法
- eggers：Egger's 迴歸檢定
- influence：影響力診斷
- subgroup：次群組分析（需要調節變項）
- metareg：統合迴歸（需要調節變項）

根據 I²、Q 檢定、研究數量、和可用的調節變項，回答以下格式（純 JSON，不要 Markdown）：
[{"type":"分析類型key","moderator":"調節變項名稱或null","reason":"1句推薦理由"}]`;
  }

  return `You are a meta-analysis methodology expert. Based on the basic analysis R output, recommend 2-3 advanced analyses most appropriate for this dataset.

Study topic — ${picoStr}
Effect: ${effectType} | Model: ${model === "random" ? "Random-Effects" : "Fixed-Effect"}
Studies: ${studyCount}
Available moderators: ${modList}

Available analysis types:
- leaveOneOut: Leave-one-out sensitivity analysis
- trimFill: Trim-and-fill
- eggers: Egger's regression test
- influence: Influence diagnostics
- subgroup: Subgroup analysis (requires moderator)
- metareg: Meta-regression (requires moderator)

Based on I², Q-test, number of studies, and available moderators, respond in this format (pure JSON, no Markdown):
[{"type":"analysisTypeKey","moderator":"moderatorName or null","reason":"1 sentence rationale"}]`;
}

// ═══ R OUTPUT PARSER ═══
function parseROutput(rOutput, effectType, model, lang) {
  const zh = lang === "zh";
  const isLog = ["OR", "RR"].includes(effectType);
  const rows = [];

  // 1. Model line: "Model: Random-Effects | Studies: 8"
  const modelMatch = rOutput.match(/Model:\s*([\w-]+)\s*\|\s*Studies:\s*(\d+)/);
  if (modelMatch) {
    const mType = modelMatch[1];
    const k = modelMatch[2];
    const isRandom = /Random/i.test(mType);
    rows.push({
      raw: `Model: ${mType} | Studies: ${k}`,
      plain: zh
        ? `使用${isRandom ? "隨機效果" : "固定效果"}模型，包含 ${k} 篇研究`
        : `${isRandom ? "Random-effects" : "Fixed-effect"} model with ${k} studies`,
      color: "#8E44AD",
    });
  }

  // 2. Pooled effect: "OR: 0.8301"
  const measure = effectType || "OR";
  const pooledMatch = rOutput.match(new RegExp(`${measure}:\\s*([\\d.e+-]+)`));
  const ciMatch = rOutput.match(/95%\s*CI:\s*([\d.e+-]+)\s*to\s*([\d.e+-]+)/);
  const pMatch = rOutput.match(/p-value:\s*([\d.e<+-]+\S*)/);

  if (pooledMatch) {
    const val = parseFloat(pooledMatch[1]);
    const ciLb = ciMatch ? parseFloat(ciMatch[1]) : null;
    const ciUb = ciMatch ? parseFloat(ciMatch[2]) : null;
    const nullVal = isLog ? 1 : 0;

    // Effect meaning
    let meaning;
    if (zh) {
      if (measure === "OR") meaning = val < 1 ? `介入組勝算較低（OR = ${val.toFixed(2)}，降低 ${((1 - val) * 100).toFixed(0)}%）` : `介入組勝算較高（OR = ${val.toFixed(2)}）`;
      else if (measure === "RR") meaning = val < 1 ? `介入組風險較低（RR = ${val.toFixed(2)}，降低 ${((1 - val) * 100).toFixed(0)}%）` : `介入組風險較高（RR = ${val.toFixed(2)}）`;
      else if (measure === "RD") meaning = `兩組風險絕對差 = ${val.toFixed(4)}`;
      else if (measure === "MD") meaning = `兩組平均值差 = ${val.toFixed(2)}`;
      else if (measure === "SMD") meaning = `標準化均值差 = ${val.toFixed(2)}`;
      else meaning = `${measure} = ${val.toFixed(4)}`;
    } else {
      if (measure === "OR") meaning = val < 1 ? `Intervention has lower odds (OR = ${val.toFixed(2)}, ${((1 - val) * 100).toFixed(0)}% reduction)` : `Intervention has higher odds (OR = ${val.toFixed(2)})`;
      else if (measure === "RR") meaning = val < 1 ? `Intervention has lower risk (RR = ${val.toFixed(2)}, ${((1 - val) * 100).toFixed(0)}% reduction)` : `Intervention has higher risk (RR = ${val.toFixed(2)})`;
      else if (measure === "RD") meaning = `Absolute risk difference = ${val.toFixed(4)}`;
      else if (measure === "MD") meaning = `Mean difference = ${val.toFixed(2)}`;
      else if (measure === "SMD") meaning = `Standardized mean diff = ${val.toFixed(2)}`;
      else meaning = `${measure} = ${val.toFixed(4)}`;
    }

    // CI interpretation
    let ciNote = "";
    if (ciLb !== null && ciUb !== null) {
      const includes = isLog ? (ciLb <= 1 && ciUb >= 1) : (ciLb <= 0 && ciUb >= 0);
      ciNote = includes
        ? (zh ? `95% CI 包含 ${nullVal} → 可能不顯著` : `95% CI includes ${nullVal} → may not be significant`)
        : (zh ? `95% CI 不包含 ${nullVal} → 統計顯著` : `95% CI excludes ${nullVal} → significant`);
    }

    rows.push({
      raw: `${measure}: ${val.toFixed(4)} (${ciLb?.toFixed(4)} – ${ciUb?.toFixed(4)})`,
      plain: `${meaning}\n${ciNote}`,
      color: "#C0392B",
    });
  }

  // 3. p-value: "p-value: 4.15e-11"
  if (pMatch) {
    const pRaw = pMatch[1];
    const pVal = parseFloat(pRaw);
    const pDisplay = pVal < 0.001 ? "< 0.001" : pVal.toFixed(4);
    rows.push({
      raw: `p-value: ${pRaw}`,
      plain: pVal < 0.001
        ? (zh ? `p ${pDisplay} → 非常顯著（強證據）` : `p ${pDisplay} → highly significant (strong evidence)`)
        : pVal < 0.05
          ? (zh ? `p = ${pDisplay} → 達顯著水準` : `p = ${pDisplay} → statistically significant`)
          : (zh ? `p = ${pDisplay} → 未達顯著` : `p = ${pDisplay} → not significant`),
      color: "#2E86C1",
    });
  }

  // 4. I²: "I²: 0 %  (none)"
  const i2Match = rOutput.match(/I²:\s*([\d.]+)\s*%/);
  if (i2Match) {
    const i2 = parseFloat(i2Match[1]);
    let level;
    if (zh) level = i2 === 0 ? "無異質性，各研究高度一致" : i2 <= 25 ? "低度異質性" : i2 <= 50 ? "中度異質性" : "高度異質性，建議探索原因";
    else level = i2 === 0 ? "No heterogeneity — highly consistent" : i2 <= 25 ? "Low heterogeneity" : i2 <= 50 ? "Moderate heterogeneity" : "High heterogeneity — investigate";
    rows.push({ raw: `I² = ${i2}%`, plain: `${zh ? "異質性" : "Heterogeneity"} ${i2}% → ${level}`, color: "#D4A843" });
  }

  // 5. tau²: "tau²: 0"
  const tau2Match = rOutput.match(/tau²:\s*([\d.e+-]+)/);
  if (tau2Match) {
    const tau2 = parseFloat(tau2Match[1]);
    rows.push({
      raw: `tau² = ${tau2}`,
      plain: tau2 === 0
        ? (zh ? "研究間無額外差異" : "No between-study variance")
        : (zh ? `研究間變異 = ${tau2}` : `Between-study variance = ${tau2}`),
      color: "#8E44AD",
    });
  }

  // 6. Q test: "Q = 4.51 (df = 7, p = 0.72)"
  const qMatch = rOutput.match(/Q\s*=\s*([\d.]+)\s*\(df\s*=\s*(\d+)\s*,\s*p\s*=\s*([\d.]+)\)/);
  if (qMatch) {
    const qp = parseFloat(qMatch[3]);
    rows.push({
      raw: `Q = ${qMatch[1]} (df = ${qMatch[2]}, p = ${qp})`,
      plain: qp < 0.05
        ? (zh ? `Q 檢定 p = ${qp} → 顯著，各研究結果不一致` : `Q test p = ${qp} → significant, studies differ`)
        : (zh ? `Q 檢定 p = ${qp} → 不顯著，各研究結果一致` : `Q test p = ${qp} → non-significant, consistent`),
      color: "#3DA87A",
    });
  }

  return rows;
}

// ═══ SIDE-BY-SIDE READING GUIDE ═══
function SideBySideGuide({ rows, tip, lang }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div style={{
      marginTop: 12, borderRadius: 14, overflow: "hidden",
      border: `1px solid ${BLUE}25`,
    }}>
      {/* Header row */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
        background: `${BLUE}10`, borderBottom: `1px solid ${BLUE}20`,
      }}>
        <div style={{ padding: "8px 14px", fontSize: 12, fontWeight: 700, color: DARK, fontFamily: FONT }}>
          R Output
        </div>
        <div style={{ padding: "8px 14px", fontSize: 12, fontWeight: 700, color: DARK, fontFamily: FONT, borderLeft: `1px solid ${BLUE}20` }}>
          {lang === "zh" ? "白話翻譯" : "Plain-language translation"}
        </div>
      </div>

      {/* Data rows */}
      {rows.map((row, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
          borderBottom: i < rows.length - 1 ? `1px solid ${LIGHT_BORDER}` : "none",
        }}>
          <div className="r-output-cell" style={{
            padding: "10px 14px", fontSize: 12, lineHeight: 1.6,
            fontFamily: "'Courier New', Courier, monospace",
            background: "#1E1E2E", color: "#CDD6F4",
            borderLeft: `3px solid ${row.color}`,
            whiteSpace: "pre-wrap", wordBreak: "break-word",
          }}>
            {row.raw}
          </div>
          <div style={{
            padding: "10px 14px", fontSize: 13, lineHeight: 1.6,
            color: DARK, background: CARD_BG,
            borderLeft: `1px solid ${LIGHT_BORDER}`,
            whiteSpace: "pre-wrap",
          }}>
            {row.plain}
          </div>
        </div>
      ))}

      {/* Tip footer */}
      {tip && (
        <div style={{
          padding: "8px 14px", fontSize: 12, color: MUTED,
          background: `${AMBER}08`, borderTop: `1px solid ${LIGHT_BORDER}`,
          lineHeight: 1.6,
        }}>
          {tip}
        </div>
      )}
    </div>
  );
}

function OutputReadingGuide({ rOutput, lang, effectType, model }) {
  const tx = (lang === "zh" ? TX.zh : TX.en);
  const rows = parseROutput(rOutput, effectType, model, lang);
  return <SideBySideGuide rows={rows} tip={tx.guideTip} lang={lang} />;
}

// ═══ ADVANCED OUTPUT PARSER ═══
function parseAdvancedOutput(advOutput, analysisType, lang, effectType) {
  const zh = lang === "zh";
  const isLog = ["OR", "RR"].includes(effectType);
  const rows = [];

  switch (analysisType) {
    case "leaveOneOut": {
      // Parse summary section
      const origMatch = advOutput.match(/Original effect:\s*(-?[\d.]+)/);
      const rangeMatch = advOutput.match(/Range after removal:\s*(-?[\d.]+)\s*to\s*(-?[\d.]+)/);
      const maxMatch = advOutput.match(/Max change:\s*([\d.]+)/);
      // Check if all p-values remain significant
      const pVals = [...advOutput.matchAll(/p:\s*([\d.e<+-]+)/g)].map(m => m[1]);
      const allSig = pVals.every(p => p.startsWith("<") || parseFloat(p) < 0.05);

      if (origMatch) {
        rows.push({
          raw: `Original: ${origMatch[1]}`,
          plain: zh ? `原始合併效果量 = ${origMatch[1]}` : `Original pooled effect = ${origMatch[1]}`,
          color: "#8E44AD",
        });
      }
      if (rangeMatch) {
        const spread = (parseFloat(rangeMatch[2]) - parseFloat(rangeMatch[1])).toFixed(4);
        rows.push({
          raw: `Range: ${rangeMatch[1]} to ${rangeMatch[2]}`,
          plain: zh
            ? `排除任一研究後，效果量在 ${rangeMatch[1]} 到 ${rangeMatch[2]} 之間（變動幅度 ${spread}）`
            : `After removing any study, effect ranges from ${rangeMatch[1]} to ${rangeMatch[2]} (spread ${spread})`,
          color: "#2E86C1",
        });
      }
      if (maxMatch && origMatch) {
        const maxC = parseFloat(maxMatch[1]);
        const orig = Math.abs(parseFloat(origMatch[1]));
        const stable = orig === 0 ? maxC < 0.01 : (maxC / orig) < 0.10;
        rows.push({
          raw: `Max change: ${maxMatch[1]}`,
          plain: stable
            ? (zh ? `最大變動 ${maxC} → 結果穩定，排除任一研究都不會大幅改變結論` : `Max change ${maxC} → results stable, no single study drives the conclusion`)
            : (zh ? `最大變動 ${maxC} → 某些研究對結果有較大影響，需注意` : `Max change ${maxC} → some studies have notable influence, investigate further`),
          color: stable ? "#3DA87A" : "#D4A843",
        });
      }
      if (pVals.length > 0) {
        rows.push({
          raw: allSig ? "All p < 0.05" : "Some p ≥ 0.05",
          plain: allSig
            ? (zh ? "排除任一研究後，結果都維持統計顯著 → 結論穩健" : "Result stays significant after every removal → robust conclusion")
            : (zh ? "排除某些研究後，結果不再顯著 → 結論可能依賴特定研究" : "Result loses significance after some removals → conclusion may depend on specific studies"),
          color: allSig ? "#3DA87A" : "#C0392B",
        });
      }
      break;
    }

    case "trimFill": {
      const missingMatch = advOutput.match(/Estimated missing studies:\s*(\d+)/);
      const adjMatch = advOutput.match(/Adjusted effect:\s*(-?[\d.]+)/);
      const origMatch = advOutput.match(/Original effect:\s*(-?[\d.]+)/);
      const changeMatch = advOutput.match(/Change:\s*([\d.]+)/);

      if (missingMatch) {
        const n = parseInt(missingMatch[1]);
        rows.push({
          raw: `Missing studies: ${n}`,
          plain: n === 0
            ? (zh ? "估計缺失研究數 = 0 → 沒有發現明顯的發表偏差" : "Estimated missing studies = 0 → no evidence of publication bias")
            : (zh ? `估計有 ${n} 篇可能因不顯著而未發表的研究` : `Estimated ${n} studies may be missing due to publication bias`),
          color: n === 0 ? "#3DA87A" : "#D4A843",
        });
      }
      if (origMatch && adjMatch) {
        rows.push({
          raw: `Original: ${origMatch[1]} → Adjusted: ${adjMatch[1]}`,
          plain: zh ? `補入缺失研究後，效果量從 ${origMatch[1]} 變為 ${adjMatch[1]}` : `After imputing missing studies, effect changed from ${origMatch[1]} to ${adjMatch[1]}`,
          color: "#2E86C1",
        });
      }
      if (changeMatch && origMatch) {
        const c = parseFloat(changeMatch[1]);
        const orig = Math.abs(parseFloat(origMatch[1]));
        const big = orig === 0 ? c > 0.01 : (c / orig) > 0.10;
        rows.push({
          raw: `Change: ${changeMatch[1]}`,
          plain: big
            ? (zh ? `變動 ${c} → 校正後效果量明顯改變，可能存在發表偏差` : `Change ${c} → adjusted effect differs notably, publication bias may be present`)
            : (zh ? `變動 ${c} → 校正後效果量變化很小，結果穩定` : `Change ${c} → minimal adjustment, results robust`),
          color: big ? "#D4A843" : "#3DA87A",
        });
      }
      break;
    }

    case "eggers": {
      const zMatch = advOutput.match(/z-value:\s*(-?[\d.]+)/);
      const pMatch = advOutput.match(/p-value:\s*([\d.e<+-]+)/);
      const resultMatch = advOutput.match(/Result:\s*(.+)/);
      const noteMatch = advOutput.match(/Note:\s*(.+)/);

      if (pMatch) {
        const pVal = parseFloat(pMatch[1]);
        const sig = pVal < 0.05;
        rows.push({
          raw: `p-value: ${pMatch[1]}`,
          plain: sig
            ? (zh ? `p = ${pMatch[1]} → 漏斗圖顯著不對稱，提示可能有發表偏差` : `p = ${pMatch[1]} → significant funnel asymmetry, possible publication bias`)
            : (zh ? `p = ${pMatch[1]} → 漏斗圖無顯著不對稱，未發現發表偏差` : `p = ${pMatch[1]} → no significant asymmetry, no evidence of publication bias`),
          color: sig ? "#C0392B" : "#3DA87A",
        });
      }
      if (noteMatch) {
        rows.push({
          raw: noteMatch[0],
          plain: zh ? "研究數少於 10 篇時，此檢定的統計效力較低，結果僅供參考" : "With fewer than 10 studies, this test has low power — interpret with caution",
          color: "#D4A843",
        });
      }
      break;
    }

    case "influence": {
      const flaggedMatch = advOutput.match(/Flagged studies:\n([\s\S]*?)(?:\n\n|$)/);
      const noOutlier = /No studies with unusually high influence/.test(advOutput);

      if (noOutlier) {
        rows.push({
          raw: "No outliers detected",
          plain: zh ? "沒有研究對整體結果有不成比例的影響 → 結果穩定" : "No study has disproportionate influence → results stable",
          color: "#3DA87A",
        });
      } else if (flaggedMatch) {
        const lines = flaggedMatch[1].trim().split("\n").map(l => l.trim()).filter(Boolean);
        lines.forEach(line => {
          const nameMatch = line.match(/^(.+?)\s*:\s*(.+)$/);
          if (nameMatch) {
            rows.push({
              raw: line,
              plain: zh
                ? `⚠ ${nameMatch[1]}：${nameMatch[2].replace(/rstudent/g, "殘差")}`
                : `⚠ ${nameMatch[1]}: ${nameMatch[2]}`,
              color: "#C0392B",
            });
          }
        });
      }
      break;
    }

    case "subgroup": {
      // Parse QM result
      const qmMatch = advOutput.match(/QM:\s*([\d.]+)\s+df:\s*(\d+)\s+p:\s*([\d.e<+-]+)/);
      const resultMatch = advOutput.match(/Result:\s*(.+)/);

      // Parse each subgroup
      const subgroupBlocks = advOutput.split(/── .+ ──/).slice(1);
      const subgroupHeaders = [...advOutput.matchAll(/── (.+) ──/g)].map(m => m[1]).filter(h => h !== "Between-Group Test");

      subgroupHeaders.forEach((header, i) => {
        const block = subgroupBlocks[i] || "";
        const effMatch = block.match(/Effect:\s*(-?[\d.]+)/);
        const pMatch = block.match(/p-value:\s*([\d.e<+-]+)/);
        if (effMatch) {
          const pVal = pMatch ? parseFloat(pMatch[1]) : 1;
          const sig = pVal < 0.05;
          rows.push({
            raw: `${header}: Effect ${effMatch[1]}, p ${pMatch?.[1] || "?"}`,
          plain: zh ? `${header} → 效果量 ${effMatch[1]}` : `${header} → effect ${effMatch[1]}`,
          color: "#6B7A8D",
          });
        }
      });

      if (qmMatch) {
        const qmp = parseFloat(qmMatch[3]);
        rows.push({
          raw: `QM = ${qmMatch[1]}, p = ${qmMatch[3]}`,
          plain: qmp < 0.05
            ? (zh ? `組間差異檢定 p = ${qmMatch[3]} → 各組之間有顯著差異` : `Between-group test p = ${qmMatch[3]} → significant difference between subgroups`)
            : (zh ? `組間差異檢定 p = ${qmMatch[3]} → 各組之間無顯著差異` : `Between-group test p = ${qmMatch[3]} → no significant difference between subgroups`),
          color: qmp < 0.05 ? "#C0392B" : "#3DA87A",
        });
      }
      break;
    }

    case "metareg": {
      const qmMatch = advOutput.match(/QM[^:]*:\s*([\d.]+)\s+p:\s*([\d.e<+-]+)/);
      const r2Match = advOutput.match(/R²:\s*([\d.]+|N\/A)%?\s*/);
      const resultMatch = advOutput.match(/Result:\s*(.+)/);

      if (qmMatch) {
        const qmp = parseFloat(qmMatch[2]);
        rows.push({
          raw: `QM = ${qmMatch[1]}, p = ${qmMatch[2]}`,
          plain: qmp < 0.05
            ? (zh ? `調節變項的效果達顯著（p = ${qmMatch[2]}），能解釋部分異質性` : `Moderator is significant (p = ${qmMatch[2]}), explains some heterogeneity`)
            : (zh ? `調節變項的效果不顯著（p = ${qmMatch[2]}），無法解釋異質性` : `Moderator not significant (p = ${qmMatch[2]}), does not explain heterogeneity`),
          color: qmp < 0.05 ? "#2E86C1" : "#6B7A8D",
        });
      }
      if (r2Match && r2Match[1] !== "N/A") {
        const r2 = parseFloat(r2Match[1]);
        rows.push({
          raw: `R² = ${r2}%`,
          plain: zh ? `此變項解釋了 ${r2}% 的研究間異質性` : `This moderator explains ${r2}% of between-study heterogeneity`,
          color: r2 > 50 ? "#3DA87A" : r2 > 0 ? "#D4A843" : "#6B7A8D",
        });
      }
      break;
    }

    default:
      break;
  }

  return rows;
}

function AdvancedReadingGuide({ advOutput, analysisType, lang, effectType }) {
  const rows = parseAdvancedOutput(advOutput, analysisType, lang, effectType);
  if (!rows || rows.length === 0) return null;
  const tip = lang === "zh"
    ? "💡 進階分析輔助判斷：結果是否穩定、是否有發表偏差、哪些研究影響最大。"
    : "💡 Advanced analyses help assess: result stability, publication bias, and influential studies.";
  return <SideBySideGuide rows={rows} tip={tip} lang={lang} />;
}

// ═══ MAIN COMPONENT ═══
export default function WebRRunner({ rCode, lang = "zh", pico, effectType, model, moderatorColumns = [], studies = [], onAiInterpret, onAdvComplete, user = null }) {
  const tx = TX[lang] || TX.en;
  const WK = "webr_advanced";

  // Layer 1 state
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rOutput, setROutput] = useState(null);
  const [forestImg, setForestImg] = useState(null);
  const [funnelImg, setFunnelImg] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [showOutputGuide, setShowOutputGuide] = useState(false);
  const [showForestGuide, setShowForestGuide] = useState(false);
  const [showFunnelGuide, setShowFunnelGuide] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Layer 2 state — persisted across sessions
  const [advSelectedType, setAdvSelectedType, advSelectedTypeMeta] = useWorkshopField(user, WK, "advSelectedType", null);
  const [advSelectedMod, setAdvSelectedMod] = useWorkshopField(user, WK, "advSelectedMod", moderatorColumns[0] || "");
  const [advOutput, setAdvOutput] = useWorkshopField(user, WK, "advOutput", null);
  const [advRCode, setAdvRCode] = useWorkshopField(user, WK, "advRCode", null);
  const [advHistory, setAdvHistory] = useWorkshopField(user, WK, "advHistory", []);
  const [advAiResult, setAdvAiResult] = useWorkshopField(user, WK, "advAiResult", null);

  // Layer 2 state — ephemeral (UI / in-flight only)
  const [advRunning, setAdvRunning] = useState(false);
  const [advPlotImg, setAdvPlotImg] = useState(null);
  const [advAiLoading, setAdvAiLoading] = useState(false);
  const [advShowCode, setAdvShowCode] = useState(false);
  const [showAdvGuide, setShowAdvGuide] = useState(true);
  const [advError, setAdvError] = useState(null);
  const [advRecommendations, setAdvRecommendations] = useState(null);
  const [advRecommendLoading, setAdvRecommendLoading] = useState(false);
  const [showAdvPanel, setShowAdvPanel] = useState(false);

  const webRRef = useRef(null);
  const initAttemptedRef = useRef(false);

  const hasModerators = moderatorColumns.length > 0;

  // ── Initialize WebR ──
  const initWebR = useCallback(async () => {
    if (webRRef.current) { setStatus(STATUS.READY); return; }
    setStatus(STATUS.LOADING_ENGINE);
    setErrorMsg(null);

    try {
      const { WebR } = await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "module";
        script.textContent = `
          import { WebR } from "https://webr.r-wasm.org/latest/webr.mjs";
          window.__WebR = WebR;
          window.dispatchEvent(new Event("webr-loaded"));
        `;
        const timeoutId = setTimeout(() => {
          reject(new Error("WebR engine took too long to load (network blocked or CDN unreachable)"));
        }, 60000);
        const onLoaded = () => {
          clearTimeout(timeoutId);
          resolve({ WebR: window.__WebR });
        };
        window.addEventListener("webr-loaded", onLoaded, { once: true });
        script.onerror = (e) => { clearTimeout(timeoutId); reject(e); };
        document.head.appendChild(script);
      });
      const webR = new WebR();
      await webR.init();
      webRRef.current = webR;

      setStatus(STATUS.LOADING_PACKAGES);
      await webR.evalRVoid(`
        webr::install("metafor")
        library(metafor)
      `);

      setStatus(STATUS.READY);
    } catch (err) {
      console.error("WebR init failed:", err);
      setErrorMsg(err.message || "Unknown error");
      setStatus(STATUS.ERROR);
    }
  }, []);

  // Auto-init on mount
  useEffect(() => {
    if (!initAttemptedRef.current) {
      initAttemptedRef.current = true;
      initWebR();
    }
  }, [initWebR]);

  // ── Count actual studies from the R code ──
  const countStudies = (code) => {
    const studyLine = code.match(/study\s*=\s*c\(([^)]*)\)/);
    if (!studyLine) return 5;
    return (studyLine[1].match(/"/g) || []).length / 2;
  };

  // ── Convert ImageBitmap to data URL string ──
  const bitmapToDataURL = (bmp) => {
    if (!bmp || !bmp.width || !bmp.height) return null;
    const c = document.createElement("canvas");
    c.width = bmp.width;
    c.height = bmp.height;
    c.getContext("2d").drawImage(bmp, 0, 0);
    return c.toDataURL("image/png");
  };

  // ── Run R Code (Layer 1) ──
  // WebR 0.3.1+ auto-captures plots in captureR's result.images — but ONLY
  // when canvas is opened with capture=TRUE, or when no manual canvas device
  // is used at all. The old code called webr::canvas(capture=FALSE) which
  // sends images as messages instead of storing them in result.images.
  // FIX: Use webr::canvas(capture=TRUE) so captureR collects the ImageBitmaps.
  const handleRun = async () => {
    if (!webRRef.current || !rCode) return;
    const webR = webRRef.current;

    setStatus(STATUS.RUNNING);
    setROutput(null);
    setForestImg(null);
    setFunnelImg(null);
    setAiResult(null);
    setErrorMsg(null);
    // Reset Layer 2
    setShowAdvPanel(false);
    setAdvOutput(null);
    setAdvPlotImg(null);
    setAdvAiResult(null);
    setAdvHistory([]);
    setAdvRecommendations(null);
    setAdvSelectedType(null);

    try {
      const shelter = await new webR.Shelter();

      // Split code into analysis (text) and plots
      const codeLines = rCode.split("\n");
      const plotIdx = codeLines.findIndex(l => l.trim().startsWith("forest("));
      const funnelIdx = codeLines.findIndex(l => l.trim().startsWith("funnel("));

      const firstPlotLine = Math.min(
        plotIdx >= 0 ? plotIdx : codeLines.length,
        funnelIdx >= 0 ? funnelIdx : codeLines.length
      );
      let analysisEnd = firstPlotLine;
      while (analysisEnd > 0 && codeLines[analysisEnd - 1].trim().startsWith("#")) analysisEnd--;
      const analysisCode = codeLines.slice(0, analysisEnd).join("\n");

      // Extract forest plot code
      let forestCode = "";
      if (plotIdx >= 0) {
        let end = plotIdx + 1;
        while (end < codeLines.length && codeLines[end].trim() !== "" && !codeLines[end].trim().startsWith("funnel(") && !codeLines[end].trim().startsWith("# ──")) end++;
        forestCode = codeLines.slice(plotIdx, end).join("\n");
      }

      // Extract funnel plot code
      let funnelCode = "";
      if (funnelIdx >= 0) {
        let end = funnelIdx + 1;
        while (end < codeLines.length && codeLines[end].trim() !== "" && !codeLines[end].trim().startsWith("# ──")) end++;
        funnelCode = codeLines.slice(funnelIdx, end).join("\n");
      }

      // Build canvas dimensions
      const nStudies = countStudies(rCode);
      const plotHeight = Math.max(400, 150 + nStudies * 40);

      // ── Run EVERYTHING in one captureR call ──
      // capture=TRUE makes webr::canvas store images for captureR to collect.
      const fullCode = [
        analysisCode,
        forestCode ? `\nwebr::canvas(width = 900, height = ${plotHeight}, capture = TRUE)\npar(bg = "white")\n${forestCode}\ndev.off()` : "",
        funnelCode ? `\nwebr::canvas(width = 600, height = 500, capture = TRUE)\npar(bg = "white")\n${funnelCode}\ndev.off()` : "",
      ].filter(Boolean).join("\n");

      const result = await shelter.captureR(fullCode, {
        withAutoprint: true, captureStreams: true, captureConditions: false,
      });

      // Extract text output — strip canvas device messages
      const outputText = result.output.map(o => o.data).join("\n")
        .replace(/canvas\s*\n\s*\d+\s*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      setROutput(outputText);

      // Extract plot images — forest first (index 0), funnel second (index 1)
      if (result.images && result.images.length > 0) {
        let imgIdx = 0;
        if (forestCode && imgIdx < result.images.length) {
          const url = bitmapToDataURL(result.images[imgIdx]);
          if (url) setForestImg(url);
          imgIdx++;
        }
        if (funnelCode && imgIdx < result.images.length) {
          const url = bitmapToDataURL(result.images[imgIdx]);
          if (url) setFunnelImg(url);
          imgIdx++;
        }
      }

      shelter.purge();
      setStatus(STATUS.DONE);
    } catch (err) {
      console.error("R execution error:", err);
      setErrorMsg(err.message || "R code execution failed");
      setStatus(STATUS.ERROR);
    }
  };

  // ── Download plot ──
  const downloadPlot = (dataUrl, filename) => {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  // ── AI Interpretation (Layer 1) ──
  const handleAiInterpret = async () => {
    if (!rOutput || aiLoading) return;
    setAiLoading(true);
    setAiResult(null);

    const isZh = lang === "zh";
    const systemPrompt = isZh
      ? `你是統合分析方法學專家。根據以下 metafor 輸出結果，為臨床研究者提供結構化的解讀。
研究主題 — P: ${pico?.p || "?"} | I: ${pico?.i || "?"} | C: ${pico?.c || "?"} | O: ${pico?.o || "?"}
效果量類型：${effectType || "?"}　模型：${model === "random" ? "隨機效果" : "固定效果"}

請依序解讀：
1. 整體效果（方向、大小、顯著性）
2. 異質性（I²、Q 檢定、意義）
3. 個別研究貢獻（權重分布、是否有離群值）
4. 臨床意義（不僅是統計顯著性）

4-8 句繁體中文。不用 Markdown。`
      : `You are a meta-analysis methodology expert. Interpret these metafor results for a clinical researcher.
Study topic — P: ${pico?.p || "?"} | I: ${pico?.i || "?"} | C: ${pico?.c || "?"} | O: ${pico?.o || "?"}
Effect measure: ${effectType || "?"} | Model: ${model === "random" ? "Random-Effects" : "Fixed-Effect"}

Structure your response as:
1. Overall effect (direction, magnitude, significance)
2. Heterogeneity (I², Q-test, implications)
3. Individual study contributions (weights, outliers)
4. Clinical significance (not just statistical)

4-8 sentences. No Markdown.`;

    try {
      const resp = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, userMessage: rOutput }),
      });
      const data = await resp.json();
      const text = data.content?.map(i => i.text || "").join("") || (isZh ? "無法取得回饋" : "Could not get feedback");
      setAiResult(text);
    } catch {
      setAiResult(isZh ? "連線錯誤" : "Connection error");
    }
    setAiLoading(false);
  };

  // If parent provides onAiInterpret callback, use it to pass results up
  useEffect(() => {
    if (aiResult && onAiInterpret) onAiInterpret(aiResult);
  }, [aiResult, onAiInterpret]);

  // ══════════════════════════════════════════════
  // LAYER 2: Advanced Analysis
  // ══════════════════════════════════════════════

  // ── AI Recommend ──
  const handleAiRecommend = async () => {
    if (!rOutput || advRecommendLoading) return;
    setAdvRecommendLoading(true);
    setAdvRecommendations(null);

    const systemPrompt = getRecommendPrompt(lang, pico, effectType, model, moderatorColumns, studies.length);

    try {
      const resp = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, userMessage: rOutput }),
      });
      const data = await resp.json();
      const text = data.content?.map(i => i.text || "").join("") || "";

      // Parse JSON from AI response
      try {
        const cleaned = text.replace(/```json|```/g, "").trim();
        const recs = JSON.parse(cleaned);
        // Validate: each must have type in the allowed list
        const validTypes = ANALYSIS_TYPES.map(a => a.key);
        const validated = recs.filter(r => validTypes.includes(r.type)).slice(0, 3);
        setAdvRecommendations(validated);

        // Auto-select the first recommendation
        if (validated.length > 0) {
          setAdvSelectedType(validated[0].type);
          if (validated[0].moderator) setAdvSelectedMod(validated[0].moderator);
        }
      } catch {
        // If AI didn't return valid JSON, show as text
        setAdvRecommendations([]);
      }
    } catch {
      setAdvRecommendations([]);
    }
    setAdvRecommendLoading(false);
  };

  // ── Run Advanced Analysis (Layer 2) ──
  const handleAdvRun = async () => {
    if (!webRRef.current || !advSelectedType) return;

    const needsMod = ANALYSIS_TYPES.find(a => a.key === advSelectedType)?.needsMod;
    const mod = needsMod ? advSelectedMod : null;

    // Whitelist validation
    const validTypes = ANALYSIS_TYPES.map(a => a.key);
    if (!validTypes.includes(advSelectedType)) return;
    if (needsMod && (!mod || !moderatorColumns.includes(mod))) return;

    const code = buildAdvancedRCode(advSelectedType, mod, model, studies);
    if (!code) return;

    setAdvRunning(true);
    setAdvOutput(null);
    setAdvPlotImg(null);
    setAdvAiResult(null);
    setAdvError(null);
    setAdvRCode(code);
    setAdvShowCode(false);

    try {
      const webR = webRRef.current;
      const shelter = await new webR.Shelter();

      // Check if this analysis type produces plots
      const plotTypes = ["trimFill", "influence"];
      const hasPlot = plotTypes.includes(advSelectedType);

      const wrappedCode = hasPlot
        ? `webr::canvas(width = 700, height = 500, capture = TRUE)\npar(bg = "white")\n${code}\ndev.off()`
        : code;

      const result = await shelter.captureR(wrappedCode, {
        withAutoprint: true, captureStreams: true, captureConditions: false,
      });
      const outputText = result.output.map(o => o.data).join("\n")
        .replace(/canvas\s*\n\s*\d+\s*/g, "")
        .replace(/pdf\s*\n\s*\d+\s*/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      setAdvOutput(outputText);
      if (onAdvComplete) onAdvComplete({ type: advSelectedType, moderator: advSelectedMod });

      if (result.images && result.images.length > 0) {
        const url = bitmapToDataURL(result.images[result.images.length - 1]);
        if (url) setAdvPlotImg(url);
      }

      shelter.purge();
    } catch (err) {
      console.error("Advanced analysis error:", err);
      setAdvError(err.message || "Advanced analysis failed");
    }
    setAdvRunning(false);
  };

  // ── AI Interpret Advanced (Layer 2) ──
  const handleAdvAiInterpret = async () => {
    if (!advOutput || advAiLoading) return;
    setAdvAiLoading(true);
    setAdvAiResult(null);

    const needsMod = ANALYSIS_TYPES.find(a => a.key === advSelectedType)?.needsMod;
    const mod = needsMod ? advSelectedMod : null;
    const systemPrompt = getAdvancedInterpretPrompt(advSelectedType, mod, lang, pico, effectType, model);

    try {
      const resp = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ system: systemPrompt, userMessage: advOutput }),
      });
      const data = await resp.json();
      const text = data.content?.map(i => i.text || "").join("") || (lang === "zh" ? "無法取得回饋" : "Could not get feedback");
      setAdvAiResult(text);
    } catch {
      setAdvAiResult(lang === "zh" ? "連線錯誤" : "Connection error");
    }
    setAdvAiLoading(false);
  };

  // ── Save to history and reset for another analysis ──
  const handleRunAnother = () => {
    if (advOutput) {
      const entry = {
        type: advSelectedType,
        moderator: advSelectedMod,
        output: advOutput,
        aiResult: advAiResult,
        code: advRCode,
      };
      setAdvHistory(h => [...h, entry]);
    }
    setAdvOutput(null);
    setAdvPlotImg(null);
    setAdvAiResult(null);
    setAdvError(null);
    setAdvRCode(null);
    setAdvSelectedType(null);
    setAdvShowCode(false);
  };

  // ═══ RENDER ═══

  const isLoading = status === STATUS.LOADING_ENGINE || status === STATUS.LOADING_PACKAGES;

  return (
    <div style={{ fontFamily: FONT }} className="webr-runner">
      <style>{`
        .webr-runner pre::selection, .webr-runner pre *::selection,
        .webr-runner code::selection, .webr-runner code *::selection,
        .webr-runner .r-output-cell::selection, .webr-runner .r-output-cell *::selection {
          background: #44475A !important; color: #F8F8F2 !important;
        }
      `}</style>

      {/* ── Loading State ── */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 20 }}>
            {tx.initTitle}
          </div>

          {/* Progress steps */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", maxWidth: 360, margin: "0 auto 24px" }}>
            {[
              { key: "engine", label: tx.stepEngine, active: status === STATUS.LOADING_ENGINE, done: status === STATUS.LOADING_PACKAGES },
              { key: "pkg", label: tx.stepPackage, active: status === STATUS.LOADING_PACKAGES, done: false },
              { key: "ready", label: tx.stepReady, active: false, done: false },
            ].map((s, i) => (
              <div key={s.key} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: s.done ? GREEN : s.active ? CRIMSON : LIGHT_BORDER,
                    color: (s.done || s.active) ? "#FFF" : MUTED,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, transition: "all 0.3s",
                  }}>
                    {s.done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 11, color: s.active ? DARK : MUTED, fontWeight: s.active ? 600 : 400 }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: s.done ? GREEN : LIGHT_BORDER, margin: "0 8px", marginBottom: 20 }} />}
              </div>
            ))}
          </div>

          <div style={{ fontSize: 13, color: MUTED, marginBottom: 8 }}>
            {status === STATUS.LOADING_ENGINE ? tx.initEngine : tx.initPackage}
          </div>

          <div style={{ width: 200, height: 4, background: LIGHT_BORDER, borderRadius: 2, margin: "0 auto", overflow: "hidden" }}>
            <div style={{
              width: "40%", height: "100%", background: CRIMSON, borderRadius: 2,
              animation: "webr-load 1.5s ease-in-out infinite",
            }} />
          </div>
          <style>{`
            @keyframes webr-load {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(150%); }
              100% { transform: translateX(-100%); }
            }
            pre::selection, pre *::selection { background: #45475A; color: #CDD6F4; }
          `}</style>

          <div style={{ fontSize: 11, color: MUTED, marginTop: 16, opacity: 0.7 }}>
            {tx.desktopNote}
          </div>
        </div>
      )}

      {/* ── Error State ── */}
      {status === STATUS.ERROR && !rOutput && (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 8 }}>{tx.initFailed}</div>
          {errorMsg && (
            <div style={{ fontSize: 12, color: MUTED, marginBottom: 16, fontFamily: "monospace", background: "#F5F4F0", borderRadius: 8, padding: "8px 12px", maxWidth: 400, margin: "0 auto 16px", wordBreak: "break-all" }}>
              {errorMsg}
            </div>
          )}
          <div style={{ fontSize: 13, color: MUTED, marginBottom: 16 }}>{tx.errorHint}</div>
          <button onClick={() => { initAttemptedRef.current = false; webRRef.current = null; initWebR(); }}
            style={{ padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1.5px solid ${CRIMSON}`, background: CARD_BG, color: CRIMSON }}>
            {tx.initRetry}
          </button>
        </div>
      )}

      {/* ── Ready / Run Button ── */}
      {status === STATUS.READY && (
        <div style={{ textAlign: "center", padding: "24px 20px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: GREEN }}>{tx.initReady}</span>
          </div>
          <div>
            <button onClick={handleRun} disabled={!rCode}
              style={{ padding: "12px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: FONT, cursor: rCode ? "pointer" : "not-allowed", border: "none", background: rCode ? CRIMSON : "#DDD", color: "#FFF", transition: "all 0.2s", boxShadow: rCode ? "0 4px 16px rgba(192,57,43,0.25)" : "none" }}>
              {tx.runBtn}
            </button>
          </div>
        </div>
      )}

      {/* ── Running State ── */}
      {status === STATUS.RUNNING && (
        <div style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: CRIMSON, marginBottom: 8 }}>
            {tx.running} <span style={{ display: "inline-block", animation: "pulse 1.2s infinite" }}>⏳</span>
          </div>
          <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {/* LAYER 1 RESULTS                               */}
      {/* ══════════════════════════════════════════════ */}
      {status === STATUS.DONE && (
        <div>

          {/* Forest Plot */}
          {forestImg && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  📊 {tx.forestTitle}
                </h4>
                <button onClick={() => downloadPlot(forestImg, "forest_plot.png")}
                  style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1px solid ${LIGHT_BORDER}`, background: CARD_BG, color: MUTED }}>
                  📥 {tx.downloadForest}
                </button>
              </div>
              <div style={{ background: "#FFF", borderRadius: 12, border: `1px solid ${LIGHT_BORDER}`, padding: 12, overflow: "auto" }}>
                <img src={forestImg} alt="Forest Plot" style={{ maxWidth: "100%", height: "auto", display: "block" }} />
              </div>
              <button onClick={() => setShowForestGuide(!showForestGuide)}
                style={{ marginTop: 10, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1.5px solid ${showForestGuide ? BLUE : LIGHT_BORDER}`, background: showForestGuide ? `${BLUE}08` : CARD_BG, color: showForestGuide ? BLUE : MUTED, transition: "all 0.2s" }}>
                {showForestGuide ? tx.outputGuideHide : tx.forestGuideBtn}
              </button>
              {showForestGuide && (
                <div style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}15`, borderRadius: 10, padding: 16, marginTop: 10, fontSize: 13, color: DARK, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                  {tx.forestGuide}
                </div>
              )}
            </div>
          )}

          {/* Funnel Plot */}
          {funnelImg && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  📊 {tx.funnelTitle}
                </h4>
                <button onClick={() => downloadPlot(funnelImg, "funnel_plot.png")}
                  style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1px solid ${LIGHT_BORDER}`, background: CARD_BG, color: MUTED }}>
                  📥 {tx.downloadFunnel}
                </button>
              </div>
              <div style={{ background: "#FFF", borderRadius: 12, border: `1px solid ${LIGHT_BORDER}`, padding: 12, overflow: "auto" }}>
                <img src={funnelImg} alt="Funnel Plot" style={{ maxWidth: "100%", height: "auto", display: "block" }} />
              </div>
              <button onClick={() => setShowFunnelGuide(!showFunnelGuide)}
                style={{ marginTop: 10, padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1.5px solid ${showFunnelGuide ? BLUE : LIGHT_BORDER}`, background: showFunnelGuide ? `${BLUE}08` : CARD_BG, color: showFunnelGuide ? BLUE : MUTED, transition: "all 0.2s" }}>
                {showFunnelGuide ? tx.outputGuideHide : tx.funnelGuideBtn}
              </button>
              {showFunnelGuide && (
                <div style={{ background: `${BLUE}06`, border: `1px solid ${BLUE}15`, borderRadius: 10, padding: 16, marginTop: 10, fontSize: 13, color: DARK, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>
                  {tx.funnelGuide}
                </div>
              )}
            </div>
          )}

          {/* R Output */}
          {rOutput && (
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                📋 {tx.outputTitle}
              </h4>
              <pre style={{
                background: "#1E1E2E", color: "#CDD6F4", borderRadius: 12, padding: 20,
                fontSize: 12, lineHeight: 1.6, overflowX: "auto",
                fontFamily: "'Courier New', Courier, monospace", maxHeight: 360,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
              }}>
                {rOutput}
              </pre>

              {/* Reading Guide Toggle */}
              <button onClick={() => setShowOutputGuide(!showOutputGuide)}
                style={{
                  marginTop: 10, padding: "8px 16px", borderRadius: 8,
                  fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
                  border: `1.5px solid ${showOutputGuide ? BLUE : LIGHT_BORDER}`,
                  background: showOutputGuide ? `${BLUE}08` : CARD_BG,
                  color: showOutputGuide ? BLUE : MUTED,
                  transition: "all 0.2s",
                }}>
                {showOutputGuide ? tx.outputGuideHide : tx.outputGuideBtn}
              </button>

              {/* Side-by-Side Reading Guide */}
              {showOutputGuide && (
                <OutputReadingGuide rOutput={rOutput} lang={lang} effectType={effectType} model={model} />
              )}
            </div>
          )}

          {/* R Code (collapsible) */}
          {rCode && (
            <div style={{ marginBottom: 24 }}>
              <button onClick={() => setShowCode(!showCode)}
                style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1px solid ${LIGHT_BORDER}`, background: CARD_BG, color: MUTED, marginBottom: showCode ? 10 : 0 }}>
                💻 {showCode ? tx.hideCode : tx.showCode}
              </button>
              {showCode && (
                <pre style={{
                  background: "#1E1E2E", color: "#CDD6F4", borderRadius: 12, padding: 20,
                  fontSize: 13, lineHeight: 1.7, overflowX: "auto",
                  fontFamily: "'Courier New', Courier, monospace", maxHeight: 400, tabSize: 2,
                }}>
                  {rCode}
                </pre>
              )}
            </div>
          )}

          {/* AI Interpret Button (Layer 1) */}
          <div style={{ marginBottom: 16 }}>
            <button onClick={handleAiInterpret} disabled={aiLoading || !rOutput}
              style={{
                padding: "10px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, fontFamily: FONT,
                cursor: (aiLoading || !rOutput) ? "not-allowed" : "pointer",
                border: "none",
                background: (aiLoading || !rOutput) ? "#DDD" : BLUE,
                color: "#FFF", transition: "all 0.2s",
                opacity: (aiLoading || !rOutput) ? 0.5 : 1,
              }}>
              {aiLoading ? tx.aiInterpreting : tx.aiInterpret}
            </button>
          </div>

          {/* AI Result (Layer 1) */}
          {(aiResult || aiLoading) && (
            <div style={{
              background: aiResult ? `${BLUE}08` : `${CRIMSON}08`,
              border: `1px solid ${aiResult ? BLUE : CRIMSON}20`,
              borderRadius: 12, padding: 20, marginBottom: 16,
            }}>
              {aiLoading ? (
                <div style={{ textAlign: "center", fontSize: 13, color: CRIMSON }}>
                  {tx.aiInterpreting} <span style={{ display: "inline-block", animation: "pulse 1.2s infinite" }}>⏳</span>
                </div>
              ) : (
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                    🤖 {tx.interpretTitle}
                  </h4>
                  <div style={{ fontSize: 13, color: DARK, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                    {aiResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Execution error during run */}
          {errorMsg && (
            <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: DARK, marginTop: 12 }}>
              ⚠️ {tx.errorTitle}: <span style={{ fontFamily: "monospace", fontSize: 12 }}>{errorMsg}</span>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{tx.errorHint}</div>
            </div>
          )}

          {/* ══════════════════════════════════════════════ */}
          {/* LAYER 2: ADVANCED ANALYSIS                    */}
          {/* ══════════════════════════════════════════════ */}
          {rOutput && (
            <div style={{ marginTop: 32 }}>

              {/* Divider */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, background: LIGHT_BORDER }} />
                <button
                  onClick={() => setShowAdvPanel(!showAdvPanel)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 20px", borderRadius: 10,
                    fontSize: 14, fontWeight: 700, fontFamily: FONT,
                    cursor: "pointer",
                    border: `2px solid ${PURPLE}40`,
                    background: showAdvPanel ? `${PURPLE}10` : CARD_BG,
                    color: PURPLE,
                    transition: "all 0.2s",
                  }}>
                  🔬 {tx.advTitle}
                  <span style={{ fontSize: 11, transform: showAdvPanel ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                </button>
                <div style={{ flex: 1, height: 1, background: LIGHT_BORDER }} />
              </div>

              {showAdvPanel && (
                <div style={{
                  background: `${PURPLE}04`,
                  border: `1px solid ${PURPLE}15`,
                  borderRadius: 16, padding: 24,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, fontSize: 12, color: MUTED }}>
                    <span>
                      {!user
                        ? (lang === "zh" ? "登入即可跨裝置同步進度" : "Sign in to sync progress")
                        : advSelectedTypeMeta?.status === "saving"
                          ? (lang === "zh" ? "儲存中…" : "Saving…")
                          : advSelectedTypeMeta?.status === "saved"
                            ? (lang === "zh" ? "已自動儲存" : "Autosaved")
                            : advSelectedTypeMeta?.status === "error"
                              ? (lang === "zh" ? "儲存失敗" : "Save failed")
                              : ""}
                    </span>
                    <button
                      onClick={() => {
                        setAdvSelectedType(null);
                        setAdvSelectedMod(moderatorColumns[0] || "");
                        setAdvOutput(null);
                        setAdvRCode(null);
                        setAdvHistory([]);
                        setAdvAiResult(null);
                        setAdvPlotImg(null);
                        setAdvError(null);
                        if (user) resetWorkshop(user, WK);
                      }}
                      style={{ background: "none", border: "none", color: MUTED, fontSize: 12, cursor: "pointer", textDecoration: "underline" }}
                    >
                      {lang === "zh" ? "重設工作坊" : "Reset workshop"}
                    </button>
                  </div>
                  <p style={{ fontSize: 13, color: MUTED, marginBottom: 20, lineHeight: 1.7 }}>
                    {tx.advSubtitle}
                  </p>

                  {/* AI Recommend Button */}
                  {!advRecommendations && (
                    <div style={{ marginBottom: 20 }}>
                      <button onClick={handleAiRecommend} disabled={advRecommendLoading}
                        style={{
                          padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: FONT,
                          cursor: advRecommendLoading ? "not-allowed" : "pointer",
                          border: `1.5px solid ${PURPLE}`,
                          background: advRecommendLoading ? `${PURPLE}10` : CARD_BG,
                          color: PURPLE, transition: "all 0.2s",
                          opacity: advRecommendLoading ? 0.7 : 1,
                        }}>
                        {advRecommendLoading ? tx.advRecommending : tx.advRecommend}
                      </button>
                    </div>
                  )}

                  {/* AI Recommendations display */}
                  {advRecommendations && advRecommendations.length > 0 && (
                    <div style={{
                      background: `${PURPLE}08`, border: `1px solid ${PURPLE}20`,
                      borderRadius: 12, padding: 16, marginBottom: 20,
                    }}>
                      <h5 style={{ fontSize: 13, fontWeight: 700, color: PURPLE, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                        🤖 {tx.advRecommendTitle}
                      </h5>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {advRecommendations.map((rec, i) => {
                          const aType = ANALYSIS_TYPES.find(a => a.key === rec.type);
                          if (!aType) return null;
                          return (
                            <div key={i}
                              onClick={() => {
                                setAdvSelectedType(rec.type);
                                if (rec.moderator) setAdvSelectedMod(rec.moderator);
                              }}
                              style={{
                                display: "flex", alignItems: "flex-start", gap: 10,
                                padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                                background: advSelectedType === rec.type ? `${PURPLE}12` : CARD_BG,
                                border: `1.5px solid ${advSelectedType === rec.type ? PURPLE : LIGHT_BORDER}`,
                                transition: "all 0.15s",
                              }}>
                              <span style={{ fontSize: 18, flexShrink: 0 }}>{aType.icon}</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 600, color: advSelectedType === rec.type ? PURPLE : DARK }}>
                                  {tx[rec.type]}
                                  {rec.moderator && <span style={{ fontWeight: 400, color: MUTED }}> → {rec.moderator}</span>}
                                </div>
                                <div style={{ fontSize: 12, color: MUTED, marginTop: 2, lineHeight: 1.5 }}>{rec.reason}</div>
                              </div>
                              <div style={{
                                flexShrink: 0, fontSize: 10, fontWeight: 700,
                                padding: "2px 8px", borderRadius: 6,
                                background: `${PURPLE}15`, color: PURPLE,
                              }}>
                                {tx.advRecommendBadge}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Manual selection — only show if no current advanced output */}
                  {!advOutput && !advRunning && (
                    <div>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>
                        {tx.advSelectType}
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 8, marginBottom: 20 }}>
                        {ANALYSIS_TYPES.map(a => {
                          const disabled = a.needsMod && !hasModerators;
                          const selected = advSelectedType === a.key;
                          const isRecommended = advRecommendations?.some(r => r.type === a.key);
                          return (
                            <div key={a.key}
                              onClick={() => { if (!disabled) { setAdvSelectedType(a.key); if (a.needsMod && moderatorColumns[0]) setAdvSelectedMod(moderatorColumns[0]); } }}
                              style={{
                                padding: "12px 14px", borderRadius: 12, cursor: disabled ? "not-allowed" : "pointer",
                                border: `1.5px solid ${selected ? PURPLE : LIGHT_BORDER}`,
                                background: disabled ? "#F8F7F4" : selected ? `${PURPLE}08` : CARD_BG,
                                opacity: disabled ? 0.5 : 1,
                                transition: "all 0.15s",
                                position: "relative",
                              }}>
                              {isRecommended && !selected && (
                                <div style={{
                                  position: "absolute", top: -6, right: 8,
                                  fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4,
                                  background: PURPLE, color: "#FFF",
                                }}>★</div>
                              )}
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 16 }}>{a.icon}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: selected ? PURPLE : disabled ? MUTED : DARK }}>
                                  {tx[a.key]}
                                </span>
                              </div>
                              <div style={{ fontSize: 11, color: MUTED, marginTop: 4, lineHeight: 1.5 }}>
                                {disabled ? tx.advNoMod : tx[`${a.key}Desc`]}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Moderator dropdown (for subgroup / metareg) */}
                      {advSelectedType && ANALYSIS_TYPES.find(a => a.key === advSelectedType)?.needsMod && hasModerators && (
                        <div style={{ marginBottom: 20 }}>
                          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6 }}>
                            {tx.advSelectMod}
                          </label>
                          <select
                            value={advSelectedMod}
                            onChange={e => setAdvSelectedMod(e.target.value)}
                            style={{
                              padding: "10px 14px", borderRadius: 10, fontSize: 13, fontFamily: FONT,
                              border: `1.5px solid ${LIGHT_BORDER}`, background: CARD_BG, color: DARK,
                              cursor: "pointer", minWidth: 200,
                            }}>
                            {moderatorColumns.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                      )}

                      {/* Mini-lesson guide — shows BEFORE running, when analysis type is selected */}
                      {advSelectedType && ADVANCED_GUIDES[lang]?.[advSelectedType] && (
                        <details style={{
                          background: `${PURPLE}06`, border: `1px solid ${PURPLE}20`,
                          borderRadius: 12, marginBottom: 20, overflow: "hidden",
                        }} open>
                          <summary style={{
                            padding: "12px 18px", cursor: "pointer", fontSize: 13, fontWeight: 700, color: PURPLE,
                            display: "flex", alignItems: "center", gap: 8, listStyle: "none",
                          }}>
                            <span style={{ fontSize: 14 }}>💡</span>
                            {tx.advLearnFirst}
                            <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED, fontWeight: 400 }}>▼</span>
                          </summary>
                          <div style={{
                            padding: "0 18px 16px", fontSize: 13, color: DARK, lineHeight: 1.8,
                            whiteSpace: "pre-wrap",
                          }}>
                            {ADVANCED_GUIDES[lang]?.[advSelectedType] || ADVANCED_GUIDES.en?.[advSelectedType]}
                          </div>
                        </details>
                      )}

                      {/* Run button */}
                      <button onClick={handleAdvRun}
                        disabled={!advSelectedType || advRunning}
                        style={{
                          padding: "10px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, fontFamily: FONT,
                          cursor: (!advSelectedType || advRunning) ? "not-allowed" : "pointer",
                          border: "none",
                          background: (!advSelectedType || advRunning) ? "#DDD" : PURPLE,
                          color: "#FFF", transition: "all 0.2s",
                          boxShadow: advSelectedType ? `0 4px 16px ${PURPLE}30` : "none",
                        }}>
                        {advRunning ? tx.advRunning : tx.advRun}
                      </button>
                    </div>
                  )}

                  {/* Running state */}
                  {advRunning && (
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: PURPLE }}>
                        {tx.advRunning} <span style={{ display: "inline-block", animation: "pulse 1.2s infinite" }}>⏳</span>
                      </div>
                    </div>
                  )}

                  {/* ── Advanced Results ── */}
                  {advOutput && (
                    <div style={{ marginTop: 16 }}>

                      {/* Advanced Plot */}
                      {advPlotImg && (
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                              📊 {tx.advPlotTitle}
                            </h4>
                            <button onClick={() => downloadPlot(advPlotImg, `${advSelectedType}_plot.png`)}
                              style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1px solid ${LIGHT_BORDER}`, background: CARD_BG, color: MUTED }}>
                              📥 {tx.advDownloadPlot}
                            </button>
                          </div>
                          <div style={{ background: "#FFF", borderRadius: 12, border: `1px solid ${LIGHT_BORDER}`, padding: 12, overflow: "auto" }}>
                            <img src={advPlotImg} alt="Advanced Plot" style={{ maxWidth: "100%", height: "auto", display: "block" }} />
                          </div>
                        </div>
                      )}

                      {/* Advanced R Output */}
                      <div style={{ marginBottom: 20 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                          📋 {tx.advOutputTitle}
                        </h4>
                        <pre style={{
                          background: "#1E1E2E", color: "#CDD6F4", borderRadius: 12, padding: 20,
                          fontSize: 12, lineHeight: 1.6, overflowX: "auto",
                          fontFamily: "'Courier New', Courier, monospace", maxHeight: 360,
                          whiteSpace: "pre-wrap", wordBreak: "break-word",
                        }}>
                          {advOutput}
                        </pre>

                        {/* Advanced Reading Guide Toggle */}
                        <button onClick={() => setShowAdvGuide(!showAdvGuide)}
                          style={{
                            marginTop: 10, padding: "8px 16px", borderRadius: 8,
                            fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer",
                            border: `1.5px solid ${showAdvGuide ? PURPLE : LIGHT_BORDER}`,
                            background: showAdvGuide ? `${PURPLE}08` : CARD_BG,
                            color: showAdvGuide ? PURPLE : MUTED,
                            transition: "all 0.2s",
                          }}>
                          {showAdvGuide ? tx.outputGuideHide : tx.outputGuideBtn}
                        </button>

                        {showAdvGuide && (
                          <AdvancedReadingGuide advOutput={advOutput} analysisType={advSelectedType} lang={lang} effectType={effectType} />
                        )}
                      </div>

                      {/* Advanced R Code (collapsible) */}
                      {advRCode && (
                        <div style={{ marginBottom: 20 }}>
                          <button onClick={() => setAdvShowCode(!advShowCode)}
                            style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1px solid ${LIGHT_BORDER}`, background: CARD_BG, color: MUTED, marginBottom: advShowCode ? 10 : 0 }}>
                            💻 {advShowCode ? tx.advHideCode : tx.advShowCode}
                          </button>
                          {advShowCode && (
                            <pre style={{
                              background: "#1E1E2E", color: "#CDD6F4", borderRadius: 12, padding: 20,
                              fontSize: 13, lineHeight: 1.7, overflowX: "auto",
                              fontFamily: "'Courier New', Courier, monospace", maxHeight: 300, tabSize: 2,
                            }}>
                              {advRCode}
                            </pre>
                          )}
                        </div>
                      )}

                      {/* AI Interpret Advanced */}
                      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
                        <button onClick={handleAdvAiInterpret} disabled={advAiLoading || !advOutput}
                          style={{
                            padding: "10px 24px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: FONT,
                            cursor: (advAiLoading || !advOutput) ? "not-allowed" : "pointer",
                            border: "none",
                            background: (advAiLoading || !advOutput) ? "#DDD" : BLUE,
                            color: "#FFF", transition: "all 0.2s",
                            opacity: (advAiLoading || !advOutput) ? 0.5 : 1,
                          }}>
                          {advAiLoading ? tx.aiInterpreting : tx.advInterpret}
                        </button>
                        <button onClick={handleRunAnother}
                          style={{
                            padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, fontFamily: FONT,
                            cursor: "pointer",
                            border: `1.5px solid ${PURPLE}40`,
                            background: CARD_BG, color: PURPLE, transition: "all 0.2s",
                          }}>
                          {tx.advRunAnother}
                        </button>
                      </div>

                      {/* Advanced AI Result */}
                      {(advAiResult || advAiLoading) && (
                        <div style={{
                          background: advAiResult ? `${BLUE}08` : `${CRIMSON}08`,
                          border: `1px solid ${advAiResult ? BLUE : CRIMSON}20`,
                          borderRadius: 12, padding: 20, marginBottom: 16,
                        }}>
                          {advAiLoading ? (
                            <div style={{ textAlign: "center", fontSize: 13, color: CRIMSON }}>
                              {tx.aiInterpreting} <span style={{ display: "inline-block", animation: "pulse 1.2s infinite" }}>⏳</span>
                            </div>
                          ) : (
                            <div>
                              <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                                🤖 {tx.advInterpretTitle}
                              </h4>
                              <div style={{ fontSize: 13, color: DARK, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                                {advAiResult}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Advanced error */}
                      {advError && (
                        <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: DARK, marginTop: 8 }}>
                          ⚠️ {tx.errorTitle}: <span style={{ fontFamily: "monospace", fontSize: 12 }}>{advError}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── History of completed analyses ── */}
                  {advHistory.length > 0 && (
                    <div style={{ marginTop: 24, borderTop: `1px solid ${PURPLE}15`, paddingTop: 20 }}>
                      <h5 style={{ fontSize: 13, fontWeight: 700, color: DARK, marginBottom: 12 }}>
                        📝 {tx.advHistory} ({advHistory.length})
                      </h5>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {advHistory.map((h, i) => {
                          const aType = ANALYSIS_TYPES.find(a => a.key === h.type);
                          return (
                            <details key={i} style={{
                              background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`,
                              borderRadius: 10, overflow: "hidden",
                            }}>
                              <summary style={{
                                padding: "10px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600, color: DARK,
                                display: "flex", alignItems: "center", gap: 8,
                              }}>
                                <span>{aType?.icon}</span>
                                <span>{tx[h.type]}</span>
                                {h.moderator && <span style={{ fontWeight: 400, color: MUTED }}>→ {h.moderator}</span>}
                                {h.aiResult && <span style={{ marginLeft: "auto", fontSize: 10, color: BLUE, fontWeight: 600 }}>✓ AI</span>}
                              </summary>
                              <div style={{ padding: "0 14px 14px" }}>
                                <pre style={{
                                  background: "#1E1E2E", color: "#CDD6F4", borderRadius: 8, padding: 12,
                                  fontSize: 11, lineHeight: 1.5, overflowX: "auto", maxHeight: 200,
                                  fontFamily: "'Courier New', Courier, monospace",
                                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                                }}>
                                  {h.output}
                                </pre>
                                {h.aiResult && (
                                  <div style={{
                                    background: `${BLUE}08`, border: `1px solid ${BLUE}15`,
                                    borderRadius: 8, padding: 12, marginTop: 8,
                                    fontSize: 12, color: DARK, lineHeight: 1.7,
                                  }}>
                                    {h.aiResult}
                                  </div>
                                )}
                              </div>
                            </details>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
