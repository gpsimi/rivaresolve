import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiDavinciresolve } from "react-icons/si";
import { 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  ClipboardList,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Navigation Header */}
      <header className="px-6 lg:px-12 py-5 bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
        <Link href="/" className="flex flex-col items-start">
          <div className="flex items-center space-x-2">
            <SiDavinciresolve className="h-5 w-5 text-blue-900 dark:text-blue-450 shrink-0" />
            <span className="text-xl font-black tracking-wider text-blue-900 dark:text-blue-450">
              RIVA<span className="text-red-600 dark:text-red-500">RESOLVE</span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Built by <span className="font-semibold text-slate-500 dark:text-slate-400">Godspower Aghorunse</span>
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-650 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow">
              Register
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-16 md:py-24 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <span className="px-3 py-1 text-xs font-semibold tracking-widest bg-blue-50 text-blue-900 border border-blue-150 rounded-full dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400">
            RIVA UNIVERSITY RESOLVE
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 max-w-3xl mx-auto leading-tight">
            Report, Track & Fix <br />
            <span className="text-blue-900 dark:text-blue-450">Campus Issues Easily</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            RivaResolve is the university&apos;s digital portal for reporting faulty utilities, damaged furniture, and tracking repairs in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow-md font-semibold text-base py-6 px-8">
                Access Portal
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-750 dark:text-slate-300 dark:hover:bg-slate-900 py-6 px-8 font-semibold text-base">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3 pt-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-xl shadow-sm space-y-3">
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/40 rounded-lg flex items-center justify-center text-blue-900 dark:text-blue-400">
              <ClipboardList size={22} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Quick Reporting</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Students and staff can quickly describe faults, choose category tags, and upload image evidence.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-xl shadow-sm space-y-3">
            <div className="h-10 w-10 bg-amber-50 dark:bg-amber-950/20 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Clock size={22} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Real-Time Tracking</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Monitor your tickets as they move from pending to assigned, work started, and fully resolved.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 p-6 rounded-xl shadow-sm space-y-3">
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-450">
              <ShieldCheck size={22} />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Role Protection</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Role-protected workflows ensure proper separation between students, technicians, and administrators.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 text-center text-xs text-slate-450 dark:text-slate-500 space-y-2">
        <p>© Copyright 2026 RIVA Open University. All Rights Reserved.</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-550">
          Built by <span className="font-semibold text-slate-500 dark:text-slate-400">Godspower Aghorunse</span>
        </p>
      </footer>
    </div>
  );
}
