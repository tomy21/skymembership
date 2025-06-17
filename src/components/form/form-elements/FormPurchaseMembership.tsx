"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Select, { GroupBase, OptionsOrGroups } from "react-select";
import { useRouter } from "next/navigation";
// import { useAllLocation } from '@/hooks/useLocation';
import { usePeriode, useProduct, useTypeVehicle } from "@/hooks/useProduct";
import { useVehicleActive } from "@/hooks/useVehicle";
import { AsyncPaginate } from "react-select-async-paginate";
import { Location } from "../../../../libs/API/Location";

type OptionType = {
  value: string;
  label: string;
};

// interface LocationRequest {
//   location_code: string;
//   location_name: string;
// }

interface VehicleType {
  vehicle_type: string;
}

interface Periode {
  periode: string;
}

interface LocationRequest {
  location_code: string;
  location_name: string;
}

interface Product {
  id: string;
  product_name: string;
  price: number;
}

interface Vehicle {
  plate_number: string;
}

export default function BookingForm() {
  const router = useRouter();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);

  // STATE
  const [selectedLocation, setSelectedLocation] = useState<OptionType | null>(
    null,
  );
  const [locationValue, setLocationValue] = useState<OptionType | null>(null);
  const [type, setType] = useState<OptionType | null>(null);
  const [period, setPeriod] = useState<OptionType | null>(null);
  const [product, setProduct] = useState<OptionType | null>(null);
  const [vehicle, setVehicle] = useState<OptionType | null>(null);
  const [price, setPrice] = useState<number>(0);

  // HOOK DATA
  // const { data: dataLocation } = useAllLocation(page, 5, search);
  const { data: dataVehicle } = useTypeVehicle(selectedLocation?.value);
  const { data: dataPeriode } = usePeriode(
    type?.value,
    selectedLocation?.value,
  );
  const { data: dataProduct } = useProduct(
    selectedLocation?.value,
    type?.value,
    period?.value,
  );
  const { data: dataVehicles } = useVehicleActive(
    type?.value,
    selectedLocation?.value,
  );

  // OPTION STATES
  // const [locationData, setLocationData] = useState<OptionType[]>([]);
  const [vehicleData, setVehicleData] = useState<OptionType[]>([]);
  const [periodData, setPeriodData] = useState<OptionType[]>([]);
  const [productData, setProductData] = useState<OptionType[]>([]);
  const [vehicleUsers, setVehicleUsers] = useState<OptionType[]>([]);
  const defaultAdditional = useMemo(() => ({ page: 1, limit: 5 }), []);

  // MAPPING VEHICLE TYPE
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

  // MAPPING PERIODE
  useEffect(() => {
    if (Array.isArray(dataPeriode?.data)) {
      setPeriodData(
        dataPeriode.data.map((p: Periode) => ({
          value: p.periode,
          label: p.periode,
        })),
      );
    }
  }, [dataPeriode]);

  // MAPPING PRODUCT
  useEffect(() => {
    if (Array.isArray(dataProduct?.data)) {
      setProductData(
        dataProduct.data.map((p: Product) => ({
          value: p.id,
          label: p.product_name,
        })),
      );
    }
  }, [dataProduct]);

  // MAPPING VEHICLE USER
  useEffect(() => {
    if (Array.isArray(dataVehicles?.data)) {
      const vehicles = dataVehicles.data;

      // Jika kendaraan kosong, hanya tampilkan "Tambah Kendaraan"
      if (vehicles.length === 0) {
        setVehicleUsers([
          {
            value: "__add",
            label: "➕ Tambah Kendaraan",
          },
        ]);
      } else {
        // Jika ada kendaraan, tampilkan kendaraan saja
        const options = vehicles.map((v: Vehicle) => ({
          value: v.plate_number,
          label: v.plate_number.toUpperCase(),
        }));

        setVehicleUsers(options);
      }
    }
  }, [dataVehicles]);

  // SET PRICE WHEN PRODUCT SELECTED
  useEffect(() => {
    if (product && Array.isArray(dataProduct?.data)) {
      const selected = dataProduct.data.find(
        (p: Product) => p.id === product.value,
      );
      if (selected) {
        setPrice(selected.price);
      }
    }
  }, [product, dataProduct]);

  // SUBMIT
  const handleSubmit = () => {
    if (selectedLocation && type && period && product && vehicle) {
      const query = new URLSearchParams({
        idProduct: product.value,
        location: selectedLocation.label,
        type: type.label,
        period: period.label,
        product: product.label,
        vehicle: vehicle.label,
        typeProduct: "New Membership",
        price: price.toString(),
      }).toString();

      router.push(`/form-validation-purchase?${query}`);
    }
  };

  const loadLocationOptions = useCallback(
    async (
      inputValue: string,
      loadedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
      additional: { page: number; limit: number } = { page: 1, limit: 5 },
    ): Promise<{
      options: OptionType[];
      hasMore: boolean;
      additional: { page: number; limit: number };
    }> => {
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
          additional: {
            page: additional.page + 1,
            limit: additional.limit,
          },
        };
      } catch (error) {
        console.error("Error fetching location data:", error);
        return {
          options: [],
          hasMore: false,
          additional,
        };
      } finally {
        setIsLoadingMore(false);
      }
    },
    [],
  );

  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 rounded-lg p-6">
      <AsyncPaginate
        placeholder="Pilih Lokasi..."
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
      />

      <Select
        placeholder="Tipe Kendaraan..."
        options={vehicleData}
        value={type}
        onChange={(val) => {
          setType(val);
          setPeriod(null);
          setProduct(null);
          setVehicle(null);
        }}
        isDisabled={!selectedLocation}
      />

      <Select
        placeholder="Periode Member..."
        options={periodData}
        value={period}
        onChange={(val) => {
          setPeriod(val);
          setProduct(null);
          setVehicle(null);
        }}
        isDisabled={!type}
      />

      <Select
        placeholder="Product..."
        options={productData}
        value={product}
        onChange={(val) => {
          setProduct(val);
          setVehicle(null);
        }}
        isDisabled={!period}
      />

      <Select
        placeholder="Vehicle list..."
        options={vehicleUsers}
        value={vehicle}
        onChange={(val) => {
          if (val?.value === "__add") {
            router.push("/vehicle");
          } else {
            setVehicle(val);
          }
        }}
        isDisabled={!product}
      />

      <div className="text-center text-xl font-semibold text-green-600">
        Total: Rp {price.toLocaleString("id-ID")}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!selectedLocation || !type || !period || !product || !vehicle}
      >
        Lanjut ke Pembayaran
      </button>
    </div>
  );
}
