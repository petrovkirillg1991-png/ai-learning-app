// src/components/ChatPanel.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, ChevronDown, Sparkles, Zap, Brain, Square, Paperclip } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const MODELS = [
  { id: "gemini-flash", name: "Gemini Flash", desc: "Быстрый и эффективный", icon: Zap },
  { id: "gemini-pro", name: "Gemini Pro", desc: "Точный и мощный", icon: Brain },
  { id: "gpt-5", name: "GPT-5", desc: "Продвинутое мышление", icon: Sparkles },
  { id: "gpt-5-mini", name: "GPT-5 Mini", desc: "Баланс скорости и качества", icon: Zap },
];

const USER_NAME = "User";
const USER_COLOR = "#2f855a";
const MODEL_COLOR = "#e53e3e";

const ModelSelector = ({
  selected,
  onSelect,
}: {
  selected: typeof MODELS[0];
  onSelect: (m: typeof MODELS[0]) => void;
}) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

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
            style={{ backgroundColor: colors.panel, border: `1px solid ${colors.border}` }}
          >
            {MODELS.map(model => (
              <button
                key={model.id}
                onClick={() => { onSelect(model); setOpen(false); }}
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

interface Message {
  id: number;
  role: "user" | "ai";
  modelName: string;
  fullContent: string;
  displayedContent: string;
  isTyping: boolean;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1, role: "user", modelName: "",
    fullContent: "Привет! Помоги мне создать макет для лендинга.",
    displayedContent: "Привет! Помоги мне создать макет для лендинга.",
    isTyping: false,
  },
  {
    id: 2, role: "ai", modelName: "Gemini Flash",
    fullContent: "Конечно! Давайте начнём с определения структуры. Лендинг обычно включает: герой-секцию, преимущества, отзывы и CTA. Какой продукт или услугу вы хотите представить?",
    displayedContent: "Конечно! Давайте начнём с определения структуры. Лендинг обычно включает: герой-секцию, преимущества, отзывы и CTA. Какой продукт или услугу вы хотите представить?",
    isTyping: false,
  },
];

const BlockCursor = ({ blinking, color }: { blinking: boolean; color: string }) => (
  <span
    className={`inline-block w-[6px] h-[14px] align-middle ml-[1px] rounded-[1px] ${blinking ? "animate-blink" : ""}`}
    style={{ backgroundColor: color }}
  />
);

const ChatPanel = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [cursorBlinking, setCursorBlinking] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, input]);

  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const resetIdleTimer = useCallback(() => {
    setCursorBlinking(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setCursorBlinking(true), 2000);
  }, []);

  useEffect(() => {
    if (input.length === 0) {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setCursorBlinking(true);
    }
  }, [input]);

  const focusInput = () => {
    if (!isAiResponding) hiddenInputRef.current?.focus();
  };

  const handleContextMenu = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAiResponding) return;
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        setInput(prev => prev + clipboardText);
        resetIdleTimer();
        hiddenInputRef.current?.focus();
      }
    } catch { /* blocked */ }
  }, [isAiResponding, resetIdleTimer]);

  const stopTyping = useCallback(() => {
    if (typingRef.current) { clearInterval(typingRef.current); typingRef.current = null; }
    setMessages(prev => prev.map(m => m.isTyping ? { ...m, displayedContent: m.fullContent, isTyping: false } : m));
    setIsAiResponding(false);
  }, []);

  const typeMessage = useCallback((messageId: number, fullText: string) => {
    let charIndex = 0;
    setIsAiResponding(true);
    typingRef.current = setInterval(() => {
      charIndex++;
      const currentText = fullText.slice(0, charIndex);
      const done = charIndex >= fullText.length;
      setMessages(prev => prev.map(m => m.id === messageId ? { ...m, displayedContent: currentText, isTyping: !done } : m));
      if (done) { if (typingRef.current) clearInterval(typingRef.current); typingRef.current = null; setIsAiResponding(false); }
    }, 18);
  }, []);

  const handleSend = () => {
    if (!input.trim() || isAiResponding) return;
    const userMsg: Message = { id: Date.now(), role: "user", modelName: "", fullContent: input, displayedContent: input, isTyping: false };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    const aiResponseText = "Отличный вопрос! Я подготовлю структуру слайдов на основе вашего запроса. Давайте разберём это пошагово, чтобы получить максимально качественный результат.";
    const aiId = Date.now() + 1;

    setTimeout(() => {
      const aiMsg: Message = { id: aiId, role: "ai", modelName: selectedModel.name, fullContent: aiResponseText, displayedContent: "", isTyping: true };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => typeMessage(aiId, aiResponseText), 100);
    }, 500);
  };

  const handleFileClick = () => { fileInputRef.current?.click(); };
  const hasInput = input.trim().length > 0;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ backgroundColor: colors.bg }}>

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s step-end infinite; }
      `}</style>

      {/* Header */}
      <div className="px-4 py-2 border-b shrink-0" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
        <ModelSelector selected={selectedModel} onSelect={setSelectedModel} />
      </div>

      {/* Тело терминала */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden cursor-text"
        onClick={focusInput}
        onContextMenu={handleContextMenu}
      >
        <div className="w-full px-4 py-4 text-sm leading-relaxed">

          {messages.map(msg => {
            const isUser = msg.role === "user";
            const label = isUser ? USER_NAME : msg.modelName;
            const labelColor = isUser ? USER_COLOR : MODEL_COLOR;

            return (
              <div
                key={msg.id}
                className="mb-3"
                style={{
                  fontFamily: isUser
                    ? '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    : '"SF Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", "Consolas", "Courier New", monospace',
                }}
              >
                <span style={{ color: labelColor, fontWeight: 400 }}>{label}</span>
                <span style={{ color: colors.textMuted, fontWeight: 400 }}>: </span>
                <span
                  className="whitespace-pre-wrap break-words"
                  style={{ color: colors.text }}
                >
                  {msg.displayedContent}
                  {msg.isTyping && <BlockCursor blinking={false} color={colors.accent} />}
                </span>
              </div>
            );
          })}

          {/* Активная строка ввода */}
          {!isAiResponding && (
            <div
              className="mb-2"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              <span style={{ color: USER_COLOR, fontWeight: 700 }}>{USER_NAME}</span>
              <span style={{ color: colors.textMuted, fontWeight: 700 }}>: </span>
              <span
                className="whitespace-pre-wrap break-words"
                style={{ color: colors.text }}
              >
                {input}
                <BlockCursor blinking={cursorBlinking} color={colors.accent} />
              </span>
            </div>
          )}

          {/* Индикатор «думает» */}
          {isAiResponding && !messages.some(m => m.isTyping) && (
            <div
              className="mb-3"
              style={{
                fontFamily: '"SF Mono", "Fira Code", "Cascadia Code", "JetBrains Mono", "Consolas", "Courier New", monospace',
              }}
            >
              <span style={{ color: MODEL_COLOR, fontWeight: 400 }}>{selectedModel.name}</span>
              <span style={{ color: colors.textMuted, fontWeight: 400 }}>: </span>
              <span className="inline-flex items-center gap-1 align-middle">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "300ms" }} />
              </span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      <textarea
        ref={hiddenInputRef}
        value={input}
        onChange={e => { setInput(e.target.value); resetIdleTimer(); }}
        onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        disabled={isAiResponding}
        className="sr-only"
        aria-label="Ввод сообщения"
        autoFocus
      />

      <input
        ref={fileInputRef} type="file" multiple className="hidden"
        onChange={e => {
          const files = e.target.files;
          if (files && files.length > 0) {
            const names = Array.from(files).map(f => f.name).join(", ");
            setInput(prev => prev + (prev ? "\n" : "") + `[📎 ${names}]`);
            resetIdleTimer();
          }
          e.target.value = "";
        }}
      />

      {/* Нижняя панель */}
      <div className="border-t shrink-0" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={handleFileClick} disabled={isAiResponding}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
            style={{ color: colors.textSecondary }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <Paperclip className="w-[18px] h-[18px]" />
          </button>

          {isAiResponding ? (
            <button
              onClick={stopTyping}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: colors.error, color: "#fff", cursor: "pointer" }}
            >
              <Square className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSend} disabled={!hasInput}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{
                backgroundColor: hasInput ? colors.accent : colors.buttonHover,
                color: hasInput ? "#fff" : colors.textSecondary,
                cursor: hasInput ? "pointer" : "not-allowed",
              }}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;