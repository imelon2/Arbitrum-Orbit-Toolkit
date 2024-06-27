import { BigNumber, Overrides, Wallet, ethers } from "ethers";
import { BaseContract } from "../base";
import {
  abi,
  bytecode,
} from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { address } from "../../type";

export class Eth20_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    contractName: string = "ERC20",
    address?: string
  ) {
    super(provider, signer, abi, bytecode, contractName, address);
  }

  async balanceOf(userAddress: string): Promise<BigNumber | undefined> {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      return await this.contract.balanceOf(userAddress);
    } catch (error) {
      console.error(error);
    }
  }

  async totalSupply() {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      return await this.contract.totalSupply();
    } catch (error) {
      console.error(error);
    }
  }

  async allowance(owner: address, spender: address) {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      return await this.contract.allowance(owner, spender);
    } catch (error) {
      console.error(error);
    }
  }

  async approve(spender: address, amount: BigNumber, overrides?: Overrides) {
    if (!this.contract) {
      throw new Error(`No import ${this.contractName} contract`);
    }
    console.log("Approve amount : " + amount.toString());

    const response = (await this.contract.approve(
      spender,
      amount,
      { ...overrides } || undefined
    )) as ethers.providers.TransactionResponse;

    console.log(
      `${this.contractName}.${this.approve.name} transaction by hash ${response.hash}`
    );

    return await response.wait();
  }
}
