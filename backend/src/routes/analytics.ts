import express from 'express'
import { PrismaClient } from '@prisma/client'

const router = express.Router()
const prisma = new PrismaClient()

// Get dashboard analytics
router.get('/dashboard/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { period = '30d' } = req.query

    const days = period === '7d' ? 7 : 30
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        transactions: {
          where: {
            createdAt: { gte: startDate }
          }
        },
        identityProofs: true,
        agentInteractions: {
          where: {
            createdAt: { gte: startDate }
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Calculate transaction metrics
    const transactions = user.transactions
    const totalVolume = transactions
      .filter(tx => tx.status === 'COMPLETED')
      .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    
    const successRate = transactions.length > 0 
      ? (transactions.filter(tx => tx.status === 'COMPLETED').length / transactions.length) * 100
      : 0

    // Calculate daily transaction volume for chart
    const dailyVolume = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayTransactions = transactions.filter(tx => 
        tx.createdAt >= dayStart && tx.createdAt <= dayEnd && tx.status === 'COMPLETED'
      )
      
      const volume = dayTransactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
      
      dailyVolume.push({
        date: dayStart.toISOString().split('T')[0],
        volume,
        count: dayTransactions.length
      })
    }

    // Calculate agent interaction metrics
    const agentInteractions = user.agentInteractions
    const agentStats = {
      total: agentInteractions.length,
      completed: agentInteractions.filter(i => i.status === 'COMPLETED').length,
      failed: agentInteractions.filter(i => i.status === 'FAILED').length,
      pending: agentInteractions.filter(i => i.status === 'PENDING').length
    }

    // Calculate identity verification metrics
    const identityProofs = user.identityProofs
    const identityStats = {
      total: identityProofs.length,
      verified: identityProofs.filter(p => p.verified).length,
      ageVerified: identityProofs.filter(p => p.proofType === 'age' && p.verified).length,
      countryVerified: identityProofs.filter(p => p.proofType === 'country' && p.verified).length,
      sanctionVerified: identityProofs.filter(p => p.proofType === 'sanction' && p.verified).length
    }

    res.json({
      period,
      transactions: {
        totalVolume,
        successRate,
        count: transactions.length,
        completed: transactions.filter(tx => tx.status === 'COMPLETED').length,
        failed: transactions.filter(tx => tx.status === 'FAILED').length,
        pending: transactions.filter(tx => tx.status === 'PENDING').length,
        dailyVolume
      },
      agents: agentStats,
      identity: identityStats,
      summary: {
        totalValue: totalVolume,
        activeAgents: 3, // Mock value
        verificationLevel: identityStats.verified > 0 ? 'verified' : 'unverified'
      }
    })
  } catch (error) {
    console.error('Dashboard analytics error:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' })
  }
})

// Get transaction analytics
router.get('/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { period = '30d', groupBy = 'day' } = req.query

    const days = period === '7d' ? 7 : 30
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        transactions: {
          where: {
            createdAt: { gte: startDate }
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const transactions = user.transactions

    // Group transactions by time period
    const groupedTransactions = []
    const groupSize = groupBy === 'hour' ? 1 : groupBy === 'day' ? 24 : 24 * 7

    for (let i = 0; i < days; i += groupBy === 'hour' ? 1 : 1) {
      const periodStart = new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000)
      const periodEnd = new Date(periodStart.getTime() + (groupSize * 60 * 60 * 1000))
      
      const periodTransactions = transactions.filter(tx => 
        tx.createdAt >= periodStart && tx.createdAt < periodEnd
      )
      
      const volume = periodTransactions
        .filter(tx => tx.status === 'COMPLETED')
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
      
      groupedTransactions.push({
        period: periodStart.toISOString(),
        volume,
        count: periodTransactions.length,
        successRate: periodTransactions.length > 0 
          ? (periodTransactions.filter(tx => tx.status === 'COMPLETED').length / periodTransactions.length) * 100
          : 0
      })
    }

    res.json({
      period,
      groupBy,
      data: groupedTransactions,
      summary: {
        totalVolume: transactions
          .filter(tx => tx.status === 'COMPLETED')
          .reduce((sum, tx) => sum + parseFloat(tx.amount), 0),
        totalCount: transactions.length,
        averageVolume: transactions.length > 0 
          ? transactions
              .filter(tx => tx.status === 'COMPLETED')
              .reduce((sum, tx) => sum + parseFloat(tx.amount), 0) / transactions.length
          : 0
      }
    })
  } catch (error) {
    console.error('Transaction analytics error:', error)
    res.status(500).json({ error: 'Failed to fetch transaction analytics' })
  }
})

// Get agent performance analytics
router.get('/agents/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { period = '30d' } = req.query

    const days = period === '7d' ? 7 : 30
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        agentInteractions: {
          where: {
            createdAt: { gte: startDate }
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const interactions = user.agentInteractions

    // Group by agent type
    const agentStats = interactions.reduce((acc, interaction) => {
      const agentId = interaction.agentId
      if (!acc[agentId]) {
        acc[agentId] = {
          total: 0,
          completed: 0,
          failed: 0,
          pending: 0,
          averageResponseTime: 0
        }
      }
      
      acc[agentId].total++
      acc[agentId][interaction.status.toLowerCase() as keyof typeof acc[typeof agentId]]++
      
      return acc
    }, {} as Record<string, any>)

    // Calculate success rates
    Object.keys(agentStats).forEach(agentId => {
      const stats = agentStats[agentId]
      stats.successRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
    })

    res.json({
      period,
      agents: agentStats,
      summary: {
        totalInteractions: interactions.length,
        averageSuccessRate: interactions.length > 0 
          ? (interactions.filter(i => i.status === 'COMPLETED').length / interactions.length) * 100
          : 0,
        mostActiveAgent: Object.keys(agentStats).reduce((a, b) => 
          agentStats[a].total > agentStats[b].total ? a : b, 
          Object.keys(agentStats)[0] || ''
        )
      }
    })
  } catch (error) {
    console.error('Agent analytics error:', error)
    res.status(500).json({ error: 'Failed to fetch agent analytics' })
  }
})

export default router
