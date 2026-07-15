"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Calendar, Building, ChevronRight, Eye, Briefcase } from "lucide-react";

export default function CandidateApplicationsPage() {
  const { profile, applications } = useApp();
  const myApplications = applications.filter((app) => app.candidateEmail === profile.email);

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
      
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">My Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Track the live progress of your job applications in real time.</p>
      </div>

      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {myApplications.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">No applications found</h3>
            <p className="text-sm text-gray-500 mt-1">You haven&apos;t applied to any job listings yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-3.5 px-6">Job Position</th>
                  <th className="py-3.5 px-6">Company</th>
                  <th className="py-3.5 px-6">Applied Date</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors text-sm text-gray-700">
                    <td className="py-4.5 px-6 font-semibold text-gray-900">{app.jobTitle}</td>
                    <td className="py-4.5 px-6 font-medium flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      {app.company}
                    </td>
                    <td className="py-4.5 px-6 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{app.appliedDate}</span>
                      </div>
                    </td>
                    <td className="py-4.5 px-6">{getStatusBadge(app.status)}</td>
                    <td className="py-4.5 px-6 text-center">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
