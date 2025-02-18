const WebSocket = require('ws');
const PeerDiscovery = require('./peer-discovery');

class P2PNetwork {
    constructor(blockchain) {
        this.blockchain = blockchain;
        this.peerDiscovery = new PeerDiscovery();
        this.peers = new Map();
        this.server = new WebSocket.Server({ noServer: true });
    }

    async connect() {
        const peers = await this.peerDiscovery.discoverPeers();
        peers.forEach(peer => this.connectToPeer(peer));
    }

    connectToPeer(peer) {
        const ws = new WebSocket(`ws://${peer}`);
        ws.on('open', () => this.handleNewConnection(ws));
        ws.on('message', message => this.handleMessage(message));
    }

    broadcast(message) {
        this.peers.forEach(peer => {
            if (peer.readyState === WebSocket.OPEN) {
                peer.send(JSON.stringify(message));
            }
        });
    }
}

module.exports = P2PNetwork;