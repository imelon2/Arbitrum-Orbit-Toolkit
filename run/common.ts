import { Wallet, ethers } from "ethers";

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

export const layer = {choices:["l1", "l2", "l3"],default:"l1"}