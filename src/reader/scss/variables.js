class Variables {
    constructor() {
        this.scope = {};
    }

    getVariable(reference) {
        let value = this.scope[reference];
        if (value === undefined) {
            value = Variables.UNDETERMINED;
        }
        return value;
    }

    setVariable(reference, value) {
        this.scope[reference] = value;
    }
}

Variables.UNDETERMINED = Symbol();

module.exports = Variables;
