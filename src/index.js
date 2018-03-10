global.DEBUG = true;

const Core     = require('./core'),
      Manifest = require('./manifest'),
      Promise  = require('bluebird');

Promise
    .resolve()
    .then(() => new Manifest().loadDefault())
    .then(manifest => {
        let {config, settings} = manifest;
        return new Core().start(config, settings);
    });
