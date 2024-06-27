import { BigNumber, ethers } from "ethers";
import { ABI_BRIDGE_ABI_ROOT, ABI_NITRO_ABI_ROOT, ABI_ROOT, init } from "../src/config";
import { readJSONFilesInFolder } from "../src/modules/abiReader";
import { ansi } from "../src/utils/logStyle";

/**
 * CLI ts-node debug/parseLogEvent.ts
 */
async function main() {
    try {
        const { provider, wallet } = init("L2");
        const txHash = "0xf0bed4ef3410046dc870ac56d713b18a02ec3e8ce78b36e020d09c7a976223bd";

        const recepit = await provider.getTransactionReceipt(txHash)
        
        const abi = readJSONFilesInFolder([ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT],"event")
        let iface = new ethers.utils.Interface(abi);

        recepit.logs.forEach((log,i) => {
            console.log(`${ansi.BrightMagenta}############################ ${i} index logs message ############################${ansi.reset}`);
            const parse = iface.parseLog(log)
            let params:any = {}
            parse.eventFragment.inputs.forEach((param,i) => {
                const arg = parse.args[i];
                params[`${param.name}(${param.type})`] = BigNumber.isBigNumber(arg) ? BigNumber.from(arg).toString() : arg
            })
            const result = {
                name:parse.name,
                signature : parse.signature,
                topic:parse.topic,
                params
            }
            console.log(result);
            console.log("\n\n");
        });

        
        
    } catch (error) {
        
        console.error(error)
    }
}

(async() => {
    await main()

    process.exit(0)
})()