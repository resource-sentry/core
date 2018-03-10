const chalk = require('chalk');

const Categories = require('../../model/categories');
const Logger = require('../../util/logger');
const ValueTypes = require('./value-types');

class ValueParser {
    constructor() {
        this.logger = Logger(this.constructor.name);
        this.categories = [];
    }

    addValue(name, value, category) {
        let categoryData = this.categories[category] || [];

        if (DEBUG) {
            this.logger.verbose(`Register Value, name: "${chalk.blue(name)}", data: ${value}, category: ${category}`);
        }

        categoryData.push({name, value});
        this.categories[category] = categoryData;
    }

    getCategories() {
        return this.categories;
    }

    parse(name, valueData) {
        switch (valueData.type) {
            case ValueTypes.DIMENSION:
            case ValueTypes.PERCENTAGE:
                this.addValue(name, valueData.value, Categories.DIMENSION);
                break;
            case ValueTypes.NUMBER:
                this.addValue(name, valueData.value, Categories.VALUE);
                break;
            case ValueTypes.STRING:
                this.addValue(name, valueData.value, Categories.TEXT);
                break;
            case ValueTypes.COLOR:
                this.addValue(name, valueData.value, Categories.COLOR);
                break;
        }
    }
}

module.exports = ValueParser;
