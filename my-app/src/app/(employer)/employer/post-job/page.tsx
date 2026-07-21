"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, IndianRupee, Star, Code, FileText } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployerPostJobPage() {
  const { postJob, setEmployerPage } = useApp();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("Bangalore, India");
  const [salary, setSalary] = useState("");
  const [experience, setExperience] = useState("1 - 3 Years");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !salary || !skills || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const skillsArray = skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    postJob({
      title,
      company: "Tech Solutions",
      location,
      salary,
      experience,
      skills: skillsArray,
      description,
    });
    setTitle("");
    setSalary("");
    setSkills("");
    setDescription("");
    setEmployerPage("dashboard");
    router.push("/employer/dashboard");
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">Post a Job</h1>
        <p className="text-sm text-gray-500 mt-1">Hire your next developer by posting a new opportunity.</p>
      </div>

      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="font-bold text-gray-950 text-base border-b border-gray-50 pb-2">
            Opportunity Details
          </h3>

          
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Developer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-950 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Bangalore, India">Bangalore, India</option>
                  <option value="Hyderabad, India">Hyderabad, India</option>
                  <option value="Pune, India">Pune, India</option>
                  <option value="Mumbai, India">Mumbai, India</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Salary Range <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <IndianRupee className="w-4.5 h-4.5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. â‚¹12L - â‚¹16L"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-950 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Experience Level Required <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Star className="w-4.5 h-4.5" />
              </div>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Freshers">Freshers / Entry Level</option>
                <option value="1 - 3 Years">1 - 3 Years</option>
                <option value="2 - 4 Years">2 - 4 Years</option>
                <option value="3 - 5 Years">3 - 5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>
          </div>

          
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Required Skills (comma-separated) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Code className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g. React, TypeScript, Next.js, Node.js"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-950 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              Job Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3.5 pointer-events-none text-gray-400">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <textarea
                required
                rows={5}
                placeholder="Detail the roles and responsibilities for this opening..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-950 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setEmployerPage("dashboard");
                router.push("/employer/dashboard");
              }}
              className="px-5 py-2.5 border border-gray-200 text-sm font-bold text-gray-600 rounded-xl hover:bg-gray-50 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
            >
              Publish Job Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
