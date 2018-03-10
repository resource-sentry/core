const Categories = require('../../../src/model/categories');
const ScssReader = require('../../../src/reader/scss');

describe('SCSS Reader. Color.', () => {

    let categories;

    beforeAll(() => {
        let reader = new ScssReader({entry: './test/reader/scss/style-color.scss'});
        return reader
            .scan()
            .then(() => {
                categories = reader.getAllCategories();
            });
    });

    it('uses Color category', () => {
        expect(categories[Categories.COLOR]).toBeDefined();
    });

    it('extracts HEX color', () => {
        expect(categories[Categories.COLOR]).toContainEqual({name: 'primaryColor', value: 'eeffcc'});
    });

    it('converts basic web color', () => {
        expect(categories[Categories.COLOR]).toContainEqual({name: 'message-color', value: '0000FF'});
    });

    it('converts extended web color', () => {
        expect(categories[Categories.COLOR]).toContainEqual({name: 'headerColor', value: 'D2691E'});
    });
});
