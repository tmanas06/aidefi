import express from 'express'
import { PrismaClient } from '@prisma/client'
import { brewitService, DelegatedWallet, OperationTask, ValidatorConfig, PolicyParams } from '../lib/brewit'

const router = express.Router()
const prisma = new PrismaClient()

/**
 * Create a new delegated wallet using Brewit SDK
 */
router.post('/wallets/delegated', async (req, res) => {
  try {
    const { name, type, validator, policyParams } = req.body

    if (!name || !type || !validator || !policyParams) {
      return res.status(400).json({ 
        error: 'Name, type, validator, and policyParams are required' 
      })
    }

    const delegatedWallet = await brewitService.createDelegatedWallet(
      name, 
      type, 
      validator as ValidatorConfig, 
      policyParams as PolicyParams
    )

    // Store in database
    const dbWallet = await prisma.delegatedWallet.create({
      data: {
        brewitId: delegatedWallet.id,
        address: delegatedWallet.address,
        name: delegatedWallet.name,
        type: delegatedWallet.type,
        isActive: delegatedWallet.isActive,
        permissions: JSON.stringify(delegatedWallet.permissions),
        createdAt: new Date(delegatedWallet.createdAt),
        lastUsed: new Date(delegatedWallet.lastUsed)
      }
    })

    res.json({
      success: true,
      wallet: dbWallet,
      message: 'Delegated wallet created successfully'
    })
  } catch (error) {
    console.error('Error creating delegated wallet:', error)
    res.status(500).json({ error: 'Failed to create delegated wallet' })
  }
})

/**
 * Get all delegated wallets
 */
router.get('/wallets/delegated', async (req, res) => {
  try {
    const wallets = await prisma.delegatedWallet.findMany({
      orderBy: { createdAt: 'desc' }
    })

    // Parse permissions JSON strings
    const walletsWithParsedPermissions = wallets.map(wallet => ({
      ...wallet,
      permissions: JSON.parse(wallet.permissions || '[]')
    }))

    res.json({
      success: true,
      wallets: walletsWithParsedPermissions,
      count: wallets.length
    })
  } catch (error) {
    console.error('Error fetching delegated wallets:', error)
    res.status(500).json({ error: 'Failed to fetch delegated wallets' })
  }
})

/**
 * Create a bot-specific delegated wallet using Brewit SDK
 */
router.post('/wallets/bot', async (req, res) => {
  try {
    const { botType, customName, tokenAddress, spendLimit } = req.body

    if (!botType || !['pol', 'eth', 'matic'].includes(botType)) {
      return res.status(400).json({ error: 'Valid botType (pol, eth, matic) is required' })
    }

    const delegatedWallet = await brewitService.createBotWallet(
      botType, 
      customName,
      tokenAddress,
      spendLimit ? BigInt(spendLimit) : undefined
    )

    // Store in database
    const dbWallet = await prisma.delegatedWallet.create({
      data: {
        brewitId: delegatedWallet.id,
        address: delegatedWallet.address,
        name: delegatedWallet.name,
        type: delegatedWallet.type,
        isActive: delegatedWallet.isActive,
        permissions: JSON.stringify(delegatedWallet.permissions),
        createdAt: new Date(delegatedWallet.createdAt),
        lastUsed: new Date(delegatedWallet.lastUsed)
      }
    })

    res.json({
      success: true,
      wallet: dbWallet,
      message: `Bot ${botType.toUpperCase()} wallet created successfully`
    })
  } catch (error) {
    console.error('Error creating bot wallet:', error)
    res.status(500).json({ error: 'Failed to create bot wallet' })
  }
})

/**
 * Create a user-interactive delegated wallet using Brewit SDK
 */
router.post('/wallets/user-delegated', async (req, res) => {
  try {
    const { userAddress, customName, spendLimit } = req.body

    if (!userAddress) {
      return res.status(400).json({ error: 'User address is required' })
    }

    const delegatedWallet = await brewitService.createUserDelegatedWallet(
      userAddress, 
      customName,
      spendLimit ? BigInt(spendLimit) : undefined
    )

    // Store in database
    const dbWallet = await prisma.delegatedWallet.create({
      data: {
        brewitId: delegatedWallet.id,
        address: delegatedWallet.address,
        name: delegatedWallet.name,
        type: delegatedWallet.type,
        isActive: delegatedWallet.isActive,
        permissions: JSON.stringify(delegatedWallet.permissions),
        createdAt: new Date(delegatedWallet.createdAt),
        lastUsed: new Date(delegatedWallet.lastUsed)
      }
    })

    res.json({
      success: true,
      wallet: dbWallet,
      message: 'User delegated wallet created successfully'
    })
  } catch (error) {
    console.error('Error creating user delegated wallet:', error)
    res.status(500).json({ error: 'Failed to create user delegated wallet' })
  }
})

/**
 * Create an automated AI agent operation
 */
router.post('/operations/ai-agent', async (req, res) => {
  try {
    const { walletAddress, operation } = req.body

    if (!walletAddress || !operation) {
      return res.status(400).json({ error: 'Wallet address and operation are required' })
    }

    const result = await brewitService.createAIAgentOperation(walletAddress, operation)

    // Store operation in database
    const dbOperation = await prisma.automatedOperation.create({
      data: {
        brewitOperationId: result.operationId,
        walletAddress,
        name: operation.name,
        task: operation.task,
        repeatInterval: operation.repeat,
        maxExecutions: operation.times,
        payload: operation.payload,
        status: 'SCHEDULED',
        scheduledAt: new Date(result.scheduledAt)
      }
    })

    res.json({
      success: true,
      operation: dbOperation,
      message: result.message
    })
  } catch (error) {
    console.error('Error creating AI agent operation:', error)
    res.status(500).json({ error: 'Failed to create AI agent operation' })
  }
})

/**
 * Create automated trading operation
 */
router.post('/operations/trading', async (req, res) => {
  try {
    const { walletAddress, operationName, tradingParams } = req.body

    if (!walletAddress || !operationName || !tradingParams) {
      return res.status(400).json({ error: 'Wallet address, operation name, and trading parameters are required' })
    }

    const result = await brewitService.createAutomatedTradingOperation(
      walletAddress,
      operationName,
      tradingParams
    )

    // Store operation in database
    const dbOperation = await prisma.automatedOperation.create({
      data: {
        brewitOperationId: result.operationId,
        walletAddress,
        name: operationName,
        task: 'swap',
        repeatInterval: tradingParams.repeatInterval,
        maxExecutions: tradingParams.maxExecutions,
        payload: {
          swapParams: tradingParams
        },
        status: 'SCHEDULED',
        scheduledAt: new Date(result.scheduledAt)
      }
    })

    res.json({
      success: true,
      operation: dbOperation,
      message: result.message
    })
  } catch (error) {
    console.error('Error creating trading operation:', error)
    res.status(500).json({ error: 'Failed to create trading operation' })
  }
})

/**
 * Create automated staking operation
 */
router.post('/operations/staking', async (req, res) => {
  try {
    const { walletAddress, operationName, stakingParams } = req.body

    if (!walletAddress || !operationName || !stakingParams) {
      return res.status(400).json({ error: 'Wallet address, operation name, and staking parameters are required' })
    }

    const result = await brewitService.createAutomatedStakingOperation(
      walletAddress,
      operationName,
      stakingParams
    )

    // Store operation in database
    const dbOperation = await prisma.automatedOperation.create({
      data: {
        brewitOperationId: result.operationId,
        walletAddress,
        name: operationName,
        task: 'stake',
        repeatInterval: stakingParams.repeatInterval,
        maxExecutions: stakingParams.maxExecutions,
        payload: {
          stakeParams: stakingParams
        },
        status: 'SCHEDULED',
        scheduledAt: new Date(result.scheduledAt)
      }
    })

    res.json({
      success: true,
      operation: dbOperation,
      message: result.message
    })
  } catch (error) {
    console.error('Error creating staking operation:', error)
    res.status(500).json({ error: 'Failed to create staking operation' })
  }
})

/**
 * Get all scheduled operations
 */
router.get('/operations', async (req, res) => {
  try {
    const { walletAddress } = req.query

    const where = walletAddress ? { walletAddress: walletAddress as string } : {}

    const operations = await prisma.automatedOperation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        delegatedWallet: true
      }
    })

    res.json({
      success: true,
      operations,
      count: operations.length
    })
  } catch (error) {
    console.error('Error fetching operations:', error)
    res.status(500).json({ error: 'Failed to fetch operations' })
  }
})

/**
 * Delete a scheduled operation
 */
router.delete('/operations/:operationId', async (req, res) => {
  try {
    const { operationId } = req.params

    // Get operation from database
    const operation = await prisma.automatedOperation.findUnique({
      where: { id: operationId }
    })

    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' })
    }

    // Delete from Brewit
    await brewitService.deleteOperation(operation.brewitOperationId)

    // Delete from database
    await prisma.automatedOperation.delete({
      where: { id: operationId }
    })

    res.json({
      success: true,
      message: 'Operation deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting operation:', error)
    res.status(500).json({ error: 'Failed to delete operation' })
  }
})

/**
 * Get automation agent info
 */
router.get('/agent/info', async (req, res) => {
  try {
    const agentInfo = await brewitService.getAutomationAgentInfo()

    res.json({
      success: true,
      agentInfo
    })
  } catch (error) {
    console.error('Error fetching agent info:', error)
    res.status(500).json({ error: 'Failed to fetch agent info' })
  }
})

/**
 * Send transaction using delegated account
 */
router.post('/wallets/:walletId/send-transaction', async (req, res) => {
  try {
    const { walletId } = req.params
    const { to, value, data } = req.body

    if (!to || !value) {
      return res.status(400).json({ error: 'To address and value are required' })
    }

    // Get wallet from database
    const wallet = await prisma.delegatedWallet.findUnique({
      where: { id: walletId }
    })

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' })
    }

    const txHash = await brewitService.sendDelegatedTransaction(
      wallet.address,
      to,
      value,
      data
    )

    res.json({
      success: true,
      transactionHash: txHash,
      message: 'Transaction sent successfully'
    })
  } catch (error) {
    console.error('Error sending transaction:', error)
    res.status(500).json({ error: 'Failed to send transaction' })
  }
})

/**
 * Get delegated account details
 */
router.get('/wallets/:walletId/details', async (req, res) => {
  try {
    const { walletId } = req.params
    const { validator, policy, tokens } = req.query

    if (!validator || !policy) {
      return res.status(400).json({ 
        error: 'Validator and policy parameters are required' 
      })
    }

    const details = await brewitService.getDelegatedAccountDetails(
      JSON.parse(validator as string),
      policy as 'spendlimit' | 'sudo',
      tokens ? JSON.parse(tokens as string) : []
    )

    res.json({
      success: true,
      details
    })
  } catch (error) {
    console.error('Error getting account details:', error)
    res.status(500).json({ error: 'Failed to get account details' })
  }
})

/**
 * Update delegated account policy
 */
router.patch('/wallets/:walletId/policy', async (req, res) => {
  try {
    const { walletId } = req.params
    const { validator, updatedPolicyParams } = req.body

    if (!validator || !updatedPolicyParams) {
      return res.status(400).json({ 
        error: 'Validator and updatedPolicyParams are required' 
      })
    }

    const updateTxs = await brewitService.updateDelegatedAccountPolicy(
      validator,
      updatedPolicyParams
    )

    res.json({
      success: true,
      transactions: updateTxs,
      message: 'Account policy updated successfully'
    })
  } catch (error) {
    console.error('Error updating account policy:', error)
    res.status(500).json({ error: 'Failed to update account policy' })
  }
})

/**
 * Remove delegated account
 */
router.delete('/wallets/:walletId/remove', async (req, res) => {
  try {
    const { walletId } = req.params
    const { validator } = req.body

    if (!validator) {
      return res.status(400).json({ error: 'Validator is required' })
    }

    const removeTxs = await brewitService.removeDelegatedAccount(validator)

    // Delete from database
    await prisma.delegatedWallet.delete({
      where: { id: walletId }
    })

    res.json({
      success: true,
      transactions: removeTxs,
      message: 'Delegated account removed successfully'
    })
  } catch (error) {
    console.error('Error removing account:', error)
    res.status(500).json({ error: 'Failed to remove account' })
  }
})

/**
 * Update delegated wallet status
 */
router.patch('/wallets/:walletId/status', async (req, res) => {
  try {
    const { walletId } = req.params
    const { isActive } = req.body

    const wallet = await prisma.delegatedWallet.update({
      where: { id: walletId },
      data: { isActive }
    })

    res.json({
      success: true,
      wallet,
      message: `Wallet ${isActive ? 'activated' : 'deactivated'} successfully`
    })
  } catch (error) {
    console.error('Error updating wallet status:', error)
    res.status(500).json({ error: 'Failed to update wallet status' })
  }
})

export default router
