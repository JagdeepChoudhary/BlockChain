import { BLAKE3 } from '@noble/hashes/blake3';

export class Block {
    static genesis() {
        return new this({
            index: 0,
            previousHash: '0',
            transactions: [],
            validator: 'genesis'
        });
    }

    constructor({ index, previousHash, transactions, validator }) {
        this.index = index;
        this.previousHash = previousHash;
        this.timestamp = Date.now();
        this.transactions = transactions;
        this.validator = validator;
        this.nonce = 0;
        this.hash = '';
        this.reward = this.calculateReward();
    }

    calculateReward() {
        const halvings = Math.floor(this.index / 210000);
        return 50 / Math.pow(2, halvings);
    }

    get header() {
        return JSON.stringify({
            index: this.index,
            previousHash: this.previousHash,
            timestamp: this.timestamp,
            transactionRoot: BLAKE3(JSON.stringify(this.transactions)),
            validator: this.validator,
            reward: this.reward
        });
    }
}