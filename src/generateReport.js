/**
 * generateReport.js
 * Builds a bilingual .docx report from the Final Workshop project + analysis data.
 * Uses the `docx` npm package (browser-compatible via Packer.toBlob).
 *
 * Usage:  import { generateReport } from "./generateReport";
 *         await generateReport(project, analysis, lang);
 */
import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat,
} from "docx";

// ── helpers ──
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const MARGINS = { top: 80, bottom: 80, left: 120, right: 120 };
const FONT = "Noto Sans TC";
const BODY = 22;   // 11pt
const SMALL = 20;  // 10pt

function p(text, opts = {}) {
  const { bold, size, color, heading, spacing, alignment } = opts;
  return new Paragraph({
    ...(heading ? { heading } : {}),
    ...(alignment ? { alignment } : {}),
    ...(spacing ? { spacing } : {}),
    children: [new TextRun({ text, font: FONT, size: size || BODY, bold, color })],
  });
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 120 }, children: [] });
}

function sectionHeading(text) {
  return p(text, { heading: HeadingLevel.HEADING_1, bold: true, size: 28 });
}

function subHeading(text) {
  return p(text, { heading: HeadingLevel.HEADING_2, bold: true, size: 24 });
}

function labelValue(label, value) {
  if (value == null || value === "") return null;
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, font: FONT, size: BODY, bold: true }),
      new TextRun({ text: String(value), font: FONT, size: BODY }),
    ],
  });
}

function feedbackBlock(label, text, lang) {
  if (!text) return [];
  return [
    p(label, { bold: true, size: BODY, color: "2E86C1" }),
    p(text, { size: SMALL, color: "555555", spacing: { after: 160 } }),
  ];
}

function cell(text, opts = {}) {
  const { bold, shading, width } = opts;
  return new TableCell({
    borders: BORDERS,
    margins: MARGINS,
    ...(width ? { width: { size: width, type: WidthType.DXA } } : {}),
    ...(shading ? { shading: { fill: shading, type: ShadingType.CLEAR } } : {}),
    children: [new Paragraph({ children: [new TextRun({ text: text || "", font: FONT, size: SMALL, bold })] })],
  });
}

// ── RoB label mapping ──
const robLabel = {
  zh: { low: "低", some: "部分疑慮", high: "高" },
  en: { low: "Low", some: "Some Concerns", high: "High" },
};
// RoB 2 domain labels (5 domains + overall).
const robDomainLabel = {
  zh: { randomization: "隨機化過程", deviations: "偏離預期介入", missing: "缺失結果數據", measurement: "結果測量", selection: "選擇性結果報告", overall: "整體" },
  en: { randomization: "Randomization", deviations: "Deviations", missing: "Missing Data", measurement: "Measurement", selection: "Reported Result", overall: "Overall" },
};

// ── Main ──
export async function generateReport(project, analysis, lang) {
  const isZh = lang === "zh";
  const inc = (project?.studies || []).filter(s => s.included);
  const bin = inc.length > 0 && inc[0].outcomeType === "binary";
  const a = analysis || {};
  const t = (zh, en) => isZh ? zh : en;

  const children = [];

  // ─── Title ───
  children.push(
    p(t("統合分析工作坊報告", "Meta-Analysis Workshop Report"), {
      heading: HeadingLevel.TITLE, bold: true, size: 36, alignment: AlignmentType.CENTER,
    }),
    p(new Date().toLocaleDateString(isZh ? "zh-TW" : "en-US", { year: "numeric", month: "long", day: "numeric" }), {
      size: SMALL, color: "888888", alignment: AlignmentType.CENTER, spacing: { after: 300 },
    }),
  );

  // ─── 1. PICO ───
  children.push(sectionHeading(t("1. 研究問題 (PICO)", "1. Research Question (PICO)")));
  children.push(
    labelValue(t("族群 (P)", "Population (P)"), project.pico?.p),
    labelValue(t("介入 (I)", "Intervention (I)"), project.pico?.i),
    labelValue(t("對照 (C)", "Comparator (C)"), project.pico?.c),
    labelValue(t("結局 (O)", "Outcome (O)"), project.pico?.o),
  );
  if (project.topic) children.push(labelValue(t("研究主題", "Topic"), project.topic));
  children.push(emptyLine());

  // ─── 2. Search strategy ───
  if (project.search) {
    children.push(sectionHeading(t("2. 搜尋策略", "2. Search Strategy")));
    if (project.search.databases?.length) {
      children.push(labelValue(t("資料庫", "Databases"), project.search.databases.join(", ")));
    }
    if (project.search.booleanQuery) {
      children.push(labelValue(t("布林搜尋式", "Boolean Query"), project.search.booleanQuery));
    }
    if (project.search.greyLiterature) {
      children.push(labelValue(t("灰色文獻", "Grey Literature"), project.search.greyLiterature));
    }
    children.push(emptyLine());
  }

  // ─── 3. Included studies ───
  children.push(sectionHeading(t("3. 納入研究", "3. Included Studies")));
  children.push(p(t(`共納入 ${inc.length} 篇研究`, `${inc.length} studies included`), { spacing: { after: 120 } }));

  if (inc.length > 0) {
    // Data table
    const dataHeaders = bin
      ? [t("研究", "Study"), t("介入事件", "I Events"), t("介入人數", "I Total"), t("對照事件", "C Events"), t("對照人數", "C Total")]
      : [t("研究", "Study"), t("介入Mean", "I Mean"), t("介入SD", "I SD"), t("介入N", "I N"), t("對照Mean", "C Mean"), t("對照SD", "C SD"), t("對照N", "C N")];

    const colCount = dataHeaders.length;
    const studyColW = 3200;
    const dataColW = Math.floor((9360 - studyColW) / (colCount - 1));
    const colWidths = [studyColW, ...Array(colCount - 1).fill(dataColW)];

    const headerRow = new TableRow({
      children: dataHeaders.map((h, i) => cell(h, { bold: true, shading: "D5E8F0", width: colWidths[i] })),
    });

    const dataRows = inc.map(s => {
      const vals = bin
        ? [s.citation, String(s.tx?.events ?? ""), String(s.tx?.total ?? ""), String(s.ctrl?.events ?? ""), String(s.ctrl?.total ?? "")]
        : [s.citation, String(s.txCont?.mean ?? ""), String(s.txCont?.sd ?? ""), String(s.txCont?.n ?? ""), String(s.ctrlCont?.mean ?? ""), String(s.ctrlCont?.sd ?? ""), String(s.ctrlCont?.n ?? "")];
      return new TableRow({ children: vals.map((v, i) => cell(v, { width: colWidths[i] })) });
    });

    children.push(new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: colWidths,
      rows: [headerRow, ...dataRows],
    }));
    children.push(emptyLine());
  }

  // ─── 4. Risk of Bias ───
  const hasRob = inc.some(s => s.rob && Object.values(s.rob).some(v => v));
  if (hasRob) {
    children.push(sectionHeading(t("4. 偏差風險評估", "4. Risk of Bias Assessment")));
    const domainKeys = ["randomization", "deviations", "missing", "measurement", "selection", "overall"];
    const dl = robDomainLabel[isZh ? "zh" : "en"];
    const rl = robLabel[isZh ? "zh" : "en"];

    const robHeaders = [t("研究", "Study"), ...domainKeys.map(k => dl[k] || k)];
    const robColW = [2400, ...Array(domainKeys.length).fill(Math.floor((9360 - 2400) / domainKeys.length))];

    const robHeaderRow = new TableRow({
      children: robHeaders.map((h, i) => cell(h, { bold: true, shading: "D5E8F0", width: robColW[i] })),
    });
    const robRows = inc.map(s => {
      const rob = s.rob || {};
      return new TableRow({
        children: [
          cell(s.citation, { width: robColW[0] }),
          ...domainKeys.map((k, i) => {
            const v = rob[k] || "";
            const shade = v === "high" ? "F5B7B1" : v === "some" ? "FAD7A0" : v === "low" ? "A9DFBF" : undefined;
            return cell(rl[v] || v, { width: robColW[i + 1], shading: shade });
          }),
        ],
      });
    });

    children.push(new Table({
      width: { size: 9360, type: WidthType.DXA },
      columnWidths: robColW,
      rows: [robHeaderRow, ...robRows],
    }));
    children.push(emptyLine());
  }

  // ─── 5. Analysis choices ───
  children.push(sectionHeading(t("5. 分析方法", "5. Analysis Methods")));
  children.push(
    labelValue(t("效果量類型", "Effect Size"), a.effectType),
    labelValue(t("模型", "Model"), a.model === "random" ? t("隨機效果", "Random-Effects") : a.model === "fixed" ? t("固定效果", "Fixed-Effect") : null),
    labelValue(t("選擇理由", "Rationale"), a.rationale),
  );
  children.push(emptyLine());

  // ─── 6. Interpretation ───
  children.push(sectionHeading(t("6. 結果解讀", "6. Result Interpretation")));
  children.push(
    labelValue(t("整體效果量", "Pooled Effect"), a.forestQ1),
    labelValue(t("一致性與權重", "Consistency & Weights"), a.forestQ2),
    labelValue(t("異質性", "Heterogeneity"), a.hetInterpretation),
    labelValue(t("漏斗圖", "Funnel Plot"), a.funnelAssessment),
  );

  // Advanced interpretations
  if ((a.completedAdvanced || []).length > 0) {
    children.push(subHeading(t("進階分析解讀", "Advanced Analysis Interpretations")));
    for (const adv of a.completedAdvanced) {
      const key = adv.moderator ? `${adv.type}_${adv.moderator}` : adv.type;
      const label = adv.moderator ? `${adv.type} (${adv.moderator})` : adv.type;
      const val = (a.advInterpretations || {})[key];
      if (val) children.push(labelValue(label, val));
    }
  }

  // AI interpretation feedback
  children.push(...feedbackBlock(
    t("🤖 AI 解讀回饋", "🤖 AI Interpretation Feedback"),
    a._interpretFeedback, lang,
  ));
  children.push(emptyLine());

  // ─── 7. Conclusions ───
  children.push(sectionHeading(t("7. 結論", "7. Conclusions")));
  children.push(
    labelValue(t("主要發現", "Main Finding"), a.mainFinding),
    labelValue(t("證據確定性 (GRADE)", "Evidence Certainty (GRADE)"), a.certainty),
    labelValue(t("GRADE 理由", "GRADE Rationale"), a.certRationale),
    labelValue(t("主要限制", "Limitations"), a.limitations),
    labelValue(t("臨床意義", "Clinical Implications"), a.implications),
  );

  // AI full review
  children.push(...feedbackBlock(
    t("🤖 AI 全面審查", "🤖 AI Full Project Review"),
    a._fullReviewFeedback, lang,
  ));

  // ─── Build doc ───
  const doc = new Document({
    styles: {
      default: { document: { run: { font: FONT, size: BODY } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, bold: true, font: FONT, color: "1D2B3A" },
          paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 24, bold: true, font: FONT, color: "2E86C1" },
          paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
        { id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, font: FONT, color: "1D2B3A" },
          paragraph: { spacing: { after: 40 }, alignment: AlignmentType.CENTER } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 }, // A4
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: children.filter(Boolean),
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = isZh ? "統合分析報告.docx" : "Meta-Analysis_Report.docx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
