const ValueTypes = require('./value-types');

class Dimensions {
    getValue(tree) {
        let node, type;
        let value = null;

        if (this.isDimension(tree) === true) {
            node = tree.first();
            type = node.type;

            switch (type) {
                case ValueTypes.DIMENSION:
                    value = {type, content: parseFloat(node.content)};
                    break;
                case ValueTypes.PERCENTAGE:
                    value = {type, content: parseFloat(node.content) / 100};
                    break;
            }
        }

        return value;
    }

    isDimension(tree) {
        let node = tree.first();
        return node.is(ValueTypes.DIMENSION) === true || node.is(ValueTypes.PERCENTAGE) === true;
    }
}

module.exports = Dimensions;
