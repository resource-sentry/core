const NodeMath = require('./node-math');

class Ast {
    constructor() {
        this.nodeMath = new NodeMath();
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

            // Simple variable
            if (node.length === 1) {
                value = node.first();
            } else {
                value = this.nodeMath.getValue(node);

                // Math is not possible, fallback to first element
                if (value === null) {
                    value = node.first();
                }
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
