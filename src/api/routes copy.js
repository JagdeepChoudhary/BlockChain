const express = require('express');
const Security = require('../security/security');

// Export a function that accepts dependencies
module.exports = (blockchain, p2pNetwork) => {
    const router = express.Router();

    router.get('/blockchain', (req, res) => {
        res.json({
            chain: blockchain.chain,
            length: blockchain.chain.length,
            totalSupply: blockchain.totalSupply
        });
    });

    router.post('/transaction', (req, res) => {
        try {
            const tx = Security.sanitizeInput(req.body);
            blockchain.pendingTransactions.push(tx);
            p2pNetwork.broadcast(JSON.stringify({ type: 'TRANSACTION', data: tx }));
            res.json({ status: 'Transaction added to pool' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.post('/wallet/create', (req, res) => {
        const wallet = new (require('../wallet/wallet'))();
        res.json({
            publicKey: wallet.publicKey,
            balance: 0
        });
    });

    return router;
};