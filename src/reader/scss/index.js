const async        = require('async'),
      EventEmitter = require('eventemitter3'),
      fs           = require('fs'),
      gonzales     = require('gonzales-pe'),
      path         = require('path');

const Ast = require('./ast');
const Logger = require('../../util/logger');
const ReaderEvents = require('../../model/reader-events');
const ValueParser = require('./value-parser');
const Variables = require('./variables');

class ScssReader extends EventEmitter {
    constructor(config) {
        super();
        this.logger = Logger(this.constructor.name);
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
            next => {
                let configPath = path.resolve(process.cwd(), entryPath);
                if (DEBUG) {
                    this.logger.verbose(`Loading "${configPath}" config.`);
                }
                fs.readFile(configPath, 'utf8', next);
            },
            (content, next) => {
                let variable;
                let ast = new Ast();
                let parser = new ValueParser();
                let tree = gonzales.parse(content, {syntax: 'scss'});
                let secondPath = [];

                tree.forEach('declaration', (child, index, parent) => {
                    if (ast.containsDeep(child, 'variable') === true) {
                        variable = ast.nodeToVariable(child);

                        if (variable.value === Variables.UNDETERMINED) {
                            secondPath.push(child);
                        } else {
                            parser.parse(variable.name, variable.value);
                        }
                    }
                });

                if (DEBUG) {
                    if (secondPath.length > 0) {
                        this.logger.verbose(`Running second path for ${secondPath.length} variables.`);
                    }
                }

                secondPath.forEach(child => {
                    variable = ast.nodeToVariable(child);
                    parser.parse(variable.name, variable.value);
                });

                this.categories = parser.getCategories();
                this.emit(ReaderEvents.DATA_DID_CHANGE, this.eventTarget);
                next(null);
            }
        ], done);
    }
}

module.exports = ScssReader;
