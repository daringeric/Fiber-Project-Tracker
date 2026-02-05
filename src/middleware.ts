import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow the request to continue
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Login page is always accessible
        if (path === "/admin/login") {
          return true;
        }

        // All other /admin routes require authentication
        if (path.startsWith("/admin")) {
          return !!token;
        }

        // Non-admin routes (like /track) are public
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
