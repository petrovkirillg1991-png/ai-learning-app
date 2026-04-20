// src/components/ChatPanel.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, ChevronDown, Sparkles, Zap, Brain, Square } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const MODELS = [
  { id: "gemini-flash", name: "Gemini Flash", desc: "Быстрый и эффективный", icon: Zap },
  { id: "gemini-pro", name: "Gemini Pro", desc: "Точный и мощный", icon: Brain },
  { id: "gpt-5", name: "GPT-5", desc: "Продвинутое мышление", icon: Sparkles },
  { id: "gpt-5-mini", name: "GPT-5 Mini", desc: "Баланс скорости и качества", icon: Zap },
];

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
  fullContent: string;
  displayedContent: string;
  isTyping: boolean;
}

const USER_NAME = "Ученик";

const INITIAL_MESSAGES: Message[] = [
  { id: 1, role: "user", fullContent: "Привет! Помоги мне создать макет для лендинга.", displayedContent: "Привет! Помоги мне создать макет для лендинга.", isTyping: false },
  { id: 2, role: "ai", fullContent: "Конечно! Давайте начнём с определения структуры. Лендинг обычно включает: герой-секцию, преимущества, отзывы и CTA. Какой продукт или услугу вы хотите представить?", displayedContent: "Конечно! Давайте начнём с определения структуры. Лендинг обычно включает: герой-секцию, преимущества, отзывы и CTA. Какой продукт или услугу вы хотите представить?", isTyping: false },
];

const TypingCursor = ({ color }: { color: string }) => (
  <span
    className="inline-block w-[2px] h-[14px] ml-0.5 align-middle animate-pulse"
    style={{ backgroundColor: color }}
  />
);

const ChatPanel = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, []);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  };

  const stopTyping = useCallback(() => {
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
    setMessages(prev =>
      prev.map(m =>
        m.isTyping ? { ...m, displayedContent: m.fullContent, isTyping: false } : m
      )
    );
    setIsAiResponding(false);
  }, []);

  const typeMessage = useCallback((messageId: number, fullText: string) => {
    let charIndex = 0;
    setIsAiResponding(true);

    typingRef.current = setInterval(() => {
      charIndex++;
      const currentText = fullText.slice(0, charIndex);
      const done = charIndex >= fullText.length;

      setMessages(prev =>
        prev.map(m =>
          m.id === messageId
            ? { ...m, displayedContent: currentText, isTyping: !done }
            : m
        )
      );

      if (done) {
        if (typingRef.current) clearInterval(typingRef.current);
        typingRef.current = null;
        setIsAiResponding(false);
      }
    }, 18);
  }, []);

  const handleSend = () => {
    if (!input.trim() || isAiResponding) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      fullContent: input,
      displayedContent: input,
      isTyping: false,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const aiResponseText = "Отличный вопрос! Я подготовлю структуру слайдов на основе вашего запроса. Давайте разберём это пошагово, чтобы получить максимально качественный результат.";
    const aiId = Date.now() + 1;

    setTimeout(() => {
      const aiMsg: Message = {
        id: aiId,
        role: "ai",
        fullContent: aiResponseText,
        displayedContent: "",
        isTyping: true,
      };
      setMessages(prev => [...prev, aiMsg]);
      setTimeout(() => typeMessage(aiId, aiResponseText), 100);
    }, 500);
  };

  const hasInput = input.trim().length > 0;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <div
        className="px-4 py-2 border-b shrink-0"
        style={{ borderColor: colors.border, backgroundColor: colors.panel }}
      >
        <ModelSelector selected={selectedModel} onSelect={setSelectedModel} />
      </div>

      {/* Messages — full width, adaptive */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full px-4 py-4 space-y-5">
          {messages.map(msg => {
            const isUser = msg.role === "user";
            const senderName = isUser ? USER_NAME : selectedModel.name;

            return (
              <div key={msg.id} className="w-full space-y-1">
                <span
                  className="text-xs font-semibold"
                  style={{ color: isUser ? colors.text : colors.accent }}
                >
                  {senderName}
                </span>

                <div
                  className="w-full text-sm leading-[1.75] whitespace-pre-wrap break-words"
                  style={{ color: colors.text }}
                >
                  {msg.displayedContent}
                  {msg.isTyping && <TypingCursor color={colors.accent} />}
                </div>

                <div className="mt-3 h-px" style={{ backgroundColor: colors.border + "30" }} />
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t shrink-0" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
        <div className="w-full px-4 py-3">
          {isAiResponding && (
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "300ms" }} />
              </div>
              <span className="text-[11px]" style={{ color: colors.textSecondary }}>
                {selectedModel.name} печатает...
              </span>
            </div>
          )}

          <div
            className="flex items-end gap-2 rounded-2xl pl-4 pr-1.5 py-1.5 w-full"
            style={{ backgroundColor: colors.inputBg }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); adjustTextareaHeight(); }}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Напишите сообщение..."
              rows={1}
              disabled={isAiResponding}
              className="flex-1 min-w-0 bg-transparent text-sm outline-none resize-none overflow-y-auto max-h-[200px] leading-relaxed py-1.5 disabled:opacity-50"
              style={{ color: colors.text }}
            />

            {isAiResponding ? (
              <button
                onClick={stopTyping}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                style={{ backgroundColor: colors.error, color: "#fff", cursor: "pointer" }}
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!hasInput}
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mb-0.5"
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
    </div>
  );
};

export default ChatPanel;