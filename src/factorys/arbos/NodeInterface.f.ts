import { BigNumber, BigNumberish, Overrides, Wallet, ethers } from "ethers";
import { JsonRpcProvider, address } from "../../type";
import { BaseContract } from "../base.f";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/node-interface/NodeInterface.sol/NodeInterface.json";
import { NODE_INTERFACE_ADDRESS } from "../../config";
import { IRetryableTicket } from "../../type/contractType";

export class NodeInterface_factory extends BaseContract {
  constructor(
    provider: JsonRpcProvider,
    signer: Wallet,
    contractName: string = "NodeInterface"
  ) {
    super(
      provider,
      signer,
      abi,
      bytecode,
      contractName,
      NODE_INTERFACE_ADDRESS // NodeInterface address
    );
  }

  /**
   * @kind view
   */
  async gasEstimateComponents(destinationAddress: address, calldata: string) {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }

      const { gasEstimate, gasEstimateForL1, baseFee, l1BaseFeeEstimate } =
        await this.contract.callStatic.gasEstimateComponents(
          destinationAddress, // to
          false, // is creationTransaction??
          calldata,
          {
            blockTag: "latest",
          }
        );
      return {
        gasEstimate,
        gasEstimateForL1,
        baseFee,
        l1BaseFeeEstimate,
      };
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @kind view
   */
  async estimateRetryableTicket(retryableTicket: IRetryableTicket) {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      
      return await this.contract.estimateGas.estimateRetryableTicket(
        retryableTicket.from,
        retryableTicket.amount,
        retryableTicket.to,
        retryableTicket.l2CallValue,
        retryableTicket.excessFeeRefundAddress,
        retryableTicket.callValueRefundAddress,
        retryableTicket.data
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @kind view
   */
  async constructOutboxProof(
    size: BigNumberish, // l2Block.sendCount
    leaf: BigNumberish // event L2ToL1Tx.position @by ArbSys
  ): Promise<
    | {
        send: string;
        root: string;
        proof: string[];
      }
    | undefined // @todo Error return
  > {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }

      return await this.contract.callStatic.constructOutboxProof(size, leaf);
    } catch (error) {
      console.error(error);
    }
  }
}
