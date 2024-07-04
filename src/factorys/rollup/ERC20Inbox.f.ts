import { BigNumber, Overrides, Wallet, ethers } from "ethers";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/ERC20Inbox.sol/ERC20Inbox.json";
import { LogFinishTime } from "../_decorators/common";
import { InboxBase } from "./InboxBase.f";

export class ERC20Inbox_factory extends InboxBase {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "ERC20Inbox",
    _abi:any = abi // If need integrated ABI
  ) {
    super(provider, signer, _abi, bytecode, contractName, address);
  }

  @LogFinishTime
  async depositERC20(amount: BigNumber, overrides?: Overrides) {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      console.log("Deposit amount : " + amount.toString());

      const response = (await this.contract.depositERC20(
        amount,
        { ...overrides } || undefined
      )) as ethers.providers.TransactionResponse;

      console.log(
        `${this.contractName}.depositERC20 transaction by hash ${response.hash}`
      );
      return await response.wait();
    } catch (error) {
      console.error(error);
    }
  }
}
