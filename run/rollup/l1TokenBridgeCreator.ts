import {abi} from "@arbitrum/token-bridge-contracts/build/contracts/contracts/tokenbridge/ethereum/L1AtomicTokenBridgeCreator.sol/L1AtomicTokenBridgeCreator.json"
import { Argv } from "yargs";
import { initProvider } from "../common";



export const L1TokenBridgeCreatorCommand = (yargs: Argv) => {
    return yargs
      .command({
        command: "getMinimumGasPrice",
        describe: "Get the L2 minimum gas price",
        handler: async (argv: any) => {
          const { provider,wallet } = initProvider(
            argv.l2url,
            process.env.SIGNER_PK_KEY!
          );
          
          console.log(wallet.address);
          
        },
      })
      .help();
  };

export const getL1DeploymentAddresses = () => {
    
}