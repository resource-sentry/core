const ColorModule = require('./color-module');
const Dimensions = require('./dimensions');
const NodeMath = require('./node-math');

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

        for (i; i < len; ++i) {
            value = this.detectionChain[i](tree);
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
        console.dir(tree, {depth: 8});
        let node = this.getDeepNodeByType(tree, 'value');
        let value;

        if (node !== null) {
            value = this.getValue(node);

            // Values is not found, fallback to first element
            if (value === null) {
                value = node.first();
            }

            console.log(value);
            return {
                value: value.content,
                type : value.type
            }
        }
    }
}

module.exports = Ast;
