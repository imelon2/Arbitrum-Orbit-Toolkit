import { Wallet, ethers } from "ethers";
import { BaseContract } from "../base";
import {abi,bytecode} from "@arbitrum/nitro-contracts/build/contracts/src/bridge/Bridge.sol/Bridge.json"

export class Bridge_factory extends BaseContract {

    constructor(
        provider: ethers.providers.JsonRpcProvider,
        signer: Wallet,
        contractName:string = "Bridge",
        address?: string
    ) {
        super(
            provider,
            signer,
            abi,
            bytecode,
            contractName,
            address
        )
    }
    
}