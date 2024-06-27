import fs from "fs";
import * as path from "path";
import { ethers } from "ethers";
import { PARSE_ROLLUP_INPUT, PARSE_ROLLUP_OUTPUT } from "../src/config";
import { processRawData, decompressAndDecode, getAllL2Msgs, decodeL2Msgs } from "../src/utils/brotli";



/**
 * ts-node debug/parseRollupData.ts
 */
async function main() {
  const root = path.join(PARSE_ROLLUP_INPUT);
  const seqData = fs.readFileSync(root, "utf8");
  let rawData = Uint8Array.from(Buffer.from(seqData, "hex"));
  const compressedData = processRawData(rawData);
  const result = decompressAndDecode(compressedData);

  const afterDelayedMessagesRead = 12;

  const l2Msgs = await getAllL2Msgs(result, afterDelayedMessagesRead);

  const txHash: ethers.Transaction[] = [];
  for (let i = 0; i < l2Msgs.length; i++) {
    txHash.push(...decodeL2Msgs(l2Msgs[i]));
  }

  console.log(
    `Get all ${txHash.length} l2 transaction and ${l2Msgs.length} blocks in this batch, writing tx to`
  );

  fs.writeFileSync(PARSE_ROLLUP_OUTPUT, JSON.stringify(txHash, null, 4));
}

main()