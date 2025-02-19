class Shard {
    constructor(id, parentChain) {
        this.id = id;
        this.parentChain = parentChain;
        this.localChain = [];
        this.validators = [];
        this.crossShardTxs = [];
    }

    processTransaction(tx) {
        if (this.validateTransaction(tx)) {
            this.localChain.push(tx);
            return true;
        }
        return false;
    }

    finalizeBlock() {
        const block = {
            shardId: this.id,
            transactions: this.localChain,
            timestamp: Date.now(),
            previousHash: this.lastBlockHash()
        };
        this.localChain = [];
        return block;
    }

    handleCrossShardTx(tx) {
        this.crossShardTxs.push(tx);
    }
}

module.exports = Shard;