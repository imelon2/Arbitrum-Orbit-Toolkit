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
  
  const l2ChainId: number = 421614;
  const messageNumber: BigNumber = BigNumber.from(759118);
  const fromAddress: string = "0xE755352a429f3ff3D21128820DCbc53E063696c2"; // L2_msag.sender
  const toAddress: string = "0xd644352A429F3fF3d21128820DcBC53e063685b1"; // L1_msg.sender
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
