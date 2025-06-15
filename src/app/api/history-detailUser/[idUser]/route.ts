import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { idUser: string } },
) {
  console.log("PARAMS:", params); // Harus muncul di TERMINAL, bukan browser console

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const idUser = params.idUser;

    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/member/api/history/get-history-user-byid/${idUser}`,
      {
        params: { page, limit, search },
      },
    );

    return NextResponse.json({
      success: true,
      message: "Data retrieved successfully",
      totalItems: apiRes.data.data?.history?.length || 0,
      totalPages: apiRes.data.data?.pagination?.totalPages || 1,
      currentPage: apiRes.data.data?.pagination?.currentPage || 1,
      limit: apiRes.data.data?.pagination?.limit || 10,
      data: {
        user: apiRes.data.data?.users,
        history: apiRes.data.data?.history,
      },
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
