"use client";

import { useForgotPassword } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaEnvelope } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const forgotPassword = useForgotPassword();
  const loading = forgotPassword.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || loading) return;

    forgotPassword.mutate(
      {
        email: normalizedEmail,
        referralUrl: window.location.origin,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
      },
    );
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-10 flex flex-col items-center text-center">
          <Link
            href="/"
            aria-label="Kembali ke halaman login"
            className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
          >
            <Image
              src="/images/company/logo.png"
              alt="SKY Membership"
              width={80}
              height={80}
              className="h-full w-full object-contain"
              priority
            />
          </Link>

          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
            SKY Membership
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {submitted ? "Periksa Email Kamu" : "Lupa Password?"}
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            {submitted
              ? "Jika email terdaftar dan permintaan berhasil diproses, instruksi reset password akan dikirim ke alamat email tersebut."
              : "Jangan khawatir. Masukkan email yang terhubung dengan akun kamu untuk memulai proses reset password."}
          </p>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <FaCheckCircle size={30} />
            </div>

            <p className="text-sm leading-6 text-slate-600">
              Permintaan reset password telah diproses untuk:
            </p>

            <p className="mt-2 font-semibold break-all text-slate-900">
              {email.trim()}
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-500">
              Periksa inbox dan folder spam. Jika email tidak diterima, pastikan
              alamat email kamu benar atau coba kembali beberapa saat lagi.
            </p>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                forgotPassword.reset();
              }}
              className="mt-7 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              Coba email lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Alamat Email
              </label>

              <div className="relative">
                <FaEnvelope
                  className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                  size={16}
                  aria-hidden="true"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-11 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                />
              </div>
            </div>

            {forgotPassword.isError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
              >
                {forgotPassword.error instanceof Error
                  ? forgotPassword.error.message
                  : "Permintaan reset password gagal. Silakan coba kembali."}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Mengirim permintaan...
                </>
              ) : (
                "Kirim Link Reset Password"
              )}
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <FaArrowLeft size={13} />
            Kembali ke Login
          </button>
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} SKY Membership. All rights reserved.
        </p>
      </div>
    </main>
  );
}
