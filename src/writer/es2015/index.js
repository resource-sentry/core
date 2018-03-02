const acorn        = require('acorn'),
      astring      = require('astring'),
      async        = require('async'),
      EventEmitter = require('eventemitter3'),
      fs           = require('graceful-fs'),
      path         = require('path');

const Logger = require('../../util/logger');

module.exports = class Es2015Writer extends EventEmitter {
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
        async.parallel([
            next => {
                this.outputPath = path.resolve(process.cwd(), this.config.path, 'rs.js');
                next(null);
            },
            next => this.getTemplate(next)
        ], done);
    }


    isWriting() {
        return this.writing;
    }

    write({values}, done) {
        this.writing = true;
        fs.writeFile(this.outputPath, this.template, {encoding: 'utf8'}, error => {
            this.writing = false;
            done(error);
        });
    }
};
