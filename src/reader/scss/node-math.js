class NodeMath {
    constructor() {

    }

    static isOperation(tree) {
        let result = false;
        let i = 0, len = tree.length;

        for (i; i < len; ++i) {
            if (tree.get(i).type === 'operator') {
                result = true;
                break;
            }
        }
        return result;
    }
}
