const CategoryNames = require('../../model/category-names');
const {RESOURCE_SIZE} = require('../../model/constants');

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

    convertVariableValue(data) {
        return parseFloat(data);
    }

    getData() {
        let output = [];
        let properties;

        this.categories.forEach((category, code) => {
            properties = category.map(({id, value}) => `'${id}':${value}`);
            output.push(`// ${CategoryNames[code]}`);
            output.push(`{${properties}},`);
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
            id = (category << RESOURCE_SIZE) + i;
            name = this.convertVariableName(valueDescription.name);
            value = this.convertVariableValue(valueDescription.value);
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
