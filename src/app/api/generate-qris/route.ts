import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const date = new Date();
    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_QRIS}/v1/payment/qris/lostmember/generate-payment`,
      {
        LocationCode: body.LocationCode,
        invoiceNumber: `INV/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${date.getHours()}/${date.getMinutes()}/${date.getSeconds()}/${body.customerNo}`,
        externalStoreId: body.externalStoreId,
        ProductName: body.ProductName,
        amount: body.amount,
        expiry: body.expiry,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(apiRes.data, { status: apiRes.status });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "QRIS Lost Member Proxy Error:",
      error.response?.data || error.message,
    );

    return NextResponse.json(
      error.response?.data || { message: "Something went wrong" },
      { status: error.response?.status || 500 },
    );
  }
}
