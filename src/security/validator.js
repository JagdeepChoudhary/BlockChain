const SecurityFramework = require('./security');

class Validator {
    constructor(blockchain, publicKey) {
        this.blockchain = blockchain;
        this.publicKey = publicKey;
        this.votingPower = 0;
        this.reputation = 100;
    }

    validateBlock(block) {
        return SecurityFramework.verifyBlockSignature(block) &&
            SecurityFramework.validateTransaction(block.transactions) &&
            this.checkBlockConsensusRules(block);
    }

    proposeBlock(transactions) {
        return this.blockchain.consensus.createBlock(
            this.blockchain.chain.length + 1,
            this.blockchain.lastBlock().hash,
            transactions
        );
    }

    participateInGovernance(proposalId, support) {
        this.blockchain.governance.vote(proposalId, this.publicKey, support);
    }
}

module.exports = Validator;