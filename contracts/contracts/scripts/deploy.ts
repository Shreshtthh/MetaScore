import { createWalletClient, createPublicClient, http, formatEther, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { writeFileSync } from "fs";
import "dotenv/config";

// Define Somnia chains
const somniaTestnet = {
  id: 50312,
  name: "Somnia Testnet",
  network: "somnia-testnet",
  nativeCurrency: { name: "STT", symbol: "STT", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://dream-rpc.somnia.network"] },
    public: { http: ["https://dream-rpc.somnia.network"] },
  },
  blockExplorers: {
    default: {
      name: "Shannon Explorer",
      url: "https://shannon-explorer.somnia.network",
    },
  },
} as const;

interface DeploymentData {
  visualEngine: `0x${string}`;
  metaScore: `0x${string}`;
  activityTracker: `0x${string}`;
  demoToken: `0x${string}`;
  demoNFT: `0x${string}`;
  paymentContract: `0x${string}`;
  deploymentBlock: string;
  network: string;
  timestamp: number;
  deployer: `0x${string}`;
  chainId: number;
  gasUsed: {
    total: string;
    totalCost: string;
  };
}

async function main() {
  console.log("🚀 Starting MetaScore deployment...\n");

  // Setup clients and account
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable is required");
  }

  const account = privateKeyToAccount(privateKey);

  // Use Somnia testnet directly (since you're running with --network somnia)
  const chain = somniaTestnet;

  const publicClient = createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]) // Explicitly set RPC URL
  });

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(chain.rpcUrls.default.http[0]) // Explicitly set RPC URL
  });

  console.log("Deployment details:");
  console.log("- Deployer:", account.address);
  console.log("- Network:", chain.name);
  console.log("- Chain ID:", chain.id.toString());
  console.log("- RPC URL:", chain.rpcUrls.default.http[0]);

  // Get balance with error handling
  let balance;
  try {
    balance = await publicClient.getBalance({ address: account.address });
    console.log("- Balance:", formatEther(balance), chain.nativeCurrency.symbol, "\n");
  } catch (error) {
    console.error("❌ Failed to connect to Somnia network:", error);
    console.error("💡 Please check:");
    console.error("   1. Your internet connection");
    console.error("   2. Somnia RPC endpoint is working");
    console.error("   3. Your PRIVATE_KEY is correct");
    process.exit(1);
  }

  // Check minimum balance
  if (balance < parseEther("0.1")) {
    console.error("❌ Insufficient balance for deployment");
    console.error("💡 Get STT tokens from: https://testnet.somnia.network/");
    process.exit(1);
  }

  // Import contract artifacts
  const VisualEngineArtifact = await import("../artifacts/contracts/VisualEngine.sol/VisualEngine.json");
  const MetaScoreArtifact = await import("../artifacts/contracts/MetaScore.sol/MetaScore.json");
  const ActivityTrackerArtifact = await import("../artifacts/contracts/ActivityTracker.sol/ActivityTracker.json");
  const DemoTokenArtifact = await import("../artifacts/contracts/demo/DemoToken.sol/DemoToken.json");
  const DemoNFTArtifact = await import("../artifacts/contracts/demo/DemoNFT.sol/DemoNFT.json");
  const PaymentContractArtifact = await import("../artifacts/contracts/demo/PaymentContract.sol/PaymentContract.json");

  let totalGasUsed = BigInt(0);

  try {
    // 1. Deploy VisualEngine
    console.log("1️⃣ Deploying VisualEngine...");
    const visualEngineHash = await walletClient.deployContract({
      abi: VisualEngineArtifact.abi,
      bytecode: VisualEngineArtifact.bytecode as `0x${string}`,
      args: [],
    });

    const visualEngineReceipt = await publicClient.waitForTransactionReceipt({ 
      hash: visualEngineHash 
    });
    const visualEngineAddress = visualEngineReceipt.contractAddress!;
    totalGasUsed += visualEngineReceipt.gasUsed;
    console.log("✅ VisualEngine deployed at:", visualEngineAddress);
    console.log("   Gas used:", visualEngineReceipt.gasUsed.toString());

    // 2. Deploy MetaScore
    console.log("\n2️⃣ Deploying MetaScore...");
    const metaScoreHash = await walletClient.deployContract({
      abi: MetaScoreArtifact.abi,
      bytecode: MetaScoreArtifact.bytecode as `0x${string}`,
      args: [visualEngineAddress],
    });

    const metaScoreReceipt = await publicClient.waitForTransactionReceipt({ 
      hash: metaScoreHash 
    });
    const metaScoreAddress = metaScoreReceipt.contractAddress!;
    totalGasUsed += metaScoreReceipt.gasUsed;
    console.log("✅ MetaScore deployed at:", metaScoreAddress);
    console.log("   Gas used:", metaScoreReceipt.gasUsed.toString());

    // 3. Deploy ActivityTracker
    console.log("\n3️⃣ Deploying ActivityTracker...");
    const activityTrackerHash = await walletClient.deployContract({
      abi: ActivityTrackerArtifact.abi,
      bytecode: ActivityTrackerArtifact.bytecode as `0x${string}`,
      args: [metaScoreAddress],
    });

    const activityTrackerReceipt = await publicClient.waitForTransactionReceipt({ 
      hash: activityTrackerHash 
    });
    const activityTrackerAddress = activityTrackerReceipt.contractAddress!;
    totalGasUsed += activityTrackerReceipt.gasUsed;
    console.log("✅ ActivityTracker deployed at:", activityTrackerAddress);
    console.log("   Gas used:", activityTrackerReceipt.gasUsed.toString());

    // 4. Authorize ActivityTracker
    console.log("\n🔗 Authorizing ActivityTracker...");
    const authHash = await walletClient.writeContract({
      address: metaScoreAddress,
      abi: MetaScoreArtifact.abi,
      functionName: 'authorizeTracker',
      args: [activityTrackerAddress, true],
    });
    const authReceipt = await publicClient.waitForTransactionReceipt({ hash: authHash });
    console.log("✅ ActivityTracker authorized");
    console.log("   Gas used:", authReceipt.gasUsed.toString());

    // 5. Deploy Demo Contracts
    console.log("\n4️⃣ Deploying Demo Contracts...");

    const demoToken = await walletClient.deployContract({
      abi: DemoTokenArtifact.abi,
      bytecode: DemoTokenArtifact.bytecode as `0x${string}`,
      args: [activityTrackerAddress],
    });
    const demoTokenReceipt = await publicClient.waitForTransactionReceipt({ hash: demoToken });
    const demoTokenAddress = demoTokenReceipt.contractAddress!;
    totalGasUsed += demoTokenReceipt.gasUsed;
    console.log("   ✅ DemoToken deployed at:", demoTokenAddress);

    const demoNFT = await walletClient.deployContract({
      abi: DemoNFTArtifact.abi,
      bytecode: DemoNFTArtifact.bytecode as `0x${string}`,
      args: [activityTrackerAddress],
    });
    const demoNFTReceipt = await publicClient.waitForTransactionReceipt({ hash: demoNFT });
    const demoNFTAddress = demoNFTReceipt.contractAddress!;
    totalGasUsed += demoNFTReceipt.gasUsed;
    console.log("   ✅ DemoNFT deployed at:", demoNFTAddress);

    const paymentContract = await walletClient.deployContract({
      abi: PaymentContractArtifact.abi,
      bytecode: PaymentContractArtifact.bytecode as `0x${string}`,
      args: [activityTrackerAddress, account.address],
    });
    const paymentContractReceipt = await publicClient.waitForTransactionReceipt({ hash: paymentContract });
    const paymentContractAddress = paymentContractReceipt.contractAddress!;
    totalGasUsed += paymentContractReceipt.gasUsed;
    console.log("   ✅ PaymentContract deployed at:", paymentContractAddress);

    // 6. Verify demo contracts
    console.log("\n5️⃣ Verifying demo contracts...");
    const verifyHash = await walletClient.writeContract({
      address: activityTrackerAddress,
      abi: ActivityTrackerArtifact.abi,
      functionName: 'verifyMultipleContracts',
      args: [
        [demoTokenAddress, demoNFTAddress, paymentContractAddress],
        ["defi", "nft", "social"],
        [15n, 20n, 15n]
      ],
    });
    await publicClient.waitForTransactionReceipt({ hash: verifyHash });
    console.log("✅ Demo contracts verified");

    // Get deployment block
    const deploymentBlock = await publicClient.getBlockNumber();

    // Prepare deployment data
    const deploymentData: DeploymentData = {
      visualEngine: visualEngineAddress,
      metaScore: metaScoreAddress,
      activityTracker: activityTrackerAddress,
      demoToken: demoTokenAddress,
      demoNFT: demoNFTAddress,
      paymentContract: paymentContractAddress,
      deploymentBlock: deploymentBlock.toString(),
      network: chain.name,
      chainId: chain.id,
      timestamp: Math.floor(Date.now() / 1000),
      deployer: account.address,
      gasUsed: {
        total: totalGasUsed.toString(),
        totalCost: formatEther(totalGasUsed * BigInt(1000000000))
      }
    };

    // Save addresses to file
    writeFileSync("deployed-contracts.json", JSON.stringify(deploymentData, null, 2));
    console.log("\n💾 Contract addresses saved to: deployed-contracts.json");

    // Display final summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=".repeat(60));
    console.log("Contract Addresses:");
    console.log("- VisualEngine:     ", visualEngineAddress);
    console.log("- MetaScore:        ", metaScoreAddress);
    console.log("- ActivityTracker:  ", activityTrackerAddress);
    console.log("- DemoToken:        ", demoTokenAddress);
    console.log("- DemoNFT:          ", demoNFTAddress);
    console.log("- PaymentContract:  ", paymentContractAddress);
    console.log("\nGas Usage:");
    console.log("- Total Gas Used:   ", totalGasUsed.toString());
    console.log("- Total Cost:       ", formatEther(totalGasUsed * BigInt(1000000000)), "STT");
    console.log("\nNetwork Info:");
    console.log("- Network:          ", chain.name);
    console.log("- Chain ID:         ", chain.id);
    console.log("- Deployment Block: ", deploymentBlock.toString());
    console.log("- Explorer:         ", `https://shannon-explorer.somnia.network/address/${metaScoreAddress}`);
    
    console.log("\n🎬 Ready for demo!");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    
    if (error instanceof Error && error.message.includes("insufficient funds")) {
      console.error("💡 Get more STT tokens from: https://testnet.somnia.network/");
    }
    
    process.exit(1);
  }
}

// Handle deployment errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Deployment failed:");
    console.error(error);
    process.exit(1);
  });
