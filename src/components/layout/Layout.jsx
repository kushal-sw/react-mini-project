import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";
import { DitheringShader } from "@/components/ui/dithering-shader";
import { useState, useEffect } from "react";
export default function Layout() {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative">
      <div className="fixed inset-0 z-[-1] pointer-events-none opacity-40 dark:opacity-20">
        <DitheringShader 
          width={dimensions.width} 
          height={dimensions.height}
          colorBack="#000000"
          colorFront="#4f46e5"
          shape="wave"
          type="8x8"
          speed={0.5}
        />
      </div>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <Outlet />
      </main>
      <footer className="border-t bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Recipe Discovery App — Built with 🧡
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
