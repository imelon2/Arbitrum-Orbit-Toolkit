import { BigNumberish, BytesLike } from "ethers";

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