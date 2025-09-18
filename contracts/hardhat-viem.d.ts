// hardhat-viem.d.ts
import "hardhat/types/config";
import "hardhat/types/runtime";

declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    viem: {
      getPublicClient(): Promise<any>;
      getWalletClients(): Promise<any[]>;
      deployContract(name: string, args?: any[]): Promise<any>;
      getContractAt(name: string, address: string): Promise<any>;
    };
  }
}
