"use client";

import React, { useState } from "react";
import { useApp, STATUS_DISPLAY } from "@/context/AppContext";
import type { ApplicationStatus } from "@/types";
import {
  Search,
  Calendar,
  FileText,
  Eye,
  Check,
  X,
  Download,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Layers,
} from "lucide-react";
import toast from "react-hot-toast";

const ALL_STATUSES: ApplicationStatus[] = [
  "PENDING",
  "VIEWED",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

export default function EmployerApplicationsPage() {
  const {
    applications,
    updateApplicationStatus,
    selectedAppIds,
    toggleAppSelection,
    selectAllApps,
    deselectAllApps,
    batchUpdateStatus,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "">("");
  const [jobFilter, setJobFilter] = useState("");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [resumePage, setResumePage] = useState<1 | 2>(1);
  const [batchStatus, setBatchStatus] = useState<ApplicationStatus>("SHORTLISTED");

  const selectedApp = selectedAppId
    ? applications.find((a) => a.id === selectedAppId) ?? null
    : null;

  const totalAppsCount = applications.length;
  const pendingCount = applications.filter((a) => a.status === "PENDING").length;
  const reviewedCount = applications.filter((a) => a.status !== "PENDING").length;
  const acceptedCount = applications.filter((a) => a.status === "ACCEPTED").length;
  const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    const matchesJob = jobFilter ? app.jobTitle === jobFilter : true;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const isAllVisibleSelected =
    filteredApps.length > 0 &&
    filteredApps.every((app) => selectedAppIds.includes(app.id));

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const idsToAdd = filteredApps.map((app) => app.id);
      selectAllApps(Array.from(new Set([...selectedAppIds, ...idsToAdd])));
    } else {
      const visibleIds = new Set(filteredApps.map((app) => app.id));
      selectAllApps(selectedAppIds.filter((id) => !visibleIds.has(id)));
    }
  };

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

  const handleAccept = async (appId: string) => {
    await updateApplicationStatus(appId, "SHORTLISTED");
    setSelectedAppId(null);
    toast.success("Application Shortlisted!");
  };

  const handleReject = async (appId: string) => {
    await updateApplicationStatus(appId, "REJECTED");
    setSelectedAppId(null);
    toast.error("Application Rejected.");
  };

  return (
    <div className="space-y-6 relative">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">Applications</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and review all applications received for your jobs.</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="">All Jobs</option>
            {Array.from(new Set(applications.map((a) => a.jobTitle))).map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | "")}
            className="px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="">All Status</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by name or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total", count: totalAppsCount, icon: <FileText className="w-4 h-4" />, color: "blue" },
          { label: "Pending", count: pendingCount, icon: <AlertCircle className="w-4 h-4" />, color: "amber" },
          { label: "Reviewed", count: reviewedCount, icon: <Eye className="w-4 h-4" />, color: "green" },
          { label: "Accepted", count: acceptedCount, icon: <CheckCircle2 className="w-4 h-4" />, color: "purple" },
          { label: "Rejected", count: rejectedCount, icon: <XCircle className="w-4 h-4" />, color: "red" },
        ].map(({ label, count, icon, color }) => (
          <div key={label} className={`bg-white p-5 rounded-2xl border border-${color}-100 bg-${color}-50/10 shadow-sm flex flex-col justify-between`}>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</span>
              <div className={`w-7 h-7 bg-${color}-50 text-${color}-600 rounded-lg flex items-center justify-center`}>{icon}</div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-black text-slate-900">{count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col pb-16">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <th className="py-3.5 px-6">
                  <input
                    type="checkbox"
                    checked={isAllVisibleSelected}
                    onChange={handleSelectAll}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="py-3.5 px-6">Candidate</th>
                <th className="py-3.5 px-6">Job Position</th>
                <th className="py-3.5 px-6">Applied Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredApps.map((app) => {
                const isSelected = selectedAppIds.includes(app.id);
                const status = app.status as ApplicationStatus;
                return (
                  <tr
                    key={app.id}
                    className={`hover:bg-slate-50/50 transition-colors text-sm text-gray-700 ${isSelected ? "bg-blue-50/30" : ""}`}
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleAppSelection(app.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 font-extrabold text-xs flex items-center justify-center border border-indigo-200">
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
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border focus:outline-none ${getStatusClass(status)}`}
                      >
                        {ALL_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => {
                          setSelectedAppId(app.id);
                          setResumePage(1);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-100/50"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        View Resume
                      </button>
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

      {/* Batch action toolbar */}
      {selectedAppIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl animate-toolbar-slide-up">
          <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
              {selectedAppIds.length}
            </span>
            <span className="text-sm font-semibold">selected</span>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={batchStatus}
              onChange={(e) => setBatchStatus(e.target.value as ApplicationStatus)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 text-white"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>
              ))}
            </select>

            <button
              onClick={() => batchUpdateStatus(batchStatus)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-bold transition-colors"
            >
              Apply to All
            </button>

            <button
              onClick={deselectAllApps}
              className="px-4 py-2 text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Resume modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in flex flex-col h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-gray-950 text-sm md:text-base">
                  {selectedApp.candidateName} &ndash; Resume
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toast.success("Downloading resume...")}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedAppId(null)}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              <div className="w-28 border-r border-gray-100 bg-slate-50/30 p-4 space-y-4 shrink-0 overflow-y-auto hidden sm:flex flex-col items-center">
                {([1, 2] as const).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setResumePage(pg)}
                    className={`w-20 p-1 bg-white border-2 rounded-xl transition-all shadow-sm flex flex-col items-center gap-1 group ${
                      resumePage === pg
                        ? "border-indigo-600 ring-2 ring-indigo-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="w-full aspect-[3/4] bg-slate-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold group-hover:bg-slate-200/50">
                      Page {pg}
                    </div>
                    <span className="text-[10px] font-bold text-gray-500">{pg}</span>
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col bg-slate-100/50 p-6 overflow-hidden">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200/60 shrink-0 mb-4 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                    <button className="p-1 hover:bg-slate-50 rounded" onClick={() => setResumePage(1)}>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-1 text-[10px] font-bold text-gray-800">{resumePage} / 2</span>
                    <button className="p-1 hover:bg-slate-50 rounded" onClick={() => setResumePage(2)}>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                      <button className="p-1 hover:bg-slate-50 rounded"><ZoomOut className="w-3.5 h-3.5" /></button>
                      <span className="px-1 text-[10px] font-bold text-gray-800">100%</span>
                      <button className="p-1 hover:bg-slate-50 rounded"><ZoomIn className="w-3.5 h-3.5" /></button>
                    </div>
                    <button className="p-1.5 bg-white border border-gray-200 hover:bg-slate-50 rounded-lg shadow-sm">
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 bg-white border border-gray-200 shadow-lg rounded-2xl p-8 overflow-y-auto max-w-xl mx-auto w-full select-text font-serif">
                  {resumePage === 1 ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-start border-b border-gray-200 pb-5">
                        <div className="space-y-1">
                          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{selectedApp.candidateName}</h2>
                          <p className="text-sm text-indigo-600 font-sans font-semibold uppercase tracking-wider">{selectedApp.jobTitle}</p>
                          <div className="flex flex-wrap gap-x-3 text-[10px] text-gray-500 font-sans font-medium mt-2">
                            <span>{selectedApp.candidateEmail}</span>
                          </div>
                        </div>
                        <div className="w-16 h-16 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-black font-sans">
                          {selectedApp.candidateInitials}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-gray-900 font-sans uppercase tracking-wider text-indigo-600">Summary</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Experienced professional with a strong background in their field.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-900 font-sans uppercase tracking-wider text-indigo-600 border-b border-gray-100 pb-1">Education</h3>
                        <div className="text-xs">
                          <h4 className="font-bold text-gray-800">Bachelor of Computer Science</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-sans font-medium">Graduated: 2022</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Change Status:</span>
                <select
                  value={selectedApp.status}
                  onChange={(e) =>
                    updateApplicationStatus(selectedApp.id, e.target.value as ApplicationStatus)
                  }
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none ${getStatusClass(selectedApp.status as ApplicationStatus)}`}
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_DISPLAY[s]}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleReject(selectedApp.id)}
                  className="px-4 py-2 border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
                <button
                  onClick={() => handleAccept(selectedApp.id)}
                  className="px-4 py-2 bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-200 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Shortlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
