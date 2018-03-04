const async        = require('async'),
      EventEmitter = require('eventemitter3'),
      fs           = require('fs'),
      path         = require('path'),
      prettier     = require('prettier');

const CodeGenerator = require('./code-generator'),
      Logger        = require('../../util/logger');

const {CATEGORY_SIZE, RESOURCE_SIZE} = require('../../model/constants');

class Es2015Writer extends EventEmitter {
    constructor(config) {
        super();
        this.logger = Logger(this.constructor.name);
        this.config = config;
        this.outputPath = null;
        this.writing = false;
        this.template = null;
    }

    dispose(done) {
        done(null);
    }

    getTemplate(done) {
        async.waterfall([
            next => {
                if (this.template === null) {
                    fs.readFile(path.resolve(__dirname, './output.tpl'), 'utf8', (error, data) => {
                        if (error) {
                            return next(error);
                        }

                        if (DEBUG) {
                            this.logger.verbose('Resource template is loaded.');
                        }

                        this.template = data;
                        next(null, data);
                    });
                } else {
                    next(null, this.template);
                }
            }
        ], done);
    }

    init(done) {
        this.outputPath = path.resolve(process.cwd(), this.config.path, 'rs.js');
        this.getTemplate(done);
    }

    isWriting() {
        return this.writing;
    }

    write(content, done) {
        async.waterfall([
            next => {
                this.writing = true;
                next(null, this.template);
            },
            (template, next) => {
                let head = template
                    .replace('%CATEGORY_SIZE%', CATEGORY_SIZE)
                    .replace('%RESOURCE_SIZE%', RESOURCE_SIZE);
                next(null, head);
            },
            (template, next) => {
                let generator = new CodeGenerator(content);
                let body = template
                    .replace('%KEYS%', generator.getKeys())
                    .replace('%DATA%', generator.getData());
                next(null, body);
            },
            (output, next) => next(null, prettier.format(output, {
                bracketSpacing: false,
                singleQuote   : true
            }))
        ], (error, data) => {
            if (error !== null) {
                return done(error);
            }
            fs.writeFile(this.outputPath, data, {encoding: 'utf8'}, error => {
                this.writing = false;
                done(error);
            });
        });
    }
}

module.exports = Es2015Writer;
