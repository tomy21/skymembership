"use client";

import NotificationDropdown from "@/components/header/NotificationDropdown";
import Button from "@/components/ui/button/Button";
import ProfileDropdown from "@/components/user-profile/ProfilDropdown";
import { useAuth } from "@/context/AuthContext";
import { useDetailCustomer } from "@/hooks/useAuth";
import { useCardList } from "@/hooks/useVehicle";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { FiChevronRight, FiCreditCard, FiPlus, FiX } from "react-icons/fi";
import { ClipLoader } from "react-spinners";

interface ResponseCard {
  id: number;
  vehicle_id: number;
  member_customer_no: string;
  plate_number: string;
  rfid: string;
  is_active: boolean;
  vehicle_type: string;
}

export default function HeaderHome() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchCustomer,
  } = useDetailCustomer();

  const {
    data: dataCard,
    isLoading: isLoadingCard,
    isError: isErrorCard,
    refetch: refetchCard,
  } = useCardList(isAuthenticated);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    refetchCustomer();
    refetchCard();
  }, [isAuthenticated, refetchCustomer, refetchCard]);

  const cards = useMemo(() => {
    return (
      dataCard?.data?.filter((item: ResponseCard) => Boolean(item.rfid)) ?? []
    );
  }, [dataCard?.data]);

  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    breakpoints: {
      "(min-width: 768px)": {
        slides: {
          perView: 2,
          spacing: 16,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3,
          spacing: 20,
        },
      },
    },
    slides: {
      perView: 1,
      spacing: 12,
    },
  });

  const getInitials = (fullname?: string) => {
    if (!fullname) {
      return "";
    }

    const names = fullname.trim().split(/\s+/);

    return (
      (names[0]?.charAt(0) ?? "") + (names[1]?.charAt(0) ?? "")
    ).toUpperCase();
  };

  const handleCardClick = (rfid: string) => {
    router.push(`/extend-membership?idCard=${rfid}`);
  };

  if (!mounted) {
    return <div className="h-[330px] w-full animate-pulse bg-slate-100" />;
  }

  if (isLoading || isLoadingCard) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-5 backdrop-blur-sm">
        <div className="flex w-full max-w-xs flex-col items-center rounded-3xl bg-white px-8 py-7 shadow-2xl">
          <ClipLoader size={42} color="#eab308" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Memuat data...
          </p>
        </div>
      </div>
    );
  }

  if (isError || isErrorCard) {
    return (
      <div className="flex min-h-[300px] items-center justify-center bg-slate-50 px-5">
        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
            <FiX className="text-xl text-red-500" />
          </div>

          <h2 className="mt-4 text-base font-bold text-slate-900">
            Gagal memuat data
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Terjadi masalah saat mengambil data membership.
          </p>

          <button
            type="button"
            onClick={() => {
              refetchCustomer();
              refetchCard();
            }}
            className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="relative overflow-visible rounded-b-[2rem] bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 px-5 pt-5 pb-16">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[2rem]">
          <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-orange-400/30 blur-3xl" />
        </div>

        {/* Main content */}
        <div className="relative z-10 mx-auto w-full max-w-6xl">
          {/* Profile */}
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <ProfileDropdown initial={getInitials(data?.data?.fullname)} />

              <div className="min-w-0">
                <p className="text-xs font-medium text-yellow-950/60">
                  Selamat datang,
                </p>

                <h1 className="max-w-[190px] truncate text-base font-bold text-slate-900">
                  {data?.data?.fullname}
                </h1>

                <div className="mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      data?.data?.is_active === 0
                        ? "bg-red-500"
                        : "bg-emerald-600"
                    }`}
                  />

                  <span className="text-[11px] font-medium text-slate-700">
                    {data?.data?.is_active === 0 ? "Inactive" : "Member Active"}
                  </span>
                </div>
              </div>
            </div>

            <NotificationDropdown />
          </div>

          {/* Membership */}
          <div className="mt-7">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-950/60">
                  My Membership
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Kartu Kendaraan
                </h2>
              </div>

              {cards.length > 0 && (
                <div className="rounded-full bg-black/10 px-3 py-1 text-[11px] font-semibold text-slate-800">
                  {currentSlide + 1}/{cards.length}
                </div>
              )}
            </div>

            {/* Slider */}
            <div ref={sliderRef} className="keen-slider w-full overflow-hidden">
              {cards.length === 0 ? (
                <div className="keen-slider__slide">
                  <div className="flex min-h-[175px] w-full flex-col items-center justify-center rounded-3xl border border-white/40 bg-white/25 px-5 py-6 backdrop-blur-md">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/50">
                      <FiCreditCard className="text-2xl text-slate-700" />
                    </div>

                    <p className="mt-3 text-sm font-bold text-slate-900">
                      Belum ada kartu
                    </p>

                    <p className="mt-1 text-center text-xs text-slate-700">
                      Tambahkan membership kendaraan Anda.
                    </p>
                  </div>
                </div>
              ) : (
                cards.map((item: ResponseCard, index: number) => (
                  <button
                    key={`${item.rfid}-${index}`}
                    type="button"
                    onClick={() => handleCardClick(item.rfid)}
                    className="keen-slider__slide block min-w-0 text-left"
                  >
                    <div className="group relative mx-auto aspect-[1.65/1] w-full max-w-[390px] overflow-hidden rounded-3xl shadow-xl shadow-amber-700/20">
                      <Image
                        src={
                          item.vehicle_type === "MOBIL"
                            ? "/images/company/card03.png"
                            : "/images/company/card02.png"
                        }
                        alt={`Membership ${item.rfid}`}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 767px) 90vw, 390px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                      <div className="absolute right-0 bottom-0 left-0 p-5">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] font-medium tracking-wider text-white/70 uppercase">
                              RFID Card
                            </p>

                            <p className="mt-1 truncate font-mono text-sm font-bold tracking-wider text-white">
                              {item.rfid.toUpperCase()}
                            </p>

                            {item.plate_number && (
                              <p className="mt-1 text-xs font-medium text-white/80">
                                {item.plate_number}
                              </p>
                            )}
                          </div>

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-md">
                            <FiChevronRight className="text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Points wallet */}
        <div className="absolute right-5 bottom-0 left-5 z-5 translate-y-1/2">
          <div className="mx-auto max-w-xl rounded-3xl border border-white/70 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-100">
                  <FaWallet className="text-lg text-yellow-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    Available Points
                  </p>

                  <p className="truncate text-lg font-bold text-slate-900">
                    {(data?.data?.points ?? 0).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setModalOpen(true)}
                variant="primary"
                className="h-11 shrink-0 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white shadow-lg shadow-slate-900/20 hover:bg-slate-800"
              >
                <FiPlus className="mr-1.5 text-base" />
                Top Up
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Top Up modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Image
                  src="/images/company/down-time.png"
                  alt="Maintenance"
                  width={50}
                  height={50}
                  className="opacity-50"
                />
              </div>
            </div>

            <div className="mt-5 text-center">
              <h2 className="text-lg font-bold text-slate-900">
                Top Up Points
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fitur top up sedang dalam pemeliharaan. Silakan coba kembali
                beberapa saat lagi.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
