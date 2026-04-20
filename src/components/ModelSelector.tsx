// src/components/ModelSelector.tsx
import { useState } from "react";
import { ChevronDown, Sparkles, Zap, Brain } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const MODELS = [
  { id: "gemini-flash", name: "Gemini Flash", desc: "Быстрый и эффективный", icon: Zap },
  { id: "gemini-pro", name: "Gemini Pro", desc: "Точный и мощный", icon: Brain },
  { id: "gpt-5", name: "GPT-5", desc: "Продвинутое мышление", icon: Sparkles },
  { id: "gpt-5-mini", name: "GPT-5 Mini", desc: "Баланс скорости и качества", icon: Zap },
];

const ModelSelector = () => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(MODELS[0]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm"
        style={{ color: colors.text }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <selected.icon className="w-4 h-4" style={{ color: colors.accent }} />
        <span className="font-medium">{selected.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          style={{ color: colors.textSecondary }}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute top-full left-0 mt-1 z-20 rounded-xl shadow-xl min-w-[240px] py-1.5"
            style={{
              backgroundColor: colors.panel,
              border: `1px solid ${colors.border}`,
            }}
          >
            {MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => { setSelected(model); setOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
                style={{
                  backgroundColor: selected.id === model.id ? colors.buttonHover : "transparent",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = selected.id === model.id ? colors.buttonHover : "transparent")}
              >
                <model.icon className="w-4 h-4 shrink-0" style={{ color: colors.accent }} />
                <div>
                  <div className="text-sm font-medium" style={{ color: colors.text }}>{model.name}</div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>{model.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ModelSelector;