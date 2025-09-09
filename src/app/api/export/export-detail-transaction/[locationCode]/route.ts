/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// mapping bulan ke bahasa Indonesia
const bulanIndo = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export async function GET(
  request: NextRequest,
  { params }: { params: { locationCode: string } },
) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const locationCode = params.locationCode ?? "";
    const month = parseInt(searchParams.get("month") || "8");
    const year = searchParams.get("year") || "2025";

    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/export-data-history/${locationCode}?month=${month}&year=${year}`,
      {
        responseType: "arraybuffer",
      },
    );

    // Ambil nama file dari backend kalau ada
    const contentDisposition = apiRes.headers["content-disposition"];
    let filename: string;

    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      } else {
        filename = `Transaction History-${locationCode}-${bulanIndo[month - 1]}-${year}.xlsx`;
      }
    } else {
      filename = `Transaction History-${locationCode}-${bulanIndo[month - 1]}-${year}.xlsx`;
    }

    return new NextResponse(apiRes.data, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Proxy export error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}
