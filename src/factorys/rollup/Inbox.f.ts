import { BigNumber, Overrides, Wallet, ethers } from "ethers";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/Inbox.sol/Inbox.json";
import { LogFinishTime } from "../_decorators/common";
import { InboxBase } from "./InboxBase.f";

export class Inbox_factory extends InboxBase {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "Inbox",
    _abi: any = abi // If need integrated ABI
  ) {
    super(provider, signer, address, contractName,_abi, bytecode);
  }

  @LogFinishTime
  async depositEth(amount: BigNumber, overrides?: Overrides) {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      console.log("Deposit amount : " + amount.toString());

      // /** @fixed Duplicate `depositEth` function name */
      const response = (await this.contract!["depositEth()"]({
        ...overrides,
        value: amount,
      })) as ethers.providers.TransactionResponse;

      console.log(
        `${this.contractName}.depositEth transaction by hash ${response.hash}`
      );
      return await response.wait();
    } catch (error) {
      console.error(error);
    }
  }
}
