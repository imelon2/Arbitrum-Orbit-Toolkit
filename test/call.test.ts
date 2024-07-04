
import { defaultAbiCoder } from "ethers/lib/utils";
import { init } from "../src/config";
import { ethers } from "ethers";

async function main() {
    const {provider,wallet} = init("L2")

    const tx :ethers.providers.TransactionRequest= {
        to:"0xA1e33965C46cD063CbfCBdC070400de22f5E61F8",
        data:"0x59659e90"
    }
    const res = await provider.call(tx)

    console.log(res);
    
}

(async () => {
    await main();
    process.exit(0);
  })();
