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
        const calldata = "0x2e567b3600000000000000000000000052419051b1406766871d00561df6055b7fb11c04000000000000000000000000d644352a429f3ff3d21128820dcbc53e063685b1000000000000000000000000d644352a429f3ff3d21128820dcbc53e063685b10000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000000"
        const result = await decodeCalldata(calldata,[ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT])
        // const result = await decodeCalldata(calldata,[ABI_BRIDGE_ABI_ROOT_Test])

        console.log(result);
    } catch (error) {
        throw error
    }
}

main()