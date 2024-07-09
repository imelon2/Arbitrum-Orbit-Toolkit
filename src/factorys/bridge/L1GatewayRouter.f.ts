import { BigNumber, PayableOverrides, Wallet, ethers } from "ethers";
import { BaseContract } from "../base.f";
import {
  abi,
  bytecode,
} from "@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/gateway/L1GatewayRouter.sol/L1GatewayRouter.json";
import { abi as InboxABI } from "@arbitrum/nitro-contracts/build/contracts/src/bridge/Inbox.sol/Inbox.json";
import { LogFinishTime } from "../_decorators/common";
import { address } from "../../type";
import { getOutboundTransferData } from "../../utils/bridger";
import { IRetryableTicket } from "../../type/contractType";

export class L1GatewayRouter_factory extends BaseContract {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    address?: string,
    contractName: string = "L1GatewayRouter",
    _abi: any = abi // If need integrated ABI
  ) {
    super(provider, signer, _abi, bytecode, contractName, address);
  }

  @LogFinishTime
  async outboundTransfer(
    l1Token: address,
    to: address,
    amount: BigNumber,
    _maxGas: BigNumber, // RetryTicket`s maxGasLimit
    _gasPriceBid: BigNumber, // RetryTicket`s maxGasPrice
    data: any, // RetryTicket`s maxSubmissionCost encode by [maxSubmissionCost(uint256),0x(bytes)]
    overrides?: PayableOverrides
  ) {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      console.log("Deposit amount : " + amount.toString());

      const response = (await this.contract[
        "outboundTransfer(address,address,uint256,uint256,uint256,bytes)"
      ](l1Token, to, amount, _maxGas, _gasPriceBid, data, {
        ...overrides,
      })) as ethers.providers.TransactionResponse;

      console.log(
        `${this.contractName}.outboundTransfer transaction by hash ${response.hash}`
      );

      return await response.wait();
    } catch (error) {
      console.error(error);
    }
  }

  async getRetryTicketInnerData(
    l1TokenAddress: address,
    to: address,
    isFeeToken: boolean
  ): Promise<IRetryableTicket | undefined> {
    try {
      /**
       * @https://github.com/OffchainLabs/nitro-contracts/blob/90037b996509312ef1addb3f9352457b8a99d6a6/src/bridge/AbsInbox.sol#L282
       * This Zombie Data for surface `revert RetryableData` from `Inbox._unsafeCreateRetryableTicket()`
       */
      const _zombieAmount = BigNumber.from(1);
      const _zombieMaxGas = BigNumber.from(1);
      const _zombieGasPriceBid = BigNumber.from(1);

      /** if Orbit use FeeToken, L2Fee insert `OutboundTransfer` data */
      const _zombieData = isFeeToken
        ? getOutboundTransferData({
            maxSubmissionCost: BigNumber.from(0),
            gasLimit: BigNumber.from(1),
            maxFeePerGas: BigNumber.from(1),
          })
        : getOutboundTransferData(BigNumber.from(1));
      const _zombieValue = BigNumber.from(2);

      const calldata = this.encodeFunctionData("outboundTransfer", [
        l1TokenAddress,
        to,
        _zombieAmount,
        _zombieMaxGas,
        _zombieGasPriceBid,
        _zombieData,
      ]);

      const res = await this.getReturnData({
        to: this.address,
        data: calldata,
        value: isFeeToken ? BigNumber.from(0) :_zombieValue,
        from: this.signer.address,
      });

      const retryable = this.parseRevert(res!, InboxABI);

      return {
        from: retryable.args.from,
        to: retryable.args.to,
        l2CallValue: retryable.args.l2CallValue,
        amount: retryable.args.deposit,
        maxSubmissionCost: retryable.args.maxSubmissionCost,
        excessFeeRefundAddress: retryable.args.excessFeeRefundAddress,
        callValueRefundAddress: retryable.args.callValueRefundAddress,
        gasLimit: retryable.args.gasLimit,
        maxFeePerGas: retryable.args.maxFeePerGas,
        data: retryable.args.data,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async inbox() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.inbox();
    } catch (error) {
      console.error(error);
    }
  }

  async defaultGateway() {
    try {
      if (!this.contract)
        throw new Error(`no import ${this.contractName} contract`);
      return await this.contract.defaultGateway();
    } catch (error) {
      console.error(error);
    }
  }
}
