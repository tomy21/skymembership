"use server"

import { cookies } from "next/headers";

export async function loginMemberAction(encryptedPayload: string, rememberMe: boolean) {
    try {
        console.log("request", encryptedPayload);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: encryptedPayload }),
        });

        console.log("response", response);
        // 1. Tangani jika response bukan 2xx (misal 401 atau 500)
        if (!response.ok) {
            const errorResult = await response.json().catch(() => ({}));
            return {
                success: false,
                message: errorResult.message || "Gagal menghubungi server"
            };
        }

        const result = await response.json();
        console.log("result", result);
        // 2. Jika API mengembalikan success: false (Username/Pass salah)
        if (result.success !== true) {
            return {
                success: false,
                message: result.message || "Login gagal"
            };
        }

        // Proses Cookie jika berhasil
        if (result.token) {
            const cookieStore = await cookies();
            cookieStore.set("refreshToken", result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production", // Secure hanya di prod
                sameSite: "lax", // Lebih aman untuk dashboard redirect
                path: "/",
                maxAge: rememberMe ? 7 * 24 * 60 * 60 : undefined
            });

            return {
                success: true,
                message: "Login berhasil!"
            };
        }

        return { success: false, message: "Token tidak ditemukan" };

    } catch (error) {
        console.error("Action Error:", error);
        return {
            success: false,
            message: "Terjadi kesalahan koneksi ke server"
        };
    }
}