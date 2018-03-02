const {CATEGORY_SIZE, RESOURCE_SIZE} = require('../../model/constants');

class CodeGenerator {
    constructor(categories) {
        this.keyCodes = categories.map((values, category) => this.getKeyCodes(values, category));
    }

    convertVariableName(name) {
        return name
            .replace(/(?!^)[A-Z]/g, '-$&')
            .replace(/-/g, '_')
            .toUpperCase();
    }

    convertVariableValue(data) {
        return parseFloat(data.value);
    }

    getData() {
        return 'data';
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
        return 'keys';
    }
}

module.exports = CodeGenerator;
