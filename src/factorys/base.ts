import ethers, { Contract, ContractFactory, Overrides, Wallet } from "ethers"

export class BaseContract {
    protected provider: ethers.providers.JsonRpcProvider;
    protected signer: Wallet;
    public contract: Contract | undefined;
    protected interface: ethers.utils.Interface | undefined;
    protected abi:any;
    protected bytecode:any;
    public address: string;
    public contractName:string;

    constructor(
        provider: ethers.providers.JsonRpcProvider,
        signer: Wallet,
        abi: any,
        bytecode:any,
        contractName:string,
        address?: string
      ) {
        this.provider = provider;
        this.signer = signer;
        this.abi = abi;
        this.bytecode = bytecode;
        this.contractName = contractName;
        this.address = address || "";

        this.contract = this.address ? new Contract(this.address, this.abi, this.signer) : undefined;
        this.interface = this.contract?.interface || undefined;
      }

      async deployContract(
        constructorArgs: any[] = [],
        overrides?: Overrides
      ) {
        try {
          
            const factory = new ContractFactory(this.abi, this.bytecode, this.signer);

            let deploymentArgs = [...constructorArgs]
            if (overrides) {
              deploymentArgs.push(overrides)
            }
            
            const contract = await factory.deploy(...deploymentArgs);
            await contract.deployTransaction.wait();
            console.log(`New ${this.contractName} created at address:`, contract.address)
            
            this.contract = contract;
            this.interface = this.contract.interface
            this.address = contract.address;
            return this;
        } catch (error) {
            console.error(error);
            return this;
        }
      }

      parseLogs(logs: { topics: Array<string>, data: string}[]) {
        if (!this.interface) {
          throw new Error(`No import ${this.contractName} contract`);
        }

        return logs.map((log) => {
          return this.interface!.parseLog(log);
        })
      }
}