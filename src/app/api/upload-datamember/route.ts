// app/api/upload-datamember/route.ts (App Router style)
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    // Convert Web File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Kirim ke backend menggunakan axios + form-data (Node.js)
    const forwardForm = new FormData();
    forwardForm.append("file", buffer, file.name);

    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/upload-member`,
      forwardForm,
      {
        headers: {
          ...forwardForm.getHeaders(),
        },
        withCredentials: true,
      },
    );

    return NextResponse.json(apiRes.data, { status: apiRes.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Upload Proxy Error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Upload failed" },
      { status: error.response?.status || 500 },
    );
  }
}
