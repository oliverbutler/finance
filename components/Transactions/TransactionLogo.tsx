import React, { useState } from "react";
import { useEffect } from "react";
import { Transaction } from "types/global";

interface Props {
  transaction: Transaction;
}
export const TransactionLogo: React.FunctionComponent<Props> = ({
  transaction,
}) => {
  const [icon, setIcon] = useState("");

  useEffect(() => {
    if (transaction.merchantName) {
      fetch(
        "https://autocomplete.clearbit.com/v1/companies/suggest?query=" +
          encodeURI(transaction.merchantName)
      )
        .then((res) => res.json())
        .then((data) => data[0] && setIcon(data[0].logo));
    }
  }, []);

  if (!icon) return <div style={{ width: 30, height: 30 }} />;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={icon} height={30} width={30} alt="Merchant Logo" />;
};
