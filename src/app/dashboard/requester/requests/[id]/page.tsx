"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Wrench, 
  CheckCircle,
  FileImage,
  Calendar,
  AlertCircle
} from "lucide-react";

interface StatusLog {
  id: string;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  comment: string | null;
  createdAt: string;
  updater: {
    name: string;
    role: {
      name: string;
    };
  };
}

interface RequestDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  status: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  category: {
    name: string;
  };
  assignments: Array<{
    assignedAt: string;
    officer: {
      name: string;
      email: string;
    };
  }>;
  statusLogs: StatusLog[];
}

export default function RequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [request, setRequest] = useState<RequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`/api/requests/${id}`);
        if (!response.ok) {
          if (response.status === 403) {
            throw new Error("You do not have permission to view this ticket");
          }
          throw new Error("Failed to load ticket details");
        }
        const data = await response.json();
        setRequest(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load request details";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Clock className="animate-spin mb-2" size={32} />
        <p className="text-sm font-medium">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-500">
          <ArrowLeft size={16} className="mr-2" />
          Back to List
        </Button>
        <div className="flex items-start gap-3 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-150 dark:bg-red-950/20 dark:border-red-900/40 dark:text-red-400">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Error Loading Details</p>
            <p className="mt-1">{error || "Ticket not found."}</p>
          </div>
        </div>
      </div>
    );
  }

  // Define steps for visual timeline stepper
  const steps = [
    { label: "Submitted", status: "PENDING", icon: Clock, desc: "Awaiting review" },
    { label: "Assigned", status: "ASSIGNED", icon: User, desc: "Officer allocated" },
    { label: "In Progress", status: "IN_PROGRESS", icon: Wrench, desc: "Repair started" },
    { label: "Resolved", status: "RESOLVED", icon: CheckCircle, desc: "Work complete" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "RESOLVED": return 3;
      case "IN_PROGRESS": return 2;
      case "ASSIGNED": return 1;
      case "PENDING":
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(request.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          <ArrowLeft size={16} className="mr-2" />
          Back to Requests
        </Button>
        <span className="text-xs text-slate-400 font-mono">ID: {request.id}</span>
      </div>

      {/* Visual Timeline Stepper */}
      <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 relative">
            {/* Background line for timeline (Desktop only) */}
            <div className="hidden md:block absolute top-[18px] left-[10%] right-[10%] h-0.5 bg-slate-100 dark:bg-slate-800 -z-10"></div>
            {/* Active progress line (Desktop only) */}
            <div 
              className="hidden md:block absolute top-[18px] left-[10%] h-0.5 bg-blue-900 dark:bg-blue-600 -z-10 transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStepIndex / 3) * 80}%` }}
            ></div>

            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              const isResolved = request.status === "RESOLVED";

              return (
                <div key={step.label} className="flex md:flex-col items-center md:text-center w-full md:w-1/4 gap-4 md:gap-2 z-10">
                  {/* Stepper Node Circle */}
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                      isActive
                        ? isResolved 
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-blue-900 border-blue-900 text-white dark:bg-blue-600 dark:border-blue-600"
                        : isCompleted
                          ? "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/50 dark:text-blue-400"
                          : "bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800"
                    }`}
                  >
                    <StepIcon size={16} />
                  </div>
                  {/* Labels */}
                  <div className="text-left md:text-center min-w-0">
                    <p className={`text-sm font-semibold ${
                      isActive 
                        ? isResolved 
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-blue-900 dark:text-blue-400" 
                        : "text-slate-600 dark:text-slate-400"
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {isActive ? step.desc : isCompleted ? "Completed" : "Scheduled"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details & Evidence */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Ticket Metadata & Description */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-850 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold dark:bg-slate-800 dark:text-slate-400 border border-slate-200/30">
                  {request.category.name}
                </span>
                <div className="flex items-center text-xs text-slate-400 gap-1.5 font-medium">
                  <Calendar size={14} />
                  {new Date(request.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-slate-800 dark:text-slate-100 pt-2">
                {request.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Detailed Description
                </h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>

              {/* Show assigned officer details */}
              {request.assignments.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                    Assigned Technician
                  </h4>
                  <div className="flex items-center space-x-3 bg-slate-50/50 p-3 rounded-md border border-slate-200/40 dark:bg-slate-900/30 dark:border-slate-850">
                    <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-900 dark:text-blue-400 font-bold shrink-0">
                      <User size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-850 dark:text-slate-200">
                        {request.assignments[0].officer.name}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                        {request.assignments[0].officer.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Log Stepper Timeline */}
          <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm">
            <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-850">
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
                Activity & History Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l border-slate-100 dark:border-slate-850 ml-3 pl-6 space-y-6">
                {request.statusLogs.map((log) => (
                  <div key={log.id} className="relative">
                    {/* Stepper Dot node */}
                    <div className="absolute left-[-30px] top-1.5 h-3 w-3 rounded-full border bg-white border-blue-900 dark:bg-slate-950 dark:border-blue-600"></div>

                    <div className="space-y-1 text-sm">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-250">
                          {log.status === "PENDING" ? "Complaint Logged" : `Status updated to ${log.status}`}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(log.createdAt).toLocaleString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Updated by {log.updater.name} ({log.updater.role.name.replace("_", " ").toLowerCase()})
                      </p>
                      {log.comment && (
                        <p className="mt-1.5 text-slate-600 dark:text-slate-350 p-2.5 rounded bg-slate-50/50 border border-slate-200/20 dark:bg-slate-900/40 italic">
                          &ldquo;{log.comment}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Photo Evidence */}
        <div className="md:col-span-1">
          <Card className="border-slate-200/60 dark:border-slate-800 shadow-sm h-full flex flex-col">
            <CardHeader className="py-4 border-b border-slate-100 dark:border-slate-850">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Photo Evidence
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 flex-1 flex flex-col justify-center">
              {request.imageUrl ? (
                <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={request.imageUrl}
                    alt="Fault evidence"
                    className="w-full h-auto object-cover max-h-[350px]"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-600 flex-1 border-2 border-dashed border-slate-100 dark:border-slate-850 rounded-lg">
                  <FileImage size={40} className="text-slate-300 dark:text-slate-800 mb-2 shrink-0" />
                  <p className="text-sm font-semibold">No Image Uploaded</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-[150px]">
                    No photo attachment was provided with this complaint.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
