"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  Briefcase,
  Building2,
  Search,
  FileText,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Bell,
  Users,
  Lock,
  Eye,
  Rocket,
  Star,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const { setRole } = useApp();
  
  const [stats, setStats] = useState({ jobs: 0, apps: 0, success: 0, hours: 0 });
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setStats({
        jobs: Math.min(Math.floor((18 / steps) * currentStep), 18),
        apps: Math.min(Math.floor((240 / steps) * currentStep), 240),
        success: Math.min(Math.floor((99 / steps) * currentStep), 99),
        hours: Math.min(Math.floor((24 / steps) * currentStep), 24),
      });
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, []);

  const [activeTab, setActiveTab] = useState<'candidate' | 'employer'>('candidate');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                C
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Career<span className="text-blue-600">Connect</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Login
              </Link>
              <Link href="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium transition-all shadow-sm shadow-blue-200">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50 opacity-70 animate-gradient-flow" style={{ backgroundSize: '200% 200%' }}></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-50 transform translate-x-1/4 -translate-y-1/4"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-purple-100 rounded-full blur-3xl opacity-50 transform -translate-x-1/4 translate-y-1/4"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-medium text-sm mb-8 animate-fade-in stagger-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>The #1 platform for tech talent</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 animate-slide-in-up stagger-2">
              Find Your Next <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                Dream Opportunity
              </span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 animate-slide-in-up stagger-3">
              Connect with top employers and exciting startups. Your career journey starts here with intelligent matching and real-time application tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-slide-in-up stagger-4">
              <Link 
                href="/login?role=candidate" 
                onClick={() => setRole("candidate")}
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-full font-semibold text-lg transition-all shadow-lg shadow-gray-900/20 flex items-center justify-center gap-2 group"
              >
                Find a Job 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/login?role=employer" 
                onClick={() => setRole("employer")}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 rounded-full font-semibold text-lg transition-all shadow-sm flex items-center justify-center gap-2 group"
              >
                Hire Talent
                <Building2 className="w-5 h-5 text-blue-600" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="relative z-20 -mt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-scale-in stagger-5">
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x-0 md:divide-x divide-gray-100">
              <div className="text-center">
                <div className="text-4xl font-black text-gray-900 mb-1 flex justify-center items-baseline animate-count-pop">{stats.jobs}<span className="text-blue-600">+</span></div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-gray-900 mb-1 flex justify-center items-baseline animate-count-pop">{stats.apps}<span className="text-indigo-600">+</span></div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Applications</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-gray-900 mb-1 flex justify-center items-baseline animate-count-pop">{stats.success}<span className="text-purple-600">%</span></div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-gray-900 mb-1 flex justify-center items-baseline animate-count-pop">{stats.hours}<span className="text-pink-600">/7</span></div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Live Tracking</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How CareerConnect Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Simple, transparent, and built for your success.</p>
              
              <div className="inline-flex bg-gray-100 p-1 rounded-full mt-8">
                <button 
                  onClick={() => setActiveTab('candidate')}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'candidate' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  For Candidates
                </button>
                <button 
                  onClick={() => setActiveTab('employer')}
                  className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${activeTab === 'employer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  For Employers
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {activeTab === 'candidate' ? (
                <>
                  <div className="relative p-6 bg-slate-50 rounded-2xl border border-gray-100 animate-slide-in-up stagger-1">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="absolute top-6 right-6 text-4xl font-black text-gray-200">01</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Opportunities</h3>
                    <p className="text-gray-600">Browse through thousands of curated job listings tailored to your skills and preferences.</p>
                  </div>
                  <div className="relative p-6 bg-slate-50 rounded-2xl border border-gray-100 animate-slide-in-up stagger-2">
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="absolute top-6 right-6 text-4xl font-black text-gray-200">02</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Apply Seamlessly</h3>
                    <p className="text-gray-600">Submit your profile with one click and let our smart system handle the formatting.</p>
                  </div>
                  <div className="relative p-6 bg-slate-50 rounded-2xl border border-gray-100 animate-slide-in-up stagger-3">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                      <BarChart3 className="w-6 h-6" />
                    </div>
                    <div className="absolute top-6 right-6 text-4xl font-black text-gray-200">03</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                    <p className="text-gray-600">Get real-time updates on your application status directly in your dashboard.</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative p-6 bg-slate-50 rounded-2xl border border-gray-100 animate-slide-in-up stagger-1">
                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                      <Rocket className="w-6 h-6" />
                    </div>
                    <div className="absolute top-6 right-6 text-4xl font-black text-gray-200">01</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Post a Job</h3>
                    <p className="text-gray-600">Create a detailed listing in minutes to attract the best talent on the market.</p>
                  </div>
                  <div className="relative p-6 bg-slate-50 rounded-2xl border border-gray-100 animate-slide-in-up stagger-2">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="absolute top-6 right-6 text-4xl font-black text-gray-200">02</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Review Candidates</h3>
                    <p className="text-gray-600">Access our intuitive dashboard to review, filter, and shortlist candidates efficiently.</p>
                  </div>
                  <div className="relative p-6 bg-slate-50 rounded-2xl border border-gray-100 animate-slide-in-up stagger-3">
                    <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="absolute top-6 right-6 text-4xl font-black text-gray-200">03</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Hire the Best</h3>
                    <p className="text-gray-600">Communicate directly with candidates and make offers seamlessly through our platform.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-50 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">Powerful features designed to make hiring and job hunting a breeze.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Search, title: 'Smart Job Search', desc: 'AI-powered matching algorithms to find the perfect fit.', color: 'text-blue-600', bg: 'bg-blue-50' },
                { icon: BarChart3, title: 'Real-Time Tracking', desc: 'Never wonder about your application status again.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { icon: Bell, title: 'Instant Notifications', desc: 'Get alerts the second your application is reviewed.', color: 'text-purple-600', bg: 'bg-purple-50' },
                { icon: Users, title: 'Batch Management', desc: 'Employers can process multiple applications at once.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { icon: Eye, title: 'Resume Viewer', desc: 'Built-in PDF and rich-text resume rendering.', color: 'text-rose-600', bg: 'bg-rose-50' },
                { icon: Lock, title: 'Secure & Private', desc: 'Enterprise-grade security for your personal data.', color: 'text-amber-600', bg: 'bg-amber-50' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-full ${feature.bg} ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Loved by Professionals</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">See what our users have to say about CareerConnect.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { quote: "CareerConnect made finding my dream role as a Frontend Engineer incredibly smooth. The real-time tracking is a game-changer.", name: "Sarah J.", role: "Frontend Developer", init: "SJ", color: "bg-blue-100 text-blue-700" },
                { quote: "We've hired three senior developers through this platform in just one month. The applicant quality is outstanding.", name: "David M.", role: "Engineering Manager", init: "DM", color: "bg-indigo-100 text-indigo-700" },
                { quote: "The interface is beautiful and intuitive. I love how I can see exactly where my application is in the review process.", name: "Elena R.", role: "UX Designer", init: "ER", color: "bg-purple-100 text-purple-700" }
              ].map((t, i) => (
                <div key={i} className="glass p-8 rounded-3xl border border-gray-100 bg-white/50 backdrop-blur-sm hover:shadow-md transition-shadow relative">
                  <Star className="w-8 h-8 text-amber-400 absolute top-8 right-8 opacity-20" />
                  <p className="text-gray-700 mb-6 italic relative z-10">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${t.color}`}>
                      {t.init}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{t.name}</div>
                      <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 z-0"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
            <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of professionals and top companies already using CareerConnect.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link 
                href="/login?role=candidate" 
                onClick={() => setRole("candidate")}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 rounded-full font-bold text-lg transition-all shadow-lg"
              >
                Join as Candidate
              </Link>
              <Link 
                href="/login?role=employer" 
                onClick={() => setRole("employer")}
                className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/10 text-white border-2 border-white/50 hover:border-white rounded-full font-bold text-lg transition-all"
              >
                Join as Employer
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl">
                  C
                </div>
                <span className="font-bold text-xl text-white tracking-tight">Career<span className="text-blue-500">Connect</span></span>
              </div>
              <p className="text-sm max-w-sm">
                Empowering careers and building great teams through intelligent connections and seamless hiring experiences.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/login?role=candidate" className="hover:text-white transition-colors">Find a Job</Link></li>
                <li><Link href="/login?role=employer" className="hover:text-white transition-colors">Post a Job</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
              <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
