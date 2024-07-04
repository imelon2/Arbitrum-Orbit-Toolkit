import { Argv, alias } from "yargs";
import { initProvider } from "../common";
import {
  ABI_BRIDGE_ABI_ROOT,
  ABI_NITRO_ABI_ROOT,
  readRollupCA,
} from "../../src/config";
import { Wallet } from "ethers";
import { ArbBlock, JsonRpcProvider } from "../../src/type";
import { BytesLike, getAddress, isAddress, parseEther } from "ethers/lib/utils";
import { ERC20Inbox_factory } from "../../src/factorys";
import { Inbox_factory } from "../../src/factorys/rollup/Inbox.f";
import { ArbSys_factory } from "../../src/factorys/arbos/AybSys.f";
import { RollupUserLogic_factory } from "../../src/factorys/rollup/RollupUserLogic.f";
import { arb_getBlockByHash } from "../../src/rpc/rpc";
import { NodeInterface_factory } from "../../src/factorys/arbos/NodeInterface.f";
import { Outbox_factory } from "../../src/factorys/rollup/OutBox.f";
import { IL2ToL1Tx } from "../../src/type/contractType";
import { decodeLogsEvent } from "../../src/modules/logEventParser.m";

export const NativeBridgeCommand = (yargs: Argv) => {
  return yargs
    .command({
      command: "depositOrbit",
      aliases: ["d-orbit"],
      describe: "",
      builder: {
        amount: {
          alias: ["a"],
          string: true,
          describe: "Deposit fee token(erc20) amount in human-readable",
          default: "0",
        },
      },
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
          argv.l1url,
          process.env.SIGNER_PK_KEY!
        );

        await depositERC20(argv.amount, provider, wallet);
      },
    })
    .command({
      command: "depositEth",
      aliases: ["d-eth"],
      describe: "",
      builder: {
        amount: {
          alias: ["a"],
          string: true,
          describe: "Deposit ether amount in human-readable",
          default: "0",
        },
      },
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
          argv.l1url,
          process.env.SIGNER_PK_KEY!
        );
        
        await depositEth(argv.amount, provider, wallet);
      },
    })
    .command({
      command: "withdraw",
      aliases: "w",
      describe: "",
      builder: {
        amount: {
          alias: ["a"],
          string: true,
          describe: "withdraw amount in human-readable",
          default: "0",
        },
        destination: {
          alias: ["d"],
          string: true,
          describe: "Withdraw amount recipient in address",
        },
      },
      handler: async (argv: any) => {
        const { provider, wallet } = initProvider(
          argv.l2url,
          process.env.SIGNER_PK_KEY!
        );

        if (!argv.destination) argv.destination = wallet.address;
        await withdrawEth(argv.destination, argv.amount, provider, wallet);
      },
    })
    .command({
      command: "getProof",
      describe: "",
      builder: {
        withdrawL2Hash: {
          alias: ["l2hash"],
          describe: "",
          string: true,
        },
      },
      handler: async (argv: any) => {
        const { provider: providerL1, wallet: signerL1 } = initProvider(
          argv.l1url,
          process.env.SIGNER_PK_KEY!
        );
        const { provider: providerL2, wallet: signerL2 } = initProvider(
          argv.l2url,
          process.env.SIGNER_PK_KEY!
        );

        const { proof } = await getProof(
          argv.withdrawL2Hash,
          providerL1,
          providerL2,
          signerL1,
          signerL2
        );
        console.log(proof);
      },
    })
    .command({
      command: "claimWithdraw",
      describe: "",
      builder: {
        withdrawL2Hash: {
          alias: ["l2hash"],
          describe: "",
          string: true,
        },
      },
      handler: async (argv: any) => {
        const { provider: providerL1, wallet: signerL1 } = initProvider(
          argv.l1url,
          process.env.SIGNER_PK_KEY!
        );
        const { provider: providerL2, wallet: signerL2 } = initProvider(
          argv.l2url,
          process.env.SIGNER_PK_KEY!
        );

        const { proof, L2ToL1Tx_Log } = await getProof(
          argv.withdrawL2Hash,
          providerL1,
          providerL2,
          signerL1,
          signerL2
        );

        const result = await claimWithdraw(
          proof.proof,
          L2ToL1Tx_Log,
          providerL1,
          signerL1
        );
        console.log(result);
      },
    });
};

/**
 * @param amount in human-readable
 */
const depositERC20 = async (
  amount: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  if (amount === "0") {
    console.error("Deposit amount can not set 0");
    return;
  }
  const depositAmountToL2 = parseEther(amount);
  const { inbox } = await readRollupCA(provider);
  const ERC20Inbox = new ERC20Inbox_factory(provider, signer, inbox);
  const receipt = await ERC20Inbox.depositERC20(depositAmountToL2);
  console.log(receipt);
};

/**
 * @param amount in human-readable
 */
const depositEth = async (
  amount: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  if (amount === "0") {
    console.error("Deposit amount can not set 0");
    return;
  }
  const depositAmountToL2 = parseEther(amount);
  const { inbox } = await readRollupCA(provider);

  const Inbox = new Inbox_factory(provider, signer, inbox);
  const receipt = await Inbox.depositEth(depositAmountToL2);
  console.log(receipt);
};

/**
 * @param amount in human-readable
 */
const withdrawEth = async (
  destination: string,
  amount: string,
  provider: JsonRpcProvider,
  signer: Wallet
) => {
  if (amount === "0") {
    console.error("Withdraw amount can not set 0");
    return;
  }
  /** Verify address & will return Error */
  destination = getAddress(destination);

  const withdrawAmountToL1 = parseEther(amount);
  const ArbSys = new ArbSys_factory(provider, signer);

  const receipt = await ArbSys.withdrawEth(destination, withdrawAmountToL1);
  console.log(receipt);
};

const getProof = async (
  withdrawL2Hash: string,
  providerL1: JsonRpcProvider,
  providerL2: JsonRpcProvider,
  signerL1: Wallet,
  signerL2: Wallet
) => {
  const { rollup } = await readRollupCA(providerL1);
  const Rollup = new RollupUserLogic_factory(providerL1, signerL1, rollup);
  const ArbSys = new ArbSys_factory(providerL2, signerL2);
  const NodeInterface = new NodeInterface_factory(providerL2, signerL2);

  // (1) get Latest Confirm Node(=RBlock)
  const latestConfirmedNodeNum = await Rollup.latestConfirmed();

  // (2) get Latest Confirm Node Created At Block L1
  const { createdAtBlock } = await Rollup.getNode(latestConfirmedNodeNum!);

  // (3) latest Confirmed Node의 마지막 L2 Blockhash
  const state = await Rollup.getLatestConfirmedNodeState(
    latestConfirmedNodeNum,
    createdAtBlock
  );
  if (!state) throw new Error("error from getLatestConfirmedNodeState");
  const { blockHash } = state;

  //(4) -> providerL2.getBlock(blockHash)
  const l2Block = (await arb_getBlockByHash(providerL2.connection.url, [
    blockHash,
    false,
  ])) as ArbBlock;

  // (5) get L2ToL1Tx data
  const recepit = await providerL2.getTransactionReceipt(withdrawL2Hash);
  const parseLogs = decodeLogsEvent(recepit.logs, [
    ABI_NITRO_ABI_ROOT,
    ABI_BRIDGE_ABI_ROOT,
  ]);

  const _L2ToL1Tx_Log = parseLogs!.filter((log) => log.name === "L2ToL1Tx");

  const L2ToL1Tx_Log: IL2ToL1Tx = {
    index: _L2ToL1Tx_Log[0].args.position, // position == index
    l2Sender: _L2ToL1Tx_Log[0].args.caller,
    to: _L2ToL1Tx_Log[0].args.destination,
    l2Block: _L2ToL1Tx_Log[0].args.arbBlockNum,
    l1Block: _L2ToL1Tx_Log[0].args.ethBlockNum,
    l2Timestamp: _L2ToL1Tx_Log[0].args.timestamp,
    value: _L2ToL1Tx_Log[0].args.callvalue,
    data: _L2ToL1Tx_Log[0].args.data,
  };

  // (6) get Proof
  const outboxProofParams = await NodeInterface.constructOutboxProof(
    l2Block.sendCount,
    L2ToL1Tx_Log.index
  );
  if (!outboxProofParams) throw new Error("undefined outboxProofParams");

  const proof = {
    send: outboxProofParams.send,
    root: outboxProofParams.root,
    proof: outboxProofParams.proof,
  };

  return { proof, L2ToL1Tx_Log };
};

const claimWithdraw = async (
  proof: string[],
  L2ToL1Tx_Log: IL2ToL1Tx,
  providerL1: JsonRpcProvider,
  signerL1: Wallet
) => {
  const { outbox } = await readRollupCA(providerL1);
  const Outbox = new Outbox_factory(providerL1, signerL1, outbox);
  return await Outbox.executeTransaction(proof, L2ToL1Tx_Log, {
    gasLimit: 5000000,
  });
};
