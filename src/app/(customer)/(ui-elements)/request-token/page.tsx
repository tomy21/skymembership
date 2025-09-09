"use client";

import axios from "axios";
import React, { useState } from "react";
import Loading from "@/components/Loading/Loading";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useRequestActivation } from "@/hooks/useAuth";

export default function Page() {
  const [email, setEmail] = useState("");
  const { mutateAsync: requestToken } = useRequestActivation();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleRequestToken = async (e: React.FormEvent) => {
    e.preventDefault();
    const referralUrl = window.location.origin;

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
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50 p-4">
      <div className="flex w-1/4 flex-col items-center justify-center rounded-lg bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Token Expired</h2>
        <p className="mb-4">Request Token </p>
        <div className="flex w-full flex-col items-center justify-center space-y-4">
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-3"
          />

          <div className="flex w-full items-center justify-between space-x-3">
            <button
              onClick={handleRequestToken}
              className="w-full rounded bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
            >
              Request Aktifasi
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
