import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname.startsWith("/resident") && role !== "resident" && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!req.auth && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/dashboard/:path*"],
};