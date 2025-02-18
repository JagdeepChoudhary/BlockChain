const crypto = require('crypto');
const QuantumCrypto = require('./quantum-crypto');

class QuantumResistantWallet {
    constructor() {
        const { publicKey, privateKey } = QuantumCrypto.generateKeys();
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.balance = 0;
    }

    createTransaction(recipient, amount) {
        const tx = {
            sender: this.publicKey,
            recipient,
            amount,
            timestamp: Date.now()
        };

        tx.signature = this.signTransaction(tx);
        return tx;
    }

    signTransaction(tx) {
        return QuantumCrypto.sign(tx, this.privateKey);
    }
}

module.exports = QuantumResistantWallet;