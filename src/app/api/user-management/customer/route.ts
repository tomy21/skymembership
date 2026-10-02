import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const pageParam = searchParams.get("page") || "1";
    const limitParam = searchParams.get("limit") || "10";

    const page = parseInt(pageParam, 10);
    const limit = parseInt(limitParam, 10);

    const search = searchParams.get("search")?.trim() || "";

    const status = searchParams.get("status")?.trim() || "";

    const location = searchParams.get("location")?.trim() || "";

    if (Number.isNaN(page) || Number.isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        {
          error: "Invalid page or limit",
        },
        {
          status: 400,
        },
      );
    }

    console.log("========================================");
    console.log("CUSTOMER MEMBERSHIP PROXY");
    console.log("page:", page);
    console.log("limit:", limit);
    console.log("search:", search);
    console.log("status:", status);
    console.log("location:", location);
    console.log("========================================");

    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/get-all-membership`,
      {
        params: {
          page,
          limit,
          search,
          status,
          location,
        },
      },
    );

    console.log("[BACKEND RESPONSE]", {
      total: apiRes.data?.total,
      totalPages: apiRes.data?.totalPages,
      currentPage: apiRes.data?.currentPage,
    });

    return NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });
  } catch (error: any) {
    console.error(
      "Proxy get-all-membership error:",
      error.response?.data || error.message,
    );

    return NextResponse.json(
      error.response?.data || {
        message: "Something went wrong",
      },
      {
        status: error.response?.status || 500,
      },
    );
  }
}
