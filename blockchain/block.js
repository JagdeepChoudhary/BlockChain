const crypto = require('crypto');

class Block {
    constructor(index, previousHash, timestamp, transactions, hash, nonce, difficulty = 4) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.hash = hash;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    static calculateHash(index, previousHash, timestamp, transactions, nonce, difficulty) {
        return crypto
            .createHash('sha3-256')
            .update(
                index +
                previousHash +
                timestamp +
                JSON.stringify(transactions) +
                nonce +
                difficulty
            )
            .digest('hex');
    }
}

module.exports = Block;