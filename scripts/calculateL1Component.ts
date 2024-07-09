
import { init, readRollupCA } from "../src/config";
import { NodeInterface_factory } from "../src/factorys/arbos/NodeInterface.f";

async function main() {
    const {provider,wallet} = init("L2")
    const NodeInterface = new NodeInterface_factory(provider, wallet);

    const {gasEstimateForL1,baseFee,l1BaseFeeEstimate} = (await NodeInterface.gasEstimateL1Component(
        "0xB31EbC1bAA9d165E5fbdF55DDfF60AC0a68f3362",
        "0x"
    ))!
    
    // baseFee (P) : L2 Gas Price
    // L1 estimated calldata price per byte (L1P) : l1BaseFeeEstimate * 16
    // L1 Calldata size in bytes (L1S) : gasEstimateForL1 * baseFee / l1BaseFeeEstimate * 16
    console.log({gasEstimateForL1:gasEstimateForL1.toString(),baseFee:baseFee.toString(),l1BaseFeeEstimate:l1BaseFeeEstimate.toString()});
    
}

(async () => {
    await main();
    process.exit(0);
  })();
