const Logger       = require('./util/logger'),
      ResourceData = require('./model/resource-data');

const ReaderEvents = require('./model/reader-events');

const {VALUE} = require('./model/categories');

module.exports = class Conductor {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.readers = new Map();
        this.dataPostponed = false;
        this.writer = null;
    }

    addReaderListeners(target) {
        target.addListener(ReaderEvents.VALUES_DID_CHANGE, event => this.valuesDidChange(event));
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

    registerReader(reader, done) {
        this.readers.set(reader, []);
        this.addReaderListeners(reader);
        done(null);
    }

    registerWriter(writerRef, done) {
        this.writer = writerRef;
        done(null);
    }

    valuesDidChange(e) {
        let reader = e.target;
        let data = this.readers.get(reader);
        data[VALUE] = reader.getValues();
        process.nextTick(() => this.invalidate());
    }

    writeNow(done) {
        let categoryData;
        let categories = [VALUE];
        let resourceData = new ResourceData();

        if (DEBUG) {
            this.logger.verbose('Writing data...');
        }

        this.readers.forEach((data, reader) => {
            categories.forEach(category => {
                categoryData = data[category];
                if (categoryData !== undefined) {
                    resourceData.appendData(category, categoryData);
                }
            });
        });

        this.dataPostponed = false;
        this.writer.write(resourceData.getOutput(), done);
    }
};
