const async        = require('async'),
      EventEmitter = require('eventemitter3'),
      fs           = require('graceful-fs'),
      gonzales     = require('gonzales-pe'),
      path         = require('path');

const Ast = require('./ast');
const ReaderEvents = require('../../model/reader-events');
const ValueParser = require('./value-parser');

class ScssReader extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.categories = [];
        this.eventTarget = {target: this};
    }

    dispose(done) {
        done(null);
    }

    getAllCategories() {
        return this.categories;
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
                let name, value;
                let ast = new Ast();
                let parser = new ValueParser();
                let tree = gonzales.parse(content, {syntax: 'scss'});

                tree.forEach('declaration', (child, index, parent) => {
                    if (ast.containsDeep(child, 'variable') === true) {
                        name = ast.nodeToVariableName(child);
                        value = ast.nodeToVariableValue(child);
                        parser.parse(name, value);
                    }
                });

                this.categories = parser.getCategories();
                this.emit(ReaderEvents.DATA_DID_CHANGE, this.eventTarget);
                next(null);
            }
        ], done);
    }
}

module.exports = ScssReader;
