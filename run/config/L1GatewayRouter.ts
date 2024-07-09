import { Wallet } from "ethers";
import { Argv } from "yargs";
import { readRollupCA } from "../../src/config";
import { JsonRpcProvider } from "../../src/type";
import { rollupLayer, initProvider } from "../common";
import { L1GatewayRouter_factory } from "../../src/factorys";

export const L1GatewayRouterCommand = (yargs: Argv) => {
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
  const { l1GatewayRouter } = await readRollupCA(provider);
  const L1GatewayRouter = new L1GatewayRouter_factory(provider, signer, l1GatewayRouter);
  const systemContracts = await Promise.all([
    L1GatewayRouter.inbox(),
    L1GatewayRouter.defaultGateway(),
  ]);

  return {
    inbox: systemContracts[0],
    defaultGateway: systemContracts[1],
  };
};
