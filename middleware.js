import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  try {
    // Clone the request URL for path checking
    const url = req.nextUrl.clone();
    const { pathname } = url;

    console.log("Requested Path:", pathname);

    // Public paths that everyone can access
    const publicPaths = ["/auth/login", "/auth/signup", "/", "/explore", "/api/auth/signup"];
    
    // Exclude static assets (like .ico, .css, .js, etc.)
    const staticPaths = ['/favicon.ico', '/_next/', '/static/'];

    // If the path is public or it's a static asset, allow the request
    if (publicPaths.includes(pathname) || staticPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    // Get the token from the request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    console.log("Token:", token);

    // If the user is authenticated, check role-based access
    if (token) {
      const { role } = token;

      console.log("User role:", role);

      // Role-based access: checking the role stored in the token
      if (role) {
        // Allow only admins to access /admin path
        if (pathname.startsWith("/admin") && role !== "admin") {
          console.log("Redirecting to unauthorized, not an admin");
          return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Allow only mentors to access /mentor path
        if (pathname.startsWith("/mentor") && role !== "mentor") {
          console.log("Redirecting to unauthorized, not a mentor");
          return NextResponse.redirect(new URL("/unauthorized", req.url)); 
        }

        // Allow only users to access /user path
        if (pathname.startsWith("/user") && role !== "user") {
          console.log("Redirecting to unauthorized, not a user");
          return NextResponse.redirect(new URL("/unauthorized", req.url)); // Redirect if not user
        }

        console.log("Role correct, allowing request");
        // If the role is correct, allow the request to continue
        return NextResponse.next();
      } else {
        // If the token is missing the role, treat it as unauthorized
        console.log("Token does not have a role, redirecting to unauthorized");
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // If not authenticated, redirect to login page
    console.log("No token found, redirecting to login");
    return NextResponse.redirect(new URL("/auth/login", req.url));

  } catch (error) {
    // Log any errors and redirect
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}



