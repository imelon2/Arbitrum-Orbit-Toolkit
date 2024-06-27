import { ethers, BigNumber, logger } from "ethers";
import { address } from "../type";

export const remove0x = (hexString: string): string => {
  return hexString.startsWith("0x") ? hexString.slice(2) : hexString;
};

export function etherToWei(ether: string): string {
  return bigIntToString(ethers.utils.parseEther(ether).toString());
}

export function bigIntToString(
  int: BigNumber | bigint | number | string
): string {
  return BigNumber.from(int).toString();
}
