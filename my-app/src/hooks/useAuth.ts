"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import type { Role } from "@/types";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session?.user?.id;

  const user: AuthUser | null =
    isAuthenticated && session?.user
      ? {
          id: session.user.id,
          name: session.user.name ?? "",
          email: session.user.email ?? "",
          role: session.user.role,
        }
      : null;

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password" };
    }
    if (result?.ok) {
      return { success: true };
    }
    return { success: false, error: "Login failed. Please try again." };
  };

  const logout = async (): Promise<void> => {
    await signOut({ redirect: true, callbackUrl: "/login" });
  };

  return { user, role: user?.role ?? null, isAuthenticated, isLoading, login, logout };
}
