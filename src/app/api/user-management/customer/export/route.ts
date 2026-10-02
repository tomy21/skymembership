import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";

    const status = searchParams.get("status")?.trim() || "";

    const location = searchParams.get("location")?.trim() || "";

    console.log("[EXPORT PARAMS]", {
      search,
      status,
      location,
    });

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/export-membership`,
      {
        params: {
          search,
          status,
          location,
        },
        responseType: "arraybuffer",
      },
    );

    return new Response(response.data, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":
          response.headers["content-disposition"] ||
          'attachment; filename="membership.xlsx"',
      },
    });
  } catch (error: any) {
    const errorData = error.response?.data;

    let errorMessage = error.message;

    if (Buffer.isBuffer(errorData)) {
      errorMessage = errorData.toString("utf-8");
    } else if (errorData instanceof ArrayBuffer) {
      errorMessage = Buffer.from(errorData).toString("utf-8");
    } else if (errorData) {
      errorMessage =
        typeof errorData === "string" ? errorData : JSON.stringify(errorData);
    }

    console.error("========================================");
    console.error("EXPORT ERROR");
    console.error(errorMessage);
    console.error("========================================");

    return NextResponse.json(
      {
        success: false,
        message: errorMessage,
      },
      {
        status: error.response?.status || 500,
      },
    );
  }
}
