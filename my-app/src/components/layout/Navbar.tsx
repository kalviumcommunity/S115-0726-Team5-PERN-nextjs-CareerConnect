"use client";

import React, { useState } from "react";
import { useApp, Role } from "@/context/AppContext";
import { Bell, ChevronDown, User, LogOut, Briefcase, Eye, Ban, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { role, setRole, profile, notifications } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const unreadNotifs = notifications.filter((n) => !n.read);

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "viewed":
        return <Eye className="w-5 h-5 text-blue-500 bg-blue-50 p-1 rounded-full" />;
      case "accepted":
        return <CheckCircle2 className="w-5 h-5 text-green-500 bg-green-50 p-1 rounded-full" />;
      case "rejected":
        return <Ban className="w-5 h-5 text-red-500 bg-red-50 p-1 rounded-full" />;
      default:
        return <Briefcase className="w-5 h-5 text-purple-500 bg-purple-50 p-1 rounded-full" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-6 bg-white border-b border-gray-200">
      
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 lg:hidden focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="lg:hidden flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-lg">
            CC
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Career Connect</span>
        </div>
      </div>

      
      <div className="flex items-center gap-6 ml-auto">

        
        {role !== "guest" && (
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Bell className="w-6 h-6" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 w-80 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in-down">
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadNotifs.length > 0 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${
                          !n.read ? "bg-blue-50/20" : ""
                        }`}
                      >
                        <div className="mt-0.5">{getNotifIcon(n.type)}</div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-gray-900">{n.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{n.date}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-4 py-2 text-center border-t border-gray-100">
                  <button
                    onClick={() => {
                      unreadNotifs.forEach((n) => (n.read = true));
                      setShowNotifications(false);
                      toast.success("Marked all as read");
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        
        {role !== "guest" ? (
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-3 focus:outline-none group"
            >
              {role === "candidate" ? (
                <>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                    {profile.avatar}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {profile.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Candidate</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                    TS
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      Tech Solutions
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Employer</p>
                  </div>
                </>
              )}
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-900 transition-colors" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 w-48 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {role === "candidate" ? profile.email : "employer@techsolutions.com"}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setRole("guest");
                    setShowProfileMenu(false);
                    toast.success("Logged out successfully");
                    router.push("/login");
                  }}
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none"
            onClick={() => setRole("candidate")}
          >
            <User className="w-4 h-4" />
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
