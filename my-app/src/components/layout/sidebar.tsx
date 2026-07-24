"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  User,
  Bell,
  Building2,
  PlusSquare,
  LogOut,
  FileText,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string | undefined;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const {
    role,
    setRole,
    candidatePage,
    setCandidatePage,
    employerPage,
    setEmployerPage,
    notifications,
  } = useApp();

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    setRole("guest");
    router.push("/");
    onClose();
  };
  const candidateItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "jobs",
      label: "Jobs for You",
      icon: Briefcase,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : undefined,
    },
  ];
  const employerItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "applications",
      label: "Applications",
      icon: FileText,
    },
    {
      id: "company-profile",
      label: "Company Profile",
      icon: Building2,
    },
    {
      id: "post-job",
      label: "Post a Job",
      icon: PlusSquare,
    },
  ];

  const items = role === "candidate" ? candidateItems : employerItems;
  const activePage = role === "candidate" ? candidatePage : employerPage;
  const setActivePage = role === "candidate" ? setCandidatePage : setEmployerPage;

  if (role === "guest") return null;

  return (
    <>
      
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-gray-600/40 backdrop-blur-sm lg:hidden"
        ></div>
      )}

      
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-gray-200 transition-transform duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        
        <div className="flex items-center gap-2.5 h-16 px-6 border-b border-gray-100">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-xl shadow-md shadow-blue-200">
            CC
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-gray-900 tracking-tight leading-tight">
              CAREER
            </span>
            <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] -mt-0.5">
              CONNECT
            </span>
          </div>
        </div>

        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (role === "candidate") {
                    router.push(item.id === "dashboard" ? "/dashboard" : `/${item.id}`);
                  } else if (role === "employer") {
                    router.push(item.id === "dashboard" ? "/employer/dashboard" : `/employer/${item.id}`);
                  }
                  onClose();
                }}
                className={`flex items-center justify-between w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-50/70 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                      isActive ? "bg-blue-200/50 text-blue-700" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
