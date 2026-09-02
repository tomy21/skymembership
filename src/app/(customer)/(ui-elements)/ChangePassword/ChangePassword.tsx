"use client";
import { useChangePassword } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import axios from "axios";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutateAsync: changePassword } = useChangePassword();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await changePassword({
        password: newPassword,
        confirmPassword: confirmPassword,
        token: token!,
      });

      if (response?.status === "success") {
        setSuccess(true);
      }
    } catch (err) {
      let message = "change password gagal.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-tr from-gray-600 via-yellow-500 to-gray-700 p-4">
      {success && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-semibold text-blue-600">
              Password Berhasil Diubah
            </h2>
            <p className="mb-6 text-center text-gray-500">
              Password berhasil diubah, silahkan login kembali.
            </p>
            <button
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              onClick={() => router.push("/")}
            >
              Login
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-semibold text-blue-600">
              Password Gagal Diubah
            </h2>
            <p className="mb-6 text-center text-gray-500">{error}</p>
            <button
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              onClick={() => router.push("/forgot-password")}
            >
              Request kembali
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-semibold text-blue-600">
          Ubah Password
        </h2>

        {/* {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>} */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={newPassword ?? ""}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setPasswordStrength(getPasswordStrength(e.target.value));
              }}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
            {newPassword && (
              <div className="mt-2 h-2 rounded bg-gray-300">
                <div
                  className={`h-2 rounded transition-all duration-300 ${
                    passwordStrength <= 2
                      ? "w-1/3 bg-red-500"
                      : passwordStrength === 3
                        ? "w-2/3 bg-yellow-500"
                        : "w-full bg-green-500"
                  }`}
                ></div>
              </div>
            )}
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              value={confirmPassword ?? "-"}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Ubah Password"}
          </button>
        </form>

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
