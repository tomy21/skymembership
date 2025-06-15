import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_PAYMENT}/v01/cms/api/auth/cms-userById`,
    );

    return NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Proxy login error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}
