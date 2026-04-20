// src/components/TeacherChat.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowUp, Square, Maximize2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface Message {
  id: number;
  role: "user" | "teacher";
  fullContent: string;
  displayedContent: string;
  isTyping: boolean;
  time: string;
}

const USER_NAME = "Ученик";
const TEACHER_NAME = "AI Учитель";

const getTime = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
};

const INITIAL: Message[] = [
  {
    id: 1, role: "teacher",
    fullContent: "Добро пожаловать на урок! Сегодня мы изучим основы создания макетов.",
    displayedContent: "Добро пожаловать на урок! Сегодня мы изучим основы создания макетов.",
    isTyping: false, time: "10:00",
  },
  {
    id: 2, role: "teacher",
    fullContent: "💡 Совет: Начните с определения визуальной иерархии.",
    displayedContent: "💡 Совет: Начните с определения визуальной иерархии.",
    isTyping: false, time: "10:02",
  },
  {
    id: 3, role: "teacher",
    fullContent: "Не забудьте про отступы — они создают «воздух» и делают интерфейс читаемым.",
    displayedContent: "Не забудьте про отступы — они создают «воздух» и делают интерфейс читаемым.",
    isTyping: false, time: "10:05",
  },
  {
    id: 4, role: "teacher",
    fullContent: "⚠️ Слишком много элементов на одном экране снижают конверсию. Упрощайте!",
    displayedContent: "⚠️ Слишком много элементов на одном экране снижают конверсию. Упрощайте!",
    isTyping: false, time: "10:08",
  },
  {
    id: 5, role: "teacher",
    fullContent: "Отлично! Попробуйте применить правило третей для размещения ключевых блоков.",
    displayedContent: "Отлично! Попробуйте применить правило третей для размещения ключевых блоков.",
    isTyping: false, time: "10:12",
  },
];

const TypingCursor = ({ color }: { color: string }) => (
  <span
    className="inline-block w-[2px] h-[14px] ml-0.5 align-middle animate-pulse"
    style={{ backgroundColor: color }}
  />
);

const TeacherChat = () => {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState("");
  const [isResponding, setIsResponding] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, []);

  const adjustHeight = () => {
    const t = textareaRef.current;
    if (t) { t.style.height = "auto"; t.style.height = Math.min(t.scrollHeight, 120) + "px"; }
  };

  const stopTyping = useCallback(() => {
    if (typingRef.current) { clearInterval(typingRef.current); typingRef.current = null; }
    setMessages(prev => prev.map(m => m.isTyping ? { ...m, displayedContent: m.fullContent, isTyping: false } : m));
    setIsResponding(false);
  }, []);

  const typeMessage = useCallback((id: number, text: string) => {
    let i = 0;
    setIsResponding(true);
    typingRef.current = setInterval(() => {
      i++;
      const done = i >= text.length;
      setMessages(prev => prev.map(m => m.id === id ? { ...m, displayedContent: text.slice(0, i), isTyping: !done } : m));
      if (done) { if (typingRef.current) clearInterval(typingRef.current); typingRef.current = null; setIsResponding(false); }
    }, 18);
  }, []);

  const handleSend = () => {
    if (!input.trim() || isResponding) return;
    const userMsg: Message = { id: Date.now(), role: "user", fullContent: input, displayedContent: input, isTyping: false, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const replyText = "Хороший вопрос! Давайте разберём это подробнее. Обратите внимание на ключевые моменты урока.";
    const replyId = Date.now() + 1;
    setTimeout(() => {
      const t: Message = { id: replyId, role: "teacher", fullContent: replyText, displayedContent: "", isTyping: true, time: getTime() };
      setMessages(prev => [...prev, t]);
      setTimeout(() => typeMessage(replyId, replyText), 100);
    }, 500);
  };

  const hasInput = input.trim().length > 0;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ backgroundColor: colors.bg }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b shrink-0"
        style={{ borderColor: colors.border, backgroundColor: colors.panel }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold" style={{ color: colors.text }}>AI Учитель</span>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#22c55e" }} />
        </div>
        <button
          className="p-1 rounded-md transition-colors"
          style={{ color: colors.textSecondary }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.buttonHover)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full px-3 py-3 space-y-4">
          {messages.map(msg => {
            const isUser = msg.role === "user";
            const name = isUser ? USER_NAME : TEACHER_NAME;

            return (
              <div key={msg.id} className="w-full space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: isUser ? colors.text : colors.accent }}
                  >
                    {name}
                  </span>
                  <span className="text-[10px]" style={{ color: colors.textSecondary }}>
                    {msg.time}
                  </span>
                </div>

                <div
                  className="w-full text-sm leading-[1.7] whitespace-pre-wrap break-words"
                  style={{ color: colors.text }}
                >
                  {msg.displayedContent}
                  {msg.isTyping && <TypingCursor color={colors.accent} />}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t shrink-0" style={{ borderColor: colors.border, backgroundColor: colors.panel }}>
        <div className="w-full px-3 py-2">
          {isResponding && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: colors.accent, animationDelay: "300ms" }} />
              </div>
              <span className="text-[11px]" style={{ color: colors.textSecondary }}>печатает...</span>
            </div>
          )}

          <div
            className="flex items-end gap-2 rounded-xl pl-3 pr-1.5 py-1"
            style={{ backgroundColor: colors.inputBg }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => { setInput(e.target.value); adjustHeight(); }}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Написать учителю..."
              rows={1}
              disabled={isResponding}
              className="flex-1 min-w-0 bg-transparent text-xs outline-none resize-none overflow-y-auto max-h-[120px] leading-relaxed py-1.5 disabled:opacity-50"
              style={{ color: colors.text }}
            />

            {isResponding ? (
              <button
                onClick={stopTyping}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                style={{ backgroundColor: colors.error, color: "#fff" }}
              >
                <Square className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!hasInput}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                style={{
                  backgroundColor: hasInput ? colors.accent : colors.buttonHover,
                  color: hasInput ? "#fff" : colors.textSecondary,
                  cursor: hasInput ? "pointer" : "not-allowed",
                }}
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherChat;