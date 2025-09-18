import hre from "hardhat";
import { readFileSync } from "fs";
import { parseEther, formatEther } from "viem";

async function main() {
  console.log("🎬 Setting up demo environment...");
  console.log("");

  // Read deployed contracts
  let deployedContracts;
  try {
    const contractsData = readFileSync("deployed-contracts.json", "utf8");
    deployedContracts = JSON.parse(contractsData);
  } catch (error) {
    console.error("❌ Could not read deployed-contracts.json. Run deploy script first.");
    console.error("   Try: npm run deploy");
    process.exit(1);
  }

  const publicClient = await hre.viem.getPublicClient();
  const [deployer] = await hre.viem.getWalletClients();
  
  console.log("👤 Demo account:", deployer.account.address);
  const initialBalance = await publicClient.getBalance({ address: deployer.account.address });
  console.log("💰 Account balance:", formatEther(initialBalance), "STT");
  
  if (initialBalance < BigInt("10000000000000000")) { // Less than 0.01 STT
    console.error("❌ Insufficient balance for demo setup (need at least 0.01 STT)");
    process.exit(1);
  }
  console.log("");
  
  // Get contract instances
  const metaScore = await hre.viem.getContractAt("MetaScore", deployedContracts.metaScore);
  const demoToken = await hre.viem.getContractAt("DemoToken", deployedContracts.demoToken);
  const demoNFT = await hre.viem.getContractAt("DemoNFT", deployedContracts.demoNFT);
  const paymentContract = await hre.viem.getContractAt("PaymentContract", deployedContracts.paymentContract);

  let totalGasUsed = BigInt(0);

  try {
    console.log("1️⃣ Checking/Minting initial MetaScore NFT...");
    const userTokenId = await metaScore.read.getUserTokenId([deployer.account.address]);
    
    if (userTokenId === 0n) {
      console.log("   Minting new MetaScore NFT...");
      const mintHash = await metaScore.write.mintForUser([deployer.account.address]);
      const mintReceipt = await publicClient.waitForTransactionReceipt({ hash: mintHash });
      totalGasUsed += mintReceipt.gasUsed;
      console.log("✅ MetaScore NFT minted successfully");
      console.log("   Transaction hash:", mintHash);
      console.log("   Gas used:", formatEther(mintReceipt.gasUsed * BigInt(1000000000)), "STT");
    } else {
      console.log("✅ MetaScore NFT already exists (Token ID:", userTokenId.toString(), ")");
    }
    console.log("");

    console.log("2️⃣ Performing demo activities...");
    
    // Demo Token Activities
    console.log("   💰 Minting demo tokens...");
    const mintHash = await demoToken.write.mint();
    const mintReceipt = await publicClient.waitForTransactionReceipt({ hash: mintHash });
    totalGasUsed += mintReceipt.gasUsed;
    console.log("   ✅ Demo tokens minted (+15 DeFi points)");
    console.log("   Transaction hash:", mintHash);
    
    // Check token balance
    const tokenBalance = await demoToken.read.balanceOf([deployer.account.address]);
    console.log("   📊 Token balance:", formatEther(tokenBalance), "DEMO");
    console.log("");

    // Demo NFT Activities
    console.log("   🖼️  Minting demo NFT...");
    const nftMintHash = await demoNFT.write.mint();
    const nftMintReceipt = await publicClient.waitForTransactionReceipt({ hash: nftMintHash });
    totalGasUsed += nftMintReceipt.gasUsed;
    console.log("   ✅ Demo NFT minted (+20 NFT points)");
    console.log("   Transaction hash:", nftMintHash);
    
    // Check NFT balance
    const nftBalance = await demoNFT.read.balanceOf([deployer.account.address]);
    console.log("   📊 NFT balance:", nftBalance.toString());
    console.log("");

    // Payment Activities
    console.log("   🎁 Making donation...");
    const donateHash = await paymentContract.write.donate(["Demo setup donation! 🚀"], { 
      value: parseEther("0.01") 
    });
    const donateReceipt = await publicClient.waitForTransactionReceipt({ hash: donateHash });
    totalGasUsed += donateReceipt.gasUsed;
    console.log("   ✅ Donation made (+10 Social points)");
    console.log("   Transaction hash:", donateHash);
    console.log("   Amount donated:", formatEther(parseEther("0.01")), "STT");
    console.log("");

    // Wait a moment for all activities to be processed
    console.log("⏳ Waiting for activity processing...");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check final scores
    console.log("3️⃣ Checking final scores...");
    const finalTokenId = await metaScore.read.getUserTokenId([deployer.account.address]);
    const [totalScore, streakDays, lastActivity, currentTier] = await metaScore.read.getScoreData([finalTokenId]);
    const [defiScore, nftScore, socialScore, developerScore] = await metaScore.read.getAllCategoryScores([finalTokenId]);

    console.log("");
    console.log("🏆 DEMO SETUP COMPLETED SUCCESSFULLY! 🏆");
    console.log("=".repeat(50));
    console.log("📊 MetaScore Analytics:");
    console.log("   🆔 Token ID:         ", finalTokenId.toString());
    console.log("   🎯 Total Score:      ", totalScore.toString());
    console.log("   💰 DeFi Score:       ", defiScore.toString());
    console.log("   🖼️  NFT Score:        ", nftScore.toString());
    console.log("   🤝 Social Score:     ", socialScore.toString());
    console.log("   👨‍💻 Developer Score:  ", developerScore.toString());
    console.log("   🥇 Current Tier:     ", getTierName(Number(currentTier)), `(${currentTier})`);
    console.log("   🔥 Streak:           ", streakDays.toString(), "days");
    console.log("   📅 Last Activity:    ", new Date(Number(lastActivity) * 1000).toLocaleString());
    console.log("");
    console.log("⛽ Gas Usage Summary:");
    console.log("   Total Gas Used:      ", totalGasUsed.toString());
    console.log("   Total Cost:          ", formatEther(totalGasUsed * BigInt(1000000000)), "STT");
    console.log("");
    console.log("🎬 Demo Environment Ready!");
    console.log("🔗 View your MetaScore NFT:");
    console.log("   Explorer:", `https://shannon-explorer.somnia.network/token/${deployedContracts.metaScore}?a=${finalTokenId}`);
    console.log("");
    console.log("💡 Demo Script Ideas:");
    console.log("   1. Show initial Bronze tier NFT");
    console.log("   2. Perform more activities to reach Silver tier (50+ points)");
    console.log("   3. Demonstrate visual evolution of the NFT");
    console.log("   4. Show cross-category achievements");
    console.log("");

    // Display token URI for verification
    console.log("4️⃣ NFT Metadata Preview:");
    try {
      const tokenURI = await metaScore.read.tokenURI([finalTokenId]);
      console.log("🖼️  Token URI length:", tokenURI.length, "characters");
      console.log("   Preview:", tokenURI.substring(0, 100) + "...");
      
      // Try to decode the base64 metadata for better preview
      if (tokenURI.startsWith('data:application/json;base64,')) {
        const base64Data = tokenURI.split(',')[1];
        try {
          const decodedMetadata = Buffer.from(base64Data, 'base64').toString('utf-8');
          const metadata = JSON.parse(decodedMetadata);
          console.log("   NFT Name:", metadata.name);
          console.log("   Description:", metadata.description);
          console.log("   Attributes:", metadata.attributes?.length || 0, "traits");
        } catch (decodeError) {
          console.log("   ⚠️  Could not decode metadata for preview");
        }
      }
    } catch (error) {
      console.log("   ⚠️  Could not retrieve token URI:", error);
    }

  } catch (error) {
    console.error("❌ Demo setup failed:", error);
    
    // Provide helpful error context
    if (error instanceof Error) {
      if (error.message.includes("insufficient funds")) {
        console.error("💡 Try getting more STT from the faucet:");
        console.error("   https://testnet.somnia.network/");
      } else if (error.message.includes("revert")) {
        console.error("💡 Contract interaction failed. Check if contracts are deployed correctly.");
      }
    }
    
    process.exit(1);
  }
}

// Helper function to get tier name
function getTierName(tier: number): string {
  const tierNames = ["Bronze", "Silver", "Gold", "Platinum", "Diamond"];
  return tierNames[tier] || "Unknown";
}

main().catch((error) => {
  console.error("❌ Demo setup script error:", error);
  process.exit(1);
});
