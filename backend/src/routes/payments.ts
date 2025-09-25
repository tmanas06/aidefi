import express from 'express'
import { PrismaClient } from '@prisma/client'
import { x402Service } from '../lib/x402'
import { sendTransaction, getBalance } from '../lib/polygon'

const router = express.Router()
const prisma = new PrismaClient()

// Get user's payment history
router.get('/history/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { page = 1, limit = 10 } = req.query

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          skip: (Number(page) - 1) * Number(limit),
          take: Number(limit)
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      transactions: user.transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: user.transactions.length
      }
    })
  } catch (error) {
    console.error('Payment history error:', error)
    res.status(500).json({ error: 'Failed to fetch payment history' })
  }
})

// Get user's balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { token } = req.query

    const balance = await getBalance(address, token as string)
    
    res.json({
      address,
      balance,
      currency: token || 'MATIC'
    })
  } catch (error) {
    console.error('Balance error:', error)
    res.status(500).json({ error: 'Failed to fetch balance' })
  }
})

// Send payment
router.post('/send', async (req, res) => {
  try {
    const { from, to, amount, currency, data } = req.body

    if (!from || !to || !amount) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { address: from }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { address: from }
      })
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        hash: `pending_${Date.now()}`,
        from,
        to,
        amount,
        currency,
        status: 'PENDING',
        userId: user.id
      }
    })

    // Process payment with x402
    const x402Request = {
      requestId: transaction.id,
      to,
      amount,
      currency,
      data: data || '',
      timestamp: Date.now()
    }

    const x402Response = await x402Service.processPayment(x402Request)

    if (x402Response.success && x402Response.transactionHash) {
      // Update transaction with hash
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          hash: x402Response.transactionHash,
          status: 'COMPLETED'
        }
      })

      res.json({
        success: true,
        transactionId: transaction.id,
        hash: x402Response.transactionHash,
        status: 'completed'
      })
    } else {
      // Mark transaction as failed
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'FAILED' }
      })

      res.status(400).json({
        success: false,
        error: x402Response.error || 'Payment failed'
      })
    }
  } catch (error) {
    console.error('Send payment error:', error)
    res.status(500).json({ error: 'Failed to send payment' })
  }
})

// Get transaction status
router.get('/status/:transactionId', async (req, res) => {
  try {
    const { transactionId } = req.params

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId }
    })

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' })
    }

    res.json({
      id: transaction.id,
      hash: transaction.hash,
      status: transaction.status,
      from: transaction.from,
      to: transaction.to,
      amount: transaction.amount,
      currency: transaction.currency,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    })
  } catch (error) {
    console.error('Transaction status error:', error)
    res.status(500).json({ error: 'Failed to fetch transaction status' })
  }
})

// Get payment analytics
router.get('/analytics/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { period = '30d' } = req.query

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        transactions: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - (period === '7d' ? 7 : 30) * 24 * 60 * 60 * 1000)
            }
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const transactions = user.transactions
    const totalVolume = transactions
      .filter(tx => tx.status === 'COMPLETED')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    
    const successRate = transactions.length > 0 
      ? (transactions.filter(tx => tx.status === 'COMPLETED').length / transactions.length) * 100
      : 0

    res.json({
      totalVolume,
      transactionCount: transactions.length,
      successRate,
      completedTransactions: transactions.filter(tx => tx.status === 'COMPLETED').length,
      failedTransactions: transactions.filter(tx => tx.status === 'FAILED').length,
      pendingTransactions: transactions.filter(tx => tx.status === 'PENDING').length
    })
  } catch (error) {
    console.error('Payment analytics error:', error)
    res.status(500).json({ error: 'Failed to fetch payment analytics' })
  }
})

export default router
