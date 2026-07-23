"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Briefcase, Building2, Search, FileText, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const { setRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white font-extrabold text-xl shadow-md shadow-blue-200">
              CC
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-gray-900 tracking-tight leading-none">
                CAREER
              </span>
              <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] -mt-0.5">
                CONNECT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              onClick={() => setRole("candidate")}
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/login?tab=register"
              onClick={() => setRole("candidate")}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      
      <section className="relative overflow-hidden py-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        
        <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>

        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 font-semibold text-xs rounded-full uppercase tracking-wider mb-6">
          ðŸš€ Empowering Your Professional Journey
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl leading-[1.1] mb-6">
          Connecting Top Talent With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Great Companies</span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
          Career Connect simplifies the job search and hiring process. Real-time application tracking, premium dashboards, and instant updates.
        </p>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl mb-16">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-slate-100/50 flex flex-col items-center text-center group hover:border-blue-200 hover:shadow-blue-50/50 transition-all">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Are you a Job Seeker?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Create your profile, apply to top roles, and track your application status in real-time.
            </p>
            <Link
              href="/login?role=candidate"
              onClick={() => setRole("candidate")}
              className="mt-auto flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all w-full justify-center shadow-md shadow-blue-200"
            >
              Find a Job <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl shadow-slate-100/50 flex flex-col items-center text-center group hover:border-indigo-200 hover:shadow-indigo-50/50 transition-all">
            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Are you an Employer?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Post job openings, review applicants, evaluate resumes, and make hires in one central dashboard.
            </p>
            <Link
              href="/login?role=employer"
              onClick={() => setRole("employer")}
              className="mt-auto flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all w-full justify-center shadow-md shadow-indigo-200"
            >
              Post a Position <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white border border-gray-100 rounded-3xl p-8 shadow-md w-full max-w-4xl">
          <div>
            <h4 className="text-3xl font-extrabold text-blue-600">18+</h4>
            <p className="text-sm text-gray-500 mt-1 font-medium">Active Jobs</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-blue-600">240+</h4>
            <p className="text-sm text-gray-500 mt-1 font-medium">Applications</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-blue-600">99%</h4>
            <p className="text-sm text-gray-500 mt-1 font-medium">Success Rate</p>
          </div>
          <div>
            <h4 className="text-3xl font-extrabold text-blue-600">24/7</h4>
            <p className="text-sm text-gray-500 mt-1 font-medium">Live Tracking</p>
          </div>
        </div>
      </section>

      
      <section className="bg-white py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-gray-500 font-medium">
              We provide the tools to simplify matching candidates with their dream career paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl flex flex-col">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Smart Search & Filter</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Filter open jobs by experience, location, role, and salary instantly. Apply in just one click.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl flex flex-col">
              <div className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Real-Time Status Tracking</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Candidates get immediate notifications when their resume is viewed, shortlisted, or accepted.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl flex flex-col">
              <div className="w-10 h-10 bg-indigo-500 text-white rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Batch Management</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Employers can review candidate applications, view interactive resumes, and update statuses in batch.
              </p>
            </div>
          </div>
        </div>
      </section>

      
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-sm border-t border-slate-800 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-lg">
              CC
            </div>
            <span className="text-base font-bold text-white tracking-tight">Career Connect</span>
          </div>
          <p>&copy; {new Date().getFullYear()} Career Connect. Built as a prototype for modern hiring.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
