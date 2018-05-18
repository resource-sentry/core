let BaseWriter = require('@resource-sentry/utils/lib/base-writer'),
    Promise    = require('bluebird');

class MockWriter extends BaseWriter {
    constructor() {
        super();
        this.writing = false;
    }

    isWriting() {
        return this.writing;
    }

    write(content) {
        this.writing = true;
        return Promise
            .resolve()
            .then(() => {
                this.writing = false;
            });
    }
}

module.exports = MockWriter;
