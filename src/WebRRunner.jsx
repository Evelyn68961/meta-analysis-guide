import { useState, useEffect, useRef, useCallback } from "react";

// ═══ DESIGN TOKENS (matches Final.jsx) ═══
const CRIMSON = "#C0392B";
const DARK = "#1D2B3A";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const GREEN = "#3DA87A";
const AMBER = "#D4A843";
const BLUE = "#2E86C1";
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
    errorTitle: "執行錯誤",
    errorHint: "如遇到問題，可使用「線上計算器」或「R 程式碼」分頁。",
    desktopNote: "建議使用桌面瀏覽器以獲得最佳體驗",
    stepEngine: "R 引擎",
    stepPackage: "安裝套件",
    stepReady: "就緒",
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
    errorTitle: "Execution Error",
    errorHint: "If you encounter issues, try the Online Calculator or R Code tabs.",
    desktopNote: "Desktop browser recommended for best experience",
    stepEngine: "R Engine",
    stepPackage: "Packages",
    stepReady: "Ready",
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

// ═══ MAIN COMPONENT ═══
export default function WebRRunner({ rCode, lang = "zh", pico, effectType, model, onAiInterpret }) {
  const tx = TX[lang] || TX.en;

  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState(null);
  const [rOutput, setROutput] = useState(null);
  const [forestImg, setForestImg] = useState(null);
  const [funnelImg, setFunnelImg] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const webRRef = useRef(null);
  const forestCanvasRef = useRef(null);
  const funnelCanvasRef = useRef(null);
  const initAttemptedRef = useRef(false);

  // ── Initialize WebR ──
  const initWebR = useCallback(async () => {
    if (webRRef.current) { setStatus(STATUS.READY); return; }
    setStatus(STATUS.LOADING_ENGINE);
    setErrorMsg(null);

    try {
      const { WebR } = await import("https://webr.r-wasm.org/latest/webr.mjs");
      const webR = new WebR();
      await webR.init();
      webRRef.current = webR;

      setStatus(STATUS.LOADING_PACKAGES);
      await webR.evalRVoid(`
        webr::install("metafor", repos = c(
          "https://repo.r-wasm.org",
          "https://wviechtb.r-universe.dev"
        ))
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

  // ── Run R Code ──
  const handleRun = async () => {
    if (!webRRef.current || !rCode) return;
    const webR = webRRef.current;

    setStatus(STATUS.RUNNING);
    setROutput(null);
    setForestImg(null);
    setFunnelImg(null);
    setAiResult(null);
    setErrorMsg(null);

    try {
      const shelter = await new webR.Shelter();

      // Split code: run data + model first (no plots), capture text output
      // Then run forest and funnel separately to capture each plot
      const codeLines = rCode.split("\n");
      const plotIdx = codeLines.findIndex(l => l.trim().startsWith("forest("));
      const funnelIdx = codeLines.findIndex(l => l.trim().startsWith("funnel("));

      // Everything before forest() is the analysis code
      const analysisEnd = Math.min(
        plotIdx >= 0 ? plotIdx : codeLines.length,
        funnelIdx >= 0 ? funnelIdx : codeLines.length
      );
      const analysisCode = codeLines.slice(0, analysisEnd).join("\n");

      // Extract forest and funnel lines (may span multiple lines)
      let forestCode = "";
      let funnelCode = "";
      if (plotIdx >= 0) {
        // Grab from forest( until the next blank line or funnel( or end
        let end = plotIdx + 1;
        while (end < codeLines.length && codeLines[end].trim() !== "" && !codeLines[end].trim().startsWith("funnel(") && !codeLines[end].trim().startsWith("#")) {
          end++;
        }
        forestCode = codeLines.slice(plotIdx, end).join("\n");
      }
      if (funnelIdx >= 0) {
        let end = funnelIdx + 1;
        while (end < codeLines.length && codeLines[end].trim() !== "" && !codeLines[end].trim().startsWith("#")) {
          end++;
        }
        funnelCode = codeLines.slice(funnelIdx, end).join("\n");
      }

      // 1. Run analysis code and capture text output
      const analysisResult = await shelter.captureR(analysisCode, {
        withAutoprint: true,
        captureStreams: true,
        captureConditions: false,
      });

      const outputText = [
        ...analysisResult.output.map(o => o.data),
      ].join("\n");
      setROutput(outputText);

      // 2. Run forest plot and capture image
      if (forestCode) {
        const forestResult = await shelter.captureR(forestCode, {
          withAutoprint: true,
          captureStreams: true,
          captureConditions: false,
        });
        if (forestResult.images && forestResult.images.length > 0) {
          setForestImg(forestResult.images[forestResult.images.length - 1]);
        }
      }

      // 3. Run funnel plot and capture image
      if (funnelCode) {
        const funnelResult = await shelter.captureR(funnelCode, {
          withAutoprint: true,
          captureStreams: true,
          captureConditions: false,
        });
        if (funnelResult.images && funnelResult.images.length > 0) {
          setFunnelImg(funnelResult.images[funnelResult.images.length - 1]);
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

  // ── Draw image to canvas ──
  const drawToCanvas = useCallback((canvasRef, img) => {
    if (!canvasRef.current || !img) return;
    const canvas = canvasRef.current;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }, []);

  useEffect(() => { drawToCanvas(forestCanvasRef, forestImg); }, [forestImg, drawToCanvas]);
  useEffect(() => { drawToCanvas(funnelCanvasRef, funnelImg); }, [funnelImg, drawToCanvas]);

  // ── Download plot as PNG ──
  const downloadCanvas = (canvasRef, filename) => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  // ── AI Interpretation ──
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

  // ═══ RENDER ═══

  const isLoading = status === STATUS.LOADING_ENGINE || status === STATUS.LOADING_PACKAGES;
  const isReady = status === STATUS.READY || status === STATUS.DONE;

  return (
    <div style={{ fontFamily: FONT }}>

      {/* ── Loading State ── */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: DARK, marginBottom: 20 }}>
            {tx.initTitle}
          </div>

          {/* Progress steps */}
          <div style={{ display: "flex", justifyContent: "center", gap: 0, marginBottom: 24, maxWidth: 360, margin: "0 auto 24px" }}>
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
                    fontSize: 12, fontWeight: 700,
                    transition: "all 0.3s",
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

          {/* Animated loading bar */}
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

      {/* ── Results ── */}
      {status === STATUS.DONE && (
        <div>

          {/* Forest Plot */}
          {forestImg && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  📊 {tx.forestTitle}
                </h4>
                <button onClick={() => downloadCanvas(forestCanvasRef, "forest_plot.png")}
                  style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1px solid ${LIGHT_BORDER}`, background: CARD_BG, color: MUTED }}>
                  📥 {tx.downloadForest}
                </button>
              </div>
              <div style={{ background: "#FFF", borderRadius: 12, border: `1px solid ${LIGHT_BORDER}`, padding: 12, overflow: "auto" }}>
                <canvas ref={forestCanvasRef} style={{ maxWidth: "100%", height: "auto", display: "block" }} />
              </div>
            </div>
          )}

          {/* Funnel Plot */}
          {funnelImg && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: DARK, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                  📊 {tx.funnelTitle}
                </h4>
                <button onClick={() => downloadCanvas(funnelCanvasRef, "funnel_plot.png")}
                  style={{ padding: "4px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: FONT, cursor: "pointer", border: `1px solid ${LIGHT_BORDER}`, background: CARD_BG, color: MUTED }}>
                  📥 {tx.downloadFunnel}
                </button>
              </div>
              <div style={{ background: "#FFF", borderRadius: 12, border: `1px solid ${LIGHT_BORDER}`, padding: 12, overflow: "auto" }}>
                <canvas ref={funnelCanvasRef} style={{ maxWidth: "100%", height: "auto", display: "block" }} />
              </div>
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

          {/* AI Interpret Button */}
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

          {/* AI Result */}
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

          {/* Execution error during run (but we still have partial output) */}
          {errorMsg && (
            <div style={{ background: `${AMBER}10`, border: `1px solid ${AMBER}30`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: DARK, marginTop: 12 }}>
              ⚠️ {tx.errorTitle}: <span style={{ fontFamily: "monospace", fontSize: 12 }}>{errorMsg}</span>
              <div style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>{tx.errorHint}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
