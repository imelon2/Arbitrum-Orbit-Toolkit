import { init, ABI_NITRO_ABI_ROOT, ABI_BRIDGE_ABI_ROOT, ABI_ROOT } from "../src/config"
import { decodeCalldata } from "../src/modules/calldata.m"
import { logNullReceiptCalldataMsg } from "../src/utils/log"


/**
 * CLI ts-node debug/parseCalldataByTxHash.ts 
 */
async function main() {
    try {
        const {provider} = init("L1")
        const txHash = "0xb150f320033dc52287774ed09bbb9e6db629771ef71969e43a0bc38fa84b599f"
        const receipt = await provider.getTransaction(txHash)
        const calldata = receipt.data
        if(calldata == "") {
            return logNullReceiptCalldataMsg()
        }
        // const calldata = "0x5eb405d540d997f91e75338348c62513c90387c74869334f6e5e389a4a9c5e33d05d34730000000000000000000000000000000000000000000000000000000000000000"
        const result = await decodeCalldata(calldata,[ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT])

        console.log(result);
        
    } catch (error) {
        throw error
    }
}
// b150f3
main()