/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { encryptData, decryptData } from "@/app/libs/secretSecure";
import Input from "@/components/form/input/InputField";
import Loading from "@/components/Loading/Loading";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { useForgotPasswordCMS } from "@/hooks/useAuth"; // bikin hook mirip useLoginCMS

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // const router = useRouter();
  // const { mutateAsync: forgotMutation } = useForgotPasswordCMS();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email) {
        toast.error("Email wajib diisi!");
        return;
      }
      setIsLoading(true);

      const referralUrl = window.location.origin;

      const payload = { email, referralUrl };

      const response = await fetch("/api/send-reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data?.status === "success") {
        toast.success("Link reset password sudah dikirim ke email!");
        setTimeout(() => {
          setIsLoading(false);
          // router.push("/signin");
        }, 1200);
      } else {
        toast.error(data?.message || "Gagal mengirim link reset.");
        setIsLoading(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan server");
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="flex max-h-screen w-full flex-col md:h-screen lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="block md:hidden">
          <Image
            src="/images/company/logo.png"
            width={500}
            height={500}
            alt="logo"
          />
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email address and we’ll send you a link to reset your
              password.
            </p>
          </div>
          <form onSubmit={submitForgot}>
            <div className="space-y-6">
              <div className="dark:text-gray-400">
                <label>
                  Email <span className="text-error-500">*</span>
                </label>
                <Input
                  placeholder="you@example.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Button type="submit" className="w-full" size="sm">
                  Send Reset Link
                </Button>
              </div>

              <div className="text-center text-sm">
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
