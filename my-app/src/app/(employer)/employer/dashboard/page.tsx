"use client";

import React, { useState } from "react";
import { useApp, Application } from "@/context/AppContext";
import { Search, ChevronDown, Calendar, Briefcase, FileText, CheckCircle2, XCircle, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function EmployerDashboard() {
  const router = useRouter();
  const { applications, updateApplicationStatus, jobs, setEmployerPage } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const totalJobs = jobs.length + 13;
  const totalAppsCount = applications.length + 237;
  const pendingCount = applications.filter((a) => a.status === "Pending").length + 72;
  const hiredCount = applications.filter((a) => a.status === "Hired").length + 57;
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    const matchesJob = jobFilter ? app.jobTitle === jobFilter : true;

    return matchesSearch && matchesStatus && matchesJob;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "Shortlisted":
        return "bg-blue-50 text-blue-700 border-blue-200/50";
      case "In Review":
        return "bg-purple-50 text-purple-700 border-purple-200/50";
      case "Hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200/50";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">
            Welcome back, Tech Solutions! ðŸ‘‹
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here&apos;s what&apos;s happening with your jobs today.</p>
        </div>
        <button
          onClick={() => {
            setEmployerPage("post-job");
            router.push("/employer/post-job");
          }}
          className="px-4.5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 flex items-center gap-1"
        >
          Post a New Job <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Jobs</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalJobs}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Active jobs posted</p>
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Applications</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{totalAppsCount}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Across all jobs</p>
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Pending Reviews</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{pendingCount}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Applications to review</p>
          </div>
        </div>

        
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Hired</p>
            <p className="text-2xl font-black text-gray-900 mt-0.5">{hiredCount}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Candidates hired</p>
          </div>
        </div>
      </div>

      
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
                <option key={title} value={title}>
                  {title}
                </option>
              ))}
            </select>

            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="In Review">In Review</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
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
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors text-sm text-gray-700">
                  
                  <td className="py-4.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg font-extrabold text-xs flex items-center justify-center text-white ${
                        ['RK', 'SR', 'MP'].includes(app.candidateInitials) ? 'bg-purple-600' :
                        ['AS', 'PK'].includes(app.candidateInitials) ? 'bg-green-600' :
                        'bg-blue-600'
                      }`}>
                        {app.candidateInitials}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-950 text-xs leading-tight">{app.candidateName}</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">{app.candidateEmail}</p>
                        <p className="text-[10px] text-gray-400">{app.candidatePhone}</p>
                      </div>
                    </div>
                  </td>

                  
                  <td className="py-4.5 px-6">
                    <h4 className="font-bold text-gray-900 text-xs">{app.jobTitle}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{app.company}</p>
                  </td>

                  
                  <td className="py-4.5 px-6 text-gray-500 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{app.appliedDate}</span>
                    </div>
                  </td>

                  
                  <td className="py-4.5 px-6">
                    <select
                      value={app.status}
                      onChange={(e) => updateApplicationStatus(app.id, e.target.value as Application["status"])}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border focus:outline-none ${getStatusClass(
                        app.status
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="In Review">In Review</option>
                      <option value="Hired">Hired</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-xs text-gray-400 font-medium">
            Showing 1 to {filteredApps.length} of {totalAppsCount} applications
          </p>
          <div className="flex items-center gap-1 text-xs">
            <button className="px-2.5 py-1.5 border border-gray-200 bg-white rounded-lg font-bold text-gray-700 hover:bg-gray-50">
              1
            </button>
            <button className="px-2.5 py-1.5 border border-transparent rounded-lg font-medium text-gray-500 hover:bg-gray-100">
              2
            </button>
            <button className="px-2.5 py-1.5 border border-transparent rounded-lg font-medium text-gray-500 hover:bg-gray-100">
              3
            </button>
            <span className="text-gray-400 px-1">...</span>
            <button className="px-2.5 py-1.5 border border-transparent rounded-lg font-medium text-gray-500 hover:bg-gray-100">
              41
            </button>
            <button className="px-2.5 py-1.5 border border-gray-200 bg-white rounded-lg font-bold text-gray-700 hover:bg-gray-50">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}