import { BigNumber } from "ethers";
import { init, readRollupCA } from "../src/config";
import { NodeInterface_factory } from "../src/factorys/arbos/NodeInterface";
import { RollupUserLogic_factory } from "../src/factorys/rollup/RollupUserLogic";
import { arb_getBlockByHash } from "../src/rpc/rpc";
import { ArbBlock } from "../src/type";
import { ArbSys_factory } from "../src/factorys/arbos/AybSys";
import { Outbox_factory } from "../src/factorys/rollup/OutBox";
import { IL2ToL1Tx } from "../src/type/contractType";

async function main() {
    const {provider,wallet} = init("L1")
    const {provider : providerL2,wallet:walletL2} = init("L2")
    const {rollup,outbox} = await readRollupCA(provider)
    const Rollup = new RollupUserLogic_factory(provider,wallet,rollup)
    const Outbox = new Outbox_factory(provider,wallet,outbox)
    const NodeInterface = new NodeInterface_factory(providerL2,walletL2)
    const ArbSys = new ArbSys_factory(providerL2,walletL2)

    
    const withdrawHash = "0xf0bed4ef3410046dc870ac56d713b18a02ec3e8ce78b36e020d09c7a976223bd"

    // (1) get Latest Confirm Node(=RBlock)
    const latestConfirmedNodeNum = await Rollup.latestConfirmed()

    // return;
    // (2) get Latest Confirm Node Created At Block L1
    const {createdAtBlock} = await Rollup.getNode(latestConfirmedNodeNum!)

    // (3) latest Confirmed Node의 마지막 L2 Blockhash
    const state = await Rollup.getLatestConfirmedNodeState(latestConfirmedNodeNum,createdAtBlock)
    if (!state) throw new Error("error from getLatestConfirmedNodeState");
    const {blockHash,sendRoot} = state;

    // return;
    //(4)
    // -> providerL2.getBlock(blockHash)
    const l2Block = await arb_getBlockByHash(providerL2.connection.url,[blockHash,false]) as ArbBlock


    // (5) get L2ToL1Tx
    const recepit = await providerL2.getTransactionReceipt(withdrawHash)
    const parseLogs = ArbSys.parseLogs(recepit.logs)
    const _L2ToL1Tx_Log = parseLogs.filter(log => log.name === "L2ToL1Tx")
    
    const L2ToL1Tx_Log:IL2ToL1Tx = {
        index : _L2ToL1Tx_Log[0].args.position, // position == index
        l2Sender : _L2ToL1Tx_Log[0].args.caller,
        to : _L2ToL1Tx_Log[0].args.destination,
        l2Block : _L2ToL1Tx_Log[0].args.arbBlockNum,
        l1Block : _L2ToL1Tx_Log[0].args.ethBlockNum,
        l2Timestamp : _L2ToL1Tx_Log[0].args.timestamp,
        value : _L2ToL1Tx_Log[0].args.callvalue,
        data : _L2ToL1Tx_Log[0].args.data,
      }
    
    // return;
    
    // (6)
    const outboxProofParams = await NodeInterface.constructOutboxProof(
        l2Block.sendCount,
        L2ToL1Tx_Log.index
    )
    
    console.log(outboxProofParams);
    
    // return;

    const result = await Outbox.executeTransaction(
        outboxProofParams!.proof,
        L2ToL1Tx_Log,
        {gasLimit:5000000}
    )


    console.log(result);
    
}

(async () => {
    await main();
    process.exit(0);
  })();
