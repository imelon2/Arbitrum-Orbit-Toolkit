import fs from "fs";
import * as path from "path";
import { JsonRpcProvider } from "../type";

export const NODE_INTERFACE_ADDRESS = "0x00000000000000000000000000000000000000C8"
export const ARBOS_OWNER_ADDRESS = "0x0000000000000000000000000000000000000070"
export const ARBOS_OWNER_PUBLIC_ADDRESS = "0x000000000000000000000000000000000000006b"
export const ARBOS_GAS_INFO_ADDRESS = "0x000000000000000000000000000000000000006C"
export const ARBOS_SYS_ADDRESS = "0x0000000000000000000000000000000000000064"

const ROLLUP_CONTRACT_ADDRESS=path.join(__dirname,"../../rollup-contract-address.json");

export const readRollupCA = async (provider:JsonRpcProvider) => {
    const {chainId} = await provider.getNetwork()
    return JSON.parse(fs.readFileSync(ROLLUP_CONTRACT_ADDRESS, "utf8"))[chainId];
}