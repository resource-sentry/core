const chalk        = require('chalk'),
      {FSWatcher}  = require('chokidar'),
      EventEmitter = require('eventemitter3');

const Events = require('../model/events');
const Logger = require('../util/logger');
const WatcherEvents = require('../model/watcher-events');

class WatchService extends EventEmitter {
    constructor(options = null) {
        super();
        this.logger = Logger(this.constructor.name);
        this.watcher = new FSWatcher(options);

        this.watcher.on(WatcherEvents.READY, () => this.logger.verbose('Watcher is initiated.'));
        this.watcher.on(WatcherEvents.ERROR, error => this.logger.error('Error did occur: ' + error));
        this.watcher.on(WatcherEvents.ALL, (eventType, path) => {
            if (eventType === WatcherEvents.CHANGE) {
                this.logger.verbose(`File at "${chalk.blue(path)}" has been changed.`);
                this.emit(Events.FILE_DID_CHANGE, {
                    target: this,
                    path
                });
            }

        });
    }

    add(path) {
        this.logger.verbose(`Path "${chalk.blue(path)}" is added to a watch list.`);
        this.watcher.add(path);
    }
}

module.exports = WatchService;
