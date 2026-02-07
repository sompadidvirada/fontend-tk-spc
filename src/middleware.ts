// middleware.ts
import { decrypt } from "@/app/(lib)/session";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/staffoffice/:path*", "/staffbaristar/:path*"],
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const cookie = request.cookies.get("session")?.value;
  const session = await decrypt(cookie);

 if (!session) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("session"); // Cleaner way to clear
    return response;
  }

  const userRole = session.role as string;
  const allowedOfficeRoles = ["STAFF_SPC", "STAFF_TK", "STAFF_WH", "ADMIN"];

  if (path.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    path.startsWith("/staffoffice") &&
    !allowedOfficeRoles.includes(userRole)
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (
    path.startsWith("/staffbaristar") &&
    userRole !== "BARISTAR" &&
    userRole !== "ADMIN" &&
    userRole !== "STAFF_SPC"
  ) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}
