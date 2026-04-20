// src/context/LessonContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface LessonContextType {
  activeLessonId: string;
  setActiveLessonId: (id: string) => void;
}

const LessonContext = createContext<LessonContextType | undefined>(undefined);

export const LessonProvider = ({ children }: { children: ReactNode }) => {
  const [activeLessonId, setActiveLessonId] = useState("0.1");

  return (
    <LessonContext.Provider value={{ activeLessonId, setActiveLessonId }}>
      {children}
    </LessonContext.Provider>
  );
};

export const useLesson = () => {
  const ctx = useContext(LessonContext);
  if (!ctx) throw new Error("useLesson must be used within LessonProvider");
  return ctx;
};