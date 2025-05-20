"use client";
import React, { useEffect, useState } from "react";
import { BiRfid } from "react-icons/bi";
import Image from "next/image";
import { formatDate } from "@fullcalendar/core/index.js";
import Button from "@/components/ui/button/Button";
import { useUpdateRFID } from "@/hooks/useVehicle";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";

type CardHistoryProps = {
  idcustomer: string;
  type: "MOBIL" | "MOTOR";
  date: string;
  plateNumber: string;
  rfidNo: string;
};

export default function CardVehicle({
  idcustomer,
  date,
  type,
  plateNumber,
  rfidNo,
}: CardHistoryProps) {
  const [nfcSupported, setNfcSupported] = useState(false);
  const [rfid, setRfid] = useState("");
  const [isModal, setIsModal] = useState(false);
  const { mutateAsync: updateRFID } = useUpdateRFID();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if ("NDEFReader" in window) {
      setNfcSupported(true);
    } else {
      setNfcSupported(false);
    }
  }, []);

  const handleScanNFC = async () => {
    if ("NDEFReader" in window) {
      try {
        setIsLoading(true);
        const ndef = new window.NDEFReader();
        await ndef.scan();

        ndef.addEventListener("reading", (event: NDEFReadingEvent) => {
          const { serialNumber } = event;

          if (serialNumber) {
            const formattedRfid = serialNumber.replace(/:/g, "").toUpperCase();
            setRfid(formattedRfid);
            setIsModal(true);
          }

          setIsLoading(false);
        });
      } catch (error) {
        console.error("Gagal membaca NFC:", error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (isModal && nfcSupported) {
      handleScanNFC();
    }
  }, [isModal, nfcSupported]);

  useEffect(() => {
    if (rfid !== "" && isModal && nfcSupported) {
      handleUpdateRFID();
    }
  }, [rfid]);

  const handleUpdateRFID = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateRFID({
        plate_number: plateNumber,
        RFID_Number: rfid,
      });

      if (response.status === true) {
        setIsModal(false);
        // setRfid("");
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["vehicleData"] });
      } else {
        // setRfid("");
        toast.error(response.response.data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full space-y-3 rounded-xl border border-gray-300 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-900">
      <div className="absolute top-14 left-0 w-full border border-dashed border-slate-300"></div>
      <div className="absolute top-10 -left-4 h-8 w-8 rounded-full border-r border-slate-300 bg-white"></div>
      <div className="absolute top-10 -right-4 h-8 w-8 rounded-full border-l border-slate-300 bg-white"></div>

      {/* Header */}
      <div className="mb-7 flex items-start justify-between">
        <span className="text-xs text-gray-500">{idcustomer}</span>
        <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600 capitalize">
          {formatDate(date, { day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Content */}
      <div className="flex w-full items-center justify-between space-y-1 py-3">
        <div className="flex w-[90%] flex-row items-center justify-start gap-x-5">
          <Image
            src={
              type === "MOBIL"
                ? "/images/company/car.png"
                : "/images/company/motorcycle.png"
            }
            alt="vehicle"
            width={40}
            height={40}
          />
          <div className="flex flex-col items-start justify-start space-y-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {plateNumber}
            </p>
            <p className="text-xs text-gray-500 dark:text-white/60">
              {rfidNo === "" ? "RFID Not Found" : rfidNo}
            </p>
          </div>
        </div>
        <div className="flex w-full flex-row items-start justify-end space-x-5">
          <BiRfid
            onClick={() => setIsModal(true)}
            size={20}
            className="cursor-pointer text-cyan-600"
          />
        </div>
      </div>

      {/* Modal */}
      {isModal && (
        <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-2xl">
            <label className="text-xl font-semibold text-gray-700">
              Scan RFID
            </label>
            <div className="my-3 w-full border" />
            {nfcSupported ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-4">
                {isLoading ? (
                  <>
                    <ClipLoader size={40} color="#0ea5e9" />
                    <p className="text-sm text-gray-700">
                      Tempelkan kartu member Anda...
                    </p>
                  </>
                ) : (
                  <>
                    <p>{rfid}</p>
                    <p className="text-sm text-gray-700">
                      Siap untuk scan NFC...
                    </p>
                  </>
                )}
                <Button
                  type="button"
                  onClick={() => setIsModal(false)}
                  className="bg-red-500"
                >
                  Batal
                </Button>
              </div>
            ) : (
              <form onSubmit={handleUpdateRFID}>
                <div className="flex flex-col space-y-3">
                  <label className="text-sm font-medium text-gray-700">
                    No RFID
                  </label>
                  <input
                    type="text"
                    value={rfid}
                    onChange={(e) => setRfid(e.target.value)}
                    placeholder="Masukkan RFID manual"
                    className="w-full rounded border border-gray-300 p-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button type="submit">Simpan</Button>
                    <Button
                      type="button"
                      onClick={() => setIsModal(false)}
                      className="bg-red-500"
                    >
                      Batal
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
