import { BigNumber, ethers } from "ethers";
import { defaultAbiCoder, getAddress, hexZeroPad, parseEther, zeroPad } from "ethers/lib/utils";
import { RetryableMessageParams } from "../src/type/systemType";

const decodeInboxMessageDeliveredData = (eventData: string) => {
  const parsed = defaultAbiCoder.decode(
    [
      'uint256', // dest
      'uint256', // l2 call balue
      'uint256', // msg val
      'uint256', // max submission
      'uint256', // excess fee refund addr
      'uint256', // call value refund addr
      'uint256', // max gas
      'uint256', // gas price bid
      'uint256', // data length
    ],
    eventData
  ) as BigNumber[]

  /**
   * abi.encodePacked(
                    uint256(uint160(to)),
                    l2CallValue,
                    amount,
                    maxSubmissionCost,
                    uint256(uint160(excessFeeRefundAddress)),
                    uint256(uint160(callValueRefundAddress)),
                    gasLimit,
                    maxFeePerGas,
                    data.length,
                    data
                ),
   */
  const destAddress = addressFromBigNumber(parsed[0])
  const l2CallValue = parsed[1]
  const l1Value = parsed[2]
  const maxSubmissionFee = parsed[3]
  const excessFeeRefundAddress = addressFromBigNumber(parsed[4])
  const callValueRefundAddress = addressFromBigNumber(parsed[5])
  const gasLimit = parsed[6]
  const maxFeePerGas = parsed[7]
  const callDataLength = parsed[8]
  const data =
    '0x' +
    eventData.substring(eventData.length - callDataLength.mul(2).toNumber())

  return {
    destAddress,
    l2CallValue,
    l1Value,
    maxSubmissionFee: maxSubmissionFee,
    excessFeeRefundAddress,
    callValueRefundAddress,
    gasLimit,
    maxFeePerGas,
    data,
  }
}

const addressFromBigNumber = (bn: BigNumber) =>
  getAddress(hexZeroPad(bn.toHexString(), 20))


const formatNumber = (value: BigNumber): Uint8Array => {
  return ethers.utils.stripZeros(value.toHexString())
}

async function main() {
  const l2ChainId = BigNumber.from(421614)
  const messageNumber = BigNumber.from(775143) // InboxMessageDelivered.messageNum
  const fromAddress: string = "0xA13c3e5f8F19571859F4Ab1003B960a5DF694C10"; // L2_msag.sender MessageDelivered.sender
  const l1BaseFee = BigNumber.from(73728714408) // MessageDelivered.baseFeeL1
  // InboxMessageDelivered.data
  const data = " ... "
  const messageData: RetryableMessageParams = decodeInboxMessageDeliveredData(data)

  const fields: any[] = [
    formatNumber(l2ChainId),
    zeroPad(formatNumber(messageNumber), 32),
    fromAddress,
    formatNumber(l1BaseFee),
    formatNumber(messageData.l1Value),
    formatNumber(messageData.maxFeePerGas),
    formatNumber(messageData.gasLimit),
    // when destAddress is 0x0, arbos treat that as nil
    messageData.destAddress === ethers.constants.AddressZero ? '0x' : messageData.destAddress,
    formatNumber(messageData.l2CallValue),
    messageData.callValueRefundAddress,
    formatNumber(messageData.maxSubmissionFee),
    messageData.excessFeeRefundAddress,
    messageData.data,
  ]

  // arbitrum submit retry transactions have type 0x69
  const rlpEnc = ethers.utils.hexConcat([
    '0x69',
    ethers.utils.RLP.encode(fields),
  ])

  console.log(ethers.utils.keccak256(rlpEnc));
}

(async () => {
  await main();
  process.exit(0);
})();
