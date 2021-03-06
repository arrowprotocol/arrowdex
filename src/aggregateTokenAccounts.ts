import { PublicKey } from "@solana/web3.js";
import * as fs from "fs/promises";
import { groupBy, mapValues } from "lodash";

import arrows from "../data/arrows.json";

/**
 * Aggregates the token accounts associated with the arrows,
 * allowing for easier TVL computation.
 */
export const aggregateTokenAccounts = async (): Promise<void> => {
  const accounts = arrows
    .map((arrow) => ({
      mint: arrow.vendorMiner.mint,
      account: arrow.vendorMiner.minerVault,
    }))
    .filter((t) => t.mint !== PublicKey.default.toString());

  const groups = mapValues(
    groupBy(accounts, (tok) => tok.mint),
    (v) => v.map((e) => e.account)
  );
  await fs.mkdir("data/", { recursive: true });
  await fs.writeFile(
    "data/token-accounts.json",
    JSON.stringify(groups, null, 2)
  );
  console.log(
    `Filtered and wrote ${accounts.length} accounts across ${
      Object.keys(groups).length
    } tokens.`
  );
};

aggregateTokenAccounts().catch((err) => {
  console.error(err);
});
