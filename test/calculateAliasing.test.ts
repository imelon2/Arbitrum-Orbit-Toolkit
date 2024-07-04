import { getAddress } from "ethers/lib/utils";
import { ADDRESS_ALIAS_OFFSET } from "../src/config/constant";

function main() {
    const address = "0x71B61c2E250AFa05dFc36304D6c91501bE0965D8"
    const a = BigInt(address) - BigInt(ADDRESS_ALIAS_OFFSET)

    const b = BigInt.asUintN(160,a)
    console.log(getAddress(b.toString(16)));
    
}

(async () => {
    await main();
    process.exit(0);
  })();
  