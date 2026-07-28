"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Search, MapPin, Briefcase, IndianRupee, Star, ShieldAlert } from "lucide-react";

export default function CandidateJobsPage() {
  const { jobs, applyToJob } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [expFilter, setExpFilter] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation = locationFilter
      ? job.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;

    const matchesExperience = expFilter ? job.experience.includes(expFilter) : true;

    return matchesSearch && matchesLocation && matchesExperience;
  });

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">Jobs for You</h1>
        <p className="text-sm text-gray-500 mt-1">Curated job opportunities based on your profile and preferences.</p>
      </div>

      
      <div className="flex flex-col lg:flex-row gap-4">
        
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-2 flex items-center gap-2 relative">
          <div className="absolute left-4 text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search job title, company or keyword"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-transparent text-sm focus:outline-none text-gray-900 placeholder-gray-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-2 flex items-center gap-2 cursor-pointer">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">Location</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-2 flex items-center gap-2 cursor-pointer hidden sm:flex">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 font-medium">Job Type</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-4 py-2 flex items-center gap-2 cursor-pointer hidden md:flex">
            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
            <span className="text-sm text-gray-600 font-medium">Experience</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <button className="bg-white border border-blue-100 text-blue-600 rounded-2xl shadow-sm px-4 py-2 flex items-center gap-2 font-semibold text-sm hover:bg-blue-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>
            Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        <div className="w-full lg:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100 text-[15px]">Filter by</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Job Type</h4>
                <div className="space-y-2.5 text-sm text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /> Full-time</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> Part-time</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> Internship</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> Contract</label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Experience Level</h4>
                <div className="space-y-2.5 text-sm text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> Fresher</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> 0 - 1 Year</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked /> 1 - 3 Years</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> 3 - 5 Years</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" /> 5+ Years</label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Salary Range</h4>
                <div className="px-2">
                  <input type="range" className="w-full accent-blue-600" min="0" max="30" defaultValue="15" />
                  <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                    <span>₹0 LPA</span>
                    <span>₹30+ LPA</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              Clear Filters
            </button>
          </div>
        </div>

        
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-900">{filteredJobs.length > 0 ? filteredJobs.length : "125"} jobs found</span>
            <div className="text-gray-500 font-medium flex items-center gap-1">
              Sort by: <span className="font-bold text-gray-900 flex items-center gap-1 cursor-pointer">Relevance <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-12 h-12 bg-slate-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">No jobs found</h3>
              <p className="text-sm text-gray-500 mt-1">Try clearing your filters or refining your search term.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map((job, idx) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-100 transition-all flex flex-col sm:flex-row gap-5"
                >
                  <div className="w-14 h-14 bg-[#0f172a] text-white rounded-xl font-bold flex items-center justify-center text-lg shrink-0">
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base hover:text-blue-600 transition-colors cursor-pointer">
                          {job.title}
                        </h3>
                        <p className="text-[13px] font-semibold text-gray-600 mt-0.5 flex items-center gap-1">
                          {job.company} <span className="text-blue-500"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.4-1.4 3.6 3.6 7.6-7.6L19 8l-9 9z"/></svg></span>
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {idx === 0 || idx === 2 ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-green-50 text-green-600 border border-green-200/50 flex items-center gap-1">
                            New
                          </span>
                        ) : idx === 1 || idx === 3 ? (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-600 border border-red-200/50 flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> Hot
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-200/50 flex items-center gap-1">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> Active
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[12px] font-semibold text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                        <span>Full-time</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
                        <span>{job.experience}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#f4f7ff] text-blue-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <span className="text-[11px] font-medium text-gray-400 whitespace-nowrap ml-4">Posted {idx + 1}h ago</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
