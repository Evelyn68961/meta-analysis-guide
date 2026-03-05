import { useState, useEffect, useRef, useCallback } from "react";

// ═══ DESIGN TOKENS (matching existing site) ═══
const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const DINO_COLORS = ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6", "#E67E22", "#95A5A6"];

// ═══ i18n ═══
const translations = {
  zh: {
    langSwitch: "EN",
    courseLabel: "進階課程 1",
    courseTitle: "打造你的研究問題",
    courseSubtitle: "PICO / PICOS 架構",
    courseDesc: "好的統合分析始於好的問題。學會用 PICO 架構把模糊的想法變成精準、可搜尋、可回答的研究問題。",
    startBtn: "開始學習 →",

    s1Label: "為什麼需要 PICO？",
    s1Title: "模糊的問題，得到模糊的答案",
    s1Intro: "想像你走進圖書館問：「有沒有關於心臟的書？」管理員會不知所措。但如果你問：「有沒有比較阿斯匹靈和安慰劑預防心肌梗塞的隨機試驗？」這就容易找了。",
    s1Bad: "❌ 不好的問題",
    s1BadEx: "「糖尿病藥物有效嗎？」",
    s1BadWhy: "哪種藥？對誰？跟什麼比？量什麼結果？太模糊了。",
    s1Good: "✅ 好的 PICO 問題",
    s1GoodEx: "「在第二型糖尿病成人患者(P)中，使用 Metformin(I)相比安慰劑(C)，能否降低 HbA1c(O)？」",
    s1GoodWhy: "每個元素都清楚定義，可以直接用來搜尋文獻。",
    s1Next: "接下來認識 PICO 的四個元素 →",

    s2Label: "PICO 的四個元素",
    s2Title: "拆解 PICO",
    s2Intro: "PICO 是四個英文字的縮寫，每一個都幫你鎖定研究問題的一個面向：",
    pTitle: "P — Population 族群",
    pDesc: "你要研究的對象是誰？越具體越好。",
    pExample: "「65歲以上、有高血壓病史的成年患者」",
    pTip: "想想：年齡、性別、疾病階段、嚴重度、地區",
    iTitle: "I — Intervention 介入措施",
    iDesc: "你想測試的治療、藥物、策略或暴露因子是什麼？",
    iExample: "「每日口服 Amlodipine 5mg」",
    iTip: "想想：劑量、頻率、給藥途徑、持續時間",
    cTitle: "C — Comparison 對照組",
    cDesc: "你拿什麼來做比較？可以是安慰劑、其他藥物、或不治療。",
    cExample: "「安慰劑」或「Lisinopril 10mg」",
    cTip: "沒有對照 = 無法判斷效果。這是因果推論的核心。",
    oTitle: "O — Outcome 結果指標",
    oDesc: "你要量測什麼來判斷成敗？",
    oExample: "「收縮壓變化 (mmHg)」或「心血管事件發生率」",
    oTip: "主要結果 vs 次要結果都要想清楚",
    s2Next: "學會了四個元素，來看 PICOS 的延伸 →",

    s3Label: "進階：PICOS",
    s3Title: "加上 S — 研究設計",
    s3Intro: "有時候你需要第五個字母：S (Study design)。它幫你限定要納入哪種類型的研究。",
    sTitle: "S — Study Design 研究設計",
    sDesc: "你要納入哪種研究？這會影響你的搜尋範圍和證據品質。",
    sOptions: "常見選擇：",
    sRCT: "隨機對照試驗 (RCT) — 證據等級最高",
    sCohort: "世代研究 (Cohort) — 觀察性，適合長期追蹤",
    sCaseControl: "病例對照研究 — 適合罕見疾病",
    sAny: "所有研究設計 — 當 RCT 數量不足時",
    s3Tip: "如果你的統合分析只想納入 RCT，在 S 這裡就要寫清楚。這會直接影響你在 Course 2 搜尋文獻時的篩選標準。",
    s3Next: "來動手練習！ →",

    s4Label: "互動練習",
    s4Title: "打造你自己的 PICO",
    s4Intro: "試試看！選擇一個臨床情境，然後填入 PICO 的每個元素。這個練習會幫你把抽象概念變成實際操作。",
    s4Scenario: "選擇情境：",
    scenarioA: "🫀 心血管：SGLT2 抑制劑治療心衰竭",
    scenarioB: "🦠 感染科：延長輸注 β-lactam 抗生素",
    scenarioC: "🧠 精神科：CBT 治療重度憂鬱症",
    s4YourP: "你的 P (族群)：",
    s4YourI: "你的 I (介入)：",
    s4YourC: "你的 C (對照)：",
    s4YourO: "你的 O (結果)：",
    s4PlaceholderP: "例如：65歲以上心衰竭患者...",
    s4PlaceholderI: "例如：Dapagliflozin 10mg QD...",
    s4PlaceholderC: "例如：安慰劑...",
    s4PlaceholderO: "例如：住院率...",
    s4ShowAnswer: "看看參考答案",
    s4HideAnswer: "隱藏參考答案",
    s4RefTitle: "參考 PICO",
    scenarioARef: { p: "射出分率降低的心衰竭 (HFrEF) 成年患者，NYHA class II-IV", i: "SGLT2 抑制劑 (如 Dapagliflozin 10mg 或 Empagliflozin 10mg) 加上標準治療", c: "安慰劑加上標準治療", o: "主要：心血管死亡或心衰竭住院的複合終點；次要：全因死亡率、生活品質 (KCCQ)" },
    scenarioBRef: { p: "加護病房中接受 β-lactam 抗生素治療的重症成人患者", i: "延長輸注 (≥3小時持續輸注或間歇延長輸注)", c: "傳統間歇輸注 (30分鐘 bolus)", o: "主要：院內死亡率；次要：臨床治癒率、ICU 住院天數" },
    scenarioCRef: { p: "符合 DSM-5 重度憂鬱症診斷標準的成年患者 (18歲以上)", i: "認知行為治療 (CBT)，每週 1 次，持續 12-16 週", c: "藥物治療 (SSRI) 單獨使用、或等待名單對照", o: "主要：憂鬱量表分數變化 (PHQ-9 或 HAM-D)；次要：緩解率、復發率" },
    s4Next: "準備好了嗎？先看看常見錯誤 →",

    s5Label: "常見錯誤",
    s5Title: "PICO 的五大陷阱",
    s5Intro: "初學者最常犯的錯誤——避開這些陷阱，你的研究問題就成功了一半。",
    trap1Title: "族群太廣泛",
    trap1Bad: "「所有糖尿病患者」",
    trap1Good: "「第二型糖尿病、HbA1c > 7%、未使用胰島素的成人」",
    trap2Title: "沒有明確的對照組",
    trap2Bad: "「Metformin 有效嗎？」",
    trap2Good: "「Metformin vs 安慰劑」或「Metformin vs Sulfonylurea」",
    trap3Title: "結果指標太模糊",
    trap3Bad: "「病人有沒有好轉？」",
    trap3Good: "「HbA1c 在 12 週後的平均變化量」",
    trap4Title: "問題太大無法回答",
    trap4Bad: "「所有降血壓藥對所有心血管疾病的效果」",
    trap4Good: "「ACE抑制劑 vs ARB 對高血壓患者中風風險的影響」",
    trap5Title: "忘記考慮可行性",
    trap5Bad: "設定了完美 PICO 但只找到 2 篇相關研究",
    trap5Good: "先初步搜尋確認有足夠研究，再確定 PICO",
    s5Next: "前往龍蛋孵化挑戰！ 🥚🔥",

    gameLabel: "龍蛋孵化挑戰",
    gameTitle: "你能孵出小恐龍嗎？",
    gameDesc: "回答 7 道關於 PICO 的問題。全部答對，龍蛋就會孵化出可愛的小恐龍！但如果答錯 3 題以上，龍蛋會被凍住……",
    gameStart: "開始孵化 🥚",
    gameQ: (n) => `第 ${n} 題 / 共 7 題`,
    gameCorrect: "正確！龍蛋裂開了一些！ 🔥",
    gameWrong: "答錯了……龍蛋感到一陣寒意 ❄️",
    gameNext: "下一題 →",
    gameResults: "查看結果 →",
    gameHatched: "恭喜！龍蛋孵化成功！ 🎉",
    gameHatchedDesc: "你的小恐龍誕生了！牠們每一隻都代表你對 PICO 的精熟掌握。",
    gameFrozen: "龍蛋被凍住了… ❄️",
    gameFrozenDesc: "別灰心！回去複習 PICO 的內容，再來挑戰一次吧！",
    gameScore: (s) => `答對 ${s} / 7 題`,
    gameRetry: "再挑戰一次 🔄",
    gameContinue: "前往 Course 2 →",

    q1: "以下哪個是正確的 PICO 格式研究問題？",
    q1a: "糖尿病藥物有效嗎？",
    q1b: "在第二型糖尿病成人中，Metformin 相比安慰劑能否降低 HbA1c？",
    q1c: "Metformin 是最好的藥嗎？",
    q1d: "糖尿病患者應該吃什麼藥？",
    q1correct: 1,
    q1exp: "選項 B 清楚包含了 P（第二型糖尿病成人）、I（Metformin）、C（安慰劑）和 O（HbA1c 降低），是標準的 PICO 格式。",

    q2: "在 PICO 中，「C」代表什麼？為什麼它很重要？",
    q2a: "Conclusion（結論）— 統合分析的最終結果",
    q2b: "Comparison（對照組）— 沒有對照就無法判斷因果關係",
    q2c: "Category（分類）— 用來分類不同的研究",
    q2d: "Criteria（標準）— 納入研究的條件",
    q2correct: 1,
    q2exp: "C 是 Comparison（對照組），它是因果推論的核心。沒有明確的對照組，你無法判斷介入措施的效果是真實的還是自然發生的。",

    q3: "你正在研究「延長輸注 β-lactam 抗生素對重症患者的效果」。以下哪個 Population 定義最恰當？",
    q3a: "所有接受抗生素的患者",
    q3b: "加護病房中接受 β-lactam 抗生素治療的重症成人患者",
    q3c: "住院的患者",
    q3d: "有感染症狀的人",
    q3correct: 1,
    q3exp: "選項 B 精確定義了族群：場域（ICU）、藥物類別（β-lactam）、嚴重度（重症）和年齡（成人）。其他選項太廣泛，會納入不相關的研究。",

    q4: "PICOS 中的 S 代表什麼？什麼時候需要加上它？",
    q4a: "Sample size（樣本量）— 當你想限制研究大小時",
    q4b: "Study design（研究設計）— 當你想限定納入的研究類型時",
    q4c: "Statistics（統計方法）— 當你想指定分析方法時",
    q4d: "Setting（場域）— 當你想限制研究地點時",
    q4correct: 1,
    q4exp: "S 是 Study design（研究設計）。加上 S 可以幫你限定只看 RCT、或只看世代研究等。這在你預先知道要做何種等級的證據綜合時特別重要。",

    q5: "以下哪個是 PICO 的常見錯誤？",
    q5a: "在 Outcome 中指定具體的量測工具和時間點",
    q5b: "先做初步搜尋確認有足夠的研究再確定 PICO",
    q5c: "把 Population 定義為「所有患者」而不限定具體特徵",
    q5d: "在 Comparison 中同時考慮安慰劑和積極對照組",
    q5correct: 2,
    q5exp: "把族群定義為「所有患者」太過廣泛，會讓搜尋結果過多且不聚焦。好的 P 應該限定年齡、疾病階段、嚴重度等特徵。其他選項都是好的做法。",

    q6: "你想研究「SGLT2 抑制劑對心衰竭患者的效果」。以下哪個 Outcome 定義最合適？",
    q6a: "病人有沒有好轉",
    q6b: "心血管死亡或心衰竭住院的複合終點",
    q6c: "所有不良事件",
    q6d: "醫生的主觀評估",
    q6correct: 1,
    q6exp: "選項 B 是一個具體、可量測的複合終點，常用於心衰竭臨床試驗（如 DAPA-HF, EMPEROR-Reduced）。其他選項太主觀或太廣泛，無法精確量化。",

    q7: "以下關於 PICO 各元素的描述，哪個是正確的？",
    q7a: "P 只需要寫疾病名稱就夠了",
    q7b: "I 和 C 可以是同一種藥物的不同劑量",
    q7c: "O 不需要指定量測的時間點",
    q7d: "C 不是必要的，可以省略",
    q7correct: 1,
    q7exp: "I 和 C 確實可以是同一種藥物的不同劑量（如高劑量 vs 低劑量比較）。P 需要更多細節（年齡、嚴重度等），O 應指定時間點，而 C 是因果推論的核心不可省略。",

    dinoNames: ["小焰龍", "蒼藍龍", "金耀龍", "赤焰龍", "紫晶龍", "琥珀龍", "銀霧龍"],
  },
  en: {
    langSwitch: "中文",
    courseLabel: "Advanced Course 1",
    courseTitle: "Crafting Your Research Question",
    courseSubtitle: "PICO / PICOS Framework",
    courseDesc: "A great meta-analysis starts with a great question. Learn to turn vague ideas into precise, searchable, answerable research questions using the PICO framework.",
    startBtn: "Start Learning →",

    s1Label: "Why PICO?",
    s1Title: "Vague Questions Get Vague Answers",
    s1Intro: "Imagine walking into a library and asking: \"Got any books about hearts?\" The librarian would be lost. But if you ask: \"Do you have RCTs comparing aspirin vs placebo for preventing MI?\" — now that's searchable.",
    s1Bad: "❌ Bad Question",
    s1BadEx: "\"Do diabetes drugs work?\"",
    s1BadWhy: "Which drug? For whom? Compared to what? Measuring what? Too vague.",
    s1Good: "✅ Good PICO Question",
    s1GoodEx: "\"In adults with type 2 diabetes (P), does Metformin (I) compared to placebo (C) reduce HbA1c (O)?\"",
    s1GoodWhy: "Every element is clearly defined. You can go straight to PubMed with this.",
    s1Next: "Let's learn the four PICO elements →",

    s2Label: "The Four Elements",
    s2Title: "Breaking Down PICO",
    s2Intro: "PICO is an acronym where each letter locks down one dimension of your research question:",
    pTitle: "P — Population",
    pDesc: "Who are you studying? The more specific, the better.",
    pExample: "\"Adults over 65 with a history of hypertension\"",
    pTip: "Think: age, sex, disease stage, severity, setting",
    iTitle: "I — Intervention",
    iDesc: "What treatment, drug, strategy, or exposure are you testing?",
    iExample: "\"Amlodipine 5mg daily, oral\"",
    iTip: "Think: dose, frequency, route, duration",
    cTitle: "C — Comparison",
    cDesc: "What are you comparing against? Placebo, another drug, or no treatment.",
    cExample: "\"Placebo\" or \"Lisinopril 10mg\"",
    cTip: "No comparison = no causal inference. This is the heart of evidence.",
    oTitle: "O — Outcome",
    oDesc: "What do you measure to judge success or failure?",
    oExample: "\"Change in systolic BP (mmHg)\" or \"CV event rate\"",
    oTip: "Clarify both primary and secondary outcomes",
    s2Next: "Now let's extend to PICOS →",

    s3Label: "Advanced: PICOS",
    s3Title: "Adding S — Study Design",
    s3Intro: "Sometimes you need a fifth letter: S (Study design). It specifies which types of studies you'll include.",
    sTitle: "S — Study Design",
    sDesc: "What study types will you include? This affects your search scope and evidence quality.",
    sOptions: "Common choices:",
    sRCT: "Randomized Controlled Trials (RCTs) — highest evidence level",
    sCohort: "Cohort studies — observational, good for long-term follow-up",
    sCaseControl: "Case-control studies — good for rare diseases",
    sAny: "All study designs — when RCTs are scarce",
    s3Tip: "If your meta-analysis only includes RCTs, state it clearly in S. This directly affects your screening criteria in Course 2.",
    s3Next: "Let's practice! →",

    s4Label: "Interactive Exercise",
    s4Title: "Build Your Own PICO",
    s4Intro: "Try it yourself! Pick a clinical scenario and fill in each PICO element.",
    s4Scenario: "Choose a scenario:",
    scenarioA: "🫀 Cardiology: SGLT2 inhibitors for heart failure",
    scenarioB: "🦠 Infectious Disease: Prolonged β-lactam infusion",
    scenarioC: "🧠 Psychiatry: CBT for major depression",
    s4YourP: "Your P (Population):",
    s4YourI: "Your I (Intervention):",
    s4YourC: "Your C (Comparison):",
    s4YourO: "Your O (Outcome):",
    s4PlaceholderP: "e.g., Adults over 65 with heart failure...",
    s4PlaceholderI: "e.g., Dapagliflozin 10mg QD...",
    s4PlaceholderC: "e.g., Placebo...",
    s4PlaceholderO: "e.g., Hospitalization rate...",
    s4ShowAnswer: "Show Reference Answer",
    s4HideAnswer: "Hide Reference Answer",
    s4RefTitle: "Reference PICO",
    scenarioARef: { p: "Adults with HFrEF, NYHA class II-IV", i: "SGLT2 inhibitor (Dapagliflozin 10mg or Empagliflozin 10mg) plus standard therapy", c: "Placebo plus standard therapy", o: "Primary: composite of CV death or HF hospitalization; Secondary: all-cause mortality, KCCQ" },
    scenarioBRef: { p: "Critically ill adults in ICU receiving β-lactam antibiotics", i: "Prolonged infusion (≥3h continuous or extended intermittent)", c: "Conventional intermittent infusion (30-min bolus)", o: "Primary: in-hospital mortality; Secondary: clinical cure rate, ICU LOS" },
    scenarioCRef: { p: "Adults (≥18y) meeting DSM-5 criteria for major depressive disorder", i: "CBT, weekly sessions for 12-16 weeks", c: "Pharmacotherapy (SSRI) alone, or wait-list control", o: "Primary: depression score change (PHQ-9/HAM-D); Secondary: remission rate, relapse rate" },
    s4Next: "Ready? Let's check common mistakes first →",

    s5Label: "Common Mistakes",
    s5Title: "The 5 PICO Traps",
    s5Intro: "The most common beginner mistakes — avoid these and you're halfway to a great research question.",
    trap1Title: "Population Too Broad",
    trap1Bad: "\"All diabetes patients\"",
    trap1Good: "\"Adults with T2DM, HbA1c > 7%, insulin-naive\"",
    trap2Title: "No Clear Comparator",
    trap2Bad: "\"Does Metformin work?\"",
    trap2Good: "\"Metformin vs placebo\" or \"Metformin vs Sulfonylurea\"",
    trap3Title: "Vague Outcome",
    trap3Bad: "\"Did patients get better?\"",
    trap3Good: "\"Mean change in HbA1c at 12 weeks\"",
    trap4Title: "Question Too Broad",
    trap4Bad: "\"All antihypertensives for all CV diseases\"",
    trap4Good: "\"ACEi vs ARBs on stroke risk in hypertensive patients\"",
    trap5Title: "Forgetting Feasibility",
    trap5Bad: "Perfect PICO but only 2 relevant studies exist",
    trap5Good: "Do a preliminary search to confirm enough studies before finalizing",
    s5Next: "Head to the Dragon Egg Challenge! 🥚🔥",

    gameLabel: "Dragon Egg Challenge",
    gameTitle: "Can You Hatch the Dinosaurs?",
    gameDesc: "Answer 7 PICO questions. Get all correct and the eggs hatch into adorable dinosaurs! But get 3+ wrong and they freeze solid…",
    gameStart: "Start Hatching 🥚",
    gameQ: (n) => `Question ${n} of 7`,
    gameCorrect: "Correct! The egg is cracking! 🔥",
    gameWrong: "Wrong… the egg feels a chill ❄️",
    gameNext: "Next →",
    gameResults: "See Results →",
    gameHatched: "The Eggs Hatched! 🎉",
    gameHatchedDesc: "Your baby dinosaurs are born! Each one represents your mastery of PICO.",
    gameFrozen: "The Eggs Froze… ❄️",
    gameFrozenDesc: "Don't worry! Review the PICO content and try again!",
    gameScore: (s) => `${s} / 7 correct`,
    gameRetry: "Try Again 🔄",
    gameContinue: "Continue to Course 2 →",

    q1: "Which is a properly formatted PICO research question?",
    q1a: "Do diabetes drugs work?",
    q1b: "In adults with T2DM, does Metformin vs placebo reduce HbA1c?",
    q1c: "Is Metformin the best drug?",
    q1d: "What should diabetes patients take?",
    q1correct: 1,
    q1exp: "Option B clearly contains P (adults with T2DM), I (Metformin), C (placebo), and O (HbA1c reduction) — a standard PICO format.",

    q2: "What does 'C' in PICO stand for, and why is it important?",
    q2a: "Conclusion — the final result of the meta-analysis",
    q2b: "Comparison — without it, you can't establish causation",
    q2c: "Category — used to classify different studies",
    q2d: "Criteria — conditions for including studies",
    q2correct: 1,
    q2exp: "C stands for Comparison. It's the core of causal inference. Without a comparator, you can't tell if the effect is real or natural.",

    q3: "For 'prolonged β-lactam infusion in critically ill patients,' which Population is most appropriate?",
    q3a: "All patients receiving antibiotics",
    q3b: "Critically ill adults in ICU receiving β-lactam antibiotics",
    q3c: "Hospitalized patients",
    q3d: "People with infection symptoms",
    q3correct: 1,
    q3exp: "Option B precisely defines setting (ICU), drug class (β-lactam), severity (critically ill), and age (adults). Others are too broad.",

    q4: "What does S in PICOS stand for? When do you need it?",
    q4a: "Sample size — to limit study size",
    q4b: "Study design — to specify which study types to include",
    q4c: "Statistics — to specify the analysis method",
    q4d: "Setting — to limit study location",
    q4correct: 1,
    q4exp: "S = Study design. It lets you restrict to RCTs only, cohort studies, etc. Important when you know what evidence level you're aiming for.",

    q5: "Which is a common PICO mistake?",
    q5a: "Specifying a concrete measurement tool and timepoint in Outcome",
    q5b: "Doing a preliminary search before finalizing PICO",
    q5c: "Defining Population as 'all patients' without specific characteristics",
    q5d: "Considering both placebo and active comparators",
    q5correct: 2,
    q5exp: "'All patients' is too broad, making results unfocused. A good P should specify age, disease stage, severity. The other options are good practices.",

    q6: "You want to study 'SGLT2 inhibitors for heart failure.' Which Outcome is most appropriate?",
    q6a: "Whether patients got better",
    q6b: "Composite of CV death or HF hospitalization",
    q6c: "All adverse events",
    q6d: "Physician's subjective assessment",
    q6correct: 1,
    q6exp: "Option B is a specific, measurable composite endpoint commonly used in HF trials (DAPA-HF, EMPEROR-Reduced). The others are too subjective or broad to quantify precisely.",

    q7: "Which statement about PICO elements is correct?",
    q7a: "P only needs the disease name",
    q7b: "I and C can be different doses of the same drug",
    q7c: "O doesn't need a measurement timepoint",
    q7d: "C is optional and can be omitted",
    q7correct: 1,
    q7exp: "I and C can indeed be different doses of the same drug (e.g., high-dose vs low-dose comparison). P needs more detail (age, severity), O should specify timepoints, and C is essential for causal inference.",

    dinoNames: ["Ember", "Azure", "Goldie", "Blaze", "Amethyst", "Amber", "Misty"],
  },
};

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
      <div style={{ width: 24, height: 2, background: TEAL, borderRadius: 1 }} />
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: TEAL }}>{text}</span>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 style={{ fontSize: "clamp(26px, 4.5vw, 38px)", fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 16 }}>{children}</h2>;
}

function Paragraph({ children, style = {} }) {
  return <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, maxWidth: 640, ...style }}>{children}</p>;
}

const btnPrimary = { background: TEAL, border: "none", color: "#FFF", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" };

// ═══ SVG DRAGON EGG ═══
function DragonEgg({ color = "#3498DB", size = 80, state = "idle", delay = 0 }) {
  const w = Math.round(size * 0.77);
  const h = size;
  const id = `degg-${Math.random().toString(36).slice(2, 8)}`;
  const lighten = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt].map(v => Math.min(255, Math.round(v)).toString(16).padStart(2, "0")).join(""); };
  const darken = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r * (1 - amt), g * (1 - amt), b * (1 - amt)].map(v => Math.max(0, Math.round(v)).toString(16).padStart(2, "0")).join(""); };

  const animStyle = state === "idle" ? { animation: `eggFloat 3s ease-in-out ${delay}s infinite` } : state === "crack" ? { animation: "eggShake 0.5s ease-in-out" } : state === "frozen" ? { filter: "saturate(0.15) brightness(1.35)", animation: "eggFreeze 0.8s ease-out forwards" } : {};

  return (
    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: w + 16, height: h + 16, position: "relative", ...animStyle }}>
      <svg width={w} height={h} viewBox="0 0 62 80" fill="none">
        <defs>
          <radialGradient id={`${id}-bg`} cx="38%" cy="30%" r="65%"><stop offset="0%" stopColor={lighten(color, 0.3)} /><stop offset="60%" stopColor={color} /><stop offset="100%" stopColor={darken(color, 0.2)} /></radialGradient>
          <radialGradient id={`${id}-hi`} cx="35%" cy="25%" r="35%"><stop offset="0%" stopColor="white" stopOpacity="0.5" /><stop offset="100%" stopColor="white" stopOpacity="0" /></radialGradient>
        </defs>
        <ellipse cx="31" cy="76" rx="18" ry="3" fill={darken(color, 0.3)} opacity="0.15" />
        <ellipse cx="31" cy="43" rx="27" ry="35" fill={`url(#${id}-bg)`} />
        <path d="M10 38 Q18 33 24 37 Q31 42 38 36 Q45 30 52 36" stroke={lighten(color, 0.4)} strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M10 46 Q18 51 24 47 Q31 42 38 48 Q45 54 52 48" stroke={lighten(color, 0.4)} strokeWidth="2" fill="none" opacity="0.45" />
        <path d="M14 42 Q22 38 31 42 Q40 38 48 42" stroke={lighten(color, 0.35)} strokeWidth="1.5" fill="none" opacity="0.3" />
        <ellipse cx="20" cy="36" rx="3" ry="4" fill={lighten(color, 0.6)} opacity="0.5" transform="rotate(-10 20 36)" />
        <ellipse cx="42" cy="36" rx="3" ry="4" fill={lighten(color, 0.6)} opacity="0.5" transform="rotate(10 42 36)" />
        <circle cx="31" cy="30" r="3" fill={lighten(color, 0.7)} opacity="0.4" />
        <ellipse cx="22" cy="28" rx="10" ry="14" fill={`url(#${id}-hi)`} transform="rotate(-12 22 28)" />
        <circle cx="20" cy="22" r="1.5" fill="white" opacity="0.7" />
        <circle cx="17" cy="26" r="0.8" fill="white" opacity="0.4" />
        {state === "frozen" && (<><ellipse cx="31" cy="43" rx="27" ry="35" fill="none" stroke="#B8E4F0" strokeWidth="2.5" opacity="0.6" strokeDasharray="4 3" /><path d="M18 25 L22 30 L18 35" stroke="#9ED8EA" strokeWidth="1.5" fill="none" opacity="0.5" /><path d="M44 25 L40 30 L44 35" stroke="#9ED8EA" strokeWidth="1.5" fill="none" opacity="0.5" /><text x="31" y="47" textAnchor="middle" fontSize="20" fill="#9ED8EA" opacity="0.7">❄</text></>)}
        {state === "crack" && (<><path d="M24 28 L28 36 L22 42 L28 48" stroke={darken(color, 0.3)} strokeWidth="2" fill="none" strokeLinecap="round" /><path d="M38 30 L35 37 L40 43" stroke={darken(color, 0.3)} strokeWidth="1.5" fill="none" strokeLinecap="round" /></>)}
      </svg>
    </div>
  );
}

// ═══ SVG CUTE DINOSAUR ═══
function CuteDino({ color = "#E8734A", size = 100, name = "", delay = 0 }) {
  const lighten = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt].map(v => Math.min(255, Math.round(v)).toString(16).padStart(2, "0")).join(""); };
  const darken = (hex, amt) => { const c = hex.replace("#", ""); const [r, g, b] = [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; return "#" + [r * (1 - amt), g * (1 - amt), b * (1 - amt)].map(v => Math.max(0, Math.round(v)).toString(16).padStart(2, "0")).join(""); };
  const id = `dino-${Math.random().toString(36).slice(2, 8)}`;
  const belly = lighten(color, 0.55);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", animation: `dinoAppear 0.8s ease-out ${delay}s both` }}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none">
        <defs><radialGradient id={`${id}-b`} cx="45%" cy="40%" r="55%"><stop offset="0%" stopColor={lighten(color, 0.15)} /><stop offset="100%" stopColor={darken(color, 0.1)} /></radialGradient></defs>
        {/* Tail */}
        <path d="M30 75 Q15 80 10 70 Q5 60 15 55" stroke={color} strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* Back spikes */}
        <path d="M48 35 L52 22 L56 35" fill={darken(color, 0.15)} />
        <path d="M56 32 L60 20 L64 32" fill={darken(color, 0.15)} />
        <path d="M64 35 L67 24 L70 35" fill={darken(color, 0.15)} />
        {/* Body */}
        <ellipse cx="60" cy="65" rx="28" ry="30" fill={`url(#${id}-b)`} />
        {/* Belly */}
        <ellipse cx="62" cy="72" rx="16" ry="18" fill={belly} />
        {/* Head */}
        <circle cx="78" cy="42" r="20" fill={color} />
        {/* Cheek blush */}
        <circle cx="88" cy="50" r="5" fill={lighten(color, 0.4)} opacity="0.6" />
        {/* Eye */}
        <circle cx="82" cy="38" r="6" fill="white" />
        <circle cx="83" cy="37" r="3.5" fill={DARK} />
        <circle cx="84.5" cy="35.5" r="1.5" fill="white" />
        {/* Horn */}
        <path d="M76 24 L78 16 L82 24" fill={darken(color, 0.2)} />
        {/* Smile */}
        <path d="M82 48 Q86 52 90 48" stroke={darken(color, 0.3)} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* Arms */}
        <path d="M42 58 Q34 55 32 60 Q30 65 36 66" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M78 58 Q86 54 90 58 Q94 62 88 65" stroke={color} strokeWidth="5" fill="none" strokeLinecap="round" />
        {/* Legs */}
        <ellipse cx="48" cy="92" rx="9" ry="6" fill={darken(color, 0.1)} />
        <ellipse cx="72" cy="92" rx="9" ry="6" fill={darken(color, 0.1)} />
        {/* Toes */}
        <circle cx="42" cy="95" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="48" cy="96" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="54" cy="95" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="66" cy="95" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="72" cy="96" r="2.5" fill={darken(color, 0.15)} />
        <circle cx="78" cy="95" r="2.5" fill={darken(color, 0.15)} />
      </svg>
      {name && <span style={{ fontSize: 12, fontWeight: 600, color, marginTop: 4, letterSpacing: 0.5 }}>{name}</span>}
    </div>
  );
}

// ═══ PICO CARD ═══
function PicoCard({ letter, color, title, desc, example, tip, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <FadeIn delay={delay}>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ background: CARD_BG, border: `1.5px solid ${hovered ? color + "55" : LIGHT_BORDER}`, borderRadius: 16, padding: "28px 24px", transition: "all 0.3s", boxShadow: hovered ? `0 8px 28px ${color}15` : "none", transform: hovered ? "translateY(-3px)" : "translateY(0)", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color, flexShrink: 0 }}>{letter}</div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, lineHeight: 1.3 }}>{title}</h3>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: MUTED, marginBottom: 14 }}>{desc}</p>
        <div style={{ background: `${color}08`, border: `1px solid ${color}18`, borderRadius: 10, padding: "10px 14px", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color, fontWeight: 600 }}>{example}</span>
        </div>
        <p style={{ fontSize: 12.5, color: `${MUTED}BB`, fontStyle: "italic", lineHeight: 1.6 }}>💡 {tip}</p>
      </div>
    </FadeIn>
  );
}

// ═══ TRAP CARD ═══
function TrapCard({ number, title, bad, good, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "22px 20px", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${CORAL}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: CORAL, flexShrink: 0 }}>{number}</div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{title}</h4>
        </div>
        <div style={{ background: "#FDF2F0", borderRadius: 8, padding: "8px 12px", marginBottom: 8, fontSize: 13, color: "#B83A20", lineHeight: 1.6 }}>✗ {bad}</div>
        <div style={{ background: "#E6F5F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#2A7A5A", lineHeight: 1.6 }}>✓ {good}</div>
      </div>
    </FadeIn>
  );
}

// ═══ DRAGON EGG HATCHING GAME ═══
function DragonEggGame({ t }) {
  const [phase, setPhase] = useState("welcome");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState([]);
  const [eggState, setEggState] = useState("idle");

  const questions = [
    { q: t("q1"), opts: [t("q1a"), t("q1b"), t("q1c"), t("q1d")], correct: t("q1correct"), exp: t("q1exp") },
    { q: t("q2"), opts: [t("q2a"), t("q2b"), t("q2c"), t("q2d")], correct: t("q2correct"), exp: t("q2exp") },
    { q: t("q3"), opts: [t("q3a"), t("q3b"), t("q3c"), t("q3d")], correct: t("q3correct"), exp: t("q3exp") },
    { q: t("q4"), opts: [t("q4a"), t("q4b"), t("q4c"), t("q4d")], correct: t("q4correct"), exp: t("q4exp") },
    { q: t("q5"), opts: [t("q5a"), t("q5b"), t("q5c"), t("q5d")], correct: t("q5correct"), exp: t("q5exp") },
    { q: t("q6"), opts: [t("q6a"), t("q6b"), t("q6c"), t("q6d")], correct: t("q6correct"), exp: t("q6exp") },
    { q: t("q7"), opts: [t("q7a"), t("q7b"), t("q7c"), t("q7d")], correct: t("q7correct"), exp: t("q7exp") },
  ];

  const startGame = () => { setCurrent(0); setSelected(null); setAnswered(false); setResults([]); setEggState("idle"); setPhase("playing"); };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const isCorrect = idx === questions[current].correct;
    setResults(prev => [...prev, isCorrect]);
    setEggState(isCorrect ? "crack" : "frozen");
  };

  const nextQuestion = () => {
    if (current < 6) { setCurrent(c => c + 1); setSelected(null); setAnswered(false); setEggState("idle"); }
    else { setPhase("results"); }
  };

  const score = results.filter(Boolean).length;
  const wrongCount = results.filter(r => !r).length;
  const hatched = wrongCount < 3;

  if (phase === "welcome") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 32px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          {DINO_COLORS.map((c, i) => <DragonEgg key={i} color={c} size={56} state="idle" delay={i * 0.4} />)}
        </div>
        <h3 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 10 }}>{t("gameTitle")}</h3>
        <p style={{ fontSize: 15, color: MUTED, marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>{t("gameDesc")}</p>
        <button onClick={startGame} style={{ ...btnPrimary, padding: "14px 32px", fontSize: 16 }}>{t("gameStart")}</button>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "48px 28px", textAlign: "center", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
        {hatched ? (
          <>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: DARK, marginBottom: 8 }}>{t("gameHatched")}</h3>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 8 }}>{t("gameHatchedDesc")}</p>
            <p style={{ fontSize: 17, color: TEAL, fontWeight: 600, marginBottom: 28 }}>{t("gameScore")(score)}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
              {DINO_COLORS.map((c, i) => <CuteDino key={i} color={c} size={100} name={t("dinoNames")[i]} delay={i * 0.3} />)}
            </div>
          </>
        ) : (
          <>
            <h3 style={{ fontSize: 28, fontWeight: 700, color: "#6BA3C4", marginBottom: 8 }}>{t("gameFrozen")}</h3>
            <p style={{ fontSize: 15, color: MUTED, marginBottom: 8 }}>{t("gameFrozenDesc")}</p>
            <p style={{ fontSize: 17, color: CORAL, fontWeight: 600, marginBottom: 28 }}>{t("gameScore")(score)}</p>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              {DINO_COLORS.map((c, i) => <DragonEgg key={i} color={c} size={64} state="frozen" delay={i * 0.15} />)}
            </div>
          </>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={startGame} style={{ ...btnPrimary, background: hatched ? TEAL : CORAL }}>{t("gameRetry")}</button>
          {hatched && <button style={{ background: "transparent", border: `1.5px solid ${TEAL}`, color: TEAL, padding: "11px 26px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("gameContinue")}</button>}
        </div>
      </div>
    );
  }

  // Playing
  const q = questions[current];
  const isCorrect = selected !== null && selected === q.correct;
  const currentColor = DINO_COLORS[current];

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{t("gameQ")(current + 1)}</span>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2, 3, 4, 5, 6].map(i => {
            let bg = LIGHT_BORDER;
            if (i < current) bg = results[i] ? "#3DA87A" : CORAL;
            else if (i === current) bg = currentColor;
            return <div key={i} style={{ width: 28, height: 6, borderRadius: 3, background: bg, transition: "all 0.3s" }} />;
          })}
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <DragonEgg color={currentColor} size={80} state={eggState} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 600, color: DARK, marginBottom: 18, lineHeight: 1.5 }}>{q.q}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {q.opts.map((opt, idx) => {
          let bg = "#FAFAF7", border = LIGHT_BORDER, col = DARK;
          if (answered) {
            if (idx === q.correct) { bg = "#E6F5F0"; border = "#3DA87A"; col = "#2A7A5A"; }
            else if (idx === selected && idx !== q.correct) { bg = "#FDEEEB"; border = "#D94B2E"; col = "#B83A20"; }
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: 12, padding: "12px 16px", textAlign: "left", fontSize: 14, color: col, cursor: answered ? "default" : "pointer", transition: "all 0.2s", fontWeight: answered && idx === q.correct ? 600 : 400, lineHeight: 1.5 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${border}`, fontSize: 12, fontWeight: 600, marginRight: 10, background: answered && idx === q.correct ? "#3DA87A" : "transparent", color: answered && idx === q.correct ? "#FFF" : col }}>{String.fromCharCode(65 + idx)}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div style={{ background: isCorrect ? "#E6F5F0" : "#FDEEEB", borderRadius: 12, padding: "14px 18px", marginBottom: 16, fontSize: 13.5, lineHeight: 1.65, color: MUTED, border: `1px solid ${isCorrect ? "#3DA87A33" : "#D94B2E33"}` }}>
          <strong style={{ color: isCorrect ? "#2A7A5A" : "#B83A20" }}>{isCorrect ? t("gameCorrect") : t("gameWrong")}</strong>{" "}{q.exp}
        </div>
      )}
      {answered && (
        <div style={{ textAlign: "right" }}>
          <button onClick={nextQuestion} style={btnPrimary}>{current < 6 ? t("gameNext") : t("gameResults")}</button>
        </div>
      )}
    </div>
  );
}

// ═══ INTERACTIVE PICO BUILDER ═══
function PicoBuilder({ t }) {
  const [scenario, setScenario] = useState("A");
  const [inputs, setInputs] = useState({ p: "", i: "", c: "", o: "" });
  const [showRef, setShowRef] = useState(false);

  const refs = { A: t("scenarioARef"), B: t("scenarioBRef"), C: t("scenarioCRef") };
  const ref = refs[scenario];

  const handleScenarioChange = (s) => { setScenario(s); setInputs({ p: "", i: "", c: "", o: "" }); setShowRef(false); };

  return (
    <div style={{ background: CARD_BG, borderRadius: 20, border: `1px solid ${LIGHT_BORDER}`, padding: "32px 24px", boxShadow: "0 2px 20px rgba(0,0,0,0.04)" }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 12 }}>{t("s4Scenario")}</h4>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {["A", "B", "C"].map(s => (
          <button key={s} onClick={() => handleScenarioChange(s)} style={{ background: scenario === s ? `${TEAL}0D` : "#FAFAF7", border: `1.5px solid ${scenario === s ? TEAL + "44" : LIGHT_BORDER}`, borderRadius: 12, padding: "12px 16px", textAlign: "left", fontSize: 14, color: scenario === s ? TEAL : DARK, fontWeight: scenario === s ? 600 : 400, cursor: "pointer", transition: "all 0.2s" }}>
            {t(`scenario${s}`)}
          </button>
        ))}
      </div>
      {[
        { field: "p", color: CORAL },
        { field: "i", color: "#7B68C8" },
        { field: "c", color: "#D4A843" },
        { field: "o", color: "#5B9E5F" },
      ].map(({ field, color }) => (
        <div key={field} style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 6, background: `${color}15`, fontSize: 11, fontWeight: 700, color }}>{field.toUpperCase()}</span>
            {t(`s4Your${field.toUpperCase()}`)}
          </label>
          <textarea value={inputs[field]} onChange={(e) => setInputs(prev => ({ ...prev, [field]: e.target.value }))} placeholder={t(`s4Placeholder${field.toUpperCase()}`)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${LIGHT_BORDER}`, fontSize: 14, lineHeight: 1.6, color: DARK, background: "#FAFAF7", resize: "vertical", minHeight: 48, outline: "none", transition: "border-color 0.2s", boxSizing: "border-box", marginTop: 6 }} />
        </div>
      ))}
      <button onClick={() => setShowRef(!showRef)} style={{ background: "transparent", border: `1.5px solid ${TEAL}`, color: TEAL, padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 4, transition: "all 0.2s" }}>
        {showRef ? t("s4HideAnswer") : t("s4ShowAnswer")}
      </button>
      {showRef && ref && (
        <div style={{ marginTop: 16, background: `${TEAL}06`, border: `1px solid ${TEAL}18`, borderRadius: 14, padding: "20px 22px" }}>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: TEAL, marginBottom: 14 }}>📋 {t("s4RefTitle")}</h4>
          {[{ label: "P", value: ref.p, color: CORAL }, { label: "I", value: ref.i, color: "#7B68C8" }, { label: "C", value: ref.c, color: "#D4A843" }, { label: "O", value: ref.o, color: "#5B9E5F" }].map(item => (
            <div key={item.label} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ minWidth: 26, height: 26, borderRadius: 7, background: `${item.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: item.color, flexShrink: 0 }}>{item.label}</div>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: MUTED, margin: "2px 0 0" }}>{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══ MAIN COURSE COMPONENT ═══
export default function Course1PICO() {
  const [lang, setLang] = useState("zh");
  const toggleLang = () => setLang(prev => prev === "zh" ? "en" : "zh");
  const t = useCallback((key, ...args) => {
    const val = translations[lang][key];
    if (typeof val === "function") return val(...args);
    return val || key;
  }, [lang]);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ background: LIGHT_BG, color: DARK, minHeight: "100vh", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${TEAL}22; color: ${DARK}; }
        @keyframes eggFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes eggShake { 0% { transform: rotate(0); } 20% { transform: rotate(8deg); } 40% { transform: rotate(-8deg); } 60% { transform: rotate(5deg); } 80% { transform: rotate(-3deg); } 100% { transform: rotate(0); } }
        @keyframes eggFreeze { 0% { transform: scale(1); filter: saturate(1) brightness(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); filter: saturate(0.15) brightness(1.35); } }
        @keyframes dinoAppear { 0% { transform: scale(0) translateY(20px); opacity: 0; } 60% { transform: scale(1.1) translateY(-5px); } 100% { transform: scale(1) translateY(0); opacity: 1; } }
        textarea:focus { border-color: ${TEAL}66 !important; box-shadow: 0 0 0 3px ${TEAL}0D; }
        @media (max-width: 640px) {
          .pico-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(248,247,244,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${LIGHT_BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: TEAL, background: `${TEAL}0D`, padding: "3px 8px", borderRadius: 5, border: `1px solid ${TEAL}22` }}>{t("courseLabel")}</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{t("courseSubtitle")}</span>
        </div>
        <button onClick={toggleLang} style={{ background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, color: TEAL, padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.target.style.background = TEAL; e.target.style.color = "#FFF"; }}
          onMouseLeave={(e) => { e.target.style.background = `${TEAL}0D`; e.target.style.color = TEAL; }}>
          {t("langSwitch")}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 100, paddingBottom: 64, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #C8C6C0 0.8px, transparent 0.8px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "10%", right: "8%", width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${CORAL}0A, transparent 70%)`, pointerEvents: "none" }} />
        <FadeIn>
          <div style={{ padding: "0 24px", maxWidth: 680, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 28 }}>
              {DINO_COLORS.map((c, i) => <DragonEgg key={i} color={c} size={44} state="idle" delay={i * 0.5} />)}
            </div>
            <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: DARK }}>
              {t("courseTitle")}
            </h1>
            <p style={{ fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto 32px" }}>{t("courseDesc")}</p>
            <button onClick={() => scrollTo("s1")} style={{ ...btnPrimary, padding: "14px 32px", fontSize: 15, borderRadius: 12, boxShadow: `0 4px 20px ${TEAL}33` }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 8px 28px ${TEAL}44`; }}
              onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 20px ${TEAL}33`; }}>
              {t("startBtn")}
            </button>
          </div>
        </FadeIn>
      </section>

      {/* S1: Why PICO */}
      <section id="s1" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("s1Label")} /><SectionTitle>{t("s1Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("s1Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, marginBottom: 32 }}>
            <FadeIn delay={0.15}>
              <div style={{ background: "#FDEEEB", border: `1px solid ${CORAL}22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: CORAL, marginBottom: 10 }}>{t("s1Bad")}</h4>
                <p style={{ fontSize: 17, fontWeight: 600, color: "#B83A20", marginBottom: 10, fontStyle: "italic" }}>{t("s1BadEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("s1BadWhy")}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={{ background: "#E6F5F0", border: `1px solid #3DA87A22`, borderRadius: 16, padding: "24px 22px", height: "100%" }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10 }}>{t("s1Good")}</h4>
                <p style={{ fontSize: 15, fontWeight: 600, color: "#2A7A5A", marginBottom: 10, lineHeight: 1.5 }}>{t("s1GoodEx")}</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.65, color: MUTED }}>{t("s1GoodWhy")}</p>
              </div>
            </FadeIn>
          </div>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s2")} style={btnPrimary}>{t("s1Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S2: PICO Elements */}
      <section id="s2" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("s2Label")} /><SectionTitle>{t("s2Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("s2Intro")}</Paragraph></FadeIn>
          <div className="pico-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 32 }}>
            <PicoCard letter="P" color={CORAL} title={t("pTitle")} desc={t("pDesc")} example={t("pExample")} tip={t("pTip")} delay={0.1} />
            <PicoCard letter="I" color="#7B68C8" title={t("iTitle")} desc={t("iDesc")} example={t("iExample")} tip={t("iTip")} delay={0.15} />
            <PicoCard letter="C" color="#D4A843" title={t("cTitle")} desc={t("cDesc")} example={t("cExample")} tip={t("cTip")} delay={0.2} />
            <PicoCard letter="O" color="#5B9E5F" title={t("oTitle")} desc={t("oDesc")} example={t("oExample")} tip={t("oTip")} delay={0.25} />
          </div>
          <FadeIn delay={0.3}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s3")} style={btnPrimary}>{t("s2Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S3: PICOS */}
      <section id="s3" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("s3Label")} /><SectionTitle>{t("s3Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 28 }}>{t("s3Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}>
            <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 16, padding: "28px 24px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${TEAL}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: TEAL }}>S</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: DARK }}>{t("sTitle")}</h3>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: MUTED, marginBottom: 16 }}>{t("sDesc")}</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: DARK, marginBottom: 10 }}>{t("sOptions")}</p>
              {[{ text: t("sRCT"), color: "#2A7A5A", bg: "#E6F5F0" }, { text: t("sCohort"), color: "#7B68C8", bg: "#F0EDF8" }, { text: t("sCaseControl"), color: "#D4A843", bg: "#FDF8EC" }, { text: t("sAny"), color: MUTED, bg: "#F5F5F3" }].map((item, i) => (
                <div key={i} style={{ background: item.bg, borderRadius: 8, padding: "8px 14px", marginBottom: 6, fontSize: 13.5, color: item.color, fontWeight: 500, lineHeight: 1.5 }}>{item.text}</div>
              ))}
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div style={{ background: `${TEAL}08`, border: `1px solid ${TEAL}1A`, borderRadius: 14, padding: "16px 20px", marginBottom: 28 }}>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: TEAL }}>💡 {t("s3Tip")}</p>
            </div>
          </FadeIn>
          <FadeIn delay={0.25}><div style={{ textAlign: "center" }}><button onClick={() => scrollTo("s4")} style={btnPrimary}>{t("s3Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S4: Interactive Builder */}
      <section id="s4" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("s4Label")} /><SectionTitle>{t("s4Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("s4Intro")}</Paragraph></FadeIn>
          <FadeIn delay={0.15}><PicoBuilder t={t} /></FadeIn>
          <FadeIn delay={0.2}><div style={{ textAlign: "center", marginTop: 28 }}><button onClick={() => scrollTo("s5")} style={btnPrimary}>{t("s4Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* S5: Common Mistakes */}
      <section id="s5" style={{ padding: "80px 24px", background: "#F1F0EC" }}>
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("s5Label")} /><SectionTitle>{t("s5Title")}</SectionTitle></FadeIn>
          <FadeIn delay={0.1}><Paragraph style={{ marginBottom: 32 }}>{t("s5Intro")}</Paragraph></FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
            {[1, 2, 3, 4, 5].map(n => (
              <TrapCard key={n} number={n} title={t(`trap${n}Title`)} bad={t(`trap${n}Bad`)} good={t(`trap${n}Good`)} delay={n * 0.05} />
            ))}
          </div>
          <FadeIn delay={0.35}><div style={{ textAlign: "center", marginTop: 32 }}><button onClick={() => scrollTo("game")} style={{ ...btnPrimary, background: CORAL, boxShadow: `0 4px 20px ${CORAL}33` }}>{t("s5Next")}</button></div></FadeIn>
        </div>
      </section>

      {/* GAME */}
      <section id="game" style={{ padding: "80px 24px", background: LIGHT_BG }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <FadeIn><SectionLabel text={t("gameLabel")} /></FadeIn>
          <FadeIn delay={0.1}><DragonEggGame t={t} /></FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG }}>
        <p style={{ fontSize: 13, color: "#B0AFAA", lineHeight: 1.8 }}>Meta-Analysis 101 — Advanced Course 1: PICO/PICOS</p>
        <div style={{ marginTop: 12, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>統合分析 101</div>
      </footer>
    </div>
  );
}
