import { useState, useEffect } from "react";
import { useI18n } from "./i18n";
import { supabase } from "./supabaseClient";
import SiteNav from "./SiteNav";

const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const FONT = "'Noto Sans TC', 'Outfit', sans-serif";
const SERIF = "'Noto Sans TC', 'Source Serif 4', serif";

const GAME_TYPES = [
  { key: "egg_hunt", emoji: "🥚", course: 0, color: "#0E7C86", maxScore: 7 },
  { key: "dino_hatch", emoji: "🐣", course: 1, color: "#E8734A", maxScore: 5 },
  { key: "food_rescue", emoji: "🍖", course: 2, color: "#7B68C8", maxScore: 5 },
  { key: "home_save", emoji: "🏠", course: 3, color: "#D4A843", maxScore: 5 },
  { key: "key_quest", emoji: "🔑", course: 4, color: "#2E86C1", maxScore: 9 },
  { key: "door_escape", emoji: "🚪", course: 5, color: "#C0392B", maxScore: 9 },
];

const DINO_NAMES_EN = ["Rex", "Azure", "Zephyr", "Blaze", "Thistle", "Velo", "Dome"];
const DINO_NAMES_ZH = ["翠牙龍", "蒼瀾龍", "金翼龍", "焰角龍", "紫棘龍", "珀爪龍", "鐵穹龍"];
const DINO_COLORS = ["#2ECC71", "#3498DB", "#F1C40F", "#E74C3C", "#9B59B6", "#E67E22", "#95A5A6"];

export default function ProfilePage({ onNavigate, user, onLogin, onLogout }) {
  const { t, lang } = useI18n();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredDino, setHoveredDino] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const fetchProgress = async () => {
      try {
        const { data, error } = await supabase
          .from("progress")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false });
        if (!error && data) setProgress(data);
      } catch (e) {
        console.error("Failed to load progress:", e);
      }
      setLoading(false);
    };
    fetchProgress();
  }, [user]);

  // Derive stats from progress data (using dino_index, not species name)
  const eggsCollected = new Set(progress.filter(p => p.course === 0 && p.result === "collected").map(p => p.dino_index)).size;
  const hatchedSet = new Set(progress.filter(p => p.course === 1 && p.result === "hatched").map(p => p.dino_index));
  const rescuedSet = new Set(progress.filter(p => p.course === 2 && p.result === "rescued").map(p => p.dino_index));
  const savedSet = new Set(progress.filter(p => p.course === 3 && p.result === "saved").map(p => p.dino_index));
  const unlockedSet = new Set(progress.filter(p => p.course === 4 && p.result === "unlocked").map(p => p.dino_index));
  const escapedSet = new Set(progress.filter(p => p.course === 5 && p.result === "escaped").map(p => p.dino_index));

  const bestScores = {};
  GAME_TYPES.forEach(g => {
    const games = progress.filter(p => p.game_type === g.key);
    if (games.length > 0) {
      if (g.key === "egg_hunt") {
        // C0 saves one row per egg — count unique collected eggs
        bestScores[g.key] = { score: eggsCollected, maxScore: g.maxScore };
      } else {
        bestScores[g.key] = {
          score: Math.max(...games.map(p => p.score || 0)),
          maxScore: g.maxScore,
        };
      }
    }
  });

  const dinoNames = lang === "zh" ? DINO_NAMES_ZH : DINO_NAMES_EN;
  const isZh = lang === "zh";

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
      `}</style>

      <SiteNav onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} />

      <div style={{ paddingTop: 80, maxWidth: 720, margin: "0 auto", padding: "80px 24px 80px" }}>

        {/* Not logged in */}
        {!user ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: DARK, marginBottom: 12 }}>
              {t("profileLoginRequired")}
            </h2>
            <p style={{ fontSize: 14, color: MUTED, marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
              {t("profileLoginDesc")}
            </p>
            <button onClick={onLogin} style={{
              background: TEAL, border: "none", color: "#FFF", padding: "12px 24px",
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 8, fontFamily: FONT,
              boxShadow: `0 2px 12px ${TEAL}33`,
            }}>
              <span style={{ fontSize: 16 }}>G</span> {t("navLoginSave")}
            </button>
          </div>
        ) : (
          <>
            {/* User header */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
              <img
                src={user.user_metadata?.avatar_url || user.user_metadata?.picture}
                alt=""
                style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${TEAL}22` }}
              />
              <div>
                <h1 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, color: DARK }}>
                  {user.user_metadata?.full_name || user.user_metadata?.name || "User"}
                </h1>
                <p style={{ fontSize: 13, color: MUTED }}>{user.email}</p>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: MUTED }}>
                {isZh ? "載入中..." : "Loading..."}
              </div>
            ) : (
              <>
                {/* Progress overview cards */}
                <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>
                  {t("profileOverview")}
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 12, marginBottom: 32 }}>
                  {/* Eggs */}
                  <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🥚</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: DARK }}>{eggsCollected}<span style={{ fontSize: 14, color: MUTED, fontWeight: 400 }}>/7</span></div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{t("profileEggs")}</div>
                  </div>

                  {/* Hatched */}
                  <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🐣</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: DARK }}>{hatchedSet.size}<span style={{ fontSize: 14, color: MUTED, fontWeight: 400 }}>/7</span></div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{t("profileHatched")}</div>
                  </div>

                  {/* Rescued */}
                  <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🍖</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: DARK }}>{rescuedSet.size}<span style={{ fontSize: 14, color: MUTED, fontWeight: 400 }}>/7</span></div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{t("profileFed")}</div>
                  </div>

                  {/* Homes saved */}
                  <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🏠</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: DARK }}>{savedSet.size}<span style={{ fontSize: 14, color: MUTED, fontWeight: 400 }}>/7</span></div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{t("profileSaved")}</div>
                  </div>

                  {/* Keys unlocked */}
                  <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🔑</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: DARK }}>{unlockedSet.size}<span style={{ fontSize: 14, color: MUTED, fontWeight: 400 }}>/7</span></div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{isZh ? "鑰匙" : "Keys"}</div>
                  </div>

                  {/* Escaped */}
                  <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, padding: "20px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🚪</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: DARK }}>{escapedSet.size}<span style={{ fontSize: 14, color: MUTED, fontWeight: 400 }}>/7</span></div>
                    <div style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>{isZh ? "逃脫" : "Escaped"}</div>
                  </div>
                </div>

                {/* Dino collection — now clickable! */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: TEAL }}>
                    {t("profileDinoCollection")}
                  </h2>
                  <button onClick={() => onNavigate("dino")} style={{
                    background: "none", border: "none", color: TEAL, fontSize: 12,
                    fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    {isZh ? "查看圖鑑" : "View Codex"} →
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 32 }}>
                  {DINO_NAMES_EN.map((name, i) => {
                    const isHatched = hatchedSet.has(i);
                    const isRescued = rescuedSet.has(i);
                    const isSaved = savedSet.has(i);
                    const isUnlocked = unlockedSet.has(i);
                    const isEscaped = escapedSet.has(i);
                    const hasAny = isHatched || isRescued || isSaved || isUnlocked || isEscaped;
                    const isHovered = hoveredDino === i;

                    return (
                      <div
                        key={name}
                        onClick={() => onNavigate(`dino=${i}`)}
                        onMouseEnter={() => setHoveredDino(i)}
                        onMouseLeave={() => setHoveredDino(null)}
                        style={{
                          background: CARD_BG,
                          border: `1.5px solid ${isHovered ? DINO_COLORS[i] : (hasAny ? DINO_COLORS[i] + "44" : LIGHT_BORDER)}`,
                          borderRadius: 14, padding: "16px 12px", textAlign: "center",
                          opacity: hasAny ? 1 : 0.65,
                          cursor: "pointer",
                          transition: "all 0.25s ease",
                          transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                          boxShadow: isHovered ? `0 6px 20px ${DINO_COLORS[i]}22` : "0 1px 4px #0001",
                        }}
                      >
                        <div style={{
                          width: 48, height: 48, borderRadius: "50%", margin: "0 auto 8px",
                          background: hasAny ? `${DINO_COLORS[i]}15` : "#F1F0EC",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 24,
                        }}>
                          {hasAny ? "🦕" : "❓"}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: hasAny ? DARK : MUTED, marginBottom: 4 }}>
                          {hasAny ? dinoNames[i] : "???"}
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 4 }}>
                          <span title={isZh ? "孵化" : "Hatched"} style={{ fontSize: 14, opacity: isHatched ? 1 : 0.2 }}>🐣</span>
                          <span title={isZh ? "餵食" : "Rescued"} style={{ fontSize: 14, opacity: isRescued ? 1 : 0.2 }}>🍖</span>
                          <span title={isZh ? "拯救" : "Saved"} style={{ fontSize: 14, opacity: isSaved ? 1 : 0.2 }}>🏠</span>
                          <span title={isZh ? "鑰匙" : "Key"} style={{ fontSize: 14, opacity: isUnlocked ? 1 : 0.2 }}>🔑</span>
                          <span title={isZh ? "逃脫" : "Escaped"} style={{ fontSize: 14, opacity: isEscaped ? 1 : 0.2 }}>🚪</span>
                        </div>
                        {/* Tap to view hint */}
                        <div style={{
                          fontSize: 10, color: isHovered ? DINO_COLORS[i] : MUTED,
                          fontWeight: 500, transition: "color 0.2s",
                          opacity: isHovered ? 1 : 0.5,
                        }}>
                          {isZh ? "點擊查看 →" : "Tap to view →"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Best scores */}
                {Object.keys(bestScores).length > 0 && (
                  <>
                    <h2 style={{ fontSize: 14, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: TEAL, marginBottom: 16 }}>
                      {t("profileBestScores")}
                    </h2>
                    <div style={{ background: CARD_BG, border: `1px solid ${LIGHT_BORDER}`, borderRadius: 14, overflow: "hidden", marginBottom: 32 }}>
                      {GAME_TYPES.map((g) => {
                        const bs = bestScores[g.key];
                        if (!bs) return null;
                        return (
                          <div key={g.key} style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
                            borderBottom: `1px solid ${LIGHT_BORDER}`,
                          }}>
                            <span style={{ fontSize: 20 }}>{g.emoji}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: DARK }}>{t(`profileGame${g.course}`)}</div>
                              <div style={{ fontSize: 11, color: MUTED }}>Course {g.course}</div>
                            </div>
                            <div style={{
                              background: `${g.color}0D`, color: g.color, padding: "4px 12px",
                              borderRadius: 8, fontSize: 14, fontWeight: 700,
                            }}>{bs.score}/{bs.maxScore}</div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* No data state */}
                {progress.length === 0 && (
                  <div style={{ textAlign: "center", padding: "32px 0" }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🦖</div>
                    <p style={{ fontSize: 15, color: MUTED, marginBottom: 20 }}>
                      {t("profileEmpty")}
                    </p>
                    <button onClick={() => onNavigate("hub")} style={{
                      background: TEAL, border: "none", color: "#FFF", padding: "10px 24px",
                      borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                    }}>
                      {t("profileStartLearning")}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
