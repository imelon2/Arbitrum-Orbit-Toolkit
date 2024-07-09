import { Argv } from "yargs";
import { initProvider, rollupLayer } from "../common";
import { BigNumber, Wallet } from "ethers";
import { readRollupCA } from "../../src/config";
import { RollupUserLogic_factory } from "../../src/factorys/rollup/RollupUserLogic.f";
import { JsonRpcProvider } from "../../src/type";

export const RollupCommand = (yargs: Argv) => {
  return yargs
    .options({
      layer:rollupLayer,
      l1url: { default: process.env.L1_URL },
      l2url: { default: process.env.L2_URL },
    })
    .command({
      command: "getlatestConfirmedNodeNum",
      describe: "get Latest Confirm Node(RBlock)",
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
          argv[argv.layer + "url"],
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
          argv[argv.layer + "url"],
          process.env.SIGNER_PK_KEY!
        );
        const result = await getNode(argv.number, provider, wallet);
        console.log(result);
      },
    })
    .command({
      command: "getSystemContracts",
      describe: "",
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
          argv[argv.layer + "url"],
          process.env.SIGNER_PK_KEY!
        );
        const result = await getSystemContracts(provider, wallet);
        console.log(result);
      },
    });
};

const getSystemContracts = async (
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  const { rollup } = await readRollupCA(provider);
  const Rollup = new RollupUserLogic_factory(provider, signer, rollup);
  const systemContracts = await Promise.all([
    Rollup.inbox(),
    Rollup.outbox(),
    Rollup.bridge(),
    Rollup.sequencerInbox(),
    Rollup.challengeManager(),
    Rollup.rollupEventInbox(),
    Rollup.validatorUtils(),
    Rollup.validatorWalletCreator(),
  ]);

  return {
    inbox:systemContracts[0],
    outbox:systemContracts[1],
    bridge:systemContracts[2],
    sequencerInbox:systemContracts[3],
    challengeManager:systemContracts[4],
    rollupEventInbox:systemContracts[5],
    validatorUtils:systemContracts[6],
    validatorWalletCreator:systemContracts[7],
  }
};

const latestConfirmed = async (provider: JsonRpcProvider, signer: Wallet) => {
  try {
    const { rollup } = await readRollupCA(provider);
    const Rollup = new RollupUserLogic_factory(provider, signer, rollup);
    return await Rollup.latestConfirmed();
  } catch (error) {
    console.error(error);
  }
};

const getNode = async (
  number: number,
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
