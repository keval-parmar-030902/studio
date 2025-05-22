"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, UserCircle } from "lucide-react";
import Link from "next/link";
import { ThemeToggleButton } from "./ThemeToggleButton"; // Import the theme toggle button

export default function Header() {
  const { user, logout, loading } = useAuth();

  const displayName = user?.firstName && user?.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user?.email;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6"> {/* Added px-6 for consistency */}
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          DayScribe
        </Link>
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2 text-sm">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              <span className="hidden sm:inline">{displayName}</span>
            </div>
          )}
          <ThemeToggleButton /> {/* Add theme toggle button here */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout} 
            disabled={loading} 
            aria-label="Logout"
            className="text-muted-foreground hover:text-accent-foreground" // Adjusted hover for better visibility
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
