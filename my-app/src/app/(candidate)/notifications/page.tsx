"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Bell, Eye, CheckCircle2, XCircle, Info, Calendar, Check, Filter } from "lucide-react";

type FilterType = "All" | "Unread" | "Status Updates";

export default function NotificationsPage() {
  const { notifications, markNotificationsAsRead } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>("All");

  useEffect(() => {
    markNotificationsAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filters: FilterType[] = ["All", "Unread", "Status Updates"];

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !notif.read;
    if (activeFilter === "Status Updates") {
      const t = notif.type.toLowerCase();
      return (
        t.includes("view") ||
        t.includes("accept") ||
        t.includes("reject") ||
        t.includes("shortlist")
      );
    }
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("view")) return <Eye className="w-5 h-5 text-blue-600" />;
    if (t.includes("accept") || t.includes("shortlist"))
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (t.includes("reject")) return <XCircle className="w-5 h-5 text-red-600" />;
    return <Info className="w-5 h-5 text-indigo-600" />;
  };

  const getIconBg = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("view")) return "bg-blue-100";
    if (t.includes("accept") || t.includes("shortlist")) return "bg-green-100";
    if (t.includes("reject")) return "bg-red-100";
    return "bg-indigo-100";
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-gray-500">Stay updated on your job applications.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeFilter === filter
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <button
          onClick={() => markNotificationsAsRead()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 whitespace-nowrap"
        >
          <Check className="w-4 h-4" />
          Mark All as Read
        </button>
      </div>

      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => {
            const staggerClass = `stagger-${Math.min(index + 1, 8)}`;
            return (
              <div
                key={notification.id}
                className={`animate-slide-in-up ${staggerClass} relative flex items-start gap-4 p-5 rounded-2xl bg-white border transition-all duration-200 hover:shadow-md ${
                  !notification.read
                    ? "border-l-4 border-l-blue-500 border-y-blue-50 border-r-blue-50 bg-blue-50/30"
                    : "border-gray-100"
                }`}
              >
                <div className={`p-3 rounded-xl flex-shrink-0 ${getIconBg(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h3 className={`text-base font-bold truncate ${!notification.read ? "text-gray-900" : "text-gray-800"}`}>
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2 leading-relaxed">{notification.message}</p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(notification.date)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-gray-100 shadow-sm animate-scale-in">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-500 text-center max-w-sm">
              {activeFilter === "All"
                ? "You don&apos;t have any notifications at the moment."
                : `No ${activeFilter.toLowerCase()} notifications right now.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
