"use client";
import { useForgotPassword } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const forgotPassword = useForgotPassword();
  const loading = forgotPassword.isPending;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const referralUrl = window.location.origin;

    forgotPassword.mutate(
      { email, referralUrl },
      {
        onSuccess: () => {
          setSubmitted(true);
        },
        onError: (error) => {
          console.error(error);
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-600 via-yellow-500 to-gray-700 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-center text-2xl font-semibold text-blue-600">
          Lupa Password?
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Masukkan email untuk menerima link reset password.
        </p>

        {forgotPassword.isError && (
          <p className="mt-2 text-red-500">
            {forgotPassword.error?.message ?? "Terjadi kesalahan"}
          </p>
        )}

        {submitted ? (
          <div className="text-center font-medium text-green-600">
            Link reset telah dikirim ke{" "}
            <span className="font-semibold">{email}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#fff" />
              ) : (
                "Kirim Link Reset"
              )}
            </button>
          </form>
        )}

        <button
          type="button"
          className="mt-3 w-full rounded-lg bg-red-600 py-2 font-medium text-white transition duration-200 hover:bg-red-700"
          onClick={() => router.push("/")}
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
