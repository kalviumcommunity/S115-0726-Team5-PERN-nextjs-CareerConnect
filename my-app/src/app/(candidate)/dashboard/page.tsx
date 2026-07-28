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
    <div className="space-y-8 animate-fade-in font-sans">
      
      <div>
        <h1 className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
          Welcome back, {profile.name.split(' ')[0]}! <span className="text-2xl">👋</span>
        </h1>
        <p className="text-gray-500 text-sm md:text-base mt-1.5 font-medium">
          Track all your job applications in one place.
        </p>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-[#f4f7ff] p-6 rounded-[20px] flex flex-col gap-4 relative overflow-hidden">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[32px] font-bold text-gray-900 leading-none">{totalApplied}</p>
            <p className="text-[13px] text-gray-500 font-semibold mt-2">Total Applications</p>
          </div>
        </div>

        
        <div className="bg-[#fffdf4] p-6 rounded-[20px] flex flex-col gap-4 relative overflow-hidden">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-amber-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[32px] font-bold text-gray-900 leading-none">{pendingCount}</p>
            <p className="text-[13px] text-gray-500 font-semibold mt-2">Pending</p>
          </div>
        </div>

        
        <div className="bg-[#f4fff8] p-6 rounded-[20px] flex flex-col gap-4 relative overflow-hidden">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[32px] font-bold text-gray-900 leading-none">{viewedCount}</p>
            <p className="text-[13px] text-gray-500 font-semibold mt-2">Viewed</p>
          </div>
        </div>

        
        <div className="bg-[#fff4f4] p-6 rounded-[20px] flex flex-col gap-4 relative overflow-hidden">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-red-500">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[32px] font-bold text-gray-900 leading-none">{rejectedCount}</p>
            <p className="text-[13px] text-gray-500 font-semibold mt-2">Rejected</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-900 text-[17px]">Recent Applications</h3>
          </div>

          <div className="overflow-x-auto flex-1">
            {myApplications.length === 0 ? (
              <div className="p-10 text-center text-sm text-gray-500">
                You haven&apos;t applied to any jobs yet.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white text-[12px] font-bold text-gray-900 border-b border-gray-100">
                    <th className="py-4 px-6 font-semibold">Job Title</th>
                    <th className="py-4 px-6 font-semibold">Company</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold">Applied On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myApplications.slice(0, 6).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors text-[13px] text-gray-700">
                      <td className="py-4 px-6 font-semibold text-gray-900">{app.jobTitle}</td>
                      <td className="py-4 px-6 font-semibold flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#0a2540] text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {app.company.substring(0, 2).toUpperCase()}
                        </div>
                        {app.company}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                      <td className="py-4 px-6 text-gray-500 font-medium">
                        {app.appliedDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        
        <div className="bg-[#f8fafc] rounded-2xl border border-blue-100/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Recommended Jobs for You</h3>
              <p className="text-sm text-gray-500 mt-0.5">Based on your profile and preferences</p>
            </div>
          </div>
          <Link href="/jobs" className="px-5 py-2.5 bg-white border border-gray-200 text-blue-600 font-semibold text-sm rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap shadow-sm">
            View Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
