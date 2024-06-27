import { abi as ArbOwnerABI } from "@arbitrum/nitro-contracts/build/contracts/src/precompiles/ArbOwner.sol/ArbOwner.json";
import { Contract, Wallet, ethers, providers } from "ethers";
import { Provider } from "@ethersproject/providers";
import { Argv } from "yargs";
import { initProvider } from "../common";
import { ARBOS_OWNER_ADDRESS } from "../../src/config";
import { ansi } from "../../src/utils/logStyle";

export const ArbOwnerCommand = (yargs: Argv) => {
  return yargs
    .command({
      command: "getAllChainOwners",
      describe: "Get All Chain Owners retrieves the list of chain owners",
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
          argv.l2url,
          process.env.SIGNER_PK_KEY!
        );
        await getAllChainOwners(wallet, provider);
      },
    })
    .command({
      command: "setMinimumL2BaseFee",
      describe: "Sets the L2 minimum base fee ",
      builder: {
        priceInWei: {
          string: true,
          describe: "new L2 minimum base fee (wei)",
          default: "0",
        },
      },
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
          argv.l2url,
          process.env.SIGNER_PK_KEY!
        );
        await setMinimumL2BaseFee(wallet, provider, {
          priceInWei: argv.priceInWei,
        });
      },
    });
};

export const getAllChainOwners = async (
  wallet: Wallet,
  baseL2Provider: Provider
) => {
  const ArbOwner = new Contract(
    ARBOS_OWNER_ADDRESS,
    ArbOwnerABI,
    baseL2Provider
  );

  const chainOwners = (await ArbOwner.connect(
    wallet
  ).callStatic.getAllChainOwners()) as [];

  // result
  console.log("getAllChainOwners : " + chainOwners);
};

export const setMinimumL2BaseFee = async (
  wallet: Wallet,
  baseL2Provider: Provider,
  params: {
    priceInWei: string;
  }
) => {
  const ArbOwner = new Contract(
    ARBOS_OWNER_ADDRESS,
    ArbOwnerABI,
    baseL2Provider
  );

  if (params.priceInWei === "0") {
    console.error("L2 MinBaseFee can not set 0");
    return;
  }

  console.log("New L2 Min Base Fee : " + params.priceInWei);
  console.log("\n\n\n");

  const response = await ArbOwner.connect(wallet).setMinimumL2BaseFee(
    params.priceInWei
  );
  console.log(
    `${ansi.BrightMagenta} ===================== Transaction Response =====================${ansi.reset}`
  );
  console.log(response);
  console.log("\n\n\n");

  console.log(
    `${ansi.BrightMagenta} ===================== Transaction Receipt =====================${ansi.reset}`
  );
  const receipt = await response.wait();
  console.log(receipt);
};
