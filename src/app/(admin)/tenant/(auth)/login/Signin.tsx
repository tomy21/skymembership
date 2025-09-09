"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Loading from "@/components/Loading/Loading";
// import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLoginTenant } from "@/hooks/useAuth";
import { useAuth } from "@/context/AuthContext";
import { decryptData, encryptData } from "@/app/libs/secretSecure";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [identify, setIdentify] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const { mutateAsync: loginMutation } = useLoginTenant();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  const submitLogin = async () => {
    try {
      setIsLoading(true);

      const dataForm = {
        identifier: identify,
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
          router.push("/tenant/dashboard");
        }, 500);
      }
    } catch (error) {
      console.log(error);
      toast.error("Login gagal!");
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
            alt="signin"
          />
        </div>
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={submitLogin}>
              <div className="space-y-6">
                <div>
                  <label>
                    Email or Username <span className="text-error-500">*</span>
                  </label>
                  <Input
                    placeholder="info@gmail.com or username"
                    type="text"
                    onChange={(e) => setIdentify(e.target.value)}
                  />
                </div>
                <div>
                  <label>
                    Password <span className="text-error-500">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-4 z-30 -translate-y-1/2 cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="text-theme-sm block font-normal text-gray-700 dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400 text-sm"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
