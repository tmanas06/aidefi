import express from 'express'
import { PrismaClient } from '@prisma/client'
import { selfProtocolService } from '../lib/self-protocol'

const router = express.Router()
const prisma = new PrismaClient()

// Create verification session
router.post('/verify', async (req, res) => {
  try {
    const { userAddress, proofType, requiredValue } = req.body

    if (!userAddress || !proofType) {
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

    // Create verification session
    const session = await selfProtocolService.createVerificationSession(proofType)

    res.json({
      sessionId: session.sessionId,
      verificationUrl: session.verificationUrl,
      proofType,
      status: 'pending'
    })
  } catch (error) {
    console.error('Identity verification error:', error)
    res.status(500).json({ error: 'Failed to create verification session' })
  }
})

// Complete verification
router.post('/verify/complete', async (req, res) => {
  try {
    const { userAddress, sessionId, proofData } = req.body

    if (!userAddress || !sessionId || !proofData) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { address: userAddress }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Process verification with Self Protocol
    const verification = await selfProtocolService.verifyIdentity({
      proofType: 'age', // This would be determined by the session
      userAddress,
      requiredValue: 18
    })

    if (verification.success && verification.proof) {
      // Save proof to database
      const identityProof = await prisma.identityProof.create({
        data: {
          proofType: verification.proof.proofType,
          proofData: verification.proof.proofData,
          verified: verification.proof.verified,
          userId: user.id
        }
      })

      res.json({
        success: true,
        proofId: identityProof.id,
        verified: true,
        proofType: identityProof.proofType
      })
    } else {
      res.status(400).json({
        success: false,
        error: verification.error || 'Verification failed'
      })
    }
  } catch (error) {
    console.error('Identity verification complete error:', error)
    res.status(500).json({ error: 'Failed to complete verification' })
  }
})

// Get user's identity proofs
router.get('/proofs/:address', async (req, res) => {
  try {
    const { address } = req.params

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        identityProofs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      address,
      proofs: user.identityProofs.map(proof => ({
        id: proof.id,
        proofType: proof.proofType,
        verified: proof.verified,
        createdAt: proof.createdAt
      }))
    })
  } catch (error) {
    console.error('Get identity proofs error:', error)
    res.status(500).json({ error: 'Failed to fetch identity proofs' })
  }
})

// Check if user has required verification
router.get('/check/:address', async (req, res) => {
  try {
    const { address } = req.params
    const { proofType, requiredValue } = req.query

    const user = await prisma.user.findUnique({
      where: { address },
      include: {
        identityProofs: {
          where: {
            proofType: proofType as string,
            verified: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const hasRequiredProof = user.identityProofs.length > 0

    res.json({
      address,
      hasRequiredProof,
      proofType,
      requiredValue,
      proofs: user.identityProofs
    })
  } catch (error) {
    console.error('Check identity error:', error)
    res.status(500).json({ error: 'Failed to check identity' })
  }
})

// Get verification status
router.get('/status/:proofId', async (req, res) => {
  try {
    const { proofId } = req.params

    const proof = await prisma.identityProof.findUnique({
      where: { id: proofId }
    })

    if (!proof) {
      return res.status(404).json({ error: 'Proof not found' })
    }

    res.json({
      id: proof.id,
      proofType: proof.proofType,
      verified: proof.verified,
      createdAt: proof.createdAt,
      updatedAt: proof.updatedAt
    })
  } catch (error) {
    console.error('Identity status error:', error)
    res.status(500).json({ error: 'Failed to fetch identity status' })
  }
})

export default router
