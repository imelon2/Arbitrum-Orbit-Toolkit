import { init, ABI_NITRO_ABI_ROOT, ABI_BRIDGE_ABI_ROOT, ABI_ROOT, ABI_BRIDGE_ABI_ROOT_Test } from "../src/config"
import { decodeCalldata } from "../src/modules/calldata.m"
import { logNullReceiptCalldataMsg } from "../src/utils/log"


/**
 * CLI ts-node debug/parseCalldataByTxHash.ts 
 */
async function main() {
    try {
        // const {provider} = init("L1")
        // const txHash = "0x7a1a27267ba75ce46fb5ccf35249781854b9a4ec4339d2a241e240cc932b3762"
        // const receipt = await provider.getTransaction(txHash)
        // const calldata = receipt.data
        // if(calldata == "") {
        //     return logNullReceiptCalldataMsg()
        // }
        const calldata = "0xa9059cbb000000000000000000000000b31ebc1baa9d165e5fbdf55ddff60ac0a68f336200000000000000000000000000000000000000000000003635c9adc5dea00000"
        const result = await decodeCalldata(calldata,[ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT])
        // const result = await decodeCalldata(calldata,[ABI_BRIDGE_ABI_ROOT_Test])

        console.log(result);
    } catch (error) {
        throw error
    }
}

main()