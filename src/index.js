const Core = require('./core');

module.exports = manifest => {
    let {config, settings} = manifest;
    return new Core().start(config, settings);
};
