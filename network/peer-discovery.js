const dns = require('dns');

class PeerDiscovery {
    async queryDNS(node) {
        try {
            const records = await dns.resolveTxt(`_peers.${node}`);
            return records.flat();
        } catch (error) {
            return [];
        }
    }
    async discoverPeers() {
        try {
            await Promise.all(
                this.bootstrapNodes.map(async node => {
                    const peers = await this.queryDNS(node);
                    peers.forEach(peer => this.addPeer(peer));
                })
            );
            return Array.from(this.knownPeers);
        } catch (error) {
            return [];
        }
    }

    async queryDNS(node) {
        return new Promise((resolve, reject) => {
            dns.resolveTxt(`_peers.${node}`, (err, records) => {
                if (err) return reject(err);
                resolve(records.flat());
            });
        });
    }

    addPeer(peer) {
        if (!this.knownPeers.has(peer)) {
            this.knownPeers.add(peer);
            this.checkPeerHealth(peer);
        }
    }

    async checkPeerHealth(peer) {
        try {
            const response = await fetch(`http://${peer}/health`);
            if (response.ok) this.activePeers.add(peer);
        } catch (error) {
            this.activePeers.delete(peer);
        }
    }
}

module.exports = PeerDiscovery;