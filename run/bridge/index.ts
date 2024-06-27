import { hideBin } from "yargs/helpers";
import Yargs from "yargs/yargs";
import dotenv from "dotenv";
import { NativeBridgeCommand } from "./native-bridge";

dotenv.config();

async function main() {
  await Yargs(hideBin(process.argv))
    .options({
      l1url: { default: process.env.L1_URL },
      l2url: { default: process.env.L2_URL },
    })
    .command(
      "native-bridge",
      "Deposit & Withdraw native coin",
      NativeBridgeCommand
    )
    .strict()
    .help()  // 사용자에게 도움말을 자동으로 제공
    .alias('help', 'h')  // 도움말 옵션의 별칭 설정
    .argv
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });