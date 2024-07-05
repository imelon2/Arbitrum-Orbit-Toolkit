import { BigNumber, ethers } from "ethers";
import { readJSONFilesInFolder } from "./abiReader";
import { ansi } from "../utils/logStyle";

export const decodeLogsEvent = (logs: ethers.providers.Log[],root:any[]) => {
    try {
        const abi = readJSONFilesInFolder(root,"event")
        let iface = new ethers.utils.Interface(abi);
        return logs.map((log) => iface.parseLog(log));
    } catch (error) {
        console.error(error)
    }
}

export const decodeLogsEventConsole = (_logs: ethers.providers.Log[],root:any[]) => {
    const logs = decodeLogsEvent(_logs,root)

    if(!logs) {
        return console.log("No Logs");
    }
    logs.forEach((log,i) => {
        console.log(`${ansi.Magenta}############################ ${i} index logs message ############################${ansi.reset}`);
        let params:any = {}
        log.eventFragment.inputs.forEach((param,i) => {
            const arg = log.args[i];
            params[`${param.name}(${param.type})`] = BigNumber.isBigNumber(arg) ? BigNumber.from(arg).toString() : arg
        })
        const result = {
            name:log.name,
            signature : log.signature,
            topic:log.topic,
            params
        }
        console.log(result);
        console.log("\n\n");
    });
}