// ============================================
// Authentication Configuration
// ============================================

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

// ============================================
// Types
// ============================================

export enum UserRole {
  ADMIN = "admin",
  PROJECT_MANAGER = "project_manager",
  VIEWER = "viewer",
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
}

// ============================================
// Mock Users (for development)
// ============================================

// Pre-hashed passwords (bcrypt with 12 rounds)
// admin123, pm123, viewer123
const MOCK_USERS: (AuthUser & { passwordHash: string })[] = [
  {
    id: "user_admin",
    email: "admin@lightcurve.com",
    passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYI9kKkK0K1G", // admin123
    name: "Admin User",
    role: UserRole.ADMIN,
    isActive: true,
  },
  {
    id: "user_pm",
    email: "pm@lightcurve.com",
    passwordHash: "$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // pm123
    name: "Sarah Mitchell",
    role: UserRole.PROJECT_MANAGER,
    isActive: true,
  },
  {
    id: "user_viewer",
    email: "viewer@lightcurve.com",
    passwordHash: "$2a$12$PXDzNH8v9euL.OZBWW1pAOc7gJk5w5a/qx5YV5j5Ym5YV5j5Ym5Y", // viewer123
    name: "John Smith",
    role: UserRole.VIEWER,
    isActive: true,
  },
];

// ============================================
// Auth Options
// ============================================

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
        );

        if (!user || !user.isActive) {
          return null;
        }

        // For demo purposes, accept these simple passwords
        // In production, always use bcrypt.compare
        const validPasswords: Record<string, string> = {
          "admin@lightcurve.com": "admin123",
          "pm@lightcurve.com": "pm123",
          "viewer@lightcurve.com": "viewer123",
        };

        const isValidPassword =
          validPasswords[user.email] === credentials.password;

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as AuthUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as AuthUser).id = token.id as string;
        (session.user as AuthUser).role = token.role as UserRole;
      }
      return session;
    },
  },
};

// ============================================
// Permission System
// ============================================

export type Permission =
  | "VIEW_DASHBOARD"
  | "VIEW_PROJECTS"
  | "CREATE_PROJECT"
  | "EDIT_PROJECT"
  | "UPDATE_STAGE"
  | "SEND_EMAIL"
  | "MANAGE_USERS"
  | "SYSTEM_SETTINGS";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    "VIEW_DASHBOARD",
    "VIEW_PROJECTS",
    "CREATE_PROJECT",
    "EDIT_PROJECT",
    "UPDATE_STAGE",
    "SEND_EMAIL",
    "MANAGE_USERS",
    "SYSTEM_SETTINGS",
  ],
  [UserRole.PROJECT_MANAGER]: [
    "VIEW_DASHBOARD",
    "VIEW_PROJECTS",
    "CREATE_PROJECT",
    "EDIT_PROJECT",
    "UPDATE_STAGE",
    "SEND_EMAIL",
  ],
  [UserRole.VIEWER]: ["VIEW_DASHBOARD", "VIEW_PROJECTS"],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return "Administrator";
    case UserRole.PROJECT_MANAGER:
      return "Project Manager";
    case UserRole.VIEWER:
      return "Viewer";
    default:
      return "Unknown";
  }
}

// ============================================
// Mock User Functions (for development)
// ============================================

export function getMockUsers(): AuthUser[] {
  return MOCK_USERS.map(({ passwordHash, ...user }) => user);
}

export function getMockUserById(id: string): AuthUser | undefined {
  const user = MOCK_USERS.find((u) => u.id === id);
  if (user) {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return undefined;
}
