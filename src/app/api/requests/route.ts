import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

/**
 * GET: Fetch all requests submitted by the logged-in user (Student/Staff)
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await prisma.serviceRequest.findMany({
      where: {
        requesterId: session.userId,
      },
      include: {
        category: true,
        assignments: {
          include: {
            officer: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Failed to fetch user requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

/**
 * POST: Submit a new maintenance complaint with optional image upload
 */
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const categoryId = formData.get("categoryId") as string;
    const file = formData.get("image") as File | null;

    // 1. Validation
    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    // 2. Handle image upload if present
    let imageUrl: string | null = null;
    if (file && file.size > 0) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert the image to a Base64 string
        // We do this because Vercel has a read-only filesystem and cannot write to public/uploads
        const base64Data = buffer.toString("base64");
        const mimeType = file.type || "image/jpeg";
        imageUrl = `data:${mimeType};base64,${base64Data}`;
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image evidence" },
          { status: 500 }
        );
      }
    }

    // 3. Create request and write log inside a database transaction
    const newRequest = await prisma.$transaction(async (tx) => {
      // Create request record
      const req = await tx.serviceRequest.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          categoryId,
          requesterId: session.userId,
          imageUrl,
          status: "PENDING",
        },
        include: {
          category: true,
        },
      });

      // Write initial submission audit log
      await tx.statusLog.create({
        data: {
          requestId: req.id,
          status: "PENDING",
          updaterId: session.userId,
          comment: "Complaint submitted successfully.",
        },
      });

      return req;
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Failed to submit service request:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
