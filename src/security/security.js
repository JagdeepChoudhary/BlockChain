const crypto = require('crypto');

class SecurityFramework {
    static validateTransaction(tx) {
        const verifier = crypto.createVerify('SHA384');
        verifier.update(tx.sender + tx.recipient + tx.amount);
        return verifier.verify(tx.sender, tx.signature);
    }

    static sanitizeInput(input) {
        return Object.entries(input).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'string' ?
                value.replace(/[^a-zA-Z0-9]/g, '') : value;
            return acc;
        }, {});
    }

    static encryptData(data, publicKey) {
        const cipher = crypto.publicEncrypt(publicKey, Buffer.from(data));
        return cipher.toString('base64');
    }
}

module.exports = SecurityFramework;