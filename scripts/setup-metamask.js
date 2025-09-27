/**
 * MetaMask Configuration Script for Kadena Chainweb EVM Testnet
 * 
 * This script provides instructions and helper functions for configuring
 * MetaMask to work with Kadena Chainweb EVM Testnet
 */

const KADENA_TESTNET_CONFIG = {
  chainId: '0x1720', // 5920 in hex
  chainName: 'Chainweb EVM Testnet',
  rpcUrls: ['https://evm-testnet.chainweb.com/chainweb/0.0/evm-testnet/chain/20/evm/rpc'],
  nativeCurrency: {
    name: 'Kadena',
    symbol: 'KDA',
    decimals: 18,
  },
  blockExplorerUrls: ['http://chain-20.evm-testnet-blockscout.chainweb.com/'],
  faucetUrl: 'https://tools.kadena.io/faucet/evm'
};

/**
 * Add Kadena Chainweb EVM Testnet to MetaMask
 * This function can be called from the browser console
 */
async function addKadenaTestnetToMetaMask() {
  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [KADENA_TESTNET_CONFIG],
    });
    console.log('✅ Kadena Chainweb EVM Testnet added to MetaMask!');
    console.log('🔗 Faucet URL:', KADENA_TESTNET_CONFIG.faucetUrl);
  } catch (error) {
    console.error('❌ Failed to add network:', error);
  }
}

/**
 * Switch to Kadena Chainweb EVM Testnet
 */
async function switchToKadenaTestnet() {
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: KADENA_TESTNET_CONFIG.chainId }],
    });
    console.log('✅ Switched to Kadena Chainweb EVM Testnet!');
  } catch (error) {
    if (error.code === 4902) {
      // Network not added, add it first
      await addKadenaTestnetToMetaMask();
    } else {
      console.error('❌ Failed to switch network:', error);
    }
  }
}

/**
 * Get test KDA from faucet
 */
function openFaucet() {
  window.open(KADENA_TESTNET_CONFIG.faucetUrl, '_blank');
  console.log('🔗 Faucet opened in new tab');
}

/**
 * Check if MetaMask is installed
 */
function checkMetaMask() {
  if (typeof window.ethereum !== 'undefined') {
    console.log('✅ MetaMask is installed');
    return true;
  } else {
    console.log('❌ MetaMask is not installed');
    console.log('📥 Install MetaMask: https://metamask.io/');
    return false;
  }
}

/**
 * Get current network info
 */
async function getCurrentNetwork() {
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    
    console.log('Current Chain ID:', chainId);
    console.log('Connected Accounts:', accounts);
    
    if (chainId === KADENA_TESTNET_CONFIG.chainId) {
      console.log('✅ Connected to Kadena Chainweb EVM Testnet');
    } else {
      console.log('⚠️ Not connected to Kadena Chainweb EVM Testnet');
      console.log('🔄 Run switchToKadenaTestnet() to switch');
    }
  } catch (error) {
    console.error('❌ Failed to get network info:', error);
  }
}

/**
 * Complete setup process
 */
async function completeSetup() {
  console.log('🚀 Starting Kadena Chainweb EVM Testnet setup...');
  
  if (!checkMetaMask()) {
    return;
  }
  
  await switchToKadenaTestnet();
  await getCurrentNetwork();
  
  console.log('\n📋 Next steps:');
  console.log('1. Get test KDA from faucet:', KADENA_TESTNET_CONFIG.faucetUrl);
  console.log('2. Deploy contracts: npx hardhat run scripts/deploy.js --network chainwebTestnet');
  console.log('3. Start the dApp: pnpm dev');
}

// Export functions for use in browser console
if (typeof window !== 'undefined') {
  window.addKadenaTestnetToMetaMask = addKadenaTestnetToMetaMask;
  window.switchToKadenaTestnet = switchToKadenaTestnet;
  window.openFaucet = openFaucet;
  window.checkMetaMask = checkMetaMask;
  window.getCurrentNetwork = getCurrentNetwork;
  window.completeSetup = completeSetup;
  
  console.log('🔧 Kadena MetaMask setup functions loaded!');
  console.log('💡 Run completeSetup() to start the setup process');
}

module.exports = {
  KADENA_TESTNET_CONFIG,
  addKadenaTestnetToMetaMask,
  switchToKadenaTestnet,
  openFaucet,
  checkMetaMask,
  getCurrentNetwork,
  completeSetup
};
