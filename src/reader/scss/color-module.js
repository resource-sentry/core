const WebColors = require('./web-colors');
const ValueTypes = require('./value-types');

class ColorModule {
    findIdentifierIndex(tree) {
        let result = -1;
        let i = 0, len = tree.length;

        for (i; i < len; ++i) {
            if (tree.get(i).is('ident') === true) {
                result = i;
                break;
            }
        }
        return result;
    }

    getValue(tree) {
        let node, webColor;
        let type = ValueTypes.COLOR;
        let value = null;
        let index = this.findIdentifierIndex(tree);

        if (index !== -1) {
            node = tree.get(index);
            webColor = WebColors[node.content.toLowerCase()];

            if (webColor !== undefined) {
                value = {type, content: webColor.slice(1)};
            }
        }

        return value;
    }
}

module.exports = ColorModule;
