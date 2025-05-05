'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Select from 'react-select';
import { useRouter } from 'next/navigation';
import { useAllLocation } from '@/hooks/useLocation';
import { usePeriode, useProduct, useTypeVehicle } from '@/hooks/useProduct';
import { useVehicleActive } from '@/hooks/useVehicle';

type OptionType = { value: string; label: string };

interface LocationType {
  location_code: string;
  location_name: string;
}

interface VehicleType {
  vehicle_type: string;
}

interface PeriodType {
  periode: string;
}

interface VehicleUserType {
  plate_number: string;
}

interface ProductType {
  id: string;
  product_name: string;
  price: number;
}

export default function BookingForm() {
  const [selectedLocation, setSelectedLocation] = useState<OptionType | null>(null);
  const [type, setType] = useState<OptionType | null>(null);
  const [period, setPeriod] = useState<OptionType | null>(null);
  const [product, setProduct] = useState<OptionType | null>(null);
  const [vehicle, setVehicle] = useState<OptionType | null>(null);
  const [price, setPrice] = useState<number>(0);

  const [productData, setProductData] = useState<OptionType[]>([]);
  const [periodData, setPeriodData] = useState<OptionType[]>([]);
  const [locationData, setLocationData] = useState<OptionType[]>([]);
  const [vehicleData, setVehicleData] = useState<OptionType[]>([]);
  const [vehicleUsers, setVehicleUsers] = useState<OptionType[]>([]);

  const { data: dataLocation } = useAllLocation();
  const { data: dataVehicle } = useTypeVehicle(selectedLocation?.value);
  const { data: dataPeriode } = usePeriode(type?.value, selectedLocation?.value);
  const { data: dataProduct } = useProduct(selectedLocation?.value, type?.value, period?.value);
  const { data: dataVehicles } = useVehicleActive(type?.value,selectedLocation?.value );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (Array.isArray(dataLocation?.data)) {
      const options = dataLocation.data.map((item: LocationType) => ({
        value: item.location_code,
        label: item.location_name,
      }));
      setLocationData(options);
      
    }

    if (selectedLocation?.value && Array.isArray(dataVehicle?.data)) {
      const optionsVehicle = dataVehicle.data.map((item: VehicleType) => ({
        value: item.vehicle_type,
        label: item.vehicle_type,
      }));
      setVehicleData(optionsVehicle);
    }

    if (selectedLocation?.value && type && Array.isArray(dataPeriode?.data)) {
      const optionsPeriod = dataPeriode.data.map((item: PeriodType) => ({
        value: item.periode,
        label: item.periode,
      }));
      setPeriodData(optionsPeriod);
    }

    if (selectedLocation?.value && type && period && Array.isArray(dataProduct?.data)) {
      const optionsProduct = dataProduct.data.map((item: ProductType) => ({
        value: item.id,
        label: item.product_name,
      }));
      setProductData(optionsProduct);
    }

    if (type?.value && selectedLocation?.value && Array.isArray(dataVehicles?.data)) {
      const optionVehicle = dataVehicles.data.map((item: VehicleUserType) => ({
        value: item.plate_number,
        label: item.plate_number.toUpperCase(),
      }));
      setVehicleUsers(optionVehicle);
    }
    setMounted(true);
  }, [dataLocation, selectedLocation, dataVehicle, type, dataPeriode, period, dataProduct, dataVehicles]);

  useEffect(() => {
    if (product && Array.isArray(dataProduct?.data)) {
      const selected = dataProduct.data.find((item: ProductType) => item.id === product.value);
      if (selected) {
        setPrice(selected.price);
      }
    }
  }, [product, dataProduct]);

  const router = useRouter();
  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  const handleSubmit = () => {
    if (selectedLocation && type && period && product && vehicle) {
      const query = new URLSearchParams({
        idProduct: product.value,
        location: selectedLocation.label,
        type: type.label,
        period: period.label,
        product: product.label,
        vehicle: vehicle.label,
        price: price.toString(),
      }).toString();

      router.push(`/form-validation-purchase?${query}`);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
        <div className="max-w-xl mx-auto p-6 rounded-lg space-y-5">
      <Select
        placeholder="Pilih Lokasi..."
        options={locationData ?? []}
        value={selectedLocation ?? null}
        onChange={(val) => setSelectedLocation(val)}
        isSearchable
      />

      <Select
        placeholder="Tipe Kendaraan..."
        options={vehicleData ?? []}
        value={type ?? null}
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
        options={periodData ?? []}
        value={period ?? null}
        onChange={(val) => {
          setPeriod(val);
          setProduct(null);
          setVehicle(null);
        }}
        isDisabled={!type}
      />

      <Select
        placeholder="Product..."
        options={productData ?? []}
        value={product ?? null}
        onChange={(val) => {
          setProduct(val);
          setVehicle(null);
        }}
        isDisabled={!period}
      />
      <Select
        placeholder="Vehicle list ..."
        options={vehicleUsers ?? []}
        value={vehicle ?? null}
        onChange={(val) => {
          setVehicle(val);  // ✅ Yang dipilih adalah kendaraan
        }}
        isDisabled={!period}
      />

      {/* Jika kendaraan perlu dipilih lagi, bisa tambahkan Select baru untuk itu di sini */}

      <div className="text-center text-xl text-green-600 font-semibold">
        Total: Rp {price && price.toLocaleString('id-ID')}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={!selectedLocation || !type || !period || !product || !vehicle}
      >
        Lanjut ke Pembayaran
      </button>
    </div>
    </Suspense>
  );
}
