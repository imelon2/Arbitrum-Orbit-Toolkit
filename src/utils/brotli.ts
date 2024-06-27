import { ethers } from "ethers";
import brotli from 'brotli';
import { Decoded, Input } from 'rlp';
import { rlp, bufArrToArr } from "ethereumjs-util";

/**
 * Reference : https://github.com/OffchainLabs/arbitrum-cli-tools/blob/main/packages/batch-tx-handler/src/l1-batch-handler/utils.ts
 */
export const MaxL2MessageSize = 256 * 1024;
export const BrotliMessageHeaderByte = 0;
export const DASMessageHeaderFlag = 0x80;

export const BatchSegmentKindL2Message = 0;
export const BatchSegmentKindL2MessageBrotli = 1;
export const BatchSegmentKindDelayedMessages = 2;

export const L1MessageType_submitRetryableTx = 9;
export const L1MessageType_ethDeposit = 12;
const L1MessageType_batchPostingReport = 13;
export const L2MessageKind_Batch = 3;
export const L2MessageKind_SignedTx = 4;
export const delayedMsgToBeAdded = 9;


export const decompressAndDecode = (compressedData: Uint8Array)=> {
    //decompress data
    const decompressedData = brotli.decompress(Buffer.from(compressedData));

    const hexData = ethers.utils.hexlify(decompressedData);

  
    //use rlp to decode stream type
    let res = rlp.decode(hexData, true) as Decoded;

    const l2Segments: Uint8Array[] = [];
    while (res.remainder !== undefined) {
      l2Segments.push(bufArrToArr(res.data as Buffer));
      res = rlp.decode(res.remainder, true) as Decoded;
    }
    return l2Segments;
  };

export const processRawData = (rawData: Uint8Array): Uint8Array => {
    // This is to make sure this message is Nitro Rollups type. (For example: Anytrust use 0x80 here)
    if (rawData[0] !== 0) {
      throw Error('Can only process brotli compressed data.');
    }
    //remove type tag of this message
    const compressedData = rawData.subarray(1);
  
    if (compressedData.length === 0) {
      throw new Error('Empty sequencer message');
    }
    return compressedData;
  };

  export const getAllL2Msgs = async (
    l2segments: Uint8Array[],
    afterDelayedMessagesRead: number,
  ): Promise<Uint8Array[]> => {
    const l2Msgs: Uint8Array[] = [];
    let currentDelayedMessageIndex = afterDelayedMessagesRead - 1;
    for (let i = l2segments.length - 1; i >= 0; i--) {
      const kind = l2segments[i][0];
      let segment = l2segments[i].subarray(1);
      /**
       * Here might contain Timestamp updates and l1 block updates message here, but it is useless
       * in finding tx hash here, so we just need to find tx related messages.
       */
      if (kind === BatchSegmentKindL2Message || kind === BatchSegmentKindL2MessageBrotli) {
        if (kind === BatchSegmentKindL2MessageBrotli) {
          segment = brotli.decompress(Buffer.from(segment));
        }
        l2Msgs.push(segment);
      }
      if (kind === BatchSegmentKindDelayedMessages) {
        //MessageDelivered
        // l2Msgs.push(await getDelayedTx(currentDelayedMessageIndex));
        l2Msgs.push();
        currentDelayedMessageIndex -= 1;
      }
    }
  
    if (l2Msgs.length > MaxL2MessageSize) {
      throw Error('Message too large');
    }
  
    return l2Msgs;
  };

  export const getNextSerializedTransactionSize = (remainData: Uint8Array, start: number): number => {
    //the size tag of each message here length 8 bytes
    const sizeBytes = remainData.subarray(start, start + 8);
    const size = ethers.BigNumber.from(sizeBytes).toNumber();
    if (size > MaxL2MessageSize) {
      throw new Error('size too large in getOneSerializedTransaction');
    }
    return size;
  };

  export const decodeL2Msgs = (l2Msgs: Uint8Array): ethers.Transaction[] => {
    const txHash: ethers.Transaction[] = [];
  
    const kind = l2Msgs[0];
    if (kind === L2MessageKind_SignedTx) {
      const serializedTransaction = l2Msgs.subarray(1); // remove kind tag
      // console.log(ethers.utils.parseTransaction(serializedTransaction));
      
      const tx = ethers.utils.parseTransaction(serializedTransaction);
      // const currentHash = tx.hash!; // calculate tx hash
      txHash.push(tx);
    } else if (kind === L2MessageKind_Batch) {
      const remainData: Uint8Array = l2Msgs.subarray(1);
      const lengthOfData = remainData.length;
      let current = 0;
      while (current < lengthOfData) {
        const nextSize = getNextSerializedTransactionSize(remainData, Number(current));
        current += 8; // the size of next data length value is 8 bytes, so we need to skip it
        const endOfNext = current + nextSize;
        // read next segment data which range from ${current} to ${endOfNext}
        const nextData = remainData.subarray(Number(current), Number(endOfNext));
        txHash.push(...decodeL2Msgs(nextData));
        current = endOfNext;
      }
    } else if (kind === delayedMsgToBeAdded) {
      const remainData: Uint8Array = l2Msgs.subarray(1);
      console.log(remainData);
      
      const currentHash = ethers.utils.hexlify(remainData);
      // txHash.push(currentHash);
    }
    return txHash;
  };
