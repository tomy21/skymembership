"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout-cms`, {
        method: "GET",
        credentials: "include",
      });

      // kalau pakai localStorage
      localStorage.removeItem("token");

      // kasih delay biar modal sempat tampil
      setTimeout(() => {
        router.push("/signin");
      }, 1200);
    } catch (error) {
      console.error("Logout gagal:", error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
          >
            <h2 className="mb-4 text-lg font-semibold dark:text-white">
              {loading
                ? "Signing out..."
                : "Are you sure you want to sign out?"}
            </h2>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                {/* spinner */}
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Sign out
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
