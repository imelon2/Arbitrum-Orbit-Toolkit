import { Wallet, ethers } from "ethers";
import { BaseContract } from "../base";
import {abi,bytecode} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/Bridge.sol/Bridge.json"

export class Bridge_factory extends BaseContract {

    constructor(
        provider: ethers.providers.JsonRpcProvider,
        signer: Wallet,
        address?: string,
        contractName:string = "Bridge",
        _abi:any = abi // If need integrated ABI
    ) {
        super(
            provider,
            signer,
            _abi,
            bytecode,
            contractName,
            address
        )
    }
    
}