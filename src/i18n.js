import { createContext, useContext, useState, useCallback } from "react";

const translations = {
  zh: {
    // Nav
    navTitle: "Meta分析",
    navTitleSuffix: "101",
    navWhat: "概念",
    navWhy: "意義",
    navDemo: "演示",
    navHow: "方法",
    navPlots: "圖表",
    navQuiz: "測驗",
    langSwitch: "EN",

    // Hero
    heroBadge: "初學者指南",
    heroTitle1: "到底什麼是",
    heroTitle2: "Meta分析",
    heroTitle3: "？",
    heroDesc: "想像一下，閱讀某個主題的每一項研究，然後用數學方法將它們組合起來找到真正的答案。這就是Meta分析——比你想像的要簡單得多。",
    heroBtn: "開始學習 →",

    // What section
    whatLabel: "基礎知識",
    whatTitle: "Meta分析是什麼？",
    whatIntro: "想像一下：你想知道一種新藥是否有效。你找到了20項研究——有的說有效，有的說無效，有的說可能有效。與其只挑選你最喜歡的那一項，Meta分析會將全部20項結果進行數學組合，得出一個更可靠的答案。就像向20位專家提問，然後計算群體共識，給予最有把握的專家更大的權重。",
    whatCard1Title: "這是數學，不是觀點",
    whatCard1Text: "與作者用自己的話進行總結的傳統文獻綜述不同，Meta分析使用統計公式來計算精確的合併結果。",
    whatCard2Title: "並非所有研究都平等",
    whatCard2Text: "更大、更精確的研究擁有更多影響力。一項納入1000名患者的研究比僅有20名患者的研究更有份量——就像你更信任樣本量更大的民意調查一樣。",
    whatCard3Title: "更大過程的一部分",
    whatCard3Text: "Meta分析存在於「系統綜述」之中——這是一個用於查找、評估和合併某個問題所有相關研究的結構化過程。",
    whatAnalogyTitle: "餐廳評價類比",
    whatAnalogyText: "你會只根據一條評價來選餐廳嗎？大概不會——你會閱讀很多評價，形成一個整體印象。但你會更看重去過5次的人的評價，而不是只路過的人。Meta分析對科學研究所做的正是如此：閱讀所有研究，按質量和規模加權，然後給你最終結論。",

    // Why section
    whyLabel: "研究意義",
    whyTitle: "為什麼要做Meta分析？",
    whyIntro: "單個研究就像拼圖碎片——本身很有價值，但你需要把它們放在一起才能理解全貌。",
    whyCard1Title: "更強的統計效力",
    whyCard1Text: "小型研究往往無法檢測到真實效果。透過匯集數據，Meta分析實現了相當於更大研究的統計效力——有時達數萬名參與者。",
    whyCard2Title: "解決分歧",
    whyCard2Text: "當研究A說「是」而研究B說「否」時，Meta分析提供了公平的、數學化的仲裁，而不是選擇性引用。",
    whyCard3Title: "發現隱藏模式",
    whyCard3Text: "透過亞組分析，你可以發現一種治療對老年患者有效但對年輕患者無效——這是單個研究可能無法揭示的。",
    whyCard4Title: "影響真實決策",
    whyCard4Text: "Meta分析位於證據金字塔的頂端。政府、醫院和指南委員會依靠它們來制定治療和政策決策。",
    whyCard5Title: "揭露缺失證據",
    whyCard5Text: "漏斗圖等工具可以揭示陰性結果的研究是否未被發表——這種現象稱為發表偏倚。",
    whyCard6Title: "指引未來研究",
    whyCard6Text: "透過揭示我們已知和未知的內容，Meta分析突出研究空白，指導最需要新研究的方向。",

    // Combiner
    combinerLabel: "實際演示",
    combinerTitle: "觀看研究如何合併",
    combinerDesc: "這個互動演示展示了Meta分析的工作原理。五項研究各有不同結果——點擊「合併」查看按樣本量加權如何產生一個更可信的答案。",
    combinerScattered: "五項研究，五個不同答案",
    combinerCombining: "正在合併證據……",
    combinerCombined: "合併後的估計值",
    combinerScatteredDesc: "每個圓點是一項研究。它們結果不一——你信任哪一個？",
    combinerCombiningDesc: "按樣本量加權以找出真實訊號……",
    combinerCombinedDesc: (pooled) => `合併效應值：${pooled}——較大的研究將估計值拉向小的正效應`,
    combinerNegative: "← 負效應",
    combinerPositive: "正效應 →",
    combinerNoEffect: "無效應",
    combinerCombineBtn: "合併研究 →",
    combinerResetBtn: "↺ 重置",

    // Study descriptions
    studyADesc: "小型隨機對照試驗——發現中等正效應",
    studyBDesc: "大型試驗——發現幾乎無效應",
    studyCDesc: "小型研究——發現強效應",
    studyDDesc: "最大型試驗——發現小的正效應",
    studyEDesc: "中型研究——發現中等效應",

    // How section
    howLabel: "分步指南",
    howTitle: "如何進行Meta分析",
    howDesc: "這是一個結構化的8步流程。點擊每個步驟展開詳情，查看生動的類比幫助理解。",
    howNote: "基於PRISMA 2020指南和已建立的方法學框架",
    howThinkOfIt: "💡 可以這樣理解：",

    step1Title: "確定研究問題",
    step1Analogy: "就像在去買菜之前先確定你要做什麼菜。",
    step1Detail1: "使用PICO等結構化框架：人群(Population)、干預(Intervention)、對照(Comparison)、結局(Outcome)。",
    step1Detail2: "你的問題決定了一切——納入哪些研究、提取哪些數據，以及如何分析。",
    step1Detail3: "確保你的主題上有足夠的研究來支持定量合成。",
    step1Detail4: "在開始之前，撰寫詳細的計畫書並進行註冊（如在PROSPERO上註冊）。",

    step2Title: "系統檢索文獻",
    step2Analogy: "就像在多個海域撒下大網，確保不漏掉任何一條魚。",
    step2Detail1: "檢索多個資料庫：PubMed、Embase、Cochrane圖書館以及其他與你領域相關的資料庫。",
    step2Detail2: "使用精心構建的關鍵詞組合和布林運算符（AND、OR、NOT）。",
    step2Detail3: "不要忘記「灰色文獻」——學位論文、會議摘要、預印本——以減少偏倚。",
    step2Detail4: "仔細記錄每次檢索。你需要在PRISMA流程圖中報告這些。",

    step3Title: "篩選和選擇研究",
    step3Analogy: "就像從捕獲的魚中挑選出符合你需要的那些。",
    step3Detail1: "將預定義的納入排除標準應用於找到的每項研究。",
    step3Detail2: "至少兩名審稿人應獨立篩選標題、摘要，然後是全文。",
    step3Detail3: "使用參考文獻管理工具（EndNote、Mendeley）和篩選軟體（Rayyan、Covidence）。",
    step3Detail4: "準確記錄每項被排除研究的原因——透明度至關重要。",

    step4Title: "評估品質和偏倚風險",
    step4Analogy: "就像在烹飪前檢查每種食材的新鮮度和品質。",
    step4Detail1: "使用經過驗證的工具：Cochrane偏倚風險工具用於RCT，Newcastle-Ottawa量表用於觀察性研究。",
    step4Detail2: "評估隨機化、盲法、數據不完整和選擇性報告等方面。",
    step4Detail3: "低品質研究可能扭曲整體結果——你可能需要進行排除它們的敏感性分析。",
    step4Detail4: "兩名獨立審稿人應評估品質，並有解決分歧的程序。",

    step5Title: "提取數據和計算效應量",
    step5Analogy: "就像在加入鍋中之前精確測量每種配料。",
    step5Detail1: "使用標準化表格記錄樣本量、均值、標準差和事件數。",
    step5Detail2: "選擇效應量指標：二分類結局用比值比(OR)，連續性指標用均數差(MD)。",
    step5Detail3: "每項研究被編碼為一個數字（效應量）加上一個精確度度量。",
    step5Detail4: "仔細核實提取的數據——即使已發表的Meta分析也被發現存在錯誤。",

    step6Title: "合併結果和分析",
    step6Analogy: "就像將所有精確測量的配料混合在一起，看看做出了什麼菜。",
    step6Detail1: "選擇模型：固定效應（假設存在一個真實效應）vs 隨機效應（假設效應在研究間變化）。",
    step6Detail2: "每項研究按精確度加權——更大、更精確的研究有更多影響力。",
    step6Detail3: "用I²評估異質性：低於25%為低，25-50%為中等，高於50%為高。",
    step6Detail4: "如果異質性高，透過亞組分析或Meta迴歸探索原因。",

    step7Title: "檢查發表偏倚",
    step7Analogy: "就像確保你的食譜書沒有缺頁——尤其是那些失敗食譜的頁面。",
    step7Detail1: "製作漏斗圖：研究效應值 vs 精確度。對稱性表明無偏倚。",
    step7Detail2: "使用Egger檢驗或Begg檢驗來統計量化潛在偏倚。",
    step7Detail3: "剪補法可以估計可能「缺失」了多少研究並調整結果。",
    step7Detail4: "請記住：漏斗圖不對稱也可能反映真正的異質性，而不僅僅是偏倚。",

    step8Title: "報告研究結果",
    step8Analogy: "就像寫下食譜，讓任何人都能精確地重現你的菜餚。",
    step8Detail1: "遵循PRISMA 2020指南——一份涵蓋綜述各個方面的27項清單。",
    step8Detail2: "包含PRISMA流程圖，顯示找到、篩選和納入了多少研究。",
    step8Detail3: "在森林圖中展示所有關鍵統計數據：效應量、信賴區間、I²、P值。",
    step8Detail4: "公開討論局限性：納入研究的品質、潛在偏倚和可推廣性。",

    // Forest plot
    forestLabel: "關鍵視覺化",
    forestTitle: "如何閱讀森林圖",
    forestDesc: "森林圖是Meta分析的標誌性視覺化工具。每個元素都有其含義——點擊下方不同部分了解它們代表什麼。",
    forestNote: "在這個例子中，研究正在測試一種治療是否能減少不良結局。左側的值表示治療有效。",
    forestClickHint: "👆 點擊下方的方塊、線段、中心線或菱形",
    forestFavorsTreatment: "← 有利於治療",
    forestFavorsControl: "有利於對照 →",
    forestOverall: "總體",
    forestSquareTitle: "研究效應值（方塊）",
    forestSquareText: "每個方塊代表一項研究的結果。其大小反映該研究的權重——更大的方塊意味著樣本量更大、更精確的研究，對最終結果貢獻更大。",
    forestLineTitle: "信賴區間（線段）",
    forestLineText: "水平線段顯示合理值的範圍。線段越短=精確度越高。如果它穿過中心線，則該結果本身在統計學上不顯著。",
    forestCenterTitle: "無效線",
    forestCenterText: "這條豎線代表零效應——兩組之間沒有差異。左側的研究有利於治療組；右側的研究有利於對照組。",
    forestDiamondTitle: "合併估計值（菱形）",
    forestDiamondText: "菱形是所有研究的合併結果。其寬度顯示信賴區間。如果整個菱形位於中心線的一側，則總體效應在統計學上是顯著的。",

    // Glossary
    glossaryEffectSize: "效應量",
    glossaryEffectSizeDef: "衡量兩組之間差異大小的數字。常見類型：比值比、風險比和標準化均數差。",
    glossaryCI: "信賴區間",
    glossaryCIDef: "真實效應可能落入的範圍。95%CI意味著我們有95%的把握認為真實答案在這個範圍內。",
    glossaryI2: "I²（異質性）",
    glossaryI2Def: "研究間變異中有多少百分比是真實的（而非隨機雜訊）。低於25%=低，高於75%=非常高。",
    glossaryFunnel: "漏斗圖",
    glossaryFunnelDef: "用於檢查發表偏倚的散佈圖。研究應對稱分佈——如果不對稱，可能有缺失的結果。",
    glossaryFixedRandom: "固定效應 vs 隨機效應",
    glossaryFixedRandomDef: "固定效應假設存在一個真實效應。隨機效應假設效應在研究間變化。隨機效應更常用，也更保守。",
    glossaryPRISMA: "PRISMA",
    glossaryPRISMADef: "確保你的Meta分析透明、可重複和完整的27項報告清單。於2020年更新。",

    // Quiz
    quizLabel: "自測",
    quizTitle: "快速知識檢驗",
    quizDesc: "五個問題，看看你學到了多少。別擔心——你隨時可以回到上面重新學習！",
    quizQuestion: "問題",
    quizOf: "/",
    quizCorrectMark: "✓ 正確！",
    quizWrongMark: "✗ 不太對。",
    quizNextBtn: "下一題 →",
    quizResultsBtn: "查看結果 →",
    quizPerfect: "滿分！",
    quizWellDone: "做得好！",
    quizKeepLearning: "繼續學習！",
    quizCorrectCount: (score, total, pct) => `${score} / ${total} 正確 (${pct}%)`,
    quizPerfectMsg: "你已經掌握了Meta分析的基礎知識！",
    quizRetryMsg: "向上捲動複習相關內容，然後再試一次。",
    quizTryAgain: "再試一次",

    quizQ1: "Meta分析的主要目的是什麼？",
    quizQ1A: "進行一項新實驗",
    quizQ1B: "統計合併多項研究的結果",
    quizQ1C: "替代系統綜述",
    quizQ1D: "採訪研究人員了解他們的發現",
    quizQ1Exp: "Meta分析使用統計技術將多項獨立研究的結果合併為一個更精確的估計值。",

    quizQ2: "在森林圖中，更大的方塊表示什麼？",
    quizQ2A: "更近期的研究",
    quizQ2B: "效應量更大的研究",
    quizQ2C: "權重更大（精確度更高）的研究",
    quizQ2D: "來自更知名期刊的研究",
    quizQ2Exp: "每個方塊的大小與研究的權重成正比。更大、更精確的研究獲得更大的方塊，因為它們對合併結果貢獻更大。",

    quizQ3: "I²在Meta分析中衡量什麼？",
    quizQ3A: "納入研究的總數",
    quizQ3B: "異質性導致的變異百分比",
    quizQ3C: "每項研究的品質評分",
    quizQ3D: "最早研究的發表日期",
    quizQ3Exp: "I²量化研究間變異中有多少百分比是由真實差異（異質性）而非隨機機會造成的。超過50%的值表明存在實質性異質性。",

    quizQ4: "對稱的漏斗圖表明：",
    quizQ4A: "存在高發表偏倚",
    quizQ4B: "所有研究發現了相同的結果",
    quizQ4C: "發表偏倚風險低",
    quizQ4D: "Meta分析存在錯誤",
    quizQ4Exp: "當研究圍繞合併效應值對稱分佈時，形成倒漏斗形——表明不太可能因發表偏倚而「缺失」研究。",

    quizQ5: "PRISMA代表什麼？",
    quizQ5A: "科學與醫學分析的主要報告項目",
    quizQ5B: "系統綜述和Meta分析的首選報告項目",
    quizQ5C: "統計Meta分析的研究方案",
    quizQ5D: "綜合醫學文章中的已發表結果",
    quizQ5Exp: "PRISMA提供了一份標準化的27項清單和流程圖，幫助研究者透明地報告其系統綜述的方法學。",

    // Footer
    footerText: "內容綜合自領先的方法學指南，包括PRISMA 2020、Cochrane手冊和經過同儕審查的Meta分析教程。本站為面向初學者的教育資源。",
    footerBrand: "Meta分析 101",
  },

  en: {
    // Nav
    navTitle: "Meta-Analysis",
    navTitleSuffix: "101",
    navWhat: "What",
    navWhy: "Why",
    navDemo: "Demo",
    navHow: "How",
    navPlots: "Plots",
    navQuiz: "Quiz",
    langSwitch: "中文",

    // Hero
    heroBadge: "A Beginner's Guide",
    heroTitle1: "What on earth is a ",
    heroTitle2: "Meta-Analysis",
    heroTitle3: "?",
    heroDesc: "Imagine reading every study on a topic, then mathematically combining them to find the real answer. That's meta-analysis — and it's simpler than you think.",
    heroBtn: "Start Learning →",

    // What section
    whatLabel: "The Basics",
    whatTitle: "So, What Is a Meta-Analysis?",
    whatIntro: "Picture this: you want to know if a new medication works. You find 20 studies — some say yes, some say no, some say maybe. Instead of just picking the one you like best, a meta-analysis mathematically combines all 20 results into a single, more reliable answer. It's like asking 20 experts and calculating the group consensus, giving more weight to the experts who are most confident.",
    whatCard1Title: "It's Math, Not Opinion",
    whatCard1Text: "Unlike a regular literature review where an author summarizes in their own words, meta-analysis uses statistical formulas to calculate a precise combined result.",
    whatCard2Title: "Not All Studies Are Equal",
    whatCard2Text: "Larger, more precise studies get more influence. A study with 1,000 patients counts more than one with 20 — just as you'd trust a larger poll more.",
    whatCard3Title: "Part of a Bigger Process",
    whatCard3Text: "Meta-analysis lives inside a 'systematic review' — a structured process for finding, evaluating, and combining all relevant studies on a question.",
    whatAnalogyTitle: "The Restaurant Review Analogy",
    whatAnalogyText: "Would you pick a restaurant based on one review? Probably not — you'd read many reviews and form an overall impression. But you'd weigh a review from someone who's visited 5 times over someone who just walked past. That's exactly what meta-analysis does with scientific studies: reads them all, weighs them by quality and size, and gives you the verdict.",

    // Why section
    whyLabel: "The Purpose",
    whyTitle: "Why Bother Doing One?",
    whyIntro: "Single studies are like puzzle pieces — valuable on their own, but you need to see them together to understand the full picture.",
    whyCard1Title: "More Statistical Power",
    whyCard1Text: "Small studies often can't detect real effects. By pooling data, meta-analysis achieves the power of a much larger study — sometimes tens of thousands of participants.",
    whyCard2Title: "Settle Disagreements",
    whyCard2Text: "When Study A says 'yes' and Study B says 'no,' meta-analysis provides a fair, mathematical arbitration instead of cherry-picking.",
    whyCard3Title: "Find Hidden Patterns",
    whyCard3Text: "Through subgroup analysis, you can discover a treatment works for older patients but not younger ones — something no single study might reveal.",
    whyCard4Title: "Shape Real Decisions",
    whyCard4Text: "Meta-analyses sit at the top of the evidence pyramid. Governments, hospitals, and guideline panels rely on them for treatment and policy decisions.",
    whyCard5Title: "Expose Missing Evidence",
    whyCard5Text: "Tools like funnel plots can reveal if studies with negative results weren't published — a phenomenon called publication bias.",
    whyCard6Title: "Map Future Research",
    whyCard6Text: "By revealing what we know and don't know, meta-analyses highlight gaps and guide where new studies are most needed.",

    // Combiner
    combinerLabel: "See It In Action",
    combinerTitle: "Watch Studies Combine",
    combinerDesc: 'This interactive demo shows how meta-analysis works. Five studies each found different results — click "Combine" to see how weighting by sample size produces a single, more trustworthy answer.',
    combinerScattered: "Five Studies, Five Different Answers",
    combinerCombining: "Combining the evidence...",
    combinerCombined: "One Pooled Estimate",
    combinerScatteredDesc: "Each dot is a study. They disagree — which one do you trust?",
    combinerCombiningDesc: "Weighting by sample size to find the true signal...",
    combinerCombinedDesc: (pooled) => `Pooled effect: ${pooled} — larger studies pulled the estimate toward a small positive effect`,
    combinerNegative: "← Negative effect",
    combinerPositive: "Positive effect →",
    combinerNoEffect: "No Effect",
    combinerCombineBtn: "Combine Studies →",
    combinerResetBtn: "↺ Reset",

    // Study descriptions
    studyADesc: "Small RCT — found a moderate positive effect",
    studyBDesc: "Large trial — found almost no effect",
    studyCDesc: "Small study — found a strong effect",
    studyDDesc: "Largest trial — found a small positive effect",
    studyEDesc: "Medium study — found a moderate effect",

    // How section
    howLabel: "Step by Step",
    howTitle: "How To Conduct a Meta-Analysis",
    howDesc: "It's a structured 8-step process. Click each step to expand the details and see a real-world analogy that makes it click.",
    howNote: "Based on PRISMA 2020 guidelines and established methodological frameworks",
    howThinkOfIt: "💡 Think of it like: ",

    step1Title: "Define Your Research Question",
    step1Analogy: "Deciding exactly what recipe you want to cook before going grocery shopping.",
    step1Detail1: "Use a structured framework like PICO: Population, Intervention, Comparison, Outcome.",
    step1Detail2: "Your question determines everything — which studies to include, what data to extract, and how to analyze it.",
    step1Detail3: "Make sure enough studies exist on your topic to justify a quantitative synthesis.",
    step1Detail4: "Write a detailed protocol and register it (e.g., on PROSPERO) before you begin.",

    step2Title: "Search the Literature Systematically",
    step2Analogy: "Casting a wide fishing net across multiple oceans to make sure you don't miss any fish.",
    step2Detail1: "Search multiple databases: PubMed, Embase, Cochrane Library, and others relevant to your field.",
    step2Detail2: "Use carefully constructed keyword combinations with Boolean operators (AND, OR, NOT).",
    step2Detail3: "Don't forget the 'gray literature' — dissertations, conference abstracts, preprints — to reduce bias.",
    step2Detail4: "Keep meticulous records of every search. You'll need to report this in a PRISMA flow diagram.",

    step3Title: "Screen & Select Studies",
    step3Analogy: "Sorting through your catch to keep only the fish that match what you're looking for.",
    step3Detail1: "Apply your pre-defined eligibility criteria to every study found.",
    step3Detail2: "At least two reviewers should independently screen titles, abstracts, then full texts.",
    step3Detail3: "Use reference management tools (EndNote, Mendeley) and screening software (Rayyan, Covidence).",
    step3Detail4: "Document exactly why each excluded study was removed — transparency is key.",

    step4Title: "Assess Quality & Risk of Bias",
    step4Analogy: "Checking the freshness and quality of each ingredient before cooking.",
    step4Detail1: "Use validated tools: Cochrane Risk of Bias for RCTs, Newcastle-Ottawa Scale for observational studies.",
    step4Detail2: "Evaluate randomization, blinding, incomplete data, and selective reporting.",
    step4Detail3: "Low-quality studies can distort your overall result — you may need sensitivity analyses excluding them.",
    step4Detail4: "Two independent reviewers should assess quality, with a process to resolve disagreements.",

    step5Title: "Extract Data & Calculate Effect Sizes",
    step5Analogy: "Measuring each ingredient precisely before adding it to the pot.",
    step5Detail1: "Use standardized forms to capture sample sizes, means, standard deviations, and event counts.",
    step5Detail2: "Choose your effect size metric: Odds Ratio for yes/no outcomes, Mean Difference for continuous measures.",
    step5Detail3: "Each study gets encoded as a single number (effect size) plus a measure of precision.",
    step5Detail4: "Double-check extractions — even published meta-analyses have been found to contain errors.",

    step6Title: "Pool Results & Analyze",
    step6Analogy: "Combining all your carefully measured ingredients and seeing what dish emerges.",
    step6Detail1: "Choose: Fixed-effect (assumes one true effect) vs. Random-effects (assumes effects vary between studies).",
    step6Detail2: "Each study is weighted by precision — larger, more precise studies have more influence.",
    step6Detail3: "Assess heterogeneity with I²: below 25% is low, 25–50% moderate, above 50% high.",
    step6Detail4: "If heterogeneity is high, explore why with subgroup analyses or meta-regression.",

    step7Title: "Check for Publication Bias",
    step7Analogy: "Making sure your recipe book isn't missing pages — especially the ones with failed recipes.",
    step7Detail1: "Create a funnel plot: study effects vs. precision. Symmetry suggests no bias.",
    step7Detail2: "Use Egger's test or Begg's test to statistically quantify potential bias.",
    step7Detail3: "The trim-and-fill method can estimate how many studies might be 'missing' and adjust the result.",
    step7Detail4: "Remember: funnel plot asymmetry can also reflect genuine heterogeneity, not just bias.",

    step8Title: "Report Your Findings",
    step8Analogy: "Writing up the recipe so anyone else could recreate your dish exactly.",
    step8Detail1: "Follow the PRISMA 2020 guidelines — a 27-item checklist covering every aspect of your review.",
    step8Detail2: "Include a PRISMA flow diagram showing how many studies were found, screened, and included.",
    step8Detail3: "Present results in forest plots with all key statistics: effect sizes, confidence intervals, I², p-values.",
    step8Detail4: "Discuss limitations openly: quality of included studies, potential biases, and generalizability.",

    // Forest plot
    forestLabel: "Key Visualizations",
    forestTitle: "Reading a Forest Plot",
    forestDesc: "The forest plot is the signature visualization of meta-analysis. Every element has a meaning — click on different parts below to learn what they represent.",
    forestNote: "In this example, studies are testing whether a treatment reduces a negative outcome. Values to the left mean the treatment helps.",
    forestClickHint: "👆 Click on a square, line, the center line, or the diamond below",
    forestFavorsTreatment: "← Favors Treatment",
    forestFavorsControl: "Favors Control →",
    forestOverall: "Overall",
    forestSquareTitle: "Study Effect (Square)",
    forestSquareText: "Each square shows one study's result. Its size reflects the study's weight — bigger squares mean larger, more precise studies that contribute more to the final answer.",
    forestLineTitle: "Confidence Interval (Line)",
    forestLineText: "The horizontal line shows the range of plausible values. Shorter lines = more precision. If it crosses the center line, the result isn't statistically significant on its own.",
    forestCenterTitle: "Line of No Effect",
    forestCenterText: "This vertical line represents zero effect — no difference between groups. Studies to the left favor treatment; studies to the right favor control.",
    forestDiamondTitle: "Pooled Estimate (Diamond)",
    forestDiamondText: "The diamond is the combined result of ALL studies. Its width shows the confidence interval. If the entire diamond sits on one side of the center line, the overall effect is statistically significant.",

    // Glossary
    glossaryEffectSize: "Effect Size",
    glossaryEffectSizeDef: "A number measuring how big the difference is between two groups. Common types: odds ratios, risk ratios, and standardized mean differences.",
    glossaryCI: "Confidence Interval",
    glossaryCIDef: "The range where the true effect likely falls. A 95% CI means we're 95% confident the real answer is somewhere in that range.",
    glossaryI2: "I² (Heterogeneity)",
    glossaryI2Def: "What percentage of variation between studies is real (not random noise). Under 25% = low, over 75% = very high.",
    glossaryFunnel: "Funnel Plot",
    glossaryFunnelDef: "A scatter plot checking for publication bias. Studies should scatter symmetrically — if not, some results may be missing.",
    glossaryFixedRandom: "Fixed vs. Random Effects",
    glossaryFixedRandomDef: "Fixed assumes one true effect exists. Random assumes effects vary between studies. Random is more common and conservative.",
    glossaryPRISMA: "PRISMA",
    glossaryPRISMADef: "The 27-item reporting checklist ensuring your meta-analysis is transparent, reproducible, and complete. Updated in 2020.",

    // Quiz
    quizLabel: "Test Yourself",
    quizTitle: "Quick Knowledge Check",
    quizDesc: "Five questions to see how much you've picked up. Don't worry — you can always scroll back up and try again!",
    quizQuestion: "Question",
    quizOf: "of",
    quizCorrectMark: "✓ Correct! ",
    quizWrongMark: "✗ Not quite. ",
    quizNextBtn: "Next Question →",
    quizResultsBtn: "See Results →",
    quizPerfect: "Perfect Score!",
    quizWellDone: "Well Done!",
    quizKeepLearning: "Keep Learning!",
    quizCorrectCount: (score, total, pct) => `${score} / ${total} correct (${pct}%)`,
    quizPerfectMsg: "You've mastered the basics of meta-analysis!",
    quizRetryMsg: "Scroll back up to review the sections, then try again.",
    quizTryAgain: "Try Again",

    quizQ1: "What is the main purpose of a meta-analysis?",
    quizQ1A: "To conduct a new experiment",
    quizQ1B: "To statistically combine results from multiple studies",
    quizQ1C: "To replace systematic reviews",
    quizQ1D: "To interview researchers about their findings",
    quizQ1Exp: "Meta-analysis uses statistical techniques to combine findings from multiple independent studies into a single, more precise estimate.",

    quizQ2: "In a forest plot, what does a larger square indicate?",
    quizQ2A: "A more recent study",
    quizQ2B: "A study with a bigger effect size",
    quizQ2C: "A study with more weight (higher precision)",
    quizQ2D: "A study from a more prestigious journal",
    quizQ2Exp: "The size of each square is proportional to the study's weight. Larger, more precise studies get bigger squares because they contribute more to the pooled result.",

    quizQ3: "What does I² measure in a meta-analysis?",
    quizQ3A: "The total number of included studies",
    quizQ3B: "The percentage of variation due to heterogeneity",
    quizQ3C: "The quality score of each study",
    quizQ3D: "The publication date of the oldest study",
    quizQ3Exp: "I² quantifies what percentage of the variability between studies is due to genuine differences (heterogeneity) rather than random chance. Values above 50% suggest substantial heterogeneity.",

    quizQ4: "A symmetric funnel plot suggests:",
    quizQ4A: "High publication bias",
    quizQ4B: "All studies found the same result",
    quizQ4C: "Low risk of publication bias",
    quizQ4D: "The meta-analysis has errors",
    quizQ4Exp: "When studies scatter symmetrically around the pooled effect, it forms an inverted funnel shape — suggesting studies aren't 'missing' due to publication bias.",

    quizQ5: "What does PRISMA stand for?",
    quizQ5A: "Primary Reporting Items for Science and Medical Analysis",
    quizQ5B: "Preferred Reporting Items for Systematic Reviews and Meta-Analyses",
    quizQ5C: "Protocol for Research in Statistical Meta-Analysis",
    quizQ5D: "Published Results in Synthesized Medical Articles",
    quizQ5Exp: "PRISMA provides a standardized 27-item checklist and flow diagram to help researchers transparently report their systematic review methodology.",

    // Footer
    footerText: "Content synthesized from leading methodological guides including PRISMA 2020, Cochrane Handbook, and peer-reviewed meta-analysis tutorials. Built as an educational resource for beginners.",
    footerBrand: "Meta-Analysis 101",
  },
};

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("ma101-lang") || "zh";
    } catch {
      return "zh";
    }
  });

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === "zh" ? "en" : "zh";
      try { localStorage.setItem("ma101-lang", next); } catch {}
      return next;
    });
  }, []);

  const t = useCallback(
    (key, ...args) => {
      const val = translations[lang][key];
      if (typeof val === "function") return val(...args);
      return val || key;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
