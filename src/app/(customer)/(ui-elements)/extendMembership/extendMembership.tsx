/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/components/Loading/Loading";
import Button from "@/components/ui/button/Button";
import { usePeriode } from "@/hooks/useProduct";
import { useCardListLocation } from "@/hooks/useVehicle";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiMapPin,
  FiShield,
  FiX,
} from "react-icons/fi";
import Select from "react-select";

type OptionType = {
  value: string;
  label: string;
};

interface Periode {
  id: string;
  periode: string;
  price: number;
  product_name: string;
}

interface ResponseDetailMembers {
  Cust_Member: number;
  created_at: string;
  end_date: string;
  id: number;
  invoice_id: string;
  is_active: boolean | number;
  is_used: boolean;
  kid: string;
  location_id: string;
  location_name: string;
  member_customer_no: string;
  start_date: string;
  updated_at: string;
}

export default function ExtendMembership() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idCard = searchParams.get("idCard");

  const [detailCard, setDetailCard] = useState<any>(null);
  const [detailMember, setDetailMember] =
    useState<ResponseDetailMembers | null>(null);

  const [modalActive, setModalActive] = useState(false);
  const [location, setLocation] = useState("");
  const [locationName, setLocationName] = useState("");
  const [typeVehicle, setTypeVehicle] = useState("");
  const [plateNumber, setPlatNumber] = useState("");

  const [period, setPeriod] = useState<OptionType | null>(null);
  const [periodData, setPeriodData] = useState<OptionType[]>([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { data: dataPeriode, isLoading: isLoadingPeriod } = usePeriode(
    typeVehicle,
    location,
  );

  const { data: listLocation, isLoading: isLoadingLocation } =
    useCardListLocation(idCard || "");

  useEffect(() => {
    if (!listLocation || !idCard) {
      return;
    }

    try {
      const detail = listLocation.data.detail;
      const locations = detail.location || [];

      setDetailCard(detail);
      setPlatNumber(detail.plateNumber || "");
      setTypeVehicle(detail.vehicleType || "");

      if (Array.isArray(locations) && locations.length > 0) {
        const firstLocation = locations[0];

        if (firstLocation?.location_id) {
          setLocation(firstLocation.location_id);
        }
      }
    } catch (error) {
      console.error("Failed to process detail card:", error);
    }
  }, [listLocation, idCard]);

  useEffect(() => {
    if (!Array.isArray(dataPeriode?.data)) {
      setPeriodData([]);
      return;
    }

    setPeriodData(
      dataPeriode.data.map((item: Periode) => ({
        value: item.id,
        label: item.periode,
      })),
    );
  }, [dataPeriode]);

  useEffect(() => {
    if (!period || !Array.isArray(dataPeriode?.data)) {
      setPrice(0);
      setProductName("");
      return;
    }

    const selected = dataPeriode.data.find(
      (item: Periode) => item.id === period.value,
    );

    if (!selected) {
      return;
    }

    setPrice(selected.price);
    setProductName(selected.product_name);
  }, [period, dataPeriode]);

  const activeMemberships = useMemo(() => {
    if (!Array.isArray(detailCard?.location)) {
      return [];
    }

    return detailCard.location;
  }, [detailCard]);

  const modalExtendCard = (membership: ResponseDetailMembers) => {
    setDetailMember(membership);
    setLocation(membership.location_id);
    setLocationName(membership.location_name);
    setPeriod(null);
    setPrice(0);
    setProductName("");
    setModalActive(true);
  };

  const closeModal = () => {
    if (isLoading) {
      return;
    }

    setModalActive(false);
    setPeriod(null);
    setPrice(0);
    setProductName("");
  };

  const handleExtendMembership = () => {
    if (
      !location ||
      !typeVehicle ||
      !period ||
      !plateNumber ||
      !locationName ||
      !productName ||
      !price
    ) {
      return;
    }

    setIsLoading(true);

    const query = new URLSearchParams({
      idProduct: period.value,
      location: locationName,
      type: typeVehicle,
      period: period.label,
      product: productName,
      vehicle: plateNumber,
      typeProduct: "Extend",
      price: price.toString(),
    }).toString();

    router.push(`/form-validation-purchase?${query}`);
  };

  const isFormReady =
    Boolean(location) &&
    Boolean(typeVehicle) &&
    Boolean(period) &&
    Boolean(plateNumber) &&
    Boolean(locationName) &&
    Boolean(productName) &&
    price > 0;

  if (!detailCard) {
    return <Loading />;
  }

  if (isLoading || isLoadingLocation) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50">
      {/* Hero */}
      <section className="bg-yellow-400">
        <div className="mx-auto max-w-4xl px-5 pt-4 pb-7">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 transition active:scale-95"
            >
              <FiArrowLeft className="text-lg" />
            </button>

            <p className="text-sm font-medium text-slate-800">
              Extend Membership
            </p>

            <div className="w-10" />
          </div>

          <div className="mt-7">
            <p className="text-sm text-slate-700">Membership</p>

            <h1 className="mt-1 text-[26px] font-bold tracking-tight text-slate-950">
              Perpanjang Membership
            </h1>

            <p className="mt-1.5 max-w-md text-sm leading-5 text-slate-700/80">
              Perpanjang masa aktif kendaraan Anda dengan memilih periode
              membership.
            </p>
          </div>

          <div className="mt-6 rounded-[20px] bg-white p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                <FiCreditCard className="text-xl text-slate-700" />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-slate-400">Kendaraan</p>

                <div className="mt-0.5 flex items-center gap-2">
                  <h2 className="truncate text-lg font-bold text-slate-900">
                    {detailCard.plateNumber || "-"}
                  </h2>

                  <span className="text-xs text-slate-400">
                    {detailCard.vehicleType || "-"}
                  </span>
                </div>

                <p className="mt-0.5 text-xs text-slate-400">
                  RFID {detailCard.rfid || "-"}
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Member No</span>

                <span className="text-xs font-semibold text-slate-700">
                  {detailCard.member_customer_no || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <section className="px-5 pt-8 pb-10">
        <div className="mx-auto max-w-4xl">
          {/* Section heading */}
          <div className="mb-5">
            <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
              Membership Anda
            </p>

            <div className="mt-1 flex items-end justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                Pilih Membership
              </h2>

              <span className="text-xs text-slate-400">
                {activeMemberships.length} membership
              </span>
            </div>
          </div>

          {/* Membership list */}
          <div className="space-y-4">
            {activeMemberships.length === 0 ? (
              <EmptyMembership />
            ) : (
              activeMemberships.map(
                (membership: ResponseDetailMembers, index: number) => (
                  <MembershipCard
                    key={`${membership.id}-${index}`}
                    membership={membership}
                    onExtend={() => modalExtendCard(membership)}
                  />
                ),
              )
            )}
          </div>
        </div>
      </section>

      {/* Extend modal */}
      <AnimatePresence>
        {modalActive && detailMember && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
              initial={{
                y: 80,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: 80,
                opacity: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 28,
              }}
            >
              {/* Modal header */}
              <div className="border-b border-slate-100 px-5 pt-5 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                      Extend Membership
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      Pilih Periode
                    </h2>
                  </div>

                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={closeModal}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 disabled:opacity-50"
                  >
                    <FiX />
                  </button>
                </div>

                {/* Selected vehicle */}
                <div className="mt-4 flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <FiCreditCard className="text-slate-700" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {plateNumber}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {typeVehicle} · {detailMember.location_name}
                    </p>
                  </div>

                  <FiCheckCircle className="shrink-0 text-emerald-500" />
                </div>
              </div>

              {/* Modal body */}
              <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
                {/* Location */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Lokasi
                  </label>

                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                      <FiMapPin className="text-yellow-600" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                        Parking Area
                      </p>

                      <p className="mt-0.5 truncate text-sm font-bold text-slate-900">
                        {detailMember.location_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vehicle information */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoBox
                    icon={<FiCreditCard />}
                    label="Kendaraan"
                    value={typeVehicle}
                  />

                  <InfoBox
                    icon={<FiShield />}
                    label="Plat Nomor"
                    value={plateNumber}
                  />
                </div>

                {/* Period */}
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold text-slate-500">
                    Periode Membership
                  </label>

                  <Select
                    instanceId="membership-period"
                    placeholder={
                      isLoadingPeriod
                        ? "Memuat periode..."
                        : "Pilih periode membership"
                    }
                    options={periodData}
                    value={period}
                    isLoading={isLoadingPeriod}
                    isDisabled={isLoadingPeriod || isLoading}
                    isSearchable={false}
                    onChange={(value) => {
                      setPeriod(value);
                    }}
                    styles={selectStyles}
                  />
                </div>

                {/* Price */}
                <div className="mt-5 rounded-3xl bg-slate-900 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white/50">
                        Total Pembayaran
                      </p>

                      <p className="mt-1 text-2xl font-bold">
                        Rp {price.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                      <FiCreditCard className="text-xl" />
                    </div>
                  </div>

                  {productName && (
                    <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                      <FiCheckCircle className="text-emerald-400" />

                      <span className="text-xs text-white/70">
                        {productName}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  size="sm"
                  variant="primary"
                  disabled={!isFormReady || isLoading}
                  onClick={handleExtendMembership}
                  className="mt-4 h-12 w-full rounded-2xl bg-yellow-400 text-sm font-bold text-slate-900 shadow-lg shadow-yellow-500/20 hover:bg-yellow-300 disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {isLoading ? "Memproses..." : "Lanjutkan Pembayaran"}

                  {!isLoading && <FiChevronRight className="ml-2 text-base" />}
                </Button>

                <p className="mt-3 text-center text-[10px] leading-5 text-slate-400">
                  Pastikan periode dan kendaraan yang dipilih sudah sesuai
                  sebelum melanjutkan pembayaran.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

interface MembershipCardProps {
  membership: ResponseDetailMembers;
  onExtend: () => void;
}

function MembershipCard({ membership, onExtend }: MembershipCardProps) {
  const endDate = new Date(membership.end_date);
  const startDate = new Date(membership.start_date || membership.updated_at);

  const isActive =
    endDate > new Date() &&
    (membership.is_active === true || membership.is_active === 1);

  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    ),
  );

  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg">
      {/* Card top */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                isActive
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {isActive ? (
                <FiCheckCircle className="text-xl" />
              ) : (
                <FiClock className="text-xl" />
              )}
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
                Membership
              </p>

              <h3 className="mt-1 truncate text-base font-bold text-slate-900">
                {membership.location_name || "Parking Area"}
              </h3>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-bold ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-red-50 text-red-500"
            }`}
          >
            {isActive ? "ACTIVE" : "EXPIRED"}
          </span>
        </div>

        {/* Date */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <DateBox
            icon={<FiCalendar />}
            label="Mulai"
            value={format(startDate, "dd MMM yyyy")}
          />

          <DateBox
            icon={<FiCalendar />}
            label="Berakhir"
            value={format(endDate, "dd MMM yyyy")}
          />
        </div>

        {/* Remaining */}
        {isActive && (
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
            <div className="flex items-center gap-2">
              <FiClock className="text-emerald-600" />

              <span className="text-xs font-medium text-emerald-700">
                Sisa masa aktif
              </span>
            </div>

            <span className="text-sm font-bold text-emerald-700">
              {daysRemaining} hari
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
              Member No
            </p>

            <p className="mt-1 font-mono text-xs font-bold text-slate-700">
              {membership.member_customer_no || "-"}
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onExtend}
            className="rounded-xl border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 transition hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700"
          >
            Extend
            <FiChevronRight className="ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className="text-slate-400">{icon}</span>

        <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-xs font-bold text-slate-800">{value}</p>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[10px] font-medium tracking-wider uppercase">
          {label}
        </span>
      </div>

      <p className="mt-2 truncate text-sm font-bold text-slate-900">
        {value || "-"}
      </p>
    </div>
  );
}

function DateBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3.5">
      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <span className="text-[10px] font-medium tracking-wider uppercase">
          {label}
        </span>
      </div>

      <p className="mt-2 text-sm font-bold text-slate-800">{value}</p>
    </div>
  );
}

function EmptyMembership() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
        <FiCreditCard className="text-2xl text-slate-400" />
      </div>

      <h3 className="mt-4 text-base font-bold text-slate-800">
        Belum ada membership
      </h3>

      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-slate-400">
        Tidak ada membership kendaraan yang tersedia untuk diperpanjang.
      </p>
    </div>
  );
}

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "52px",
    borderRadius: "16px",
    borderColor: state.isFocused ? "#facc15" : "#e2e8f0",
    backgroundColor: "#f8fafc",
    boxShadow: state.isFocused ? "0 0 0 4px rgba(250, 204, 21, 0.15)" : "none",
    "&:hover": {
      borderColor: "#facc15",
    },
  }),
  valueContainer: (base: any) => ({
    ...base,
    paddingLeft: "16px",
    paddingRight: "12px",
  }),
  placeholder: (base: any) => ({
    ...base,
    color: "#94a3b8",
    fontSize: "13px",
  }),
  singleValue: (base: any) => ({
    ...base,
    color: "#0f172a",
    fontSize: "13px",
    fontWeight: 600,
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "16px",
    overflow: "hidden",
    marginTop: "6px",
    boxShadow: "0 20px 40px rgba(15, 23, 42, 0.12)",
    zIndex: 100,
  }),
  option: (base: any, state: any) => ({
    ...base,
    padding: "12px 16px",
    fontSize: "13px",
    fontWeight: state.isSelected ? 700 : 500,
    backgroundColor: state.isSelected
      ? "#fef3c7"
      : state.isFocused
        ? "#f8fafc"
        : "#ffffff",
    color: "#0f172a",
    cursor: "pointer",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
};
