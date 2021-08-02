import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const CLIENT_ID = process.env.PLAID_CLIENT_ID;
const CLIENT_SECRET = process.env.PLAID_CLIENT_SECRET;

if (CLIENT_ID === undefined || CLIENT_SECRET === undefined) {
  console.log(
    "Please set PLAID_CLIENT_ID and PLAID_CLIENT_SECRET environment variables"
  );
  process.exit(1);
}

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": CLIENT_ID,
      "PLAID-SECRET": CLIENT_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const plaid = new PlaidApi(configuration);

export { plaid };
