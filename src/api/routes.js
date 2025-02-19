import express from 'express';
import { QuantumWallet } from '../wallet/quantum.js';
import { Security } from '../security/firewall.js';

export function createRoutes(blockchain) {
    const router = express.Router();

    router.get('/chain', (req, res) => {
        res.json({
            chain: blockchain.chain,
            length: blockchain.chain.length,
            totalSupply: blockchain.totalSupply
        });
    });

    router.post('/transaction', (req, res) => {
        try {
            const cleanData = Security.sanitize(req.body);
            const tx = blockchain.createTransaction(
                cleanData.sender,
                cleanData.receiver,
                cleanData.amount
            );
            res.json(tx);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    router.post('/wallet', (req, res) => {
        const wallet = new QuantumWallet();
        res.json({
            publicKey: wallet.publicKey,
            balance: 0
        });
    });

    return router;
}