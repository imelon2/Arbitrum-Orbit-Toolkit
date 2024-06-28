import { BigNumber, Overrides, Wallet, ethers } from "ethers";
import { BaseContract } from "../base";
import {
  abi,
  bytecode,
} from "@openzeppelin/contracts/build/contracts/ERC20.json";
import { address } from "../../type";
import { LogFinishTime } from "../_decorators/common";

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

  async symbol() {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      return await this.contract.symbol();
    } catch (error) {
      console.error(error);
    }
  }

  async name() {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      return await this.contract.name();
    } catch (error) {
      console.error(error);
    }
  }

  async decimals() {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      return await this.contract.decimals();
    } catch (error) {
      console.error(error);
    }
  }
  
  @LogFinishTime
  async transfer(to: address, value: BigNumber, overrides?: Overrides) {
    if (!this.contract) {
      throw new Error(`No import ${this.contractName} contract`);
    }
    const symbol = await this.symbol();
    console.log(`Transfer ${ethers.utils.formatEther(value)} ${symbol} to ${to}`);
    
    const response = (await this.contract.transfer(
      to,
      value,
      { ...overrides } || undefined
    )) as ethers.providers.TransactionResponse;

    console.log(
      `${this.contractName}.transfer transaction by hash ${response.hash}`
    );

    return await response.wait();
  }
  
  @LogFinishTime
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
      `${this.contractName}.approve transaction by hash ${response.hash}`
    );

    return await response.wait();
  }
}
