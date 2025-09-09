// components/ui/Modal.tsx

import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import TableReconPerDate from "../table/tableReconPerdays";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  title?: string;
  bankName?: string;
}

export default function ModalDetailTrx({
  isOpen,
  onClose,
  date,
  title,
  bankName,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 z-99 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="fixed inset-0 z-999 flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="relative min-h-10/12 w-full max-w-10/12 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              {title && (
                <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
                  {title} - {format(new Date(date), "dd MMMM yyyy")}
                </h3>
              )}
              <TableReconPerDate
                date={date}
                bank={bankName || ""}
                onClose={onClose}
              />
              <button
                className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-600 dark:text-white"
                onClick={onClose}
              >
                &times;
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
