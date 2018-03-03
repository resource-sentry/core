const ColorModule = require('./color-module');
const Dimensions = require('./dimensions');
const NodeMath = require('./node-math');
const ValueTypes = require('./value-types');
const Variables = require('./variables');

class Ast {
    constructor() {
        this.colorModule = new ColorModule();
        this.dimensions = new Dimensions();
        this.nodeMath = new NodeMath();

        this.detectionChain = [
            tree => this.nodeMath.getValue(tree),
            tree => this.dimensions.getValue(tree),
            tree => this.colorModule.getValue(tree),
            tree => this.getSimpleNodeValue(tree)
        ];

        this.variables = new Variables();
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

    getSimpleNodeValue(tree) {
        let result = tree.first();

        if (result.is(ValueTypes.VARIABLE) === true) {
            result = this.variables.getVariable(result.content.toString());
        }

        return result;
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

    nodeToVariable(tree) {
        let name = this.nodeToVariableName(tree);
        let value = this.nodeToVariableValue(tree);

        this.variables.setVariable(name, value);

        return {name, value};
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
        let value;
        let node = this.getDeepNodeByType(tree, ValueTypes.VALUE);
        let result = null;

        if (node !== null) {
            value = this.getValue(node);

            console.log('----- VALUE -----');
            console.log(value);
            console.log('-----');

            if (value.hasOwnProperty('content') === true) {
                result = {
                    value: value.content,
                    type : value.type
                };
            } else {
                result = value;
            }
        }

        return result;
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
