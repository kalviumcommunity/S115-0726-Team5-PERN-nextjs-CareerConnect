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
