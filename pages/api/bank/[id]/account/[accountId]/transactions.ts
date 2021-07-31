import type { NextApiRequest, NextApiResponse } from "next";
import { deleteBank, getBank, getBanks, updateBank } from "lib/db/bank";
import { getTransactionsOfAccount } from "lib/db/transaction";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { accountId } = req.query;

  switch (req.method) {
    case "GET":
      if (accountId === undefined) res.status(405).send(`accountId required`);

      const accountTransactions = await getTransactionsOfAccount(
        accountId as string,
        20,
        0
      );

      return res.json(accountTransactions);

    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
