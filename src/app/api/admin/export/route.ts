import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMINISTRATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.serviceRequest.findMany({
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
    });

    // Helper to escape values for CSV to prevent injection issues or column breaks
    const escapeCSV = (val: string) => {
      const escaped = val.replace(/"/g, '""');
      return `"${escaped}"`;
    };

    // Header row
    const headers = [
      "Ticket ID",
      "Title",
      "Description",
      "Category",
      "Status",
      "Requester Name",
      "Requester Email",
      "Created At",
    ];

    const rows = [headers.join(",")];

    for (const req of requests) {
      const row = [
        escapeCSV(req.id),
        escapeCSV(req.title),
        escapeCSV(req.description),
        escapeCSV(req.category.name),
        escapeCSV(req.status),
        escapeCSV(req.requester.name),
        escapeCSV(req.requester.email),
        escapeCSV(req.createdAt.toISOString()),
      ];
      rows.push(row.join(","));
    }

    const csvContent = rows.join("\r\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=rivaresolve_complaints.csv",
      },
    });
  } catch (error) {
    console.error("Failed to export complaints:", error);
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    );
  }
}
