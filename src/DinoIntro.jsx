// ═══════════════════════════════════════════════════════════
//  DinoIntro.jsx — RPG-style Dino Codex / Character Intro page
//  Linked from ProfilePage dino cards; also accessible via #dino
// ═══════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import CuteDino from "./CuteDino";
import SiteNav from "./SiteNav";
import { useI18n } from "./i18n";

const TEAL = "#0E7C86";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const FONT = "'Noto Sans TC', 'Outfit', sans-serif";
const SERIF = "'Noto Sans TC', 'Source Serif 4', serif";

const DINOS = [
  {
    nameEn: "Rex", nameZh: "翠牙龍",
    speciesEn: "T-Rex", speciesZh: "暴龍",
    color: "#2ECC71",
    element: { en: "🌿 Nature", zh: "🌿 自然" },
    personality: { en: "Bold & Fearless", zh: "勇敢無畏" },
    skill: { en: "Critical Appraisal", zh: "批判性評估" },
    loreEn: "The undisputed king of the dino squad. Rex has a massive head full of knowledge about research methodology — and tiny arms that remind us even experts have limitations. Rex specialises in critically appraising study quality with raw intellectual power.",
    loreZh: "恐龍小隊中無可爭議的王者。翠牙龍的大腦袋裝滿了研究方法學的知識——而小短手提醒我們，即使是專家也有侷限。翠牙龍擅長以強大的思辨能力批判性地評估研究品質。",
    stats: { power: 95, wisdom: 70, speed: 60, charm: 50 },
    course: 0,
  },
  {
    nameEn: "Azure", nameZh: "蒼瀾龍",
    speciesEn: "Plesiosaur", speciesZh: "蛇頸龍",
    color: "#3498DB",
    element: { en: "🌊 Water", zh: "🌊 水" },
    personality: { en: "Calm & Deep", zh: "沉穩深邃" },
    skill: { en: "Literature Search", zh: "文獻檢索" },
    loreEn: "Azure dives deep beneath the surface of medical literature, navigating vast oceans of databases with grace. No hidden study escapes Azure's long, sweeping searches. Patient and methodical, Azure ensures your systematic review misses nothing.",
    loreZh: "蒼瀾龍能深潛至醫學文獻的海底，優雅地穿梭於浩瀚的資料庫之間。沒有任何隱藏的研究能逃過蒼瀾龍的廣泛搜索。耐心而有系統，蒼瀾龍確保你的系統性綜論不遺漏任何重要研究。",
    stats: { power: 40, wisdom: 95, speed: 50, charm: 75 },
    course: 2,
  },
  {
    nameEn: "Zephyr", nameZh: "金翼龍",
    speciesEn: "Pterodactyl", speciesZh: "翼龍",
    color: "#F1C40F",
    element: { en: "🌬️ Wind", zh: "🌬️ 風" },
    personality: { en: "Swift & Visionary", zh: "敏捷遠見" },
    skill: { en: "Data Visualisation", zh: "數據視覺化" },
    loreEn: "Zephyr soars above the data landscape, spotting patterns invisible from the ground. With a bird's-eye view of forest plots and funnel plots, Zephyr transforms raw numbers into clear visual stories that even non-statisticians can understand.",
    loreZh: "金翼龍翱翔於數據全景之上，能發現地面上看不到的隱藏模式。憑藉對森林圖和漏斗圖的鳥瞰視角，金翼龍將原始數據轉化為清晰的視覺故事，讓非統計學者也能輕鬆理解。",
    stats: { power: 35, wisdom: 80, speed: 95, charm: 85 },
    course: 4,
  },
  {
    nameEn: "Blaze", nameZh: "焰角龍",
    speciesEn: "Triceratops", speciesZh: "三角龍",
    color: "#E74C3C",
    element: { en: "🔥 Fire", zh: "🔥 火" },
    personality: { en: "Steady & Protective", zh: "穩重守護" },
    skill: { en: "Risk of Bias Assessment", zh: "偏差風險評估" },
    loreEn: "With a shield-like frill and three sturdy horns, Blaze stands guard against bias and methodological flaws. Nothing gets past Blaze's defences — every study is scrutinised from allocation concealment to blinding. Blaze protects the integrity of your evidence.",
    loreZh: "頭上的盾狀頸盾與三根堅固的角讓焰角龍堅守防線，抵禦偏差與方法學上的缺陷。沒有什麼能突破焰角龍的防禦——從分配隱藏到盲法，每項研究都被嚴格審查。焰角龍守護著你的證據完整性。",
    stats: { power: 80, wisdom: 85, speed: 30, charm: 55 },
    course: 3,
  },
  {
    nameEn: "Thistle", nameZh: "紫棘龍",
    speciesEn: "Stegosaurus", speciesZh: "劍龍",
    color: "#9B59B6",
    element: { en: "🌸 Bloom", zh: "🌸 花" },
    personality: { en: "Gentle & Analytical", zh: "溫柔嚴謹" },
    skill: { en: "Heterogeneity Analysis", zh: "異質性分析" },
    loreEn: "Thistle's colourful back plates aren't just for show — each one represents a different subgroup in the analysis. Gentle but precise, Thistle excels at I² statistics and subgroup analyses, revealing why studies sometimes disagree with one another.",
    loreZh: "紫棘龍背上的彩色骨板不只是裝飾——每一片都代表分析中的不同亞組。溫柔但精確，紫棘龍擅長 I² 統計量與亞組分析，揭示為何研究之間有時會產生不一致的結果。",
    stats: { power: 45, wisdom: 90, speed: 40, charm: 90 },
    course: 5,
  },
  {
    nameEn: "Velo", nameZh: "珀爪龍",
    speciesEn: "Velociraptor", speciesZh: "迅猛龍",
    color: "#E67E22",
    element: { en: "⚡ Lightning", zh: "⚡ 閃電" },
    personality: { en: "Clever & Quick", zh: "機智敏捷" },
    skill: { en: "PICO Framework", zh: "PICO 架構" },
    loreEn: "Small but devastatingly clever, Velo can dissect any clinical question into its PICO components in seconds. Working in packs (of studies), Velo hunts down the precise Population, Intervention, Comparison, and Outcome with surgical accuracy.",
    loreZh: "體型雖小卻聰明絕頂，珀爪龍能在數秒內將任何臨床問題拆解為 PICO 要素。以團隊（研究群）作戰，珀爪龍以外科手術般的精準度，搜尋出確切的族群、介入、比較和結果。",
    stats: { power: 70, wisdom: 75, speed: 95, charm: 60 },
    course: 1,
  },
  {
    nameEn: "Dome", nameZh: "鐵穹龍",
    speciesEn: "Pachycephalosaurus", speciesZh: "厚頭龍",
    color: "#95A5A6",
    element: { en: "🪨 Earth", zh: "🪨 岩" },
    personality: { en: "Stubborn & Thorough", zh: "堅毅徹底" },
    skill: { en: "Data Extraction", zh: "資料萃取" },
    loreEn: "Dome's thick skull isn't just protection — it represents an unbreakable focus on extracting the right data from every study. Dome headbutts through supplementary materials, appendices, and buried tables until every number is accounted for.",
    loreZh: "鐵穹龍厚實的頭骨不只是防護——它象徵著從每項研究中萃取正確數據時堅不可摧的專注力。鐵穹龍會以鐵頭功穿越補充材料、附錄和深埋的表格，直到每個數字都被確認無誤。",
    stats: { power: 85, wisdom: 80, speed: 35, charm: 40 },
    course: 3,
  },
];

const COURSE_LABELS_EN = [
  "C0 · What is Meta-Analysis",
  "C1 · PICO Framework",
  "C2 · Literature Search",
  "C3 · Data Extraction & RoB",
  "C4 · Forest Plots",
  "C5 · Heterogeneity",
];
const COURSE_LABELS_ZH = [
  "C0 · 統合分析簡介",
  "C1 · PICO 架構",
  "C2 · 文獻檢索",
  "C3 · 資料萃取與偏差風險",
  "C4 · 森林圖",
  "C5 · 異質性分析",
];

/* ── Stat bar component ── */
function StatBar({ label, value, color }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(t);
  }, [value]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
      <div style={{ width: 60, fontSize: 11, fontWeight: 600, color: MUTED, textAlign: "right", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ flex: 1, height: 8, background: "#F1F0EC", borderRadius: 4, overflow: "hidden" }}>
        <div style={{
          width: `${width}%`, height: "100%", borderRadius: 4,
          background: `linear-gradient(90deg, ${color}, ${color}BB)`,
          transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
        }} />
      </div>
      <div style={{ width: 28, fontSize: 11, fontWeight: 700, color: DARK, textAlign: "right" }}>{value}</div>
    </div>
  );
}

/* ── Main DinoIntro page ── */
export default function DinoIntro({ onNavigate, user, onLogin, onLogout, initialDino = null }) {
  const { t, lang } = useI18n();
  const [selected, setSelected] = useState(initialDino ?? 0);
  const [fadeKey, setFadeKey] = useState(0);
  const detailRef = useRef(null);

  // Parse URL param ?dino=3
  useEffect(() => {
    if (initialDino !== null) return;
    const hash = window.location.hash;
    const match = hash.match(/dino(?:=|%3D)(\d)/);
    if (match) setSelected(Number(match[1]));
  }, [initialDino]);

  const handleSelect = (i) => {
    setSelected(i);
    setFadeKey(k => k + 1);
    if (detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const dino = DINOS[selected];
  const courseLabels = lang === "zh" ? COURSE_LABELS_ZH : COURSE_LABELS_EN;
  const isZh = lang === "zh";

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <SiteNav onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} />

      <div style={{ paddingTop: 80, maxWidth: 800, margin: "0 auto", padding: "80px 24px 60px" }}>

        {/* ─── Header ─── */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-block", padding: "4px 14px", borderRadius: 20,
            background: `${TEAL}0D`, color: TEAL, fontSize: 12, fontWeight: 600,
            letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 12,
          }}>
            {isZh ? "🦕 恐龍圖鑑" : "🦕 Dino Codex"}
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 28, fontWeight: 800, color: DARK, lineHeight: 1.3 }}>
            {isZh ? "認識你的恐龍夥伴" : "Meet Your Dino Companions"}
          </h1>
          <p style={{ fontSize: 14, color: MUTED, marginTop: 8, maxWidth: 480, margin: "8px auto 0" }}>
            {isZh
              ? "每隻恐龍都擁有獨特的研究技能。點擊下方的恐龍，了解牠們的故事與能力。"
              : "Each dino has a unique research skill. Tap one below to discover their story and abilities."}
          </p>
        </div>

        {/* ─── Roster strip ─── */}
        <div style={{
          display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8,
          marginBottom: 36, padding: "0 8px",
        }}>
          {DINOS.map((d, i) => {
            const isActive = selected === i;
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{
                background: isActive ? `${d.color}15` : CARD_BG,
                border: `2px solid ${isActive ? d.color : LIGHT_BORDER}`,
                borderRadius: 14, padding: "10px 8px 8px", cursor: "pointer",
                width: 90, textAlign: "center",
                transition: "all 0.25s ease",
                transform: isActive ? "scale(1.05)" : "scale(1)",
                boxShadow: isActive ? `0 4px 16px ${d.color}22` : "0 1px 4px #0001",
                outline: "none",
              }}>
                <div style={{
                  animation: isActive ? "breathe 2.5s ease-in-out infinite" : "none",
                }}>
                  <CuteDino color={d.color} size={52} index={i} />
                </div>
                <div style={{
                  fontSize: 11, fontWeight: 700, color: isActive ? d.color : MUTED,
                  marginTop: 4, transition: "color 0.2s",
                }}>
                  {isZh ? d.nameZh : d.nameEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* ─── Detail card ─── */}
        <div ref={detailRef} key={fadeKey} style={{
          background: CARD_BG,
          border: `1.5px solid ${dino.color}33`,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: `0 8px 32px ${dino.color}11`,
          animation: "fadeSlideIn 0.45s ease-out",
          marginBottom: 32,
        }}>
          {/* Top banner with gradient */}
          <div style={{
            background: `linear-gradient(135deg, ${dino.color}18 0%, ${dino.color}08 100%)`,
            padding: "32px 24px 20px",
            display: "flex", flexDirection: "column", alignItems: "center",
            position: "relative",
          }}>
            {/* Element badge */}
            <div style={{
              position: "absolute", top: 16, right: 16,
              background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`,
              borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: MUTED,
            }}>
              {isZh ? dino.element.zh : dino.element.en}
            </div>

            {/* Dino illustration */}
            <div style={{ animation: "breathe 3s ease-in-out infinite" }}>
              <CuteDino color={dino.color} size={160} index={selected} />
            </div>

            {/* Name & species */}
            <h2 style={{
              fontFamily: SERIF, fontSize: 26, fontWeight: 800, color: DARK, marginTop: 12,
            }}>
              {isZh ? dino.nameZh : dino.nameEn}
              <span style={{ fontSize: 15, fontWeight: 400, color: MUTED, marginLeft: 8 }}>
                {isZh ? dino.speciesZh : dino.speciesEn}
              </span>
            </h2>

            {/* Personality tag */}
            <div style={{
              marginTop: 8, display: "inline-block",
              background: `${dino.color}15`, color: dino.color,
              padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            }}>
              {isZh ? dino.personality.zh : dino.personality.en}
            </div>
          </div>

          {/* Body content */}
          <div style={{ padding: "24px 28px 28px" }}>
            {/* Skill & Course badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              <div style={{
                background: `${dino.color}0A`, border: `1px solid ${dino.color}22`,
                borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: DARK,
              }}>
                🎯 {isZh ? `技能：${dino.skill.zh}` : `Skill: ${dino.skill.en}`}
              </div>
              <div style={{
                background: `${TEAL}0A`, border: `1px solid ${TEAL}22`,
                borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, color: TEAL,
              }}>
                📖 {courseLabels[dino.course]}
              </div>
            </div>

            {/* Lore / backstory */}
            <div style={{
              fontSize: 14, lineHeight: 1.75, color: DARK,
              padding: "16px 20px", borderRadius: 12,
              background: "#FAFAF8", border: `1px solid ${LIGHT_BORDER}`,
              marginBottom: 24,
              fontStyle: "italic",
            }}>
              "{isZh ? dino.loreZh : dino.loreEn}"
            </div>

            {/* Stats */}
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
              color: TEAL, marginBottom: 12,
            }}>
              {isZh ? "能力值" : "Stats"}
            </div>
            <StatBar label={isZh ? "力量" : "PWR"} value={dino.stats.power} color={dino.color} />
            <StatBar label={isZh ? "智慧" : "WIS"} value={dino.stats.wisdom} color={dino.color} />
            <StatBar label={isZh ? "速度" : "SPD"} value={dino.stats.speed} color={dino.color} />
            <StatBar label={isZh ? "魅力" : "CHR"} value={dino.stats.charm} color={dino.color} />

            {/* Go to course CTA */}
            {onNavigate && (
              <button onClick={() => onNavigate(`course${dino.course}`)} style={{
                marginTop: 20, width: "100%",
                background: `linear-gradient(135deg, ${dino.color}, ${dino.color}CC)`,
                border: "none", color: "#FFF", padding: "12px 20px",
                borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: FONT, transition: "transform 0.15s, box-shadow 0.15s",
                boxShadow: `0 4px 16px ${dino.color}33`,
              }}
                onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {isZh
                  ? `前往 ${courseLabels[dino.course]} →`
                  : `Go to ${courseLabels[dino.course]} →`}
              </button>
            )}
          </div>
        </div>

        {/* ─── Back to profile ─── */}
        {onNavigate && (
          <div style={{ textAlign: "center" }}>
            <button onClick={() => onNavigate("profile")} style={{
              background: "none", border: `1.5px solid ${LIGHT_BORDER}`, borderRadius: 10,
              padding: "10px 24px", fontSize: 13, fontWeight: 600, color: MUTED,
              cursor: "pointer", fontFamily: FONT, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = TEAL; e.currentTarget.style.color = TEAL; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = LIGHT_BORDER; e.currentTarget.style.color = MUTED; }}
            >
              ← {isZh ? "返回個人檔案" : "Back to Profile"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
