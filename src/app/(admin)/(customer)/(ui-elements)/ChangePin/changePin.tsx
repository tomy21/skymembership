"use client";
import { useChangePin, useForgotPin } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

export default function ChangePin() {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isModalLupaPin, setIsModalLupaPin] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { mutateAsync: changePin } = useChangePin();
  const forgotPin = useForgotPin();

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

    if (newPin.length < 6) {
      setError("Password baru minimal 6 karakter.");
      return;
    }

    if (newPin !== confirmPin) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);

    try {
      const response = await changePin({
        pin: newPin,
        confirmPin: confirmPin,
        token: token!,
      });
      console.log(response);
      if (response?.status === "success") {
        setSuccess(true);
      } else {
        setError(response.response.data.message);
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

  const modalLupaPin = () => {
    setError("");
    setIsModalLupaPin(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const referralUrl = window.location.origin;
    setLoading(true);
    // Simulasi request
    try {
      forgotPin.mutate(
        { email, referralUrl },
        {
          onSuccess: () => {
            setSubmitted(true);
            setLoading(false);
          },
        },
      );
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const modalLupaPinClose = () => {
    setIsModalLupaPin(false);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-tr from-gray-600 via-yellow-500 to-gray-700 p-4">
      {success && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-semibold text-blue-600">
              PIN Berhasil Diubah
            </h2>
            <p className="mb-6 text-center text-gray-500">
              PIN berhasil diubah.
            </p>
            <button
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              onClick={() => router.push("/home")}
            >
              Kembali
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-semibold text-blue-600">
              PIN Gagal Diubah
            </h2>
            <p className="mb-6 text-center text-gray-500">{error}</p>
            <button
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
              onClick={modalLupaPin}
            >
              Request kembali
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-center text-2xl font-semibold text-blue-600">
          Ubah PIN
        </h2>

        {/* {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>} */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type={showPin ? "text" : "password"}
              placeholder="PIN Baru"
              value={newPin ?? ""}
              onChange={(e) => {
                setNewPin(e.target.value);
              }}
              minLength={1}
              maxLength={6}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
              onClick={() => setShowPin(!showPin)}
            >
              {showPin ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type={showConfirmPin ? "text" : "password"}
              placeholder="Konfirmasi PIN"
              value={confirmPin ?? "-"}
              onChange={(e) => setConfirmPin(e.target.value)}
              minLength={1}
              maxLength={6}
              className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <div
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
              onClick={() => setShowConfirmPin(!showConfirmPin)}
            >
              {showConfirmPin ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition duration-200 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Ubah PIN"}
          </button>
        </form>

        <button
          type="button"
          className="mt-3 w-full rounded-lg bg-red-600 py-2 font-medium text-white transition duration-200 hover:bg-red-700"
          onClick={() => router.push("/home")}
        >
          Kembali
        </button>
      </div>

      <AnimatePresence>
        {isModalLupaPin && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50"
              onClick={modalLupaPinClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="z-50 rounded-2xl bg-white p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h2 className="mb-4 text-lg font-semibold">Lupa pin ...</h2>
              {submitted ? (
                <div className="p-5 text-center font-medium text-green-600">
                  Link reset telah dikirim ke{" "}
                  <span className="font-semibold">{email}</span>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-5">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
