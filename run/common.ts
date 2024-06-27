import { Wallet, ethers } from "ethers";

export const initProvider = (url: string, pk: string) => {
    const provider = new ethers.providers.JsonRpcProvider(url);
    const wallet = new Wallet(pk, provider);
    return { provider, wallet };
  };
