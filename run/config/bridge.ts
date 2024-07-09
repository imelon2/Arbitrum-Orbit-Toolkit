import { Wallet } from "ethers";
import { Argv } from "yargs";
import { readRollupCA } from "../../src/config";
import { BridgeBase_factory } from "../../src/factorys";
import { JsonRpcProvider } from "../../src/type";
import { rollupLayer, initProvider } from "../common";

export const BridgeCommand = (yargs: Argv) => {
  return yargs
    .options({
      layer: rollupLayer,
      l1url: { default: process.env.L1_URL },
      l2url: { default: process.env.L2_URL },
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
  const { bridge } = await readRollupCA(provider);
  const Bridge = new BridgeBase_factory(provider, signer, bridge);
  const systemContracts = await Promise.all([
    Bridge.rollup(),
    Bridge.sequencerInbox(),
  ]);

  return {
    rollup: systemContracts[0],
    sequencerInbox: systemContracts[1],
  };
};
