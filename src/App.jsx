import { useState, useEffect } from "react";
import { useI18n } from "./i18n";
import Course0 from "./Course0";
import Course1 from "./Course1";

const TEAL = "#0E7C86";
const CORAL = "#E8734A";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const CARD_BG = "#FFFFFF";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";

// ═══ COURSE HUB ═══
function CourseHub({ onNavigate }) {
  const { t, lang, toggleLang } = useI18n();

  const courses = [
    {
      id: "course0",
      number: "0",
      titleKey: "hubC0Title",
      descKey: "hubC0Desc",
      color: TEAL,
      emoji: "🧬",
      gameKey: "hubC0Game",
      status: "available",
    },
    {
      id: "course1",
      number: "1",
      titleKey: "hubC1Title",
      descKey: "hubC1Desc",
      color: CORAL,
      emoji: "🎯",
      gameKey: "hubC1Game",
      status: "available",
    },
    {
      id: "course2",
      number: "2",
      titleKey: "hubC2Title",
      descKey: "hubC2Desc",
      color: "#7B68C8",
      emoji: "🔍",
      gameKey: "hubC2Game",
      status: "coming",
    },
    {
      id: "course3",
      number: "3",
      titleKey: "hubC3Title",
      descKey: "hubC3Desc",
      color: "#D4A843",
      emoji: "📋",
      gameKey: "hubC3Game",
      status: "coming",
    },
    {
      id: "course4",
      number: "4",
      titleKey: "hubC4Title",
      descKey: "hubC4Desc",
      color: "#5B9E5F",
      emoji: "📊",
      gameKey: "hubC4Game",
      status: "coming",
    },
    {
      id: "course5",
      number: "5",
      titleKey: "hubC5Title",
      descKey: "hubC5Desc",
      color: "#C45B8A",
      emoji: "🔬",
      gameKey: "hubC5Game",
      status: "coming",
    },
  ];

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", fontFamily: "'Noto Sans TC', 'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
        ::selection { background: ${TEAL}22; color: ${DARK}; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(248,247,244,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${LIGHT_BORDER}` }}>
        <div style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 17, fontWeight: 700, color: TEAL, letterSpacing: -0.3 }}>
          {t("hubNavTitle")} <span style={{ fontWeight: 400, color: MUTED }}>{t("hubNavSuffix")}</span>
        </div>
        <button onClick={toggleLang} style={{ background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, color: TEAL, padding: "5px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.target.style.background = TEAL; e.target.style.color = "#FFF"; }}
          onMouseLeave={(e) => { e.target.style.background = `${TEAL}0D`; e.target.style.color = TEAL; }}>
          {t("langSwitch")}
        </button>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 100, paddingBottom: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #C8C6C0 0.8px, transparent 0.8px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 20, background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, fontSize: 12, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>{t("hubBadge")}</div>
          <h1 style={{ fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.08, marginBottom: 16, color: DARK }}>
            {t("hubTitle1")}
            <span style={{ background: `linear-gradient(135deg, ${TEAL}, #3AAFB8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{t("hubTitle2")}</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.7, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
            {t("hubDesc")}
          </p>
        </div>
      </section>

      {/* COURSE TIMELINE */}
      <section style={{ padding: "32px 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        {/* Hour 1 label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${TEAL}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: TEAL }}>1h</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{t("hubHour1")}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{t("hubHour1Desc")}</div>
          </div>
        </div>

        {/* Course cards for hour 1 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 40, paddingLeft: 20, borderLeft: `2px solid ${TEAL}22` }}>
          {courses.slice(0, 4).map((course) => (
            <CourseCard key={course.id} course={course} t={t} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Hour 2 label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: `${CORAL}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: CORAL }}>2h</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: DARK }}>{t("hubHour2")}</div>
            <div style={{ fontSize: 12, color: MUTED }}>{t("hubHour2Desc")}</div>
          </div>
        </div>

        {/* Course cards for hour 2 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 20, borderLeft: `2px solid ${CORAL}22` }}>
          {courses.slice(4).map((course) => (
            <CourseCard key={course.id} course={course} t={t} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: "40px 24px", textAlign: "center", borderTop: `1px solid ${LIGHT_BORDER}`, background: LIGHT_BG }}>
        <p style={{ fontSize: 13, color: "#B0AFAA", lineHeight: 1.8 }}>{t("hubFooter")}</p>
        <div style={{ marginTop: 12, fontFamily: "'Noto Sans TC', 'Source Serif 4', serif", fontSize: 14, color: TEAL, fontWeight: 600 }}>統合分析 101</div>
      </footer>
    </div>
  );
}

function CourseCard({ course, t, onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const available = course.status === "available";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => available && onNavigate(course.id)}
      style={{
        background: CARD_BG,
        border: `1.5px solid ${hovered && available ? course.color + "44" : LIGHT_BORDER}`,
        borderRadius: 16,
        padding: "22px 24px",
        cursor: available ? "pointer" : "default",
        transition: "all 0.3s",
        boxShadow: hovered && available ? `0 6px 24px ${course.color}12` : "none",
        transform: hovered && available ? "translateY(-2px)" : "translateY(0)",
        opacity: available ? 1 : 0.55,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: `${course.color}12`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, flexShrink: 0,
        }}>
          {course.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: course.color }}>
              Course {course.number}
            </span>
            {!available && (
              <span style={{ fontSize: 10, fontWeight: 600, color: MUTED, background: "#F1F0EC", padding: "2px 8px", borderRadius: 4 }}>
                {t("hubComingSoon")}
              </span>
            )}
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: DARK, marginBottom: 4, lineHeight: 1.3 }}>{t(course.titleKey)}</h3>
          <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.5 }}>{t(course.descKey)}</p>
          {available && (
            <div style={{ marginTop: 8, fontSize: 12, color: course.color, fontWeight: 500 }}>
              🎮 {t(course.gameKey)}
            </div>
          )}
        </div>
        {available && (
          <div style={{ fontSize: 18, color: hovered ? course.color : "#C0BFB9", transition: "color 0.3s", flexShrink: 0 }}>→</div>
        )}
      </div>
    </div>
  );
}

// ═══ MAIN APP (ROUTER) ═══
export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    // Support URL hash routing
    const hash = window.location.hash.replace("#", "");
    return hash || "hub";
  });

  const navigate = (page) => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) setCurrentPage(hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  switch (currentPage) {
    case "course0":
      return <Course0 onNavigate={navigate} />;
    case "course1":
      return <Course1 onNavigate={navigate} />;
    default:
      return <CourseHub onNavigate={navigate} />;
  }
}
