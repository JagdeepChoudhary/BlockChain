import WebSocket from 'ws';
import { BLAKE3 } from '@noble/hashes/blake3';

export class P2PNetwork {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.sockets = [];
        this.server = new WebSocket.Server({ port: 6001 });

        this.server.on('connection', (ws) => {
            this.handleConnection(ws);
            this.sendChain(ws);
        });
    }

    handleConnection(ws) {
        ws.on('message', (message) => {
            try {
                const { type, data, signature } = JSON.parse(message);
                if (!this.validateMessage(type, data, signature)) {
                    ws.close(1008, 'Invalid signature');
                    return;
                }

                switch (type) {
                    case 'BLOCK':
                        this.handleBlock(data);
                        break;
                    case 'TRANSACTION':
                        this.handleTransaction(data);
                        break;
                }
            } catch (error) {
                ws.close(1007, 'Invalid message format');
            }
        });
    }

    validateMessage(type, data, signature) {
        const publicKey = data.sender || data.validator;
        const hash = BLAKE3(type + JSON.stringify(data));
        return QuantumWallet.verify(hash, signature, publicKey);
    }
}