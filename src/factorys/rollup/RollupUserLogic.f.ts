import { BigNumber, Wallet, ethers } from "ethers";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/rollup/RollupUserLogic.sol/RollupUserLogic.json";
import { Arb_ABI } from "../../modules/abiReader";
import { RollupCore_factory } from "./RollupCore.f";

export class RollupUserLogic_factory extends RollupCore_factory {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "RollupUserLogic",
    _abi: any = abi // If need integrated ABI
  ) {
    super(provider, signer, address, contractName, _abi, bytecode);
  }

  /**
   * @kind view
   */
  async latestConfirmed(): Promise<BigNumber | undefined> {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.latestConfirmed();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * @inner If Oribit Chain(L3), `createdAtBlock` will return L1 block number
   * https://github.com/OffchainLabs/nitro-contracts/blob/1cab72ff3dfcfe06ceed371a9db7a54a527e3bfb/src/rollup/RollupCore.sol#L293
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

  /**
   * @notice Returns the block in which the given node was created for looking up its creation event.
   * Unlike the Node's createdAtBlock field, this will be the ArbSys blockNumber if the host chain is an Arbitrum chain.
   * That means that the block number returned for this is usable for event queries.
   * This function will revert if the given node number does not exist.
   */
  async getNodeCreationBlockForLogLookup(nodeNum: BigNumber) {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.getNodeCreationBlockForLogLookup(nodeNum);
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
      const eventFilter = this.contract.filters["NodeCreated"](
        latestConfirmedNodeNum
      );

      const fillter = {
        fromBlock: createdAtBlock.toNumber(),
        toBlock: createdAtBlock.toNumber(),
        ...eventFilter,
      };
      const logs = await this.provider.getLogs(fillter);

      const arb_abi = Arb_ABI("event");
      const _interface = new ethers.utils.Interface(arb_abi);

      const pLog = logs.map((log) => {
        return _interface.parseLog(log);
      });

      const afterState = {
        blockHash: pLog[0].args.assertion.afterState.globalState.bytes32Vals[0],
        sendRoot: pLog[0].args.assertion.afterState.globalState.bytes32Vals[1],
      };

      return afterState;
    } catch (error) {
      console.error(error);
    }
  }
}
