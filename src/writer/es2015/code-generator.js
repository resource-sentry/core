const Categories = require('../../model/categories');
const CategoryNames = require('../../model/category-names');
const Constants = require('../../model/constants');

class CodeGenerator {
    constructor(categories) {
        this.categories = categories.map((values, category) => this.getKeyCodes(values, category));
    }

    convertVariableName(name) {
        return name
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/-/g, '_')
            .toUpperCase();
    }

    convertVariableValue(data, category) {
        switch (category) {
            case Categories.VALUE:
            case Categories.DIMENSION:
                return parseFloat(data);
            case Categories.COLOR:
                return parseInt(data, 16);
            default:
                return data;
        }
    }

    getData() {
        let output = [];
        let properties;

        this.categories.forEach((category, code) => {
            properties = category.map(({id, value}) => `'${id}':${JSON.stringify(value)}`);
            output.push(`// ${CategoryNames[code]}`);
            output.push(`data[${code}] = {${properties}};`);
        });

        return output.join('\n');
    }

    getKeyCodes(values, category) {
        let valueDescription;
        let i = 0, len = values.length;
        let result = [];
        let name, id, value;

        for (i; i < len; ++i) {
            valueDescription = values[i];
            id = (category << Constants.RESOURCE_SIZE) + i;
            name = this.convertVariableName(valueDescription.name);
            value = this.convertVariableValue(valueDescription.value, category);
            result.push({name, id, value});
        }
        return result;
    }

    getKeys() {
        let output = [];
        let properties;

        this.categories.forEach((category, code) => {
            properties = category.map(({name, id}) => `${name}:${id}`);
            output.push(`export let ${CategoryNames[code]} = {${properties}};`);
        });

        return output.join('\n');
    }
}

module.exports = CodeGenerator;
