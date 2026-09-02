"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineRefresh } from "react-icons/md";
import toast from "react-hot-toast";
import { decryptData, encryptData } from "@/app/libs/secretSecure";
import { useLogin, useRequestActivation } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

export default function AuthCustomer() {
  const [captcha, setCaptcha] = useState("");
  const [inputCaptcha, setInputCaptcha] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaStyles, setCaptchaStyles] = useState<
    { rotate: number; fontSize: number }[]
  >([]);
  const [isModal, setIsModal] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: loginMutation } = useLogin();
  const { mutateAsync: requestToken } = useRequestActivation();
  const { login } = useAuth();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const refreshString = () => {
    const upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const allCharacters = upperCaseLetters + numbers;
    const captchaLength = 6;
    let captcha = "";

    captcha +=
      upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];
    captcha += numbers[Math.floor(Math.random() * numbers.length)];

    for (let i = 2; i < captchaLength; i++) {
      captcha +=
        allCharacters[Math.floor(Math.random() * allCharacters.length)];
    }

    captcha = captcha
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");
    setCaptcha(captcha);

    // 🔥 Tambahkan ini untuk generate style acak
    const newStyles = Array.from({ length: captchaLength }).map(() => ({
      rotate: Math.random() * 20 - 10,
      fontSize: Math.random() * 0.4 + 1.2,
    }));
    setCaptchaStyles(newStyles);
  };

  useEffect(() => {
    setMounted(true);
    refreshString();
  }, []);

  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (captcha !== inputCaptcha) {
      toast.error("Captcha tidak sama.");
      setIsLoading(false);
      return;
    }

    try {
      const dataForm = {
        identifier: emailOrUsername,
        password,
        rememberMe: isChecked,
      };

      const data = encryptData(dataForm);
      const response = await loginMutation(data);

      const dataDecrypt = decryptData(response.data);

      if (dataDecrypt && dataDecrypt.status === "success") {
        toast.success("Login berhasil!");
        login(dataDecrypt?.token);
        setTimeout(() => {
          setIsLoading(false);
          router.push("/home");
          setInputCaptcha("");
        }, 500);
      } else {
        setIsLoading(false);
        toast.error(dataDecrypt?.message || "Login gagal.");
        router.push("/");
        refreshString();
        setInputCaptcha("");
      }
    } catch (err) {
      let message = "Login gagal.";
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.code === 401002) {
          message = err.response?.data?.message;
          setIsModal(true);
          setIsMessage(message);
        }
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
      router.push("/");
      setIsLoading(false);
      refreshString();
      setInputCaptcha("");
    } finally {
      refreshString();
      setIsLoading(false);
      router.push("/");
      setInputCaptcha("");
    }
  };

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const referralUrl = window.location.origin;
    const email = emailOrUsername.toString();

    setIsLoading(true);
    try {
      const response = await requestToken({ email, referralUrl });

      if (response?.status === "success") {
        toast.success(response.message);
      }
    } catch (err) {
      let message = "Token gagal dikirim.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
      setIsModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50 p-4">
        <div className="flex flex-col items-center rounded-lg bg-white p-6">
          <ClipLoader size={50} color="#3b82f6" />
          <h2 className="mb-4 text-lg font-semibold">Loading...</h2>
          <p className="mb-4">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-auto flex min-h-screen w-full items-center justify-center px-6 sm:container sm:w-full md:container md:w-[30%]">
      <div className="w-full">
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/images/company/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            SKY Membership
          </h1>
          <div className="mt-3 flex w-full flex-col items-start justify-start">
            <p className="text-sm font-semibold dark:text-gray-400">
              Selamat datang kembali!
            </p>
            <p className="text-sm text-slate-400 dark:text-gray-400">
              Login untuk melanjutkan.
            </p>
          </div>
        </div>

        <div className="my-3 w-full border-b border-slate-400"></div>

        <form className="mt-2 space-y-4" onSubmit={handleLogin}>
          <div className="space-y-2">
            <Label>Email atau Username</Label>
            <Input
              type="text"
              placeholder="you@example.com"
              defaultValue={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-theme-xs dark:focus:border-brand-800 h-11 w-full appearance-none rounded-lg border px-4 py-2.5 text-sm placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                required
              />
              <div
                className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div
                className="flex h-12 w-[70%] items-center justify-center rounded-md bg-gradient-to-r from-gray-700 via-gray-900 to-black px-4 py-2 text-lg font-bold tracking-wide text-white shadow-lg"
                style={{
                  letterSpacing: "0.2em",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  transform: "rotate(-1deg)",
                }}
              >
                {captcha && captchaStyles.length === captcha.length && (
                  <div className="...">
                    {captcha.split("").map((char, idx) => (
                      <span
                        key={idx}
                        style={{
                          transform: `rotate(${captchaStyles[idx].rotate}deg)`,
                          fontSize: `${captchaStyles[idx].fontSize}rem`,
                          color: idx % 2 === 0 ? "gold" : "white",
                          margin: "0 2px",
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={refreshString}
                className="flex items-center rounded-md border border-amber-500 px-3 py-2 text-blue-500 shadow-md transition-all duration-300 hover:bg-amber-500 hover:text-white"
              >
                <MdOutlineRefresh size={20} className="mr-1" />
              </button>
            </div>
            <Input
              type="text"
              placeholder="Masukkan captcha"
              defaultValue={inputCaptcha}
              onChange={(e) => setInputCaptcha(e.target.value)}
              className="mt-2 bg-slate-100"
            />
          </div>

          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <Checkbox checked={isChecked} onChange={setIsChecked} />
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                Ingat saya
              </span>
            </div>

            <Link
              href="/forgot-password"
              className="text-sm text-blue-600 underline"
            >
              Lupa password!
            </Link>
          </div>

          <Button type="submit" className="mt-4 w-full">
            Login
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>

      {isModal && (
        <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50 p-4">
          <div className="rounded-lg bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold">Informasi</h2>
            <p className="mb-4">{isMessage}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleRequestToken}
                className="rounded bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
              >
                Request Aktifasi
              </button>
              <button
                onClick={() => setIsModal(false)}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
