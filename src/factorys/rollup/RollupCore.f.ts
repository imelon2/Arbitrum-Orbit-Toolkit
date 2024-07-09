import { BigNumber, Overrides, Wallet, ethers } from "ethers";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/rollup/RollupCore.sol/RollupCore.json";
import { BaseContract } from "../base.f";

export class RollupCore_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "RollupCore",
    _abi: any = abi,
    _bytecode: any = bytecode,
  ) {
    super(provider, signer,_abi, _bytecode,contractName,address);
  }


  async inbox() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.inbox();
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

  async outbox() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.outbox();
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

  async rollupEventInbox() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.rollupEventInbox();
    } catch (error) {
      console.error(error);
    }
  }

  async challengeManager() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.challengeManager();
    } catch (error) {
      console.error(error);
    }
  }

  async validatorUtils() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.validatorUtils();
    } catch (error) {
      console.error(error);
    }
  }

  async validatorWalletCreator() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.validatorWalletCreator();
    } catch (error) {
      console.error(error);
    }
  }

}
