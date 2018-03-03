class NodeMath {
    getValue(tree) {
        let formula = '';
        let type = null;
        let value = null;

        if (this.isOperation(tree) === true) {
            tree.forEach(node => {
                type = node.type;
                formula += node.content;
            });
            
            value = {type, content: new Function('return ' + formula)()};
        }

        return value;
    }

    isOperation(tree) {
        let result = false;
        let i = 0, len = tree.length;

        for (i; i < len; ++i) {
            if (tree.get(i).is('operator') === true) {
                result = true;
                break;
            }
        }
        return result;
    }
}

module.exports = NodeMath;
