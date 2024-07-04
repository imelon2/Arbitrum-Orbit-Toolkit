import { Argv } from "yargs";
import { initProvider, verifyContractAddress } from "../common";
import { Wallet } from "ethers";
import { ArbBlock, JsonRpcProvider } from "../../src/type";
import { L1GatewayRouter_factory } from "../../src/factorys/bridge/L1GatewayRouter.f";
import { getAddress, hexDataLength, parseEther } from "ethers/lib/utils";
import { percentIncrease } from "../../src/utils/math";
import {
  DEFAULT_GAS_PRICE_PERCENT_INCREASE,
  DEFAULT_SUBMISSION_FEE_PERCENT_INCREASE,
} from "../../src/config/constant";
import {
  ABI_BRIDGE_ABI_ROOT,
  ABI_NITRO_ABI_ROOT,
  readRollupCA,
} from "../../src/config";
import { InboxBase } from "../../src/factorys/rollup/InboxBase.f";
import { NodeInterface_factory } from "../../src/factorys/arbos/NodeInterface.f";
import { getOutboundTransferData } from "../../src/utils/bridger";
import { L2GatewayRouter_factory } from "../../src/factorys/bridge/L2GatewayRouter.f";
import { ArbSys_factory } from "../../src/factorys/arbos/AybSys.f";
import { RollupUserLogic_factory } from "../../src/factorys/rollup/RollupUserLogic.f";
import { arb_getBlockByHash } from "../../src/rpc/rpc";
import { IL2ToL1Tx } from "../../src/type/contractType";
import { decodeLogsEvent } from "../../src/modules/logEventParser.m";
import { Outbox_factory } from "../../src/factorys/rollup/OutBox.f";

export const ERC20BridgeCommand = (yargs: Argv) => {
  return yargs
    .options({
      erc20_ca: {
        default: "erc20",
        string: true,
      },
    })
    .command({
      command: "depositERC20",
      aliases:["d-erc20"],
      describe: "",
      builder: {
        amount: {
          alias: ["a"],
          string: true,
          describe: "Deposit erc20 amount in human-readable",
          default: "0",
        },
      },
      handler: async (argv: any) => {
        const { provider: providerl1, wallet: signerL1 } = initProvider(
          argv.l1url,
          process.env.SIGNER_PK_KEY!
        );

        const { provider: providerl2, wallet: signerL2 } = initProvider(
          argv.l2url,
          process.env.SIGNER_PK_KEY!
        );

        const l1TokenAddress = await verifyContractAddress(
          providerl1,
          argv.erc20_ca
        );

        await deposit(
          l1TokenAddress,
          signerL1.address, //@todo : deposit 수령인은 현재 당사자만 가능, 나중에 인자로 받는걸로
          argv.amount,
          providerl1,
          providerl2,
          signerL1,
          signerL2
        );
      },
    })
    .command({
      command: "withdraw",
      describe: "",
      builder: {
        amount: {
          alias: ["a"],
          string: true,
          describe: "",
          default: "0",
        },
      },
      handler: async (argv: any) => {
        const { provider: providerl1, wallet: signerL1 } = initProvider(
          argv.l1url,
          process.env.SIGNER_PK_KEY!
        );

        const { provider: providerl2, wallet: signerL2 } = initProvider(
          argv.l2url,
          process.env.SIGNER_PK_KEY!
        );

        const l1TokenAddress = await verifyContractAddress(
          providerl1,
          argv.erc20_ca
        );

        await withdraw(
          l1TokenAddress,
          signerL1.address, //@todo : deposit 수령인은 현재 당사자만 가능, 나중에 인자로 받는걸로
          argv.amount,
          providerl2,
          signerL2
        );
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

        const {proof,L2ToL1Tx_Log} = await getProof(
          argv.withdrawL2Hash,
          providerL1,
          providerL2,
          signerL1,
          signerL2
        );

        const result = await claimWithdraw(proof.proof,L2ToL1Tx_Log,providerL1,signerL1)
        console.log(result);
      },
    });
};

const deposit = async (
  l1TokenAddress: string,
  to: string,
  amount: string,
  providerL1: JsonRpcProvider,
  providerL2: JsonRpcProvider,
  signerL1: Wallet,
  signerL2: Wallet
) => {
  const { inbox, l1GatewayRouter } = await readRollupCA(providerL1);

  /** Verify address & will return Error */
  to = getAddress(to);
  const depositAmountToL2 = parseEther(amount);
  const L1ERC20Gateway = new L1GatewayRouter_factory(
    providerL1,
    signerL1,
    l1GatewayRouter
  );

  const retryTicket = await L1ERC20Gateway.getRetryTicketInnerData(
    l1TokenAddress,
    to
  );

  const Inbox = new InboxBase(providerL1, signerL1, inbox);
  const l1basefee = await providerL1.getGasPrice();
  let maxSubmissionFee = await Inbox.calculateRetryableSubmissionFee(
    hexDataLength(retryTicket!.data),
    l1basefee
  );

  /** maxSubmissionFee + (maxSubmissionFee * 300%) */
  maxSubmissionFee = percentIncrease(
    maxSubmissionFee,
    DEFAULT_SUBMISSION_FEE_PERCENT_INCREASE
  );

  /* max_fee_per_gas * (max_fee_per_gas + 500%) */
  let max_fee_per_gas = await providerL2.getGasPrice();
  max_fee_per_gas = percentIncrease(
    max_fee_per_gas,
    DEFAULT_GAS_PRICE_PERCENT_INCREASE
  );

  const NodeInterface = new NodeInterface_factory(providerL2, signerL2);
  const gasLimit = await NodeInterface.estimateRetryableTicket(retryTicket!);
  const value = gasLimit?.mul(max_fee_per_gas).add(maxSubmissionFee);

  const data = getOutboundTransferData(maxSubmissionFee);
  const receipt = await L1ERC20Gateway.outboundTransfer(
    l1TokenAddress,
    to,
    depositAmountToL2,
    gasLimit!,
    max_fee_per_gas,
    data,
    { value, gasLimit: 5000000 }
  );

  console.log(receipt);
};

const withdraw = async (
  l1TokenAddress: string,
  to: string,
  amount: string,
  providerL2: JsonRpcProvider,
  signerL2: Wallet
) => {
  const { l2GatewayRouter } = await readRollupCA(providerL2);

  /** Verify address & will return Error */
  to = getAddress(to);

  const withdrawAmountToL1 = parseEther(amount);

  const L1ERC20Gateway = new L2GatewayRouter_factory(
    providerL2,
    signerL2,
    l2GatewayRouter
  );

  const receipt = await L1ERC20Gateway.outboundTransfer(
    l1TokenAddress,
    to,
    withdrawAmountToL1,
    "0x"
  );

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
  proof:string[],
  L2ToL1Tx_Log:IL2ToL1Tx,
  providerL1: JsonRpcProvider,
  signerL1: Wallet
) => {
  const { outbox } = await readRollupCA(providerL1);
  const Outbox = new Outbox_factory(providerL1, signerL1, outbox);
  return await Outbox.executeTransaction(proof,L2ToL1Tx_Log,{gasLimit:5000000});
};
