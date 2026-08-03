"use client";

import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "@/providers/SocketProvider";
import { AppProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        <AppProvider>
          {children}
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        </AppProvider>
      </SocketProvider>
    </SessionProvider>
  );
}
