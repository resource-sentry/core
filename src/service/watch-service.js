const chokidar = require('chokidar');

const logger = require('../util/logger')('WatchService');

let watcher;

function init(done) {
    watcher = chokidar.watch();

    subscribe(watcher);

    done();
}

function add(path) {
    if (DEBUG) {
        logger.verbose(`"${path}" path is added to a watch list.`);
    }
    watcher.add(path);
}

function subscribe(watcher) {
    if (DEBUG) {
        watcher.on('ready', () => logger.verbose('Watcher is initiated.'));
        ['add', 'addDir', 'change', 'unlink', 'unlinkDir'].forEach(eventType => {
            watcher.on(eventType, path => {
                logger.debug(`${eventType.toUpperCase()} - "${path}"`);
            });
        });
        watcher.on('error', error => logger.error('Error did occur: ' + error));
    }
}

module.exports = {init, add};
