// src/components/Navbar.tsx
import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import {
  useTheme,
  themeNames,
  Language,
  languageNames,
} from "@/context/ThemeContext";
import ProfilePanel from "./ProfilePanel";

const Navbar = () => {
  const { themeName, setThemeName, colors, language, setLanguage, t } =
    useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const languageOptions: { value: Language; label: string }[] = (
    Object.keys(languageNames) as Language[]
  ).map((code) => ({
    value: code,
    label: languageNames[code],
  }));

  return (
    <>
      <nav
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{
          backgroundColor: colors.panel,
          borderColor: colors.border,
        }}
      >
        {/* Кнопка профиля */}
        <button
          onClick={() => setProfileOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-colors"
          style={{ backgroundColor: "transparent" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = colors.buttonHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: colors.accent + "33" }}
          >
            <User className="w-4 h-4" style={{ color: colors.accent }} />
          </div>
          <span
            className="font-semibold text-sm"
            style={{ color: colors.heading }}
          >
            {t("profile")}
          </span>
        </button>

        {/* Кнопка настроек */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: colors.text, backgroundColor: "transparent" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = colors.buttonHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          <Menu size={24} />
        </button>
      </nav>

      {/* Панель профиля — выезжает СЛЕВА */}
      <ProfilePanel isOpen={profileOpen} onClose={() => setProfileOpen(false)} />

      {/* Панель настроек — выезжает СПРАВА */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="h-full w-72 shadow-2xl p-5 flex flex-col gap-6 overflow-y-auto"
            style={{ backgroundColor: colors.panel }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-lg font-bold"
                style={{ color: colors.heading }}
              >
                {t("settings")}
              </h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 rounded"
                style={{ color: colors.text }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Theme — теперь ВСЕ 10 тем */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                {t("theme")}
              </h3>
              <div className="space-y-1">
                {themeNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => setThemeName(name)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor:
                        themeName === name ? colors.accent : "transparent",
                      color:
                        themeName === name ? "#FFFFFF" : colors.text,
                    }}
                    onMouseEnter={(e) => {
                      if (themeName !== name)
                        e.currentTarget.style.backgroundColor =
                          colors.buttonHover;
                    }}
                    onMouseLeave={(e) => {
                      if (themeName !== name)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {t(name)}
                  </button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <h3
                className="text-sm font-semibold mb-2 uppercase tracking-wide"
                style={{ color: colors.textSecondary }}
              >
                {t("language")}
              </h3>
              <div className="space-y-1">
                {languageOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setLanguage(opt.value)}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{
                      backgroundColor:
                        language === opt.value ? colors.accent : "transparent",
                      color:
                        language === opt.value ? "#FFFFFF" : colors.text,
                    }}
                    onMouseEnter={(e) => {
                      if (language !== opt.value)
                        e.currentTarget.style.backgroundColor =
                          colors.buttonHover;
                    }}
                    onMouseLeave={(e) => {
                      if (language !== opt.value)
                        e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;