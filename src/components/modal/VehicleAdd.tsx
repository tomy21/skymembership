"use client";

import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { FaPlus } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { useAddVehicle } from "@/hooks/useVehicle";
import { ClipLoader } from "react-spinners";
import toast from 'react-hot-toast';
import { useQueryClient } from "@tanstack/react-query";

export default function VehicleAdd() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_type: "",
    plate_number: "",
    plate_number_image: null as File | null,
    stnk_image: null as File | null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { mutateAsync: createVehicle } = useAddVehicle();
  const queryClient = useQueryClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) setFormData((f) => ({ ...f, [name]: files[0] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      createVehicle(formData, {
        onSuccess: (data) => {
          console.log("✅ Berhasil:", data);
          setIsLoading(false);
          toast.success("Berhasil menambahkan kendaraan.");
          setIsOpen(false);
          queryClient.invalidateQueries({ queryKey: ["vehicleData"] });
        },
        onError: (err) => {
          setFormData({
            vehicle_type: "",
            plate_number: "",
            plate_number_image: null,
            stnk_image: null,
          });
          setIsLoading(false);
          let message = 'An error occurred';
          if (err && typeof err === 'object' && 'response' in err) {
            const res = err as { response?: { data?: { message?: string } } };
            message = res.response?.data?.message ?? message;
          } else if (err instanceof Error) {
            message = err.message;
          }
          toast.error(message);
        },
    });
    } catch (error) {
      if(error instanceof Error) toast.error(error.message);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFormData({
      vehicle_type: "",
      plate_number: "",
      plate_number_image: null,
      stnk_image: null,
    });
  };


    if(isLoading){
        return (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
              <div className="flex flex-col items-center justify-center p-6">
                <ClipLoader size={50} color="#3b82f6" />
                <p className="mt-4 text-gray-700">Memproses...</p>
              </div>
            </div>
        )
    }
  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setIsOpen(true)}
        className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-white absolute bottom-24 right-5 cursor-pointer shadow-lg"
      >
        <FaPlus size={20} />
      </div>

      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <div className="fixed inset-0 bg-black/50" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md p-6 bg-white rounded-2xl shadow-lg space-y-4"
              >
                {/* Title and Close Button */}
                <div className="flex justify-between items-center">
                  <Dialog.Title className="text-lg font-bold text-gray-900">
                    Add Vehicle
                  </Dialog.Title>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                    <FiX size={22} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                    <select
                      name="vehicle_type"
                      id="vehicle_type"
                      value={formData.vehicle_type} // <--- tambahkan ini
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                    >
                      <option value="">-- Pilih Jenis Kendaraan --</option>
                      <option value="MOBIL">MOBIL</option>
                      <option value="MOTOR">MOTOR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plate Number</label>
                    <input
                      type="text"
                      name="plate_number"
                      value={formData.plate_number}
                      onChange={handleChange}
                      className="mt-1 w-full border border-gray-400 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Plate Number Image</label>
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
                    <label className="block text-sm font-medium text-gray-700">STNK Image</label>
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
                      className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
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
