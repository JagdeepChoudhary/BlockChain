const Block = require('./block');
const Governance = require('../governance/governance');
const POSConsensus = require('./pos-consensus');

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.totalSupply = 0;
        this.maxSupply = 48000000;
        this.governance = new Governance(this);
        this.consensus = new POSConsensus();
        this.shards = new Map();
    }

    createGenesisBlock() {
        return new Block(
            0,
            '0',
            Date.now(),
            [],
            Block.calculateHash(0, '0', Date.now(), [], 0, 4),
            0,
            4
        );
    }

    async mineBlock(miner) {
        if (this.totalSupply >= this.maxSupply) throw new Error('Max supply reached');

        const block = this.consensus.createBlock(
            this.chain.length,
            this.lastBlock().hash,
            this.pendingTransactions
        );

        if (this.consensus.validateBlock(block)) {
            this.chain.push(block);
            this.distributeRewards(miner);
            this.pendingTransactions = [];
            return block;
        }
    }

    distributeRewards(miner) {
        const reward = this.calculateReward();
        this.totalSupply += reward;
        this.pendingTransactions.push(this.createCoinbaseTx(miner, reward));
    }

    calculateReward() {
        const halvings = Math.floor(this.chain.length / 210000);
        return Math.min(50 / Math.pow(2, halvings), this.maxSupply - this.totalSupply);
    }
}

module.exports = Blockchain;