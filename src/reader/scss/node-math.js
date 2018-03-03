const ValueTypes = require('./value-types');

class NodeMath {
    getNumericValue(node) {
        if (node.length > 0) {
            return this.getNumericValue(node.first());
        } else {
            return node.content;
        }
    }

    getValue(tree) {
        let value = null;

        if (tree.contains(ValueTypes.OPERATOR) === true
            && tree.contains(ValueTypes.IDENTIFIER) === false
            && tree.contains(ValueTypes.STRING) === false) {
            value = this.parseFormula(tree);
        }

        return value;
    }

    parseFormula(tree) {
        let node;
        let formula = '';
        let i = 0, len = tree.length;
        let dimensions = false;

        for (i; i < len; ++i) {
            node = tree.get(i);

            // Mark all formula as a dimension
            if (node.type === ValueTypes.DIMENSION) {
                dimensions = true;
            }

            formula += this.getNumericValue(node);
        }

        return {
            type   : (dimensions === true) ? ValueTypes.DIMENSION : ValueTypes.NUMBER,
            content: new Function('return ' + formula)()
        };
    }
}

module.exports = NodeMath;
