import { BigNumber, Overrides, Wallet, ethers } from "ethers";
import { BaseContract } from "../base";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/rollup/RollupUserLogic.sol/RollupUserLogic.json";

export class RollupUserLogic_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "RollupUserLogic"
  ) {
    super(provider, signer, abi, bytecode, contractName, address);
  }

  /**
   * @kind view
   */
  async latestConfirmed():Promise<BigNumber|undefined> {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.latestConfirmed();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @kind view
   */
  async getNode(nodeNum: BigNumber) {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.getNode(nodeNum);
    } catch (error) {
      console.error(error);
    }
  }

  async getLatestConfirmedNodeState(
    latestConfirmedNodeNum: any,
    createdAtBlock: any
  ) {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);

      // EventFetcher.getEvents
      const eventFilter = this.contract.filters["NodeCreated"]([latestConfirmedNodeNum]);
      const fillter = {
        fromBlock: createdAtBlock.toNumber(),
        toBlock: createdAtBlock.toNumber(),
        ...eventFilter,
      };
      const logs = await this.provider.getLogs(fillter);
      const pLog = this.parseLogs(logs);

      const afterState = {
        blockHash: pLog[0].args.assertion.afterState.globalState.bytes32Vals[0],
        sendRoot: pLog[0].args.assertion.afterState.globalState.bytes32Vals[1],
      };

      return afterState;
    } catch (error) {
      console.error(error)
    }
  }
}
