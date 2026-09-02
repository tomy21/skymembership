import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface Params {
  params: {
    tennantCode: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const month = searchParams.get("month") || "6";
    const year = searchParams.get("year") || "2025";

    const tennantCode = params.tennantCode;

    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json(
        { error: "Invalid page or limit" },
        { status: 400 },
      );
    }

    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/tenant-members/${tennantCode}`,
      {
        params: { page, limit, search, month, year },
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
