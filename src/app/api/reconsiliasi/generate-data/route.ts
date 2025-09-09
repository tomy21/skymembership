/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { date, bank } = await request.json();

    if (!date || !bank) {
      return NextResponse.json(
        { error: "Missing required parameters: date or bank" },
        { status: 400 },
      );
    }

    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/recon/send-mutation-bank`,
      { date, bank },
    );

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error: any) {
    console.error(
      "Proxy generate error:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}
