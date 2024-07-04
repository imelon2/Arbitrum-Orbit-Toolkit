import { BigNumber, ethers, Overrides, Wallet } from "ethers";
import { BaseContract } from "../base.f";
import {
    abi,
    bytecode,
  } from "@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/arbitrum/gateway/L2GatewayRouter.sol/L2GatewayRouter.json";
import { LogFinishTime } from "../_decorators/common";
import { address } from "../../type";


export class L2GatewayRouter_factory extends BaseContract {
    constructor(
      provider: ethers.providers.JsonRpcProvider,
      signer: Wallet,
      address?: string,
      contractName: string = "L2GatewayRouter",
      _abi: any = abi // If need integrated ABI
    ) {
      super(provider, signer, _abi, bytecode, contractName, address);
    }

    @LogFinishTime
    async outboundTransfer(
      l1Token: address,
      to: address,
      amount: BigNumber,
      data: any,
      overrides?: Overrides // NO_VALUE
    ) {
      try {
        if (!this.contract)
          throw new Error(`no import ${this.contractName} contract`);
        console.log("Withdraw amount : " + amount.toString());
  
        const response = (await this.contract[
          "outboundTransfer(address,address,uint256,bytes)"
        ](l1Token, to, amount, data, {
          ...overrides
        })) as ethers.providers.TransactionResponse;
  
        console.log(
          `${this.contractName}.outboundTransfer transaction by hash ${response.hash}`
        );
  
        return await response.wait();
      } catch (error) {
        console.error(error);
      }
    }
}