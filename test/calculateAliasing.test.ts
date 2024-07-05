import { getAddress } from "ethers/lib/utils";
import { ADDRESS_ALIAS_OFFSET } from "../src/config/constant";

function main() {
    const address = "0x902b3E5f8F19571859F4AB1003B960a5dF693aFF"
    const a = BigInt(address) + BigInt(ADDRESS_ALIAS_OFFSET)

    const b = BigInt.asUintN(160,a)
    console.log(getAddress(b.toString(16)));
    
}

(async () => {
    await main();
    process.exit(0);
  })();
  