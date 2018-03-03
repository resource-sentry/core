const async = require('async');

const Conductor    = require('./conductor'),
      Logger       = require('./util/logger'),
      watchService = require('./service/watch-service');

class Core {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.conductor = new Conductor();
    }

    init(done) {
        watchService.init(done);
    }

    registerReaders(list, done) {
        async.each(list, (reader, next) => {
            async.parallel([
                callback => reader.initWithWatch(watchService, callback),
                callback => this.conductor.registerReader(reader, callback)
            ], next);
        }, done);
    }

    registerWriter(writer, done) {
        async.parallel([
            callback => writer.init(callback),
            callback => this.conductor.registerWriter(writer, callback)
        ], done);
    }

    start({output, input}) {
        async.series([
            next => this.init(next),
            next => this.registerWriter(output, next),
            next => this.registerReaders(input, next)
        ], error => {
            if (error !== null) {
                return this.logger.error(error);
            }
        });
    }
}

module.exports = Core;
