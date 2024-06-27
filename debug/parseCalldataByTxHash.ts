import { init, ABI_NITRO_ABI_ROOT, ABI_BRIDGE_ABI_ROOT, ABI_ROOT } from "../src/config"
import { decodeCalldata } from "../src/modules/calldata.m"
import { logNullReceiptCalldataMsg } from "../src/utils/log"


/**
 * CLI ts-node debug/parseCalldataByTxHash.ts 
 */
async function main() {
    try {
        const {provider} = init("L1")
        const txHash = "0x614dcf759bb60d57b76ef4b765c6c5695d4213c5b6697755f02671cb628104a4"
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

main()