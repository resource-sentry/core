const ValueTypes = require('./value-types');

class NodeMath {
    getValue(tree) {
        let value = null;

        if (tree.contains(ValueTypes.OPERATOR) === true) {
            value = this.parseFormula(tree);
        }

        return value;
    }

    parseFormula(tree) {
        let node, type;
        let formula = '';
        let i = 0, len = tree.length;
        let value = null;

        for (i; i < len; ++i) {
            node = tree.get(i);
            type = node.type;

            // Exit formula as soon Identifier found
            if (type === ValueTypes.IDENTIFIER) {
                break;
            } else {
                formula += node.content;
            }
        }

        if (type === ValueTypes.NUMBER) {
            value = {type, content: new Function('return ' + formula)()};
        }

        return value;
    }
}

module.exports = NodeMath;
