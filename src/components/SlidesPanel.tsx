// src/components/SlidesPanel.tsx
import { useState, useRef, useCallback } from "react";
import {
  Lock,
  CheckCircle,
  Maximize2,
  TrendingUp,
  Target,
  Clock,
  Star,
  Presentation,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTheme } from "@/context/ThemeContext";
import { useLesson } from "@/context/LessonContext";
import { LESSONS_DATA } from "@/data/lessons";

// ─── Data ────────────────────────────────────────────────
const METRICS = [
  { label: "Общий прогресс", value: 68, icon: TrendingUp, colorHex: "#3B82F6" },
  { label: "Точность ответов", value: 75, icon: Target, colorHex: "#22C55E" },
  { label: "Скорость", value: 82, icon: Clock, colorHex: "#3B82F6" },
  { label: "Креативность", value: 60, icon: Star, colorHex: "#EAB308" },
];

// ─── Slide Modal Content ─────────────────────────────────
const SlideModalContent = ({
  slides,
  activeSlide,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  slides: { id: number; title: string; subtitle: string; content: string; bullets: string[] }[];
  activeSlide: number;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}) => {
  const { colors } = useTheme();
  const slide = slides[activeSlide];

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <div
        className="flex items-center gap-3 px-6 py-4 border-b shrink-0"
        style={{ borderColor: colors.border }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.accent + "33" }}
        >
          <Presentation className="w-4 h-4" style={{ color: colors.accent }} />
        </div>
        <div>
          <h2 className="font-heading text-base font-semibold">{slide.title}</h2>
          <p className="text-xs" style={{ color: colors.textSecondary }}>
            {slide.subtitle}
          </p>
        </div>
        <div
          className="ml-auto text-xs px-2.5 py-1 rounded-full"
          style={{ backgroundColor: colors.buttonHover, color: colors.textSecondary }}
        >
          {activeSlide + 1} / {slides.length}
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div
          className="w-2/5 border-r flex items-center justify-center p-6"
          style={{ borderColor: colors.border, backgroundColor: colors.bg }}
        >
          <div className="text-center">
            <Presentation
              className="w-12 h-12 mx-auto mb-3"
              style={{ color: colors.textSecondary + "50" }}
            />
            <span className="text-xs" style={{ color: colors.textSecondary }}>
              Иллюстрация к слайду
            </span>
          </div>
        </div>
        <div className="w-3/5 overflow-y-auto p-6 space-y-4">
          <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
            {slide.content}
          </p>
          <div className="space-y-2">
            <h3 className="font-heading text-sm font-medium" style={{ color: colors.text }}>
              Ключевые темы:
            </h3>
            <ul className="space-y-2">
              {slide.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: colors.text }}>
                  <span
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: colors.accent + "33" }}
                  >
                    <span className="text-[10px] font-bold" style={{ color: colors.accent }}>
                      {i + 1}
                    </span>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="flex items-center justify-between px-6 py-3 border-t shrink-0"
        style={{ borderColor: colors.border }}
      >
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: colors.textSecondary }}
        >
          <ChevronLeft className="w-4 h-4" /> Назад
        </button>
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <div
              key={idx}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: idx === activeSlide ? colors.accent : colors.textSecondary + "50",
              }}
            />
          ))}
        </div>
        <button
          onClick={onNext}
          disabled={!hasNext}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: colors.accent }}
        >
          Далее <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Slides Section ──────────────────────────────────────
const SlidesSection = () => {
  const { colors } = useTheme();
  const { activeLessonId } = useLesson();
  const lesson = LESSONS_DATA.find((l) => l.id === activeLessonId);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!lesson || lesson.slides.length === 0) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <p className="text-xs" style={{ color: colors.textSecondary }}>
          Слайды будут доступны позже
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-3 space-y-2.5">
      <h3
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: colors.textSecondary }}
      >
        Слайды
      </h3>
      {lesson.slides.map((slide, index) => (
        <button
          key={slide.id}
          onClick={() => {
            setActiveSlide(index);
            setIsOpen(true);
          }}
          className="w-full rounded-xl p-3 text-left transition-all duration-200 group"
          style={{
            backgroundColor: colors.inputBg,
            border: `1px solid ${colors.border}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.buttonHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.inputBg;
          }}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-heading text-sm font-medium" style={{ color: colors.text }}>
              {slide.title}
            </span>
            <Maximize2
              className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: colors.textSecondary }}
            />
          </div>
          <span className="text-[11px]" style={{ color: colors.textSecondary }}>
            {slide.subtitle}
          </span>
        </button>
      ))}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-w-5xl w-[90vw] h-[50vh] flex flex-col p-0"
          style={{
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
          }}
          aria-describedby={undefined}
        >
          <SlideModalContent
            slides={lesson.slides}
            activeSlide={activeSlide}
            onPrev={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
            onNext={() => setActiveSlide((prev) => Math.min(lesson.slides.length - 1, prev + 1))}
            hasPrev={activeSlide > 0}
            hasNext={activeSlide < lesson.slides.length - 1}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─── Metrics Section ─────────────────────────────────────
const MetricsContent = () => {
  const { colors } = useTheme();
  return (
    <div className="space-y-3 p-4">
      {METRICS.map((m, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <m.icon className="w-3.5 h-3.5" style={{ color: m.colorHex }} />
              <span className="text-xs" style={{ color: colors.text }}>
                {m.label}
              </span>
            </div>
            <span className="text-xs font-medium" style={{ color: colors.text }}>
              {m.value}%
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: colors.buttonHover }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${m.value}%`, backgroundColor: colors.accent }}
            />
          </div>
        </div>
      ))}
      <div
        className="p-2.5 rounded-lg"
        style={{ backgroundColor: colors.inputBg, border: `1px solid ${colors.border}` }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Star className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs font-medium" style={{ color: colors.text }}>
            Оценка учителя
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: colors.textSecondary }}>
          Хорошая работа! Рекомендую уделить больше внимания типографике.
        </p>
      </div>
    </div>
  );
};

const MetricsSection = () => {
  const { colors } = useTheme();
  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.bg }}>
      <div
        className="flex items-center justify-between px-4 py-2 border-b shrink-0"
        style={{ borderColor: colors.border }}
      >
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: colors.textSecondary }}
        >
          Метрики
        </span>
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="p-1 rounded transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <Maximize2 className="w-3 h-3" style={{ color: colors.textSecondary }} />
            </button>
          </DialogTrigger>
          <DialogContent
            className="max-w-2xl h-[70vh] flex flex-col p-0 overflow-y-auto"
            style={{
              backgroundColor: colors.bg,
              border: `1px solid ${colors.border}`,
            }}
            aria-describedby={undefined}
          >
            <DialogHeader className="px-6 py-4 border-b" style={{ borderColor: colors.border }}>
              <DialogTitle className="font-heading" style={{ color: colors.text }}>
                Подробные метрики
              </DialogTitle>
            </DialogHeader>
            <MetricsContent />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 overflow-y-auto">
        <MetricsContent />
      </div>
    </div>
  );
};

// ─── Lessons Section (connected to context) ──────────────
const LessonsSection = () => {
  const { colors } = useTheme();
  const { activeLessonId, setActiveLessonId } = useLesson();

  return (
    <div className="h-full overflow-y-auto px-4 py-3">
      <h3
        className="text-xs font-semibold uppercase tracking-wide mb-2"
        style={{ color: colors.textSecondary }}
      >
        Уроки
      </h3>
      <div className="space-y-1">
        {LESSONS_DATA.map((lesson) => (
          <button
            key={lesson.id}
            disabled={lesson.locked}
            onClick={() => !lesson.locked && setActiveLessonId(lesson.id)}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors text-xs"
            style={{
              backgroundColor:
                lesson.locked
                  ? "transparent"
                  : activeLessonId === lesson.id
                    ? colors.buttonHover
                    : "transparent",
              color: lesson.locked ? colors.textSecondary : colors.text,
              opacity: lesson.locked ? 0.5 : 1,
              cursor: lesson.locked ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (!lesson.locked && activeLessonId !== lesson.id) {
                e.currentTarget.style.backgroundColor = colors.buttonHover + "80";
              }
            }}
            onMouseLeave={(e) => {
              if (!lesson.locked && activeLessonId !== lesson.id) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {lesson.locked ? (
              <Lock className="w-3 h-3 shrink-0" style={{ color: colors.textSecondary }} />
            ) : (
              <CheckCircle className="w-3 h-3 shrink-0" style={{ color: colors.accent }} />
            )}
            <span>{lesson.title}</span>
          </button>
        ))}
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

// ─── Slides Panel (3 resizable sections) ─────────────────
const SlidesPanel = () => {
  const { colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const [topRatio, setTopRatio] = useState(0.35);
  const [bottomRatio, setBottomRatio] = useState(0.3);
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
          setTopRatio(
            Math.max(0.1, Math.min(startTopRatio.current + dr, 1 - bottomRatio - 0.15))
          );
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
        <SlidesSection />
      </div>
      <Divider onMouseDown={onMouseDown("top")} />
      <div className="overflow-hidden" style={{ height: `${midRatio * 100}%` }}>
        <MetricsSection />
      </div>
      <Divider onMouseDown={onMouseDown("bottom")} />
      <div className="overflow-hidden" style={{ height: `${bottomRatio * 100}%` }}>
        <LessonsSection />
      </div>
    </div>
  );
};

export default SlidesPanel;