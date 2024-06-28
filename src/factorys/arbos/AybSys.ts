import { BigNumber, Overrides, Wallet, ethers } from "ethers";
import { JsonRpcProvider, address } from "../../type";
import { BaseContract } from "../base";
import {
  abi,
  bytecode,
} from "@arbitrum/nitro-contracts/build/contracts/src/precompiles/ArbSys.sol/ArbSys.json";
import { ARBOS_SYS_ADDRESS } from "../../config";
import { LogFinishTime } from "../_decorators/common";

export class ArbSys_factory extends BaseContract {
  constructor(
    provider: JsonRpcProvider,
    signer: Wallet,
    contractName: string = "ArbSys"
  ) {
    super(
      provider,
      signer,
      abi,
      bytecode,
      contractName,
      ARBOS_SYS_ADDRESS // ArbSys address
    );
  }

  @LogFinishTime
  async withdrawEth(
    destination: address,
    amount: BigNumber,
    overrides?: Overrides
  ) {
    try {
      if (!this.contract) {
        throw new Error(`No import ${this.contractName} contract`);
      }
      console.log("withdraw amount : " + amount.toString());

      const response = (await this.contract.withdrawEth(destination, {
        ...overrides,
        value: amount,
      })) as ethers.providers.TransactionResponse;

      console.log(
        `${this.contractName}.withdrawEth transaction by hash ${response.hash}`
      );
      return await response.wait();
    } catch (error) {
      console.error(error);
    }
  }
}
