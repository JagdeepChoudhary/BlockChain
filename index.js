const express = require('express');
const Blockchain = require('./blockchain/blockchain');
const P2PNetwork = require('./network/p2p-network');

class Node {
    constructor() {
        this.app = express();
        this.blockchain = new Blockchain();
        this.p2p = new P2PNetwork(this.blockchain);
        this.setupAPI();
    }

    async start(port = 3000) {
        await this.p2p.connect();
        this.server = this.app.listen(port, () => {
            console.log(`Node running on port ${port}`);
            console.log(`Network peers: ${this.p2p.peers.size}`);
        });
    }

    setupAPI() {
        this.app.use('/api', require('./api/routes')(this.blockchain, this.p2p));
    }
}

const node = new Node();
node.start().catch(console.error);