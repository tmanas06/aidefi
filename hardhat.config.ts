import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    chainwebTestnet: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc",
      chainId: 5920,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    chainwebMainnet: {
      url: "https://evm.chainweb.com/chainweb/0.0/mainnet01/chain/20/evm/rpc",
      chainId: 1,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 1000000000, // 1 gwei
    },
    // Multi-chain deployment for Kadena
    chainwebTestnetChain0: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/0/evm/rpc",
      chainId: 5920,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    chainwebTestnetChain1: {
      url: "https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/1/evm/rpc",
      chainId: 5920,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      chainwebTestnet: "your-api-key-here",
    },
    customChains: [
      {
        network: "chainwebTestnet",
        chainId: 5920,
        urls: {
          apiURL: "http://chain-20.evm-testnet-blockscout.chainweb.com/api",
          browserURL: "http://chain-20.evm-testnet-blockscout.chainweb.com/",
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
};

export default config;
