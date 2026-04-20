import Navbar from "@/components/Navbar";
import LessonPanel from "@/components/LessonPanel";
import ChatPanel from "@/components/ChatPanel";
import SlidesPanel from "@/components/SlidesPanel";
import { useTheme } from "@/context/ThemeContext";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

const Index = () => {
  const { colors } = useTheme();

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      <Navbar />
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
          <div
            className="h-full overflow-y-auto border-r"
            style={{ borderColor: colors.border }}
          >
            <LessonPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={25}>
          <div className="h-full">
            <ChatPanel />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
          <div
            className="h-full overflow-y-auto border-l"
            style={{ borderColor: colors.border }}
          >
            <SlidesPanel />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Index;