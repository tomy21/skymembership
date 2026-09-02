"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
      >
        <FiCheckCircle size={150} className="mx-auto mb-4 text-green-500" />
        <h1 className="mb-2 text-3xl font-semibold text-gray-800">
          Registrasi Berhasil!
        </h1>
        <p className="mb-6 text-gray-600">
          Terima kasih telah mendaftar. Silakan login untuk mulai menggunakan
          layanan kami.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-green-500 px-6 py-2 font-medium text-white transition duration-300 hover:bg-green-600"
        >
          Kembali ke Login
        </Link>
      </motion.div>
    </div>
  );
}
