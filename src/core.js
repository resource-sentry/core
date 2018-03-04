const Conductor    = require('./conductor'),
      Logger       = require('./util/logger'),
      WatchService = require('./service/watch-service');

class Core {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.conductor = new Conductor();
    }

    init(settings) {
        let {watch} = settings;
        this.watchService = new WatchService();
    }

    registerReaders(readers) {
        return Promise
            .each(
                readers,
                reader => {
                    return Promise.all([
                        reader.initWithWatch(this.watchService),
                        this.conductor.registerReader(reader)
                    ]);
                }
            );
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

        return Promise
            .resolve()
            .then(() => this.init(settings))
            .then(() => this.registerWriter(output))
            .then(() => this.registerReaders(input))
            .catch(error => this.logger.error(error));
    }
}

module.exports = Core;
