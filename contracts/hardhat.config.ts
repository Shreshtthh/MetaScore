import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-contract-sizer";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Random test key because hardhat doesnt take undefined for pvt_key
const SOMNIA_RPC_URL = process.env.SOMNIA_RPC_URL || "https://dream-rpc.somnia.network";
const SOMNIA_MAINNET_RPC_URL = process.env.SOMNIA_MAINNET_RPC_URL || "https://api.infra.mainnet.somnia.network";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.22",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable via-IR to fix stack too deep errors
      metadata: {
        bytecodeHash: "none"
      }
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    somnia: {
      url: SOMNIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 50312,
      gasPrice: 1000000000, // 1 gwei
      timeout: 120000,
    },
    somniaMainnet: {
      url: SOMNIA_MAINNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5031,
      gasPrice: 1000000000,
      timeout: 120000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
    strict: true,
    only: ["MetaScore", "ActivityTracker", "VisualEngine"],
  },
  etherscan: {
    apiKey: {
      somnia: "empty",
      somniaMainnet: "empty",
    },
    customChains: [
      {
        network: "somnia",
        chainId: 50312,
        urls: {
          apiURL: "https://shannon-explorer.somnia.network/api",
          browserURL: "https://shannon-explorer.somnia.network",
        },
      },
      {
        network: "somniaMainnet", 
        chainId: 5031,
        urls: {
          apiURL: "https://explorer.somnia.network/api",
          browserURL: "https://explorer.somnia.network",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 120000,
  },
};

export default config;
