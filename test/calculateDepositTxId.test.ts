import { BigNumber, ethers } from "ethers";
import { getAddress, parseEther, zeroPad } from "ethers/lib/utils";

const formatNumber = (numberVal: BigNumber): Uint8Array => {
  return ethers.utils.stripZeros(numberVal.toHexString());
};

/**
 * @abstract EthDepositMessage.calculateDepositTxId
 * ts-node test/calculateDepositTxId.test.ts 
 */
async function main() {
  // ORIGIN EthDepositMessage.calculateDepositTxId
  
  const l2ChainId: number = 412346;
  const messageNumber: BigNumber = BigNumber.from(14);
  const fromAddress: string = "0xff851C151D5BCf4D6C6627F48FA642fd5Fa14400"; // L2_msag.sender
  const toAddress: string = "0xEE741c151d5bcf4D6C6627f48FA642Fd5fa132EF"; // L1_msg.sender
  const value: BigNumber = parseEther("0.01");

  const chainId = BigNumber.from(l2ChainId);
  
  const fields = [
    formatNumber(chainId),
    zeroPad(formatNumber(messageNumber), 32),
    getAddress(fromAddress),
    getAddress(toAddress),
    formatNumber(value),
  ];

  const rlpEnc = ethers.utils.hexConcat([
    "0x64",
    ethers.utils.RLP.encode(fields),
  ]);

  console.log("L2 Transaction Hash : " + ethers.utils.keccak256(rlpEnc));
}

(async () => {
  await main();
  process.exit(0);
})();
