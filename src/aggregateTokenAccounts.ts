import { PublicKey } from "@solana/web3.js";
import * as fs from "fs/promises";
import { groupBy } from "lodash";

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

  const groups = groupBy(accounts, (tok) => tok.mint);
  await fs.mkdir("data/", { recursive: true });
  await fs.writeFile("data/token-accounts.json", JSON.stringify(groups));
  console.log(
    `Filtered and wrote ${accounts.length} accounts across ${
      Object.keys(groups).length
    } tokens.`
  );
};

aggregateTokenAccounts().catch((err) => {
  console.error(err);
});
