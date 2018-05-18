let BaseReader = require('@resource-sentry/utils/lib/base-reader');

class MockReader extends BaseReader {
    constructor(values) {
        super();
        this.futureValues = values;
    }

    scan() {
        return Promise
            .resolve()
            .then(() => {
                this.categories = this.futureValues;
                this.dispatch('dataDidChange');
            });
    }
}

module.exports = MockReader;
