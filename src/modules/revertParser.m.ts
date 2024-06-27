import { ethers } from "ethers";
import { logCustomErrorMsg, logErrorMsg } from "../utils/log";
import { isRevert, decodeRevert, IS_CUSTOM_REVERT, decodeCustomRevert } from "../utils/eip838";
import { readJSONFilesInFolder } from "./abiReader";

export const getRevertData = async (
  txHash: string,
  provider: ethers.providers.JsonRpcProvider
) => {
  const tx = await provider.getTransaction(txHash);
  if (tx == null) {
    return null;
  }
  const response = await provider.call(
    {
      to: tx.to,
      from: tx.from,
      nonce: tx.nonce,
      gasLimit: tx.gasLimit,
      gasPrice: tx.gasPrice,
      data: tx.data,
      value: tx.value,
      chainId: tx.chainId,
      type: tx.type ?? undefined,
      accessList: tx.accessList,
    },
    tx.blockNumber
  );

  return response;
};

export const decodeRevertData = (response: string, root: any[]) => {
  const abi = readJSONFilesInFolder(root,"error");

  let result;
  // CONTRACT ERROR
  if (isRevert(response)) {
    result = decodeRevert(response)[0];
    return logErrorMsg(response, result);
    
    // INTERNAL TRANSACTION ERROR
  } else if (IS_CUSTOM_REVERT(response, "0xea7e1b0b")) {
    const ix_error = decodeCustomRevert(response, abi);
    if (isRevert(ix_error.args[0])) {
      result = decodeRevert(ix_error.args[0])[0];
      return logErrorMsg(response, result, undefined,true);
    } else {
      result = decodeCustomRevert(ix_error.args[0], abi);
      return logCustomErrorMsg(
        response,
        result.signature,
        JSON.stringify(result.args),
        true
      );
    }
  } else {
    result = decodeCustomRevert(response, abi);
    return logCustomErrorMsg(
      response,
      result.signature,
      JSON.stringify(result.args)
    );
  }
};
