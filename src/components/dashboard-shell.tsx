"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  CheckSquare, 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserSession } from "@/lib/auth";

interface DashboardShellProps {
  children: React.ReactNode;
  session: UserSession;
}

export default function DashboardShell({ children, session }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Define sidebar links based on role
  const getNavLinks = () => {
    switch (session.role) {
      case "ADMINISTRATOR":
        return [
          { href: "/dashboard/admin", label: "Dashboard Overview", icon: LayoutDashboard },
          { href: "/dashboard/admin/requests", label: "Manage Requests", icon: FileText },
          { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
        ];
      case "MAINTENANCE_OFFICER":
        return [
          { href: "/dashboard/officer", label: "My Tasks Overview", icon: LayoutDashboard },
          { href: "/dashboard/officer/tasks", label: "Assigned Work", icon: CheckSquare },
        ];
      case "STUDENT_STAFF":
      default:
        return [
          { href: "/dashboard/requester", label: "My Overview", icon: LayoutDashboard },
          { href: "/dashboard/requester/submit", label: "Report a Fault", icon: PlusCircle },
          { href: "/dashboard/requester/requests", label: "Track Requests", icon: FileText },
        ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30">
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-1.5">
            <Wrench className="h-4 w-4 text-blue-900 dark:text-blue-400 shrink-0" />
            <span className="text-lg font-black tracking-wider text-blue-900 dark:text-blue-400">
              RIVA<span className="text-red-600 dark:text-red-500">RESOLVE</span>
            </span>
          </div>
          <span className="text-[9px] text-slate-405 dark:text-slate-500 font-medium">
            Built by Godspower Aghorunse
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Logo Header */}
          <div className="hidden md:flex flex-col items-start px-6 py-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-blue-900 dark:text-blue-400 shrink-0" />
              <span className="text-xl font-black tracking-wider text-blue-900 dark:text-blue-400">
                RIVA<span className="text-red-600 dark:text-red-500">RESOLVE</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
              Built by <span className="font-semibold text-slate-500 dark:text-slate-450">Godspower Aghorunse</span>
            </span>
          </div>

          {/* User Section */}
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-900 dark:text-blue-400 font-bold">
                {session.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {session.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize font-medium">
                  {session.role.replace("_", " ").toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-400"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Logout) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            variant="ghost"
            onClick={handleLogout}
            disabled={logoutLoading}
            className="w-full flex items-center justify-start px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/20"
          >
            <LogOut size={18} className="mr-3" />
            {logoutLoading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200 capitalize">
              {pathname.split("/").pop() === "dashboard" ? "Overview" : pathname.split("/").pop()?.replace("-", " ")}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell size={20} />
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="font-medium">{session.email}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-8 flex flex-col justify-between">
          <div className="flex-1">
            {children}
          </div>
          <footer className="mt-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-center text-xs text-slate-450 dark:text-slate-500">
            <p>© Copyright 2026 RIVA Open University. All Rights Reserved.</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-550 mt-1">
              Built by <span className="font-semibold text-slate-500 dark:text-slate-400">Godspower Aghorunse</span>
            </p>
          </footer>
        </main>
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm"
        ></div>
      )}
    </div>
  );
}
