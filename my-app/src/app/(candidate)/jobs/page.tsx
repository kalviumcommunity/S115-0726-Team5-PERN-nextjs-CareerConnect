"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  IndianRupee, 
  Star, 
  ShieldAlert, 
  X, 
  Check, 
  Send, 
  ArrowRight,
  Filter,
  Clock
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function CandidateJobsPage() {
  const { jobs, applyToJob } = useApp();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [expFilter, setExpFilter] = useState<string[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]);
  const [salaryFilter, setSalaryFilter] = useState<number>(0);
  const [applyModalJobId, setApplyModalJobId] = useState<string | null>(null);

  // Filter jobs based on criteria
  const filteredJobs = useMemo(() => {
    return (jobs || []).filter((job: any) => {
      const matchSearch = job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchLocation = locationFilter ? job?.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
      const matchExp = expFilter.length > 0 ? expFilter.includes(job?.level) : true;
      const matchJobType = jobTypeFilter.length > 0 ? jobTypeFilter.includes(job?.jobType) : true;
      // assuming job.salary is a number or can be parsed
      const salaryValue = typeof job?.salary === 'number' ? job.salary : parseInt(job?.salary) || 0;
      const matchSalary = salaryFilter > 0 ? salaryValue >= salaryFilter : true;
      
      return matchSearch && matchLocation && matchExp && matchJobType && matchSalary;
    });
  }, [jobs, searchTerm, locationFilter, expFilter, jobTypeFilter, salaryFilter]);

  const toggleExpFilter = (val: string) => {
    setExpFilter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const toggleJobTypeFilter = (val: string) => {
    setJobTypeFilter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const handleApplyClick = (jobId: string) => {
    setApplyModalJobId(jobId);
  };

  const confirmApply = () => {
    if (applyModalJobId) {
      applyToJob(applyModalJobId);
      setApplyModalJobId(null);
    }
  };

  const selectedJobForModal = jobs?.find((j: any) => j._id === applyModalJobId || j.id === applyModalJobId);

  return (
    <div className="min-h-screen bg-gray-50/50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Find your dream job</h1>
          <p className="text-gray-500">Discover thousands of job opportunities tailored for you.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 animate-slide-in-up stagger-1 glass">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-1 flex items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Location"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-semibold transition-colors flex items-center justify-center shadow-md">
              Find Jobs
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 flex-shrink-0 animate-fade-in stagger-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6 text-gray-900">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-bold">Filters</h2>
              </div>
              
              {/* Job Type */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Job Type</h3>
                <div className="space-y-3">
                  {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
                    <label key={type} className="flex items-center cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={jobTypeFilter.includes(type)}
                          onChange={() => toggleJobTypeFilter(type)}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                        </div>
                      </div>
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Experience Level</h3>
                <div className="space-y-3">
                  {["Fresher", "Junior", "Mid-Level", "Senior", "Lead"].map((exp) => (
                    <label key={exp} className="flex items-center cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={expFilter.includes(exp)}
                          onChange={() => toggleExpFilter(exp)}
                        />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-lg peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100" />
                        </div>
                      </div>
                      <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{exp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Minimum Salary</h3>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="10000"
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="mt-3 flex justify-between text-xs text-gray-500 font-medium">
                  <span>Any</span>
                  <span>{salaryFilter > 0 ? `₹${salaryFilter.toLocaleString()}+` : ''}</span>
                </div>
              </div>
              
            </div>
          </div>

          {/* Job Listings */}
          <div className="w-full lg:w-3/4">
            <div className="mb-6 flex justify-between items-center animate-fade-in stagger-3">
              <p className="text-gray-600 font-medium">Showing {filteredJobs.length} jobs</p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span>Sort by:</span>
                <select className="bg-transparent font-medium text-gray-900 outline-none cursor-pointer">
                  <option>Most relevant</option>
                  <option>Newest</option>
                  <option>Highest paid</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job: any, index: number) => {
                  const staggerClass = `stagger-${Math.min(index + 3, 8)}`;
                  const jobId = job._id || job.id;
                  return (
                    <div 
                      key={jobId} 
                      className={`bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all animate-slide-in-up ${staggerClass} group`}
                    >
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-shrink-0">
                          {job.company?.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={job.company.logo} alt={job.company.name ?? ""} className="w-16 h-16 rounded-2xl object-cover border border-gray-50" />
                          ) : (
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
                              {job.company?.name?.charAt(0) || "C"}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {job.title}
                                </h3>
                                <div className="text-gray-500 font-medium mt-1">
                                  {job.company?.name || "Company"}
                                </div>
                              </div>
                              <button className="text-gray-400 hover:text-yellow-500 transition-colors p-2 rounded-full hover:bg-yellow-50">
                                <Star className="w-5 h-5" />
                              </button>
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
                              {job.location && (
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span>{job.location}</span>
                                </div>
                              )}
                              {job.jobType && (
                                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                                  <Briefcase className="w-4 h-4 text-gray-400" />
                                  <span>{job.jobType}</span>
                                </div>
                              )}
                              {job.salary && (
                                <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-full text-green-700 font-medium">
                                  <IndianRupee className="w-4 h-4" />
                                  <span>{typeof job.salary === 'number' ? job.salary.toLocaleString() : job.salary}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center border-t border-gray-100 pt-4 gap-4 sm:gap-0">
                            <div className="flex items-center text-xs text-gray-400">
                              <Clock className="w-3.5 h-3.5 mr-1.5" />
                              Posted {job.date || "recently"}
                            </div>
                            
                            {job.applied ? (
                              <button 
                                disabled 
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-50 text-green-600 font-semibold text-sm cursor-not-allowed w-full sm:w-auto justify-center animate-bounce-in"
                              >
                                <Check className="w-4 h-4" />
                                Applied
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleApplyClick(jobId)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-colors shadow-sm w-full sm:w-auto justify-center group/btn"
                              >
                                Apply Now
                                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm animate-fade-in">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Apply Confirmation Modal */}
      {applyModalJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-scale-in">
            <button 
              onClick={() => setApplyModalJobId(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Send className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Apply for this role?</h3>
            {selectedJobForModal && (
              <p className="text-gray-600 mb-8">
                Are you sure you want to apply for the <span className="font-semibold text-gray-900">{selectedJobForModal.title}</span> position at <span className="font-semibold text-gray-900">{selectedJobForModal.company}</span>?
              </p>
            )}
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmApply}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Confirm Application
              </button>
              <button 
                onClick={() => setApplyModalJobId(null)}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-2xl transition-colors border border-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
