import hre from 'hardhat'

/**
 * This script mints MockToken to a specific address for testing purposes.
 * Run with: npx hardhat run scripts/mint-tokens.ts --network kadenaTestnet
 */
async function main() {
  const [deployer] = await hre.ethers.getSigners()
  
  console.log('Minting tokens with account:', deployer.address)
  console.log('Account balance:', hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)))

  // MockToken contract address (from deployment)
  const mockTokenAddress = '0x0299Dc0b031f365b884d645F1b38420C6b0E0270'
  
  // Get the MockToken contract
  const MockToken = await hre.ethers.getContractAt('MockToken', mockTokenAddress)
  
  // Get token info
  const name = await MockToken.name()
  const symbol = await MockToken.symbol()
  const decimals = await MockToken.decimals()
  
  console.log(`Token: ${name} (${symbol})`)
  console.log(`Decimals: ${decimals}`)
  
  // Amount to mint (1000 tokens)
  const mintAmount = hre.ethers.parseUnits('1000', decimals)
  
  // Check if contract has mint function
  try {
    // Try to mint tokens to deployer
    console.log(`Minting ${hre.ethers.formatUnits(mintAmount, decimals)} ${symbol} to ${deployer.address}...`)
    
    // Note: MockToken might not have a mint function, so we'll try different approaches
    const mintTx = await MockToken.mint(deployer.address, mintAmount)
    await mintTx.wait()
    
    console.log('✅ Tokens minted successfully!')
    
    // Check balance
    const balance = await MockToken.balanceOf(deployer.address)
    console.log(`New balance: ${hre.ethers.formatUnits(balance, decimals)} ${symbol}`)
    
  } catch (error: any) {
    console.log('❌ Mint function not available or failed:', error.message)
    
    // Alternative: Transfer from contract owner if it has tokens
    try {
      const contractBalance = await MockToken.balanceOf(mockTokenAddress)
      console.log(`Contract balance: ${hre.ethers.formatUnits(contractBalance, decimals)} ${symbol}`)
      
      if (contractBalance > 0) {
        console.log('Attempting to transfer from contract...')
        const transferTx = await MockToken.transfer(deployer.address, mintAmount)
        await transferTx.wait()
        console.log('✅ Tokens transferred from contract!')
      } else {
        console.log('⚠️ Contract has no tokens to transfer')
      }
    } catch (transferError: any) {
      console.log('❌ Transfer failed:', transferError.message)
    }
  }
  
  // Final balance check
  const finalBalance = await MockToken.balanceOf(deployer.address)
  console.log(`\n📊 Final ${symbol} balance: ${hre.ethers.formatUnits(finalBalance, decimals)}`)
  
  // Also check native KDA balance
  const nativeBalance = await hre.ethers.provider.getBalance(deployer.address)
  console.log(`📊 Native KDA balance: ${hre.ethers.formatEther(nativeBalance)} KDA`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
