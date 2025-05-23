"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "react-select";
import { vehicleAdd } from "../../../../../../libs/API/VehicleListUser";
// import Image from "next/image";
import Loading from "@/components/Loading/Loading";
import Button from "@/components/ui/button/Button";
import { usePeriode, useProduct } from "@/hooks/useProduct";
import { format } from "date-fns";

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

export default function ExtendMembership() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detailCard, setDetailCard] = useState<any>(null);
  const [modalActive, setModalActive] = useState(false);
  const [location, setLocation] = useState("");
  const [locationName, setLocationName] = useState("");
  const [typeVehicle, setTypeVehicle] = useState("");
  const [plateNumber, setPlatNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [period, setPeriod] = useState<OptionType | null>(null);
  const [product, setProduct] = useState<OptionType | null>(null);
  const [periodData, setPeriodData] = useState<OptionType[]>([]);
  const [productData, setProductData] = useState<OptionType[]>([]);
  const [price, setPrice] = useState<number>(0);

  const { data: dataPeriode } = usePeriode(typeVehicle, location);

  const { data: dataProduct } = useProduct(
    location,
    typeVehicle,
    period?.value,
  );

  const searchParams = useSearchParams();
  const idCard = searchParams.get("idCard") || "";
  // console.log("type vehicle", detailCard);
  useEffect(() => {
    const fetchDetailCard = async () => {
      try {
        const response = await vehicleAdd.getDetailVehicle(Number(idCard));
        setDetailCard(response.data);
        setPlatNumber(response.data.plate_number);
        setLocation(response.data.membership[0].location_id);
        setLocationName(response.data.membership[0].location_name);
        setTypeVehicle(response.data.vehicle_type);
      } catch (error) {
        console.log(error);
      }
    };
    if (idCard) fetchDetailCard();
  }, [idCard]);

  const modalExtendCard = () => {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderMembershipCard = (membership: any) => {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Location</p>
          <p className="font-medium">{membership.location_name}</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Start Date</p>
            <p className="font-medium">
              {format(membership.start_date, "dd MMM yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">End Date</p>
            <p className="font-medium">
              {format(membership.end_date, "dd MMM yyyy")}
            </p>
          </div>
        </div>
        <div className="flex w-full items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span
              className={`rounded-full px-3 py-1 text-sm font-semibold ${
                membership.is_active
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {membership.is_active ? "Active" : "Expired"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (!detailCard) return <Loading />;

  if (isLoading) return <Loading />;

  return (
    <Suspense fallback={<Loading />}>
      <div className="min-h-screen">
        <div className="mx-auto max-w-4xl p-8">
          <div className="flex w-full items-center justify-between">
            <div className="mb-8 space-y-2">
              <p className="text-gray-600">Plate Number</p>
              <div className="flex items-center space-x-3">
                <span className="text-xl font-semibold">
                  {detailCard.plate_number}
                </span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                  {detailCard.vehicle_type}
                </span>
              </div>
            </div>

            <div className="mb-8 space-y-2">
              <p className="text-gray-600">Member No</p>
              <div className="flex items-center space-x-3">
                <span className="text-xl font-semibold">
                  {detailCard.member_customer_no}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-10">
            {renderMembershipCard(detailCard.membership?.[0])}
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-sm text-gray-500">RFID</p>
              <p className="font-medium">{detailCard.rfid}</p>
            </div>
            {detailCard?.membership[0]?.is_active === false && (
              <Button size="sm" variant="outline" onClick={modalExtendCard}>
                Extend Membership
              </Button>
            )}

            {/* <div>
            <p className="mb-1 text-sm text-gray-500">STNK Image</p>
            <Image
              src={`https://apimembershipservice.skyparking.online/uploads/${detailCard.stnk_image}`}
              alt="STNK"
              className="h-40 w-full rounded-md border object-contain shadow"
              width={100}
              height={100}
            />
          </div>
          <div>
            <p className="mb-1 text-sm text-gray-500">Plate Number Image</p>
            <Image
              src={`https://apimembershipservice.skyparking.online/uploads/${detailCard.plate_number_image}`}
              alt="Plate Number"
              className="h-40 w-full rounded-md border object-contain shadow"
              width={100}
              height={100}
            />
          </div> */}
          </div>
        </div>

        {modalActive && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50" onClick={closeModal} />
            <div className="z-50 rounded-2xl bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Extend Membership</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Lokasi
                </label>
                <h1 className="font-semibold">
                  {detailCard.membership[0].location_name}
                </h1>
              </div>
              <div className="flex w-full items-center justify-between">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Type Kendaraan
                  </label>
                  <h1 className="font-semibold">{detailCard.vehicle_type}</h1>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Plat Nomor
                  </label>
                  <h1 className="font-semibold">{detailCard.plate_number}</h1>
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
                  onChange={(val) => {
                    setProduct(val);
                  }}
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
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
