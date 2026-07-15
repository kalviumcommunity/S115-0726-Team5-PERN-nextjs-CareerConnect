"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Briefcase, Clock, CheckCircle2, XCircle, ChevronRight, Bell, Calendar } from "lucide-react";
import Link from "next/link";

export default function CandidateDashboard() {
  const { profile, applications, setCandidatePage } = useApp();
  const myApplications = applications.filter((app) => app.candidateEmail === profile.email);
  const totalApplied = myApplications.length;
  const pendingCount = myApplications.filter((app) => app.status === "Pending").length;
  const viewedCount = myApplications.filter((app) => app.status === "Shortlisted" || app.status === "In Review").length;
  const rejectedCount = myApplications.filter((app) => app.status === "Rejected").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200/50">
            Pending
          </span>
        );
      case "Shortlisted":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-200/50">
            Shortlisted
          </span>
        );
      case "In Review":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/50">
            In Review
          </span>
        );
      case "Hired":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            Hired
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-700 border border-red-200/50">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-50 text-gray-700 border border-gray-200/50">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-y-6 translate-x-6">
          <Briefcase className="w-64 h-64" />
        </div>
        <div className="max-w-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile.name}! ðŸ‘‹
          </h1>
          <p className="text-blue-100/90 text-sm md:text-base mt-2 font-medium">
            You have {pendingCount} application reviews pending. Keep track of your responses and notifications below.
          </p>

        </div>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Applied</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalApplied}</p>
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{pendingCount}</p>
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Shortlisted</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{viewedCount}</p>
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Rejected</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{rejectedCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-950 text-base">Recent Applications</h3>
            <button
              onClick={() => setCandidatePage("applications")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            {myApplications.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">
                You haven&apos;t applied to any jobs yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="py-3 px-5">Job Title</th>
                    <th className="py-3 px-5">Company</th>
                    <th className="py-3 px-5">Applied Date</th>
                    <th className="py-3 px-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myApplications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors text-sm text-gray-700">
                      <td className="py-4 px-5 font-semibold text-gray-900">{app.jobTitle}</td>
                      <td className="py-4 px-5 font-medium">{app.company}</td>
                      <td className="py-4 px-5 text-gray-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {app.appliedDate}
                      </td>
                      <td className="py-4 px-5">{getStatusBadge(app.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-950 text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              Notifications
            </h3>
            <button
              onClick={() => setCandidatePage("notifications")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              See All
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-72 flex-1 pr-1">
            {myApplications.length === 0 ? (
              <div className="text-center py-6 text-sm text-gray-500">No updates yet</div>
            ) : (
              myApplications.slice(0, 3).map((app, idx) => {
                let msg = "";
                let style = "";
                if (app.status === "Pending") {
                  msg = `Your application for ${app.jobTitle} is under review.`;
                  style = "bg-amber-50 text-amber-600";
                } else if (app.status === "Shortlisted") {
                  msg = `Congratulations! You have been shortlisted for ${app.jobTitle}.`;
                  style = "bg-green-50 text-green-600";
                } else if (app.status === "Rejected") {
                  msg = `Unfortunately, you were not selected for ${app.jobTitle}.`;
                  style = "bg-red-50 text-red-600";
                } else {
                  msg = `Your application for ${app.jobTitle} status updated to: ${app.status}.`;
                  style = "bg-blue-50 text-blue-600";
                }

                return (
                  <div key={idx} className="flex gap-3 text-xs border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style} font-bold`}>
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{app.jobTitle}</p>
                      <p className="text-gray-500 mt-0.5">{msg}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
