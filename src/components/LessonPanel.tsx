// src/components/LessonPanel.tsx
import { useState, useRef, useCallback } from "react";
import { Maximize2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "@/context/ThemeContext";

// ─── Lesson + Tasks ──────────────────────────────────────
const LessonSection = () => {
  const { colors } = useTheme();
  return (
    <div className="h-full overflow-y-auto px-4 py-4 space-y-4">
      <div>
        <h2 className="text-base font-bold" style={{ color: colors.text }}>
          Урок: Создание макета
        </h2>
        <p className="text-xs mt-1 leading-relaxed" style={{ color: colors.textSecondary }}>
          Вы научитесь создавать эффективные макеты, используя современные подходы и дизайн.
        </p>
      </div>

      <div className="space-y-1.5">
        <h3
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: colors.textSecondary }}
        >
          Задачи
        </h3>
        {[
          "Изучить основные элементы макета",
          "Создать wireframe главной страницы",
          "Подготовить прототип в Figma",
        ].map((task, i) => (
          <label
            key={i}
            className="flex items-center gap-2.5 py-1 cursor-pointer text-sm"
            style={{ color: colors.text }}
          >
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded accent-current"
              style={{ accentColor: colors.accent }}
            />
            <span>{task}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ─── Teacher Messages (read-only + modal) ────────────────
const MESSAGES = [
  { id: 1, text: "Добро пожаловать на урок! Сегодня мы изучим основы создания макетов.", time: "10:00" },
  { id: 2, text: "💡 Совет: Начните с определения визуальной иерархии.", time: "10:02" },
  { id: 3, text: "Не забудьте про отступы — они создают «воздух» и делают интерфейс читаемым.", time: "10:05" },
  { id: 4, text: "⚠️ Слишком много элементов на одном экране снижают конверсию. Упрощайте!", time: "10:08" },
  { id: 5, text: "Отлично! Попробуйте применить правило третей для размещения ключевых блоков.", time: "10:12" },
];

const TeacherMessages = () => {
  const { colors } = useTheme();

  const messagesList = (
    <div className="w-full px-3 py-3 space-y-4">
      {MESSAGES.map((msg) => (
        <div key={msg.id} className="w-full space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: colors.accent }}>
              AI Учитель
            </span>
            <span className="text-[10px]" style={{ color: colors.textSecondary }}>
              {msg.time}
            </span>
          </div>
          <div
            className="w-full text-sm leading-[1.7] whitespace-pre-wrap break-words"
            style={{ color: colors.text }}
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b shrink-0"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: colors.text }}>
            AI Учитель
          </span>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="p-1 rounded-md transition-colors"
              style={{ color: colors.textSecondary }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </DialogTrigger>
          <DialogContent
            className="max-w-3xl w-[80vw] h-[70vh] flex flex-col p-0 overflow-hidden"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
            }}
            aria-describedby={undefined}
          >
            <DialogHeader
              className="px-6 py-4 border-b shrink-0"
              style={{ borderColor: colors.border }}
            >
              <DialogTitle style={{ color: colors.text }}>
                <div className="flex items-center gap-2">
                  <span>AI Учитель</span>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">{messagesList}</div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">{messagesList}</div>
    </div>
  );
};

// ─── Prompt Examples (copy on click) ─────────────────────
const PromptExamples = () => {
  const { colors } = useTheme();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const prompts = [
    "Создай урок по основам дизайна интерфейсов",
    "Объясни принципы типографики для начинающих",
    "Расскажи о цветовой теории в веб-дизайне",
  ];

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="h-full overflow-y-auto px-4 py-3 space-y-3">
      <h3
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: colors.textSecondary }}
      >
        Примеры Промптов
      </h3>
      <div className="space-y-2">
        {prompts.map((p, i) => {
          const isCopied = copiedIndex === i;
          return (
            <button
              key={i}
              onClick={() => handleCopy(p, i)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors text-sm text-left"
              style={{
                backgroundColor: isCopied ? colors.accent + "15" : colors.inputBg,
                color: colors.text,
                border: isCopied ? `1px solid ${colors.accent}40` : "1px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isCopied) e.currentTarget.style.backgroundColor = colors.buttonHover;
              }}
              onMouseLeave={(e) => {
                if (!isCopied) e.currentTarget.style.backgroundColor = colors.inputBg;
              }}
            >
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{
                  backgroundColor: isCopied ? colors.accent + "30" : colors.accent + "25",
                  color: colors.accent,
                }}
              >
                {isCopied ? <Check className="w-3 h-3" /> : i + 1}
              </span>
              <span className="flex-1">{p}</span>
              <span className="shrink-0" style={{ color: colors.textSecondary }}>
                {isCopied ? (
                  <span className="text-[10px] font-medium" style={{ color: colors.accent }}>
                    Скопировано!
                  </span>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Resizable Divider ───────────────────────────────────
const Divider = ({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) => {
  const { colors } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="shrink-0 flex items-center justify-center cursor-row-resize"
      style={{ height: 6, backgroundColor: hovered ? colors.accent + "30" : colors.border }}
      onMouseDown={onMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-8 h-[2px] rounded-full"
        style={{ backgroundColor: hovered ? colors.accent : colors.textSecondary + "50" }}
      />
    </div>
  );
};

// ─── Lesson Panel (3 resizable sections) ─────────────────
const LessonPanel = () => {
  const { colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [topRatio, setTopRatio] = useState(0.28);
  const [bottomRatio, setBottomRatio] = useState(0.25);
  const midRatio = 1 - topRatio - bottomRatio;

  const dragging = useRef<"top" | "bottom" | null>(null);
  const startY = useRef(0);
  const startTopRatio = useRef(0);
  const startBottomRatio = useRef(0);

  const onMouseDown = useCallback(
    (which: "top" | "bottom") => (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = which;
      startY.current = e.clientY;
      startTopRatio.current = topRatio;
      startBottomRatio.current = bottomRatio;

      const onMove = (ev: MouseEvent) => {
        if (!containerRef.current || !dragging.current) return;
        const h = containerRef.current.getBoundingClientRect().height;
        const dr = (ev.clientY - startY.current) / h;

        if (dragging.current === "top") {
          setTopRatio(Math.max(0.1, Math.min(startTopRatio.current + dr, 1 - bottomRatio - 0.15)));
        } else {
          setBottomRatio(
            Math.max(0.1, Math.min(startBottomRatio.current - dr, 1 - topRatio - 0.15))
          );
        }
      };

      const onUp = () => {
        dragging.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [topRatio, bottomRatio]
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full overflow-hidden"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="overflow-hidden" style={{ height: `${topRatio * 100}%` }}>
        <LessonSection />
      </div>
      <Divider onMouseDown={onMouseDown("top")} />
      <div className="overflow-hidden" style={{ height: `${midRatio * 100}%` }}>
        <TeacherMessages />
      </div>
      <Divider onMouseDown={onMouseDown("bottom")} />
      <div className="overflow-hidden" style={{ height: `${bottomRatio * 100}%` }}>
        <PromptExamples />
      </div>
    </div>
  );
};

export default LessonPanel;