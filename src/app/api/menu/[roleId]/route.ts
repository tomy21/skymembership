import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// Definisikan tipe params sebagai Promise jika menggunakan Next.js terbaru
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roleId: string }> } // Gunakan string & Promise
) {
  try {
    // 1. Await params-nya
    const resolvedParams = await params;
    const roleId = resolvedParams.roleId;

    if (!roleId) {
      return NextResponse.json({ message: "Role ID is required" }, { status: 400 });
    }

    // 2. Hit ke Backend Original
    // Pastikan env variable terbaca dengan benar
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/get-menu-byrole/${roleId}`;

    const apiRes = await axios.get(backendUrl);

    return NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });

  } catch (error: any) {
    // 3. Cek apakah error 404 datang dari Backend atau dari Proxy ini
    console.error("Proxy Menu Error:", error.response?.data || error.message);

    return NextResponse.json(
      error.response?.data || { message: "Backend API not reachable" },
      { status: error.response?.status || 500 }
    );
  }
}