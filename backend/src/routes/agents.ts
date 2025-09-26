import express from 'express'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'
import { geminiService } from '../lib/gemini'

const router = express.Router()
const prisma = new PrismaClient()

// ASI Agent configuration
const ASI_CONFIG = {
  agentId: process.env.ASI_AGENT_ID || '',
  agentSecret: process.env.ASI_AGENT_SECRET || '',
  agentverseUrl: process.env.ASI_AGENTVERSE_URL || 'https://agentverse.asi.one'
}

// Send message to agent
router.post('/message', async (req, res) => {
  try {
    const { userAddress, message, agentType = 'wallet' } = req.body

    if (!userAddress || !message) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { address: userAddress }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { address: userAddress }
      })
    }

    // Create agent interaction record
    const interaction = await prisma.agentInteraction.create({
      data: {
        agentId: agentType,
        message,
        status: 'PENDING',
        userId: user.id
      }
    })

    // Generate AI response using Gemini
    const geminiResponse = await geminiService.generateAgentResponse(
      message,
      agentType,
      { userAddress, interactionId: interaction.id }
    )

    // Send message to ASI agent (for logging/backend processing)
    const agentResponse = await sendToAgent(agentType, message, userAddress)

    // Combine Gemini AI response with agent response
    const combinedResponse = `${agentResponse.response}\n\nAI Insights: ${geminiResponse.message}`

    // Update interaction with response
    await prisma.agentInteraction.update({
      where: { id: interaction.id },
      data: {
        response: combinedResponse,
        status: agentResponse.success ? 'COMPLETED' : 'FAILED'
      }
    })

    res.json({
      success: agentResponse.success,
      interactionId: interaction.id,
      response: combinedResponse,
      agentType,
      aiEnhanced: true
    })
  } catch (error) {
    console.error('Agent message error:', error)
    res.status(500).json({ error: 'Failed to send message to agent' })
  }
})

// Get agent interactions
router.get('/interactions/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { page = 1, limit = 10, agentType } = req.query

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        agentInteractions: {
          where: agentType ? { agentId: agentType as string } : {},
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
      interactions: user.agentInteractions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: user.agentInteractions.length
      }
    })
  } catch (error) {
    console.error('Get agent interactions error:', error)
    res.status(500).json({ error: 'Failed to fetch agent interactions' })
  }
})

// Get agent status
router.get('/status', async (req, res) => {
  try {
    const agents = [
      {
        id: 'wallet-agent',
        name: 'Wallet Agent',
        status: 'online',
        description: 'Handles wallet operations and user requests',
        lastActivity: new Date().toISOString()
      },
      {
        id: 'payment-agent',
        name: 'Payment Agent',
        status: 'online',
        description: 'Manages x402 payments and transaction validation',
        lastActivity: new Date().toISOString()
      },
      {
        id: 'identity-agent',
        name: 'Identity Agent',
        status: 'online',
        description: 'Handles Self Protocol identity verification',
        lastActivity: new Date().toISOString()
      }
    ]

    res.json({ agents })
  } catch (error) {
    console.error('Agent status error:', error)
    res.status(500).json({ error: 'Failed to fetch agent status' })
  }
})

// Get interaction details
router.get('/interaction/:interactionId', async (req, res) => {
  try {
    const { interactionId } = req.params

    const interaction = await prisma.agentInteraction.findUnique({
      where: { id: interactionId },
      include: {
        user: {
          select: { address: true }
        }
      }
    })

    if (!interaction) {
      return res.status(404).json({ error: 'Interaction not found' })
    }

    res.json(interaction)
  } catch (error) {
    console.error('Get interaction error:', error)
    res.status(500).json({ error: 'Failed to fetch interaction' })
  }
})

// Helper function to send message to ASI agent
async function sendToAgent(agentType: string, message: string, userAddress: string) {
  try {
    // Mock agent responses for demo
    const mockResponses = {
      'wallet': [
        'I can help you with wallet operations. What would you like to do?',
        'I\'ll process that transaction for you.',
        'Your wallet balance has been updated.',
        'Transaction completed successfully!'
      ],
      'payment': [
        'I\'m processing your payment request.',
        'Payment validated and sent successfully.',
        'Your x402 payment has been completed.',
        'Payment failed. Please try again.'
      ],
      'identity': [
        'I can help you verify your identity.',
        'Identity verification completed.',
        'Your age verification is now active.',
        'Identity verification failed. Please try again.'
      ]
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Return random response
    const responses = mockResponses[agentType as keyof typeof mockResponses] || ['I received your message.']
    const response = responses[Math.floor(Math.random() * responses.length)]

    return {
      success: true,
      response
    }
  } catch (error) {
    console.error('Send to agent error:', error)
    return {
      success: false,
      response: 'Sorry, I encountered an error processing your request.'
    }
  }
}

export default router
