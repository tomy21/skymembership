'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
      >
        <FiCheckCircle size={150} className=" text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Registrasi Berhasil!</h1>
        <p className="text-gray-600 mb-6">
          Terima kasih telah mendaftar. Silakan login untuk mulai menggunakan layanan kami.
        </p>
        <Link
          href="/"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-xl transition duration-300"
        >
          Kembali ke Login
        </Link>
      </motion.div>
    </div>
  );
}
