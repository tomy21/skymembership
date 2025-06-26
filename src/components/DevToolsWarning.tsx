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

    // 🕵️ Deteksi DevTools
    let open = false;
    const threshold = 160;

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
      if (widthThreshold || heightThreshold) {
        if (!open) {
          open = true;
          alert("🚫 DevTools terdeteksi! Akses dibatasi.");
          // window.location.href = "/403"; // jika ingin redirect
        }
      } else {
        open = false;
      }
    };

    const interval = setInterval(checkDevTools, 1000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
