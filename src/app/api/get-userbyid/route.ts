import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("refreshToken");
    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/cms-userById`,
      {
        headers: {
          Cookie: `token=${token?.value}`, // Kirim ke backend
        },
        withCredentials: true,
      },
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
