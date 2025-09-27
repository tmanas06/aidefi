import { run } from "hardhat";

async function main() {
  const contractAddresses = {
    AIDelegate: process.env.AI_DELEGATE_ADDRESS || "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    MockToken: process.env.MOCK_TOKEN_ADDRESS || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    SimpleSwap: process.env.SIMPLE_SWAP_ADDRESS || "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    CrossChainBridge: process.env.CROSS_CHAIN_BRIDGE_ADDRESS || "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  };

  const contracts = [
    { name: 'AIDelegate', address: contractAddresses.AIDelegate, args: [] },
    { name: 'MockToken', address: contractAddresses.MockToken, args: ["AI DeFi Test Token", "AIDT", 18, "1000000000000000000000000"] },
    { name: 'SimpleSwap', address: contractAddresses.SimpleSwap, args: [contractAddresses.MockToken, "100000000000000000000"] },
    { name: 'CrossChainBridge', address: contractAddresses.CrossChainBridge, args: [] }
  ];

  console.log("Verifying contracts on Kadena Chainweb EVM Testnet...");

  for (const contract of contracts) {
    try {
      console.log(`Verifying ${contract.name} at ${contract.address}...`);
      
      await run("verify:verify", {
        address: contract.address,
        constructorArguments: contract.args,
      });
      
      console.log(`✅ ${contract.name} verified successfully`);
    } catch (error: any) {
      console.log(`❌ ${contract.name} verification failed:`, error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
