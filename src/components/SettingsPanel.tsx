import { useTheme, themeNames, languageNames, ThemeName, Language } from "@/context/ThemeContext";
import { X } from "lucide-react";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { themeName, setThemeName, colors, language, setLanguage, t } = useTheme();

  if (!open) return null;

  const allLanguages: Language[] = [
    "ru", "en", "es", "fr", "de", "zh", "ar",
    "pt", "ja", "ko", "it", "tr", "pl", "uk", "kk",
  ];

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: colors.overlay,
          zIndex: 998,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 320,
          backgroundColor: colors.panel,
          borderLeft: `1px solid ${colors.border}`,
          zIndex: 999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: colors.heading }}>
            {t("settings")}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: colors.textSecondary,
              padding: 4,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
          }}
        >
          {/* ── THEME SECTION ── */}
          <div style={{ marginBottom: 28 }}>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                color: colors.textMuted,
                marginBottom: 12,
              }}
            >
              {t("theme")}
            </label>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {themeNames.map((name) => {
                const isActive = themeName === name;
                return (
                  <button
                    key={name}
                    onClick={() => setThemeName(name)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: isActive
                        ? `2px solid ${colors.accent}`
                        : `1px solid ${colors.border}`,
                      backgroundColor: isActive ? colors.accent : "transparent",
                      color: isActive ? "#FFFFFF" : colors.text,
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = colors.buttonHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {t(name)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── LANGUAGE SECTION ── */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                color: colors.textMuted,
                marginBottom: 12,
              }}
            >
              {t("language")}
            </label>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {allLanguages.map((lang) => {
                const isActive = language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 8,
                      border: isActive
                        ? `2px solid ${colors.accent}`
                        : `1px solid ${colors.border}`,
                      backgroundColor: isActive ? colors.accent : "transparent",
                      color: isActive ? "#FFFFFF" : colors.text,
                      cursor: "pointer",
                      textAlign: "left",
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 400,
                      transition: "all 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = colors.buttonHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {languageNames[lang]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}