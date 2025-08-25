import React, { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface UploadTxtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

const UploadTxtModal: React.FC<UploadTxtModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  // validasi file
  const validateFile = (file: File | null): string => {
    if (!file) return "File tidak ditemukan.";
    if (file.type !== "text/plain")
      return "Hanya file .txt yang diperbolehkan.";
    if (file.size > 2 * 1024 * 1024) return "Ukuran maksimal 2MB.";
    return "";
  };

  // handle pilih file manual
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
    } else {
      setError("");
      setFile(selectedFile);
    }
  };

  // handle drag n drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    const validationError = validateFile(droppedFile);
    if (validationError) {
      setError(validationError);
      setFile(null);
    } else {
      setError("");
      setFile(droppedFile);
    }
  }, []);

  const handleUpload = () => {
    if (!file) {
      setError("Silakan pilih file .txt terlebih dahulu.");
      return;
    }
    onUpload(file); // kirim ke parent
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="bg-opacity-50 fixed inset-0 z-9999 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="fixed inset-0 z-9999 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Upload File Mutasi Bank (.txt)
              </h2>

              {/* Drag & Drop Area */}
              <div
                className="hover:border-brand-500 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {file ? (
                  <p className="text-sm text-gray-700">
                    📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Drag & Drop file .txt di sini atau klik tombol pilih file
                  </p>
                )}
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="hidden"
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className="bg-brand-500 hover:bg-brand-600 mt-3 inline-block cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white"
                >
                  Pilih File
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <p className="mt-2 text-center text-sm text-red-500">{error}</p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-6">
                <button
                  onClick={handleUpload}
                  className="bg-brand-500 hover:bg-brand-600 rounded-md px-4 py-2 text-sm font-medium text-white"
                >
                  Upload
                </button>
                <button
                  onClick={onClose}
                  className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UploadTxtModal;
