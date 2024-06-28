import { BigNumber, ethers } from "ethers";
import { getAddress, parseEther, zeroPad } from "ethers/lib/utils";

const formatNumber = (numberVal: BigNumber): Uint8Array => {
  return ethers.utils.stripZeros(numberVal.toHexString());
};

// 2:00:22
// 2:01:15
/**
 * @abstract EthDepositMessage.calculateDepositTxId
 * ts-node test/calculateDepositTxId.test.ts 
 */
async function main() {
  // ORIGIN EthDepositMessage.calculateDepositTxId
  
  const l2ChainId: number = 412346;
  const messageNumber: BigNumber = BigNumber.from(19);
  const fromAddress: string = "0x2112150Ae8EC8843bdCa3C7DE86A291b43a80946"; // L2_msag.sender
  const toAddress: string = "0x1001150ae8ec8843bdca3c7de86a291b43a7f835"; // L1_msg.sender
  const value: BigNumber = parseEther("1");

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
