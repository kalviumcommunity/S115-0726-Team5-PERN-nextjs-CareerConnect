import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/services/auth.service";
import { LoginSchema } from "@/lib/validations";
import { UnauthorizedError, ForbiddenError } from "@/lib/errors";
import type { AuthenticatedUser } from "@/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = LoginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await authService.validateCredentials(parsed.data);
        if (!user) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await getAuthSession();
  if (!session?.user?.id) {
    throw new UnauthorizedError("Authentication required");
  }
  return session.user;
}

export async function requireRole(roles: Role[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new ForbiddenError("Insufficient permissions");
  }
  return user;
}

export async function requireEmployer(): Promise<AuthenticatedUser> {
  return requireRole([Role.EMPLOYER]);
}

export async function requireCandidate(): Promise<AuthenticatedUser> {
  return requireRole([Role.CANDIDATE]);
}
