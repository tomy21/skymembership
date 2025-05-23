"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useAddVehicle } from "@/hooks/useVehicle";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

type FormData = {
  vehicle_type: string;
  plate_prefix?: string;
  plate_number: string;
  plate_suffix?: string; // ← dijadikan optional
  plate_number_image: File | null;
  stnk_image: File | null;
};

export default function VehicleAdd() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    vehicle_type: "",
    plate_prefix: "", // Kotak 1
    plate_number: "", // Kotak 2
    plate_suffix: "", // Kotak 3
    plate_number_image: null as File | null,
    stnk_image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: createVehicle } = useAddVehicle();
  const queryClient = useQueryClient();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    let formattedValue = value.toUpperCase();

    if (name === "plate_prefix") {
      // Hanya huruf, maksimal 2
      formattedValue = formattedValue.replace(/[^A-Z]/g, "").slice(0, 2);
    } else if (name === "plate_number") {
      // Hanya angka, maksimal 4
      formattedValue = formattedValue.replace(/[^0-9]/g, "").slice(0, 4);
    } else if (name === "plate_suffix") {
      // Hanya huruf, maksimal 3
      formattedValue = formattedValue.replace(/[^A-Z]/g, "").slice(0, 3);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) setFormData((f) => ({ ...f, [name]: files[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
      createVehicle(submitData, {
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Berhasil menambahkan kendaraan.");
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: ["vehicleData"] });
          setFormData({
            vehicle_type: "",
            plate_prefix: "", // Kotak 1
            plate_number: "", // Kotak 2
            plate_suffix: "", // Kotak 3
            plate_number_image: null as File | null,
            stnk_image: null as File | null,
          });
        },
        onError: (err) => {
          setFormData({
            vehicle_type: "",
            plate_prefix: "", // Kotak 1
            plate_number: "", // Kotak 2
            plate_suffix: "", // Kotak 3
            plate_number_image: null as File | null,
            stnk_image: null as File | null,
          });
          setIsLoading(false);
          let message = "An error occurred";
          if (err && typeof err === "object" && "response" in err) {
            const res = err as { response?: { data?: { message?: string } } };
            message = res.response?.data?.message ?? message;
          } else if (err instanceof Error) {
            message = err.message;
          }
          toast.error(message);
        },
      });
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      vehicle_type: "",
      plate_prefix: "", // Kotak 1
      plate_number: "", // Kotak 2
      plate_suffix: "", // Kotak 3
      plate_number_image: null as File | null,
      stnk_image: null as File | null,
    });
  };

  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 flex h-full w-full items-center justify-center bg-black/50">
        <div className="flex flex-col items-center justify-center p-6">
          <ClipLoader size={50} color="#3b82f6" />
          <p className="mt-4 text-gray-700">Memproses...</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(true)}
        className="absolute right-5 bottom-24 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-500 text-white shadow-lg"
      >
        <FaPlus size={20} />
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black/50" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg"
              >
                {/* Title and Close Button */}
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    Add Vehicle
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={22} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vehicle Type
                    </label>
                    <select
                      name="vehicle_type"
                      id="vehicle_type"
                      value={formData.vehicle_type} // <--- tambahkan ini
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">-- Pilih Jenis Kendaraan --</option>
                      <option value="MOBIL">MOBIL</option>
                      <option value="MOTOR">MOTOR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Plate Number
                    </label>
                    <div className="mt-1 flex space-x-2">
                      <input
                        type="text"
                        name="plate_prefix"
                        value={formData.plate_prefix}
                        onChange={handleChange}
                        placeholder="AA"
                        maxLength={2}
                        className="w-1/4 rounded-md border p-2 uppercase"
                        required
                      />
                      <input
                        type="text"
                        name="plate_number"
                        value={formData.plate_number}
                        onChange={handleChange}
                        placeholder="1234"
                        maxLength={4}
                        className="w-1/3 rounded-md border p-2 uppercase"
                        required
                      />
                      <input
                        type="text"
                        name="plate_suffix"
                        value={formData.plate_suffix}
                        onChange={handleChange}
                        placeholder="XYZ"
                        maxLength={3}
                        className="w-1/3 rounded-md border p-2 uppercase"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Plate Number Image
                    </label>
                    <input
                      type="file"
                      name="plate_number_image"
                      capture="environment"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      STNK Image
                    </label>
                    <input
                      type="file"
                      name="stnk_image"
                      capture="environment"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mt-1 block w-full text-sm text-gray-600"
                      required
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </motion.div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
