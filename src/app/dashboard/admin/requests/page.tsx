"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wrench,
  UserCheck,
  Calendar,
  AlertTriangle,
  Download
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
  requester: {
    name: string;
    email: string;
  };
  assignments: Array<{
    officer: {
      id: string;
      name: string;
    };
  }>;
}

interface Officer {
  id: string;
  name: string;
  email: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [assignedOfficerId, setAssignedOfficerId] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [reqResponse, offResponse] = await Promise.all([
        fetch("/api/admin/requests"),
        fetch("/api/admin/officers"),
      ]);

      if (!reqResponse.ok || !offResponse.ok) {
        throw new Error("Failed to load administration data");
      }

      const reqData = await reqResponse.json();
      const offData = await offResponse.json();

      setRequests(reqData);
      setOfficers(offData);
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest || !assignedOfficerId) return;

    setAssignLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          officerId: assignedOfficerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to assign ticket");
      }

      // Close modal and refresh list
      setSelectedRequest(null);
      setAssignedOfficerId("");
      await fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to assign ticket");
    } finally {
      setAssignLoading(false);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.title.toLowerCase().includes(search.toLowerCase()) || 
      req.description.toLowerCase().includes(search.toLowerCase()) ||
      req.requester.name.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter ? req.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Request["status"]) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-55 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400">
            <CheckCircle2 size={12} />
            Resolved
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400">
            <Wrench size={12} />
            In Progress
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400">
            <Clock size={12} />
            Assigned
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
            <AlertCircle size={12} />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Manage Service Requests
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Monitor all reported complaints, assign tasks to technicians, and keep tabs on resolving states.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardContent className="py-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by title, description or requester..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-slate-200 dark:border-slate-750"
            />
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-750 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-750 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <a href="/api/admin/export" download="rivaresolve_complaints.csv" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full border-slate-200 dark:border-slate-750 text-slate-700 dark:text-slate-350 flex items-center justify-center gap-1.5 h-10 font-semibold cursor-pointer">
              <Download size={16} />
              Export CSV
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Requests table listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Clock className="animate-spin mb-2" size={32} />
          <p className="text-sm">Fetching service records...</p>
        </div>
      ) : error && !selectedRequest ? (
        <div className="p-4 rounded-md bg-red-50 text-sm text-red-600 border border-red-150 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
          {error}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardContent className="flex flex-col items-center justify-center py-16 text-slate-450 dark:text-slate-500">
            <FileText size={48} className="text-slate-300 dark:text-slate-755 mb-3" />
            <p className="font-semibold text-slate-700 dark:text-slate-350">No complaints logged</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-850/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-850">
                  <th className="py-4 px-6">Ticket</th>
                  <th className="py-4 px-6">Requester</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Assigned To</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/40 text-sm text-slate-700 dark:text-slate-300">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/10 transition-colors">
                    <td className="py-4 px-6 max-w-xs md:max-w-sm">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-semibold border border-slate-200/30">
                            {req.category.name}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate max-w-[80px]">
                            {req.id.substring(0, 8)}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-850 dark:text-slate-200 truncate">
                          {req.title}
                        </h4>
                        <p className="text-xs text-slate-450 dark:text-slate-500 line-clamp-1">
                          {req.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{req.requester.name}</p>
                        <p className="text-xs text-slate-450 dark:text-slate-500">{req.requester.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">{getStatusBadge(req.status)}</td>
                    <td className="py-4 px-6 font-medium">
                      {req.assignments.length > 0 ? (
                        <span className="text-slate-700 dark:text-slate-300">
                          {req.assignments[0].officer.name}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link href={`/dashboard/requester/requests/${req.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-200 dark:border-slate-800 h-8 text-xs">
                          Details
                        </Button>
                      </Link>
                      {(req.status === "PENDING" || req.status === "ASSIGNED") && (
                        <Button
                          size="sm"
                          onClick={() => setSelectedRequest(req)}
                          className="bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 h-8 text-xs font-semibold"
                        >
                          <UserCheck size={14} className="mr-1" />
                          Assign
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assignment Modal dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-slate-200 dark:border-slate-850 shadow-xl z-55 animate-in fade-in-50 zoom-in-95 duration-150">
            <CardHeader className="border-b border-slate-100 dark:border-slate-850 pb-4">
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
                Assign Maintenance Officer
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleAssign}>
              <CardContent className="pt-5 space-y-4">
                {error && (
                  <div className="flex items-start gap-2 rounded-md bg-red-50 p-2.5 text-xs text-red-600 border border-red-100 dark:bg-red-950/30 dark:text-red-400">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">
                    Complaint Title
                  </p>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {selectedRequest.title}
                  </p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="officerSelect" className="text-sm font-semibold text-slate-700 dark:text-slate-350">
                    Choose Officer
                  </label>
                  {officers.length === 0 ? (
                    <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                      No maintenance officers seeded. Make sure to seed database or register an officer user.
                    </p>
                  ) : (
                    <select
                      id="officerSelect"
                      value={assignedOfficerId}
                      onChange={(e) => setAssignedOfficerId(e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-750 dark:bg-slate-900 dark:text-slate-250"
                    >
                      <option value="" className="text-slate-400 dark:bg-slate-900">
                        -- Select Officer --
                      </option>
                      {officers.map((off) => (
                        <option key={off.id} value={off.id} className="dark:bg-slate-900">
                          {off.name} ({off.email})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </CardContent>
              <div className="flex items-center justify-end space-x-3 p-4 border-t border-slate-100 dark:border-slate-850 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedRequest(null)}
                  disabled={assignLoading}
                  className="border-slate-200 text-slate-700 dark:border-slate-800 dark:text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={assignLoading || officers.length === 0}
                  className="bg-blue-900 hover:bg-blue-805 text-white dark:bg-blue-600 dark:hover:bg-blue-500 font-semibold"
                >
                  {assignLoading ? "Assigning..." : "Assign Task"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
