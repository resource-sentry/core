const async        = require('async'),
      EventEmitter = require('eventemitter3'),
      fs           = require('graceful-fs'),
      gonzales     = require('gonzales-pe'),
      path         = require('path'),
      util         = require('util');

const readerEvents = require('../../model/reader-events');
const {containsDeep, nodeToVariableName, nodeToVariableValue} = require('../../util/ast');

util.inherits(ScssReader, EventEmitter);

function ScssReader(config) {
    EventEmitter.call(this);

    this.config = config;
    this.data = {};
}

ScssReader.prototype.initWithWatch = function (service, done) {
    async.waterfall([
        next => this.scan(this.config.entry, next)
    ], done);
};

ScssReader.prototype.getValues = function () {
    return this.data.values;
};

ScssReader.prototype.dispose = function (done) {

};

ScssReader.prototype.scan = function (entryPath, done) {
    fs.readFile(path.resolve(process.cwd(), entryPath), 'utf8', (error, data) => {
        if (error) {
            return done(error);
        }

        let tree   = gonzales.parse(data, {syntax: 'scss'}),
            values = {};

        tree.forEach('declaration', (child, index, parent) => {
            if (containsDeep(child, 'variable')) {
                values[nodeToVariableName(child)] = nodeToVariableValue(child);
            }
        });

        console.dir(tree, {depth: null, colors: true});
        console.dir(values);
        this.data.values = values;
        this.emit(readerEvents.VALUES_DID_CHANGE);
        done(null);
    })
};

module.exports = ScssReader;
