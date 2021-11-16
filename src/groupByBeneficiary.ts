import * as fs from "fs/promises";
import { groupBy, mapValues } from "lodash";

import arrows from "../data/arrows.json";

/**
 * Groups arrows by beneficiary.
 */
export const groupByBeneficiary = async (): Promise<void> => {
  const accounts = arrows.map((arrow) => ({
    beneficiary: arrow.beneficiary,
    mint: arrow.mint,
  }));

  const groups = mapValues(
    groupBy(accounts, (tok) => tok.beneficiary),
    (v) => v.map((e) => e.beneficiary)
  );
  await fs.mkdir("data/", { recursive: true });
  await fs.writeFile("data/arrows-by-beneficiary.json", JSON.stringify(groups));
  console.log(
    `Filtered and wrote ${accounts.length} accounts across ${
      Object.keys(groups).length
    } tokens.`
  );
};

groupByBeneficiary().catch((err) => {
  console.error(err);
});
