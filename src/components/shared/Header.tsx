"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, UserCircle } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, logout, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          DayScribe
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 text-sm">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <span className="hidden sm:inline">{user.email}</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={logout} disabled={loading} aria-label="Logout">
            <LogOut className="h-5 w-5 text-accent" />
          </Button>
        </div>
      </div>
    </header>
  );
}
