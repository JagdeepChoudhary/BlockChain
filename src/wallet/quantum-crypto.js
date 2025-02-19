import { ed25519 } from '@noble/curves/ed25519';
import { BLAKE3 } from '@noble/hashes/blake3';

export class QuantumWallet {
    constructor() {
        this.privateKey = ed25519.utils.randomPrivateKey();
        this.publicKey = ed25519.getPublicKey(this.privateKey);
    }

    createTransaction(receiver, amount) {
        const tx = {
            sender: this.publicKey,
            receiver,
            amount,
            timestamp: Date.now()
        };

        tx.signature = this.sign(tx);
        return tx;
    }

    sign(data) {
        const hash = BLAKE3(JSON.stringify(data));
        return ed25519.sign(hash, this.privateKey);
    }

    static verify(data, signature, publicKey) {
        const hash = BLAKE3(JSON.stringify(data));
        return ed25519.verify(signature, hash, publicKey);
    }
}