"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function SuccessRegistrationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex max-h-screen w-full flex-col md:h-screen lg:w-1/2">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        {/* Logo mobile */}
        <div className="block md:hidden">
          <Image
            src="/images/company/logo.png"
            width={500}
            height={500}
            alt="logo"
          />
        </div>

        <div className="text-center">
          <div className="mb-5 sm:mb-8">
            <h1 className="text-title-sm sm:text-title-md mb-2 font-semibold text-gray-800 dark:text-white/90">
              Registration Verified 🎉
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your account has been successfully verified. You can now log in
              and start using our services.
            </p>
          </div>

          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Button to Sign In */}
          <Link href="/signin">
            <button className="bg-brand-500 hover:bg-brand-600 focus:ring-brand-400 w-full rounded-lg px-4 py-2 text-sm font-medium text-white shadow-md focus:ring-2 focus:outline-none">
              Go to Sign In
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
