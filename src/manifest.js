const path    = require('path'),
      Promise = require('bluebird');

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
