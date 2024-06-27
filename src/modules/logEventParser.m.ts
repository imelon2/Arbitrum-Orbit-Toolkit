import { BigNumber, ethers } from "ethers";
import { readJSONFilesInFolder } from "./abiReader";
import { ansi } from "../utils/logStyle";

export const decodeLogsEvent = (logs: ethers.providers.Log[],root:any[]) => {
    try {
        const abi = readJSONFilesInFolder(root,"event")
        let iface = new ethers.utils.Interface(abi);
    
        logs.forEach((log,i) => {
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