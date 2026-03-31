import { useState, useEffect, useRef } from "react";
import { useI18n } from "./i18n";

const TEAL = "#0E7C86";
const DARK = "#1D2B3A";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const FONT = "'Noto Sans TC', 'Outfit', sans-serif";

const COURSES = [
  { id: "course0", num: "0", titleKey: "hubC0Title", color: "#0E7C86", emoji: "🧬" },
  { id: "course1", num: "1", titleKey: "hubC1Title", color: "#E8734A", emoji: "🎯" },
  { id: "course2", num: "2", titleKey: "hubC2Title", color: "#7B68C8", emoji: "🔍" },
  { id: "course3", num: "3", titleKey: "hubC3Title", color: "#D4A843", emoji: "📋" },
  { id: "course4", num: "4", titleKey: "hubC4Title", color: "#2E86C1", emoji: "📊" },
  { id: "course5", num: "5", titleKey: "hubC5Title", color: "#C0392B", emoji: "🔬" },
];

function CourseDropdown({ onNavigate, t, currentCourse }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "none", border: "none", color: open ? TEAL : MUTED,
          padding: "6px 10px", borderRadius: 8, fontSize: 13,
          cursor: "pointer", fontFamily: FONT,
          fontWeight: 500, transition: "color 0.2s",
          display: "flex", alignItems: "center", gap: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
        onMouseLeave={(e) => (e.currentTarget.style.color = open ? TEAL : MUTED)}
      >
        {t("navCourses")}
        <span style={{
          fontSize: 10, transition: "transform 0.2s", display: "inline-block",
          transform: open ? "rotate(180deg)" : "rotate(0)",
        }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: "#FFFFFF", border: `1px solid ${LIGHT_BORDER}`,
          borderRadius: 12, padding: "6px", minWidth: 260, fontFamily: FONT,
          boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
          zIndex: 200, animation: "navDropIn 0.15s ease-out",
        }}>
          {COURSES.map((c) => {
            const isActive = currentCourse === c.id;
            return (
              <button
                key={c.id}
                onClick={() => { onNavigate(c.id); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 12px", border: "none",
                  background: isActive ? `${c.color}0D` : "transparent",
                  borderRadius: 8, cursor: "pointer", transition: "background 0.15s",
                  textAlign: "left", fontFamily: FONT,
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F8F7F4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isActive ? `${c.color}0D` : "transparent"; }}
              >
                <span style={{ fontSize: 16, width: 24, textAlign: "center" }}>{c.emoji}</span>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: c.color, fontFamily: FONT }}>
                    Course {c.num}
                  </span>
                  <div style={{ fontSize: 12.5, fontWeight: isActive ? 600 : 400, color: isActive ? DARK : MUTED, lineHeight: 1.3, fontFamily: FONT }}>
                    {t(c.titleKey)}
                  </div>
                </div>
                {isActive && <span style={{ marginLeft: "auto", fontSize: 11, color: c.color }}>●</span>}
              </button>
            );
          })}
          <div style={{ borderTop: `1px solid ${LIGHT_BORDER}`, margin: "4px 0" }} />
          <button
            onClick={() => { onNavigate("hub"); setOpen(false); }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", padding: "10px 12px", border: "none",
              background: "transparent", borderRadius: 8, cursor: "pointer",
              transition: "background 0.15s", textAlign: "left",
              fontSize: 12.5, fontWeight: 500, color: TEAL, fontFamily: FONT,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F8F7F4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            ← {t("aboutBackToHub")}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SiteNav({ onNavigate, user, onLogin, onLogout, courseId, courseLabel, courseColor }) {
  const { t, lang, toggleLang } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isInCourse = !!courseId;

  return (
    <>
      <style>{`
        @keyframes navDropIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .nav-desktop-items { display: none !important; }
          .nav-mobile-toggle { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile-toggle { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 16px", fontFamily: FONT,
        background: "rgba(248,247,244,0.92)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${LIGHT_BORDER}`,
      }}>
        {/* LEFT */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isInCourse && onNavigate && (
            <button onClick={() => onNavigate("hub")} style={{
              background: "none", border: "none", cursor: "pointer", color: MUTED,
              fontSize: 16, padding: "4px 6px", borderRadius: 6, transition: "color 0.2s",
              display: "flex", alignItems: "center", fontFamily: FONT,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
              onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
            >←</button>
          )}

          <div onClick={() => onNavigate && onNavigate("hub")} style={{
            fontFamily: "'Noto Sans TC', 'Source Serif 4', serif",
            fontSize: 16, fontWeight: 700, color: TEAL, cursor: "pointer",
            letterSpacing: -0.3, whiteSpace: "nowrap",
          }}>
            {t("hubNavTitle")} <span style={{ fontWeight: 400, color: MUTED, fontSize: 14 }}>{t("hubNavSuffix")}</span>
          </div>

          {isInCourse && courseLabel && (
            <>
              <span style={{ color: LIGHT_BORDER, fontSize: 14, margin: "0 2px" }}>/</span>
              <span style={{
                fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase",
                color: courseColor || TEAL, background: `${courseColor || TEAL}0D`,
                padding: "3px 8px", borderRadius: 5, border: `1px solid ${courseColor || TEAL}22`,
                whiteSpace: "nowrap", fontFamily: FONT,
              }}>{courseLabel}</span>
            </>
          )}
        </div>

        {/* RIGHT — Desktop */}
        <div className="nav-desktop-items" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <CourseDropdown onNavigate={onNavigate} t={t} currentCourse={courseId} />

          <button
            onClick={() => onNavigate("about")}
            style={{
              background: "none", border: "none", color: MUTED,
              padding: "6px 10px", borderRadius: 8, fontSize: 13,
              cursor: "pointer", fontFamily: FONT,
              fontWeight: 500, transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
            onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}
          >{t("navAbout")}</button>

          <div style={{ width: 1, height: 20, background: LIGHT_BORDER, margin: "0 4px" }} />

          {/* User area — clickable avatar goes to profile */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                onClick={() => onNavigate("profile")}
                style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", padding: "3px 6px", borderRadius: 8, transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F1F0EC")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" style={{ width: 26, height: 26, borderRadius: "50%" }} />
                <span style={{ fontSize: 12, color: DARK, fontWeight: 500, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: FONT }}>
                  {user.user_metadata?.full_name || user.user_metadata?.name || "User"}
                </span>
              </div>
              <button onClick={onLogout} style={{
                background: "none", border: `1px solid ${LIGHT_BORDER}`, color: MUTED,
                padding: "3px 8px", borderRadius: 6, fontSize: 11, cursor: "pointer", transition: "all 0.2s", fontFamily: FONT,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#E8734A"; e.currentTarget.style.color = "#E8734A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = LIGHT_BORDER; e.currentTarget.style.color = MUTED; }}
              >{t("navLogout")}</button>
            </div>
          ) : (
            <button onClick={onLogin} style={{
              background: TEAL, border: "none", color: "#FFF",
              padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
              transition: "all 0.2s", boxShadow: `0 2px 8px ${TEAL}22`, fontFamily: FONT,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <span style={{ fontSize: 13 }}>G</span> {t("navLoginSave")}
            </button>
          )}

          <button onClick={toggleLang} style={{
            background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, color: TEAL,
            padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
            cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s", marginLeft: 2, fontFamily: FONT,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = TEAL; e.currentTarget.style.color = "#FFF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${TEAL}0D`; e.currentTarget.style.color = TEAL; }}
          >{t("langSwitch")}</button>
        </div>

        {/* RIGHT — Mobile hamburger */}
        <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 8,
          display: "none", flexDirection: "column", gap: 4,
        }}>
          <div style={{ width: 20, height: 2, background: DARK, borderRadius: 1, transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translateY(6px)" : "none" }} />
          <div style={{ width: 20, height: 2, background: DARK, borderRadius: 1, transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
          <div style={{ width: 20, height: 2, background: DARK, borderRadius: 1, transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translateY(-6px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed", top: 56, left: 0, right: 0, bottom: 0, zIndex: 99,
          background: "rgba(248,247,244,0.97)", backdropFilter: "blur(16px)",
          padding: "16px 20px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto",
          fontFamily: FONT,
        }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: TEAL, padding: "8px 4px" }}>
            {t("navCourses")}
          </div>
          {COURSES.map((c) => (
            <button key={c.id} onClick={() => { onNavigate(c.id); setMobileOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "12px 8px", border: "none", fontFamily: FONT,
              background: courseId === c.id ? `${c.color}0D` : "transparent",
              borderRadius: 8, cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 16 }}>{c.emoji}</span>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: c.color, letterSpacing: 1, textTransform: "uppercase" }}>Course {c.num}</span>
                <div style={{ fontSize: 13, color: courseId === c.id ? DARK : MUTED }}>{t(c.titleKey)}</div>
              </div>
            </button>
          ))}

          <div style={{ borderTop: `1px solid ${LIGHT_BORDER}`, margin: "8px 0" }} />

          <button onClick={() => { onNavigate("about"); setMobileOpen(false); }} style={{
            background: "none", border: "none", color: MUTED, padding: "14px 8px",
            fontSize: 15, fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: FONT,
          }}>{t("navAbout")}</button>

          {user && (
            <button onClick={() => { onNavigate("profile"); setMobileOpen(false); }} style={{
              background: "none", border: "none", color: TEAL, padding: "14px 8px",
              fontSize: 15, fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: FONT,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <img src={user.user_metadata?.avatar_url || user.user_metadata?.picture} alt="" style={{ width: 24, height: 24, borderRadius: "50%" }} />
              {t("navProfile")}
            </button>
          )}

          <button onClick={() => { onNavigate("hub"); setMobileOpen(false); }} style={{
            background: "none", border: "none", color: TEAL, padding: "14px 8px",
            fontSize: 15, fontWeight: 500, cursor: "pointer", textAlign: "left", fontFamily: FONT,
          }}>← {t("aboutBackToHub")}</button>

          <div style={{ borderTop: `1px solid ${LIGHT_BORDER}`, margin: "8px 0" }} />

          {user ? (
            <button onClick={() => { onLogout(); setMobileOpen(false); }} style={{
              background: "none", border: `1px solid ${LIGHT_BORDER}`, color: MUTED,
              padding: "12px 16px", borderRadius: 10, fontSize: 14, fontWeight: 500,
              cursor: "pointer", fontFamily: FONT,
            }}>{t("navLogout")}</button>
          ) : (
            <button onClick={() => { onLogin(); setMobileOpen(false); }} style={{
              background: TEAL, border: "none", color: "#FFF", padding: "12px 16px",
              borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONT,
              display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
            }}>
              <span style={{ fontSize: 15 }}>G</span> {t("navLoginSave")}
            </button>
          )}

          <button onClick={toggleLang} style={{
            background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, color: TEAL,
            padding: "12px 16px", borderRadius: 10, fontSize: 14, fontWeight: 600,
            cursor: "pointer", letterSpacing: 0.5, marginTop: 4, fontFamily: FONT,
          }}>{t("langSwitch")}</button>
        </div>
      )}
    </>
  );
}
