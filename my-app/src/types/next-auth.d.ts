import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CANDIDATE" | "EMPLOYER";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "CANDIDATE" | "EMPLOYER";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "CANDIDATE" | "EMPLOYER";
  }
}
