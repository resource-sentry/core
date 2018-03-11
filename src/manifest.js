const path    = require('path'),
      Promise = require('bluebird');

const Constants = require('./model/constants');

class Manifest {
    loadDefault() {
        return this.loadManifest(Constants.MANIFEST);
    }

    loadManifest(manifestPath) {
        return Promise
            .resolve()
            .then(() => require(path.resolve(process.cwd(), manifestPath)));
    }
}

module.exports = Manifest;
