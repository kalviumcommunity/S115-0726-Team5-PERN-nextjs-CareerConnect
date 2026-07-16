"use client";

import React, { useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Bell, Eye, CheckCircle2, XCircle, Info, Calendar } from "lucide-react";

export default function CandidateNotificationsPage() {
  const { notifications, markNotificationsAsRead } = useApp();
  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "viewed":
        return (
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Eye className="w-5 h-5" />
          </div>
        );
      case "accepted":
        return (
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        );
      case "rejected":
        return (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
        );
      default:
        return (
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Info className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">Stay updated with instant logs regarding your applications.</p>
      </div>

      
      <div className="space-y-3.5 max-w-3xl">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">All caught up!</h3>
            <p className="text-sm text-gray-500 mt-1">You have no new notifications.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`bg-white p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                !notif.read
                  ? "border-blue-100 shadow-md shadow-blue-50/20 bg-blue-50/10"
                  : "border-gray-100 shadow-sm hover:border-gray-200"
              }`}
            >
              {getNotificationIcon(notif.type)}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-bold text-gray-950 text-sm">{notif.title}</h3>
                  <span className="text-[10px] font-semibold text-gray-400 flex items-center gap-1.5 mt-0.5 sm:mt-0">
                    <Calendar className="w-3.5 h-3.5" />
                    {notif.date}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1.5 leading-relaxed font-medium">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
