import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "rivaresolve_mit8333_super_secret_session_key_2026"
);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;

  // 1. If trying to access login/register while authenticated, redirect to dashboard
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const role = payload.role as string;
        
        if (role === "ADMINISTRATOR") {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        } else if (role === "MAINTENANCE_OFFICER") {
          return NextResponse.redirect(new URL("/dashboard/officer", request.url));
        } else {
          return NextResponse.redirect(new URL("/dashboard/requester", request.url));
        }
      } catch {
        // Token invalid, let them view login/register
      }
    }
    return NextResponse.next();
  }

  // 2. If trying to access dashboard paths
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // Save original URL to redirect back after login
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      const role = payload.role as string;

      // Handle root dashboard path /dashboard
      if (pathname === "/dashboard") {
        if (role === "ADMINISTRATOR") {
          return NextResponse.redirect(new URL("/dashboard/admin", request.url));
        } else if (role === "MAINTENANCE_OFFICER") {
          return NextResponse.redirect(new URL("/dashboard/officer", request.url));
        } else {
          return NextResponse.redirect(new URL("/dashboard/requester", request.url));
        }
      }

      // Check role permissions for subroutes
      if (pathname.startsWith("/dashboard/admin") && role !== "ADMINISTRATOR") {
        return handleUnauthorizedRedirect(role, request);
      }

      if (pathname.startsWith("/dashboard/officer") && role !== "MAINTENANCE_OFFICER") {
        return handleUnauthorizedRedirect(role, request);
      }

      if (pathname.startsWith("/dashboard/requester") && role !== "STUDENT_STAFF") {
        return handleUnauthorizedRedirect(role, request);
      }

      return NextResponse.next();
    } catch {
      // Invalid/Expired Token - clear cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  return NextResponse.next();
}

/**
 * Redirect unauthorized users to their correct home dashboard
 */
function handleUnauthorizedRedirect(role: string, request: NextRequest) {
  if (role === "ADMINISTRATOR") {
    return NextResponse.redirect(new URL("/dashboard/admin", request.url));
  } else if (role === "MAINTENANCE_OFFICER") {
    return NextResponse.redirect(new URL("/dashboard/officer", request.url));
  } else {
    return NextResponse.redirect(new URL("/dashboard/requester", request.url));
  }
}

// Config to specify matching paths
export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*"],
};
