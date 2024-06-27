import { hideBin } from "yargs/helpers";
import Yargs from "yargs/yargs";
import dotenv from "dotenv";
import { L1TokenBridgeCreatorCommand } from "./l1TokenBridgeCreator";
import { ConfigCommand } from "./config";

dotenv.config();

async function main() {
  await Yargs(hideBin(process.argv))
    .options({
      l1url: { default: process.env.L1_URL },
      l2url: { default: process.env.L2_URL },
    })
    .command(
      "config",
      "Get network config data",
      ConfigCommand
    )
    .command(
      "l1TokenBridgeCreator",
      "Layer1 token bridge creator",
      L1TokenBridgeCreatorCommand
    )
    .help()
    .strict()
    .help().argv;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });