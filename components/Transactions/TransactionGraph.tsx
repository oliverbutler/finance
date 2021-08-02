import React from "react";
import { Account, Bank, Transaction } from "types/global";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedAreaSeries,
  XYChart,
  Tooltip,
} from "@visx/xychart";
import moment from "moment";
import { useQuery } from "react-query";
import axios from "axios";

const mapTransactionsToSeries = (
  transactions: Transaction[],
  banks: Bank[]
): Record<string, { x: string; y: number }[]> => {
  const runningTotalMap: Record<string, Transaction[]> = {};

  transactions.forEach((t) => {
    if (runningTotalMap[t.accountId]) {
      runningTotalMap[t.accountId].push(t);
    } else {
      runningTotalMap[t.accountId] = [t];
    }
  });

  const seriesMap: Record<string, { x: string; y: number }[]> = {};

  Object.keys(runningTotalMap).map((accountId) => {
    const arr = runningTotalMap[accountId];

    let balance = 0;
    banks.forEach((bank) => {
      const account = bank.accounts.find((a) => a.trueLayerId === accountId);
      if (account !== undefined && account.balance)
        balance = account.balance.current;
    });

    const output: { x: string; y: number }[] = arr
      .map((t) => {
        const figure = {
          x: moment(t.timestamp).format("L"),
          y: balance,
        };

        balance -= t.amount;
        return figure;
      })
      .reverse();

    seriesMap[accountId] = output;
  });

  return seriesMap;
};

const accessors = {
  xAccessor: (d) => d.x,
  yAccessor: (d) => d.y,
};

export const TransactionGraph: React.FunctionComponent = () => {
  const { isLoading: isBanksLoading, data: banksData } = useQuery<Bank[]>(
    "banks",
    () => fetch("http://localhost:4000/api/banks").then((res) => res.json())
  );

  const { data, isLoading, error } = useQuery<Transaction[]>(
    "transactions",
    () =>
      axios
        .get(`http://localhost:4000/api/transactions?limit=20&offset=0`)
        .then((res) => res.data)
  );

  const seriesData =
    data && banksData ? mapTransactionsToSeries(data, banksData) : {};

  return (
    <XYChart height={300} xScale={{ type: "band" }} yScale={{ type: "linear" }}>
      <AnimatedAxis orientation="bottom" />
      <AnimatedAxis orientation="right" />
      <AnimatedGrid columns={false} numTicks={5} />
      {Object.keys(seriesData).map((accountId) => (
        <AnimatedAreaSeries
          key={accountId}
          dataKey={accountId}
          data={seriesData[accountId]}
          fill="rgba(99, 102, 241, 0.15)"
          lineProps={{
            stroke: "rgb(99, 102, 241)",
          }}
          {...accessors}
        />
      ))}
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        showHorizontalCrosshair
        renderTooltip={({ tooltipData, colorScale }) => (
          <div>
            <div style={{ color: colorScale(tooltipData.nearestDatum.key) }}>
              {tooltipData.nearestDatum.key}
            </div>
            {accessors.xAccessor(tooltipData.nearestDatum.datum)}
            {", "}£{accessors.yAccessor(tooltipData.nearestDatum.datum)}
          </div>
        )}
      />
    </XYChart>
  );
};
