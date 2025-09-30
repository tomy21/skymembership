"use client";

import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Fragment } from "react";

interface ModalDetailPointProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  userData?: {
    fullname: string;
    email: string;
    phone_number: string;
  };
  data?: {
    Date: string;
    Description: string;
    Debet: string;
    Kredit: string;
    TotalPoint: string;
  }[];
}

export default function ModalDetailPoint({
  open,
  loading,
  onClose,
  userData,
  data,
}: ModalDetailPointProps) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-999" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-3xl transform rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Detail Transaksi Point
              </Dialog.Title>

              {/* User Info */}
              {userData && (
                <div className="mt-4 mb-6 space-y-2 rounded-lg bg-gray-50 p-4 text-sm text-gray-700 shadow-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Nama:</span>
                    <span>{userData?.fullname ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Email:</span>
                    <span>{userData?.email ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">No HP:</span>
                    <span>{userData?.phone_number ?? "-"}</span>
                  </div>
                </div>
              )}

              {/* Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="overflow-x-auto"
              >
                <table className="min-w-full border text-left text-sm text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Description</th>
                      <th className="px-4 py-2">Debet</th>
                      <th className="px-4 py-2">Kredit</th>
                      <th className="px-4 py-2">Total Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      // 🔹 Loading row
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                        >
                          Loading data...
                        </td>
                      </tr>
                    ) : data && data.length > 0 ? (
                      // 🔹 Data rows
                      data.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b transition hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                          <td className="px-4 py-2">{item.Date}</td>
                          <td className="px-4 py-2">{item.Description}</td>
                          <td className="px-4 py-2 text-green-500">
                            {Number(item.Kredit ?? 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-2 text-red-500">
                            {Number(item.Debet ?? 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-2 font-medium">
                            {Number(item.TotalPoint ?? 0).toLocaleString(
                              "id-ID",
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      // 🔹 Data not found
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-gray-500 dark:text-gray-400"
                        >
                          Data not found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </motion.div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
