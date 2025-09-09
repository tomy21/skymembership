/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

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

    // validasi ekstensi
    if (!file.name.endsWith(".txt")) {
      return NextResponse.json({ message: "File harus .txt" }, { status: 400 });
    }

    // baca isi file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileContent = buffer.toString("utf-8");

    console.log("Isi file:", fileContent.substring(0, 200));

    // contoh: forward ke backend Express
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/upload-mutasi`,
      {
        method: "POST",
        body: formData,
        credentials: "include",
      },
    );

    if (!apiRes.ok) {
      const text = await apiRes.text(); // ambil text dulu
      let err;

      try {
        err = JSON.parse(text); // coba parse kalau memang JSON
      } catch {
        err = { error: "Backend error (non-JSON)", raw: text };
      }

      return NextResponse.json(err, { status: apiRes.status });
    }

    const data = await apiRes.json();

    return NextResponse.json({ message: "Upload sukses", data });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
