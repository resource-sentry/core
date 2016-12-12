function containsDeep(tree, type) {
    if (tree) {
        return !!getDeepNodeByType(tree, type);
    }
    return false;
}

function getDeepNodeByType(tree, type) {
    let i = 0, len = tree.length, child;
    for (i; i < len; ++i) {
        child = tree.get(i);

        if (child.is(type)) {
            return child;
        }

        child = getDeepNodeByType(child, type);

        if (child) {
            return child;
        }
    }
    return null;
}

function nodeToVariableName(tree) {
    let node = getDeepNodeByType(tree, 'variable');
    if (node !== null) {
        return node.first().content;
    }
}

function nodeToVariableValue(tree) {
    let node = getDeepNodeByType(tree, 'value'),
        value;
    if (node !== null) {
        value = node.first();
        return {
            value: value.content,
            type : value.type
        }
    }
}

module.exports = {containsDeep, nodeToVariableName, nodeToVariableValue};
