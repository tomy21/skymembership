"use client";

import { useChangePassword } from "@/hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const getPasswordStrength = (password: string) => {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const strengthLabel =
    passwordStrength <= 2 ? "Lemah" : passwordStrength <= 3 ? "Sedang" : "Kuat";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError(
        "Token reset password tidak ditemukan. Silakan minta link reset password yang baru.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      setError("Password harus memiliki huruf besar dan huruf kecil.");
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError("Password harus memiliki minimal satu angka.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      const response = await changePassword({
        password: newPassword,
        confirmPassword,
        token,
      });

      if (response?.status === "success") {
        setSuccess(true);
      } else {
        setError(
          response?.message || "Password gagal diubah. Silakan coba kembali.",
        );
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Permintaan gagal diproses."
        : err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengubah password.";

      setError(message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />

      <section className="relative w-full max-w-md">
        <div className="mb-9 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <Image
              src="/images/company/logo.png"
              alt="SKY Membership"
              width={80}
              height={80}
              className="h-full w-full object-contain"
              priority
            />
          </div>

          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
            SKY Membership
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {success ? "Password Berhasil Diubah" : "Buat Password Baru"}
          </h1>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
            {success
              ? "Password akun kamu sudah diperbarui. Silakan login kembali menggunakan password baru."
              : "Buat password baru yang kuat untuk menjaga keamanan akun SKY Membership kamu."}
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <FaCheckCircle size={30} />
            </div>

            <button
              type="button"
              onClick={() => router.replace("/")}
              className="h-12 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
            >
              Login Sekarang
            </button>
          </div>
        ) : (
          <>
            {!token && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800"
              >
                Token reset tidak ditemukan. Silakan minta link reset password
                yang baru.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password Baru
                </label>

                <div className="relative">
                  <FaLock
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                    size={15}
                    aria-hidden="true"
                  />

                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Masukkan password baru"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    disabled={isPending}
                    required
                    minLength={8}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-12 pl-11 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={16} />
                    ) : (
                      <FaEye size={16} />
                    )}
                  </button>
                </div>

                {newPassword && (
                  <div className="mt-3">
                    <div
                      className="flex h-1.5 gap-1"
                      aria-label={`Kekuatan password: ${strengthLabel}`}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`flex-1 rounded-full transition-colors ${
                            level <= passwordStrength
                              ? passwordStrength <= 2
                                ? "bg-red-500"
                                : passwordStrength <= 3
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Kekuatan password:{" "}
                      <span
                        className={`font-semibold ${
                          passwordStrength <= 2
                            ? "text-red-600"
                            : passwordStrength <= 3
                              ? "text-amber-600"
                              : "text-emerald-600"
                        }`}
                      >
                        {strengthLabel}
                      </span>
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Gunakan minimal 8 karakter, huruf besar, huruf kecil, dan
                      angka.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Konfirmasi Password
                </label>

                <div className="relative">
                  <FaLock
                    className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400"
                    size={15}
                    aria-hidden="true"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Masukkan ulang password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    disabled={isPending}
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pr-12 pl-11 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi password"
                        : "Tampilkan konfirmasi password"
                    }
                    aria-pressed={showConfirmPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash size={16} />
                    ) : (
                      <FaEye size={16} />
                    )}
                  </button>
                </div>

                {confirmPassword && (
                  <p
                    className={`mt-2 text-xs ${
                      newPassword === confirmPassword
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {newPassword === confirmPassword
                      ? "Konfirmasi password cocok."
                      : "Konfirmasi password belum cocok."}
                  </p>
                )}
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !token}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses password...
                  </>
                ) : (
                  "Simpan Password Baru"
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => router.replace("/")}
            className="text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            Kembali ke Login
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} SKY Membership. All rights reserved.
        </p>
      </section>
    </main>
  );
}

export default function ChangePassword() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
        </main>
      }
    >
      <ChangePasswordForm />
    </Suspense>
  );
}
