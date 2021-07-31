import { createBank, initializeBankAccounts } from "lib/db/bank";
import { exchangeCode } from "lib/truelayer/data";
import moment from "moment";
import type { NextApiRequest, NextApiResponse } from "next";
import { Bank } from "types/global";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      if (req.body.code === undefined)
        return res.status(405).send("Missing code");

      const exchangeResult = await exchangeCode(req.body.code);
      if (exchangeResult instanceof Error)
        return res.status(400).send("Error Exchanging Code");

      const today = moment().toDate();

      const newBank: Omit<Bank, "_id"> = {
        name: "True Layer",
        accounts: [],
        trueLayer: {
          accessToken: exchangeResult.access_token,
          refreshToken: exchangeResult.refresh_token,
          scope: exchangeResult.scope.split(" "),
          expiresAt: moment().add(exchangeResult.expires_in, "s").toDate(),
          lastAccessAt: today,
        },
        createdAt: today,
        updatedAt: today,
      };

      const creationResult = await createBank(newBank);

      return res.json(creationResult);

    default:
      return res.status(405).json({
        message: "Method not allowed",
      });
  }
}
