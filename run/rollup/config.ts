import { Argv } from "yargs";
import { initProvider } from "../common";
import { BigNumber, Wallet } from "ethers";
import { readRollupCA } from "../../src/config";
import { RollupUserLogic_factory } from "../../src/factorys/rollup/RollupUserLogic.f";
import { JsonRpcProvider } from "../../src/type";

export const RollupCommand = (yargs: Argv) => {
  return yargs
  .command({
    command: "getlatestConfirmedNodeNum",
    describe: "get Latest Confirm Node(RBlock)",
    handler: async (argv: any) => {
      const { provider, wallet } = initProvider(
        argv.l1url,
        process.env.SIGNER_PK_KEY!
      );
      const result = await latestConfirmed(provider, wallet);
      console.log(`get Latest Confirm Node(RBlock) : ${result?.toString()}`);
      
    },
  })
  .command({
    command: "getNode",
    describe: "get Node(RBlock) by number",
    builder: {
      number: {
        alias: ["num"],
        number: true,
        describe: "",
      },
    },
    handler: async (argv: any) => {
      const { provider, wallet } = initProvider(
        argv.l1url,
        process.env.SIGNER_PK_KEY!
      );
      const result = await getNode(argv.number,provider, wallet);
      console.log(result);
      
      
    },
  });
};

const latestConfirmed = async (
  providerL1: JsonRpcProvider,
  signerL1: Wallet
) => {
  try {
    const { rollup } = await readRollupCA(providerL1);
    const Rollup = new RollupUserLogic_factory(providerL1, signerL1, rollup);
    return await Rollup.latestConfirmed();
  } catch (error) {
    console.error(error);
  }
};

const getNode = async (
  number:number,
  providerL1: JsonRpcProvider,
  signerL1: Wallet
) => {
  try {
    const { rollup } = await readRollupCA(providerL1);
    const Rollup = new RollupUserLogic_factory(providerL1, signerL1, rollup);
    return await Rollup.getNode(BigNumber.from(number));
  } catch (error) {
    console.error(error);
  }
};
