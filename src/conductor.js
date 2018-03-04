const Logger       = require('./util/logger'),
      ResourceData = require('./model/resource-data');

const ReaderEvents = require('./model/reader-events');

class Conductor {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.readers = [];
        this.dataPostponed = false;
        this.writer = null;
    }

    addReaderListeners(target) {
        target.addListener(ReaderEvents.DATA_DID_CHANGE, event => this.dataDidChange(event));
    }

    dataDidChange(e) {
        process.nextTick(() => this.invalidate());
    }

    invalidate() {
        if (this.writer.isWriting()) {
            if (DEBUG) {
                this.logger.warn('Invalidation is postponed');
            }
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

    writeNow(done) {
        let resourceData = new ResourceData();

        if (DEBUG) {
            this.logger.verbose('Writing data...');
        }

        this.readers.forEach(reader => {
            resourceData.mergeData(reader.getAllCategories());
        });

        this.dataPostponed = false;
        this.writer.write(resourceData.getOutput(), done);
    }
}

module.exports = Conductor;
