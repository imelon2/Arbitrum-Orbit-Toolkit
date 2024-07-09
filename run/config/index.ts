import { hideBin } from "yargs/helpers";
import Yargs from "yargs/yargs";
import dotenv from "dotenv";
import { L1TokenBridgeCreatorCommand } from "./l1TokenBridgeCreator";
import { layer } from "../common";
import { RollupCommand } from "./\brollup";

dotenv.config();

async function main() {
  await Yargs(hideBin(process.argv))
    .command(
      "rollup",
      "Get network config data",
      RollupCommand
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