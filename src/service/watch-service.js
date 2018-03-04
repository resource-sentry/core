const chokidar = require('chokidar');

const Logger = require('../util/logger');

class WatchService {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.watcher = chokidar.watch();

        this.watcher.on('ready', () => this.logger.verbose('Watcher is initiated.'));
        this.watcher.on('error', error => this.logger.error('Error did occur: ' + error));

        ['add', 'addDir', 'change', 'unlink', 'unlinkDir'].forEach(eventType => {
            this.watcher.on(eventType, path => {
                this.logger.debug(`${eventType.toUpperCase()} - "${path}"`);
            });
        });
    }

    add(path) {
        if (DEBUG) {
            this.logger.verbose(`"${path}" path is added to a watch list.`);
        }
        this.watcher.add(path);
    }
}

module.exports = WatchService;
