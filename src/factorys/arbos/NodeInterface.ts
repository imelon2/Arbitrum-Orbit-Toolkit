import { BigNumber, BigNumberish, Overrides, Wallet, ethers } from "ethers";
import { JsonRpcProvider, address } from "../../type";
import { BaseContract } from "../base";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/node-interface/NodeInterface.sol/NodeInterface.json";
import { NODE_INTERFACE_ADDRESS } from "../../config";

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
  async constructOutboxProof(
    size: BigNumberish, // l2Block.sendCount
    leaf: BigNumberish, // event L2ToL1Tx.position @by ArbSys
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

      return await this.contract.callStatic.constructOutboxProof(size, leaf)
    } catch (error) {
      console.error(error);
    }
  }
}
