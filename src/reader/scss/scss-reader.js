const async        = require('async'),
      EventEmitter = require('eventemitter3'),
      fs           = require('graceful-fs'),
      gonzales     = require('gonzales-pe'),
      path         = require('path');

const ReaderEvents = require('../../model/reader-events');
const {containsDeep, nodeToVariableName, nodeToVariableValue} = require('../../util/ast');

module.exports = class ScssReader extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.data = {};
        this.eventTarget = {target: this};
    }

    dispose(done) {
        done(null);
    }

    getValues() {
        return this.data.values;
    }

    initWithWatch(service, done) {
        async.waterfall([
            next => this.scan(this.config.entry, next)
        ], done);
    }

    scan(entryPath, done) {
        async.waterfall([
            async.apply(fs.readFile, path.resolve(process.cwd(), entryPath), 'utf8'),
            (content, next) => {
                let tree   = gonzales.parse(content, {syntax: 'scss'}),
                    values = {};

                tree.forEach('declaration', (child, index, parent) => {
                    if (containsDeep(child, 'variable') === true) {
                        values[nodeToVariableName(child)] = nodeToVariableValue(child);
                    }
                });

                this.data.values = values;
                this.emit(ReaderEvents.VALUES_DID_CHANGE, this.eventTarget);
                next(null);
            }
        ], done);
    }
};
