import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("refreshToken")?.value;

  // 1. Cek keberadaan token
  if (!token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    // 2. Decode Payload (Gunakan Buffer.from atau atob)
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );

    // 3. Cek Expiry
    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }

    // 4. Logika Multiple Role
    if (req.nextUrl.pathname.startsWith("/admin")) {
      // Opsi A: Menggunakan minimal ID (Contoh: Role 1 dan 2 boleh masuk)
      // Jika role adalah null/undefined, atau role < 1, maka blokir.
      const allowedRoles = [1, 2, 3]; // Daftar ID role yang diizinkan

      if (!payload.role || !allowedRoles.includes(Number(payload.role))) {
        console.warn(`Access Denied for role ID: ${payload.role}`);
        return NextResponse.redirect(new URL("/403", req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware Error:", err);
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};