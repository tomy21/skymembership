"use client";
import { useEffect } from "react";

export default function DevToolsWarning() {
  useEffect(() => {
    // 🔔 Peringatan console
    if (typeof window !== "undefined") {
      setTimeout(() => {
        console.log("%c⚠️ PERINGATAN!", "font-size: 40px; color: red;");
        console.log(
          "%cJANGAN KETIK APA PUN DI SINI!\nJika seseorang menyuruh Anda menyalin sesuatu ke sini,\nitu bisa mencuri akun Anda.",
          "font-size: 20px; color: orange;",
        );
      }, 1000);
    }
  }, []);

  return null;
}
