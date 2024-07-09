import { Wallet, ethers } from "ethers";
import { BaseContract } from "../base.f";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/IBridge.sol/IBridge.json";

export class BridgeBase_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "BridgeBase",
    _abi: any = abi,
    _bytecode: any = bytecode,
  ) {
    super(provider, signer, _abi, _bytecode, contractName, address);
  }

  async rollup() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.rollup();
    } catch (error) {
      console.error(error);
    }
  }

  async sequencerInbox() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.sequencerInbox();
    } catch (error) {
      console.error(error);
    }
  }
}
