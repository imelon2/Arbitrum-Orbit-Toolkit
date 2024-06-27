import { ethers } from "ethers";
import { AbiCoder, Result, keccak256, toUtf8Bytes } from "ethers/lib/utils";
type selector = string;
const abiCoder = new AbiCoder()

export const isRevert = (data: string): boolean => {
    return data.substring(0, 10) === "0x08c379a0" ? true : false;
}

export const decodeRevert = (errorData: string): Result => {
    return abiCoder.decode(["string"], "0x" + errorData.substring(10))
}

export const IS_CUSTOM_REVERT = (data:string, selector: string | selector) : boolean => {
    selector = selector.includes('0x') ? selector : keccak256(toUtf8Bytes(selector)).slice(0,10);
    return data.substring(0,10) === selector ? true : false;
}

export const decodeCustomParams = (errorData:string,abi:any) :Result => {
    const IContract = new ethers.utils.Interface(abi);
    return IContract.parseError(errorData).args
}

export const decodeCustomRevert = (errorData:string,abi:any) => {
    const IContract = new ethers.utils.Interface(abi);
    return IContract.parseError(errorData)
}