import { Button, Button_Type } from "components/Button/Button";
import React from "react";
import { useQuery } from "react-query";

interface Props {}
export const ConnectBankButton: React.FunctionComponent<Props> = (props) => {
  const { data: portalData } = useQuery(
    "portal",
    async () =>
      await fetch("http://localhost:4000/api/portal").then((res) => res.json())
  );

  return (
    <Button
      variant={Button_Type.Secondary}
      disabled={!portalData}
      link={portalData && { href: portalData.uri }}
    >
      Connect to TrueLayer
    </Button>
  );
};
