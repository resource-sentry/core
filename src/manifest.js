const path    = require('path'),
      Promise = require('bluebird');

class Manifest {
    loadDefault() {
        return this.loadManifest('rs.config.js');
    }

    loadManifest(manifestPath) {
        return Promise
            .resolve()
            .then(() => require(path.resolve(process.cwd(), manifestPath)));
    }
}

module.exports = Manifest;
