"use client";

import { decryptData, encryptData } from "@/app/libs/secretSecure";
import { useAuth } from "@/context/AuthContext";
import { useLogin, useRequestActivation } from "@/hooks/useAuth";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlineRefresh } from "react-icons/md";

function generateCaptcha(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function AuthCustomer() {
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isModal, setIsModal] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: loginMutation } = useLogin();
  const { mutateAsync: requestToken } = useRequestActivation();
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const refreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setInputCaptcha("");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    if (!emailOrUsername.trim() || !password) {
      toast.error("Email atau username dan password wajib diisi.");
      return;
    }

    if (!inputCaptcha || inputCaptcha !== captcha) {
      toast.error("Kode CAPTCHA tidak sesuai.");
      refreshCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      const dataForm = {
        identifier: emailOrUsername.trim(),
        password,
        rememberMe: isChecked,
      };

      const encryptedData = encryptData(dataForm);
      const response = await loginMutation(encryptedData);
      const decryptedData = decryptData(response.data);

      if (decryptedData?.status !== "success" || !decryptedData?.token) {
        toast.error(decryptedData?.message || "Login gagal.");
        refreshCaptcha();
        return;
      }

      login(decryptedData.token);
      toast.success("Login berhasil!");
      router.replace("/home");
    } catch (error: unknown) {
      let message = "Login gagal. Silakan coba kembali.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message;

        if (error.response?.data?.code === 401002) {
          setIsModal(true);
          setIsMessage(message);
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestToken = async () => {
    const email = emailOrUsername.trim();

    if (!email) {
      toast.error("Masukkan email terlebih dahulu.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestToken({
        email,
        referralUrl: window.location.origin,
      });

      if (response?.status === "success") {
        toast.success(response.message || "Token aktivasi berhasil dikirim.");
        setIsModal(false);
      } else {
        toast.error(response?.message || "Token aktivasi gagal dikirim.");
      }
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error
          ? error.message
          : "Token gagal dikirim.";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />

      <div className="relative grid w-full max-w-5xl lg:min-h-[650px] lg:grid-cols-2">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-slate-950 p-10 text-white lg:flex xl:p-12">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-2">
              <Image
                src="/images/company/logo.png"
                alt="SKY Membership logo"
                width={80}
                height={80}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">
                SKY Membership
              </h1>
              <p className="text-xs text-slate-400">Member portal</p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="mb-5 inline-flex rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1.5 text-xs font-medium tracking-wider text-blue-300">
              MEMBER ACCESS
            </div>
            <h2 className="max-w-md text-4xl leading-tight font-bold tracking-tight xl:text-5xl">
              Welcome back.
              <span className="mt-2 block text-blue-400">
                Your membership, connected.
              </span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
              Masuk ke akun SKY Membership untuk mengakses layanan dan informasi
              keanggotaan kamu dengan mudah.
            </p>

            <div className="mt-9 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect x="5" y="10" width="14" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Secure member access
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Akses akun dengan aman dan nyaman.
                </p>
              </div>
            </div>
          </div>

          <p className="relative text-xs text-slate-500">
            © {new Date().getFullYear()} SKY Membership
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-9 xl:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <div className="mb-5 flex justify-center lg:hidden">
                <Image
                  src="/images/company/logo.png"
                  alt="SKY Membership logo"
                  width={76}
                  height={76}
                  className="rounded-2xl object-contain"
                />
              </div>

              <p className="mb-2 text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">
                Member Portal
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Sign in
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Selamat datang kembali! Silakan login untuk melanjutkan.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="emailOrUsername"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email atau Username
                </label>
                <input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  autoComplete="username"
                  placeholder="Masukkan email atau username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  disabled={isLoading}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    required
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50"
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
                      <FaEyeSlash size={17} />
                    ) : (
                      <FaEye size={17} />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    disabled={isLoading}
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600 focus:ring-blue-500"
                  />
                  Ingat saya
                </label>

                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                >
                  Lupa password?
                </Link>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Verifikasi keamanan
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Masukkan 6 digit angka yang terlihat.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    disabled={isLoading}
                    aria-label="Refresh CAPTCHA"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-300 hover:text-blue-600 disabled:opacity-50"
                  >
                    <MdOutlineRefresh size={22} />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    aria-label={`Kode CAPTCHA ${captcha.split("").join(" ")}`}
                    className="flex h-12 min-w-0 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 font-mono text-2xl font-bold tracking-[0.3em] text-slate-800"
                  >
                    {captcha || "------"}
                  </div>
                  <input
                    id="captcha"
                    name="captcha"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    autoComplete="off"
                    placeholder="6 digit"
                    aria-label="Masukkan kode CAPTCHA"
                    value={inputCaptcha}
                    onChange={(e) =>
                      setInputCaptcha(
                        e.target.value.replace(/\D/g, "").slice(0, 6),
                      )
                    }
                    disabled={isLoading}
                    required
                    className="h-12 w-28 rounded-xl border border-slate-200 bg-white px-2 text-center font-mono text-sm font-semibold tracking-wider text-slate-900 transition outline-none placeholder:font-sans placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !captcha}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Memproses login...
                  </>
                ) : (
                  "Login ke akun"
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">ATAU</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Belum punya akun?{" "}
              <Link
                href="/register"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Daftar sekarang
              </Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-slate-400">
              © {new Date().getFullYear()} SKY Membership. All rights reserved.
            </p>
          </div>
        </section>
      </div>

      {isModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="activation-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4m0 4h.01" />
              </svg>
            </div>

            <h2
              id="activation-title"
              className="text-xl font-bold text-slate-900"
            >
              Aktivasi akun diperlukan
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isMessage ||
                "Akun kamu memerlukan aktivasi sebelum dapat login."}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Kamu dapat meminta token aktivasi dikirim ke email yang terdaftar.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setIsModal(false)}
                disabled={isLoading}
                className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleRequestToken}
                disabled={isLoading}
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "Mengirim..." : "Minta token aktivasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
