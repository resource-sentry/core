global.DEBUG = true;
global.Promise = require('bluebird');

const Core     = require('./core'),
      Manifest = require('./manifest');

Promise
    .resolve()
    .then(() => new Manifest().loadDefault())
    .then(manifest => {
        let {config, settings} = manifest;
        return new Core().start(config, settings);
    });
