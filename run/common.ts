import { Wallet, ethers } from "ethers";
import { JsonRpcProvider } from "../src/type";
import { isAddress } from "ethers/lib/utils";
import { readRollupCA } from "../src/config";

export const initProvider = (url: string, pk: string) => {
  const provider = new ethers.providers.JsonRpcProvider(url);
  const wallet = new Wallet(pk, provider);
  return { provider, wallet };
};

export const initWsProvider = (url: string, pk: string) => {
  const provider = new ethers.providers.WebSocketProvider(url);
  const wallet = new Wallet(pk, provider);
  return { provider, wallet };
};

export const verifyContractAddress = async (
  provider: JsonRpcProvider,
  _contractAddress: string
) => {
  if (isAddress(_contractAddress)) {
    return _contractAddress;
  } else {
    const ca = (await readRollupCA(provider))[_contractAddress];
    return ca ?  ca : new Error(`${_contractAddress} is undefined contract address`);
    
  }
};
export const layer = { choices: ["l1", "l2", "l3"], default: "l1" };
export const rollupLayer = { choices: ["l1", "l2"], default: "l1" };
