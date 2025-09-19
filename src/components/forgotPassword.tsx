/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
// import { encryptData, decryptData } from "@/app/libs/secretSecure";
import Input from "@/components/form/input/InputField";
import Loading from "@/components/Loading/Loading";
import Button from "@/components/ui/button/Button";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast"; // bikin hook mirip useLoginCMS

export default function ForgotPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const searchParams = useSearchParams();

  const router = useRouter();
  // const { mutateAsync: forgotMutation } = useForgotPasswordCMS();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      // kalau token tidak ada di params, redirect ke signin
      toast.error("Please check your link.");
      router.replace("/signin");
      return;
    }
    setMounted(true);
  }, [router, searchParams]);

  if (!mounted) return null;

  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!password) {
        toast.error("Password cannot be empty. ");
        return;
      }
      if (password !== confirmationPassword) {
        toast.error("Password confirmation does not match.");
        return;
      }

      setIsLoading(true);
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan server");
      setIsLoading(false);
    }
  };
  if (!mounted) return null;
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
              Change Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please input your new password here.
            </p>
          </div>
          <form onSubmit={submitForgot}>
            <div className="space-y-6">
              <div className="dark:text-gray-400">
                <label>
                  Password <span className="text-error-500">*</span>
                </label>
                <Input
                  placeholder="**************"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="dark:text-gray-400">
                <label>
                  Confirmation Password{" "}
                  <span className="text-error-500">*</span>
                </label>
                <Input
                  placeholder="**************"
                  type="password"
                  onChange={(e) => setConfirmationPassword(e.target.value)}
                />
              </div>

              <div>
                <Button type="submit" className="w-full" size="sm">
                  Change Password
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
