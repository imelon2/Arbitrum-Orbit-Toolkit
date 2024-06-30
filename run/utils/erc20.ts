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
          argv[argv.layer + "url"],
          process.env.SIGNER_PK_KEY!
        );
        let address = argv.address === "0x" ? wallet.address : argv.address;
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
          require: true,
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
          argv[argv.layer + "url"],
          process.env.SIGNER_PK_KEY!
        );

        await approve(argv.spender, argv.amount, provider, wallet);
      },
    })
    .command({
      command: "transfer",
      describe: "",
      builder: {
        to: {
          string: true,
          describe: "",
          require: true,
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
          argv[argv.layer + "url"],
          process.env.SIGNER_PK_KEY!
        );

        await transfer(argv.to, argv.amount, provider, wallet);
      },
    });
};

const getBalance = async (
  address: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  try {
    /** Verify address & will return Error */
    address = getAddress(address);

    const { feeToken } = await readRollupCA(provider);
    const ERC20 = new Eth20_factory(provider, signer, "FeeToken", feeToken);
    const balance = await ERC20.balanceOf(address);
    const symbol = await ERC20.symbol();
    console.log(`${ethers.utils.formatEther(balance!)} ${symbol}`);
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
    /** Verify address & will return Error */
    spender = getAddress(spender);

    const approveAmountToL2 = parseEther(amount);
    const { feeToken } = await readRollupCA(provider);
    const ERC20 = new Eth20_factory(provider, signer, "FeeToken", feeToken);
    const receipt = await ERC20.approve(spender, approveAmountToL2);
    console.log(receipt);
  } catch (error) {
    console.error(error);
  }
};

const transfer = async (
  to: string,
  amount: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  try {
    /** Verify address & will return Error */
    to = getAddress(to);

    const transferAmount = parseEther(amount);
    const { feeToken } = await readRollupCA(provider);
    const ERC20 = new Eth20_factory(provider, signer, "FeeToken", feeToken);
    const receipt = await ERC20.transfer(to, transferAmount);
    console.log(receipt);
  } catch (error) {
    console.error(error);
  }
};
