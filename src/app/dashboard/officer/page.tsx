import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, AlertCircle, Calendar, ClipboardList } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function OfficerDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  // Fetch officer statistics and recent tasks in parallel
  const [totalAssigned, pendingCount, inProgressCount, resolvedCount, recentTasks] = await Promise.all([
    prisma.serviceRequest.count({
      where: {
        assignments: {
          some: {
            officerId: session.userId,
          },
        },
      },
    }),
    prisma.serviceRequest.count({
      where: {
        status: "ASSIGNED",
        assignments: {
          some: {
            officerId: session.userId,
          },
        },
      },
    }),
    prisma.serviceRequest.count({
      where: {
        status: "IN_PROGRESS",
        assignments: {
          some: {
            officerId: session.userId,
          },
        },
      },
    }),
    prisma.serviceRequest.count({
      where: {
        status: "RESOLVED",
        assignments: {
          some: {
            officerId: session.userId,
          },
        },
      },
    }),
    prisma.serviceRequest.findMany({
      where: {
        assignments: {
          some: {
            officerId: session.userId,
          },
        },
      },
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
        updatedAt: "desc",
      },
      take: 5,
    }),
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-705 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400">
            Resolved
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 dark:bg-indigo-950/20 dark:border-indigo-900/40 dark:text-indigo-400">
            In Progress
          </span>
        );
      case "ASSIGNED":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400">
            Assigned
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Technician Workspace
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your assigned tasks and update maintenance resolution progress.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Assigned Tasks
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-900 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {totalAssigned}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Total assigned to you</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Actions
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {pendingCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Awaiting status update</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              In Progress
            </CardTitle>
            <Calendar className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {inProgressCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Active repairs</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/60 dark:border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Completed Tasks
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {resolvedCount}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Resolved tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Tasks Area */}
      <Card className="border-slate-200/60 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
            Recent Task Assignments
          </CardTitle>
          {recentTasks.length > 0 && (
            <Link href="/dashboard/officer/tasks" className="text-xs text-blue-900 hover:underline dark:text-blue-400 font-semibold">
              View all tasks
            </Link>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          {recentTasks.length === 0 ? (
            <div className="h-[250px] flex items-center justify-center text-sm text-slate-450 dark:text-slate-500">
              You don't have any assigned tasks currently.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-900/30">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/30 text-sm text-slate-700 dark:text-slate-300">
                  {recentTasks.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-250 max-w-xs truncate">
                        {task.title}
                      </td>
                      <td className="py-3.5 px-4">{task.category.name}</td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs">
                          <p className="font-medium text-slate-700 dark:text-slate-300">{task.requester.name}</p>
                          <p className="text-slate-400 dark:text-slate-500">{task.requester.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(task.status)}</td>
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/dashboard/requester/requests/${task.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs border-slate-200 dark:border-slate-800">
                            Inspect Details
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
