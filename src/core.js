const async = require('async');

const logger       = require('./util/logger')('Core'),
      watchService = require('./service/watch-service');

function init(done) {
    watchService.init(done);
}

function registerReaders(list, done) {
    async.each(list, (reader, next) => {
        reader.initWithWatch(watchService, next);
    }, done);
}

function start(config) {
    async.waterfall([
        async.apply(init),
        async.apply(registerReaders, config.input)
    ], error => {
        if (error) {
            return logger.error(error);
        }

    });
}

module.exports = {start};
