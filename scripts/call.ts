
import { defaultAbiCoder } from "ethers/lib/utils";
import { init } from "../src/config";
import { ethers } from "ethers";

async function main() {
    const {provider,wallet} = init("L2")

    const tx :ethers.providers.TransactionRequest= {
        to:"0x000000000000000000000000000000000000006b",
        data:"0xee95a824"
    }
    const res = await provider.call(tx)

    console.log(res);

    
}

(async () => {
    await main();
    process.exit(0);
  })();
