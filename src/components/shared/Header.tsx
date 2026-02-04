"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  variant?: "customer" | "admin";
  className?: string;
}

export function Header({ variant = "customer", className }: HeaderProps) {
  const isAdmin = variant === "admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href={isAdmin ? "/admin/dashboard" : "/"} className="flex items-center">
          <Logo theme="light" />
        </Link>

        <nav className="flex items-center gap-4">
          {isAdmin ? (
            <>
              <Link
                href="/admin/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-navy-700 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/projects"
                className="text-sm font-medium text-gray-600 hover:text-navy-700 transition-colors"
              >
                Projects
              </Link>
              <Button variant="outline" size="sm">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-navy-700 transition-colors"
              >
                Track Project
              </Link>
              <Link
                href="/support"
                className="text-sm font-medium text-gray-600 hover:text-navy-700 transition-colors"
              >
                Support
              </Link>
              <Button asChild variant="outline" size="sm">
                <Link href="/admin">Admin Login</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
