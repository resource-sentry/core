const ColorModule = require('./color-module');
const Dimensions = require('./dimensions');
const NodeMath = require('./node-math');
const ValueTypes = require('./value-types');

class Ast {
    constructor() {
        this.colorModule = new ColorModule();
        this.dimensions = new Dimensions();
        this.nodeMath = new NodeMath();
        this.detectionChain = [
            tree => this.dimensions.getValue(tree),
            tree => this.colorModule.getValue(tree),
            tree => this.nodeMath.getValue(tree)
        ];
    }

    containsDeep(tree, type) {
        if (tree) {
            return !!this.getDeepNodeByType(tree, type);
        }
        return false;
    }

    getDeepNodeByType(tree, type) {
        let i = 0, len = tree.length, child;
        for (i; i < len; ++i) {
            child = tree.get(i);

            if (child.is(type)) {
                return child;
            }

            child = this.getDeepNodeByType(child, type);

            if (child) {
                return child;
            }
        }
        return null;
    }

    getValue(tree) {
        let i = 0, len = this.detectionChain.length;
        let value = null;
        let node = this.openParentheses(tree);

        for (i; i < len; ++i) {
            value = this.detectionChain[i](node);
            if (value !== null) {
                break;
            }
        }

        return value;
    }

    nodeToVariableName(tree) {
        let node = this.getDeepNodeByType(tree, 'variable');
        if (node !== null) {
            return node.first().content;
        }
    }

    nodeToVariableValue(tree) {
        console.log('-----');
        console.dir(tree, {depth: 8});
        let node = this.getDeepNodeByType(tree, ValueTypes.VALUE);
        let value;

        if (node !== null) {
            value = this.getValue(node);

            // Values is not found, fallback to first element
            if (value === null) {
                value = node.first();
            }

            console.log('----- VALUE -----');
            console.log(value);
            console.log('-----');
            return {
                value: value.content,
                type : value.type
            }
        }
    }

    openParentheses(tree) {
        let result = tree;

        if (tree.contains(ValueTypes.PARENTHESES) === true) {
            result = tree.first();
            result.type = ValueTypes.VALUE;
        }

        return result;
    }
}

module.exports = Ast;
