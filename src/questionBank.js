// ============================================================
// questionBank.js — Centralized Question Bank for All Courses
// ============================================================
// Structure: Each course has its own export with questions grouped
// by category. Each question is self-contained with bilingual text.
//
// Usage in component:
//   import { course1Questions, pickQuestions } from './questionBank';
//   const questions = pickQuestions(course1Questions, 7); // 7 random Qs
//   // or filter by category first:
//   const catQs = course1Questions.filter(q => q.category === 0);
//
// Adding a new course:
//   1. Add a new exported array (e.g., course2Questions)
//   2. Follow the same { id, category, zh: {...}, en: {...}, correct } shape
// ============================================================

// ── Helper: pick N random questions from a pool ──
export function pickQuestions(pool, n) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

// Pick N questions with balanced category coverage
// Tries to pick evenly from each category, then fills remaining randomly
export function pickBalanced(pool, n, numCategories = 7) {
  const byCategory = {};
  pool.forEach(q => {
    if (!byCategory[q.category]) byCategory[q.category] = [];
    byCategory[q.category].push(q);
  });

  // Shuffle within each category
  Object.values(byCategory).forEach(arr => arr.sort(() => Math.random() - 0.5));

  const picked = [];
  let round = 0;
  while (picked.length < n) {
    let addedThisRound = false;
    for (let cat = 0; cat < numCategories && picked.length < n; cat++) {
      if (byCategory[cat] && byCategory[cat][round]) {
        picked.push(byCategory[cat][round]);
        addedThisRound = true;
      }
    }
    if (!addedThisRound) break;
    round++;
  }

  // Final shuffle so categories aren't in order
  return picked.sort(() => Math.random() - 0.5);
}


// ============================================================
// COURSE 1: PICO / PICOS — 70 Questions (10 per category)
// ============================================================
// 7 categories (matching 7 egg colors):
//   0 = Identifying correct PICO format       (翠牙龍 Rex)
//   1 = Population — specificity & scope       (蒼瀾龍 Azure)
//   2 = Intervention — defining the treatment  (金翼龍 Zephyr)
//   3 = Comparison — choosing comparators      (焰角龍 Blaze)
//   4 = Outcome — measurable endpoints         (紫棘龍 Thistle)
//   5 = PICOS & Study design                   (珀爪龍 Velo)
//   6 = Common mistakes & pitfalls             (鐵穹龍 Dome)
// ============================================================

export const course1Categories = {
  zh: ["辨識 PICO 格式", "族群 (P)", "介入措施 (I)", "對照組 (C)", "結果指標 (O)", "PICOS 與研究設計 (S)", "常見錯誤與陷阱"],
  en: ["Identifying PICO Format", "Population (P)", "Intervention (I)", "Comparison (C)", "Outcome (O)", "PICOS & Study Design (S)", "Common Mistakes & Pitfalls"],
};

export const course1Questions = [

  // ════════════════════════════════════════
  // Category 0: Identifying correct PICO format (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-001", category: 0,
    zh: {
      q: "以下哪個是正確的 PICO 格式研究問題？",
      opts: ["糖尿病藥物有效嗎？", "在第二型糖尿病成人中，Metformin 相比安慰劑能否降低 HbA1c？", "Metformin 是最好的藥嗎？", "糖尿病患者應該吃什麼藥？"],
      exp: "選項 B 清楚包含了 P（第二型糖尿病成人）、I（Metformin）、C（安慰劑）和 O（HbA1c 降低），是標準的 PICO 格式。",
    },
    en: {
      q: "Which is a properly formatted PICO research question?",
      opts: ["Do diabetes drugs work?", "In adults with T2DM, does Metformin vs placebo reduce HbA1c?", "Is Metformin the best drug?", "What should diabetes patients take?"],
      exp: "Option B clearly contains P (adults with T2DM), I (Metformin), C (placebo), and O (HbA1c reduction) — a standard PICO format.",
    },
    correct: 1,
  },
  {
    id: "c1-002", category: 0,
    zh: {
      q: "哪一個研究問題最符合 PICO 框架？",
      opts: ["Statin 類藥物安全嗎？", "在高血脂成人中，Atorvastatin 40mg 相比 Rosuvastatin 20mg 在 12 週後降低 LDL-C 的效果如何？", "膽固醇藥有哪些副作用？", "高血脂要不要吃藥？"],
      exp: "選項 B 明確定義了 P（高血脂成人）、I（Atorvastatin 40mg）、C（Rosuvastatin 20mg）、O（12 週後 LDL-C 變化），完整且具體。",
    },
    en: {
      q: "Which research question best follows the PICO framework?",
      opts: ["Are statins safe?", "In adults with hyperlipidemia, does Atorvastatin 40mg vs Rosuvastatin 20mg reduce LDL-C at 12 weeks?", "What are the side effects of cholesterol drugs?", "Should people with high cholesterol take medication?"],
      exp: "Option B clearly defines P (adults with hyperlipidemia), I (Atorvastatin 40mg), C (Rosuvastatin 20mg), O (LDL-C change at 12 weeks).",
    },
    correct: 1,
  },
  {
    id: "c1-003", category: 0,
    zh: {
      q: "以下哪個問題缺少 PICO 的關鍵元素？",
      opts: ["在 COPD 患者中，Tiotropium 相比 Salmeterol 降低急性惡化的頻率如何？", "抗生素能治肺炎嗎？", "在社區型肺炎成人中，Amoxicillin 相比 Azithromycin 的臨床治癒率有何差異？", "在氣喘兒童中，ICS 相比 LTRA 對 FEV1 的改善效果如何？"],
      exp: "「抗生素能治肺炎嗎？」沒有明確的 P（哪種肺炎？哪些病人？）、沒有具體的 I（哪種抗生素？）、沒有 C、O 也不具體。",
    },
    en: {
      q: "Which question is missing key PICO elements?",
      opts: ["In COPD patients, does Tiotropium vs Salmeterol reduce exacerbation frequency?", "Can antibiotics treat pneumonia?", "In adults with CAP, does Amoxicillin vs Azithromycin differ in clinical cure rate?", "In children with asthma, does ICS vs LTRA improve FEV1?"],
      exp: "'Can antibiotics treat pneumonia?' lacks a specific P (which pneumonia? which patients?), specific I (which antibiotic?), C, and measurable O.",
    },
    correct: 1,
  },
  {
    id: "c1-004", category: 0,
    zh: {
      q: "下列哪個研究問題的 PICO 四要素最完整？",
      opts: ["免疫療法對癌症有用嗎？", "運動對老年人有什麼好處？", "在 65 歲以上社區老年人中，每週 3 次有氧運動相比常規活動，6 個月後跌倒發生率是否降低？", "新冠疫苗有效嗎？"],
      exp: "選項 C 精確定義了 P（65 歲以上社區老年人）、I（每週 3 次有氧運動）、C（常規活動）、O（6 個月後跌倒發生率）。",
    },
    en: {
      q: "Which research question has the most complete PICO elements?",
      opts: ["Does immunotherapy work for cancer?", "What are the benefits of exercise for elderly?", "In community-dwelling adults ≥65y, does aerobic exercise 3x/week vs usual activity reduce fall incidence at 6 months?", "Are COVID vaccines effective?"],
      exp: "Option C precisely defines P (community-dwelling adults ≥65y), I (aerobic exercise 3x/week), C (usual activity), O (fall incidence at 6 months).",
    },
    correct: 2,
  },
  {
    id: "c1-005", category: 0,
    zh: {
      q: "以下哪個問題的格式最適合進行系統性回顧？",
      opts: ["降血壓藥物的最新進展是什麼？", "在未控制的高血壓成人中，ARB 相比 ACEi 在 24 週後降低收縮壓的幅度有何差異？", "高血壓患者吃什麼藥比較好？", "哪種降壓藥副作用最少？"],
      exp: "選項 B 有明確的 PICO：P（未控制的高血壓成人）、I（ARB）、C（ACEi）、O（24 週後收縮壓變化），適合作為系統性回顧的問題。",
    },
    en: {
      q: "Which question format is most suitable for a systematic review?",
      opts: ["What are the latest advances in antihypertensives?", "In adults with uncontrolled HTN, do ARBs vs ACEi differ in SBP reduction at 24 weeks?", "Which BP medication is better?", "Which antihypertensive has the fewest side effects?"],
      exp: "Option B has clear PICO: P (adults with uncontrolled HTN), I (ARB), C (ACEi), O (SBP change at 24 weeks) — suitable for systematic review.",
    },
    correct: 1,
  },
  {
    id: "c1-006", category: 0,
    zh: {
      q: "下列哪個問題有完整的 PICO 但研究範圍可能太窄？",
      opts: ["藥物治療對癌症有效嗎？", "在台大醫院 2023 年收治的 HFrEF 成人中，Dapagliflozin 相比安慰劑降低住院率如何？", "在 HFrEF 成人中，SGLT2i 相比安慰劑降低住院率如何？", "心臟衰竭要怎麼治？"],
      exp: "選項 B 雖然 PICO 完整，但限定「台大醫院 2023 年」使得搜尋範圍過窄，幾乎無法找到足夠研究做統合分析。",
    },
    en: {
      q: "Which question has complete PICO but may be too narrow?",
      opts: ["Does drug therapy work for cancer?", "In HFrEF adults admitted to NTUH in 2023, does Dapagliflozin vs placebo reduce hospitalization?", "In HFrEF adults, does SGLT2i vs placebo reduce hospitalization?", "How do we treat heart failure?"],
      exp: "Option B has full PICO but restricting to one hospital in one year makes it too narrow for a meta-analysis.",
    },
    correct: 1,
  },
  {
    id: "c1-007", category: 0,
    zh: {
      q: "哪一個研究問題最能幫助你制定搜尋策略？",
      opts: ["Warfarin 好不好用？", "血栓治療有什麼新進展？", "在非瓣膜性心房顫動成人中，DOAC 相比 Warfarin 對中風和重大出血發生率的影響如何？", "抗凝血劑的種類有哪些？"],
      exp: "選項 C 的 PICO 明確，每個元素都可以直接轉換為搜尋關鍵詞：P→AF, I→DOAC, C→Warfarin, O→stroke/bleeding。",
    },
    en: {
      q: "Which research question best supports developing a search strategy?",
      opts: ["Is Warfarin any good?", "What's new in thrombosis treatment?", "In adults with non-valvular AF, do DOACs vs Warfarin differ in stroke and major bleeding rates?", "What types of anticoagulants exist?"],
      exp: "Option C has clear PICO that directly maps to search terms: P→AF, I→DOAC, C→Warfarin, O→stroke/bleeding.",
    },
    correct: 2,
  },
  {
    id: "c1-008", category: 0,
    zh: {
      q: "以下哪個問題雖然看起來像 PICO 格式，但 Outcome 不夠具體？",
      opts: ["在 T2DM 成人中，GLP-1 RA 相比安慰劑改善血糖控制的效果如何？", "在 T2DM 成人中，Semaglutide 相比安慰劑在 26 週後降低 HbA1c 的幅度？", "在高血壓成人中，Amlodipine 相比安慰劑在 12 週後降低 SBP 的幅度？", "在 CKD 成人中，Finerenone 相比安慰劑在 2 年後的 eGFR 斜率變化？"],
      exp: "「改善血糖控制」太籠統——是 HbA1c？空腹血糖？餐後血糖？什麼時間點？其他選項都有具體量測指標和時間點。",
    },
    en: {
      q: "Which question looks like PICO but has an insufficiently specific Outcome?",
      opts: ["In T2DM adults, does GLP-1 RA vs placebo improve glycemic control?", "In T2DM adults, does Semaglutide vs placebo reduce HbA1c at 26 weeks?", "In HTN adults, does Amlodipine vs placebo reduce SBP at 12 weeks?", "In CKD adults, does Finerenone vs placebo change eGFR slope at 2 years?"],
      exp: "'Improve glycemic control' is vague — HbA1c? fasting glucose? postprandial? what timepoint? The other options specify exact measures and timepoints.",
    },
    correct: 0,
  },
  {
    id: "c1-009", category: 0,
    zh: {
      q: "在以下研究問題中，哪個的 I 和 C 定義最不清楚？",
      opts: ["在重症成人中，延長輸注 (≥3h) 相比 30 分鐘 bolus β-lactam 對院內死亡率的影響？", "在 COPD 患者中，新型藥物相比傳統藥物對急性惡化頻率的影響？", "在 HFrEF 成人中，Dapagliflozin 10mg 相比安慰劑對心血管死亡的影響？", "在 MDD 患者中，Escitalopram 10-20mg 相比安慰劑對 HAM-D 分數的影響？"],
      exp: "「新型藥物」和「傳統藥物」都沒有具體指明是哪些藥，無法據此制定搜尋策略或篩選文獻。",
    },
    en: {
      q: "Which question has the least clear I and C definitions?",
      opts: ["In critically ill adults, prolonged (≥3h) vs 30-min bolus β-lactam on in-hospital mortality?", "In COPD patients, novel drugs vs traditional drugs on exacerbation frequency?", "In HFrEF adults, Dapagliflozin 10mg vs placebo on CV death?", "In MDD patients, Escitalopram 10-20mg vs placebo on HAM-D scores?"],
      exp: "'Novel drugs' and 'traditional drugs' don't specify which drugs — you can't build a search strategy or screen studies from this.",
    },
    correct: 1,
  },
  {
    id: "c1-010", category: 0,
    zh: {
      q: "你的同事問你：「我想研究維生素 D 對骨質疏鬆的效果」。為了轉化為 PICO，你最先建議他釐清什麼？",
      opts: ["該用哪個統計軟體", "P、I、C、O 各自的具體定義——哪些病人、什麼劑量、跟什麼比較、量什麼指標", "要發表在哪個期刊", "要引用多少篇文獻"],
      exp: "將模糊的臨床問題轉化為 PICO 的第一步就是具體化每個元素，才能進行有效的文獻搜尋。",
    },
    en: {
      q: "A colleague says: 'I want to study vitamin D for osteoporosis.' To convert this to PICO, what should they clarify first?",
      opts: ["Which statistical software to use", "Specific definitions for P, I, C, O — which patients, what dose, compared to what, measuring what", "Which journal to submit to", "How many references to cite"],
      exp: "The first step in converting a vague clinical question to PICO is specifying each element for effective literature searching.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 1: Population (P) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-011", category: 1,
    zh: {
      q: "你正在研究「延長輸注 β-lactam 抗生素對重症患者的效果」。以下哪個 Population 定義最恰當？",
      opts: ["所有接受抗生素的患者", "加護病房中接受 β-lactam 抗生素治療的重症成人患者", "住院的患者", "有感染症狀的人"],
      exp: "選項 B 精確定義了場域（ICU）、藥物類別（β-lactam）、嚴重度（重症）和年齡（成人）。其他選項太廣泛。",
    },
    en: {
      q: "For 'prolonged β-lactam infusion in critically ill patients,' which Population is most appropriate?",
      opts: ["All patients receiving antibiotics", "Critically ill adults in ICU receiving β-lactam antibiotics", "Hospitalized patients", "People with infection symptoms"],
      exp: "Option B precisely defines setting (ICU), drug class (β-lactam), severity (critically ill), and age (adults). Others are too broad.",
    },
    correct: 1,
  },
  {
    id: "c1-012", category: 1,
    zh: {
      q: "研究「SGLT2 抑制劑對心衰竭的效果」，以下哪個 P 定義最恰當？",
      opts: ["所有心臟病患者", "射出分率降低的心衰竭 (HFrEF) 成年患者，NYHA class II-IV", "有心血管風險因子的人", "65歲以上老年人"],
      exp: "HFrEF + NYHA class 精確限定了心衰竭類型和嚴重度分級，避免納入不相關的心臟病患者。",
    },
    en: {
      q: "For 'SGLT2 inhibitors in heart failure,' which P is most appropriate?",
      opts: ["All heart disease patients", "Adults with HFrEF, NYHA class II-IV", "People with cardiovascular risk factors", "Adults over 65"],
      exp: "HFrEF + NYHA class precisely limits the HF type and severity, avoiding irrelevant cardiac patients.",
    },
    correct: 1,
  },
  {
    id: "c1-013", category: 1,
    zh: {
      q: "以下哪個 Population 定義過於廣泛，不適合做統合分析？",
      opts: ["第二型糖尿病且 HbA1c > 7% 的成人", "所有患者", "中度至重度阿茲海默症的老年患者 (≥60歲)", "12-17 歲診斷為注意力不足過動症的青少年"],
      exp: "「所有患者」沒有指定任何疾病、年齡或特徵，導致搜尋結果過多且研究之間異質性極大。",
    },
    en: {
      q: "Which Population definition is too broad for a meta-analysis?",
      opts: ["Adults with T2DM and HbA1c > 7%", "All patients", "Elderly (≥60y) with moderate-to-severe Alzheimer's", "Adolescents 12-17y diagnosed with ADHD"],
      exp: "'All patients' specifies no disease, age, or characteristics, yielding excessive, heterogeneous results.",
    },
    correct: 1,
  },
  {
    id: "c1-014", category: 1,
    zh: {
      q: "在研究「Finerenone 對慢性腎臟病的效果」時，以下哪個 P 最合適？",
      opts: ["所有腎臟病患者", "有蛋白尿的人", "合併第二型糖尿病的 CKD 成人，eGFR 25-90 且 UACR ≥ 30 mg/g", "洗腎患者"],
      exp: "選項 C 精確限定了 CKD 合併 T2DM、具體 eGFR 和 UACR 範圍，與 FIDELIO/FIGARO 試驗的納入條件一致。",
    },
    en: {
      q: "For 'Finerenone in CKD,' which Population is most appropriate?",
      opts: ["All kidney disease patients", "People with proteinuria", "Adults with CKD and T2DM, eGFR 25-90, UACR ≥ 30 mg/g", "Dialysis patients"],
      exp: "Option C precisely limits to CKD with T2DM, specific eGFR and UACR ranges, matching FIDELIO/FIGARO trial criteria.",
    },
    correct: 2,
  },
  {
    id: "c1-015", category: 1,
    zh: {
      q: "在定義 Population 時，以下哪個做法是正確的？",
      opts: ["越廣泛越好，這樣能找到更多研究", "應指定疾病、年齡、嚴重度等關鍵特徵", "不需要考慮排除條件", "只需要寫疾病名稱即可"],
      exp: "好的 P 應該明確指定關鍵特徵，讓搜尋結果聚焦且研究之間具有可比性。太廣泛會增加異質性。",
    },
    en: {
      q: "Which approach to defining Population is correct?",
      opts: ["Broader is better — you'll find more studies", "Specify key characteristics: disease, age, severity", "Exclusion criteria aren't needed", "Just the disease name is sufficient"],
      exp: "A good P specifies key characteristics for focused, comparable results. Too broad increases heterogeneity.",
    },
    correct: 1,
  },
  {
    id: "c1-016", category: 1,
    zh: {
      q: "你想做一個關於「抗凝血劑預防中風」的統合分析。以下哪個 P 最適合？",
      opts: ["所有中風患者", "有中風風險的人", "非瓣膜性心房顫動 (NVAF) 且 CHA₂DS₂-VASc ≥ 2 的成人", "心律不整患者"],
      exp: "選項 C 精確限定了心房顫動類型（非瓣膜性）和中風風險（CHA₂DS₂-VASc 分數），確保研究之間的可比性。",
    },
    en: {
      q: "For a meta-analysis on 'anticoagulants for stroke prevention,' which P is best?",
      opts: ["All stroke patients", "People at risk of stroke", "Adults with NVAF and CHA₂DS₂-VASc ≥ 2", "Patients with arrhythmia"],
      exp: "Option C specifies AF type (non-valvular) and stroke risk score (CHA₂DS₂-VASc), ensuring comparability across studies.",
    },
    correct: 2,
  },
  {
    id: "c1-017", category: 1,
    zh: {
      q: "以下哪個 P 定義包含了適當的排除條件？",
      opts: ["所有糖尿病患者", "T2DM 成人，排除 eGFR < 30、懷孕及正在接受胰島素治療者", "糖尿病且身體不好的人", "住院的糖尿病患者"],
      exp: "選項 B 不僅定義了納入條件（T2DM 成人），還明確列出排除條件（腎功能不全、懷孕、已用胰島素），確保族群同質性。",
    },
    en: {
      q: "Which P definition includes appropriate exclusion criteria?",
      opts: ["All diabetes patients", "Adults with T2DM, excluding eGFR < 30, pregnancy, and current insulin use", "Diabetes patients who are unwell", "Hospitalized diabetes patients"],
      exp: "Option B defines inclusion (T2DM adults) AND exclusion criteria (renal impairment, pregnancy, insulin use), ensuring homogeneity.",
    },
    correct: 1,
  },
  {
    id: "c1-018", category: 1,
    zh: {
      q: "為什麼在 P 中指定「成人」或「兒童」很重要？",
      opts: ["只是格式要求，沒有實質意義", "因為兒童和成人的藥物動力學、劑量和結局可能不同，混合會增加異質性", "因為期刊審稿要求", "為了讓字數更多"],
      exp: "兒童和成人在藥物代謝、適應症、劑量和預後方面往往不同，混合分析會增加異質性並使結果難以解讀。",
    },
    en: {
      q: "Why is specifying 'adults' or 'children' important in P?",
      opts: ["Just a formatting requirement", "Because children and adults differ in pharmacokinetics, dosing, and outcomes — mixing increases heterogeneity", "Journal reviewers require it", "To increase word count"],
      exp: "Children and adults often differ in drug metabolism, indications, dosing, and prognosis. Mixing them increases heterogeneity.",
    },
    correct: 1,
  },
  {
    id: "c1-019", category: 1,
    zh: {
      q: "你想研究「PPI 對胃食道逆流的效果」。以下哪個 P 在廣度與精確度之間取得最好的平衡？",
      opts: ["所有消化道疾病患者", "有症狀的胃食道逆流疾病 (GERD) 成人（非手術候選人）", "胃不舒服的人", "確診有食道糜爛的 GERD 患者"],
      exp: "選項 B 限定了疾病（GERD）、症狀（有症狀的）、年齡（成人）和排除（非手術），夠精確但不至於太窄。",
    },
    en: {
      q: "For 'PPIs for GERD,' which P best balances breadth and precision?",
      opts: ["All GI disease patients", "Symptomatic adults with GERD (non-surgical candidates)", "People with stomach discomfort", "GERD patients with confirmed erosive esophagitis"],
      exp: "Option B specifies disease (GERD), symptoms (symptomatic), age (adults), and exclusion (non-surgical) — precise but not too narrow.",
    },
    correct: 1,
  },
  {
    id: "c1-020", category: 1,
    zh: {
      q: "研究「Palbociclib 對乳癌的效果」，以下哪個 P 最精確？",
      opts: ["所有乳癌患者", "所有女性癌症患者", "HR+/HER2− 晚期或轉移性乳癌的停經後女性", "接受化療的乳癌患者"],
      exp: "選項 C 限定了生物標記（HR+/HER2−）、疾病階段（晚期/轉移性）和族群特徵（停經後），與 PALOMA 試驗的納入條件一致。",
    },
    en: {
      q: "For 'Palbociclib in breast cancer,' which P is most precise?",
      opts: ["All breast cancer patients", "All female cancer patients", "Postmenopausal women with HR+/HER2− advanced or metastatic breast cancer", "Breast cancer patients receiving chemotherapy"],
      exp: "Option C specifies biomarkers (HR+/HER2−), stage (advanced/metastatic), and demographics (postmenopausal), matching PALOMA trial criteria.",
    },
    correct: 2,
  },

  // ════════════════════════════════════════
  // Category 2: Intervention (I) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-021", category: 2,
    zh: {
      q: "研究延長輸注 β-lactam 抗生素的效果，以下哪個 I 定義最精確？",
      opts: ["抗生素治療", "延長輸注 (≥3小時持續輸注或間歇延長輸注)", "高劑量抗生素", "持續靜脈輸注"],
      exp: "選項 B 明確定義了給藥方式（≥3 小時持續或間歇延長輸注），比其他選項更精確、可重複驗證。",
    },
    en: {
      q: "For prolonged β-lactam infusion, which Intervention definition is most precise?",
      opts: ["Antibiotic therapy", "Prolonged infusion (≥3h continuous or extended intermittent infusion)", "High-dose antibiotics", "Continuous IV infusion"],
      exp: "Option B clearly defines the administration method (≥3h continuous or extended intermittent), more precise and reproducible.",
    },
    correct: 1,
  },
  {
    id: "c1-022", category: 2,
    zh: {
      q: "以下哪個 Intervention 定義最具體？",
      opts: ["給予降血糖藥物", "Empagliflozin 10mg 每日一次，合併標準治療", "使用新型藥物", "口服藥物治療"],
      exp: "選項 B 包含了藥名、劑量、頻率及合併治療，是最完整的介入措施定義。",
    },
    en: {
      q: "Which Intervention definition is most specific?",
      opts: ["Give glucose-lowering drugs", "Empagliflozin 10mg once daily plus standard therapy", "Use novel agents", "Oral medication therapy"],
      exp: "Option B includes drug name, dose, frequency, and concomitant therapy — the most complete intervention definition.",
    },
    correct: 1,
  },
  {
    id: "c1-023", category: 2,
    zh: {
      q: "在定義 Intervention 時，以下哪個資訊最不需要？",
      opts: ["藥物名稱和劑量", "給藥途徑和頻率", "藥物的發明歷史", "治療持續時間"],
      exp: "藥物的發明歷史與臨床問題無關。I 應包含藥名、劑量、途徑、頻率和持續時間等臨床相關資訊。",
    },
    en: {
      q: "When defining Intervention, which information is least necessary?",
      opts: ["Drug name and dose", "Route and frequency of administration", "History of the drug's invention", "Duration of treatment"],
      exp: "The drug's invention history is clinically irrelevant. I should include name, dose, route, frequency, and duration.",
    },
    correct: 2,
  },
  {
    id: "c1-024", category: 2,
    zh: {
      q: "研究 CBT 治療憂鬱症，以下哪個 I 定義最合適？",
      opts: ["心理治療", "認知行為治療 (CBT)，每週 1 次，持續 12-16 週", "諮商", "CBT 加上藥物"],
      exp: "選項 B 明確指定了治療類型（CBT）、頻率（每週 1 次）和持續時間（12-16 週），具備可重現性。",
    },
    en: {
      q: "For studying CBT in depression, which Intervention is most appropriate?",
      opts: ["Psychotherapy", "CBT, weekly sessions for 12-16 weeks", "Counseling", "CBT plus medication"],
      exp: "Option B specifies the therapy type (CBT), frequency (weekly), and duration (12-16 weeks) for reproducibility.",
    },
    correct: 1,
  },
  {
    id: "c1-025", category: 2,
    zh: {
      q: "以下哪個情境中，I 和 C 可以是同一種藥物？",
      opts: ["比較兩種完全不同的藥物", "比較同一藥物的高劑量 vs 低劑量", "比較藥物 vs 安慰劑", "比較藥物 vs 不治療"],
      exp: "同一藥物的不同劑量比較（如 Atorvastatin 80mg vs 20mg）是合法的 PICO，I 和 C 可以是同一種藥物。",
    },
    en: {
      q: "In which scenario can I and C be the same drug?",
      opts: ["Comparing two completely different drugs", "Comparing high-dose vs low-dose of the same drug", "Comparing drug vs placebo", "Comparing drug vs no treatment"],
      exp: "Dose comparison (e.g., Atorvastatin 80mg vs 20mg) is a valid PICO where I and C are the same drug.",
    },
    correct: 1,
  },
  {
    id: "c1-026", category: 2,
    zh: {
      q: "研究「GLP-1 受體促效劑對體重的效果」，以下哪個 I 最合適？",
      opts: ["減重藥物", "Semaglutide 2.4mg 每週一次皮下注射，持續 68 週", "GLP-1 類藥物", "注射型降血糖藥"],
      exp: "選項 B 指明了藥名、劑量、頻率、給藥途徑和持續時間，是最可操作的介入定義。",
    },
    en: {
      q: "For 'GLP-1 RA on body weight,' which I is most appropriate?",
      opts: ["Weight-loss drugs", "Semaglutide 2.4mg subcutaneous injection weekly for 68 weeks", "GLP-1 class drugs", "Injectable glucose-lowering agents"],
      exp: "Option B specifies drug name, dose, frequency, route, and duration — the most actionable intervention definition.",
    },
    correct: 1,
  },
  {
    id: "c1-027", category: 2,
    zh: {
      q: "以下哪個 I 定義的問題在於「太廣泛」？",
      opts: ["Metformin 500mg BID", "降血糖藥物", "Liraglutide 1.8mg 每日皮下注射", "Dapagliflozin 10mg QD 加上標準治療"],
      exp: "「降血糖藥物」涵蓋了數十種不同機制的藥物（Metformin、SU、DPP-4i、SGLT2i、GLP-1 RA 等），太廣泛無法搜尋。",
    },
    en: {
      q: "Which Intervention definition is problematic because it's too broad?",
      opts: ["Metformin 500mg BID", "Glucose-lowering drugs", "Liraglutide 1.8mg daily SC injection", "Dapagliflozin 10mg QD plus standard therapy"],
      exp: "'Glucose-lowering drugs' covers dozens of different drug classes (Metformin, SU, DPP-4i, SGLT2i, GLP-1 RA, etc.) — far too broad for searching.",
    },
    correct: 1,
  },
  {
    id: "c1-028", category: 2,
    zh: {
      q: "非藥物介入也可以作為 PICO 的 I。以下哪個非藥物 I 定義最好？",
      opts: ["運動", "多動一點", "結構化有氧運動計畫：每週 3 次、每次 45 分鐘中等強度、持續 12 週", "健康的生活方式"],
      exp: "選項 C 明確定義了運動類型、頻率、強度、持續時間，是可重複的非藥物介入定義。",
    },
    en: {
      q: "Non-drug interventions can also be PICO's I. Which is best defined?",
      opts: ["Exercise", "Move more", "Structured aerobic exercise: 3x/week, 45 min moderate intensity, for 12 weeks", "Healthy lifestyle"],
      exp: "Option C specifies exercise type, frequency, intensity, and duration — a reproducible non-drug intervention definition.",
    },
    correct: 2,
  },
  {
    id: "c1-029", category: 2,
    zh: {
      q: "當 I 是複合介入（如藥物＋衛教），你應該怎麼在 PICO 中處理？",
      opts: ["只寫其中一個，太複雜的話省略另一個", "明確列出所有介入組成要素及其執行細節", "不需要寫得太詳細", "把不同介入分開做成兩個不同的 PICO"],
      exp: "複合介入應完整描述所有組成要素。讀者需要知道「藥物＋衛教」的具體內容才能重複驗證或搜尋相關文獻。",
    },
    en: {
      q: "When I is a complex intervention (e.g., drug + education), how should you handle it in PICO?",
      opts: ["Only write one component, omit the other", "Clearly list all intervention components and their implementation details", "Don't need too much detail", "Split into two separate PICOs"],
      exp: "Complex interventions should fully describe all components. Readers need specifics to replicate or search for related literature.",
    },
    correct: 1,
  },
  {
    id: "c1-030", category: 2,
    zh: {
      q: "以下哪個 I 定義犯了「混淆介入與結果」的錯誤？",
      opts: ["Dapagliflozin 10mg QD", "降低血壓的治療", "Amlodipine 5mg QD", "CBT 每週 1 次持續 16 週"],
      exp: "「降低血壓的治療」把想要達成的結果（降低血壓）混進了介入定義中。I 應該描述你做什麼，而不是你希望達到什麼。",
    },
    en: {
      q: "Which I definition makes the mistake of 'confusing intervention with outcome'?",
      opts: ["Dapagliflozin 10mg QD", "Blood pressure-lowering treatment", "Amlodipine 5mg QD", "CBT weekly for 16 weeks"],
      exp: "'Blood pressure-lowering treatment' embeds the desired outcome (lowering BP) into the intervention. I should describe what you DO, not what you hope to ACHIEVE.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 3: Comparison (C) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-031", category: 3,
    zh: {
      q: "在 PICO 中，「C」代表什麼？為什麼它很重要？",
      opts: ["Conclusion（結論）— 統合分析的最終結果", "Comparison（對照組）— 沒有對照就無法判斷因果關係", "Category（分類）— 用來分類不同的研究", "Criteria（標準）— 納入研究的條件"],
      exp: "C 是 Comparison（對照組），它是因果推論的核心。沒有明確的對照組，你無法判斷效果是真實的還是自然發生的。",
    },
    en: {
      q: "What does 'C' in PICO stand for, and why is it important?",
      opts: ["Conclusion — the final result", "Comparison — without it, you can't establish causation", "Category — used to classify studies", "Criteria — conditions for inclusion"],
      exp: "C stands for Comparison. It's the core of causal inference. Without a comparator, you can't tell if the effect is real or natural.",
    },
    correct: 1,
  },
  {
    id: "c1-032", category: 3,
    zh: {
      q: "研究延長輸注抗生素的效果，以下哪個 C 最合適？",
      opts: ["口服抗生素", "不使用抗生素", "傳統間歇輸注 (30分鐘 bolus)", "其他類型抗生素"],
      exp: "既然 I 是延長輸注，最直接的對照就是傳統給藥方式（30 分鐘 bolus），這樣才能比較給藥時間的影響。",
    },
    en: {
      q: "For studying prolonged antibiotic infusion, which Comparison is most appropriate?",
      opts: ["Oral antibiotics", "No antibiotics", "Conventional intermittent infusion (30-min bolus)", "Different antibiotic class"],
      exp: "Since I is prolonged infusion, the direct comparator is conventional administration (30-min bolus) to isolate the effect of infusion time.",
    },
    correct: 2,
  },
  {
    id: "c1-033", category: 3,
    zh: {
      q: "以下哪種對照組設計會讓研究結果最難解讀？",
      opts: ["安慰劑對照", "積極藥物對照 (active comparator)", "標準治療對照", "不設定任何對照組"],
      exp: "完全沒有對照組就無法判斷療效是來自介入措施、安慰劑效應，還是疾病的自然進程。",
    },
    en: {
      q: "Which comparator design makes results hardest to interpret?",
      opts: ["Placebo control", "Active drug comparator", "Standard-of-care control", "No comparator at all"],
      exp: "Without any comparator, you can't distinguish treatment effect from placebo effect or natural disease progression.",
    },
    correct: 3,
  },
  {
    id: "c1-034", category: 3,
    zh: {
      q: "研究 SGLT2 抑制劑治療心衰竭，以下哪個 C 設計最常見？",
      opts: ["不治療", "其他心衰竭藥物", "安慰劑加上標準治療", "健康對照組"],
      exp: "「安慰劑＋標準治療」是心衰竭試驗中最常用的對照設計，既符合倫理（不剝奪標準治療），又能評估新藥的額外效果。",
    },
    en: {
      q: "For SGLT2 inhibitors in HF, which is the most common Comparison design?",
      opts: ["No treatment", "Other HF drugs", "Placebo plus standard therapy", "Healthy controls"],
      exp: "'Placebo + standard therapy' is most common in HF trials — it's ethical (doesn't withhold care) and isolates the added benefit.",
    },
    correct: 2,
  },
  {
    id: "c1-035", category: 3,
    zh: {
      q: "什麼時候選擇「積極對照」(active comparator) 比安慰劑對照更合適？",
      opts: ["當研究經費不足時", "當已有公認有效的標準治療，使用安慰劑不符合倫理時", "當研究者想讓結果看起來更好時", "當樣本量太小時"],
      exp: "如果已有公認有效治療（如抗生素治療細菌性腦膜炎），使用安慰劑會剝奪病人有效治療，不符合倫理。此時應用積極對照。",
    },
    en: {
      q: "When is an active comparator more appropriate than placebo?",
      opts: ["When funding is limited", "When an established effective treatment exists, making placebo unethical", "When researchers want better-looking results", "When sample size is too small"],
      exp: "If an established treatment exists (e.g., antibiotics for bacterial meningitis), using placebo denies effective care — unethical. Use an active comparator.",
    },
    correct: 1,
  },
  {
    id: "c1-036", category: 3,
    zh: {
      q: "以下哪個 C 的定義最有問題？",
      opts: ["安慰劑（外觀與介入組相同的惰性膠囊）", "常規照護", "沒有", "Metformin 500mg BID"],
      exp: "「沒有」不是一個有效的對照。即使是觀察「不做任何事」的效果，也應該說明是「等待名單對照」或「不額外介入的標準照護」。",
    },
    en: {
      q: "Which C definition is most problematic?",
      opts: ["Placebo (inert capsule matching intervention appearance)", "Usual care", "None", "Metformin 500mg BID"],
      exp: "'None' is not a valid comparator. Even if studying 'no intervention,' specify 'wait-list control' or 'standard care without added intervention.'",
    },
    correct: 2,
  },
  {
    id: "c1-037", category: 3,
    zh: {
      q: "在統合分析中，如果不同研究用了不同的對照組（有的用安慰劑、有的用積極對照），應該怎麼處理？",
      opts: ["全部混在一起分析沒關係", "應做次群組分析，分別分析安慰劑對照和積極對照的研究", "只選其中一種對照的研究", "放棄這個統合分析"],
      exp: "不同對照組會影響效果估計值。分成次群組分析可以避免因混合不同對照而引入偏差。",
    },
    en: {
      q: "In a meta-analysis, if studies used different comparators (some placebo, some active), what should you do?",
      opts: ["Mix them all together — it's fine", "Conduct subgroup analyses separating placebo-controlled and active-controlled studies", "Only include one type of comparator", "Abandon the meta-analysis"],
      exp: "Different comparators affect effect estimates. Subgroup analysis avoids bias from mixing different control conditions.",
    },
    correct: 1,
  },
  {
    id: "c1-038", category: 3,
    zh: {
      q: "為什麼「標準治療」(standard of care) 作為 C 時需要特別定義？",
      opts: ["因為標準治療在不同國家、不同時期可能不同，需要說明具體內容", "不需要定義，大家都知道", "因為標準治療永遠不變", "只有在 RCT 中才需要定義"],
      exp: "「標準治療」可能因國家、年代、指引版本而異。必須說明包含哪些具體藥物或措施，否則不同研究之間無法比較。",
    },
    en: {
      q: "Why does 'standard of care' as C need specific definition?",
      opts: ["Because standard care varies by country and era — specify the exact components", "No need to define, everyone knows", "Because standard care never changes", "Only needed in RCTs"],
      exp: "'Standard of care' varies by country, era, and guidelines. Must specify exact drugs/measures, otherwise studies aren't comparable.",
    },
    correct: 0,
  },
  {
    id: "c1-039", category: 3,
    zh: {
      q: "在非劣性試驗 (non-inferiority trial) 中，C 通常是什麼？",
      opts: ["安慰劑", "積極對照（目前公認的最佳治療）", "不治療", "歷史對照"],
      exp: "非劣性試驗的目的是證明新療法「不比現有最佳療法差」，因此 C 必須是目前的標準治療或最佳可用療法。",
    },
    en: {
      q: "In a non-inferiority trial, what is C usually?",
      opts: ["Placebo", "Active comparator (current best treatment)", "No treatment", "Historical control"],
      exp: "Non-inferiority trials aim to show the new therapy is 'no worse than' the current best. C must be the standard or best available treatment.",
    },
    correct: 1,
  },
  {
    id: "c1-040", category: 3,
    zh: {
      q: "以下哪個情境選擇安慰劑作為 C 是合理的？",
      opts: ["研究新抗生素治療嚴重肺炎（已有有效抗生素）", "研究新止癢藥治療輕度濕疹（目前無公認標準治療）", "研究新化療藥治療晚期癌症（已有一線化療方案）", "研究新抗癲癇藥（患者正在發作中）"],
      exp: "當目前沒有公認的標準治療時，使用安慰劑在倫理上是可接受的。對於有有效治療的嚴重疾病，安慰劑對照不合倫理。",
    },
    en: {
      q: "In which scenario is placebo as C ethically appropriate?",
      opts: ["New antibiotic for severe pneumonia (effective antibiotics exist)", "New anti-itch drug for mild eczema (no established standard treatment)", "New chemo for advanced cancer (first-line chemo exists)", "New antiepileptic (patient actively seizing)"],
      exp: "When no established standard treatment exists, placebo is ethically acceptable. For serious diseases with effective treatments, placebo control is unethical.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 4: Outcome (O) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-041", category: 4,
    zh: {
      q: "你想研究「SGLT2 抑制劑對心衰竭患者的效果」。以下哪個 Outcome 定義最合適？",
      opts: ["病人有沒有好轉", "心血管死亡或心衰竭住院的複合終點", "所有不良事件", "醫生的主觀評估"],
      exp: "選項 B 是一個具體、可量測的複合終點，常用於心衰竭臨床試驗（如 DAPA-HF, EMPEROR-Reduced）。",
    },
    en: {
      q: "For 'SGLT2 inhibitors in heart failure,' which Outcome is most appropriate?",
      opts: ["Whether patients got better", "Composite of CV death or HF hospitalization", "All adverse events", "Physician's subjective assessment"],
      exp: "Option B is a specific, measurable composite endpoint used in major HF trials (DAPA-HF, EMPEROR-Reduced).",
    },
    correct: 1,
  },
  {
    id: "c1-042", category: 4,
    zh: {
      q: "研究延長輸注抗生素的效果，以下哪個 O 最合適？",
      opts: ["主要：院內死亡率；次要：臨床治癒率、ICU 住院天數", "抗生素的副作用", "細菌培養結果", "病人有沒有出院"],
      exp: "選項 A 有分主要和次要結局指標，且都是具體、可量測的臨床終點。",
    },
    en: {
      q: "For studying prolonged antibiotic infusion, which Outcome is most appropriate?",
      opts: ["Primary: in-hospital mortality; Secondary: clinical cure rate, ICU LOS", "Antibiotic side effects", "Bacterial culture results", "Whether patients were discharged"],
      exp: "Option A distinguishes primary and secondary outcomes, all specific and measurable clinical endpoints.",
    },
    correct: 0,
  },
  {
    id: "c1-043", category: 4,
    zh: {
      q: "以下哪個是良好 Outcome 定義的特徵？",
      opts: ["越模糊越好，這樣更有彈性", "需要具體、可量測，且指定時間點", "只需要寫「有效」或「無效」", "不需要區分主要和次要結局"],
      exp: "好的 O 必須具體（用什麼工具量？）、可量測（數值變化？事件發生率？）、有時間點（治療後多久？）。",
    },
    en: {
      q: "Which is a characteristic of a good Outcome definition?",
      opts: ["Vaguer is better for flexibility", "Specific, measurable, and with a defined timepoint", "Just say 'effective' or 'ineffective'", "No need to distinguish primary and secondary outcomes"],
      exp: "Good O must be specific (what tool?), measurable (numeric change? event rate?), and time-bound (how long after treatment?).",
    },
    correct: 1,
  },
  {
    id: "c1-044", category: 4,
    zh: {
      q: "研究 CBT 治療重度憂鬱症，以下哪個 O 最合適？",
      opts: ["病人感覺有沒有好一點", "主要：憂鬱量表分數變化 (PHQ-9 或 HAM-D)；次要：緩解率、復發率", "回診率", "治療師的評估"],
      exp: "使用標準化量表（PHQ-9/HAM-D）評估憂鬱嚴重度變化，並區分主次要指標，是最嚴謹的做法。",
    },
    en: {
      q: "For CBT in major depression, which Outcome is most appropriate?",
      opts: ["Whether patients feel better", "Primary: depression score change (PHQ-9/HAM-D); Secondary: remission rate, relapse rate", "Follow-up visit rate", "Therapist's assessment"],
      exp: "Standardized scales (PHQ-9/HAM-D) with primary/secondary distinction is the most rigorous approach.",
    },
    correct: 1,
  },
  {
    id: "c1-045", category: 4,
    zh: {
      q: "為什麼「複合終點」(composite endpoint) 在臨床試驗中常被使用？",
      opts: ["因為比較容易造假", "因為可以增加事件發生率，提高統計檢定力", "因為比較簡單不需要收集太多資料", "因為審查委員會要求"],
      exp: "複合終點（如心血管死亡＋住院）將多個相關事件合併計算，增加事件數，讓研究在較小樣本中也能達到統計顯著性。",
    },
    en: {
      q: "Why are composite endpoints commonly used in clinical trials?",
      opts: ["They're easier to manipulate", "They increase event rates, improving statistical power", "They're simpler and require less data", "Regulatory committees require them"],
      exp: "Composites (e.g., CV death + hospitalization) combine related events, increasing event rates so trials can achieve significance with smaller samples.",
    },
    correct: 1,
  },
  {
    id: "c1-046", category: 4,
    zh: {
      q: "「替代終點」(surrogate endpoint) 和「臨床終點」(clinical endpoint) 有什麼不同？",
      opts: ["沒有不同，只是不同名稱", "替代終點是生物標記（如 HbA1c），臨床終點是病人實際感受到的（如死亡、住院）", "臨床終點比較容易量測", "替代終點更可靠"],
      exp: "替代終點（如 HbA1c、LDL-C）是間接指標，臨床終點（如心肌梗塞、死亡）才直接反映對病人的影響。替代終點不一定能預測臨床結果。",
    },
    en: {
      q: "What's the difference between surrogate and clinical endpoints?",
      opts: ["No difference, just different names", "Surrogate = biomarkers (e.g., HbA1c); Clinical = patient-relevant (e.g., death, hospitalization)", "Clinical endpoints are easier to measure", "Surrogate endpoints are more reliable"],
      exp: "Surrogates (HbA1c, LDL-C) are indirect markers; clinical endpoints (MI, death) directly reflect patient impact. Surrogates don't always predict clinical outcomes.",
    },
    correct: 1,
  },
  {
    id: "c1-047", category: 4,
    zh: {
      q: "以下哪個 O 是「患者報告結局」(PRO, patient-reported outcome)？",
      opts: ["eGFR 斜率", "KCCQ 生活品質問卷分數", "白血球計數", "X 光影像變化"],
      exp: "KCCQ（Kansas City Cardiomyopathy Questionnaire）是由病人自己填寫的量表，屬於患者報告結局。其他都是實驗室或影像指標。",
    },
    en: {
      q: "Which O is a patient-reported outcome (PRO)?",
      opts: ["eGFR slope", "KCCQ quality-of-life questionnaire score", "White blood cell count", "Chest X-ray changes"],
      exp: "KCCQ (Kansas City Cardiomyopathy Questionnaire) is completed by patients — it's a PRO. Others are lab or imaging measures.",
    },
    correct: 1,
  },
  {
    id: "c1-048", category: 4,
    zh: {
      q: "為什麼 Outcome 應該指定量測的時間點？",
      opts: ["只是格式要求", "因為效果可能隨時間改變，不同時間點的結果可能不同", "為了讓文章看起來更專業", "不需要指定，隨時量都一樣"],
      exp: "藥物效果可能隨時間變化（如短期有效但長期無效），不同時間點的結果可能差異很大。明確時間點確保研究可比較。",
    },
    en: {
      q: "Why should Outcome specify a measurement timepoint?",
      opts: ["Just a formatting requirement", "Because effects may change over time — results at different timepoints can differ", "To make the paper look professional", "Not needed, results are the same anytime"],
      exp: "Drug effects may vary over time (e.g., short-term benefit but long-term null). Specifying timepoints ensures comparability across studies.",
    },
    correct: 1,
  },
  {
    id: "c1-049", category: 4,
    zh: {
      q: "在 CKD 研究中，以下哪個 Outcome 指標反映長期腎功能變化最適合？",
      opts: ["單次 eGFR 數值", "eGFR 斜率（月 3-4 起算以避免血流動力學效應干擾）", "尿液顏色", "腎臟超音波大小"],
      exp: "eGFR 斜率可以反映腎功能隨時間的變化趨勢，從月 3-4 起算避免了初始血流動力學效應（如 SGLT2i 的急性 eGFR 下降）的干擾。",
    },
    en: {
      q: "In CKD studies, which O best reflects long-term kidney function change?",
      opts: ["Single eGFR value", "eGFR slope (starting month 3-4 to avoid hemodynamic dip confounding)", "Urine color", "Kidney ultrasound size"],
      exp: "eGFR slope reflects kidney function trajectory over time. Starting at month 3-4 avoids the initial hemodynamic dip (e.g., acute eGFR drop with SGLT2i).",
    },
    correct: 1,
  },
  {
    id: "c1-050", category: 4,
    zh: {
      q: "以下哪一組主要和次要結局的設定最合理？",
      opts: ["主要：所有不良事件；次要：死亡率", "主要：死亡率；次要：不良事件、住院天數、生活品質", "主要：住院天數、死亡率、不良事件、費用、滿意度（全部列為主要）", "主要：無；次要：死亡率"],
      exp: "主要結局應該是最重要的單一或複合指標（如死亡率），次要結局補充其他面向。列太多主要結局會增加多重比較的問題。",
    },
    en: {
      q: "Which primary/secondary outcome setup is most reasonable?",
      opts: ["Primary: all adverse events; Secondary: mortality", "Primary: mortality; Secondary: adverse events, LOS, quality of life", "Primary: LOS, mortality, AEs, cost, satisfaction (all primary)", "Primary: none; Secondary: mortality"],
      exp: "Primary should be the single most important endpoint (e.g., mortality); secondaries cover other dimensions. Too many primaries = multiplicity issues.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 5: PICOS & Study Design (S) (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-051", category: 5,
    zh: {
      q: "PICOS 中的 S 代表什麼？什麼時候需要加上它？",
      opts: ["Sample size（樣本量）— 當你想限制研究大小時", "Study design（研究設計）— 當你想限定納入的研究類型時", "Statistics（統計方法）— 當你想指定分析方法時", "Setting（場域）— 當你想限制研究地點時"],
      exp: "S 是 Study design。加上 S 可以幫你限定只看 RCT、或只看世代研究等。",
    },
    en: {
      q: "What does S in PICOS stand for?",
      opts: ["Sample size", "Study design — to specify which study types to include", "Statistics", "Setting"],
      exp: "S = Study design. It lets you restrict to RCTs only, cohort studies, etc.",
    },
    correct: 1,
  },
  {
    id: "c1-052", category: 5,
    zh: {
      q: "如果你的統合分析只想納入隨機對照試驗 (RCT)，應該在 PICOS 的哪個部分說明？",
      opts: ["P — 在族群中限定", "I — 在介入措施中加上", "O — 在結果指標中說明", "S — 在研究設計中限定"],
      exp: "研究設計的篩選（如只納入 RCT）應在 S（Study design）中說明，而不是混在其他元素中。",
    },
    en: {
      q: "If your meta-analysis only includes RCTs, where in PICOS should you specify this?",
      opts: ["P — in the Population", "I — in the Intervention", "O — in the Outcome", "S — in the Study design"],
      exp: "Study type restriction (e.g., RCTs only) belongs in S (Study design), not mixed with other elements.",
    },
    correct: 3,
  },
  {
    id: "c1-053", category: 5,
    zh: {
      q: "以下哪種情況最適合使用 PICOS 而非 PICO？",
      opts: ["當你對研究結果不確定時", "當你想區分觀察性研究和 RCT 的證據等級時", "當你不知道要用什麼統計方法時", "當你的研究問題很簡單時"],
      exp: "當你需要根據研究類型（RCT vs 世代研究 vs 病例對照）來分層分析或限定證據等級時，加上 S 特別有幫助。",
    },
    en: {
      q: "When is PICOS most useful compared to PICO?",
      opts: ["When you're unsure about results", "When you want to differentiate evidence levels by study type (RCT vs observational)", "When you don't know which statistics to use", "When your research question is simple"],
      exp: "Adding S helps when you need to stratify by study type (RCT vs cohort vs case-control) or limit evidence levels.",
    },
    correct: 1,
  },
  {
    id: "c1-054", category: 5,
    zh: {
      q: "以下哪個不是常見的研究設計類型？",
      opts: ["隨機對照試驗 (RCT)", "前瞻性世代研究 (Prospective cohort)", "回顧性病例對照研究 (Case-control)", "隨機問卷調查 (Random questionnaire survey)"],
      exp: "「隨機問卷調查」不是標準的流行病學研究設計分類。RCT、世代研究和病例對照研究才是標準類型。",
    },
    en: {
      q: "Which is NOT a standard study design type?",
      opts: ["Randomized controlled trial (RCT)", "Prospective cohort study", "Retrospective case-control study", "Random questionnaire survey"],
      exp: "'Random questionnaire survey' isn't a standard epidemiological study design. RCT, cohort, and case-control are standard types.",
    },
    correct: 3,
  },
  {
    id: "c1-055", category: 5,
    zh: {
      q: "在統合分析中，將 RCT 和觀察性研究混合分析會有什麼問題？",
      opts: ["沒有問題，資料越多越好", "可能引入偏差，因為觀察性研究的證據等級較低且混雜因子較多", "只會影響計算速度", "觀察性研究的結果一定比 RCT 差"],
      exp: "RCT 和觀察性研究的證據等級不同，混合分析可能因觀察性研究的混雜因子而引入偏差。通常建議分開分析或做次群組分析。",
    },
    en: {
      q: "What problem arises from mixing RCTs and observational studies in a meta-analysis?",
      opts: ["No problem — more data is better", "May introduce bias because observational studies have lower evidence and more confounders", "Only affects computation speed", "Observational results are always worse than RCTs"],
      exp: "RCTs and observational studies differ in evidence level. Mixing may introduce confounding bias. Usually analyze separately or as subgroups.",
    },
    correct: 1,
  },
  {
    id: "c1-056", category: 5,
    zh: {
      q: "在證據等級金字塔中，以下哪個設計的證據等級最高？",
      opts: ["專家意見", "病例報告", "隨機對照試驗的統合分析", "單一世代研究"],
      exp: "RCT 的統合分析（系統性回顧與統合分析）位於證據金字塔頂端，因為它綜合了多個高品質 RCT 的結果。",
    },
    en: {
      q: "In the evidence hierarchy pyramid, which design has the highest level of evidence?",
      opts: ["Expert opinion", "Case report", "Meta-analysis of RCTs", "Single cohort study"],
      exp: "Meta-analysis of RCTs sits at the top of the evidence pyramid because it synthesizes results from multiple high-quality RCTs.",
    },
    correct: 2,
  },
  {
    id: "c1-057", category: 5,
    zh: {
      q: "如果你的研究問題找不到足夠的 RCT，以下哪個做法最合理？",
      opts: ["放棄統合分析", "擴大 S 的範圍納入觀察性研究，但在報告中明確標示證據等級", "偽造 RCT 資料", "直接改成寫文獻回顧，不做統合分析"],
      exp: "當 RCT 不足時，可以納入高品質觀察性研究，但必須在報告中說明研究設計的組成並進行敏感度分析。",
    },
    en: {
      q: "If you can't find enough RCTs for your question, what's the most reasonable approach?",
      opts: ["Abandon the meta-analysis", "Expand S to include observational studies, clearly noting evidence levels in the report", "Fabricate RCT data", "Switch to a narrative review instead"],
      exp: "When RCTs are scarce, include high-quality observational studies but clearly state the study design mix and conduct sensitivity analyses.",
    },
    correct: 1,
  },
  {
    id: "c1-058", category: 5,
    zh: {
      q: "Crossover trial（交叉試驗）有什麼特別之處？",
      opts: ["每個受試者同時接受介入和對照", "每個受試者先後接受介入和對照，自己當自己的對照", "只適用於外科手術研究", "不算是 RCT 的一種"],
      exp: "交叉試驗讓每個受試者在不同時期分別接受介入和對照，消除個體間差異。它是 RCT 的一種，但需要考慮洗脫期和順序效應。",
    },
    en: {
      q: "What's special about a crossover trial?",
      opts: ["Each participant receives intervention and control simultaneously", "Each participant receives both in sequence, serving as their own control", "Only for surgical studies", "Not a type of RCT"],
      exp: "Crossover trials let each participant receive both intervention and control in different periods, eliminating inter-individual variability. It's a type of RCT but needs washout periods.",
    },
    correct: 1,
  },
  {
    id: "c1-059", category: 5,
    zh: {
      q: "Pragmatic trial（實用性試驗）和 Explanatory trial（解釋性試驗）在 S 上有什麼不同？",
      opts: ["沒有不同", "Pragmatic trial 在真實臨床環境中進行、納入標準寬鬆；Explanatory trial 在嚴格控制條件下進行", "Pragmatic trial 只用觀察性設計", "Explanatory trial 不需要對照組"],
      exp: "Pragmatic trial 強調外部效度（真實世界適用性），Explanatory trial 強調內部效度（嚴格的因果推論）。選擇哪種取決於你的研究目的。",
    },
    en: {
      q: "How do pragmatic and explanatory trials differ in terms of S?",
      opts: ["No difference", "Pragmatic: real-world setting, broad criteria; Explanatory: tightly controlled conditions", "Pragmatic trials only use observational designs", "Explanatory trials don't need controls"],
      exp: "Pragmatic trials emphasize external validity (real-world applicability); explanatory trials emphasize internal validity (strict causal inference). Choice depends on your research goal.",
    },
    correct: 1,
  },
  {
    id: "c1-060", category: 5,
    zh: {
      q: "以下哪個研究設計最適合研究「罕見藥物不良反應」？",
      opts: ["小型 RCT", "病例對照研究 (case-control study)", "交叉試驗", "單臂試驗"],
      exp: "罕見事件在 RCT 中難以觀察到（樣本量不夠）。病例對照研究從已發生不良反應的病例出發回溯暴露，是研究罕見事件的最佳設計。",
    },
    en: {
      q: "Which study design is best for studying rare adverse drug reactions?",
      opts: ["Small RCT", "Case-control study", "Crossover trial", "Single-arm trial"],
      exp: "Rare events are hard to observe in RCTs (insufficient sample size). Case-control studies start from cases with the adverse event and look back at exposure — best for rare events.",
    },
    correct: 1,
  },

  // ════════════════════════════════════════
  // Category 6: Common Mistakes & Pitfalls (10 Qs)
  // ════════════════════════════════════════
  {
    id: "c1-061", category: 6,
    zh: {
      q: "以下哪個是 PICO 的常見錯誤？",
      opts: ["在 Outcome 中指定具體的量測工具和時間點", "先做初步搜尋確認有足夠的研究再確定 PICO", "把 Population 定義為「所有患者」而不限定具體特徵", "在 Comparison 中同時考慮安慰劑和積極對照組"],
      exp: "把族群定義為「所有患者」太過廣泛，會讓搜尋結果過多且不聚焦。好的 P 應該限定年齡、疾病階段、嚴重度等特徵。",
    },
    en: {
      q: "Which is a common PICO mistake?",
      opts: ["Specifying a concrete measurement tool in Outcome", "Doing a preliminary search before finalizing PICO", "Defining Population as 'all patients' without specifics", "Considering both placebo and active comparators"],
      exp: "'All patients' is too broad. A good P should specify age, disease stage, severity.",
    },
    correct: 2,
  },
  {
    id: "c1-062", category: 6,
    zh: {
      q: "以下關於 PICO 各元素的描述，哪個是正確的？",
      opts: ["P 只需要寫疾病名稱就夠了", "I 和 C 可以是同一種藥物的不同劑量", "O 不需要指定量測的時間點", "C 不是必要的，可以省略"],
      exp: "I 和 C 確實可以是同一種藥物的不同劑量（如高劑量 vs 低劑量）。P 需要更多細節，O 應指定時間點，C 不可省略。",
    },
    en: {
      q: "Which statement about PICO elements is correct?",
      opts: ["P only needs the disease name", "I and C can be different doses of the same drug", "O doesn't need a timepoint", "C is optional"],
      exp: "I and C can indeed be different doses (e.g., high-dose vs low-dose). P needs more detail, O should specify timepoints, and C is essential.",
    },
    correct: 1,
  },
  {
    id: "c1-063", category: 6,
    zh: {
      q: "你的同事提出以下 PICO：「P: 糖尿病患者, I: 飲食控制, C: 無, O: 血糖改善」。這個 PICO 有什麼問題？",
      opts: ["完全沒問題", "每個元素都太模糊 — P 未限定糖尿病類型、I 未定義飲食內容、C 缺失、O 不夠具體", "只有 O 有問題", "只有 P 有問題"],
      exp: "四個元素都需改進：P 應指定糖尿病類型和年齡，I 應定義具體飲食方案，C 不能為空（至少要有常規飲食），O 應寫明量測工具和時間點。",
    },
    en: {
      q: "A colleague proposes: 'P: diabetes patients, I: diet control, C: none, O: blood sugar improvement.' What's wrong?",
      opts: ["Nothing — it's fine", "Every element is too vague — P no DM type, I no diet details, C missing, O not specific", "Only O is problematic", "Only P is problematic"],
      exp: "All four need improvement: P (specify DM type, age), I (specific diet protocol), C (can't be empty — at least usual diet), O (measurement tool and timepoint).",
    },
    correct: 1,
  },
  {
    id: "c1-064", category: 6,
    zh: {
      q: "以下哪個做法會導致統合分析搜尋結果過少？",
      opts: ["使用適當的 MeSH 詞彙", "PICO 定義過於狹窄，例如限定特定品牌、特定醫院、特定年份", "搜尋多個資料庫", "納入不同語言的研究"],
      exp: "PICO 太狹窄（如限定某一家醫院的某一年）會讓可納入的研究極少。需要在精確和可行之間取得平衡。",
    },
    en: {
      q: "Which practice leads to too few search results in a meta-analysis?",
      opts: ["Using appropriate MeSH terms", "Defining PICO too narrowly (e.g., specific brand, hospital, year)", "Searching multiple databases", "Including studies in different languages"],
      exp: "Too-narrow PICO (e.g., one hospital in one year) yields very few eligible studies. Balance precision with feasibility.",
    },
    correct: 1,
  },
  {
    id: "c1-065", category: 6,
    zh: {
      q: "在決定 PICO 之前，為什麼建議先做初步文獻搜尋？",
      opts: ["因為 PICO 不重要，隨便定就好", "為了確認研究領域有足夠的文獻量，並根據現有證據調整 PICO 的範圍", "因為老師要求", "為了抄別人的 PICO"],
      exp: "初步搜尋（scoping search）幫助你了解現有文獻的數量和類型，避免 PICO 定義太廣（上千篇）或太窄（個位數篇）。",
    },
    en: {
      q: "Why is a preliminary search recommended before finalizing PICO?",
      opts: ["PICO doesn't matter, just pick anything", "To confirm sufficient literature exists and calibrate PICO scope based on available evidence", "Because the professor requires it", "To copy someone else's PICO"],
      exp: "A scoping search reveals the volume and type of existing literature, preventing PICO that's too broad (thousands of hits) or too narrow (single digits).",
    },
    correct: 1,
  },
  {
    id: "c1-066", category: 6,
    zh: {
      q: "以下哪個錯誤是「把研究範圍當成 PICO」？",
      opts: ["P: HFrEF 成人, I: Dapagliflozin 10mg, C: 安慰劑, O: CV death", "P: 心臟病, I: 藥物, C: 無, O: 病人好轉", "P: COPD, I: Tiotropium, C: Salmeterol, O: 急性惡化頻率", "P: T2DM 成人 HbA1c>7%, I: Metformin 1000mg BID, C: 安慰劑, O: HbA1c 26 週變化"],
      exp: "選項 B 的每個元素都是研究「範圍」而不是可操作的 PICO：「心臟病」太廣、「藥物」不具體、「無」不是有效對照、「好轉」不可量測。",
    },
    en: {
      q: "Which example shows the mistake of 'treating research scope as PICO'?",
      opts: ["P: HFrEF adults, I: Dapagliflozin 10mg, C: placebo, O: CV death", "P: heart disease, I: drugs, C: none, O: patient improvement", "P: COPD, I: Tiotropium, C: Salmeterol, O: exacerbation frequency", "P: T2DM adults HbA1c>7%, I: Metformin 1000mg BID, C: placebo, O: HbA1c change at 26wk"],
      exp: "Option B uses scope-level terms rather than actionable PICO: 'heart disease' is too broad, 'drugs' is vague, 'none' isn't valid, 'improvement' isn't measurable.",
    },
    correct: 1,
  },
  {
    id: "c1-067", category: 6,
    zh: {
      q: "以下哪個是 PICO 中「Outcome 偏差」的例子？",
      opts: ["在統合分析前就決定好要看的結局指標", "做完分析後，選擇 p 值最顯著的結局指標來報告", "同時報告主要和次要結局", "在 PICO 中明列預期的結局方向"],
      exp: "事後挑選最顯著的結局是「選擇性報告偏差」(selective reporting bias)。正確做法是在研究前就預先決定並註冊主要結局。",
    },
    en: {
      q: "Which is an example of 'outcome bias' in PICO?",
      opts: ["Deciding which outcomes to measure before the analysis", "After analysis, choosing the outcome with the most significant p-value to report", "Reporting both primary and secondary outcomes", "Specifying the expected direction of the outcome in PICO"],
      exp: "Choosing the most significant outcome after analysis is 'selective reporting bias.' The correct approach is pre-specifying and registering primary outcomes.",
    },
    correct: 1,
  },
  {
    id: "c1-068", category: 6,
    zh: {
      q: "你的 PICO 搜尋到 2000 篇文獻。以下哪個調整最合理？",
      opts: ["全部讀完", "縮小 P（更具體的族群）或限定 S（只看 RCT）", "放棄這個題目", "隨機選 20 篇來分析"],
      exp: "搜尋結果太多代表 PICO 可能太廣。縮小族群範圍或限定研究設計可以有效減少數量，同時保持研究品質。",
    },
    en: {
      q: "Your PICO search returns 2000 articles. What's the most reasonable adjustment?",
      opts: ["Read them all", "Narrow P (more specific population) or restrict S (RCTs only)", "Abandon the topic", "Randomly pick 20 to analyze"],
      exp: "Too many results means PICO is likely too broad. Narrowing population or restricting study design effectively reduces volume while maintaining quality.",
    },
    correct: 1,
  },
  {
    id: "c1-069", category: 6,
    zh: {
      q: "以下哪個錯誤是把「P 和 I 搞混了」？",
      opts: ["P: ICU 重症成人, I: Meropenem 延長輸注", "P: 接受 Metformin 治療的 T2DM 患者, I: Metformin", "P: 65 歲以上高血壓成人, I: Amlodipine 5mg", "P: NVAF 成人, I: Rivaroxaban 20mg"],
      exp: "選項 B 把已經在使用 Metformin 的病人定義為 P，又把 Metformin 定義為 I，造成 P 和 I 重疊。P 應該在介入之前就定義好。",
    },
    en: {
      q: "Which example shows the mistake of 'confusing P and I'?",
      opts: ["P: ICU critically ill adults, I: Meropenem prolonged infusion", "P: T2DM patients on Metformin, I: Metformin", "P: Adults ≥65y with HTN, I: Amlodipine 5mg", "P: Adults with NVAF, I: Rivaroxaban 20mg"],
      exp: "Option B defines P as patients already on Metformin, then also defines I as Metformin — P and I overlap. P should be defined before the intervention.",
    },
    correct: 1,
  },
  {
    id: "c1-070", category: 6,
    zh: {
      q: "以下哪個不是修改 PICO 的合理理由？",
      opts: ["初步搜尋發現文獻量太少，需要擴大範圍", "發現原本的 O 在大多數研究中沒有報告，需要換指標", "為了讓結果符合你預期的方向而修改 PICO", "發現某個重要的亞群在初步文獻中反覆出現，需要調整 P"],
      exp: "PICO 的修改應基於客觀的文獻狀況，而不是為了迎合預期結果。為了得到想要的答案而改 PICO 是研究偏差的來源。",
    },
    en: {
      q: "Which is NOT a valid reason to modify PICO?",
      opts: ["Preliminary search found too few studies — need to broaden scope", "Original O wasn't reported in most studies — need different measure", "Changing PICO to make results match your expected direction", "An important subgroup keeps appearing in preliminary literature — need to adjust P"],
      exp: "PICO modifications should be based on objective literature findings, not to match desired results. Changing PICO to get a preferred answer is a source of research bias.",
    },
    correct: 2,
  },
];


// ============================================================
// COURSE 2: Literature Search & PRISMA — 70 Questions (10 per category)
// ============================================================
// 7 categories:
//   0 = Systematic vs casual search
//   1 = Databases (PubMed, Embase, Cochrane, etc.)
//   2 = Boolean operators & search syntax (AND, OR, NOT, MeSH, truncation)
//   3 = PRISMA flow diagram
//   4 = Screening process
//   5 = Grey literature & search completeness
//   6 = Search strategy pitfalls & best practices
// ============================================================

export const course2Categories = {
  zh: ["系統性搜尋 vs 隨意搜尋", "文獻資料庫", "布林邏輯與搜尋語法", "PRISMA 流程圖", "篩選流程", "灰色文獻與搜尋完整性", "搜尋策略陷阱與最佳實踐"],
  en: ["Systematic vs Casual Search", "Databases", "Boolean Operators & Search Syntax", "PRISMA Flow Diagram", "Screening Process", "Grey Literature & Search Completeness", "Search Strategy Pitfalls & Best Practices"],
};

export const course2Questions = [

  // Category 0: Systematic vs casual search (10 Qs)
  { id: "c2-001", category: 0, zh: { q: "系統性文獻搜尋和隨意搜尋最大的差別是什麼？", opts: ["系統性搜尋比較快", "系統性搜尋有預先定義的策略、可重複且透明", "隨意搜尋找到的文獻品質較高", "兩者沒有差別"], exp: "系統性搜尋的核心特徵是：預先定義搜尋策略、方法可重複、過程透明可審查。隨意搜尋則依賴個人經驗，容易遺漏重要文獻。" }, en: { q: "What is the key difference between systematic and casual literature searching?", opts: ["Systematic search is faster", "Systematic search uses a predefined, reproducible, and transparent strategy", "Casual search finds higher quality studies", "There is no difference"], exp: "Systematic searching is defined by: predefined strategy, reproducibility, and transparency. Casual searching relies on personal experience and risks missing key studies." }, correct: 1 },
  { id: "c2-002", category: 0, zh: { q: "為什麼系統性回顧需要記錄完整的搜尋策略？", opts: ["為了讓文章看起來更長", "為了可重複性——讓其他研究者能重現你的搜尋", "因為期刊版面需要", "記錄策略不是必要的"], exp: "完整記錄搜尋策略是系統性回顧的核心要求，確保其他研究者能重現搜尋、驗證結果的完整性。" }, en: { q: "Why must a systematic review document the complete search strategy?", opts: ["To make the paper longer", "For reproducibility — so others can replicate your search", "Journals need to fill pages", "Documenting the strategy isn't required"], exp: "Documenting the full search strategy is a core requirement — it ensures others can replicate the search and verify completeness." }, correct: 1 },
  { id: "c2-003", category: 0, zh: { q: "以下哪個是隨意搜尋（非系統性搜尋）的典型問題？", opts: ["搜尋結果太多", "容易遺漏不支持你假設的研究，導致選擇偏差", "搜尋速度太慢", "找到太多高品質的 RCT"], exp: "隨意搜尋傾向找到支持預設立場的文獻，容易遺漏不利證據，造成選擇偏差。" }, en: { q: "What is a typical problem with casual (non-systematic) searching?", opts: ["Too many results", "Tends to miss studies that don't support your hypothesis, causing selection bias", "Too slow", "Finds too many high-quality RCTs"], exp: "Casual searching tends to find studies supporting preconceptions, missing unfavorable evidence — causing selection bias." }, correct: 1 },
  { id: "c2-004", category: 0, zh: { q: "系統性搜尋策略應該在什麼時候制定？", opts: ["寫完結果之後", "在開始搜尋之前，根據 PICO 預先制定", "在篩選完文獻之後", "隨時都可以，沒有順序"], exp: "搜尋策略應在搜尋前根據 PICO 制定，避免事後調整策略以符合預期結果。" }, en: { q: "When should a systematic search strategy be developed?", opts: ["After writing the results", "Before searching, based on the PICO — ideally pre-registered", "After screening studies", "Anytime, order doesn't matter"], exp: "The strategy should be developed before searching, based on PICO, to prevent post-hoc adjustments." }, correct: 1 },
  { id: "c2-005", category: 0, zh: { q: "以下哪個不是系統性搜尋的特徵？", opts: ["涵蓋多個資料庫", "搜尋策略可重複", "只搜尋支持自己假設的文獻", "記錄完整的搜尋過程"], exp: "系統性搜尋的目標是全面、無偏地找到所有相關文獻，而不是只找支持假設的證據。" }, en: { q: "Which is NOT a characteristic of systematic searching?", opts: ["Covers multiple databases", "Search strategy is reproducible", "Only searches for studies supporting your hypothesis", "Documents the full search process"], exp: "Systematic searching aims to find ALL relevant literature comprehensively and without bias." }, correct: 2 },
  { id: "c2-006", category: 0, zh: { q: "建議在制定搜尋策略時諮詢誰？", opts: ["只需要自己一個人做", "醫學圖書館員或資訊專家", "統計學家", "病人"], exp: "醫學圖書館員/資訊專家熟悉各資料庫的特性、搜尋語法和 MeSH 詞彙，是制定高品質搜尋策略的關鍵夥伴。" }, en: { q: "Who should you consult when developing a search strategy?", opts: ["Just do it alone", "A medical librarian or information specialist", "A statistician", "A patient"], exp: "Medical librarians/information specialists know database features, search syntax, and MeSH terms — key partners for high-quality strategies." }, correct: 1 },
  { id: "c2-007", category: 0, zh: { q: "PROSPERO 是什麼？", opts: ["一個文獻資料庫", "系統性回顧的國際前瞻性註冊平台", "一種統計軟體", "PRISMA 的另一個名字"], exp: "PROSPERO 是系統性回顧的前瞻性註冊平台，在搜尋前註冊你的計畫，增加研究透明度。" }, en: { q: "What is PROSPERO?", opts: ["A literature database", "An international prospective register for systematic reviews", "A statistical software", "Another name for PRISMA"], exp: "PROSPERO is a prospective register for systematic reviews. Registering your protocol before searching increases transparency." }, correct: 1 },
  { id: "c2-008", category: 0, zh: { q: "以下哪個情境最需要系統性搜尋而非隨意搜尋？", opts: ["快速回答同事的臨床問題", "撰寫統合分析以制定臨床指引", "瀏覽最新期刊的目錄", "準備期刊讀書會的報告"], exp: "統合分析和臨床指引的結論會直接影響臨床決策，必須用系統性搜尋確保證據的完整性。" }, en: { q: "Which scenario most requires systematic rather than casual searching?", opts: ["Quickly answering a colleague's clinical question", "Conducting a meta-analysis to inform clinical guidelines", "Browsing the latest journal table of contents", "Preparing a journal club presentation"], exp: "Meta-analyses and clinical guidelines directly impact clinical decisions — systematic searching ensures evidence completeness." }, correct: 1 },
  { id: "c2-009", category: 0, zh: { q: "系統性搜尋的「敏感度」和「精確度」之間通常有什麼關係？", opts: ["敏感度越高，精確度也越高", "兩者互相獨立", "提高敏感度通常會降低精確度——找到更多文獻但不相關的也更多", "精確度永遠比敏感度重要"], exp: "敏感度（找到所有相關文獻）和精確度（減少不相關文獻）通常是此消彼長的。系統性回顧優先追求高敏感度。" }, en: { q: "What is the typical relationship between search sensitivity and precision?", opts: ["Higher sensitivity means higher precision", "They are independent", "Increasing sensitivity usually decreases precision — more results but also more noise", "Precision is always more important"], exp: "Sensitivity (finding all relevant studies) and precision (reducing irrelevant ones) are usually trade-offs. Systematic reviews prioritize high sensitivity." }, correct: 2 },
  { id: "c2-010", category: 0, zh: { q: "為什麼系統性回顧不建議只用 Google Scholar 搜尋？", opts: ["Google Scholar 完全沒有用", "Google Scholar 的搜尋演算法不透明、不可完全重複，且缺乏進階搜尋功能", "Google Scholar 只有英文文獻", "Google Scholar 需要付費"], exp: "Google Scholar 的排序演算法不透明，搜尋結果不完全可重複，缺乏 MeSH 等控制詞彙。可作為補充但不能作為唯一來源。" }, en: { q: "Why shouldn't systematic reviews rely solely on Google Scholar?", opts: ["Google Scholar is completely useless", "Its algorithm is opaque, results aren't fully reproducible, and it lacks advanced search features", "It only has English literature", "It requires payment"], exp: "Google Scholar's ranking algorithm is opaque, results aren't fully reproducible, and it lacks controlled vocabularies like MeSH. Useful as supplement, not sole source." }, correct: 1 },

  // Category 1: Databases (10 Qs)
  { id: "c2-011", category: 1, zh: { q: "系統性文獻回顧中，Cochrane 建議至少搜尋幾個資料庫？", opts: ["1 個就夠了", "至少 2 個（如 MEDLINE + Embase）", "至少 5 個", "所有存在的資料庫"], exp: "Cochrane Handbook 建議至少搜尋 MEDLINE 和 Embase，再根據主題加上其他資料庫。" }, en: { q: "How many databases does Cochrane recommend searching at minimum?", opts: ["1 is enough", "At least 2 (e.g., MEDLINE + Embase)", "At least 5", "Every database that exists"], exp: "Cochrane Handbook recommends at least MEDLINE and Embase, plus topic-specific databases as needed." }, correct: 1 },
  { id: "c2-012", category: 1, zh: { q: "PubMed 和 MEDLINE 有什麼關係？", opts: ["完全相同的東西", "PubMed 包含 MEDLINE 加上額外的文獻（如預印本、尚未被索引的文獻）", "MEDLINE 比 PubMed 更大", "兩者完全不同"], exp: "PubMed 是免費搜尋介面，包含 MEDLINE（經 MeSH 索引的文獻）加上尚未索引的新文獻和其他來源。" }, en: { q: "What is the relationship between PubMed and MEDLINE?", opts: ["Exactly the same thing", "PubMed includes MEDLINE plus additional records (ahead-of-print, not-yet-indexed)", "MEDLINE is larger than PubMed", "Completely different with no overlap"], exp: "PubMed is a free search interface containing MEDLINE (MeSH-indexed records) plus additional not-yet-indexed records." }, correct: 1 },
  { id: "c2-013", category: 1, zh: { q: "Embase 相比 PubMed 的主要優勢是什麼？", opts: ["Embase 完全免費", "Embase 對歐洲文獻和藥物/藥理學主題的涵蓋範圍更廣", "Embase 只有英文文獻", "Embase 比 PubMed 更容易使用"], exp: "Embase 涵蓋更多歐洲期刊，且對藥物、藥理學主題的索引特別強。但通常需要付費訂閱。" }, en: { q: "What is Embase's main advantage over PubMed?", opts: ["Embase is completely free", "Broader coverage of European literature and pharmacology/drug topics", "Embase only has English literature", "Embase is easier to use"], exp: "Embase covers more European journals and has particularly strong indexing for drugs and pharmacology. Usually requires a paid subscription." }, correct: 1 },
  { id: "c2-014", category: 1, zh: { q: "Cochrane Library 的主要特色是什麼？", opts: ["包含所有醫學文獻", "專門收錄系統性回顧和臨床試驗的高品質證據資料庫", "只有護理學文獻", "是一個統計軟體"], exp: "Cochrane Library 包含 Cochrane Reviews（系統性回顧）和 CENTRAL（臨床試驗註冊），是實證醫學的核心資源。" }, en: { q: "What is the main feature of the Cochrane Library?", opts: ["Contains all medical literature", "A high-quality evidence database focused on systematic reviews and clinical trials", "Only nursing literature", "It's a statistical software"], exp: "Cochrane Library contains Cochrane Reviews and CENTRAL (clinical trials registry) — a core resource for evidence-based medicine." }, correct: 1 },
  { id: "c2-015", category: 1, zh: { q: "如果你的統合分析主題涉及護理學，除了 PubMed 和 Embase 之外應該加搜哪個資料庫？", opts: ["CINAHL（護理與健康相關文獻索引）", "IEEE Xplore（工程學）", "APA PsycINFO（只搜心理學就好）", "不需要額外搜尋"], exp: "CINAHL 是護理及相關健康專業的核心資料庫，涵蓋許多 PubMed/Embase 未收錄的護理期刊。" }, en: { q: "For a nursing-related meta-analysis, which database should you add?", opts: ["CINAHL (Cumulative Index to Nursing and Allied Health Literature)", "IEEE Xplore (engineering)", "APA PsycINFO (psychology only)", "No additional search needed"], exp: "CINAHL is the core database for nursing and allied health, covering many journals not indexed in PubMed/Embase." }, correct: 0 },
  { id: "c2-016", category: 1, zh: { q: "為什麼同一個搜尋策略在不同資料庫可能需要調整？", opts: ["不需要調整，直接複製貼上就好", "因為不同資料庫使用不同的搜尋語法、控制詞彙和欄位代碼", "因為每個資料庫收錄的文獻完全不重疊", "為了讓搜尋結果數字不同"], exp: "PubMed 用 MeSH，Embase 用 Emtree，搜尋語法也各不相同。必須為每個資料庫調整策略。" }, en: { q: "Why might the same search strategy need adjustment across databases?", opts: ["No adjustment needed — just copy-paste", "Different databases use different search syntax, controlled vocabularies, and field codes", "Databases have zero overlap", "To make result numbers different"], exp: "PubMed uses MeSH, Embase uses Emtree, and search syntax varies. Strategies must be adapted per database." }, correct: 1 },
  { id: "c2-017", category: 1, zh: { q: "CENTRAL 是什麼？", opts: ["一種統計方法", "Cochrane 的臨床試驗註冊資料庫，專門收錄 RCT 和 CCT", "一個基因組學資料庫", "PubMed 的另一個名字"], exp: "CENTRAL 收錄了從多個來源識別出的 RCT 和半隨機對照試驗，是搜尋 RCT 的重要來源。" }, en: { q: "What is CENTRAL?", opts: ["A statistical method", "Cochrane's register of controlled trials, collecting RCTs and CCTs", "A genomics database", "Another name for PubMed"], exp: "CENTRAL collects RCTs and quasi-randomized trials from multiple sources — a key source for finding RCTs." }, correct: 1 },
  { id: "c2-018", category: 1, zh: { q: "Web of Science 在系統性回顧中最常被用來做什麼？", opts: ["取代 PubMed", "追蹤引用文獻——找出引用了某篇關鍵文獻的後續研究", "只用來搜尋社會科學文獻", "計算影響係數"], exp: "WoS 的引用追蹤功能特別有用：找到引用了你已知關鍵文獻的所有後續研究。" }, en: { q: "What is Web of Science most commonly used for in systematic reviews?", opts: ["Replacing PubMed", "Citation tracking — finding studies that cited a key reference", "Only for social science literature", "Calculating impact factors"], exp: "WoS's citation tracking finds all subsequent studies that cited a key paper — an important supplementary search method." }, correct: 1 },
  { id: "c2-019", category: 1, zh: { q: "ClinicalTrials.gov 在系統性回顧中有什麼用途？", opts: ["取代文獻資料庫搜尋", "識別已完成但尚未發表的試驗，幫助偵測發表偏倚", "只有美國的試驗", "用來下載全文"], exp: "ClinicalTrials.gov 記錄了註冊的臨床試驗（包括未發表結果）。搜尋它可以識別發表偏倚。" }, en: { q: "What role does ClinicalTrials.gov play in systematic reviews?", opts: ["Replaces database searching", "Identifies completed but unpublished trials, helping detect publication bias", "Only has US trials", "Used to download full texts"], exp: "ClinicalTrials.gov records registered trials including unpublished results. Searching it helps detect publication bias." }, correct: 1 },
  { id: "c2-020", category: 1, zh: { q: "在選擇資料庫時，「主題特異性」是什麼意思？", opts: ["所有資料庫都涵蓋所有主題", "不同資料庫對特定主題領域的涵蓋深度不同，應根據研究主題選擇", "只需要搜尋一個資料庫", "主題特異性不重要"], exp: "例如心理學主題應加搜 PsycINFO，護理主題加搜 CINAHL。根據 PICO 主題選擇涵蓋最深的資料庫。" }, en: { q: "What does 'subject specificity' mean when choosing databases?", opts: ["All databases cover all topics equally", "Different databases have different depth for specific topics — choose based on your topic", "One database is always enough", "Subject specificity doesn't matter"], exp: "E.g., psychology topics add PsycINFO, nursing adds CINAHL. Choose databases with deepest coverage for your PICO topic." }, correct: 1 },

  // Category 2: Boolean operators & search syntax (10 Qs)
  { id: "c2-021", category: 2, zh: { q: "在搜尋策略中，OR 運算子的作用是什麼？", opts: ["縮小搜尋範圍", "連接不同概念", "連接同義詞，擴大搜尋範圍", "排除不相關的文獻"], exp: "OR 用來連接同一概念的不同表達方式（同義詞），確保不遺漏使用不同術語的文獻。" }, en: { q: "What does the OR operator do in a search strategy?", opts: ["Narrows the search", "Connects different concepts", "Connects synonyms to expand results", "Excludes irrelevant literature"], exp: "OR connects synonyms (different expressions of the same concept), ensuring you don't miss studies using different terms." }, correct: 2 },
  { id: "c2-022", category: 2, zh: { q: "AND 運算子會讓搜尋結果怎樣？", opts: ["增加結果數量", "減少結果數量——只保留同時包含所有概念的文獻", "沒有影響", "隨機選擇文獻"], exp: "AND 要求文獻同時包含所有連接的概念，縮小搜尋範圍。" }, en: { q: "How does the AND operator affect search results?", opts: ["Increases results", "Decreases results — only keeps records containing ALL connected concepts", "No effect", "Randomly selects records"], exp: "AND requires records to contain ALL connected concepts, narrowing results." }, correct: 1 },
  { id: "c2-023", category: 2, zh: { q: "NOT 運算子在搜尋中應該怎麼使用？", opts: ["大量使用以縮小範圍", "謹慎使用——因為可能意外排除相關文獻", "NOT 和 AND 功能相同", "每次搜尋都必須用 NOT"], exp: "NOT 會排除包含指定詞彙的所有文獻，即使該文獻其實是相關的。應謹慎使用。" }, en: { q: "How should the NOT operator be used in searching?", opts: ["Use extensively to narrow results", "Use cautiously — it may accidentally exclude relevant studies", "NOT and AND function the same", "Every search must use NOT"], exp: "NOT excludes ALL records containing the specified term, even if relevant. Use cautiously." }, correct: 1 },
  { id: "c2-024", category: 2, zh: { q: "在搜尋策略中使用 MeSH 詞彙有什麼好處？", opts: ["可以搜到更多不相關的文獻", "MeSH 是標準化的主題詞，能找到所有用了不同術語描述同一概念的文獻", "可以讓搜尋變快", "只有 PubMed 需要用"], exp: "MeSH 是 NLM 的標準化詞彙系統。文獻入庫時被人工標記 MeSH 詞，搜尋時能捕捉各種同義詞。" }, en: { q: "What is the advantage of using MeSH terms?", opts: ["Finds more irrelevant results", "MeSH is standardized vocabulary that captures studies using different terms for the same concept", "Makes searching faster", "Only PubMed uses MeSH"], exp: "MeSH is NLM's standardized vocabulary. Articles are manually tagged with MeSH terms, capturing all synonyms." }, correct: 1 },
  { id: "c2-025", category: 2, zh: { q: "截斷搜尋的用途是什麼？例如 'randomi*'", opts: ["搜尋精確的完整詞彙", "用萬用字元捕捉一個詞根的所有變體（如 randomize, randomized, randomisation）", "排除含有該詞根的文獻", "只在 Embase 有用"], exp: "截斷符號（通常是 *）可以捕捉同一詞根的所有變化形式，避免遺漏不同拼寫或詞形的文獻。" }, en: { q: "What is truncation used for? e.g., 'randomi*'", opts: ["Searching for the exact word", "Using a wildcard to capture all variations of a word stem", "Excluding records with that root", "Only works in Embase"], exp: "Truncation (usually *) captures all variations of a word stem, preventing missed records due to different spellings." }, correct: 1 },
  { id: "c2-026", category: 2, zh: { q: "以下哪個搜尋策略結構最合理？", opts: ["把所有關鍵詞用 AND 連在一起", "(P 的同義詞用 OR 連接) AND (I 的同義詞用 OR 連接) AND (filter)", "只用一個關鍵詞搜尋", "把所有詞用 OR 連在一起"], exp: "標準結構是：每個 PICO 概念內部用 OR 連接同義詞，概念之間用 AND 連接。" }, en: { q: "Which search strategy structure is most appropriate?", opts: ["Connect all keywords with AND", "(P synonyms joined by OR) AND (I synonyms joined by OR) AND (filter)", "Search with just one keyword", "Connect all terms with OR"], exp: "Standard structure: within each PICO concept, join synonyms with OR; between concepts, join with AND." }, correct: 1 },
  { id: "c2-027", category: 2, zh: { q: "「詞組搜尋」用引號括起來的功能是什麼？例如 \"heart failure\"", opts: ["搜尋含有 heart 或 failure 的文獻", "只搜尋完全按這個順序出現的詞組", "排除這個詞組", "和不加引號完全相同"], exp: "引號強制資料庫搜尋精確的詞組，而非分開的個別單詞。" }, en: { q: "What does phrase searching with quotes do? e.g., \"heart failure\"", opts: ["Searches for heart OR failure", "Only searches for the exact phrase in that order", "Excludes the phrase", "Same as without quotes"], exp: "Quotes force the database to search for the exact phrase, not individual words." }, correct: 1 },
  { id: "c2-028", category: 2, zh: { q: "Embase 使用的控制詞彙系統叫什麼？", opts: ["MeSH", "Emtree", "SNOMED", "ICD-10"], exp: "Embase 使用 Emtree 作為其控制詞彙系統，類似於 PubMed 的 MeSH。" }, en: { q: "What is Embase's controlled vocabulary system called?", opts: ["MeSH", "Emtree", "SNOMED", "ICD-10"], exp: "Embase uses Emtree as its controlled vocabulary, similar to PubMed's MeSH." }, correct: 1 },
  { id: "c2-029", category: 2, zh: { q: "MeSH 的「爆炸」(explode) 功能是什麼意思？", opts: ["刪除該 MeSH 詞", "自動包含該 MeSH 詞及其所有下位詞（子類別）", "只搜尋精確的 MeSH 詞", "讓搜尋速度更快"], exp: "Explode 會自動包含該 MeSH 詞的所有下位詞。例如 explode \"Heart Failure\" 會同時搜到其所有子分類。" }, en: { q: "What does 'exploding' a MeSH term mean?", opts: ["Deleting the MeSH term", "Automatically including the term and all its narrower terms", "Only searching the exact MeSH term", "Making the search faster"], exp: "Explode includes the MeSH term plus all narrower terms, e.g., 'Heart Failure' also captures 'Heart Failure, Systolic'." }, correct: 1 },
  { id: "c2-030", category: 2, zh: { q: "為什麼搜尋策略應該同時包含 MeSH 詞和自由文字？", opts: ["只用其中一種就夠了", "MeSH 只能找到已索引的文獻，自由文字可以補充找到新進或尚未索引的文獻", "自由文字比 MeSH 更精確", "只是慣例"], exp: "MeSH 搜尋精確但只涵蓋已索引的文獻。自由文字可以捕捉尚未被 MeSH 索引的新文獻。兩者結合確保最大涵蓋率。" }, en: { q: "Why should a search strategy include both MeSH and free text?", opts: ["One type is enough", "MeSH only finds indexed records; free text catches new or not-yet-indexed records", "Free text is more precise", "Just convention"], exp: "MeSH is precise but only covers indexed records. Free text catches new/not-yet-indexed articles. Combining maximizes coverage." }, correct: 1 },

  // Category 3: PRISMA flow diagram (10 Qs)
  { id: "c2-031", category: 3, zh: { q: "PRISMA 流程圖中，「初篩」通常根據什麼來決定？", opts: ["只看標題", "閱讀全文", "標題和摘要", "作者的知名度"], exp: "初篩階段根據標題和摘要判斷文獻是否可能符合納入標準。全文篩選是下一個階段。" }, en: { q: "In the PRISMA flow diagram, screening is usually based on what?", opts: ["Title only", "Full text reading", "Title and abstract", "Author reputation"], exp: "Screening is based on title and abstract to determine potential eligibility. Full-text review is the next stage." }, correct: 2 },
  { id: "c2-032", category: 3, zh: { q: "PRISMA 2020 流程圖的四個主要階段是什麼？", opts: ["搜尋、閱讀、分析、發表", "辨識、篩選、適格性、納入", "計畫、執行、報告、發表", "搜尋、排除、納入、統計"], exp: "PRISMA 流程圖包含四階段：辨識 → 篩選 → 適格性 → 納入。" }, en: { q: "What are the four main stages of the PRISMA 2020 flow diagram?", opts: ["Search, Read, Analyze, Publish", "Identification, Screening, Eligibility, Included", "Plan, Execute, Report, Publish", "Search, Exclude, Include, Statistics"], exp: "PRISMA flow has four stages: Identification → Screening → Eligibility → Included." }, correct: 1 },
  { id: "c2-033", category: 3, zh: { q: "在 PRISMA 流程圖中，全文篩選階段排除文獻時必須做什麼？", opts: ["只需標記為「排除」", "記錄每篇被排除文獻的具體理由", "請第三方審查者同意", "寫一段文字說明為什麼不好"], exp: "PRISMA 2020 要求在全文篩選階段記錄每篇排除文獻的理由，並在流程圖中報告。" }, en: { q: "When excluding studies at full-text screening in PRISMA, what must you do?", opts: ["Just mark as 'excluded'", "Record the specific reason for excluding each study", "Get a third reviewer to agree", "Write a paragraph about why it's bad"], exp: "PRISMA 2020 requires recording the reason for each full-text exclusion and reporting in the flow diagram." }, correct: 1 },
  { id: "c2-034", category: 3, zh: { q: "PRISMA 2020 相比舊版新增了什麼重要元素？", opts: ["移除了流程圖", "新增了報告來自資料庫以外來源（如灰色文獻、引用追蹤）的文獻流程", "不再需要報告排除理由", "減少了報告項目"], exp: "PRISMA 2020 增加了「其他來源」的獨立路徑，更完整地反映搜尋過程。" }, en: { q: "What important element did PRISMA 2020 add compared to the 2009 version?", opts: ["Removed the flow diagram", "Added a pathway for records from sources beyond databases (grey literature, citation tracking)", "No longer requires exclusion reasons", "Reduced reporting items"], exp: "PRISMA 2020 added a separate pathway for 'other sources', more completely reflecting the search process." }, correct: 1 },
  { id: "c2-035", category: 3, zh: { q: "PRISMA 流程圖中的「去重」應該在哪個階段進行？", opts: ["全文篩選之後", "在辨識階段，合併來自不同資料庫的重複文獻", "在納入階段", "不需要去重"], exp: "去重在辨識階段進行——搜尋多個資料庫會找到重複文獻，去重後才進入篩選階段。" }, en: { q: "At which stage should deduplication occur in PRISMA?", opts: ["After full-text screening", "At identification, merging duplicates from different databases", "At inclusion", "Not needed"], exp: "Deduplication happens at identification — remove duplicates from multiple databases before screening." }, correct: 1 },
  { id: "c2-036", category: 3, zh: { q: "PRISMA 代表什麼？", opts: ["Primary Research In Systematic Meta-Analysis", "Preferred Reporting Items for Systematic Reviews and Meta-Analyses", "Protocol for Reviewing and Including Studies in Meta-Analysis", "Publication Requirements for International Systematic Reviews"], exp: "PRISMA = Preferred Reporting Items for Systematic Reviews and Meta-Analyses。" }, en: { q: "What does PRISMA stand for?", opts: ["Primary Research In Systematic Meta-Analysis", "Preferred Reporting Items for Systematic Reviews and Meta-Analyses", "Protocol for Reviewing and Including Studies", "Publication Requirements for International SRs"], exp: "PRISMA = Preferred Reporting Items for Systematic Reviews and Meta-Analyses." }, correct: 1 },
  { id: "c2-037", category: 3, zh: { q: "PRISMA 流程圖中，「辨識」階段應該報告什麼數字？", opts: ["只報告最終納入的數量", "各資料庫的搜尋結果數量和去重後的數量", "只報告排除的數量", "不需要報告數字"], exp: "辨識階段需報告每個資料庫的檢索結果數、其他來源的數量，以及去重後進入篩選的總數。" }, en: { q: "What numbers should be reported at Identification stage?", opts: ["Only final included count", "Records from each database and count after deduplication", "Only excluded count", "No numbers needed"], exp: "Identification reports records from each database, records from other sources, and total after removing duplicates." }, correct: 1 },
  { id: "c2-038", category: 3, zh: { q: "PRISMA 流程圖可以用什麼工具自動生成？", opts: ["只能手繪", "使用線上工具如 PRISMA Flow Diagram Generator 或 R 套件", "只能用 Word 畫表格", "不需要視覺化"], exp: "有多個免費工具可生成 PRISMA 流程圖，如 PRISMA2020 R 套件和線上生成器。" }, en: { q: "What tools can auto-generate a PRISMA flow diagram?", opts: ["Can only be hand-drawn", "Online tools like PRISMA Flow Diagram Generator or R packages", "Only Word tables", "Don't need visualization"], exp: "Several free tools generate PRISMA diagrams: the PRISMA2020 R package and online generators." }, correct: 1 },
  { id: "c2-039", category: 3, zh: { q: "全文篩選後排除了 50 篇文獻，以下哪種報告方式最符合 PRISMA？", opts: ["只寫「排除 50 篇」", "按排除理由分類報告：15 篇非 RCT、12 篇族群不符、10 篇結局不匹配等", "不需要報告排除的文獻", "只列出排除文獻的作者名單"], exp: "PRISMA 要求按理由分類報告全文排除數量，讓讀者了解排除的具體原因。" }, en: { q: "After excluding 50 studies at full-text, which reporting best follows PRISMA?", opts: ["Just write 'excluded 50'", "Report by reason: 15 not RCT, 12 wrong population, 10 wrong outcome, etc.", "No need to report", "Just list excluded authors"], exp: "PRISMA requires full-text exclusions categorized by reason." }, correct: 1 },
  { id: "c2-040", category: 3, zh: { q: "PRISMA 流程圖在論文的哪個部分呈現？", opts: ["引言", "方法/結果部分，通常作為 Figure 1", "討論", "只放附錄"], exp: "PRISMA 流程圖通常作為論文的第一張圖，放在方法或結果部分。" }, en: { q: "Where in a paper is the PRISMA flow diagram typically presented?", opts: ["Introduction", "Methods/Results section, typically as Figure 1", "Discussion", "Only in appendix"], exp: "The PRISMA flow diagram is typically Figure 1, placed in Methods or Results." }, correct: 1 },

  // Category 4: Screening process (10 Qs)
  { id: "c2-041", category: 4, zh: { q: "為什麼系統性回顧需要至少兩名獨立的審查者？", opts: ["因為工作量太大", "為了減少偏差、提高篩選的可靠性", "因為期刊規定", "為了更快完成"], exp: "獨立雙人篩選可以減少個人主觀偏差，提高結果的可靠性和可重複性。" }, en: { q: "Why does a systematic review need at least two independent reviewers?", opts: ["Workload is too much for one", "To reduce bias and improve reliability", "Journals require it", "To finish faster"], exp: "Independent dual screening reduces subjective bias and improves reliability — a core methodological requirement." }, correct: 1 },
  { id: "c2-042", category: 4, zh: { q: "當兩名審查者在篩選結果上有分歧時，通常怎麼解決？", opts: ["隨機選一個人的結果", "由第三名審查者仲裁，或討論達成共識", "直接排除有爭議的文獻", "不需要解決"], exp: "分歧通常先由兩人討論解決。如果無法達成共識，由第三名審查者做最終決定。" }, en: { q: "How are reviewer disagreements typically resolved?", opts: ["Randomly pick one decision", "Third reviewer arbitrates, or discussion until consensus", "Exclude all disputed studies", "No resolution needed"], exp: "Disagreements are first resolved by discussion. If no consensus, a third reviewer decides." }, correct: 1 },
  { id: "c2-043", category: 4, zh: { q: "在標題/摘要篩選時，如果不確定某篇文獻是否相關，應該怎麼做？", opts: ["直接排除以節省時間", "納入到全文篩選——寧可多看也不要遺漏", "只看標題決定", "擲硬幣"], exp: "不確定的文獻應保留到全文篩選階段。初篩的原則是「寧可納入也不要遺漏」。" }, en: { q: "During title/abstract screening, if unsure about relevance, what should you do?", opts: ["Exclude to save time", "Include for full-text review — when in doubt, keep it in", "Decide on title only", "Flip a coin"], exp: "Uncertain records should be kept for full-text review. The principle is 'when in doubt, include'." }, correct: 1 },
  { id: "c2-044", category: 4, zh: { q: "篩選前應該先做什麼來確保審查者之間的一致性？", opts: ["不需要任何準備", "進行校準練習——先用一小批文獻測試篩選標準的理解一致性", "讓最資深的人單獨決定", "直接開始篩選"], exp: "校準練習讓所有審查者用同一批文獻測試納入/排除標準的應用，確認理解一致後再正式開始。" }, en: { q: "What should be done before screening to ensure reviewer consistency?", opts: ["No preparation needed", "Pilot testing — calibrate criteria understanding on a small batch", "Senior person decides alone", "Start directly, adjust later"], exp: "Pilot testing has all reviewers screen the same small batch to calibrate. This greatly reduces later disagreements." }, correct: 1 },
  { id: "c2-045", category: 4, zh: { q: "以下哪個工具常用於管理文獻篩選流程？", opts: ["Microsoft Word", "Covidence、Rayyan 或 ASReview 等篩選平台", "Google 搜尋", "Instagram"], exp: "Covidence、Rayyan 和 ASReview 專門設計用於系統性回顧的文獻篩選。" }, en: { q: "Which tools are commonly used to manage screening?", opts: ["Microsoft Word", "Platforms like Covidence, Rayyan, or ASReview", "Google Search", "Instagram"], exp: "Covidence, Rayyan, and ASReview are purpose-built for systematic review screening." }, correct: 1 },
  { id: "c2-046", category: 4, zh: { q: "Cohen's kappa 在篩選過程中用來衡量什麼？", opts: ["文獻的品質", "兩名審查者之間的篩選一致性", "搜尋的敏感度", "效果量"], exp: "Cohen's kappa 量化兩名審查者之間超越隨機一致的同意程度。κ ≥ 0.6 通常被認為可接受。" }, en: { q: "What does Cohen's kappa measure in screening?", opts: ["Study quality", "Inter-rater agreement between two reviewers", "Search sensitivity", "Effect size"], exp: "Cohen's kappa quantifies agreement beyond chance between two reviewers. κ ≥ 0.6 is generally acceptable." }, correct: 1 },
  { id: "c2-047", category: 4, zh: { q: "全文篩選時發現族群不符合 PICO，你應該怎麼做？", opts: ["還是納入", "排除，並記錄理由為「族群不符」", "修改 PICO", "忽略標準"], exp: "應嚴格按照預定的標準執行。族群不符就排除並記錄理由。" }, en: { q: "During full-text screening, population doesn't match PICO. What do you do?", opts: ["Include anyway", "Exclude and record reason as 'population mismatch'", "Change PICO", "Ignore the criterion"], exp: "Apply criteria strictly. Exclude for population mismatch and record the reason." }, correct: 1 },
  { id: "c2-048", category: 4, zh: { q: "以下哪個不是全文排除的合理理由？", opts: ["研究設計不符", "結局指標不匹配", "作者的名字你不認識", "介入措施不符合 PICO"], exp: "排除理由應基於預定標準，而非主觀因素如作者知名度。" }, en: { q: "Which is NOT a valid reason for full-text exclusion?", opts: ["Wrong study design", "Outcome doesn't match", "You don't recognize the author", "Intervention doesn't match PICO"], exp: "Exclusion reasons must be based on pre-defined criteria, not subjective factors like author recognition." }, correct: 2 },
  { id: "c2-049", category: 4, zh: { q: "AI 輔助篩選工具（如 ASReview）的主要優勢是什麼？", opts: ["可以完全取代人工篩選", "利用機器學習優先排序可能相關的文獻，加速篩選", "結果一定比人類準確", "不需要設定標準"], exp: "AI 工具通過主動學習優先呈現最可能相關的文獻。但仍需要人工審查和最終決定。" }, en: { q: "What is the main advantage of AI-assisted screening tools?", opts: ["Completely replaces manual screening", "Uses ML to prioritize likely relevant records, speeding up screening", "Always more accurate than humans", "No criteria needed"], exp: "AI tools use active learning to surface likely relevant records first. But human review and final decisions are still required." }, correct: 1 },
  { id: "c2-050", category: 4, zh: { q: "搜尋到 > 5000 篇文獻時，以下哪個做法最合適？", opts: ["隨機抽取 200 篇", "使用文獻管理軟體去重後系統性篩選", "放棄題目", "只看前 100 篇"], exp: "大量文獻是正常的。使用文獻管理軟體去重，再系統性篩選。" }, en: { q: "When search results exceed 5000 records, what is most appropriate?", opts: ["Randomly sample 200", "Use reference management software to deduplicate, then screen systematically", "Abandon the topic", "Only look at first 100"], exp: "Large volumes are normal. Use reference management software to deduplicate, then screen systematically." }, correct: 1 },

  // Category 5: Grey literature & search completeness (10 Qs)
  { id: "c2-051", category: 5, zh: { q: "什麼是「灰色文獻」？", opts: ["品質很差的文獻", "很舊的文獻", "未經正式期刊發表的研究資料", "只有英文的文獻"], exp: "灰色文獻包括會議摘要、學位論文、技術報告等未經同行評審的正式發表。" }, en: { q: "What is 'grey literature'?", opts: ["Poor quality literature", "Very old literature", "Research not formally published in peer-reviewed journals", "English-only literature"], exp: "Grey literature includes conference abstracts, dissertations, and technical reports not formally peer-reviewed." }, correct: 2 },
  { id: "c2-052", category: 5, zh: { q: "為什麼搜尋灰色文獻可以減少發表偏倚？", opts: ["灰色文獻品質比較高", "因為陰性結果的研究比較不容易被期刊發表，灰色文獻可以補充這些遺漏", "灰色文獻比較新", "不會減少偏倚"], exp: "發表偏倚指陽性結果比陰性結果更容易被發表。灰色文獻中包含許多未發表的陰性結果研究。" }, en: { q: "Why does searching grey literature reduce publication bias?", opts: ["Grey literature is higher quality", "Studies with negative results are less likely published — grey literature captures these", "It's more recent", "It doesn't reduce bias"], exp: "Publication bias means positive results get published more often. Grey literature contains many unpublished negative studies." }, correct: 1 },
  { id: "c2-053", category: 5, zh: { q: "以下哪個是灰色文獻的來源？", opts: ["PubMed 的正式索引文獻", "會議摘要、學位論文、政府報告、臨床試驗註冊結果", "Impact Factor 最高的期刊", "只有 RCT"], exp: "灰色文獻來源包括：會議論文集、博碩士論文、政府/機構報告、ClinicalTrials.gov 結果等。" }, en: { q: "Which is a source of grey literature?", opts: ["Formally indexed PubMed records", "Conference abstracts, dissertations, government reports, trial registry results", "Highest impact factor journals", "Only RCTs"], exp: "Grey literature sources include conference proceedings, theses, government reports, ClinicalTrials.gov results." }, correct: 1 },
  { id: "c2-054", category: 5, zh: { q: "「引用追蹤」在補充搜尋中有什麼作用？", opts: ["計算影響係數", "從已知關鍵文獻出發，找出引用它的後續研究和它引用的參考文獻", "只是為了增加引用次數", "替代資料庫搜尋"], exp: "前向追蹤（誰引用了這篇）和後向追蹤（這篇引用了誰）可以找到資料庫搜尋遺漏的文獻。" }, en: { q: "What role does citation tracking play in supplementary searching?", opts: ["Calculating impact factor", "Finding studies that cited a key paper (forward) and its references (backward)", "Just to increase citations", "Replaces database searching"], exp: "Forward tracking (who cited this?) and backward tracking (what did this cite?) find studies missed by database searches." }, correct: 1 },
  { id: "c2-055", category: 5, zh: { q: "「手動搜尋」指的是什麼？", opts: ["用手寫關鍵詞", "逐期逐頁翻閱特定期刊的目錄，尋找相關文獻", "只用一隻手打字", "不使用電腦的搜尋"], exp: "手動搜尋是逐期翻閱特定核心期刊的目錄，找出電子資料庫可能遺漏的文獻。" }, en: { q: "What does 'handsearching' mean?", opts: ["Writing keywords by hand", "Manually browsing journals issue-by-issue to find relevant articles", "Searching with one hand", "Searching without a computer"], exp: "Handsearching is manually browsing key journals issue-by-issue to find articles missed by electronic databases." }, correct: 1 },
  { id: "c2-056", category: 5, zh: { q: "設定語言限制（如只搜英文）會有什麼風險？", opts: ["沒有風險", "可能遺漏在其他語言發表的相關研究，引入語言偏差", "英文文獻品質一定最好", "其他語言的研究都是重複的"], exp: "語言限制可能排除在非英語期刊發表的重要研究。Cochrane 建議盡量不設語言限制。" }, en: { q: "What risk does a language restriction (English only) pose?", opts: ["No risk", "May miss relevant studies in other languages, introducing language bias", "English studies are always best", "Non-English studies are duplicates"], exp: "Language restrictions may exclude important non-English studies. Cochrane recommends avoiding language limits." }, correct: 1 },
  { id: "c2-057", category: 5, zh: { q: "以下哪個方法可以確認搜尋策略的完整性？", opts: ["不需要確認", "用已知要被納入的關鍵研究測試搜尋策略是否能找到它們", "只搜尋一個資料庫", "只問一位專家"], exp: "在正式搜尋前，用「黃金標準」文獻測試策略。如果策略找不到它們，需要修改。" }, en: { q: "How can you verify search strategy completeness?", opts: ["No verification needed", "Test with known key studies to check if the strategy retrieves them", "Search only one database", "Ask just one expert"], exp: "Test with a 'gold standard' set of known studies. If the strategy misses them, it needs revision." }, correct: 1 },
  { id: "c2-058", category: 5, zh: { q: "搜尋更新通常在什麼時候進行？", opts: ["不需要更新", "在分析和寫作期間——因為新研究可能在搜尋之後發表", "只在投稿被拒之後", "在搜尋的同一天"], exp: "從初始搜尋到論文發表可能間隔數月。更新搜尋確保納入新發表的相關研究。" }, en: { q: "When should a search update be performed?", opts: ["No update needed", "During analysis/writing — new studies may have been published since initial search", "Only after rejection", "Same day as initial search"], exp: "Months may pass between initial search and publication. Updates ensure newly published studies are captured." }, correct: 1 },
  { id: "c2-059", category: 5, zh: { q: "「聯繫作者」在搜尋中有什麼用途？", opts: ["只是禮貌性問候", "取得未發表的資料、釐清方法學細節、確認是否有遺漏的研究", "請作者幫我們寫論文", "不需要聯繫"], exp: "聯繫通訊作者可以取得未發表的資料、補充資訊，或確認是否有我們遺漏的研究。" }, en: { q: "What is the purpose of contacting authors during searching?", opts: ["Just courtesy", "Obtaining unpublished data, clarifying methods, confirming if we missed studies", "Asking them to write our paper", "Not needed"], exp: "Contacting authors can yield unpublished data, supplementary info, or identify missed studies." }, correct: 1 },
  { id: "c2-060", category: 5, zh: { q: "以下哪個做法最能確保搜尋的「可重複性」？", opts: ["口頭描述搜尋過程", "在附錄中提供每個資料庫的完整搜尋語句、日期和結果數量", "只記錄最終納入的文獻", "不需要記錄"], exp: "完整記錄每個資料庫的搜尋語句、日期和結果數量，讓任何人都能精確重現搜尋。" }, en: { q: "Which practice best ensures search reproducibility?", opts: ["Verbally describe the process", "Provide complete queries, dates, and result counts for each database in an appendix", "Only record included studies", "No documentation needed"], exp: "Documenting full queries, dates, and counts for each database allows exact replication — a fundamental requirement." }, correct: 1 },

  // Category 6: Search strategy pitfalls & best practices (10 Qs)
  { id: "c2-061", category: 6, zh: { q: "以下哪個是搜尋策略的常見錯誤？", opts: ["使用 MeSH 和自由文字結合", "只搜尋一個資料庫就認為搜尋完成", "諮詢醫學圖書館員", "做校準測試"], exp: "只搜尋一個資料庫會遺漏大量文獻。至少應搜尋 2-3 個互補的資料庫。" }, en: { q: "Which is a common search strategy mistake?", opts: ["Combining MeSH and free text", "Searching only one database and considering it complete", "Consulting a librarian", "Pilot testing"], exp: "Searching just one database misses substantial literature. Search at least 2-3 complementary databases." }, correct: 1 },
  { id: "c2-062", category: 6, zh: { q: "以下哪個搜尋問題會導致遺漏太多文獻？", opts: ["使用太多 OR 連接同義詞", "使用太多 AND 連接不同概念", "搜尋多個資料庫", "使用截斷搜尋"], exp: "AND 是縮小範圍的運算子。把太多概念用 AND 連接會讓結果太少甚至為零。" }, en: { q: "Which search problem causes missing too many studies?", opts: ["Too many OR for synonyms", "Too many AND joining concepts — each AND narrows dramatically", "Multiple databases", "Using truncation"], exp: "AND narrows results. Too many concepts joined with AND may yield too few or zero results." }, correct: 1 },
  { id: "c2-063", category: 6, zh: { q: "同行評審搜尋策略的 PRESS 清單是什麼？", opts: ["一種統計方法", "一個檢核表，用於同行評審搜尋策略的品質", "一個文獻資料庫", "PRISMA 的另一個名字"], exp: "PRESS 讓第二個人系統性地檢查搜尋策略的品質，包括詞彙選擇、邏輯、語法等。" }, en: { q: "What is the PRESS checklist?", opts: ["A statistical method", "A checklist for peer-reviewing search strategy quality", "A database", "Another name for PRISMA"], exp: "PRESS (Peer Review of Electronic Search Strategies) is a checklist for systematically reviewing search quality." }, correct: 1 },
  { id: "c2-064", category: 6, zh: { q: "使用太寬泛的截斷可能造成什麼問題？例如 'car*'", opts: ["不會有問題", "會捕捉太多不相關的變體（carbon, cardiac, carpet），產生大量噪音", "會讓搜尋速度變慢", "截斷只適用於 Embase"], exp: "太短的詞根會匹配大量不相關的詞。應選擇夠長的詞根或改用精確詞彙。" }, en: { q: "What problem can overly broad truncation cause? e.g., 'car*'", opts: ["No problem", "Captures too many irrelevant variants (carbon, cardiac, carpet)", "Slows the search", "Only works in Embase"], exp: "Too-short stems match many irrelevant terms. Use longer stems or exact terms." }, correct: 1 },
  { id: "c2-065", category: 6, zh: { q: "以下哪個做法可以幫助確保你沒有遺漏重要的同義詞？", opts: ["只用自己想到的詞", "查閱相關系統性回顧的搜尋策略、MeSH 詞樹和 Emtree 來識別同義詞", "只用 MeSH", "不需要擔心同義詞"], exp: "參考已發表的系統性回顧搜尋策略、瀏覽 MeSH 詞樹和 Emtree 階層，系統性地識別同義詞。" }, en: { q: "How can you ensure you haven't missed important synonyms?", opts: ["Just use terms you think of", "Check related SR search strategies, MeSH tree, and Emtree to identify synonyms", "Only use MeSH", "Don't worry about synonyms"], exp: "Review published SR strategies, MeSH tree, and Emtree hierarchies to systematically identify synonyms." }, correct: 1 },
  { id: "c2-066", category: 6, zh: { q: "在搜尋策略中加入研究設計篩選器（如 RCT filter）的時機是什麼？", opts: ["永遠不要用", "在確認搜尋結果數量可管理後，如果需要才使用", "一開始就一定要加", "只有結果為零時才用"], exp: "篩選器可以縮小結果但可能遺漏文獻。建議先不加篩選器評估結果量，必要時才加上。" }, en: { q: "When should study design filters (e.g., RCT filter) be added?", opts: ["Never", "After confirming volume is manageable — only add if further narrowing needed", "Must include from the start", "Only when results are zero"], exp: "Filters narrow results but may miss records. Assess volume without filters first; add only if needed." }, correct: 1 },
  { id: "c2-067", category: 6, zh: { q: "以下哪個是「搜尋策略和 PICO 脫節」的例子？", opts: ["策略包含 PICO 所有概念的同義詞", "PICO 定義了特定藥物，但搜尋策略中沒有該藥物名稱", "使用了 MeSH 和自由文字", "諮詢了圖書館員"], exp: "搜尋策略必須忠實反映 PICO。如果 PICO 中的藥物在策略中缺失，會遺漏所有相關文獻。" }, en: { q: "Which is an example of 'search strategy disconnected from PICO'?", opts: ["Strategy includes all PICO synonyms", "PICO defines a specific drug but strategy doesn't include it", "Uses MeSH and free text", "Consulted a librarian"], exp: "The search strategy must reflect each PICO element. Missing a PICO drug means missing all relevant studies." }, correct: 1 },
  { id: "c2-068", category: 6, zh: { q: "為什麼不建議在搜尋策略中加入 Outcome 的搜尋詞？", opts: ["Outcome 不重要", "因為不同研究描述結局的術語差異很大，加入 O 可能遺漏重要研究", "Outcome 太容易搜尋", "可以加入，沒問題"], exp: "Outcome 描述方式極其多樣。大多數專家建議只用 P 和 I 搜尋，在篩選階段再根據 O 判斷。" }, en: { q: "Why is it discouraged to include Outcome terms in the search?", opts: ["Outcome doesn't matter", "Studies describe outcomes with highly variable terminology — including O may miss studies", "Outcome is too easy to search", "Including it is fine"], exp: "Outcome descriptions are extremely variable. Most experts recommend searching with P and I only, filtering by O during screening." }, correct: 1 },
  { id: "c2-069", category: 6, zh: { q: "搜尋策略附錄應該包含哪些資訊？", opts: ["只需要寫「搜尋了 PubMed」", "每個資料庫的完整搜尋語句、搜尋日期、結果數量", "只需要最終納入的文獻", "不需要報告"], exp: "完整的搜尋報告應包括每個資料庫的名稱、完整語句、搜尋日期和結果數。這是 PRISMA-S 的要求。" }, en: { q: "What should the search strategy appendix contain?", opts: ["Just 'searched PubMed'", "Full queries for each database, search dates, and result counts", "Only included studies", "No reporting needed"], exp: "Complete reporting includes database names, full queries, dates, and per-line result counts. Required by PRISMA-S." }, correct: 1 },
  { id: "c2-070", category: 6, zh: { q: "PRISMA-S 是什麼？和 PRISMA 有什麼關係？", opts: ["和 PRISMA 完全無關", "PRISMA-S 是 PRISMA 的搜尋策略報告擴展，專門針對搜尋方法的報告標準", "是統計方法的指引", "只適用於 Cochrane 回顧"], exp: "PRISMA-S (PRISMA for Searching) 是 2021 年發表的擴展指引，提供了 16 項搜尋報告的具體要求。" }, en: { q: "What is PRISMA-S and how does it relate to PRISMA?", opts: ["Completely unrelated", "An extension of PRISMA specifically for reporting search methods", "A statistical methods guideline", "Only for Cochrane reviews"], exp: "PRISMA-S (PRISMA for Searching) is a 2021 extension with 16 specific search reporting requirements." }, correct: 1 },
];
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
