import { Wallet, ethers } from "ethers";
import { getAddress, parseEther } from "ethers/lib/utils";
import { Argv } from "yargs";
import { readRollupCA } from "../../src/config";
import { Eth20_factory } from "../../src/factorys/project/ERC20";
import { JsonRpcProvider } from "../../src/type";
import { initProvider } from "../common";

export const ERC20Command = (yargs: Argv) => {
  return yargs
    .command({
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
            argv[argv.layer+"url"],
          process.env.SIGNER_PK_KEY!
        );
        let address = argv.address === "0x" ? wallet.address : argv.address;

        /** Verify address & will return Error */
        address = getAddress(address);

        await getBalance(address, provider, wallet);
      },
    })
    .command({
      command: "approve",
      describe: "",
      builder: {
        spender: {
          string: true,
          describe: "",
          require:true
        },
        amount: {
          alias: ["a"],
          string: true,
          describe: "",
          default: "0",
        },
      },
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
            argv[argv.layer+"url"],
          process.env.SIGNER_PK_KEY!
        );
        /** Verify address & will return Error */
        let spender = getAddress(argv.spender);

        await approve(spender, argv.amount,provider, wallet);
      },
    });
};

const getBalance = async (
  address: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  try {
    const { feeToken } = await readRollupCA(provider);
    const ERC20 = new Eth20_factory(provider, signer, "FeeToken", feeToken);
    const balance = await ERC20.balanceOf(address);
    console.log(ethers.utils.formatEther(balance!));
  } catch (error) {
    console.error(error);
  }
};

const approve = async (
  spender: string,
  amount: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  try {
    const approveAmountToL2 = parseEther(amount);
    const { feeToken } = await readRollupCA(provider);
    const ERC20 = new Eth20_factory(provider, signer, "FeeToken", feeToken);
    const receipt = await ERC20.approve(spender, approveAmountToL2);
    console.log(receipt);
  } catch (error) {
    console.error(error);
  }
};
