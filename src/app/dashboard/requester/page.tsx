import React from "react";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Info, Clock, CheckCircle2, ShieldAlert } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function RequesterDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch counts from database in parallel
  const [submittedCount, inProgressCount, resolvedCount, recentRequests] = await Promise.all([
    prisma.serviceRequest.count({
      where: {
        requesterId: session.userId,
        status: { in: ["PENDING", "ASSIGNED"] },
      },
    }),
    prisma.serviceRequest.count({
      where: {
        requesterId: session.userId,
        status: "IN_PROGRESS",
      },
    }),
    prisma.serviceRequest.count({
      where: {
        requesterId: session.userId,
        status: "RESOLVED",
      },
    }),
    prisma.serviceRequest.findMany({
      where: {
        requesterId: session.userId,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-450">
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
            Student & Staff Portal
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Submit new maintenance complaints and track their status in real-time.
          </p>
        </div>
        <Link href="/dashboard/requester/submit">
          <Button className="bg-blue-900 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-500 shadow cursor-pointer">
            <PlusCircle className="mr-2 h-4 w-4" />
            Report a Fault
          </Button>
        </Link>
      </div>

      {/* Info Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Submitted Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {submittedCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Pending approval or assignment</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              In Progress
            </CardTitle>
            <Info className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {inProgressCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Technicians working on site</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Resolved Repairs
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {resolvedCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Verified resolved issues</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Track Grid Area */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
            Your Reported Issues
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {recentRequests.length === 0 ? (
            <div className="h-[250px] flex flex-col items-center justify-center text-slate-450 dark:text-slate-500 space-y-2">
              <ShieldAlert size={40} className="text-slate-350 dark:text-slate-800" />
              <p className="text-sm">You have not submitted any complaints yet.</p>
              <Link href="/dashboard/requester/submit" className="text-xs text-blue-900 hover:underline dark:text-blue-400 font-semibold">
                Click here to submit your first report
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/30 text-sm text-slate-700 dark:text-slate-300">
                  {recentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {req.title}
                      </td>
                      <td className="py-3.5 px-4">{req.category.name}</td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {new Date(req.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(req.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/dashboard/requester/requests/${req.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 dark:border-slate-800">
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
