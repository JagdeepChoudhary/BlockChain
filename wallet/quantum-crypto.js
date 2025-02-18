const crypto = require('crypto');

class QuantumCrypto {
    static generateKeys() {
        return crypto.generateKeyPairSync('ed448', {
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
        });
    }

    static sign(data, privateKey) {
        const sign = crypto.createSign('SHA3-512');
        sign.update(JSON.stringify(data));
        return sign.sign(privateKey, 'base64');
    }

    static quantumResistantHash(input) {
        return crypto.createHash('blake2b512')
            .update(input)
            .digest('hex');
    }
}

module.exports = QuantumCrypto;