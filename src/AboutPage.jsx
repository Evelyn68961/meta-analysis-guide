import { useI18n } from "./i18n";
import SiteNav from "./SiteNav";

const TEAL = "#0E7C86";
const DARK = "#1D2B3A";
const LIGHT_BG = "#F8F7F4";
const MUTED = "#6B7A8D";
const LIGHT_BORDER = "#E8E6E1";
const FONT = "'Noto Sans TC', 'Outfit', sans-serif";
const SERIF = "'Noto Sans TC', 'Source Serif 4', serif";

export default function AboutPage({ onNavigate, user, onLogin, onLogout }) {
  const { t, lang } = useI18n();

  const sections = [
    {
      icon: "🎯",
      titleKey: "aboutGoalTitle",
      textKey: "aboutGoalText",
    },
    {
      icon: "👥",
      titleKey: "aboutAudienceTitle",
      textKey: "aboutAudienceText",
    },
    {
      icon: "🧩",
      titleKey: "aboutStructureTitle",
      textKey: "aboutStructureText",
    },
    {
      icon: "📚",
      titleKey: "aboutSourcesTitle",
      textKey: "aboutSourcesText",
    },
  ];

  return (
    <div style={{ background: LIGHT_BG, minHeight: "100vh", fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;900&family=Source+Serif+4:wght@400;600;700;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${LIGHT_BG}; }
      `}</style>

      <SiteNav onNavigate={onNavigate} user={user} onLogin={onLogin} onLogout={onLogout} />

      {/* Hero */}
      <section style={{ paddingTop: 100, paddingBottom: 48, textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.25, backgroundImage: "radial-gradient(circle, #C8C6C0 0.8px, transparent 0.8px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "0 24px", maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "inline-block", padding: "6px 18px", borderRadius: 20, background: `${TEAL}0D`, border: `1px solid ${TEAL}22`, fontSize: 12, color: TEAL, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 24 }}>
            {t("navAbout")}
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16, color: DARK }}>
            {t("aboutHeroTitle")}
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 17px)", lineHeight: 1.75, color: MUTED, maxWidth: 520, margin: "0 auto" }}>
            {t("aboutHeroDesc")}
          </p>
        </div>
      </section>

      {/* Content sections */}
      <section style={{ padding: "32px 24px 80px", maxWidth: 720, margin: "0 auto" }}>
        {sections.map((s, i) => (
          <div key={i} style={{
            background: "#FFFFFF", border: `1px solid ${LIGHT_BORDER}`, borderRadius: 16,
            padding: "28px 28px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: `${TEAL}0D`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, flexShrink: 0,
              }}>{s.icon}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: DARK, marginBottom: 8, fontFamily: SERIF }}>
                  {t(s.titleKey)}
                </h3>
                <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.75 }}>
                  {t(s.textKey)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Tech stack */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: "#B0AFAA", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 12 }}>
            {t("aboutBuiltWith")}
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {["React", "Vercel", "Supabase", "i18n"].map((tech) => (
              <span key={tech} style={{
                padding: "5px 14px", borderRadius: 8, background: "#FFFFFF",
                border: `1px solid ${LIGHT_BORDER}`, fontSize: 12, color: MUTED, fontWeight: 500,
              }}>{tech}</span>
            ))}
          </div>
        </div>

        {/* Back button */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <button onClick={() => onNavigate("hub")} style={{
            background: TEAL, border: "none", color: "#FFF", padding: "12px 28px",
            borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s", boxShadow: `0 2px 12px ${TEAL}33`, fontFamily: FONT,
          }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            ← {t("aboutBackToHub")}
          </button>
        </div>
      </section>
    </div>
  );
}
