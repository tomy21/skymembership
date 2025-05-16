"use client";
import Accordion from "@/components/accordion/page";
import Button from "@/components/ui/button/Button";
import { usePaymentContext } from "@/context/PaymentContext";
import { useTopupContext } from "@/context/TopupContext";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { TbClockExclamation } from "react-icons/tb";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useDetailCustomer } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePurchaseContext } from "@/context/PurchaseContext";
import { usePaymentByVA } from "@/hooks/usePayment";
import { IoMdCheckmarkCircle, IoMdCloseCircleOutline } from "react-icons/io";
import { jsPDF } from "jspdf";
import Loading from "@/components/Loading/Loading";

export default function PaymentProcess() {
  const { paymentData, admin_fee } = usePaymentContext();
  const { topupData } = useTopupContext();
  const { purchaseData } = usePurchaseContext();
  const { data } = useDetailCustomer();
  const [isLoading, setIsLoading] = useState(false);

  const searchParams = useSearchParams();
  const idTransaction = searchParams.get("idTransaction") || "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mounted, setMounted] = useState(false);

  const paymentHistory = usePaymentByVA(idTransaction);
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin!`);
  };

  const getBankLogo = (gateway: string) => {
    switch (gateway.toUpperCase()) {
      case "BAYARIND":
        return "/images/company/bank/bca_logo.png";
      case "NOBU":
        return "/images/company/bank/nobu_logo.png";
      // Tambahkan yang lain jika perlu
      default:
        return "/images/company/bank/logo.png";
    }
  };

  const getBankLogoHistory = (moduleName: string) => {
    switch (moduleName.toUpperCase()) {
      case "BAYARIND_BCA_VIRTUAL_ACCOUNT":
        return "/images/company/bank/bca_logo.png";
      case "BANK_NATIONAL_NOBU_VIRTUAL_ACCOUNT":
        return "/images/company/bank/nobu_logo.png";
      // Tambahkan yang lain jika perlu
      default:
        return "/images/company/bank/logo.png";
    }
  };

  const handleBackHome = () => {
    queryClient.invalidateQueries({ queryKey: ["userById"] });
    router.push("/home");
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["userById"] });
    setMounted(true);
  }, [queryClient]);

  // Function to parse nominal number
  const parseNominal = (text: string) => {
    return text.replace(/[^\d]/g, "");
  };

  const handlePrintPdf = () => {
    setIsLoading(true); // ⏳ Mulai loading

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const payment = paymentHistory?.data;
    const logoWatermark = "/images/company/logo.png";
    const today = new Date();

    const loadImage = (src: string) =>
      new Promise<HTMLImageElement>((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => resolve(img);
      });

    loadImage(logoWatermark)
      .then((img) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.globalAlpha = 0.1;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const imgData = canvas.toDataURL("image/png");

          doc.setFont("Helvetica", "bold");
          doc.setFontSize(22);
          doc.setTextColor(30, 30, 30);
          doc.text("Payment Receipt", 105, 30, { align: "center" });

          doc.setDrawColor(200, 200, 200);
          doc.line(20, 40, 190, 40);

          doc.setFontSize(13);
          doc.setFont("Helvetica", "normal");
          const details = [
            { label: "Invoice ID", value: payment?.data.invoice_number ?? "-" },
            { label: "Status", value: payment?.data.status_transaction ?? "-" },
            {
              label: "Amount Paid",
              value:
                `Rp ${payment?.data.paid_amount?.toLocaleString("id-ID")}` ||
                "Rp 0",
            },
            {
              label: "Date",
              value: today.toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              }),
            },
            {
              label: "Virtual Account",
              value: payment?.data.virtual_account_number ?? "-",
            },
          ];

          let y = 50;
          details.forEach((item) => {
            doc.text(`${item.label}:`, 25, y);
            doc.text(item.value, 80, y);
            y += 10;
          });

          doc.addImage(imgData, "PNG", 30, 70, 150, 150, "", "FAST");

          doc.setFontSize(10);
          doc.setTextColor(150, 150, 150);
          doc.text("Generated by SKY Parking", 105, 140, { align: "center" });

          // ⏳ Save PDF baru setelah semua selesai
          doc.save(
            `payment-receipt-${payment?.data.invoice_number ?? "unknown"}.pdf`,
          );

          // ✅ SELESAI, matikan loading
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error load image / create PDF:", error);
        setIsLoading(false); // Tetap matikan loading walau error
      });
  };

  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  const handleCekStatus = () => {
    router.push("/payment?idTransaction=" + paymentData?.trxId);
  };

  console.log(paymentHistory);

  return (
    <div className="min-h-screen w-full bg-white">
      {isLoading && <Loading />}
      {/* Header Section */}
      <div className="h-72 rounded-br-[100px] rounded-bl-4xl bg-yellow-400 p-4 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white font-bold">
          {(() => {
            if (idTransaction === "") {
              return (
                <TbClockExclamation size={60} className="text-yellow-500" />
              );
            }

            const statusTransaction =
              paymentHistory.data?.data.status_transaction;
            const statusPayment = paymentHistory.data?.data.statusPayment;

            if (statusTransaction === "FAILED") {
              return (
                <IoMdCloseCircleOutline size={60} className="text-red-500" />
              );
            }

            if (
              statusTransaction === "COMPLETED" ||
              statusPayment === "COMPLETED" ||
              statusTransaction === "PAID" ||
              statusPayment === "PAID"
            ) {
              return (
                <IoMdCheckmarkCircle size={60} className="text-green-500" />
              );
            }

            if (statusTransaction === "PENDING") {
              return (
                <TbClockExclamation size={60} className="text-yellow-500" />
              );
            }

            // Default
            return <TbClockExclamation size={60} className="text-yellow-500" />;
          })()}
        </div>
        <h2 className="text-lg font-medium text-orange-800">
          {(() => {
            if (idTransaction === "") {
              return "Pesanan berhasil dibuat";
            }

            const statusTransaction =
              paymentHistory.data?.data.status_transaction;
            const statusPayment = paymentHistory.data?.data.statusPayment;

            if (
              statusTransaction === "COMPLETED" ||
              statusPayment === "COMPLETED" ||
              statusTransaction === "PAID" ||
              statusPayment === "PAID"
            ) {
              return "Transaksi sudah di bayarkan";
            }

            if (statusTransaction === "FAILED") {
              return "Transaksi di batalkan oleh sistem";
            }

            return "Pesanan berhasil dibuat";
          })()}
        </h2>
        {idTransaction !== "" ? (
          <p className="text-3xl font-bold text-orange-900">
            Rp.{" "}
            {paymentHistory.data?.data.paid_amount != null &&
            paymentHistory.data?.data.paid_amount !== 0
              ? Number(paymentHistory.data.data.paid_amount).toLocaleString(
                  "id-ID",
                )
              : Number(paymentHistory.data?.data.price || 0).toLocaleString(
                  "id-ID",
                )}
          </p>
        ) : (
          <p className="text-3xl font-bold text-orange-900">
            Rp.{" "}
            {Number(paymentData!.price + admin_fee).toLocaleString("id-ID") ||
              0}
          </p>
        )}

        <div
          className={`${
            paymentHistory.data?.data.status_transaction === "FAILED"
              ? ""
              : "bg-orange-200"
          } mt-2 rounded-lg p-3 text-orange-900`}
        >
          {(() => {
            if (idTransaction !== "") {
              const statusTransaction =
                paymentHistory.data?.data.status_transaction;
              const statusPayment = paymentHistory.data?.data.statusPayment;
              const expiredDate = paymentHistory.data?.data?.expired_date;

              if (
                statusTransaction === "COMPLETED" ||
                statusTransaction === "PAID" ||
                statusPayment === "COMPLETED" ||
                statusPayment === "PAID"
              ) {
                return "Transaksi sudah di bayarkan";
              }

              if (statusTransaction === "FAILED") {
                return null; // Tidak render apa-apa
              }

              return (
                <>
                  <p className="text-sm">Silahkan lakukan pembayaran sebelum</p>
                  <p className="text-base font-semibold">
                    {expiredDate &&
                      format(new Date(expiredDate), "dd MMMM yyyy, HH:mm", {
                        locale: id,
                      })}
                  </p>
                </>
              );
            } else {
              const expiredDate = paymentData?.expired_date;

              return (
                <>
                  <p className="text-sm">Selesaikan pembayaran sebelum</p>
                  <p className="text-base font-semibold">
                    {expiredDate &&
                      format(new Date(expiredDate), "dd MMMM yyyy, HH:mm", {
                        locale: id,
                      })}
                  </p>
                </>
              );
            }
          })()}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4">
        <div className="mt-4 rounded-lg bg-white p-4 shadow-md">
          <div className="flex w-full items-center justify-between">
            <div className="mb-2 text-sm font-semibold text-gray-500">
              Account an.
            </div>
            <div className="mb-2 text-sm text-gray-900">
              {data?.data.username}
            </div>
          </div>

          <div className="mt-5 mb-2 flex w-full items-center justify-between">
            <div className="text-sm font-semibold text-gray-500">
              {purchaseData?.provider?.gateway_partner
                ? purchaseData.provider.gateway_partner
                : topupData?.provider?.gateway_partner
                  ? topupData.provider.gateway_partner
                  : paymentHistory?.data?.data?.payment_using
                    ? paymentHistory.data.data.payment_using
                    : paymentHistory?.data?.data?.transactionType
                      ? paymentHistory.data.data.transactionType
                      : "-"}
            </div>
            {idTransaction !== "" ? (
              <Image
                src={getBankLogoHistory(
                  paymentHistory?.data?.data.module_name ?? "-",
                )}
                width={50}
                height={50}
                alt="bank logo"
              />
            ) : (
              <Image
                src={getBankLogo(
                  topupData?.provider?.gateway_partner ??
                    purchaseData?.provider?.gateway_partner ??
                    "-",
                )}
                width={50}
                height={50}
                alt="bank logo"
              />
            )}
          </div>

          {paymentHistory.data?.data ? (
            <div className="mb-4 flex items-center justify-between">
              {idTransaction !== "" ? (
                <>
                  <span className="font-mono text-sm">
                    {paymentHistory.data?.data.virtual_account_number}
                  </span>
                  {paymentHistory.data?.data.status_transaction ===
                  "PENDING" ? (
                    <button
                      className="text-sm text-blue-500"
                      onClick={() =>
                        copyToClipboard(
                          paymentHistory.data?.data.virtual_account_number ??
                            "-",
                          "Virtual Account",
                        )
                      }
                    >
                      📋
                    </button>
                  ) : (
                    <button
                      className="text-sm text-blue-500"
                      onClick={() =>
                        copyToClipboard(
                          paymentHistory.data?.data.virtual_account_number ??
                            "-",
                          "Virtual Account",
                        )
                      }
                    >
                      📋
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="font-mono text-sm">
                    {paymentData?.virtual_account}
                  </span>
                  <button
                    className="text-sm text-blue-500"
                    onClick={() =>
                      copyToClipboard(
                        paymentData?.virtual_account ?? "-",
                        "Virtual Account",
                      )
                    }
                  >
                    📋
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="mb-4 flex items-center justify-between">
              {idTransaction !== "" ? (
                <>
                  <span className="font-mono text-sm">
                    {paymentHistory.data?.data.virtual_account_number}
                  </span>
                  {paymentHistory.data?.data.status_transaction === "FAILED" ? (
                    ""
                  ) : (
                    <button
                      className="text-sm text-blue-500"
                      onClick={() =>
                        copyToClipboard(
                          paymentHistory.data?.data.virtual_account_number ??
                            "-",
                          "Virtual Account",
                        )
                      }
                    >
                      📋
                    </button>
                  )}
                </>
              ) : (
                <>
                  <span className="font-mono text-sm">
                    {paymentData?.virtual_account}
                  </span>
                  <button
                    className="text-sm text-blue-500"
                    onClick={() =>
                      copyToClipboard(
                        paymentData?.virtual_account ?? "-",
                        "Virtual Account",
                      )
                    }
                  >
                    📋
                  </button>
                </>
              )}
            </div>
          )}

          <div className="mb-1 text-sm font-semibold text-gray-500">
            Total Tagihan
          </div>
          <div className="mb-4 flex items-center justify-between text-base font-bold text-gray-900">
            {idTransaction !== "" ? (
              <>
                <span className="font-mono text-sm">
                  Rp.{" "}
                  {paymentHistory.data?.data.paid_amount != null &&
                  paymentHistory.data?.data.paid_amount !== 0
                    ? Number(
                        paymentHistory.data.data.paid_amount,
                      ).toLocaleString("id-ID")
                    : Number(
                        paymentHistory.data?.data.price || 0,
                      ).toLocaleString("id-ID")}
                </span>
                {paymentHistory.data?.data.status_transaction === "FAILED" ? (
                  ""
                ) : paymentHistory.data?.data ? (
                  ""
                ) : (
                  <button
                    className="text-sm text-blue-500"
                    onClick={() =>
                      copyToClipboard(
                        Number(topupData!.nominal.toString()) +
                          parseNominal(admin_fee.toString()),
                        "Nominal",
                      )
                    }
                  >
                    📋
                  </button>
                )}
              </>
            ) : (
              <>
                <span>
                  Rp.{" "}
                  {Number(paymentData!.price + admin_fee).toLocaleString(
                    "id-ID",
                  ) || 0}
                </span>
                <button
                  className="text-sm text-blue-500"
                  onClick={() =>
                    copyToClipboard(
                      Number(paymentData!.price + admin_fee).toString(),
                      "Nominal",
                    )
                  }
                >
                  📋
                </button>
              </>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between border-t pt-2">
            <span className="text-sm font-semibold text-gray-600">
              Jumlah Pembayaran
            </span>
            {idTransaction !== "" ? (
              <p className="text-sm font-bold text-gray-800">
                Rp.{" "}
                {paymentHistory.data?.data.paid_amount != null &&
                paymentHistory.data?.data.paid_amount !== 0
                  ? Number(paymentHistory.data.data.paid_amount).toLocaleString(
                      "id-ID",
                    )
                  : Number(paymentHistory.data?.data.price || 0).toLocaleString(
                      "id-ID",
                    )}
              </p>
            ) : (
              <span className="text-sm font-bold text-gray-800">
                Rp{" "}
                {Number(paymentData!.price + admin_fee).toLocaleString("id-ID")}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Accordion Section */}
      {!idTransaction && (
        <div className="p-4">
          <div className="rounded-lg bg-white p-2 shadow-md">
            <Accordion />
          </div>
        </div>
      )}

      {/* Button */}
      <div className="mt-6 mb-10 space-y-2 p-4">
        {idTransaction !== "" ? (
          <Button onClick={handlePrintPdf} className="w-full">
            Print Invoice
          </Button>
        ) : (
          <Button onClick={handleCekStatus} className="w-full">
            Cek status pembayaran
          </Button>
        )}
        <Button onClick={handleBackHome} className="w-full bg-red-500">
          Kembali ke home
        </Button>
      </div>
    </div>
  );
}
