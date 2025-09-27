import express from 'express';
import { createKadenaPublicClient, createKadenaWalletClient, DelegatedAccountManager, KADENA_UTILS } from '../lib/kadena.js';

const router = express.Router();

// Initialize Kadena clients
const publicClient = createKadenaPublicClient();
const walletClient = createKadenaWalletClient(process.env.PRIVATE_KEY || '');
const delegatedAccountManager = new DelegatedAccountManager(process.env.PRIVATE_KEY || '');

// Get Kadena network info
router.get('/network-info', async (req, res) => {
  try {
    const chainId = await publicClient.getChainId();
    const blockNumber = await publicClient.getBlockNumber();
    
    res.json({
      chainId: chainId.toString(),
      blockNumber: blockNumber.toString(),
      network: 'Chainweb EVM Testnet',
      currency: 'KDA',
      explorer: 'http://chain-20.evm-testnet-blockscout.chainweb.com/',
      faucet: 'https://tools.kadena.io/faucet/evm'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get network info' });
  }
});

// Get account balance
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const balance = await publicClient.getBalance({ address: address as `0x${string}` });
    
    res.json({
      address,
      balance: balance.toString(),
      balanceFormatted: KADENA_UTILS.formatKDA(balance)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get balance' });
  }
});

// Create delegated account
router.post('/delegated-accounts/create', async (req, res) => {
  try {
    const { maxSpend, validatorAddress, salt } = req.body;
    
    if (!maxSpend || !validatorAddress || !salt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const maxSpendWei = KADENA_UTILS.toWei(maxSpend);
    const result = await delegatedAccountManager.createDelegatedAccount(
      maxSpendWei,
      validatorAddress,
      salt
    );

    res.json({
      success: true,
      delegatedAccount: result.delegatedAddress,
      maxSpend: maxSpend,
      validator: result.validator,
      policyParams: result.policyParams
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create delegated account' });
  }
});

// Get delegated account info
router.get('/delegated-accounts/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { validatorAddress } = req.query;
    
    if (!validatorAddress) {
      return res.status(400).json({ error: 'Validator address required' });
    }

    const info = await delegatedAccountManager.getDelegatedAccount(
      address,
      validatorAddress as string
    );

    res.json({
      address: info.address,
      maxSpend: KADENA_UTILS.formatKDA(info.maxSpend),
      remainingSpend: KADENA_UTILS.formatKDA(info.remainingSpend),
      isActive: info.isActive
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get delegated account info' });
  }
});

// Execute delegated transaction
router.post('/delegated-accounts/:address/execute', async (req, res) => {
  try {
    const { address } = req.params;
    const { to, value, data } = req.body;
    
    if (!to || !value) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const valueWei = KADENA_UTILS.toWei(value);
    const result = await delegatedAccountManager.executeDelegatedTransaction(
      address,
      to,
      valueWei,
      data || '0x'
    );

    res.json({
      success: true,
      transactionHash: result.hash,
      status: result.status
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute delegated transaction' });
  }
});

// Get transaction status
router.get('/transactions/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const receipt = await publicClient.getTransactionReceipt({ hash: hash as `0x${string}` });
    
    res.json({
      hash,
      status: receipt?.status === 'success' ? 'success' : 'failed',
      blockNumber: receipt?.blockNumber?.toString(),
      gasUsed: receipt?.gasUsed?.toString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transaction status' });
  }
});

// Get recent transactions for an address
router.get('/transactions/address/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 10 } = req.query;
    
    // This would typically query a database or indexer
    // For now, return mock data
    const transactions = [
      {
        hash: '0x' + Math.random().toString(16).substr(2, 64),
        from: address,
        to: '0x' + Math.random().toString(16).substr(2, 40),
        value: KADENA_UTILS.formatKDA(BigInt(Math.floor(Math.random() * 1000000000000000000))),
        timestamp: new Date().toISOString(),
        status: 'success'
      }
    ];

    res.json({
      address,
      transactions: transactions.slice(0, Number(limit))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

export default router;
