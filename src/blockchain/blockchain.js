import { BLAKE3 } from '@noble/hashes/blake3';
import { Block } from './block.js';
import { ProofOfStake } from './consensus/proof-of-stake.js';

export class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
        this.pendingTransactions = [];
        this.difficulty = 4;
        this.totalSupply = 0;
        this.maxSupply = 48_000_000;
        this.consensus = new ProofOfStake();
    }

    async mineBlock(validator) {
        if (this.totalSupply >= this.maxSupply) {
            throw new Error('Maximum supply reached');
        }

        const block = new Block({
            index: this.chain.length,
            previousHash: this.lastBlock.hash,
            transactions: this.pendingTransactions,
            validator
        });

        block.hash = await this.proofOfWork(block);
        this.validateBlock(block);

        this.chain.push(block);
        this.pendingTransactions = [];
        this.totalSupply += block.reward;

        return block;
    }

    async proofOfWork(block) {
        let nonce = 0;
        let hash;

        do {
            hash = BLAKE3(block.header + nonce);
            nonce++;
        } while (!hash.startsWith('0'.repeat(this.difficulty)));

        return hash;
    }

    get lastBlock() {
        return this.chain[this.chain.length - 1];
    }
}