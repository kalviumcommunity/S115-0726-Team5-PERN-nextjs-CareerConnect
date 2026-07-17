"use client";

import React, { useState } from "react";
import { Building2, Mail, MapPin, FileText, Camera } from "lucide-react";
import toast from "react-hot-toast";

export default function EmployerCompanyProfilePage() {
  const [name, setName] = useState("Tech Solutions");
  const [email, setEmail] = useState("info@techsolutions.com");
  const [location, setLocation] = useState("Bangalore, India");
  const [description, setDescription] = useState(
    "Tech Solutions is a leading developer of high-quality software products and mobile applications. We pride ourselves on innovation, engineering excellence, and maintaining a culture of collaborative growth."
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Company profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 tracking-tight">Company Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage public details for your organization.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="relative group mb-4">
            <div className="w-24 h-24 rounded-2xl bg-indigo-50 text-indigo-600 font-extrabold text-3xl flex items-center justify-center border border-indigo-100">
              TS
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <h3 className="font-extrabold text-gray-950 text-base">{name}</h3>
          <p className="text-xs text-indigo-600 font-semibold mt-1">Tech Solutions Inc.</p>

          <div className="w-full border-t border-gray-50 my-5"></div>

          <div className="w-full space-y-3.5 text-xs text-gray-600 font-medium">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="font-bold text-gray-950 text-base border-b border-gray-50 pb-2">
              Edit Organization Details
            </h3>

            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-950 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-950 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  HQ Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-950 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Description / About Us
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-gray-950 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 text-sm font-bold text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all"
              >
                Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
