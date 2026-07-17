"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      
      <div className="flex flex-col flex-1 overflow-hidden">
        
        <Navbar onToggleSidebar={() => setSidebarOpen(true)} />

        
        <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

        
        <Footer />
      </div>
    </div>
  );
}
