const Promise = require('bluebird');

const Events       = require('./model/events'),
      Logger       = require('./util/logger'),
      ResourceData = require('./model/resource-data');

class Conductor {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.readers = [];
        this.dataPostponed = false;
        this.writer = null;
        this.watchService = null;
    }

    addReaderListeners(target) {
        target.addListener(Events.FILE_DID_CHANGE, event => this.dataDidChange(event));
    }

    dataDidChange(e) {
        process.nextTick(() => this.invalidate());
    }

    invalidate() {
        if (this.writer.isWriting()) {
            this.logger.warn('Invalidation is postponed');
            this.dataPostponed = true;
        } else {
            this.writeNow(() => {
                // Start invalidation process if there was postponed data for a write
                if (this.dataPostponed === true) {
                    this.invalidate();
                }
            });
        }
    }

    registerReader(reader) {
        return Promise
            .resolve()
            .then(() => {
                this.readers.push(reader);
                this.addReaderListeners(reader);
            });
    }

    registerWriter(writerRef) {
        return Promise
            .resolve()
            .then(() => {
                this.writer = writerRef;
            });
    }

    scan() {
        return Promise.each(this.readers, reader => reader.scan());
    }

    scanIfNeeded() {
        if (this.watchService === null) {
            return this.scan();
        } else {
            this.readers.forEach(reader => {
                this.watchService.add(reader.getEntry());
            });
        }
    }

    setWatchService(service) {
        if (service !== null) {
            this.watchService = service;
            this.watchService.addListener(Events.FILE_DID_CHANGE, () => this.scan());
        }
    }

    writeNow(done) {
        let resourceData = new ResourceData();

        this.logger.verbose('Writing data...');

        this.readers.forEach(reader => {
            resourceData.mergeData(reader.getAllCategories());
        });

        this.dataPostponed = false;
        this.writer.write(resourceData.getOutput(), done);
    }
}

module.exports = Conductor;
