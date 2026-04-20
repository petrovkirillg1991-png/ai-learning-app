// src/components/ProfilePanel.tsx
import { useState } from "react";
import { X, User, BarChart3, Wallet, ArrowLeft, Save, Star } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

type ProfileView = "main" | "profile" | "statistics" | "wallet";

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePanel = ({ isOpen, onClose }: ProfilePanelProps) => {
  const { colors } = useTheme();
  const [view, setView] = useState<ProfileView>("main");
  const [nickname, setNickname] = useState("Ученик_2847");
  const [email, setEmail] = useState("student@example.com");
  const [editNickname, setEditNickname] = useState(nickname);
  const [editEmail, setEditEmail] = useState(email);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saved, setSaved] = useState(false);

  const rating = 4.7;
  const ratingStars = Math.round(rating);

  const handleSaveProfile = () => {
    setNickname(editNickname);
    setEmail(editEmail);
    setOldPassword("");
    setNewPassword("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => setView("main"), 300);
  };

  const goBack = () => setView("main");

  /* ---- MAIN ---- */
  const renderMain = () => (
    <>
      <div className="flex flex-col items-center gap-3 py-6 border-b" style={{ borderColor: colors.border }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: colors.accent + "33" }}
        >
          <User className="w-10 h-10" style={{ color: colors.accent }} />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold" style={{ color: colors.heading }}>{nickname}</p>
          <p className="text-sm" style={{ color: colors.textSecondary }}>{email}</p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star
                key={i}
                className="w-4 h-4"
                style={{
                  color: i <= ratingStars ? "#FACC15" : colors.border,
                  fill: i <= ratingStars ? "#FACC15" : "transparent",
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium" style={{ color: colors.text }}>{rating}</span>
          <span className="text-xs" style={{ color: colors.textSecondary }}>/ 5.0</span>
        </div>
        <p className="text-xs" style={{ color: colors.textSecondary }}>Рейтинг ученика</p>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <button
          onClick={() => { setEditNickname(nickname); setEditEmail(email); setView("profile"); }}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
          style={{ backgroundColor: colors.buttonHover }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#3B82F620" }}>
            <User className="w-5 h-5" style={{ color: "#3B82F6" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.text }}>Профиль</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Никнейм, почта, пароль</p>
          </div>
        </button>

        <button
          onClick={() => setView("statistics")}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
          style={{ backgroundColor: colors.buttonHover }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#22C55E20" }}>
            <BarChart3 className="w-5 h-5" style={{ color: "#22C55E" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.text }}>Статистика</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Расширенная метрика</p>
          </div>
        </button>

        <button
          onClick={() => setView("wallet")}
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left"
          style={{ backgroundColor: colors.buttonHover }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#A855F720" }}>
            <Wallet className="w-5 h-5" style={{ color: "#A855F7" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: colors.text }}>Кошелёк</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>Баланс и транзакции</p>
          </div>
        </button>
      </div>
    </>
  );

  /* ---- PROFILE EDIT ---- */
  const renderProfile = () => (
    <div className="p-4 space-y-4">
      <button onClick={goBack} className="flex items-center gap-2 text-sm transition-colors" style={{ color: colors.textSecondary }}>
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      <h3 className="text-lg font-semibold" style={{ color: colors.heading }}>Редактировать профиль</h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs mb-1 block" style={{ color: colors.textSecondary }}>Никнейм</label>
          <input
            value={editNickname}
            onChange={e => setEditNickname(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none border transition-colors"
            style={{ backgroundColor: colors.buttonHover, color: colors.text, borderColor: colors.border }}
            onFocus={e => (e.currentTarget.style.borderColor = colors.accent)}
            onBlur={e => (e.currentTarget.style.borderColor = colors.border)}
          />
        </div>

        <div>
          <label className="text-xs mb-1 block" style={{ color: colors.textSecondary }}>Электронная почта</label>
          <input
            value={editEmail}
            onChange={e => setEditEmail(e.target.value)}
            type="email"
            className="w-full px-3 py-2 rounded-lg text-sm outline-none border transition-colors"
            style={{ backgroundColor: colors.buttonHover, color: colors.text, borderColor: colors.border }}
            onFocus={e => (e.currentTarget.style.borderColor = colors.accent)}
            onBlur={e => (e.currentTarget.style.borderColor = colors.border)}
          />
        </div>

        <div className="pt-2 border-t" style={{ borderColor: colors.border }}>
          <p className="text-xs mb-3" style={{ color: colors.textSecondary }}>Сменить пароль</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs mb-1 block" style={{ color: colors.textSecondary }}>Текущий пароль</label>
              <input
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border transition-colors"
                style={{ backgroundColor: colors.buttonHover, color: colors.text, borderColor: colors.border }}
                onFocus={e => (e.currentTarget.style.borderColor = colors.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = colors.border)}
              />
            </div>
            <div>
              <label className="text-xs mb-1 block" style={{ color: colors.textSecondary }}>Новый пароль</label>
              <input
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none border transition-colors"
                style={{ backgroundColor: colors.buttonHover, color: colors.text, borderColor: colors.border }}
                onFocus={e => (e.currentTarget.style.borderColor = colors.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = colors.border)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSaveProfile}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: colors.accent, color: "#FFFFFF" }}
        >
          <Save className="w-4 h-4" />
          Сохранить
        </button>

        {saved && (
          <p className="text-xs text-center" style={{ color: "#22C55E" }}>
            ✓ Изменения сохранены
          </p>
        )}
      </div>
    </div>
  );

  /* ---- STATISTICS ---- */
  const renderStatistics = () => (
    <div className="p-4 space-y-4">
      <button onClick={goBack} className="flex items-center gap-2 text-sm transition-colors" style={{ color: colors.textSecondary }}>
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      <h3 className="text-lg font-semibold" style={{ color: colors.heading }}>Статистика</h3>

      <div className="grid grid-cols-2 gap-3">
        {[
          { val: "42", label: "Уроков пройдено" },
          { val: "18", label: "Часов обучения" },
          { val: "89%", label: "Средний балл" },
          { val: "7", label: "Дней подряд" },
        ].map((item, i) => (
          <div key={i} className="rounded-xl p-3 text-center" style={{ backgroundColor: colors.buttonHover }}>
            <p className="text-2xl font-bold" style={{ color: colors.heading }}>{item.val}</p>
            <p className="text-xs" style={{ color: colors.textSecondary }}>{item.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-medium" style={{ color: colors.text }}>Прогресс по предметам</h4>
        {[
          { name: "Математика", progress: 78, color: "#3B82F6" },
          { name: "Физика", progress: 65, color: "#22C55E" },
          { name: "Программирование", progress: 92, color: "#A855F7" },
          { name: "Английский", progress: 45, color: "#EAB308" },
        ].map(subject => (
          <div key={subject.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span style={{ color: colors.text }}>{subject.name}</span>
              <span style={{ color: colors.textSecondary }}>{subject.progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.buttonHover }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${subject.progress}%`, backgroundColor: subject.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-medium" style={{ color: colors.text }}>Активность (7 дней)</h4>
        <div className="flex items-end gap-2 h-24">
          {[40, 75, 55, 90, 30, 85, 60].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-300"
                style={{ height: `${val}%`, backgroundColor: colors.accent + "B3" }}
              />
              <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ---- WALLET ---- */
  const renderWallet = () => (
    <div className="p-4 space-y-4">
      <button onClick={goBack} className="flex items-center gap-2 text-sm transition-colors" style={{ color: colors.textSecondary }}>
        <ArrowLeft className="w-4 h-4" />
        Назад
      </button>

      <h3 className="text-lg font-semibold" style={{ color: colors.heading }}>Кошелёк</h3>

      <div
        className="rounded-2xl p-5 text-center border"
        style={{
          background: `linear-gradient(135deg, ${colors.accent}33, ${colors.accent}0D)`,
          borderColor: colors.accent + "33",
        }}
      >
        <p className="text-xs mb-1" style={{ color: colors.textSecondary }}>Текущий баланс</p>
        <p className="text-3xl font-bold" style={{ color: colors.heading }}>2,450 ₽</p>
        <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>≈ 245 токенов</p>
      </div>

      <div className="flex gap-2">
        <button
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: colors.accent, color: "#FFFFFF" }}
        >
          Пополнить
        </button>
        <button
          className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors"
          style={{ backgroundColor: "transparent", color: colors.text, borderColor: colors.border }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          Вывести
        </button>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-sm font-medium" style={{ color: colors.text }}>Последние транзакции</h4>
        {[
          { label: "Пополнение", amount: "+500 ₽", date: "Сегодня, 14:30", positive: true },
          { label: "Подписка Pro", amount: "-299 ₽", date: "Вчера, 10:00", positive: false },
          { label: "Пополнение", amount: "+1000 ₽", date: "12 янв, 09:15", positive: true },
          { label: "Курс: Математика", amount: "-150 ₽", date: "10 янв, 18:45", positive: false },
          { label: "Бонус за серию", amount: "+50 ₽", date: "9 янв, 12:00", positive: true },
        ].map((tx, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b last:border-0"
            style={{ borderColor: colors.border }}
          >
            <div>
              <p className="text-sm" style={{ color: colors.text }}>{tx.label}</p>
              <p className="text-xs" style={{ color: colors.textSecondary }}>{tx.date}</p>
            </div>
            <span className="text-sm font-medium" style={{ color: tx.positive ? "#22C55E" : "#EF4444" }}>
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={handleClose} />
      )}

      <div
        className="fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 border-r"
        style={{
          backgroundColor: colors.panel,
          borderColor: colors.border,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: colors.border }}>
          <h2 className="text-sm font-semibold" style={{ color: colors.heading }}>
            {view === "main" && "Мой аккаунт"}
            {view === "profile" && "Профиль"}
            {view === "statistics" && "Статистика"}
            {view === "wallet" && "Кошелёк"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-49px)]">
          {view === "main" && renderMain()}
          {view === "profile" && renderProfile()}
          {view === "statistics" && renderStatistics()}
          {view === "wallet" && renderWallet()}
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;