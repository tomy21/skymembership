// pages/api/proxy/auth/login.ts
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const apiRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL_USERS}/v1/api/v01/member/api/auth/login`,
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    res.status(apiRes.status).json(apiRes.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { message: "Something went wrong" });
  }
}
