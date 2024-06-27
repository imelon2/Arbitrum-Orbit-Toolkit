import { BigNumber, ethers } from "ethers";
import { Block } from '@ethersproject/providers';

export type JsonRpcProvider = ethers.providers.JsonRpcProvider
export type address = string;


export interface ArbBlockProps {
    /**
     * The merkle root of the withdrawals tree
     */
    sendRoot: string
  
    /**
     * Cumulative number of withdrawals since genesis
     */
    sendCount: BigNumber
  
    /**
     * The l1 block number as seen from within this l2 block
     */
    l1BlockNumber: number
  }
  
  export type ArbBlock = ArbBlockProps & Block