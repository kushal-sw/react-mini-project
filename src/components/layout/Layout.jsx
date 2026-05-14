import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";
import Grainient from "@/components/Grainient";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col relative bg-[#111111] text-white">
      <div className="fixed inset-0 z-0">
        <Grainient
          color1="#a855f7"
          color2="#7e22ce"
          color3="#d811c4ff"
          warpAmplitude={7}
          zoom={0.5}
          className="opacity-40"
          timeSpeed={1.5}
          grainScale={2.9}
          noiseScale={2}
        />
      </div>
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        <Outlet />
      </main>
      <footer className="border-t border-white/20 bg-black/10 relative z-10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-white/70">
            © {new Date().getFullYear()} ForkCast — Built with 🧡
          </p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
}
