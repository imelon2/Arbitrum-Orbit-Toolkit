import { ethers } from "ethers";
import { init } from "../src/config";

async function main() {
    const { provider, wallet } = init("L2");
    const a = (await provider.getNetwork()).chainId

    console.log(a);
    
    
}

(async () => {
    await main();
    process.exit(0);
  })();
