"use client";
import React from "react";
import { useDetailCustomer } from "@/hooks/useAuth";

export default function UserInfoCard() {
  const { data } = useDetailCustomer();

  return (
    <div className="rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nama Lengkap
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data?.data?.fullname}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data?.data?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                No Telepon
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data?.data?.phone_number}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Alamat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data?.data?.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
