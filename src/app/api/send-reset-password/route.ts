import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log(body);

    if (!body.email) {
      return NextResponse.json(
        { status: "error", message: "Email is required" },
        { status: 400 },
      );
    }
    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/lupa-password`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // 🔥 agar axios menerima Set-Cookie dari backend
      },
    );

    const response = NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}
