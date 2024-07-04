import { hideBin } from "yargs/helpers";
import Yargs from "yargs/yargs";
import dotenv from "dotenv";
import { initProvider, initWsProvider } from "../common";
import { JsonRpcProvider } from "../../src/type";
import { Wallet } from "ethers";
import { ABI_BRIDGE_ABI_ROOT, ABI_NITRO_ABI_ROOT, ABI_ROOT, readRollupCA } from "../../src/config";
import { readJSONFilesInFolder } from "../../src/modules/abiReader";
import { BaseContract } from "../../src/factorys/base.f";

dotenv.config();

async function main() {
  await Yargs(hideBin(process.argv))
    .options({
      layer:{choices:["l1", "l2", "l3"]},
      l1url: { default: process.env.L1_WS_URL },
      l2url: { default: process.env.L2_WS_URL },
    })
    .command({
      command: "contracts",
      describe: "",
      builder: {
        name: {
          string: true,
          describe: "",
          require: true,
        },
      },
      handler: async (argv: any) => {
        const { provider, wallet } = initWsProvider(
          argv[argv.layer + "url"],
          process.env.SIGNER_PK_KEY!
        );

        await monitoring(argv.name, provider, wallet);
      },
    })
    .help()
    .strict()
    .help().argv;
}

const monitoring = async (
  name: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  try {
    const ca = await readRollupCA(provider);
    const abi = readJSONFilesInFolder([ABI_NITRO_ABI_ROOT,ABI_BRIDGE_ABI_ROOT,ABI_ROOT],"event")
    const contract = new BaseContract(provider, signer, abi,"",name, ca[name]);

    contract.moniter();
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(() => "")
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
