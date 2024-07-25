import { ethers } from "ethers";
import { init } from "../src/config";
import { NODE_INTERFACE_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants";
import { NodeInterface__factory} from "@arbitrum/sdk/dist/lib/abi/factories/NodeInterface__factory";


async function main() {
    const { provider, wallet } = init("L2");
    const a = (await provider.getNetwork()).chainId

    const nodeInferface = NodeInterface__factory.createInterface()
    
    console.log(nodeInferface.events);
    
}

(async () => {
    await main();
    process.exit(0);
  })();
