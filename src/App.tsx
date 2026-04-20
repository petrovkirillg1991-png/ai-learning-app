import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "@/pages/Index";

function App() {
  return (
    <ThemeProvider>
      <Index />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;