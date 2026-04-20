import { Maximize2, TrendingUp, Target, Clock, Star, CheckCircle, Lock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

const METRICS = [
  { label: "Общий прогресс", value: 68, icon: TrendingUp, color: "text-accent" },
  { label: "Точность ответов", value: 75, icon: Target, color: "text-green-400" },
  { label: "Скорость выполнения", value: 82, icon: Clock, color: "text-blue-400" },
  { label: "Креативность", value: 60, icon: Star, color: "text-yellow-400" },
];

const LESSONS = [
  { id: 1, title: "Основы макетов", locked: false },
  { id: 2, title: "Типографика", locked: false },
  { id: 3, title: "Цветовая теория", locked: true },
  { id: 4, title: "Компоненты UI", locked: true },
  { id: 5, title: "Адаптивный дизайн", locked: true },
];

const MetricsContent = () => (
  <div className="space-y-4 p-4">
    {METRICS.map((m, i) => (
      <div key={i} className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <m.icon className={`w-4 h-4 ${m.color}`} />
            <span className="text-sm text-foreground">{m.label}</span>
          </div>
          <span className="text-sm font-medium text-foreground">{m.value}%</span>
        </div>
        <Progress value={m.value} className="h-2" />
      </div>
    ))}

    <div className="mt-4 p-3 rounded-xl bg-card border border-border">
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-4 h-4 text-yellow-400" />
        <span className="text-sm font-medium text-foreground">Оценка учителя</span>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Хорошая работа! Вы уверенно осваиваете базовые концепции. Рекомендую уделить больше внимания типографике для улучшения общего результата.
      </p>
    </div>
  </div>
);

const MetricsPanel = () => {
  const [activeLesson, setActiveLesson] = useState(1);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h2 className="font-heading text-sm font-medium text-foreground">Метрики</h2>
        <Dialog>
          <DialogTrigger asChild>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl h-[70vh] flex flex-col p-0 overflow-y-auto">
            <DialogHeader className="px-6 py-4 border-b border-border">
              <DialogTitle className="font-heading">Подробные метрики</DialogTitle>
            </DialogHeader>
            <MetricsContent />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MetricsContent />
      </div>

      <div className="border-t border-border p-4">
        <h3 className="font-heading text-sm font-medium text-foreground mb-3">Уроки</h3>
        <div className="space-y-1.5">
          {LESSONS.map(lesson => (
            <button
              key={lesson.id}
              disabled={lesson.locked}
              onClick={() => !lesson.locked && setActiveLesson(lesson.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm ${
                lesson.locked
                  ? "opacity-50 cursor-not-allowed"
                  : activeLesson === lesson.id
                    ? "bg-muted text-foreground"
                    : "hover:bg-muted/50 text-secondary-foreground"
              }`}
            >
              {lesson.locked ? (
                <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5 text-accent shrink-0" />
              )}
              <span>{lesson.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
