/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json(
        { error: "Invalid page or limit" },
        { status: 400 },
      );
    }

    const apiRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/all-data-users`,
      {
        params: { page, limit, search },
      },
    );

    return NextResponse.json(apiRes.data, {
      status: apiRes.status,
    });
  } catch (error: any) {
    console.error("Proxy login error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi minimal
    if (!body.fullname || !body.email || !body.username || !body.role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/register-cms`,
      body,
      { headers: { "Content-Type": "application/json" } },
    );

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error: any) {
    console.error("Proxy POST error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { message: "User ID diperlukan untuk update" },
        { status: 400 },
      );
    }

    // Validasi minimal
    if (!body.fullname || !body.email || !body.username || !body.role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const apiRes = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v01/cms/api/auth/update-users-cms/${body.id}`,
      body,
      { headers: { "Content-Type": "application/json" } },
    );

    return NextResponse.json(apiRes.data, { status: apiRes.status });
  } catch (error: any) {
    console.error("Proxy PUT error:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}
