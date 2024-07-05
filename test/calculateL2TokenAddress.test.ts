import { init, readRollupCA } from "../src/config";
import { L2GatewayRouter_factory } from "../src/factorys/bridge/L2GatewayRouter.f";

/**
 * ts-node test/calculateL2TokenAddress.test.ts 
 */
async function main() {

    const {provider:providerL2,wallet:signerL2} = init("L2")
    const { l2GatewayRouter } = await readRollupCA(providerL2);

    const l1ERC20 = "0x211028B4A438a4fC8239D51955C6d531a3ffcE91"
    const L2ERC20Gateway = new L2GatewayRouter_factory(
        providerL2,
        signerL2,
        l2GatewayRouter
      );

      const L2_ERC20 = await L2ERC20Gateway.calculateL2TokenAddress(l1ERC20);

      console.log(L2_ERC20);
      
}


(async () => {
    await main();
    process.exit(0);
  })();
  