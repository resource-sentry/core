const EventEmitter = require('eventemitter3'),
      fs           = Promise.promisifyAll(require('fs')),
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

    dispose() {
    }

    getAllCategories() {
        return this.categories;
    }

    initWithWatch(service) {
        return Promise
            .resolve()
            .then(() => this.scan(this.config.entry));
    }

    scan(entryPath) {
        return Promise
            .resolve()
            .then(() => {
                let configPath = path.resolve(process.cwd(), entryPath);
                if (DEBUG) {
                    this.logger.verbose(`Loading "${configPath}" config.`);
                }
                return fs.readFileAsync(configPath, 'utf8');
            })
            .then(content => {
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
            });
    }
}

module.exports = ScssReader;
