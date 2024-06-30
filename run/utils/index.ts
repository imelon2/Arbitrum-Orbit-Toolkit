import { hideBin } from "yargs/helpers";
import Yargs from "yargs/yargs";
import dotenv from "dotenv";
import { ERC20Command } from "./erc20";
import { NativeCommand } from "./native";
import { layer } from "../common";

dotenv.config();

async function main() {
  await Yargs(hideBin(process.argv))
    .options({
      layer,
      l1url: { default: process.env.L1_URL },
      l2url: { default: process.env.L2_URL },
      l3url: { default: process.env.L3_URL },
    })
    .command("erc20", "Call about ERC-20 utils", ERC20Command)
    .command("native", "Call about Native utils", NativeCommand)
    .strict()
    .help() // 사용자에게 도움말을 자동으로 제공
    .alias("help", "h").argv; // 도움말 옵션의 별칭 설정
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
