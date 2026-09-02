import React from "react";

interface ModalConfirmProps {
  show: boolean;
  date: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
  show,
  date,
  onCancel,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50">
      <div className="w-[400px] rounded-lg bg-white p-6 text-center shadow-lg dark:bg-gray-800">
        <h2 className="mb-6 text-lg font-semibold text-gray-800 dark:text-gray-200">
          Konfirmasi Reconsile
        </h2>

        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Apakah Anda yakin ingin melakukan reconsile untuk tanggal{" "}
          <span className="font-bold">{date}</span>?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-200"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Ya, Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirm;
