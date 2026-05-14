import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";
import Grainient from "@/components/Grainient";
import FloatingActionMenu from "@/components/ui/floating-action-menu";
import { User, Settings, LogOut } from "lucide-react";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore signOut errors
    }
    // Reload to reset app auth state
    window.location.href = "/";
  };

  const menuOptions = [
    {
      label: "Account",
      Icon: <User className="w-4 h-4" />,
      onClick: () => navigate("/account"),
    },
    {
      label: "Logout",
      Icon: <LogOut className="w-4 h-4" />,
      onClick: handleLogout,
    },
  ];

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
      <Toaster />

      {/* Floating Action Menu — visible on all authenticated pages */}
      <FloatingActionMenu options={menuOptions} className="z-50" />
    </div>
  );
}
