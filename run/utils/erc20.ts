import { Wallet, ethers } from "ethers";
import { formatEther, getAddress, isAddress, parseEther } from "ethers/lib/utils";
import { Argv, alias } from "yargs";
import { readRollupCA } from "../../src/config";
import { Eth20_factory } from "../../src/factorys/project/ERC20.f";
import { JsonRpcProvider } from "../../src/type";
import { initProvider, verifyContractAddress } from "../common";

export const ERC20Command = (yargs: Argv) => {
  return yargs
    .options({
      contractAddress: {
        default: "erc20",
        alias: ["ca"],
        string: true,
      },
    })
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

        const contractAddress = await verifyContractAddress(
          provider,
          argv.contractAddress
        );
        await getBalance(address, provider, wallet, contractAddress);
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
        const contractAddress = await verifyContractAddress(
          provider,
          argv.contractAddress
        );
        await approve(
          argv.spender,
          argv.amount,
          provider,
          wallet,
          contractAddress
        );
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
        const contractAddress = await verifyContractAddress(
          provider,
          argv.contractAddress
        );
        await transfer(argv.to, argv.amount, provider, wallet, contractAddress);
      },
    })
    .command({
      command: "metadata",
      describe: "get Total Supply, Name, Symbol",
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
          argv[argv.layer + "url"],
          process.env.SIGNER_PK_KEY!
        );
        const contractAddress = await verifyContractAddress(
          provider,
          argv.contractAddress
        );
        const result = await metadata(provider, wallet, contractAddress);
        console.log(result);
        
      },
    });
};

const getBalance = async (
  address: string,
  provider: JsonRpcProvider,
  signer: Wallet,
  contractAddress: string
) => {
  try {
    /** Verify address & will return Error */
    address = getAddress(address);

    const ERC20 = new Eth20_factory(provider, signer, "ERC20", contractAddress);
    const balance = await ERC20.balanceOf(address);
    const symbol = await ERC20.symbol();

    console.log(
      `address : ${address} \nbalance : ${ethers.utils.formatEther(
        balance!
      )} ${symbol}`
    );
  } catch (error) {
    // console.error(error);
  }
};

const approve = async (
  spender: string,
  amount: string,
  provider: JsonRpcProvider,
  signer: Wallet,
  contractAddress: string
) => {
  try {
    /** Verify address & will return Error */
    spender = getAddress(spender);

    const approveAmountToL2 = parseEther(amount);
    const ERC20 = new Eth20_factory(provider, signer, "ERC20", contractAddress);
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
  signer: Wallet,
  contractAddress: string
) => {
  try {
    /** Verify address & will return Error */
    to = getAddress(to);

    const transferAmount = parseEther(amount);
    const ERC20 = new Eth20_factory(
      provider,
      signer,
      "FeeToken",
      contractAddress
    );
    const receipt = await ERC20.transfer(to, transferAmount);
    console.log(receipt);
  } catch (error) {
    // console.error(error);
  }
};

const metadata = async (
  provider: JsonRpcProvider,
  signer: Wallet,
  contractAddress: string
) => {
  const ERC20 = new Eth20_factory(provider, signer, "ERC20", contractAddress);
  const data = await Promise.all([ERC20.totalSupply(), ERC20.name(),ERC20.symbol()]);

  return {
    totalSupply:formatEther(data[0].toString()).toString(),
    name:data[1],
    symbol:data[2]
  }
};
