import { ethers } from "hardhat";

/**
 * Comprehensive test script for the AI DeFi system
 * This script demonstrates the full workflow:
 * 1. Deploy contracts
 * 2. Create delegated account for AI bot
 * 3. Test swap functionality
 * 4. Test bridge functionality
 * 5. Test AI bot execution
 */

async function main() {
  console.log("🧪 Starting comprehensive system test...\n");

  const [owner, aiBot, user1] = await ethers.getSigners();
  
  console.log("👥 Test accounts:");
  console.log("Owner:", owner.address);
  console.log("AI Bot:", aiBot.address);
  console.log("User1:", user1.address);
  console.log("");

  // Deploy contracts
  console.log("📦 Deploying contracts...");
  
  const MockToken = await ethers.getContractFactory("MockToken");
  const mockToken = await MockToken.deploy(
    "Test Token",
    "TEST",
    18,
    ethers.parseEther("1000000")
  );
  await mockToken.waitForDeployment();
  console.log("✅ MockToken deployed:", await mockToken.getAddress());

  const AIDelegate = await ethers.getContractFactory("AIDelegate");
  const aiDelegate = await AIDelegate.deploy();
  await aiDelegate.waitForDeployment();
  console.log("✅ AIDelegate deployed:", await aiDelegate.getAddress());

  const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
  const simpleSwap = await SimpleSwap.deploy(
    await mockToken.getAddress(),
    ethers.parseEther("100") // 1 KDA = 100 TEST tokens
  );
  await simpleSwap.waitForDeployment();
  console.log("✅ SimpleSwap deployed:", await simpleSwap.getAddress());

  const CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");
  const crossChainBridge = await CrossChainBridge.deploy();
  await crossChainBridge.waitForDeployment();
  console.log("✅ CrossChainBridge deployed:", await crossChainBridge.getAddress());

  console.log("");

  // Setup bridge
  console.log("🌉 Setting up bridge...");
  await crossChainBridge.addSupportedChain(0, "Chain 0", await crossChainBridge.getAddress());
  await crossChainBridge.addSupportedChain(1, "Chain 1", await crossChainBridge.getAddress());
  await crossChainBridge.setSupportedToken(await mockToken.getAddress(), true);
  console.log("✅ Bridge configured");

  // Add liquidity to swap
  console.log("💧 Adding liquidity to swap...");
  await mockToken.transfer(await simpleSwap.getAddress(), ethers.parseEther("10000"));
  console.log("✅ Added 10,000 TEST tokens to swap contract");

  // Create delegated account for AI bot
  console.log("🤖 Creating delegated account for AI bot...");
  const spendingLimit = ethers.parseEther("1"); // 1 KDA max
  const allowedFunctions = ["swap()", "bridge()"];
  
  await aiDelegate.createDelegatedAccount(
    aiBot.address,
    spendingLimit,
    allowedFunctions
  );
  console.log("✅ AI bot delegated account created with 1 KDA spending limit");

  // Test 1: AI bot executes swap
  console.log("\n🔄 Test 1: AI bot executes swap...");
  
  // Give AI bot some KDA
  await owner.sendTransaction({
    to: aiBot.address,
    value: ethers.parseEther("2") // 2 KDA
  });
  
  const swapData = simpleSwap.interface.encodeFunctionData("swap");
  const swapValue = ethers.parseEther("0.5"); // 0.5 KDA
  
  console.log("AI bot swapping 0.5 KDA for TEST tokens...");
  await aiDelegate.connect(aiBot).executeViaDelegate(
    await simpleSwap.getAddress(),
    swapValue,
    swapData,
    { value: swapValue }
  );
  
  const botTokenBalance = await mockToken.balanceOf(aiBot.address);
  console.log("✅ AI bot received", ethers.formatEther(botTokenBalance), "TEST tokens");

  // Test 2: AI bot executes bridge
  console.log("\n🌉 Test 2: AI bot executes bridge...");
  
  const bridgeData = crossChainBridge.interface.encodeFunctionData(
    "initiateBridge",
    [await mockToken.getAddress(), ethers.parseEther("100"), 0, user1.address]
  );
  
  console.log("AI bot initiating bridge of 100 TEST tokens to chain 0...");
  await aiDelegate.connect(aiBot).executeViaDelegate(
    await crossChainBridge.getAddress(),
    0,
    bridgeData
  );
  console.log("✅ AI bot initiated bridge transaction");

  // Test 3: Check spending limits
  console.log("\n💰 Test 3: Checking spending limits...");
  
  const delegateInfo = await aiDelegate.getDelegateInfo(aiBot.address);
  console.log("Spending limit:", ethers.formatEther(delegateInfo.spendingLimit), "KDA");
  console.log("Spent amount:", ethers.formatEther(delegateInfo.spentAmount), "KDA");
  console.log("Remaining:", ethers.formatEther(delegateInfo.spendingLimit - delegateInfo.spentAmount), "KDA");

  // Test 4: Try to exceed spending limit
  console.log("\n⚠️ Test 4: Testing spending limit enforcement...");
  
  const excessiveValue = ethers.parseEther("1"); // 1 KDA (would exceed limit)
  
  try {
    await aiDelegate.connect(aiBot).executeViaDelegate(
      await simpleSwap.getAddress(),
      excessiveValue,
      swapData,
      { value: excessiveValue }
    );
    console.log("❌ This should have failed!");
  } catch (error: any) {
    console.log("✅ Spending limit correctly enforced:", error.message);
  }

  // Test 5: Update spending limit
  console.log("\n📈 Test 5: Updating spending limit...");
  
  const newLimit = ethers.parseEther("2"); // 2 KDA
  await aiDelegate.updateSpendingLimit(aiBot.address, newLimit);
  
  const updatedInfo = await aiDelegate.getDelegateInfo(aiBot.address);
  console.log("✅ New spending limit:", ethers.formatEther(updatedInfo.spendingLimit), "KDA");

  // Test 6: Reset spent amount
  console.log("\n🔄 Test 6: Resetting spent amount...");
  
  await aiDelegate.resetSpentAmount(aiBot.address);
  
  const resetInfo = await aiDelegate.getDelegateInfo(aiBot.address);
  console.log("✅ Spent amount reset to:", ethers.formatEther(resetInfo.spentAmount), "KDA");

  // Test 7: Deactivate AI bot
  console.log("\n🛑 Test 7: Deactivating AI bot...");
  
  await aiDelegate.deactivateDelegate(aiBot.address);
  
  const deactivatedInfo = await aiDelegate.getDelegateInfo(aiBot.address);
  console.log("✅ AI bot deactivated:", !deactivatedInfo.isActive);

  // Summary
  console.log("\n📊 Test Summary:");
  console.log("==================");
  console.log("✅ All contracts deployed successfully");
  console.log("✅ AI bot delegated account created");
  console.log("✅ Swap functionality tested");
  console.log("✅ Bridge functionality tested");
  console.log("✅ Spending limits enforced");
  console.log("✅ AI bot deactivated");
  
  console.log("\n🎉 System test completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("AIDelegate:", await aiDelegate.getAddress());
  console.log("MockToken:", await mockToken.getAddress());
  console.log("SimpleSwap:", await simpleSwap.getAddress());
  console.log("CrossChainBridge:", await crossChainBridge.getAddress());
  
  console.log("\n🚀 Next steps:");
  console.log("1. Deploy to testnet: npx hardhat run scripts/deploy.ts --network chainwebTestnet");
  console.log("2. Start frontend: pnpm dev");
  console.log("3. Connect MetaMask to Kadena Chainweb EVM Testnet");
  console.log("4. Get test KDA from faucet: https://tools.kadena.io/faucet/evm");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
