import {
  BigNumberish,
  BytesLike,
  Overrides,
  Wallet,
  ethers,
} from "ethers";
import { BaseContract } from "../base.f";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/IOutbox.sol/IOutbox.json";
import { IL2ToL1Tx } from "../../type/contractType";
import { LogFinishTime } from "../_decorators/common";

export class Outbox_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "Outbox",
    _abi:any = abi // If need integrated ABI
  ) {
    super(provider, signer, _abi, bytecode, contractName, address);
  }

  @LogFinishTime
  async executeTransaction(
    proof: BytesLike[],
    L2ToL1Tx_Log:IL2ToL1Tx,
    overrides?: Overrides
  ) {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }

      const response = (await this.contract.executeTransaction(
        proof,
        L2ToL1Tx_Log.index,
        L2ToL1Tx_Log.l2Sender,
        L2ToL1Tx_Log.to,
        L2ToL1Tx_Log.l2Block,
        L2ToL1Tx_Log.l1Block,
        L2ToL1Tx_Log.l2Timestamp,
        L2ToL1Tx_Log.value,
        L2ToL1Tx_Log.data,
        { ...overrides } || undefined
      )) as ethers.providers.TransactionResponse;

      console.log(
        `${this.contractName}.executeTransaction transaction by hash ${response.hash}`
      );
      return await response.wait();
    } catch (error) {
      console.error(error);
    }
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
