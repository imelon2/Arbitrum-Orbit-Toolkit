import { abi as ArbGasInfoABI } from "@arbitrum/nitro-contracts/build/contracts/src/precompiles/ArbGasInfo.sol/ArbGasInfo.json";
import { Contract, Wallet, ethers } from "ethers";
import { Argv } from "yargs";
import { Provider } from "@ethersproject/providers";
import { initProvider } from "../common";
import { ARBOS_GAS_INFO_ADDRESS } from "../../src/config";


export const ArbGasInfoCommand = (yargs: Argv) => {
  return yargs
    .command({
      command: "getMinimumGasPrice",
      describe: "Get the L2 minimum gas price",
      handler: async (argv: any) => {
        const { provider } = initProvider(
          argv.l2url,
          process.env.SIGNER_PK_KEY!
        );
        await getMinimumGasPrice(provider);
      },
    })
    .help();
};

const getMinimumGasPrice = async (baseL2Provider: Provider) => {
  const ArbGasInfo = new Contract(
    ARBOS_GAS_INFO_ADDRESS,
    ArbGasInfoABI,
    baseL2Provider
  );

  const minbasefee = await ArbGasInfo.getMinimumGasPrice();
  
  console.log(minbasefee + " wei");
};