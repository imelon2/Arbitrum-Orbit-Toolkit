import { Wallet, ethers } from "ethers";
import { BaseContract } from "../base.f";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/SequencerInbox.sol/SequencerInbox.json";

export class SequencerInbox_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "SequencerInbox_factory",
    _abi: any = abi // If need integrated ABI
  ) {
    super(provider, signer, _abi, bytecode, contractName, address);
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

  async bridge() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.bridge();
    } catch (error) {
      console.error(error);
    }
  }
}
