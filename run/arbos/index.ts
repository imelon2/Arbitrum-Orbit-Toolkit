import { hideBin } from "yargs/helpers";
import Yargs from "yargs/yargs";

import { ArbOwnerCommand } from "./ArbOwner";
import { ArbGasInfoCommand } from "./ArbGasInfo";

import dotenv from "dotenv";
dotenv.config();

async function main() {
  await Yargs(hideBin(process.argv))
    .options({
      l1url: { default: process.env.L1_URL },
      l2url: { default: process.env.L2_URL },
    })
    .command(
      "ArbOwner",
      "provides owners with tools for managing the rollup",
      ArbOwnerCommand
    )
    .command(
      "ArbGasInfo",
      "provides insight into the cost of using the chain",
      ArbGasInfoCommand
    )
    .strict()
    .help().argv;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });