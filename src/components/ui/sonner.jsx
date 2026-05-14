'use client';;
import * as React from 'react';
import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      richColors
      expand={false}
      toastOptions={{
        style: {
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "14px",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          padding: "14px 18px",
          minWidth: "300px",
        },
        classNames: {
          title: "text-white font-semibold text-[14px]",
          description: "text-white/60 text-[12px]",
          success: "!border-l-4 !border-l-emerald-400",
          error: "!border-l-4 !border-l-red-400",
          warning: "!border-l-4 !border-l-amber-400",
          info: "!border-l-4 !border-l-blue-400",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
