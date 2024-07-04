import { init } from "../src/config";
import {abi, bytecode} from "../artifacts/DkargoToken.sol/DkargoToken.json"
import { BigNumber, ethers } from "ethers";
/**
 * ts-node test/deployL1Erc20.test.ts 
 */
async function main() {
    const { provider:l1Provider, wallet:l1Wallet } = init("L1");
    

    console.log('Deploying the test DappToken to L1:')

    const L1DappToken = new ethers.ContractFactory(abi,bytecode,l1Wallet)

    const supply = BigNumber.from(5000000000).mul(BigNumber.from(10).pow(18));

    const l1DappToken = await L1DappToken.deploy("dKargo","DKA",supply,{gasLimit:3000000})
    const recepit = await l1DappToken.deployed()

    console.log(recepit);
    
    console.log(`DappToken is deployed to L1 at ${l1DappToken.address}`)
}

(async() => {
    await main()
    process.exit(0)
})()