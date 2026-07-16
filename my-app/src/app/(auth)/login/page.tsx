//Login Page
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp, Role } from "@/context/AppContext";
import { Mail, Lock, User, Eye, EyeOff, Building2, Globe } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole } = useApp();

  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginRole, setLoginRole] = useState<"candidate" | "employer">("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "register") {
      setActiveTab("register");
    }

    const roleParam = searchParams.get("role");
    if (roleParam === "employer") {
      setLoginRole("employer");
    } else if (roleParam === "candidate") {
      setLoginRole("candidate");
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (activeTab === "register" && !fullName) {
      toast.error("Please enter your name.");
      return;
    }

    setIsLoading(true);
    toast.loading(activeTab === "login" ? "Logging in..." : "Creating account...", { id: "auth" });

    setTimeout(() => {
      setIsLoading(false);
      toast.dismiss("auth");

      if (loginRole === "candidate") {
        setRole("candidate");
        toast.success(`Welcome back! Logged in as Candidate.`);
        router.push("/dashboard");
      } else {
        setRole("employer");
        toast.success(`Welcome back! Logged in as Employer.`);
        router.push("/employer/dashboard");
      }
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    toast.loading("Connecting with Google...", { id: "google-auth" });

    setTimeout(() => {
      setIsLoading(false);
      toast.dismiss("google-auth");
      if (loginRole === "candidate") {
        setRole("candidate");
        toast.success(`Logged in with Google as Candidate.`);
        router.push("/dashboard");
      } else {
        setRole("employer");
        toast.success(`Logged in with Google as Employer.`);
        router.push("/employer/dashboard");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      
      <Link href="/" className="flex items-center gap-2.5 mb-8">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-2xl shadow-md shadow-blue-200">
          CC
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-extrabold text-gray-900 tracking-tight leading-none">
            CAREER
          </span>
          <span className="text-[11px] font-bold text-blue-600 tracking-[0.2em] -mt-0.5">
            CONNECT
          </span>
        </div>
      </Link>

      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-slate-100/80 p-8 sm:p-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {activeTab === "login" ? "Welcome Back!" : "Create an Account"}
          </h2>
          <p className="text-sm text-gray-500 mt-1.5 font-medium">
            {activeTab === "login"
              ? "Login to your Career Connect account"
              : "Start connecting with jobs & employers today"}
          </p>
        </div>

        
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setLoginRole("candidate")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              loginRole === "candidate"
                ? "bg-white text-blue-600 shadow-sm border border-slate-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <User className="w-4 h-4" />
            Candidate
          </button>
          <button
            type="button"
            onClick={() => setLoginRole("employer")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              loginRole === "employer"
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Employer
          </button>
        </div>