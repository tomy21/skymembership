import { NextApiRequest, NextApiResponse } from "next";
import { APIAPPS } from "../../../../libs/ApiServices";

export default async function Notification(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await APIAPPS.get("/v01/member/api/notification-get");

    return res.status(200).json(response.data);
  } catch (error) {
    console.log(error);
  }
}
