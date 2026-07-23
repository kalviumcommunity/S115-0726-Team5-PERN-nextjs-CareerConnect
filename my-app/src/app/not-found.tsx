"use client";

import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md space-y-6">
        
        <div className="relative mx-auto w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-100 border border-blue-100/50 animate-bounce">
          <FileQuestion className="w-12 h-12" />
        </div>

        
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
          <h2 className="text-xl font-extrabold text-slate-800">Page Not Found</h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
            Oops! The page you are looking for doesn&apos;t exist or has been moved to another path.
          </p>
        </div>

        
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
// notFound.tsx