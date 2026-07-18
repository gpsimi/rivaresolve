import React from "react";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch counts, recent requests, and officers parallelly
  const [totalComplaints, pendingCount, resolvedCount, recentRequests, officersList] = await Promise.all([
    prisma.serviceRequest.count(),
    prisma.serviceRequest.count({
      where: { status: "PENDING" },
    }),
    prisma.serviceRequest.count({
      where: { status: "RESOLVED" },
    }),
    prisma.serviceRequest.findMany({
      include: {
        category: true,
        requester: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
    prisma.user.findMany({
      where: {
        role: {
          name: "MAINTENANCE_OFFICER",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        assignments: {
          where: {
            request: {
              status: {
                in: ["ASSIGNED", "IN_PROGRESS"],
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  const activeOfficersCount = officersList.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400">
            Resolved
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400">
            In Progress
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400">
            Assigned
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-400">
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
            Admin Dashboard
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Welcome to the RivaResolve operations control center.
          </p>
        </div>
        <Link href="/dashboard/admin/requests">
          <Button className="bg-blue-900 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow cursor-pointer">
            Manage Service Tickets
          </Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Complaints
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalComplaints}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Submitted requests</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Assignment
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {pendingCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Requires action</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Officers
            </CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {activeOfficersCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">On-duty technicians</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Resolved Issues
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {resolvedCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Closed tickets</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Complaints Table */}
        <Card className="col-span-4 border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              Recent Complaints
            </CardTitle>
            {recentRequests.length > 0 && (
              <Link href="/dashboard/admin/requests" className="text-xs text-blue-900 hover:underline dark:text-blue-400 font-semibold flex items-center">
                All Requests <ArrowRight size={12} className="ml-1" />
              </Link>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            {recentRequests.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-sm text-slate-450 dark:text-slate-500">
                No complaints logged yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                      <th className="py-2.5 px-3">Title</th>
                      <th className="py-2.5 px-3">Requester</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850/30 text-xs text-slate-700 dark:text-slate-300">
                    {recentRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-250 truncate max-w-[150px]">
                          {req.title}
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold">{req.requester.name}</p>
                          <p className="text-[10px] text-slate-450 truncate max-w-[120px]">{req.requester.email}</p>
                        </td>
                        <td className="py-3 px-3">{getStatusBadge(req.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Maintenance Officers Sidebar list */}
        <Card className="col-span-3 border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
              Maintenance Officers
            </CardTitle>
            {activeOfficersCount > 0 && (
              <Link href="/dashboard/admin/users" className="text-xs text-blue-900 hover:underline dark:text-blue-400 font-semibold">
                Directory
              </Link>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            {officersList.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-sm text-slate-450 dark:text-slate-500">
                No active officers registered.
              </div>
            ) : (
              <div className="space-y-4">
                {officersList.map((off) => (
                  <div key={off.id} className="flex items-center justify-between border-b border-slate-50 dark:border-slate-850/30 pb-3 last:border-b-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {off.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {off.email}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-350 border border-slate-200/30">
                      {off.assignments.length} active tasks
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
