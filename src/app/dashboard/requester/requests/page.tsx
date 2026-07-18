"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search,  
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wrench,
  ArrowRight
} from "lucide-react";

interface Request {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  category: {
    name: string;
  };
}

export default function TrackRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests");
        if (!response.ok) {
          throw new Error("Failed to load your requests");
        }
        const data = await response.json();
        setRequests(data);
      } catch (err: any) {
        setError(err.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests based on search term and status
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.title.toLowerCase().includes(search.toLowerCase()) || 
      req.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter ? req.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Request["status"]) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400">
            <CheckCircle2 size={12} />
            Resolved
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400">
            <Wrench size={12} />
            In Progress
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400">
            <Clock size={12} />
            Assigned
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400">
            <AlertCircle size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Track Your Requests
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Filter, search, and track the live status of all issues you have reported.
          </p>
        </div>
        <Link href="/dashboard/requester/submit">
          <Button className="bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow">
            Report a New Fault
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardContent className="py-4 flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-slate-200 dark:border-slate-750"
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-750 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Lists */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Clock className="animate-spin mb-2" size={32} />
          <p className="text-sm">Fetching your logs...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-md bg-red-50 text-sm text-red-600 border border-red-150 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
          {error}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
            <FileText size={48} className="text-slate-300 dark:text-slate-750 mb-3" />
            <p className="font-medium text-slate-700 dark:text-slate-300">No requests found</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 text-center max-w-sm mt-1">
              {search || statusFilter 
                ? "Try adjusting your search terms or status filters." 
                : "Get started by logging your first maintenance report."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredRequests.map((req) => (
            <Card key={req.id} className="border-slate-200/60 hover:border-slate-350 dark:border-slate-800 dark:hover:border-slate-750 transition-colors shadow-sm">
              <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold dark:bg-slate-800 dark:text-slate-400 border border-slate-200/30">
                      {req.category.name}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base truncate">
                    {req.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                    {req.description}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                    Reported on {new Date(req.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex justify-end shrink-0">
                  <Link href={`/dashboard/requester/requests/${req.id}`}>
                    <Button variant="outline" className="border-slate-200 dark:border-slate-850 hover:bg-blue-50 hover:text-blue-900 dark:hover:bg-blue-950/20 dark:hover:text-blue-400">
                      View Progress
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
