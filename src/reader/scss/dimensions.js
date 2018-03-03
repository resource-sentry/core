const ValueTypes = require('./value-types');

class Dimensions {
    getValue(tree) {
        let node;
        let value = null;
        let type = ValueTypes.DIMENSION;

        if (tree.is(type) === true) {
            node = tree.first();
            value = {type, content: node.content};
        }

        return value;
    }
}

module.exports = Dimensions;
