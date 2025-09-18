import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseEther } from "viem";

describe("MetaScore Contract System", function () {
  let visualEngine: any;
  let metaScore: any;
  let activityTracker: any;
  let demoToken: any;
  let deployer: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    // Get wallet clients
    [deployer, user1, user2] = await hre.viem.getWalletClients();

    // Deploy contracts in correct order
    visualEngine = await hre.viem.deployContract("VisualEngine", []);
    metaScore = await hre.viem.deployContract("MetaScore", [visualEngine.address]);
    activityTracker = await hre.viem.deployContract("ActivityTracker", [metaScore.address]);
    demoToken = await hre.viem.deployContract("DemoToken", [activityTracker.address]);

    // Setup authorizations
    await metaScore.write.authorizeTracker([activityTracker.address, true]);
    await activityTracker.write.verifyContract([demoToken.address, "defi", 15n]);
  });

  describe("MetaScore NFT Minting", function () {
    it("Should mint MetaScore NFT for user with correct initial state", async function () {
      // Mint NFT
      await metaScore.write.mintForUser([user1.account.address]);
      
      // Check user has token
      const tokenId = await metaScore.read.getUserTokenId([user1.account.address]);
      expect(tokenId).to.equal(1n);

      // Check initial score data
      const [totalScore, streakDays, lastActivity, currentTier] = await metaScore.read.getScoreData([tokenId]);
      expect(totalScore).to.equal(0n);
      expect(streakDays).to.equal(1n);
      expect(currentTier).to.equal(0); // Bronze tier
      expect(lastActivity).to.be.greaterThan(0);
    });

    it("Should prevent duplicate NFT minting for same user", async function () {
      // Mint first NFT
      await metaScore.write.mintForUser([user1.account.address]);
      
      // Try to mint second NFT - should fail
      await expect(
        metaScore.write.mintForUser([user1.account.address])
      ).to.be.rejectedWith("User already has MetaScore NFT");
    });

    it("Should increment token IDs correctly", async function () {
      // Mint NFTs for multiple users
      await metaScore.write.mintForUser([user1.account.address]);
      await metaScore.write.mintForUser([user2.account.address]);

      const tokenId1 = await metaScore.read.getUserTokenId([user1.account.address]);
      const tokenId2 = await metaScore.read.getUserTokenId([user2.account.address]);

      expect(tokenId1).to.equal(1n);
      expect(tokenId2).to.equal(2n);
    });
  });

  describe("Score Updates and Tier System", function () {
    beforeEach(async function () {
      // Mint NFT for user1
      await metaScore.write.mintForUser([user1.account.address]);
    });

    it("Should update scores correctly for valid categories", async function () {
      const tokenId = await metaScore.read.getUserTokenId([user1.account.address]);

      // Update DeFi score
      await metaScore.write.updateScore([tokenId, "defi", 25n]);

      // Check updated scores
      const [totalScore] = await metaScore.read.getScoreData([tokenId]);
      expect(totalScore).to.equal(25n);

      const defiScore = await metaScore.read.getCategoryScore([tokenId, "defi"]);
      expect(defiScore).to.equal(25n);
    });

    it("Should upgrade tiers based on total score", async function () {
      const tokenId = await metaScore.read.getUserTokenId([user1.account.address]);

      // Add enough points for Silver tier (50 points)
      await metaScore.write.updateScore([tokenId, "defi", 60n]);

      // Check tier upgrade
      const [, , , currentTier] = await metaScore.read.getScoreData([tokenId]);
      expect(currentTier).to.equal(1); // Silver tier
    });

    it("Should handle multiple category scores correctly", async function () {
      const tokenId = await metaScore.read.getUserTokenId([user1.account.address]);

      // Update multiple categories
      await metaScore.write.updateScore([tokenId, "defi", 20n]);
      await metaScore.write.updateScore([tokenId, "nft", 30n]);
      await metaScore.write.updateScore([tokenId, "social", 15n]);

      // Check individual scores
      const [defiScore, nftScore, socialScore, developerScore] = await metaScore.read.getAllCategoryScores([tokenId]);
      expect(defiScore).to.equal(20n);
      expect(nftScore).to.equal(30n);
      expect(socialScore).to.equal(15n);
      expect(developerScore).to.equal(0n);

      // Check total score
      const [totalScore] = await metaScore.read.getScoreData([tokenId]);
      expect(totalScore).to.equal(65n);
    });

    it("Should reject invalid categories", async function () {
      const tokenId = await metaScore.read.getUserTokenId([user1.account.address]);

      await expect(
        metaScore.write.updateScore([tokenId, "invalid_category", 25n])
      ).to.be.rejectedWith("Invalid category");
    });
  });

  describe("Authorization and Security", function () {
    it("Should prevent unauthorized score updates", async function () {
      const tokenId = 1n;

      // Try to update score without authorization
      await expect(
        metaScore.write.updateScore([tokenId, "defi", 25n], { account: user1.account })
      ).to.be.rejectedWith("Not authorized");
    });

    it("Should allow owner to authorize trackers", async function () {
      const newTracker = user2.account.address;
      
      // Authorize new tracker
      await metaScore.write.authorizeTracker([newTracker, true]);
      
      // Check authorization
      const isAuthorized = await metaScore.read.authorizedTrackers([newTracker]);
      expect(isAuthorized).to.be.true;
    });

    it("Should prevent non-owner from authorizing trackers", async function () {
      await expect(
        metaScore.write.authorizeTracker([user2.account.address, true], { account: user1.account })
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    });
  });

  describe("NFT Metadata and URI", function () {
    it("Should generate valid token URI with metadata", async function () {
      // Mint NFT and add some scores
      await metaScore.write.mintForUser([user1.account.address]);
      const tokenId = await metaScore.read.getUserTokenId([user1.account.address]);
      
      await metaScore.write.updateScore([tokenId, "defi", 30n]);
      await metaScore.write.updateScore([tokenId, "nft", 25n]);

      // Get token URI
      const tokenURI = await metaScore.read.tokenURI([tokenId]);
      expect(tokenURI).to.include("data:application/json;base64,");
      
      // Verify URI is not empty and has reasonable length
      expect(tokenURI.length).to.be.greaterThan(100);
    });

    it("Should fail to get URI for non-existent token", async function () {
      await expect(
        metaScore.read.tokenURI([999n])
      ).to.be.rejectedWith("Token does not exist");
    });
  });

  describe("Integration with Demo Contracts", function () {
    it("Should track activity from demo token contract", async function () {
      // Mint MetaScore NFT
      await metaScore.write.mintForUser([user1.account.address]);
      const tokenId = await metaScore.read.getUserTokenId([user1.account.address]);

      // Get initial scores
      const [initialScore] = await metaScore.read.getScoreData([tokenId]);
      
      // Perform demo token mint (should trigger activity tracking)
      await demoToken.write.mint({ account: user1.account });
      
      // Check updated scores
      const [newScore] = await metaScore.read.getScoreData([tokenId]);
      expect(newScore).to.be.greaterThan(initialScore);
    });
  });

  describe("Soulbound Functionality", function () {
    it("Should prevent transfers of MetaScore NFTs", async function () {
      // Mint NFT
      await metaScore.write.mintForUser([user1.account.address]);
      const tokenId = await metaScore.read.getUserTokenId([user1.account.address]);

      // Try to transfer - should fail
      await expect(
        metaScore.write.transferFrom([user1.account.address, user2.account.address, tokenId], 
        { account: user1.account })
      ).to.be.rejectedWith("MetaScore NFTs are soulbound");
    });
  });
});
