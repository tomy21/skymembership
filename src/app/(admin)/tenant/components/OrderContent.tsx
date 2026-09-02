"use client";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function OrderModal({ onClose: onClose }: any) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Slide-in Modal */}
        <motion.div
          className="relative h-full w-full max-w-md bg-white p-6 shadow-xl"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <button
              onClick={onClose}
              className="text-xl text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          {/* Isi konten modal di sini */}
          <div className="space-y-4">
            <p className="text-gray-700">
              Ini konten order. Tambahkan detail pesanan atau form di sini.
            </p>
            <button
              onClick={onClose}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Selesai
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
