import { BigNumber, Overrides, Wallet, ethers } from "ethers";
import { BaseContract } from "../base";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/ERC20Inbox.sol/ERC20Inbox.json";

export class ERC20Inbox_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "ERC20Inbox"
  ) {
    super(provider, signer, abi, bytecode, contractName, address);
  }

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
        `${this.contractName}.${this.depositERC20.name} transaction by hash ${response.hash}`
      );
      return await response.wait();
    } catch (error) {
      console.error(error);
    }
  }
}
