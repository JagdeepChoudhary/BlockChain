class POSConsensus {
    constructor() {
        this.validators = new Map();
        this.minStake = 1000;
        this.slashConditions = new Set();
    }

    registerValidator(validator, stake) {
        if (stake >= this.minStake) {
            this.validators.set(validator, {
                stake,
                active: true,
                jailed: false,
                lastActive: Date.now()
            });
        }
    }

    getVotingPower(validator) {
        const v = this.validators.get(validator);
        return v ? v.stake * (v.active ? 1 : 0) : 0;
    }

    checkSlashConditions(block) {
        this.slashConditions.forEach(condition => {
            if (condition(block)) {
                this.slashValidator(block.validator);
            }
        });
    }

    slashValidator(validator) {
        const v = this.validators.get(validator);
        if (v) {
            v.stake *= 0.95;
            v.jailed = true;
            setTimeout(() => v.jailed = false, 86400000); // Jail for 24 hours
        }
    }
}

module.exports = POSConsensus;