import { BigNumber, BigNumberish, BytesLike } from "ethers";

export type IL2ToL1Tx = {
    index: BigNumberish;
    l2Sender: string;
    to: string;
    l2Block: BigNumberish;
    l1Block: BigNumberish;
    l2Timestamp: BigNumberish;
    value: BigNumberish;
    data: BytesLike;
  };

  export type IRetryableTicket = {
    from:string, // sender
    to:string,
    l2CallValue:BigNumber,
    maxSubmissionCost:BigNumber,
    excessFeeRefundAddress:string,
    callValueRefundAddress:string,
    gasLimit:BigNumber,
    maxFeePerGas:BigNumber,
    amount:BigNumber, // deposit
    data:string
  }