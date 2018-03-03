const WebColors = require('./web-colors');
const WebColorsExtended = require('./web-colors-extended');
const ValueTypes = require('./value-types');

class ColorModule {
    findIdentifierIndex(tree) {
        let result = -1;
        let i = 0, len = tree.length;

        for (i; i < len; ++i) {
            if (tree.get(i).is(ValueTypes.IDENTIFIER) === true) {
                result = i;
                break;
            }
        }
        return result;
    }

    getValue(tree) {
        let node, webColor, colorName;
        let type = ValueTypes.COLOR;
        let value = null;
        let index = this.findIdentifierIndex(tree);

        if (index !== -1) {
            node = tree.get(index);
            colorName = node.content.toLowerCase();
            webColor = WebColors[colorName] || WebColorsExtended[colorName];

            if (webColor !== undefined) {
                value = {type, content: webColor.slice(1)};
            }
        }

        return value;
    }
}

module.exports = ColorModule;
