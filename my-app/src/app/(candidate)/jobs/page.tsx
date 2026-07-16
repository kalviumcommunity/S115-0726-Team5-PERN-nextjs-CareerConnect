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
        <p className="text-sm text-gray-500 mt-1">Explore job openings matching your preferences and skillset.</p>
      </div>

      
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search by title, company, skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              placeholder="Filter by city (e.g. Bangalore)..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          
          <select
            value={expFilter}
            onChange={(e) => setExpFilter(e.target.value)}
            className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Experience Levels</option>
            <option value="1 - 3 Years">1 - 3 Years</option>
            <option value="2 - 4 Years">2 - 4 Years</option>
            <option value="3 - 5 Years">3 - 5 Years</option>
          </select>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-blue-100 transition-all flex flex-col justify-between"
            >
              <div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-center text-lg shrink-0">
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 hover:text-blue-600 transition-colors text-base">
                      {job.title}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600 mt-0.5">{job.company}</p>
                  </div>
                </div>

                
                <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <Star className="w-4 h-4 text-gray-400 shrink-0" />
                    <span>{job.experience} experience required</span>
                  </div>
                </div>

                
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-gray-500 mt-4 leading-relaxed line-clamp-3">
                  {job.description}
                </p>
              </div>

              
              <div className="mt-5 pt-4 border-t border-gray-50">
                {job.applied ? (
                  <button
                    disabled
                    className="w-full py-2.5 text-sm font-bold bg-green-50 text-green-700 border border-green-200 rounded-xl cursor-not-allowed"
                  >
                    Applied
                  </button>
                ) : (
                  <button
                    onClick={() => applyToJob(job.id)}
                    className="w-full py-2.5 text-sm font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 hover:shadow-lg"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
