import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return res.json({ uri: process.env.TRUE_LAYER_PORTAL });
    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
