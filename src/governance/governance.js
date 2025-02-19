class Governance {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.proposals = new Map();
        this.votingPeriod = 604800; // 7 days in seconds
    }

    createProposal(type, data, proposer) {
        const proposal = {
            id: crypto.randomUUID(),
            type,
            data,
            proposer,
            votes: new Map(),
            status: 'pending',
            startTime: Date.now()
        };
        this.proposals.set(proposal.id, proposal);
        return proposal;
    }

    vote(proposalId, validator, support) {
        const proposal = this.proposals.get(proposalId);
        if (!proposal || Date.now() > proposal.startTime + this.votingPeriod) return false;

        const votingPower = this.blockchain.consensus.getVotingPower(validator);
        proposal.votes.set(validator, { support, power: votingPower });
        return true;
    }

    executeProposal(proposalId) {
        const proposal = this.proposals.get(proposalId);
        if (!proposal || proposal.status !== 'passed') return;

        switch (proposal.type) {
            case 'PARAM_CHANGE':
                this.executeParameterChange(proposal.data);
                break;
            case 'UPGRADE':
                this.executeProtocolUpgrade(proposal.data);
                break;
        }
        proposal.status = 'executed';
    }
}

module.exports = Governance;