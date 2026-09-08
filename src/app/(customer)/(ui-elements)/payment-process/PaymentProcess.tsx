/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Accordion from "@/components/accordion/page";
import Loading from "@/components/Loading/Loading";
import Button from "@/components/ui/button/Button";
import { useDetailCustomer } from "@/hooks/useAuth";
import { usePaymentByVA } from "@/hooks/usePayment";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { jsPDF } from "jspdf";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiCopy,
  FiDownload,
  FiHome,
} from "react-icons/fi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { TbClockExclamation } from "react-icons/tb";
import { toast } from "sonner";

type PaymentStatus = "pending" | "success" | "failed";

export default function PaymentProcess() {
  const { data } = useDetailCustomer();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [dataSessionJson, setDataSessionJson] = useState<any>(null);
  const [topupData, setTopupData] = useState<any>(null);
  const [localStorageDataJson, setLocalStorageDataJson] = useState<any>(null);

  const idTransaction =
    searchParams.get("idTransaction") || dataSessionJson?.trxId || null;

  const hasTransaction = Boolean(idTransaction);

  const paymentHistory = usePaymentByVA(idTransaction);

  const payment = paymentHistory?.data?.data;
  const paymentResponse = paymentHistory?.data;

  const copyToClipboard = async (text: string, label: string) => {
    if (!text || text === "-") {
      toast.error(`${label} tidak tersedia`);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} berhasil disalin`);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error(`Gagal menyalin ${label}`);
    }
  };

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (localStorageDataJson) {
      localStorage.setItem(
        "localStorageDataJson",
        JSON.stringify(localStorageDataJson),
      );
    }
  }, [localStorageDataJson, mounted]);

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["userById"],
    });

    try {
      const dataSession = sessionStorage.getItem("transactionData");
      const topup = sessionStorage.getItem("topupData");
      const localStorageData = localStorage.getItem("purchaseData");

      setLocalStorageDataJson(
        localStorageData ? JSON.parse(localStorageData) : null,
      );

      setTopupData(topup ? JSON.parse(topup) : null);

      setDataSessionJson(dataSession ? JSON.parse(dataSession) : null);
    } catch (error) {
      console.error("Failed to read payment storage:", error);

      setLocalStorageDataJson(null);
      setTopupData(null);
      setDataSessionJson(null);
    }

    setMounted(true);
  }, [queryClient]);

  const getBankLogo = (gateway?: string) => {
    const value = gateway?.toUpperCase() ?? "";

    switch (value) {
      case "BANK_NATIONAL_NOBU_VIRTUAL_ACCOUNT":
      case "NOBU":
        return "/images/company/bank/nobu_logo.png";

      case "BAYARIND":
      case "BAYARIND_BCA_VIRTUAL_ACCOUNT":
        return "/images/company/bank/bca_logo.png";

      default:
        return "/images/company/bank/logo.png";
    }
  };

  const getBankName = (moduleName?: string) => {
    const value = moduleName?.toUpperCase() ?? "";

    switch (value) {
      case "BAYARIND_BCA_VIRTUAL_ACCOUNT":
      case "BAYARIND":
        return "BCA Virtual Account";

      case "BANK_NATIONAL_NOBU_VIRTUAL_ACCOUNT":
      case "NOBU":
        return "NOBU Virtual Account";

      default:
        return "Point SKY Membership";
    }
  };

  const getStatus = (): PaymentStatus => {
    const statusTransaction = payment?.status_transaction?.toUpperCase();

    const statusPayment = payment?.statusPayment?.toUpperCase();

    if (
      statusTransaction === "COMPLETED" ||
      statusTransaction === "PAID" ||
      statusPayment === "COMPLETED" ||
      statusPayment === "PAID"
    ) {
      return "success";
    }

    if (statusTransaction === "FAILED") {
      return "failed";
    }

    return "pending";
  };

  const status = getStatus();

  const getStatusTitle = () => {
    if (!hasTransaction) {
      return "Menunggu pembayaran";
    }

    if (status === "success") {
      return "Pembayaran berhasil";
    }

    if (status === "failed") {
      return "Pembayaran gagal";
    }

    return "Menunggu pembayaran";
  };

  const getStatusDescription = () => {
    if (!hasTransaction) {
      return "Silakan selesaikan pembayaran sesuai metode yang dipilih.";
    }

    if (status === "success") {
      return "Transaksi Anda telah berhasil diproses.";
    }

    if (status === "failed") {
      return "Transaksi dibatalkan atau gagal diproses oleh sistem.";
    }

    return "Silakan selesaikan pembayaran sebelum batas waktu berakhir.";
  };

  const getStatusIcon = () => {
    if (status === "success") {
      return (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
          <FiCheck size={30} strokeWidth={2.5} />
        </div>
      );
    }

    if (status === "failed") {
      return (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <IoMdCloseCircleOutline size={32} />
        </div>
      );
    }

    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-50 text-yellow-600">
        <TbClockExclamation size={32} />
      </div>
    );
  };

  const amount = hasTransaction
    ? Number(payment?.paid_amount || payment?.price || 0)
    : Number(dataSessionJson?.price || 0) +
      Number(dataSessionJson?.admin_fee || 0);

  const virtualAccount = hasTransaction
    ? payment?.virtual_account_number || ""
    : dataSessionJson?.virtual_account || "";

  const paymentMethod = hasTransaction
    ? getBankName(payment?.module_name)
    : getBankName(
        topupData?.provider?.gateway_partner ||
          localStorageDataJson?.provider?.gateway_partner,
      );

  const paymentLogo = hasTransaction
    ? getBankLogo(payment?.module_name)
    : getBankLogo(
        topupData?.provider?.gateway_partner ||
          localStorageDataJson?.provider?.gateway_partner,
      );

  const expiredDate = hasTransaction
    ? payment?.expired_date
    : dataSessionJson?.expired_date;

  const invoiceNumber =
    payment?.invoice_number ||
    payment?.invoice_id ||
    payment?.invoiceNumber ||
    dataSessionJson?.invoice_number ||
    dataSessionJson?.invoice_id ||
    "-";

  const vehicleNumber =
    payment?.vehicle_number ||
    payment?.plate_number ||
    dataSessionJson?.vehicle_number ||
    dataSessionJson?.plate_number ||
    "-";

  const vehicleType =
    payment?.vehicle_type || dataSessionJson?.vehicle_type || "-";

  const location =
    payment?.location_name ||
    payment?.location ||
    dataSessionJson?.location_name ||
    dataSessionJson?.location ||
    "-";

  const membershipName =
    payment?.product_name ||
    payment?.membership_name ||
    dataSessionJson?.product_name ||
    dataSessionJson?.membership_name ||
    "Membership";

  const formatCurrency = (value: number) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  const formatExpiredDate = (date?: string) => {
    if (!date) {
      return "-";
    }

    try {
      return format(new Date(date), "dd MMMM yyyy, HH:mm", {
        locale: id,
      });
    } catch {
      return "-";
    }
  };

  const handleBackHome = () => {
    queryClient.invalidateQueries({
      queryKey: ["userById"],
    });

    localStorage.removeItem("localStorageDataJson");
    localStorage.removeItem("purchaseData");

    sessionStorage.removeItem("transactionData");
    sessionStorage.removeItem("topupData");

    router.push("/home");
  };

  const handleCekStatus = () => {
    if (!dataSessionJson?.trxId) {
      toast.error("ID transaksi tidak ditemukan");
      return;
    }

    router.push(`/payment?idTransaction=${dataSessionJson.trxId}`);
  };

  const handlePrintPdf = async () => {
    setIsLoading(true);

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const logoPath = "/images/company/logo.png";

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();

          img.crossOrigin = "anonymous";

          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

          img.src = src;
        });

      const logo = await loadImage(logoPath);

      /*
       * =========================
       * Helper
       * =========================
       */

      const formatPdfCurrency = (value: number) => {
        return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
      };

      const drawLine = (y: number) => {
        doc.setDrawColor(225, 228, 232);
        doc.setLineWidth(0.3);
        doc.line(20, y, pageWidth - 20, y);
      };

      const drawDetailRow = (
        label: string,
        value: string,
        y: number,
        options?: {
          boldValue?: boolean;
        },
      ) => {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(110, 118, 130);
        doc.text(label, 25, y);

        doc.setFont("Helvetica", options?.boldValue ? "bold" : "normal");
        doc.setTextColor(30, 35, 40);

        const maxWidth = 105;

        const lines = doc.splitTextToSize(String(value || "-"), maxWidth);

        doc.text(lines, 80, y);

        return y + Math.max(8, lines.length * 5 + 3);
      };

      /*
       * =========================
       * Data
       * =========================
       */

      const statusTransaction = payment?.status_transaction?.toUpperCase();

      const statusPayment = payment?.statusPayment?.toUpperCase();

      const isSuccess =
        statusTransaction === "COMPLETED" ||
        statusTransaction === "PAID" ||
        statusPayment === "COMPLETED" ||
        statusPayment === "PAID";

      const isFailed = statusTransaction === "FAILED";

      const statusText = isSuccess
        ? "BERHASIL"
        : isFailed
          ? "GAGAL"
          : "MENUNGGU PEMBAYARAN";

      const transactionDate =
        payment?.paid_at ||
        payment?.payment_date ||
        payment?.created_at ||
        new Date();

      /*
       * =========================
       * Background
       * =========================
       */

      doc.setFillColor(248, 249, 250);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      /*
       * =========================
       * Header
       * =========================
       */

      doc.setFillColor(255, 193, 7);
      doc.rect(0, 0, pageWidth, 42, "F");

      /*
       * Logo
       */

      const logoRatio = logo.width > 0 ? logo.height / logo.width : 1;

      const logoWidth = 32;
      const logoHeight = logoWidth * logoRatio;

      doc.addImage(
        logo,
        "PNG",
        25,
        9,
        logoWidth,
        Math.min(logoHeight, 22),
        "",
        "FAST",
      );

      /*
       * Header title
       */

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(25, 25, 25);

      doc.text("PAYMENT RECEIPT", pageWidth - 25, 20, {
        align: "right",
      });

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(70, 70, 70);

      doc.text("SKY Parking Membership", pageWidth - 25, 27, {
        align: "right",
      });

      /*
       * =========================
       * Receipt container
       * =========================
       */

      doc.setFillColor(255, 255, 255);

      doc.roundedRect(18, 52, pageWidth - 36, 205, 4, 4, "F");

      /*
       * =========================
       * Status
       * =========================
       */

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(110, 118, 130);

      doc.text("STATUS PEMBAYARAN", 25, 67);

      if (isSuccess) {
        doc.setFillColor(220, 252, 231);
        doc.setTextColor(22, 101, 52);
      } else if (isFailed) {
        doc.setFillColor(254, 226, 226);
        doc.setTextColor(185, 28, 28);
      } else {
        doc.setFillColor(254, 249, 195);
        doc.setTextColor(133, 77, 14);
      }

      doc.roundedRect(25, 72, 42, 9, 4, 4, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(8);

      doc.text(statusText, 46, 78, {
        align: "center",
      });

      /*
       * =========================
       * Invoice
       * =========================
       */

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(110, 118, 130);

      doc.text("INVOICE", pageWidth - 25, 67, {
        align: "right",
      });

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(30, 35, 40);

      doc.text(String(invoiceNumber), pageWidth - 25, 75, {
        align: "right",
      });

      drawLine(88);

      /*
       * =========================
       * Amount
       * =========================
       */

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(110, 118, 130);

      doc.text("TOTAL PEMBAYARAN", 25, 103);

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(25, 30, 35);

      doc.text(formatPdfCurrency(amount), 25, 114);

      drawLine(123);

      /*
       * =========================
       * Detail Transaksi
       * =========================
       */

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(25, 30, 35);

      doc.text("Detail Transaksi", 25, 137);

      let detailY = 148;

      detailY = drawDetailRow("Akun", data?.data?.username || "-", detailY);

      detailY = drawDetailRow("Membership", membershipName, detailY);

      // detailY = drawDetailRow("Kendaraan", vehicleNumber, detailY);

      // detailY = drawDetailRow("Tipe Kendaraan", vehicleType, detailY);

      // detailY = drawDetailRow("Lokasi", location, detailY);

      /*
       * =========================
       * Payment Detail
       * =========================
       */

      drawLine(detailY + 2);

      let paymentY = detailY + 15;

      paymentY = drawDetailRow("Metode Pembayaran", paymentMethod, paymentY);

      if (virtualAccount) {
        paymentY = drawDetailRow("Virtual Account", virtualAccount, paymentY, {
          boldValue: true,
        });
      }

      paymentY = drawDetailRow(
        "Tanggal Transaksi",
        new Date(transactionDate).toLocaleString("id-ID", {
          dateStyle: "full",
          timeStyle: "short",
        }),
        paymentY,
      );

      /*
       * =========================
       * Total Box
       * =========================
       */

      const totalBoxY = Math.min(paymentY + 5, 238);

      doc.setFillColor(255, 249, 219);

      doc.roundedRect(25, totalBoxY, pageWidth - 50, 18, 3, 3, "F");

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(90, 70, 10);

      doc.text("Jumlah Pembayaran", 32, totalBoxY + 11);

      doc.setFontSize(13);

      doc.text(formatPdfCurrency(amount), pageWidth - 32, totalBoxY + 11, {
        align: "right",
      });

      /*
       * =========================
       * Footer
       * =========================
       */

      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(130, 135, 140);

      doc.text(
        "Terima kasih telah menggunakan SKY Parking Membership.",
        pageWidth / 2,
        274,
        {
          align: "center",
        },
      );

      doc.text(
        "Dokumen ini dibuat secara otomatis oleh sistem SKY Parking.",
        pageWidth / 2,
        280,
        {
          align: "center",
        },
      );

      /*
       * =========================
       * Save
       * =========================
       */

      doc.save(`payment-receipt-${invoiceNumber}.pdf`);

      toast.success("Invoice berhasil dibuat");
    } catch (error) {
      console.error("Error creating payment receipt:", error);

      toast.error("Gagal membuat invoice. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#f7f8fa]">
      {isLoading && <Loading />}

      {/* Header */}
      <header className="w-full bg-yellow-400">
        <div className="mx-auto flex h-14 w-full max-w-xl items-center px-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-900 transition hover:bg-black/5"
            aria-label="Kembali"
          >
            <FiArrowLeft size={21} />
          </button>

          <h1 className="flex-1 text-center text-lg font-bold text-slate-900">
            Pembayaran
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-xl px-4 pb-10">
        {/* Status */}
        <section className="pt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              {getStatusIcon()}

              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-slate-900">
                  {getStatusTitle()}
                </h2>

                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {getStatusDescription()}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <p className="text-xs font-medium text-slate-400">
                Total pembayaran
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                {formatCurrency(amount)}
              </p>
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="mt-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Metode Pembayaran
                </h2>

                <p className="mt-1 text-sm text-slate-500">{paymentMethod}</p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white">
                <Image
                  src={paymentLogo}
                  width={42}
                  height={42}
                  alt={paymentMethod}
                  className="h-auto max-h-9 w-auto object-contain"
                />
              </div>
            </div>

            {virtualAccount && status !== "failed" && (
              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      Nomor Virtual Account
                    </p>

                    <p className="mt-1 font-mono text-lg font-bold tracking-wide text-slate-900">
                      {virtualAccount}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(virtualAccount, "Virtual Account")
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                    aria-label="Salin Virtual Account"
                  >
                    <FiCopy size={17} />
                  </button>
                </div>
              </div>
            )}

            {status === "pending" && expiredDate && (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-yellow-100 bg-yellow-50 p-4">
                <TbClockExclamation
                  size={20}
                  className="mt-0.5 shrink-0 text-yellow-600"
                />

                <div>
                  <p className="text-xs font-medium text-yellow-700">
                    Batas pembayaran
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {formatExpiredDate(expiredDate)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Transaction Detail */}
        <section className="mt-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">
              Detail Transaksi
            </h2>

            <div className="mt-4 divide-y divide-slate-100">
              <div className="flex items-start justify-between gap-4 py-3 first:pt-0">
                <span className="text-sm text-slate-500">Akun</span>

                <span className="text-right text-sm font-semibold text-slate-900">
                  {data?.data?.username || "-"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-sm text-slate-500">Membership</span>

                <span className="text-right text-sm font-semibold text-slate-900">
                  {membershipName}
                </span>
              </div>

              {/* <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-sm text-slate-500">Kendaraan</span>

                <span className="text-right text-sm font-semibold text-slate-900">
                  {vehicleNumber}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-sm text-slate-500">Tipe kendaraan</span>

                <span className="text-right text-sm font-semibold text-slate-900 capitalize">
                  {vehicleType}
                </span>
              </div> */}

              {/* <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-sm text-slate-500">Lokasi</span>

                <span className="text-right text-sm font-semibold text-slate-900">
                  {location}
                </span>
              </div> */}

              <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-sm text-slate-500">Invoice</span>

                <span className="max-w-[60%] text-right font-mono text-sm font-semibold break-all text-slate-900">
                  {invoiceNumber}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-3">
                <span className="text-sm text-slate-500">Status</span>

                <span
                  className={`text-sm font-semibold ${
                    status === "success"
                      ? "text-emerald-600"
                      : status === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                  }`}
                >
                  {status === "success"
                    ? "Berhasil"
                    : status === "failed"
                      ? "Gagal"
                      : "Menunggu pembayaran"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4 py-3 last:pb-0">
                <span className="text-sm font-medium text-slate-600">
                  Total
                </span>

                <span className="text-right text-base font-bold text-slate-900">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Instructions */}
        {!hasTransaction && (
          <section className="mt-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <Accordion />
            </div>
          </section>
        )}

        {/* Action */}
        <section className="mt-6">
          {hasTransaction ? (
            <Button
              onClick={handlePrintPdf}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2"
            >
              <FiDownload size={17} />
              Download Invoice
            </Button>
          ) : (
            <Button onClick={handleCekStatus} className="w-full">
              Cek Status Pembayaran
            </Button>
          )}

          <button
            type="button"
            onClick={handleBackHome}
            className="mt-3 flex w-full items-center justify-center gap-2 py-3 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <FiHome size={16} />
            Kembali ke Home
          </button>
        </section>
      </main>
    </div>
  );
}
