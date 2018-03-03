const clone = require('clone');

class Variables {
    constructor() {
        this.scope = {};
    }

    getVariable(reference, pointer = true) {
        let value = this.scope[reference];
        if (value === undefined) {
            value = Variables.UNDETERMINED;
        } else {
            value = (pointer === true) ? value : clone(value);
        }
        return value;
    }

    setVariable(reference, value) {
        this.scope[reference] = value;
    }
}

Variables.UNDETERMINED = Symbol();

module.exports = Variables;
