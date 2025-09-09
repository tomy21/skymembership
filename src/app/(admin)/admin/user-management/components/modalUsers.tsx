"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface UserData {
  id?: number;
  fullname: string;
  email: string;
  username: string;
  phone_number: string;
  role: number;
  referralUrl?: string;
}

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initialData?: Partial<UserData> | null;
}

interface RoleOption {
  id: number;
  name: string;
}

export default function RegisterModal({
  isOpen,
  onClose,
  mode = "create",
  initialData = null,
}: RegisterModalProps) {
  const [formData, setFormData] = useState<UserData>({
    fullname: "",
    email: "",
    username: "",
    phone_number: "",
    role: 0,
    referralUrl:
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_API_URL_USERS,
  });
  const [roleOption, setRoleOption] = useState<RoleOption[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setFormData({
      fullname: "",
      email: "",
      username: "",
      phone_number: "",
      role: 1,
      referralUrl:
        typeof window !== "undefined"
          ? window.location.origin
          : process.env.NEXT_PUBLIC_API_URL_USERS,
    });
    onClose();
  };

  // isi form ketika mode edit
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }

    fetchRole();
  }, [mode, initialData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name as keyof UserData]: name === "role" ? Number(value) : value, // pastikan role jadi number
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "/api/user-management/users";
      let method: "POST" | "PUT" = "POST";

      if (mode === "edit" && initialData?.id) {
        url = `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/user/${initialData.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response:", data);

      if (res.ok) {
        toast.success(data.message || "Request success");
        onClose();
      } else {
        alert(data.message || "Request failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchRole = async () => {
    try {
      const res = await fetch("/api/user-management/role");
      const data = await res.json();
      setRoleOption(data.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-999 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-9999 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-semibold">
                {mode === "edit" ? "Edit User" : "Register CMS"}
              </h2>

              <div className="mb-4 h-0.5 w-full bg-gray-600"></div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  name="fullname"
                  placeholder="Full Name"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  disabled={mode === "edit"} // biasanya username tidak boleh diganti
                />
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roleOption.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
                  >
                    {loading
                      ? mode === "edit"
                        ? "Updating..."
                        : "Registering..."
                      : mode === "edit"
                        ? "Update"
                        : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
