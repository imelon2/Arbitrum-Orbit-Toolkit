import ethers, {
  BigNumber,
  Contract,
  ContractFactory,
  EventFilter,
  Overrides,
  Wallet,
} from "ethers";
import { ansi } from "../utils/logStyle";

export class BaseContract {
  protected provider: ethers.providers.JsonRpcProvider;
  protected signer: Wallet;
  public contract: Contract | undefined;
  protected interface: ethers.utils.Interface | undefined;
  protected abi: any;
  protected bytecode: any;
  public address: string;
  public contractName: string;

  constructor(
    provider: ethers.providers.JsonRpcProvider,
    signer: Wallet,
    abi: any,
    bytecode: any,
    contractName: string,
    address?: string
  ) {
    this.provider = provider;
    this.signer = signer;
    this.abi = abi;
    this.bytecode = bytecode;
    this.contractName = contractName;
    this.address = address || "";

    this.contract = this.address
      ? new Contract(this.address, this.abi, this.signer)
      : undefined;
    this.interface = this.contract?.interface || undefined;
  }

  async deployContract(constructorArgs: any[] = [], overrides?: Overrides) {
    try {
      const factory = new ContractFactory(this.abi, this.bytecode, this.signer);

      let deploymentArgs = [...constructorArgs];
      if (overrides) {
        deploymentArgs.push(overrides);
      }

      const contract = await factory.deploy(...deploymentArgs);
      await contract.deployTransaction.wait();
      console.log(
        `New ${this.contractName} created at address:`,
        contract.address
      );

      this.contract = contract;
      this.interface = this.contract.interface;
      this.address = contract.address;
      return this;
    } catch (error) {
      console.error(error);
      return this;
    }
  }

  parseLogs(logs: { topics: Array<string>; data: string }[]) {
    if (!this.interface) {
      throw new Error(`No import ${this.contractName} contract`);
    }

    return logs.map((log) => {
      return this.interface!.parseLog(log);
    });
  }

  moniter(eventName?: string | EventFilter) {
    if (!this.contract) {
      throw new Error(`No import ${this.contractName} contract`);
    }

    console.log(
      `${ansi.BrightWhite}[Run] Start Monitoring at ${this.contractName} Contract ${this.address} \n ${ansi.reset}`
    );

    this.contract.on(eventName || "*", async (data) => {
      const finishTime = new Date();
      console.log(
        `${ansi.Yellow}[MONITOR LOG] Emit event ${ansi.BrightMagenta}${
          data.event
        } ${ansi.reset}${ansi.Yellow} on ${
          this.contractName
        } contract at ${finishTime.toLocaleString()}${ansi.reset}`
      );

      const recepit = await data.getTransactionReceipt();

      console.log(recepit);
      const result:any[] = []
      const logs = this.parseLogs(recepit.logs);
      logs.forEach((log, i) => {
        let params: any = {};
        log.eventFragment.inputs.forEach((param, i) => {
          const arg = log.args[i];
          params[`${param.name}(${param.type})`] = BigNumber.isBigNumber(arg)
            ? BigNumber.from(arg).toString()
            : arg;
        });
        const _result = {
          name: log.name,
          signature: log.signature,
          topic: log.topic,
          params,
        };
        result.push(_result)
      });
      console.log(result);
      
    });
  }
}
