"use client";

import { useAddVehicle } from "@/hooks/useVehicle";
import { Dialog, Transition } from "@headlessui/react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

type FormData = {
  vehicle_type: string;
  plate_prefix?: string;
  plate_number: string;
  plate_suffix?: string;
  plate_number_image: File | null;
  stnk_image: File | null;
};

const initialFormData: FormData = {
  vehicle_type: "",
  plate_prefix: "",
  plate_number: "",
  plate_suffix: "",
  plate_number_image: null,
  stnk_image: null,
};

export default function VehicleAdd() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: createVehicle } = useAddVehicle();
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    let formattedValue = value.toUpperCase();

    if (name === "plate_prefix") {
      formattedValue = formattedValue.replace(/[^A-Z]/g, "").slice(0, 2);
    } else if (name === "plate_number") {
      formattedValue = formattedValue.replace(/[^0-9]/g, "").slice(0, 4);
    } else if (name === "plate_suffix") {
      formattedValue = formattedValue.replace(/[^A-Z]/g, "").slice(0, 3);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (files?.[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    const fullPlate = `${formData.plate_prefix}${formData.plate_number}${formData.plate_suffix}`;

    const submitData = {
      ...formData,
      plate_number: fullPlate.trim(),
    };

    delete submitData.plate_prefix;
    delete submitData.plate_suffix;

    try {
      await createVehicle(submitData);

      toast.success("Berhasil menambahkan kendaraan.");

      setIsOpen(false);
      resetForm();

      await queryClient.invalidateQueries({
        queryKey: ["vehicleData"],
        exact: false,
      });

      await queryClient.invalidateQueries({
        queryKey: ["vehicleDataActive"],
        exact: false,
      });
    } catch (err) {
      let message = "Gagal menambahkan kendaraan.";

      if (err && typeof err === "object" && "response" in err) {
        const res = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        message = res.response?.data?.message ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (isLoading) return;

    setIsOpen(false);
    resetForm();
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-slate-900 shadow-lg shadow-slate-900/15 transition hover:bg-yellow-300 hover:shadow-xl active:scale-95"
        aria-label="Tambah kendaraan"
      >
        <FaPlus size={20} />
      </button>

      {/* Loading */}
      {isLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/30 px-4 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl">
            <ClipLoader size={22} color="#facc15" />

            <span className="text-sm font-medium text-slate-700">
              Menambahkan kendaraan...
            </span>
          </div>
        </div>
      )}

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[55]" onClose={handleClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
                enterTo="translate-y-0 opacity-100 sm:scale-100"
                leave="ease-in duration-150"
                leaveFrom="translate-y-0 opacity-100 sm:scale-100"
                leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                >
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                      <Dialog.Title className="text-base font-bold text-slate-800">
                        Tambah Kendaraan
                      </Dialog.Title>

                      <p className="mt-0.5 text-xs text-slate-400">
                        Tambahkan kendaraan ke membership kamu
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Tutup"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5 p-5">
                    {/* Vehicle Type */}
                    <div>
                      <label
                        htmlFor="vehicle_type"
                        className="block text-sm font-semibold text-slate-700"
                      >
                        Jenis Kendaraan
                      </label>

                      <select
                        name="vehicle_type"
                        id="vehicle_type"
                        value={formData.vehicle_type}
                        onChange={handleChange}
                        className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 transition outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                        required
                      >
                        <option value="">Pilih jenis kendaraan</option>
                        <option value="MOBIL">MOBIL</option>
                        <option value="MOTOR">MOTOR</option>
                      </select>
                    </div>

                    {/* Plate Number */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700">
                        Nomor Plat
                      </label>

                      <div className="mt-2 flex gap-2">
                        <input
                          type="text"
                          name="plate_prefix"
                          value={formData.plate_prefix}
                          onChange={handleChange}
                          placeholder="B"
                          maxLength={2}
                          className="h-11 w-1/4 rounded-xl border border-slate-200 px-3 text-center text-sm font-semibold text-slate-700 uppercase transition outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                          required
                        />

                        <input
                          type="text"
                          name="plate_number"
                          value={formData.plate_number}
                          onChange={handleChange}
                          placeholder="1234"
                          maxLength={4}
                          inputMode="numeric"
                          className="h-11 w-1/3 rounded-xl border border-slate-200 px-3 text-center text-sm font-semibold text-slate-700 uppercase transition outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                          required
                        />

                        <input
                          type="text"
                          name="plate_suffix"
                          value={formData.plate_suffix}
                          onChange={handleChange}
                          placeholder="ABC"
                          maxLength={3}
                          className="h-11 w-1/3 rounded-xl border border-slate-200 px-3 text-center text-sm font-semibold text-slate-700 uppercase transition outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                          required
                        />
                      </div>
                    </div>

                    {/* Plate Image */}
                    <div>
                      <label
                        htmlFor="plate_number_image"
                        className="block text-sm font-semibold text-slate-700"
                      >
                        Foto Nomor Plat
                      </label>

                      <input
                        type="file"
                        id="plate_number_image"
                        name="plate_number_image"
                        capture="environment"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2 block w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-slate-700"
                        required
                      />
                    </div>

                    {/* STNK */}
                    <div>
                      <label
                        htmlFor="stnk_image"
                        className="block text-sm font-semibold text-slate-700"
                      >
                        Foto STNK
                      </label>

                      <input
                        type="file"
                        id="stnk_image"
                        name="stnk_image"
                        capture="environment"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2 block w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:font-semibold file:text-slate-700"
                        required
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex h-11 w-full items-center justify-center rounded-xl bg-yellow-400 text-sm font-bold text-slate-900 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <ClipLoader size={20} color="#0f172a" />
                      ) : (
                        "Tambah Kendaraan"
                      )}
                    </button>
                  </form>
                </motion.div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
