import { Arrow, ARROW_ADDRESSES, parseArrow } from "@arrowprotocol/arrow";
import { SignerWallet, SolanaProvider } from "@saberhq/solana-contrib";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import * as fs from "fs/promises";

export const fetchAllArrows = async (): Promise<void> => {
  const provider = SolanaProvider.load({
    connection: new Connection("https://gokal.rpcpool.com"),
    // connection: new Connection("https://api.devnet.solana.com"),
    wallet: new SignerWallet(Keypair.generate()),
  });

  const programAccounts = await provider.connection.getProgramAccounts(
    ARROW_ADDRESSES.ArrowSunny
  );

  const arrow = Arrow.init(provider);
  const arrowsRaw = programAccounts.filter(
    (a) =>
      a.account.data.byteLength === arrow.programs.ArrowSunny.account.arrow.size
  );

  const arrows = arrowsRaw.map((arrowRaw) =>
    parseArrow({ accountId: arrowRaw.pubkey, accountInfo: arrowRaw.account })
  );

  await fs.mkdir("data/", { recursive: true });
  await fs.writeFile(
    "data/arrows.json",
    JSON.stringify(
      arrows,
      (_, v: unknown) => {
        if (v instanceof PublicKey) {
          return v.toString();
        }
        return v;
      },
      2
    )
  );
  console.log(`Discovered and wrote ${arrows.length} arrows.`);
};

fetchAllArrows().catch((err) => {
  console.error(err);
});
