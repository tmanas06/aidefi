const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts to Kadena Chainweb EVM...");

  // Get the contract factories
  const AIDelegate = await ethers.getContractFactory("AIDelegate");
  const MockToken = await ethers.getContractFactory("MockToken");
  const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
  const CrossChainBridge = await ethers.getContractFactory("CrossChainBridge");

  // Deploy MockToken first
  console.log("Deploying MockToken contract...");
  const mockToken = await MockToken.deploy(
    "Test Token",
    "TEST",
    18,
    ethers.parseEther("1000000") // 1M tokens
  );
  await mockToken.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();
  console.log("MockToken deployed to:", mockTokenAddress);

  // Deploy AIDelegate contract
  console.log("Deploying AIDelegate contract...");
  const aiDelegate = await AIDelegate.deploy();
  await aiDelegate.waitForDeployment();
  const aiDelegateAddress = await aiDelegate.getAddress();
  console.log("AIDelegate deployed to:", aiDelegateAddress);

  // Deploy SimpleSwap contract
  console.log("Deploying SimpleSwap contract...");
  const simpleSwap = await SimpleSwap.deploy(
    mockTokenAddress,
    ethers.parseEther("100") // 1 KDA = 100 TEST tokens
  );
  await simpleSwap.waitForDeployment();
  const simpleSwapAddress = await simpleSwap.getAddress();
  console.log("SimpleSwap deployed to:", simpleSwapAddress);

  // Deploy CrossChainBridge contract
  console.log("Deploying CrossChainBridge contract...");
  const crossChainBridge = await CrossChainBridge.deploy();
  await crossChainBridge.waitForDeployment();
  const crossChainBridgeAddress = await crossChainBridge.getAddress();
  console.log("CrossChainBridge deployed to:", crossChainBridgeAddress);

  // Add some test chains to the bridge
  console.log("Adding test chains to bridge...");
  await crossChainBridge.addSupportedChain(
    0, // Chain 0
    "Chain 0",
    crossChainBridgeAddress // Same contract on all chains for testing
  );
  await crossChainBridge.addSupportedChain(
    1, // Chain 1
    "Chain 1",
    crossChainBridgeAddress
  );

  // Add mock token as supported
  await crossChainBridge.setSupportedToken(mockTokenAddress, true);

  // Save deployment addresses
  const deploymentInfo = {
    network: "chainweb-testnet",
    chainId: 5920,
    contracts: {
      AIDelegate: aiDelegateAddress,
      MockToken: mockTokenAddress,
      SimpleSwap: simpleSwapAddress,
      CrossChainBridge: crossChainBridgeAddress,
    },
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Summary:");
  console.log("==================");
  console.log("Network:", deploymentInfo.network);
  console.log("Chain ID:", deploymentInfo.chainId);
  console.log("AIDelegate:", aiDelegateAddress);
  console.log("MockToken:", mockTokenAddress);
  console.log("SimpleSwap:", simpleSwapAddress);
  console.log("CrossChainBridge:", crossChainBridgeAddress);
  console.log("Timestamp:", deploymentInfo.timestamp);

  // Verify contracts (if on testnet)
  if (network.name === "chainwebTestnet") {
    console.log("\nVerifying contracts...");
    try {
      await hre.run("verify:verify", {
        address: aiDelegateAddress,
        constructorArguments: [],
      });
      console.log("AIDelegate verified");
    } catch (error) {
      console.log("AIDelegate verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: mockTokenAddress,
        constructorArguments: ["Test Token", "TEST", 18, ethers.parseEther("1000000")],
      });
      console.log("MockToken verified");
    } catch (error) {
      console.log("MockToken verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: simpleSwapAddress,
        constructorArguments: [mockTokenAddress, ethers.parseEther("100")],
      });
      console.log("SimpleSwap verified");
    } catch (error) {
      console.log("SimpleSwap verification failed:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: crossChainBridgeAddress,
        constructorArguments: [],
      });
      console.log("CrossChainBridge verified");
    } catch (error) {
      console.log("CrossChainBridge verification failed:", error.message);
    }
  }

  console.log("\nDeployment completed successfully!");
  console.log("Update your .env file with the contract addresses:");
  console.log(`AI_DELEGATE_ADDRESS=${aiDelegateAddress}`);
  console.log(`MOCK_TOKEN_ADDRESS=${mockTokenAddress}`);
  console.log(`SIMPLE_SWAP_ADDRESS=${simpleSwapAddress}`);
  console.log(`CROSS_CHAIN_BRIDGE_ADDRESS=${crossChainBridgeAddress}`);
  
  console.log("\nNext steps:");
  console.log("1. Fund your account with test KDA from: https://tools.kadena.io/faucet/evm");
  console.log("2. Add liquidity to SimpleSwap contract");
  console.log("3. Create a delegated account for your AI bot");
  console.log("4. Test the swap and bridge functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
