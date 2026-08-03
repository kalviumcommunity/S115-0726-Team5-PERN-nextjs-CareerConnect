"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Building2 } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/useAuth";
import { registerUser } from "@/actions/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, isLoading: sessionLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "register">(
    searchParams.get("tab") === "register" ? "register" : "login",
  );
  const [loginRole, setLoginRole] = useState<"candidate" | "employer">(
    searchParams.get("role") === "employer" ? "employer" : "candidate",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect already-authenticated users away from the login page
  useEffect(() => {
    if (!sessionLoading && user) {
      const dest =
        user.role === "EMPLOYER" ? "/employer/dashboard" : "/dashboard";
      router.replace(dest);
    }
  }, [user, sessionLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
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

    if (activeTab === "register") {
      toast.loading("Creating account...", { id: "auth" });
      const result = await registerUser({
        name: fullName,
        email,
        password,
        role: loginRole === "employer" ? "EMPLOYER" : "CANDIDATE",
      });

      if (!result.success) {
        toast.dismiss("auth");
        toast.error(result.message ?? "Registration failed");
        setIsLoading(false);
        return;
      }

      toast.dismiss("auth");
      toast.success("Account created! Logging you in…");
      // Fall through to login after successful registration
    }

    toast.loading("Logging in…", { id: "auth" });
    const result = await login(email, password);
    toast.dismiss("auth");

    if (!result.success) {
      toast.error(result.error ?? "Login failed");
      setIsLoading(false);
      return;
    }

    toast.success("Welcome back!");
    // Redirect handled by the useEffect above once session updates
    setIsLoading(false);
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

        {/* Role toggle */}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "register" && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                Password
              </label>
              {activeTab === "login" && (
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 mt-4 text-sm font-semibold text-white rounded-xl shadow-md transition-all ${
              loginRole === "employer"
                ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading
              ? activeTab === "login"
                ? "Logging in…"
                : "Creating account…"
              : activeTab === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 font-medium">
            {activeTab === "login" ? "New to Career Connect?" : "Already have an account?"}{" "}
            <button
              onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
              className={`font-bold hover:underline ${
                loginRole === "employer" ? "text-indigo-600" : "text-blue-600"
              }`}
            >
              {activeTab === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center font-sans">
          <p className="text-sm font-semibold text-gray-500">Loading Career Connect…</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
