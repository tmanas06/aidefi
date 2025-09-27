import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@kadena/hardhat-chainweb';
import '@kadena/hardhat-kadena-create2';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables from .env file
dotenvConfig();

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    hardhat: {
      chainId: 31337,
    },
    kadenaTestnet: {
      url: 'https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc',
      chainId: 5920,
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      gasPrice: 'auto',
    },
  },
  chainweb: {
    hardhat: {
      chains: 2,
      networkOptions: {
        allowUnlimitedContractSize: true,
      },
    },
    testnet: {
      type: 'external',
      chains: 1,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY ?? ''],
      chainIdOffset: 5920,
      chainwebChainIdOffset: 20,
      externalHostUrl:
        'https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet',
      etherscan: {
        apiKey: 'abc', // Any non-empty string works for Blockscout
        apiURLTemplate:
          'https://chain-{cid}.evm-testnet-blockscout.chainweb.com/api/',
        browserURLTemplate:
          'https://chain-{cid}.evm-testnet-blockscout.chainweb.com',
      },
    },
  },
  etherscan: {
    apiKey: {
      kadenaTestnet: 'abc', // Any non-empty string works for Blockscout
    },
    customChains: [
      {
        network: 'kadenaTestnet',
        chainId: 5920,
        urls: {
          apiURL: 'https://chain-20.evm-testnet-blockscout.chainweb.com/api/',
          browserURL: 'https://chain-20.evm-testnet-blockscout.chainweb.com',
        },
      },
    ],
  },
};

export default config;
