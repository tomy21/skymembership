/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 400 },
      );
    }

    // validasi ekstensi Excel
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      return NextResponse.json(
        { message: "File harus .xlsx atau .xls" },
        { status: 400 },
      );
    }

    // ambil isi file sebagai buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // parsing dengan XLSX
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // ambil sheet pertama
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // konversi ke JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    console.log("Isi Excel:", jsonData.slice(0, 5));

    // contoh: forward ke backend Express
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/upload-excel`,
      {
        method: "POST",
        body: formData, // kalau backend butuh file mentahnya
        credentials: "include",
      },
    );

    if (!apiRes.ok) {
      const text = await apiRes.text();
      let err;

      try {
        err = JSON.parse(text);
      } catch {
        err = { error: "Backend error (non-JSON)", raw: text };
      }

      return NextResponse.json(err, { status: apiRes.status });
    }

    const data = await apiRes.json();

    return NextResponse.json({
      message: "Upload sukses",
      parsed: jsonData,
      data,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
