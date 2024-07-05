import { Wallet, ethers } from "ethers";
import { getAddress, parseEther } from "ethers/lib/utils";
import { Argv } from "yargs";
import { JsonRpcProvider } from "../../src/type";
import { initProvider } from "../common";

export const NativeCommand = (yargs: Argv) => {
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
    const balance = await provider.getBalance(address);
    console.log(
      `address : ${address} \nbalance : ${ethers.utils.formatEther(
        balance!
      )} ETH`
    );
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

    console.log(`Transfer ${amount} ETH to ${to}`);

    const response = await signer.sendTransaction({
      to,
      value: transferAmount,
      gasLimit:50000
    });
    const finishTime = new Date(); // 함수 실행 완료 시점의 현재 시간
    console.log(`transfer transaction by hash ${response.hash}`);
    
    const receipt = await response.wait();
    console.log(`[Log] transafer coin finished at ${finishTime.toLocaleString()}`);
    console.log(receipt);
  } catch (error) {
    console.error(error);
  }
};
