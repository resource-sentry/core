const EventEmitter = require('eventemitter3'),
      fsNative     = require('fs'),
      path         = require('path'),
      Promise      = require('bluebird');

const Categories = require('../../model/categories');
const Events = require('../../model/events');
const fs = Promise.promisifyAll(fsNative);
const Logger = require('../../util/logger');

class PropertiesReader extends EventEmitter {
    constructor(config) {
        super();
        this.logger = Logger(this.constructor.name);
        this.config = config;
        this.categories = [];
        this.keyValue = /^(\w+)[=:\s]+([\S\s]+?[^\\])(?=$)/gm;
        this.newLine = /\r?\n|\r/g;
        this.extraSpaces = /\s{2,}/g;
        this.extraLines = /\\/g;
        this.eventTarget = {target: this};
    }

    addValue(categories, category, name, value) {
        let categoryData = categories[category] || [];
        categoryData.push({name, value});
        categories[category] = categoryData;
    }

    dispose() {
    }

    getAllCategories() {
        return this.categories;
    }

    getEntry() {
        return this.config.entry;
    }

    scan() {
        return Promise
            .resolve()
            .then(() => {
                let propertiesFile = path.resolve(process.cwd(), this.getEntry());
                this.logger.verbose(`Loading "${propertiesFile}" properties.`);
                return fs.readFileAsync(propertiesFile, 'utf8');
            })
            .then(content => {
                let result, name, value, category, numericValue;

                this.keyValue.lastIndex = 0;

                while ((result = this.keyValue.exec(content)) !== null) {
                    name = result[1];
                    value = result[2];

                    // Sanitize value
                    value = value
                        .replace(this.newLine, '')
                        .replace(this.extraSpaces, '')
                        .replace(this.extraLines, '')
                        .trim();

                    numericValue = parseFloat(value);
                    category = isNaN(numericValue) === true ? Categories.TEXT : Categories.VALUE;
                    this.addValue(this.categories, category, name, numericValue || value);
                }

                this.emit(Events.READER_DATA_DID_CHANGE, this.eventTarget);
            });
    }
}

module.exports = PropertiesReader;
