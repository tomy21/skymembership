"use client";
import React, { useEffect, useState } from 'react';
import { BiRfid } from "react-icons/bi";
import Image from 'next/image';
import { formatDate } from '@fullcalendar/core/index.js';
import Button from '@/components/ui/button/Button';
import { useUpdateRFID } from '@/hooks/useVehicle';
import toast from 'react-hot-toast';
import { ClipLoader } from "react-spinners";
import { useQueryClient } from "@tanstack/react-query";

type CardHistoryProps = {
    idcustomer: string;
    type: 'MOBIL' | 'MOTOR';
    date: string;
    plateNumber: string;
    rfidNo: string;
};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    NDEFReader: any; // atau bisa pakai proper typing dari @types/wicg-web-nfc kalau tersedia
  }
}

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
  const {mutateAsync: updateRFID} = useUpdateRFID();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if ("NDEFReader" in window) {
      setNfcSupported(true);
    }
  }, []);

  const handleScanNFC = async () => {
    if ("NDEFReader" in window) {
      try {
        const ndef = new window.NDEFReader();
        await ndef.scan();
        ndef.onreading = (event: NDEFReadingEvent) => {
          const decoder = new TextDecoder();
          for (const record of event.message.records) {
            const text = decoder.decode(record.data);
            console.log("✅ Tag dibaca:", text);
            setRfid(text);
          }
        };
      } catch (error) {
        console.error("Gagal membaca NFC:", error);
      }
    } else {
      alert("NFC tidak didukung di perangkat ini.");
    }
  };

  const handleUpdateRFID = async(e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updateRFID({plate_number:plateNumber, RFID_Number: rfid});

      if(response.status === true) {
        setIsModal(false);
        setRfid('');
        toast.success(response.message);
        queryClient.invalidateQueries({ queryKey: ["vehicleData"] });
      }else{
        setRfid('');
        toast.error(response.response.data.message);
      }
      console.log(response.response.data.status);

    } catch (error) {
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  if(isLoading){
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50">
        <div className="flex flex-col items-center justify-center p-6">
          <ClipLoader size={50} color="#3b82f6" />
          <p className="mt-4 text-gray-700">Memproses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md p-4 space-y-3">
        <div className="border border-dashed border-slate-300 w-full absolute left-0 top-14"></div>
        <div className="w-8 h-8 rounded-full bg-white absolute top-10 -left-4 border-r border-slate-300"></div>
        <div className="w-8 h-8 rounded-full bg-white absolute top-10 -right-4 border-l border-slate-300"></div>
      {/* Header */}
      <div className="flex justify-between items-start mb-7">
        <span className="text-xs text-gray-500">{idcustomer}</span>
        <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-600 capitalize">
          {formatDate(date, { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      {/* Content */}
      <div className="flex justify-between items-center w-fullspace-y-1 py-3">
        <div className="flex flex-row justify-start items-center gap-x-5 w-[90%]">
          <Image 
            src={type === 'MOBIL' ? '/images/company/car.png' : '/images/company/motorcycle.png'}
            alt="vehicle"
            width={40}
            height={40}
          />
          <div className="flex flex-col justify-start items-start space-y-1">
            <p className="text-sm font-semibold text-gray-800 dark:text-white">{plateNumber}</p>
            <p className="text-xs text-gray-500 dark:text-white/60">{rfidNo === "" ? "RFID Not Found" : rfidNo}</p>
          </div>
        </div>
        <div className="flex flex-row justify-end items-start w-full space-x-5">
            <BiRfid onClick={() => setIsModal(true)} size={20} className='text-cyan-600'/>
        </div>
      </div>
      {isModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 z-50 p-5">
          <div className="space-y-2 w-full bg-white p-4 rounded-2xl shadow-2xl">
          <label className="text-xl font-medium text-gray-700">Input NO RFID</label>
          <div className='border my-3 w-full'></div>
          {nfcSupported ? (
            <button
              type="button"
              onClick={handleScanNFC}
              className="flex items-center space-x-2 bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
            >
              <BiRfid size={20} />
              <span>Scan via NFC</span>
            </button>
          ) : (
            <form onSubmit={handleUpdateRFID}>
              <div className='flex flex-col justify-start items-start space-y-2'>
                <label className="text-sm font-medium text-gray-700">No RFID</label>
                <input
                  type="text"
                  value={rfid}
                  onChange={(e) => setRfid(e.target.value)}
                  placeholder="Masukkan RFID manual"
                  className="w-full border border-gray-300 rounded p-2"
                />
                <div className="flex justify-end items-end space-x-2 flex-1">
                  <Button type="submit" className='items-end'>Simpan</Button>
                  <Button type="button" onClick={() => setIsModal(false)} className='items-end bg-red-500'>Batal</Button>
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
