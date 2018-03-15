const Categories = require('../../../src/model/categories');
const ScssReader = require('../../../src/reader/scss');

describe('SCSS Reader. Text.', () => {

    let categories;

    beforeAll(() => {
        let reader = new ScssReader({entry: './test/reader/scss/style-text.scss'});
        return reader
            .scan()
            .then(() => {
                categories = reader.getAllCategories();
            });
    });

    it('uses Text category', () => {
        expect(categories[Categories.TEXT]).toBeDefined();
    });

    it('extracts the string', () => {
        expect(categories[Categories.TEXT]).toContainEqual({name: 'alertClass', value: 'error'});
    });

    it('extract very first node', () => {
        expect(categories[Categories.TEXT]).toContainEqual({name: 'buttonConfig', value: 'save'});
    });

});
