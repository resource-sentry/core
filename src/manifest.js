const path = require('path');

const Constants = require('./model/constants');

class Manifest {
    loadDefault() {
        return this.loadManifest(path.resolve(process.cwd(), Constants.MANIFEST));
    }

    loadManifest(path) {
        return Promise
            .resolve()
            .then(() => require(path));
    }
}

module.exports = Manifest;
