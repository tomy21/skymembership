/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Live validation
  useEffect(() => {
    validateForm();
  }, [oldPassword, newPassword, confirmPassword]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (newPassword.length > 0 && newPassword.length < 8) {
      newErrors.push("New password must be at least 8 characters.");
    }
    if (oldPassword && newPassword && oldPassword === newPassword) {
      newErrors.push("New password cannot be the same as old password.");
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      newErrors.push("Confirm password does not match.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true); // start loading

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/change-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to change password");
        return;
      }

      toast.success("Password updated successfully");

      // Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors([]);

      onClose();
    } catch (err) {
      console.error("Error change password:", err);
      toast.error("Something went wrong, try again later.");
    } finally {
      setLoading(false); // stop loading
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
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800"
          >
            <h2 className="mb-4 text-lg font-semibold dark:text-white">
              Change Password
            </h2>

            <div className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Error messages */}
            {errors.length > 0 && (
              <div className="mt-3 space-y-1 text-sm text-red-500">
                {errors.map((err, idx) => (
                  <p key={idx}>{err}</p>
                ))}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed dark:bg-gray-600 dark:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={errors.length > 0 || loading}
                className={`flex items-center justify-center rounded-lg px-4 py-2 text-white ${
                  errors.length > 0 || loading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
