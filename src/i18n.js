import { createContext, useContext, useState, useCallback } from "react";

const translations = {
  zh: {
    // Nav
    navTitle: "Meta分析",
    navTitleSuffix: "101",
    navWhat: "概念",
    navWhy: "意义",
    navDemo: "演示",
    navHow: "方法",
    navPlots: "图表",
    navQuiz: "测验",
    langSwitch: "EN",

    // Hero
    heroBadge: "初学者指南",
    heroTitle1: "到底什么是",
    heroTitle2: "Meta分析",
    heroTitle3: "？",
    heroDesc: "想象一下，阅读某个主题的每一项研究，然后用数学方法将它们组合起来找到真正的答案。这就是Meta分析——比你想象的要简单得多。",
    heroBtn: "开始学习 →",

    // What section
    whatLabel: "基础知识",
    whatTitle: "Meta分析是什么？",
    whatIntro: "想象一下：你想知道一种新药是否有效。你找到了20项研究——有的说有效，有的说无效，有的说可能有效。与其只挑选你最喜欢的那一项，Meta分析会将全部20项结果进行数学组合，得出一个更可靠的答案。就像向20位专家提问，然后计算群体共识，给予最有把握的专家更大的权重。",
    whatCard1Title: "这是数学，不是观点",
    whatCard1Text: "与作者用自己的话进行总结的传统文献综述不同，Meta分析使用统计公式来计算精确的合并结果。",
    whatCard2Title: "并非所有研究都平等",
    whatCard2Text: "更大、更精确的研究拥有更多影响力。一项纳入1000名患者的研究比仅有20名患者的研究更有分量——就像你更信任样本量更大的民意调查一样。",
    whatCard3Title: "更大过程的一部分",
    whatCard3Text: "Meta分析存在于「系统综述」之中——这是一个用于查找、评估和合并某个问题所有相关研究的结构化过程。",
    whatAnalogyTitle: "餐厅评价类比",
    whatAnalogyText: "你会只根据一条评价来选餐厅吗？大概不会——你会阅读很多评价，形成一个整体印象。但你会更看重去过5次的人的评价，而不是只路过的人。Meta分析对科学研究所做的正是如此：阅读所有研究，按质量和规模加权，然后给你最终结论。",

    // Why section
    whyLabel: "研究意义",
    whyTitle: "为什么要做Meta分析？",
    whyIntro: "单个研究就像拼图碎片——本身很有价值，但你需要把它们放在一起才能理解全貌。",
    whyCard1Title: "更强的统计效力",
    whyCard1Text: "小型研究往往无法检测到真实效果。通过汇集数据，Meta分析实现了相当于更大研究的统计效力——有时达数万名参与者。",
    whyCard2Title: "解决分歧",
    whyCard2Text: "当研究A说「是」而研究B说「否」时，Meta分析提供了公平的、数学化的仲裁，而不是选择性引用。",
    whyCard3Title: "发现隐藏模式",
    whyCard3Text: "通过亚组分析，你可以发现一种治疗对老年患者有效但对年轻患者无效——这是单个研究可能无法揭示的。",
    whyCard4Title: "影响真实决策",
    whyCard4Text: "Meta分析位于证据金字塔的顶端。政府、医院和指南委员会依靠它们来制定治疗和政策决策。",
    whyCard5Title: "揭露缺失证据",
    whyCard5Text: "漏斗图等工具可以揭示阴性结果的研究是否未被发表——这种现象称为发表偏倚。",
    whyCard6Title: "指引未来研究",
    whyCard6Text: "通过揭示我们已知和未知的内容，Meta分析突出研究空白，指导最需要新研究的方向。",

    // Combiner
    combinerLabel: "实际演示",
    combinerTitle: "观看研究如何合并",
    combinerDesc: "这个交互演示展示了Meta分析的工作原理。五项研究各有不同结果——点击「合并」查看按样本量加权如何产生一个更可信的答案。",
    combinerScattered: "五项研究，五个不同答案",
    combinerCombining: "正在合并证据……",
    combinerCombined: "合并后的估计值",
    combinerScatteredDesc: "每个圆点是一项研究。它们结果不一——你信任哪一个？",
    combinerCombiningDesc: "按样本量加权以找出真实信号……",
    combinerCombinedDesc: (pooled) => `合并效应值：${pooled}——较大的研究将估计值拉向小的正效应`,
    combinerNegative: "← 负效应",
    combinerPositive: "正效应 →",
    combinerNoEffect: "无效应",
    combinerCombineBtn: "合并研究 →",
    combinerResetBtn: "↺ 重置",

    // Study descriptions
    studyADesc: "小型随机对照试验——发现中等正效应",
    studyBDesc: "大型试验——发现几乎无效应",
    studyCDesc: "小型研究——发现强效应",
    studyDDesc: "最大型试验——发现小的正效应",
    studyEDesc: "中型研究——发现中等效应",

    // How section
    howLabel: "分步指南",
    howTitle: "如何进行Meta分析",
    howDesc: "这是一个结构化的8步流程。点击每个步骤展开详情，查看生动的类比帮助理解。",
    howNote: "基于PRISMA 2020指南和已建立的方法学框架",
    howThinkOfIt: "💡 可以这样理解：",

    step1Title: "确定研究问题",
    step1Analogy: "就像在去买菜之前先确定你要做什么菜。",
    step1Detail1: "使用PICO等结构化框架：人群(Population)、干预(Intervention)、对照(Comparison)、结局(Outcome)。",
    step1Detail2: "你的问题决定了一切——纳入哪些研究、提取哪些数据，以及如何分析。",
    step1Detail3: "确保你的主题上有足够的研究来支持定量合成。",
    step1Detail4: "在开始之前，撰写详细的计划书并进行注册（如在PROSPERO上注册）。",

    step2Title: "系统检索文献",
    step2Analogy: "就像在多个海域撒下大网，确保不漏掉任何一条鱼。",
    step2Detail1: "检索多个数据库：PubMed、Embase、Cochrane图书馆以及其他与你领域相关的数据库。",
    step2Detail2: "使用精心构建的关键词组合和布尔运算符（AND、OR、NOT）。",
    step2Detail3: "不要忘记「灰色文献」——学位论文、会议摘要、预印本——以减少偏倚。",
    step2Detail4: "仔细记录每次检索。你需要在PRISMA流程图中报告这些。",

    step3Title: "筛选和选择研究",
    step3Analogy: "就像从捕获的鱼中挑选出符合你需要的那些。",
    step3Detail1: "将预定义的纳入排除标准应用于找到的每项研究。",
    step3Detail2: "至少两名审稿人应独立筛选标题、摘要，然后是全文。",
    step3Detail3: "使用参考文献管理工具（EndNote、Mendeley）和筛选软件（Rayyan、Covidence）。",
    step3Detail4: "准确记录每项被排除研究的原因——透明度至关重要。",

    step4Title: "评估质量和偏倚风险",
    step4Analogy: "就像在烹饪前检查每种食材的新鲜度和质量。",
    step4Detail1: "使用经过验证的工具：Cochrane偏倚风险工具用于RCT，Newcastle-Ottawa量表用于观察性研究。",
    step4Detail2: "评估随机化、盲法、数据不完整和选择性报告等方面。",
    step4Detail3: "低质量研究可能扭曲整体结果——你可能需要进行排除它们的敏感性分析。",
    step4Detail4: "两名独立审稿人应评估质量，并有解决分歧的程序。",

    step5Title: "提取数据和计算效应量",
    step5Analogy: "就像在加入锅中之前精确测量每种配料。",
    step5Detail1: "使用标准化表格记录样本量、均值、标准差和事件数。",
    step5Detail2: "选择效应量指标：二分类结局用比值比(OR)，连续性指标用均数差(MD)。",
    step5Detail3: "每项研究被编码为一个数字（效应量）加上一个精确度度量。",
    step5Detail4: "仔细核实提取的数据——即使已发表的Meta分析也被发现存在错误。",

    step6Title: "合并结果和分析",
    step6Analogy: "就像将所有精确测量的配料混合在一起，看看做出了什么菜。",
    step6Detail1: "选择模型：固定效应（假设存在一个真实效应）vs 随机效应（假设效应在研究间变化）。",
    step6Detail2: "每项研究按精确度加权——更大、更精确的研究有更多影响力。",
    step6Detail3: "用I²评估异质性：低于25%为低，25-50%为中等，高于50%为高。",
    step6Detail4: "如果异质性高，通过亚组分析或Meta回归探索原因。",

    step7Title: "检查发表偏倚",
    step7Analogy: "就像确保你的菜谱书没有缺页——尤其是那些失败菜谱的页面。",
    step7Detail1: "制作漏斗图：研究效应值 vs 精确度。对称性表明无偏倚。",
    step7Detail2: "使用Egger检验或Begg检验来统计量化潜在偏倚。",
    step7Detail3: "剪补法可以估计可能「缺失」了多少研究并调整结果。",
    step7Detail4: "请记住：漏斗图不对称也可能反映真正的异质性，而不仅仅是偏倚。",

    step8Title: "报告研究结果",
    step8Analogy: "就像写下菜谱，让任何人都能精确地重现你的菜肴。",
    step8Detail1: "遵循PRISMA 2020指南——一份涵盖综述各个方面的27项清单。",
    step8Detail2: "包含PRISMA流程图，显示找到、筛选和纳入了多少研究。",
    step8Detail3: "在森林图中展示所有关键统计数据：效应量、置信区间、I²、P值。",
    step8Detail4: "公开讨论局限性：纳入研究的质量、潜在偏倚和可推广性。",

    // Forest plot
    forestLabel: "关键可视化",
    forestTitle: "如何阅读森林图",
    forestDesc: "森林图是Meta分析的标志性可视化工具。每个元素都有其含义——点击下方不同部分了解它们代表什么。",
    forestNote: "在这个例子中，研究正在测试一种治疗是否能减少不良结局。左侧的值表示治疗有效。",
    forestClickHint: "👆 点击下方的方块、线段、中心线或菱形",
    forestFavorsTreatment: "← 有利于治疗",
    forestFavorsControl: "有利于对照 →",
    forestOverall: "总体",
    forestSquareTitle: "研究效应值（方块）",
    forestSquareText: "每个方块代表一项研究的结果。其大小反映该研究的权重——更大的方块意味着样本量更大、更精确的研究，对最终结果贡献更大。",
    forestLineTitle: "置信区间（线段）",
    forestLineText: "水平线段显示合理值的范围。线段越短=精确度越高。如果它穿过中心线，则该结果本身在统计学上不显著。",
    forestCenterTitle: "无效线",
    forestCenterText: "这条竖线代表零效应——两组之间没有差异。左侧的研究有利于治疗组；右侧的研究有利于对照组。",
    forestDiamondTitle: "合并估计值（菱形）",
    forestDiamondText: "菱形是所有研究的合并结果。其宽度显示置信区间。如果整个菱形位于中心线的一侧，则总体效应在统计学上是显著的。",

    // Glossary
    glossaryEffectSize: "效应量",
    glossaryEffectSizeDef: "衡量两组之间差异大小的数字。常见类型：比值比、风险比和标准化均数差。",
    glossaryCI: "置信区间",
    glossaryCIDef: "真实效应可能落入的范围。95%CI意味着我们有95%的把握认为真实答案在这个范围内。",
    glossaryI2: "I²（异质性）",
    glossaryI2Def: "研究间变异中有多少百分比是真实的（而非随机噪声）。低于25%=低，高于75%=非常高。",
    glossaryFunnel: "漏斗图",
    glossaryFunnelDef: "用于检查发表偏倚的散点图。研究应对称分布——如果不对称，可能有缺失的结果。",
    glossaryFixedRandom: "固定效应 vs 随机效应",
    glossaryFixedRandomDef: "固定效应假设存在一个真实效应。随机效应假设效应在研究间变化。随机效应更常用，也更保守。",
    glossaryPRISMA: "PRISMA",
    glossaryPRISMADef: "确保你的Meta分析透明、可重复和完整的27项报告清单。于2020年更新。",

    // Quiz
    quizLabel: "自测",
    quizTitle: "快速知识检验",
    quizDesc: "五个问题，看看你学到了多少。别担心——你随时可以回到上面重新学习！",
    quizQuestion: "问题",
    quizOf: "/",
    quizCorrectMark: "✓ 正确！",
    quizWrongMark: "✗ 不太对。",
    quizNextBtn: "下一题 →",
    quizResultsBtn: "查看结果 →",
    quizPerfect: "满分！",
    quizWellDone: "做得好！",
    quizKeepLearning: "继续学习！",
    quizCorrectCount: (score, total, pct) => `${score} / ${total} 正确 (${pct}%)`,
    quizPerfectMsg: "你已经掌握了Meta分析的基础知识！",
    quizRetryMsg: "向上滚动复习相关内容，然后再试一次。",
    quizTryAgain: "再试一次",

    quizQ1: "Meta分析的主要目的是什么？",
    quizQ1A: "进行一项新实验",
    quizQ1B: "统计合并多项研究的结果",
    quizQ1C: "替代系统综述",
    quizQ1D: "采访研究人员了解他们的发现",
    quizQ1Exp: "Meta分析使用统计技术将多项独立研究的结果合并为一个更精确的估计值。",

    quizQ2: "在森林图中，更大的方块表示什么？",
    quizQ2A: "更近期的研究",
    quizQ2B: "效应量更大的研究",
    quizQ2C: "权重更大（精确度更高）的研究",
    quizQ2D: "来自更知名期刊的研究",
    quizQ2Exp: "每个方块的大小与研究的权重成正比。更大、更精确的研究获得更大的方块，因为它们对合并结果贡献更大。",

    quizQ3: "I²在Meta分析中衡量什么？",
    quizQ3A: "纳入研究的总数",
    quizQ3B: "异质性导致的变异百分比",
    quizQ3C: "每项研究的质量评分",
    quizQ3D: "最早研究的发表日期",
    quizQ3Exp: "I²量化研究间变异中有多少百分比是由真实差异（异质性）而非随机机会造成的。超过50%的值表明存在实质性异质性。",

    quizQ4: "对称的漏斗图表明：",
    quizQ4A: "存在高发表偏倚",
    quizQ4B: "所有研究发现了相同的结果",
    quizQ4C: "发表偏倚风险低",
    quizQ4D: "Meta分析存在错误",
    quizQ4Exp: "当研究围绕合并效应值对称分布时，形成倒漏斗形——表明不太可能因发表偏倚而「缺失」研究。",

    quizQ5: "PRISMA代表什么？",
    quizQ5A: "科学与医学分析的主要报告项目",
    quizQ5B: "系统综述和Meta分析的首选报告项目",
    quizQ5C: "统计Meta分析的研究方案",
    quizQ5D: "综合医学文章中的已发表结果",
    quizQ5Exp: "PRISMA提供了一份标准化的27项清单和流程图，帮助研究者透明地报告其系统综述的方法学。",

    // Footer
    footerText: "内容综合自领先的方法学指南，包括PRISMA 2020、Cochrane手册和经过同行评审的Meta分析教程。本站为面向初学者的教育资源。",
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
