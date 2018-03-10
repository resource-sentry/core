const Promise = require('bluebird');

const Conductor    = require('./conductor'),
      Logger       = require('./util/logger'),
      WatchService = require('./service/watch-service');

class Core {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.conductor = new Conductor();
    }

    registerReaders(readers) {
        return Promise.each(readers, reader => this.conductor.registerReader(reader));
    }

    registerWriter(writer) {
        return Promise.all([
            writer.init(),
            this.conductor.registerWriter(writer)
        ]);
    }

    /**
     * Main entry point to start a convert process for a static resources.
     *
     * @param {Object} config
     * @param {Object} settings
     */
    start(config, settings) {
        let {output, input} = config;
        let {watch} = settings;

        return Promise
            .resolve()
            .then(() => {
                let options;

                if (watch !== undefined) {
                    if (DEBUG) {
                        this.logger.verbose('Activating file watcher...');
                    }

                    options = {
                        cwd: process.cwd(),
                        ...watch
                    };

                    this.conductor.setWatchService(new WatchService(options));
                }
            })
            .then(() => this.registerWriter(output))
            .then(() => this.registerReaders(input))
            .then(() => this.conductor.scanIfNeeded())
            .catch(error => this.logger.error(error));
    }
}

module.exports = Core;
