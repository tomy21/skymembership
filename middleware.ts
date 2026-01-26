// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("refreshToken")?.value;
  console.log("token:", token);
  // Jika tidak ada token, redirect ke login
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // Decode payload JWT (tanpa verifikasi signature, hanya client-side check)
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    console.log("DEBUG PAYLOAD:", payload);
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      console.warn("Token expired");
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // Hanya izinkan akses admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (payload.role !== "admin") {
        return NextResponse.redirect(new URL("/403", req.url)); // bisa buat page Forbidden
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Invalid token", err);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"], // middleware hanya jalan untuk route admin
};
