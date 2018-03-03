const ValueTypes = require('./value-types');

class NodeMath {
    getValue(tree) {
        let formula = '';
        let type = null;
        let value = null;

        if (tree.contains(ValueTypes.OPERATOR) === true) {

            tree.forEach(node => {
                type = node.type;
                formula += node.content;
            });

            value = {type, content: new Function('return ' + formula)()};
        }

        return value;
    }
}

module.exports = NodeMath;
