import { init, ABI_NITRO_ABI_ROOT, ABI_BRIDGE_ABI_ROOT, ABI_ROOT } from "../src/config";
import { getRevertData, decodeRevertData } from "../src/modules/revertParser.m";
import { readJSONFilesInFolder } from "../src/modules/abiReader";
import { logSuccessMsg, logNullTxMsg, logErrorMsg } from "../src/utils/log";

/**
 * CLI ts-node debug/parseErrorMsg.ts
 */
async function main() {
  try {
    const {provider} = init("L1")
    
    const txHash = "0xde50445be66d92fa8c71f05119a7286bff8100cb374f2dc012145ac85451d09c";
    const receipt = await provider.getTransactionReceipt(txHash);

    if (receipt.status == 1) {
      console.log(receipt);
      return logSuccessMsg();
    } else if (receipt == null) {
      return logNullTxMsg();
    }

    const data = await getRevertData(txHash, provider);

    if (data == null) {
      return logNullTxMsg(txHash);
    }

    return decodeRevertData(data, [ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT]);
  } catch (error: any) {
    if (error.data == "0x") {
      const sysError = JSON.parse(error.error.body).error.message
      return logErrorMsg(error.reason, error.data,sysError,undefined);
    } else {
      throw error;
    }
  }
}

main();
