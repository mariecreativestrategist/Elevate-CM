import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

const ADMIN_PUBLIC = ["/admin/login"];
const PORTAL_PUBLIC = ["/portal/login", "/portal/login/forgot", "/portal/login/reset"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isPortalRoute = pathname.startsWith("/portal");
  if (!isAdminRoute && !isPortalRoute) return NextResponse.next();

  const isAdminPublic = ADMIN_PUBLIC.some((p) => pathname.startsWith(p));
  const isPortalPublic = PORTAL_PUBLIC.some((p) => pathname.startsWith(p));
  if (isAdminPublic || isPortalPublic) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  if (isAdminRoute) {
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (isPortalRoute) {
    if (!session || session.role !== "client") {
      return NextResponse.redirect(new URL("/portal/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/:path*"],
};
