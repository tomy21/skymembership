/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import Loading from "@/components/Loading/Loading";
import Button from "@/components/ui/button/Button";
import { usePeriode, useProduct } from "@/hooks/useProduct";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useCardListLocation } from "@/hooks/useVehicle";

type OptionType = {
  value: string;
  label: string;
};

interface Periode {
  periode: string;
}

interface Product {
  id: string;
  product_name: string;
  price: number;
}

interface responseDetailMembers {
  Cust_Member: number;
  created_at: string;
  end_date: string;
  id: number;
  invoice_id: string;
  is_active: boolean;
  is_used: boolean;
  kid: string;
  location_id: string;
  location_name: string;
  member_customer_no: string;
  start_date: string;
  updated_at: string;
}

export default function ExtendMembership() {
  const [detailCard, setDetailCard] = useState<any>(null);
  const [modalActive, setModalActive] = useState(false);
  const [location, setLocation] = useState("");
  const [locationName, setLocationName] = useState("");
  const [typeVehicle, setTypeVehicle] = useState("");
  const [plateNumber, setPlatNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [period, setPeriod] = useState<OptionType | null>(null);
  const [product, setProduct] = useState<OptionType | null>(null);
  const [periodData, setPeriodData] = useState<OptionType[]>([]);
  const [productData, setProductData] = useState<OptionType[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [detailMember, setDetailMember] =
    useState<responseDetailMembers | null>(null);

  const idCard = searchParams.get("idCard");
  const { data: dataPeriode } = usePeriode(typeVehicle, location);
  const { data: listLocation, isLoading: isLoadingLocation } =
    useCardListLocation(idCard || "");
  const { data: dataProduct } = useProduct(
    location,
    typeVehicle,
    period?.value,
  );

  useEffect(() => {
    if (!listLocation || !idCard) return;

    try {
      const detail = listLocation.data.detail;
      const locations = detail.location || [];

      setDetailCard(detail);
      setPlatNumber(detail.plateNumber || "");
      setLocation(locations);
      setTypeVehicle(detail.vehicleType || "");
    } catch (error) {
      console.error("Failed to process detail card:", error);
    }
  }, [listLocation, idCard]);

  const modalExtendCard = (membership: responseDetailMembers) => {
    setDetailMember(membership);
    setLocation(membership.location_id);
    setLocationName(membership?.location_name);
    setModalActive(true);
  };
  const closeModal = () => {
    setModalActive(false);
  };

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

  const handleExtendMembership = () => {
    setIsLoading(true);
    if (location && typeVehicle && period && product && plateNumber) {
      const query = new URLSearchParams({
        idProduct: product.value,
        location: locationName,
        type: typeVehicle,
        period: period.label,
        product: product.label,
        vehicle: plateNumber,
        typeProduct: "Extend",
        price: price.toString(),
      }).toString();

      router.push(`/form-validation-purchase?${query}`);
    }
  };

  const renderMembershipCard = (membership: any) => {
    const today = new Date();
<<<<<<< HEAD
    const fiveDaysBeforeEnd = new Date(membership.end_date);
    fiveDaysBeforeEnd.setDate(fiveDaysBeforeEnd.getDate() - 5);
    const isActive = new Date(membership.end_date) > new Date();
    const isExpired = today < fiveDaysBeforeEnd;
=======
    const isDate20 = today.getDate() === 20;
    const fiveDaysBeforeEnd = new Date(membership.end_date);
    fiveDaysBeforeEnd.setDate(fiveDaysBeforeEnd.getDate() - 5);
    const isActive = new Date(membership.end_date) > new Date();
    const isExpired = isDate20;
>>>>>>> development

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-sm font-semibold text-gray-800">
              {membership.location_name}
            </p>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium text-gray-700">
              {format(new Date(membership.start_date), "dd MMM yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium text-gray-700">
              {format(new Date(membership.end_date), "dd MMM yyyy")}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-between">
          <span
            className={`rounded-lg px-3 py-3 text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isActive ? "Active" : "Expired"}
          </span>
          {!isExpired && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => modalExtendCard(membership)}
            >
              Extend Membership
            </Button>
          )}
        </div>
      </div>
    );
  };

  if (!detailCard) return <Loading />;

  if (isLoading) return <Loading />;
  if (isLoadingLocation) return <Loading />;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl p-8">
        <div className="flex w-full items-center justify-between">
          <div className="mb-8 space-y-2">
            <p className="text-gray-600">Plate Number</p>
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold">
                {detailCard.plateNumber}
              </span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                {detailCard.vehicleType}
              </span>
            </div>
          </div>

          <div className="mb-8 space-y-2">
            <p className="text-gray-600">Member No</p>
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold">
                {detailCard.member_customer_no}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-3 space-y-2">
          <div>
            <p className="mb-1 text-sm text-gray-500">RFID</p>
            <p className="font-medium">{detailCard.rfid}</p>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-auto pr-2">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-1">
            {detailCard.location.map((m: any, index: number) => (
              <div key={index}>{renderMembershipCard(m)}</div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalActive && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="z-50 rounded-2xl bg-white p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h2 className="mb-4 text-lg font-semibold">Extend Membership</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Lokasi
                </label>
                <h1 className="font-semibold">
                  {detailMember && detailMember.location_name}
                </h1>
              </div>

              <div className="flex w-full items-center justify-between">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Type Kendaraan
                  </label>
                  <h1 className="font-semibold">
                    {detailMember && typeVehicle}
                  </h1>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Plat Nomor
                  </label>
                  <h1 className="font-semibold">
                    {detailMember && plateNumber}
                  </h1>
                </div>
              </div>

              <div className="mb-4">
                <Select
                  placeholder="Periode Member..."
                  options={periodData}
                  value={period}
                  onChange={(val) => {
                    setPeriod(val);
                    setProduct(null);
                  }}
                />
              </div>

              <div className="mb-4">
                <Select
                  placeholder="Product..."
                  options={productData}
                  value={product}
                  onChange={(val) => setProduct(val)}
                  isDisabled={!period}
                />
              </div>

              <div className="mb-4 text-center text-xl font-semibold text-green-600">
                Total: Rp {price.toLocaleString("id-ID")}
              </div>

              <Button
                size="sm"
                variant="primary"
                className="w-full"
                onClick={handleExtendMembership}
              >
                Extend Membership
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
