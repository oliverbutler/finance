import type { NextApiRequest, NextApiResponse } from "next";
import { deleteBank, getBank, getBanks, updateBank } from "lib/db/bank";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      const bank = await getBank(id as string);
      return res.json(bank);

    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
