import { hideBin } from "yargs/helpers";
import Yargs from "yargs/yargs";
import dotenv from "dotenv";
import { initProvider } from "../common";
import { logErrorMsg, logNullReceiptCalldataMsg, logNullTxMsg, logSuccessMsg } from "../../src/utils/log";
import { ABI_NITRO_ABI_ROOT, ABI_BRIDGE_ABI_ROOT, ABI_ROOT } from "../../src/config";
import { decodeCalldata } from "../../src/modules/calldata.m";
import { decodeLogsEvent, decodeLogsEventConsole } from "../../src/modules/logEventParser.m";
import { decodeRevertData, getRevertData } from "../../src/modules/revertParser.m";

dotenv.config();

async function main() {
  await Yargs(hideBin(process.argv))
    .options({
      layer:{choices:["l1", "l2", "l3"],default:"l1"},
      l1url: { default: process.env.L1_URL },
      l2url: { default: process.env.L2_URL },
      l3url: { default: process.env.L3_URL },
    })
    .command({
      command: "parseCalldata",
      describe: "",
      builder: {
        txHash: {
          string: true,
          describe: "",
        },
      },
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
            argv[argv.layer+"url"],
          process.env.SIGNER_PK_KEY!
        );
        const receipt = await provider.getTransaction(argv.txHash)

        if(!receipt) {
          return logNullTxMsg(argv.txHash)
        } 

        const calldata = receipt.data

        if(calldata == "") {
            return logNullReceiptCalldataMsg()
        }
        
        const result = await decodeCalldata(calldata,[ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT])
        console.log(result);
        
      },
    })
    .command({
      command: "parseLogEvent",
      describe: "",
      builder: {
        txHash: {
          string: true,
          describe: "",
        },
      },
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
            argv[argv.layer+"url"],
          process.env.SIGNER_PK_KEY!
        );
        const receipt = await provider.getTransactionReceipt(argv.txHash)

        if(!receipt) {
          return logNullTxMsg(argv.txHash)
        } 
        
        decodeLogsEventConsole(receipt.logs,[ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT])
      },
    })
    .command({
      command: "parseRevert",
      describe: "",
      builder: {
        txHash: {
          string: true,
          describe: "",
        },
      },
      handler: async (argv: any) => {
        try {
          const { provider, wallet } = initProvider(
              argv[argv.layer+"url"],
            process.env.SIGNER_PK_KEY!
          );
          
          const receipt = await provider.getTransactionReceipt(argv.txHash)
  
          if (receipt.status == 1) {
            // console.log(receipt);
            return logSuccessMsg();
          } else if (receipt == null) {
            return logNullTxMsg();
          }
      
          const data = await getRevertData(argv.txHash, provider);
      
          if (data == null) {
            return logNullTxMsg(argv.txHash);
          }
          
          decodeRevertData(data,[ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT])
        } catch (error:any) {
          if (error.data == "0x") {
            const sysError = JSON.parse(error.error.body).error.message
            return logErrorMsg(error.reason, error.data,sysError,undefined);
          } else {
            throw error;
          }
        }
      },
    })
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
