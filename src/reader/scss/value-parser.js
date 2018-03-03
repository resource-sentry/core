const Categories = require('../../model/categories');
const ValueTypes = require('./value-types');

class ValueParser {
    constructor() {
        this.categories = [];
    }

    addValue(name, value, category) {
        let categoryData = this.categories[category] || [];
        categoryData.push({name, value});
        this.categories[category] = categoryData;
    }

    getCategories() {
        return this.categories;
    }

    parse(name, valueData) {
        switch (valueData.type) {
            case ValueTypes.NUMBER:
                this.addValue(name, valueData.value, Categories.VALUE);
                break;
        }
    }
}

module.exports = ValueParser;
