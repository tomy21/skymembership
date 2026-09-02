import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/login-cms`,
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

    // 🔁 Teruskan Set-Cookie dari response backend ke browser
    const setCookieHeader = apiRes.headers["set-cookie"];
    if (setCookieHeader) {
      response.headers.set("set-cookie", setCookieHeader.toString());
    }

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Proxy login error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}
