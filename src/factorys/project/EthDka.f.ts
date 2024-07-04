import { Wallet, ethers } from "ethers";
import { BaseContract } from "../base.f";
import {abi,bytecode} from "../../../build/contracts/contracts/L1DKA.sol/DkargoToken.json"

export class EthDka_factory extends BaseContract {

    constructor(
        provider: ethers.providers.JsonRpcProvider,
        signer: Wallet,
        contractName:string = "EthDka",
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