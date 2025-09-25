import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { address: '0x1234567890123456789012345678901234567890' },
      update: {},
      create: {
        address: '0x1234567890123456789012345678901234567890',
      },
    }),
    prisma.user.upsert({
      where: { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' },
      update: {},
      create: {
        address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create sample transactions
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        hash: '0x1111111111111111111111111111111111111111111111111111111111111111',
        from: users[0].address,
        to: users[1].address,
        amount: '100.00',
        currency: 'USDC',
        status: 'COMPLETED',
        userId: users[0].id,
      },
    }),
    prisma.transaction.create({
      data: {
        hash: '0x2222222222222222222222222222222222222222222222222222222222222222',
        from: users[1].address,
        to: users[0].address,
        amount: '50.00',
        currency: 'MATIC',
        status: 'COMPLETED',
        userId: users[1].id,
      },
    }),
    prisma.transaction.create({
      data: {
        hash: '0x3333333333333333333333333333333333333333333333333333333333333333',
        from: users[0].address,
        to: '0x9999999999999999999999999999999999999999',
        amount: '25.00',
        currency: 'USDC',
        status: 'PENDING',
        userId: users[0].id,
      },
    }),
  ])

  console.log(`✅ Created ${transactions.length} transactions`)

  // Create sample identity proofs
  const identityProofs = await Promise.all([
    prisma.identityProof.create({
      data: {
        proofType: 'age',
        proofData: 'mock_age_proof_123',
        verified: true,
        userId: users[0].id,
      },
    }),
    prisma.identityProof.create({
      data: {
        proofType: 'country',
        proofData: 'mock_country_proof_456',
        verified: true,
        userId: users[0].id,
      },
    }),
    prisma.identityProof.create({
      data: {
        proofType: 'sanction',
        proofData: 'mock_sanction_proof_789',
        verified: true,
        userId: users[0].id,
      },
    }),
  ])

  console.log(`✅ Created ${identityProofs.length} identity proofs`)

  // Create sample agent interactions
  const agentInteractions = await Promise.all([
    prisma.agentInteraction.create({
      data: {
        agentId: 'wallet-agent',
        message: 'Send 10 USDC to 0xabcdef...',
        response: 'Transaction processed successfully! Hash: 0x1111...',
        status: 'COMPLETED',
        userId: users[0].id,
      },
    }),
    prisma.agentInteraction.create({
      data: {
        agentId: 'payment-agent',
        message: 'Validate payment of 50 MATIC',
        response: 'Payment validated and approved.',
        status: 'COMPLETED',
        userId: users[0].id,
      },
    }),
    prisma.agentInteraction.create({
      data: {
        agentId: 'identity-agent',
        message: 'Verify my age for high-value transaction',
        response: 'Age verification completed. You are now verified for transactions up to $1000.',
        status: 'COMPLETED',
        userId: users[0].id,
      },
    }),
  ])

  console.log(`✅ Created ${agentInteractions.length} agent interactions`)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
