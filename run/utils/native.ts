import { Wallet, ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { Argv } from "yargs";
import { JsonRpcProvider } from "../../src/type";
import { initProvider } from "../common";

export const NativeCommand = (yargs: Argv) => {
  return yargs.command({
    command: "getBalance",
    describe: "",
    builder: {
      address: {
        alias: ["addr"],
        string: true,
        describe: "",
        default: "0x",
      },
    },
    handler: async (argv: any) => {
      const { provider, wallet } = initProvider(
        argv[argv.layer + "url"],
        process.env.SIGNER_PK_KEY!
      );
      let address = argv.address === "0x" ? wallet.address : argv.address;

      /** Verify address & will return Error */
      address = getAddress(address);

      await getBalance(address, provider, wallet);
    },
  });
};

const getBalance = async (
  address: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  try {
    const balance = await provider.getBalance(address);
    console.log(ethers.utils.formatEther(balance!));
  } catch (error) {
    console.error(error);
  }
};
