import { Wallet, ethers } from "ethers";
import { BaseContract } from "../base.f";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/ERC20Bridge.sol/ERC20Bridge.json";

export class ERC20Bridge_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "ERC20Bridge",
    _abi: any = abi // If need integrated ABI
  ) {
    super(provider, signer, _abi, bytecode, contractName, address);
  }

  async nativeToken() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.nativeToken();
    } catch (error) {
        return null;
    }
  }
}
