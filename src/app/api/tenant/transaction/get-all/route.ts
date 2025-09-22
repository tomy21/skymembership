/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const month = searchParams.get("month") || "";
    const year = searchParams.get("year") || "";

    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json(
        { error: "Invalid page or limit" },
        { status: 400 },
      );
    }

    const cookie = request.headers.get("cookie");

    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/tenant-transaction`,
      {
        params: { page, limit, search, month, year }, // ✅ teruskan ke backend
        withCredentials: true,
        headers: {
          Cookie: cookie || "",
        },
      },
    );

    return NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });
  } catch (error: any) {
    console.error(
      "Proxy tenant-transaction error:",
      error.response?.data || error.message,
    );
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}
