import dotenv from "dotenv";
dotenv.config();
import * as path from "path";

export const ABI_ROOT= path.join(__dirname, "../../artifacts");
export const ABI_NITRO_ABI_ROOT= path.join(__dirname, "../../node_modules/@arbitrum/nitro-contracts/build");
export const ABI_BRIDGE_ABI_ROOT= path.join(__dirname, "../../node_modules/@arbitrum/token-bridge-contracts/build/contracts/contracts");
export const ABI_BRIDGE_ABI_ROOT_Test= path.join(__dirname, "../../node_modules/@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum");


export const PARSE_ROLLUP_INPUT= path.join(__dirname, "../cache/calldata.txt");
export const PARSE_ROLLUP_OUTPUT= path.join(__dirname, "../cache/calldata.json");

export const Arb_Abi_Path = () => {
    return [ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT]
  }