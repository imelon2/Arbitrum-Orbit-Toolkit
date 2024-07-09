import { hideBin } from "yargs/helpers";
import Yargs from "yargs/yargs";
import dotenv from "dotenv";
import { L1TokenBridgeCreatorCommand } from "./l1TokenBridgeCreator";
import { RollupCommand } from "./rollup";
import { InboxCommand } from "./inbox";
import { BridgeCommand } from "./bridge";
import { OutboxCommand } from "./outbox";
import { SequencerInboxCommand } from "./sequencerInbox";
import { L1GatewayRouterCommand } from "./L1GatewayRouter";

dotenv.config();

async function main() {
  await Yargs(hideBin(process.argv))
    .command(
      "rollup",
      "Get network config data from rollup",
      RollupCommand
    )
    .command(
      "inbox",
      "Get network config data from inbox",
      InboxCommand
    )
    .command(
      "bridge",
      "Get network config data from bridge",
      BridgeCommand
    )
    .command(
      "outbox",
      "Get network config data from outbox",
      OutboxCommand
    )
    .command(
      "sequencerInbox",
      "Get network config data from sequencerInbox",
      SequencerInboxCommand
    )
    .command(
      "l1GatewayRouter",
      "Get network config data from 11GatewayRouter",
      L1GatewayRouterCommand
    )
    .command(
      "l1TokenBridgeCreator",
      "Layer1 token bridge creator",
      L1TokenBridgeCreatorCommand
    )
    .help()
    .strict()
    .help().argv;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });