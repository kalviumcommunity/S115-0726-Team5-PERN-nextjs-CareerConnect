"use client";

import React, { useState } from "react";
import { useApp, STATUS_DISPLAY } from "@/context/AppContext";
import type { ApplicationStatus } from "@/types";
import {
  Search,
  Calendar,
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const ALL_STATUSES: ApplicationStatus[] = [
  "PENDING",
  "VIEWED",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

export default function EmployerDashboard() {
  const { applications, updateApplicationStatus, jobs, setEmployerPage } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [jobFilter, setJobFilter] = useState("");

  const totalJobs = jobs.length;
  const totalAppsCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const acceptedCount = applications.filter((a) => a.status === "ACCEPTED").length;

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    const matchesJob = jobFilter ? app.jobTitle === jobFilter : true;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusClass = (status: ApplicationStatus) => {
    switch (status) {
      case "PENDING":    return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "VIEWED":     return "bg-purple-50 text-purple-700 border-purple-200/50";
      case "SHORTLISTED": return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "ACCEPTED":   return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "REJECTED":   return "bg-red-50 text-red-700 border-red-200/50";
      default:           return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Welcome back! 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with your jobs today.</p>
        </div>
        <Link
          href="/employer/post-job"
          onClick={() => setEmployerPage("post-job")}
          className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center gap-1"
        >
          Post a New Job <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Briefcase className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Jobs</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalJobs}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl"><FileText className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalAppsCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Accepted</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{acceptedCount}</p>
          </div>
        </div>
      </div>

      {/* Applications table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-gray-950 text-base shrink-0 mr-auto">Applications</h3>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value="">All Jobs</option>
              {Array.from(new Set(applications.map((a) => a.jobTitle))).map((title) => (
                <option key={title} value={title}>{title}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "")}
              className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value="">All Status</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>
              ))}
            </select>

            <div className="relative flex-1 md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-6">Candidate</th>
                <th className="py-3 px-6">Job Title</th>
                <th className="py-3 px-6">Applied On</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.map((app) => {
                const status = app.status as ApplicationStatus;
                return (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors text-sm text-gray-700">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center">
                          {app.candidateInitials}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-950 text-xs leading-tight">{app.candidateName}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{app.candidateEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <h4 className="font-bold text-gray-900 text-xs">{app.jobTitle}</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">{app.company}</p>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{app.appliedDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={status}
                        onChange={(e) =>
                          updateApplicationStatus(app.id, e.target.value as ApplicationStatus)
                        }
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none ${getStatusClass(status)}`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-gray-400 font-medium">
            Showing {filteredApps.length} of {totalAppsCount} applications
          </p>
        </div>
      </div>
    </div>
  );
}
