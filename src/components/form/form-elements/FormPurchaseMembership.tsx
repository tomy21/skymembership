"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import { useRouter } from "next/navigation";
import { usePeriode, useTypeVehicle } from "@/hooks/useProduct";
import { useVehicleActive } from "@/hooks/useVehicle";
import { AsyncPaginate } from "react-select-async-paginate";
import { Location } from "../../../../libs/API/Location";

type OptionType = {
  value: string;
  label: string;
};

interface VehicleType {
  vehicle_type: string;
}
interface Periode {
  id: string;
  periode: string;
  price: number;
  product_name: string;
}
interface LocationRequest {
  location_code: string;
  location_name: string;
}

interface Vehicle {
  plate_number: string;
}

export default function BookingForm() {
  const router = useRouter();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState<OptionType | null>(
    null,
  );
  const [locationValue, setLocationValue] = useState<OptionType | null>(null);
  const [type, setType] = useState<OptionType | null>(null);
  const [period, setPeriod] = useState<OptionType | null>(null);
  const [vehicle, setVehicle] = useState<OptionType | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [productName, setProductName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: dataVehicle } = useTypeVehicle(selectedLocation?.value);
  const { data: dataPeriode } = usePeriode(
    type?.value,
    selectedLocation?.value,
  );

  const { data: dataVehicles } = useVehicleActive(
    type?.value,
    selectedLocation?.value,
  );

  const [vehicleData, setVehicleData] = useState<OptionType[]>([]);
  const [periodData, setPeriodData] = useState<OptionType[]>([]);
  const [vehicleUsers, setVehicleUsers] = useState<OptionType[]>([]);
  const defaultAdditional = useMemo(() => ({ page: 1, limit: 5 }), []);

  useEffect(() => {
    if (Array.isArray(dataVehicle?.data)) {
      setVehicleData(
        dataVehicle.data.map((v: VehicleType) => ({
          value: v.vehicle_type,
          label: v.vehicle_type,
        })),
      );
    }
    setMounted(true);
  }, [dataVehicle]);

  useEffect(() => {
    if (Array.isArray(dataPeriode?.data)) {
      setPeriodData(
        dataPeriode.data.map((p: Periode) => ({
          value: p.id,
          label: p.periode,
        })),
      );
    }
  }, [dataPeriode]);

  useEffect(() => {
    if (Array.isArray(dataVehicles?.data)) {
      const vehicles = dataVehicles.data;
      if (vehicles.length === 0) {
        setVehicleUsers([{ value: "__add", label: "➕ Tambah Kendaraan" }]);
      } else {
        setVehicleUsers(
          vehicles.map((v: Vehicle) => ({
            value: v.plate_number,
            label: v.plate_number.toUpperCase(),
          })),
        );
      }
    }
  }, [dataVehicles]);

  useEffect(() => {
    if (period && Array.isArray(dataPeriode?.data)) {
      const selected = dataPeriode.data.find(
        (p: Periode) => p.id === period.value,
      );

      if (selected) setPrice(selected.price);
      if (selected) setProductName(selected.product_name);
    }
  }, [period, dataPeriode]);

  const handleSubmit = () => {
    if (selectedLocation && type && period && vehicle) {
      setIsSubmitting(true);

      const query = new URLSearchParams({
        idProduct: period.value,
        location: selectedLocation.label,
        type: type.label,
        period: period.label,
        product: productName,
        vehicle: vehicle.label,
        typeProduct: "New Membership",
        price: price.toString(),
      }).toString();

      setTimeout(() => {
        router.push(`/form-validation-purchase?${query}`);
      }, 1000);
    }
  };

  const loadLocationOptions = useCallback(
    async (
      inputValue: string,
      _loadedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
      additional: { page: number; limit: number } = { page: 1, limit: 5 },
    ) => {
      setIsLoadingMore(true);
      try {
        const data = await Location.getAllLocation(
          additional.page,
          additional.limit,
          inputValue,
        );
        const newOptions: OptionType[] = (data?.data as LocationRequest[]).map(
          (loc) => ({
            value: loc.location_code,
            label: loc.location_name,
          }),
        );
        const hasMore = data?.data.length === additional.limit;
        return {
          options: newOptions,
          hasMore,
          additional: { page: additional.page + 1, limit: additional.limit },
        };
      } catch (error) {
        console.error("Error fetching location data:", error);
        return { options: [], hasMore: false, additional };
      } finally {
        setIsLoadingMore(false);
      }
    },
    [],
  );

  if (!mounted) return null;

  return (
    <div className="mx-auto min-h-screen max-w-xl rounded-2xl bg-white p-6 shadow-lg">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Pilih Lokasi
          </label>
          <AsyncPaginate
            placeholder="Cari lokasi..."
            value={locationValue}
            loadOptions={loadLocationOptions}
            onChange={(val) => {
              setLocationValue(val);
              setSelectedLocation(val);
            }}
            isSearchable
            additional={defaultAdditional}
            isLoading={isLoadingMore}
            loadingMessage={() => "Memuat lokasi..."}
            className="react-select-container"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Tipe Kendaraan
          </label>
          <Select
            placeholder="Tipe kendaraan..."
            options={vehicleData}
            value={type}
            onChange={(val) => {
              setType(val);
              setPeriod(null);
              setVehicle(null);
            }}
            isDisabled={!selectedLocation}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Periode
          </label>
          <Select
            placeholder="Pilih periode..."
            options={periodData}
            value={period}
            onChange={(val) => {
              setPeriod(val);
              setVehicle(null);
            }}
            isDisabled={!type}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Kendaraan
          </label>
          <Select
            placeholder="Pilih kendaraan..."
            options={vehicleUsers}
            value={vehicle}
            onChange={(val) => {
              if (val?.value === "__add") {
                router.push("/vehicle");
              } else {
                setVehicle(val);
              }
            }}
            isDisabled={!period}
          />
        </div>

        <div className="mt-4 rounded-lg bg-green-50 p-4 text-center">
          <span className="text-gray-600">Total:</span>{" "}
          <span className="text-xl font-bold text-green-600">
            Rp {price.toLocaleString("id-ID")}
          </span>
        </div>

        <button
          onClick={handleSubmit}
          disabled={
            !selectedLocation || !type || !period || !vehicle || isSubmitting
          }
          className="flex w-full items-center justify-center rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Memproses data...
            </span>
          ) : (
            "Lanjut ke Pembayaran"
          )}
        </button>
      </div>
    </div>
  );
}
