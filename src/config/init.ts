import dotenv from "dotenv";
dotenv.config();
import { Wallet, ethers } from "ethers";

export type IChainName = "L1" | "L2" 


export const init = (chain:IChainName) => {
    const providers = {
        "L1": new ethers.providers.JsonRpcProvider(process.env.L1_URL),
        "L2":new ethers.providers.JsonRpcProvider(process.env.L2_URL),
    }

    const wallet = process.env.SIGNER_PK_KEY ? new Wallet(process.env.SIGNER_PK_KEY) : Wallet.createRandom()
    const wallets = {
        "L1": wallet.connect(providers["L1"]),
        "L2":  wallet.connect(providers["L2"])
    }

    return {
        provider : providers[chain],
        wallet : wallets[chain]
    }
}