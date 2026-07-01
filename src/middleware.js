// s/_middleware.js
import { NextResponse } from "next/server";
import { verifyToken } from "../src/utils/jwt";
import { cookies } from "next/headers";

// Define role-based permissions
const rolePermissions = {
  admin: ["/dashboard"], // Admin can access these routes
  instructor: ["/dashboard"], // Admin can access these routes
  user: ["/dashboard/user-profile"], // User-specific routes
  // Add more roles and permissions as needed
};

export async function middleware(req) {
  var token = "";
  const cookieStore =await cookies();

  const agent = req.headers.get("agent_name");
  if (req.nextUrl.pathname.startsWith("/api") && agent !== "web") {
    token = req.headers.get("authorization")?.split(" ")[1];
  } else {
    // want to put the token from the cookie
    token = cookieStore.get("access-token")?.value;
  }


  if (!token) {
    if (req.nextUrl.pathname.startsWith("/api")) {
      return new NextResponse(
        JSON.stringify({ message: "No token provided" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  const decoded = await verifyToken(token);

  if (!decoded) {
    return new NextResponse(
      JSON.stringify({ status: 401, message: "Invalid token" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const userRole = decoded.role; // Ensure your token contains a `role` field
  const requestedPath = req.nextUrl.pathname;

  // Check if the role has permission to access the requested path
  const allowedPaths = rolePermissions[userRole] || [];
  const isAllowed = allowedPaths.some((path) => requestedPath.startsWith(path));

  if (!isAllowed) {
    return new NextResponse(
      JSON.stringify({ status: 403, message: "Access denied" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // If the token is valid, continue to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/category/add-new", "/dashboard/:path*"],
};
