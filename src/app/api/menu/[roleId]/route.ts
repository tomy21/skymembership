import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { roleId: number } },
) {
  try {
    const roleId = params.roleId ?? "";

    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/get-menu-byrole/${roleId}`,
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
