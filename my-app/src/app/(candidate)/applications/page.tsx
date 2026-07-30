"use client";

import React, { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Calendar, Building, Briefcase, Clock, 
  CheckCircle2, XCircle, Zap, Eye, Check
} from 'lucide-react';

export default function CandidateApplicationsPage() {
  const { profile, applications } = useApp();
  
  const myApplications = useMemo(() => {
    if (!profile?.email || !applications) return [];
    return applications.filter((app: any) => app.candidateEmail === profile.email);
  }, [profile, applications]);

  const stats = useMemo(() => {
    let total = myApplications.length;
    let pending = 0;
    let inReviewOrShortlisted = 0;
    let rejected = 0;

    myApplications.forEach((app: any) => {
      const s = app.status?.toLowerCase() || '';
      if (s === 'pending' || s === 'applied') pending++;
      else if (s === 'in review' || s === 'shortlisted') inReviewOrShortlisted++;
      else if (s === 'rejected') rejected++;
    });

    return { total, pending, inReviewOrShortlisted, rejected };
  }, [myApplications]);

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'pending' || s === 'applied') return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s === 'shortlisted') return 'bg-green-50 text-green-700 border-green-200';
    if (s === 'in review') return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s === 'hired') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s === 'rejected') return 'bg-red-50 text-red-700 border-red-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getInitials = (name: string) => {
    if (!name) return 'C';
    return name.charAt(0).toUpperCase();
  };

  const stages = ['Applied', 'In Review', 'Shortlisted', 'Hired'];

  const getStageIndex = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s === 'applied' || s === 'pending') return 0;
    if (s === 'in review') return 1;
    if (s === 'shortlisted') return 2;
    if (s === 'hired') return 3;
    return -1;
  };

  const renderTimeline = (status: string) => {
    const isRejected = status?.toLowerCase() === 'rejected';
    const currentIndex = isRejected ? 0 : getStageIndex(status);

    return (
      <div className="mt-8 mb-2 px-4 sm:px-8">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0"></div>
          
          {/* Active Progress Line */}
          {!isRejected && (
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 rounded-full z-0 transition-all duration-500"
              style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
            ></div>
          )}
          {isRejected && (
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-red-500 rounded-full z-0 transition-all duration-500"
              style={{ width: `50%` }}
            ></div>
          )}

          {stages.map((stage, idx) => {
            const isCompleted = !isRejected && currentIndex >= idx;
            const isCurrent = !isRejected && currentIndex === idx;
            const isFuture = !isRejected && currentIndex < idx;
            
            return (
              <div key={stage} className="relative z-10 flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                  ${isCompleted ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                  {isCompleted ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current opacity-50" />}
                </div>
                <span className={`absolute top-10 whitespace-nowrap text-xs font-semibold
                  ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                  {stage}
                </span>
              </div>
            );
          })}

          {isRejected && (
            <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/4 z-10 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white border-red-500 text-red-500 shadow-sm animate-bounce-in">
                <XCircle className="w-6 h-6" />
              </div>
              <span className="absolute top-12 whitespace-nowrap text-xs font-bold text-red-600">
                Rejected
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            My Applications
            <span className="bg-blue-100 text-blue-700 text-sm font-bold px-3 py-1 rounded-full shadow-sm">
              {stats.total}
            </span>
          </h1>
          <p className="text-gray-500 mt-2 text-base font-medium">Track your job applications and status updates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="glass bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex items-center gap-5 shadow-sm stagger-1">
          <div className="bg-blue-100 p-3.5 rounded-2xl text-blue-600 shadow-sm">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Total</p>
            <p className="text-3xl font-black text-gray-900">{stats.total}</p>
          </div>
        </div>
        <div className="glass bg-amber-50/50 border border-amber-100 rounded-3xl p-6 flex items-center gap-5 shadow-sm stagger-2">
          <div className="bg-amber-100 p-3.5 rounded-2xl text-amber-600 shadow-sm">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Pending</p>
            <p className="text-3xl font-black text-gray-900">{stats.pending}</p>
          </div>
        </div>
        <div className="glass bg-green-50/50 border border-green-100 rounded-3xl p-6 flex items-center gap-5 shadow-sm stagger-3">
          <div className="bg-green-100 p-3.5 rounded-2xl text-green-600 shadow-sm">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Active</p>
            <p className="text-3xl font-black text-gray-900">{stats.inReviewOrShortlisted}</p>
          </div>
        </div>
        <div className="glass bg-red-50/50 border border-red-100 rounded-3xl p-6 flex items-center gap-5 shadow-sm stagger-4">
          <div className="bg-red-100 p-3.5 rounded-2xl text-red-600 shadow-sm">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-1">Rejected</p>
            <p className="text-3xl font-black text-gray-900">{stats.rejected}</p>
          </div>
        </div>
      </div>

      {myApplications.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center shadow-sm flex flex-col items-center justify-center animate-scale-in">
          <div className="bg-blue-50/80 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm border border-blue-100">
            <Briefcase className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto text-base">Start applying to see your tracker here. Explore our job portal and find your dream job today.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {myApplications.map((app: any, idx: number) => {
            const staggerClass = `stagger-${(idx % 8) + 1}`;
            const isPending = app.status?.toLowerCase() === 'pending' || app.status?.toLowerCase() === 'applied';
            
            return (
              <div 
                key={app.id || idx} 
                className={`relative bg-white rounded-3xl border border-gray-100 p-6 pb-14 shadow-sm hover:shadow-md transition-all animate-slide-in-up ${staggerClass} overflow-hidden`}
              >
                {app.isNew && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
                    <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl z-10 flex items-center gap-1.5 shadow-sm">
                      <Zap className="w-3.5 h-3.5" /> Just Applied
                    </div>
                  </>
                )}
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xl font-extrabold shadow-sm">
                      {getInitials(app.companyName)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{app.jobTitle}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1.5 font-medium">
                        <span className="flex items-center gap-1.5"><Building className="w-4 h-4 text-gray-400" /> {app.companyName || 'Unknown Company'}</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> Applied on {app.appliedDate || 'Recently'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-2xl border text-sm font-bold flex items-center gap-2.5 shadow-sm ${getStatusColor(app.status)}`}>
                    {isPending && (
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-live-pulse" />
                    )}
                    {app.status || 'Applied'}
                  </div>
                </div>

                {renderTimeline(app.status)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
