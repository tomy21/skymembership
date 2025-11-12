/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const bankName = searchParams.get("bankName") || "-";
    const month = searchParams.get("month") || "-";

    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/export-mutasi-bymonth`,
      {
        params: { month, bankName },
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
        filename = `Mutasi-${bankName}-${month}.xlsx`;
      }
    } else {
      filename = `Mutasi-${bankName}-${month}.xlsx`;
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
