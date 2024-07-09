import { ethers, Wallet, BigNumber, Overrides } from "ethers";
import { BaseContract } from "../base.f";
import {
    abi,
    bytecode,
  } from "@arbitrum/nitro-contracts/build/contracts/src/bridge/IInboxBase.sol/IInboxBase.json";

export class InboxBase extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "InboxBase",
    _abi: any = abi,
    _bytecode: any = bytecode,
  ) {
    super(provider, signer, _abi, _bytecode, contractName, address);
  }

  async calculateRetryableSubmissionFee(
    dataLength: BigNumber| number,
    baseFee: BigNumber
  ) {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }

      /**
       * Get the L1 fee for submitting a retryable
       * `ERC20Inbox` will return `0`
       */
      return await this.contract.calculateRetryableSubmissionFee(
        dataLength,
        baseFee
      )
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
