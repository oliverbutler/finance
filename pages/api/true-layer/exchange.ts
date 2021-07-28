import type { NextApiRequest, NextApiResponse } from "next";

/**
 *
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return res.json(req.body);

    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
