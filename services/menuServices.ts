// services/menuService.ts
"use client";

import Cookies from "js-cookie";

export async function getMenusByRole(roleId: string) {
  const token = Cookies.get("refreshToken");
  if (!token) throw new Error("Token tidak ditemukan");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/menus?roleId=${roleId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Gagal mengambil menu dari API");

  return res.json();
}
