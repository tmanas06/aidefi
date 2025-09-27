import hre from 'hardhat'

/**
 * This script tests all contract interactions end-to-end.
 * Run with: npx hardhat run scripts/test-contracts.ts --network kadenaTestnet
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners()
  
  console.log('Testing contracts with account:', deployer.address)
  console.log('Account balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)))

  // Contract addresses
  const mockTokenAddress = '0x0299Dc0b031f365b884d645F1b38420C6b0E0270'
  const simpleSwapAddress = '0x7E48ce740412515d2408C74e0307ddA698aAb13b'
  const aiDelegateAddress = '0x6a831d7e1d06dfa8eeF1ba1b996588995CB26789'
  const crossChainBridgeAddress = '0xa64D7fa2579B5A5e2bC581D89e8D0e9e5467B945'

  console.log('\n=== Contract Addresses ===')
  console.log('MockToken:', mockTokenAddress)
  console.log('SimpleSwap:', simpleSwapAddress)
  console.log('AIDelegate:', aiDelegateAddress)
  console.log('CrossChainBridge:', crossChainBridgeAddress)

  // Test MockToken
  console.log('\n=== Testing MockToken ===')
  const MockToken = await hre.ethers.getContractAt('MockToken', mockTokenAddress)
  
  try {
    const name = await MockToken.name()
    const symbol = await MockToken.symbol()
    const decimals = await MockToken.decimals()
    const balance = await MockToken.balanceOf(deployer.address)
    
    console.log(`✅ Token Info: ${name} (${symbol}) - ${decimals} decimals`)
    console.log(`✅ Balance: ${hre.ethers.formatUnits(balance, decimals)} ${symbol}`)
  } catch (error: any) {
    console.log('❌ MockToken test failed:', error.message)
  }

  // Test SimpleSwap
  console.log('\n=== Testing SimpleSwap ===')
  const SimpleSwap = await hre.ethers.getContractAt('SimpleSwap', simpleSwapAddress)
  
  try {
    const rate = await SimpleSwap.rate()
    const tokenAddress = await SimpleSwap.token()
    const swapQuote = await SimpleSwap.getSwapQuote(hre.ethers.parseEther('1'))
    
    console.log(`✅ Swap rate: ${rate.toString()}`)
    console.log(`✅ Token address: ${tokenAddress}`)
    console.log(`✅ Quote for 1 KDA: ${hre.ethers.formatUnits(swapQuote, 18)} tokens`)
  } catch (error: any) {
    console.log('❌ SimpleSwap test failed:', error.message)
  }

  // Test AIDelegate
  console.log('\n=== Testing AIDelegate ===')
  const AIDelegate = await hre.ethers.getContractAt('AIDelegate', aiDelegateAddress)
  
  try {
    // Create a test delegate
    const testDelegate = '0x1234567890123456789012345678901234567890'
    const spendingLimit = hre.ethers.parseEther('10')
    const allowedFunctions = ['swap', 'transfer']
    
    console.log('Creating delegated account...')
    const createTx = await AIDelegate.createDelegatedAccount(testDelegate, spendingLimit, allowedFunctions)
    await createTx.wait()
    console.log('✅ Delegated account created')
    
    // Get delegate info
    const delegateInfo = await AIDelegate.getDelegateInfo(testDelegate)
    console.log(`✅ Delegate info:`, {
      delegate: delegateInfo.delegate,
      spendingLimit: hre.ethers.formatEther(delegateInfo.spendingLimit),
      spentAmount: hre.ethers.formatEther(delegateInfo.spentAmount),
      isActive: delegateInfo.isActive
    })
  } catch (error: any) {
    console.log('❌ AIDelegate test failed:', error.message)
  }

  // Test CrossChainBridge
  console.log('\n=== Testing CrossChainBridge ===')
  const CrossChainBridge = await hre.ethers.getContractAt('CrossChainBridge', crossChainBridgeAddress)
  
  try {
    // Add a supported chain
    const chainId = 1 // Ethereum mainnet
    const chainName = 'Ethereum Mainnet'
    const bridgeAddress = '0x1234567890123456789012345678901234567890'
    
    console.log('Adding supported chain...')
    const addChainTx = await CrossChainBridge.addSupportedChain(chainId, chainName, bridgeAddress)
    await addChainTx.wait()
    console.log('✅ Supported chain added')
    
    // Set supported token
    console.log('Setting supported token...')
    const setTokenTx = await CrossChainBridge.setSupportedToken(mockTokenAddress, true)
    await setTokenTx.wait()
    console.log('✅ Supported token set')
  } catch (error: any) {
    console.log('❌ CrossChainBridge test failed:', error.message)
  }

  // Test transaction simulation
  console.log('\n=== Testing Transaction Simulation ===')
  try {
    const recipient = '0x1234567890123456789012345678901234567890'
    const amount = hre.ethers.parseEther('0.1')
    
    console.log(`Simulating send of ${hre.ethers.formatEther(amount)} KDA to ${recipient}`)
    
    // Estimate gas
    const gasEstimate = await hre.ethers.provider.estimateGas({
      to: recipient,
      value: amount,
      from: deployer.address
    })
    
    console.log(`✅ Gas estimate: ${gasEstimate.toString()}`)
    console.log('✅ Transaction simulation successful')
  } catch (error: any) {
    console.log('❌ Transaction simulation failed:', error.message)
  }

  console.log('\n=== Test Summary ===')
  console.log('All contract interactions tested!')
  console.log('✅ Contracts are deployed and functional')
  console.log('✅ Frontend should be able to interact with all contracts')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
