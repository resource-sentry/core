const Categories = require('../../../src/model/categories');
const ScssReader = require('../../../src/reader/scss');

describe('SCSS Reader. Value.', () => {

    let categories;

    beforeAll(() => {
        let reader = new ScssReader({entry: './test/reader/scss/style-value.scss'});
        return reader
            .scan()
            .then(() => {
                categories = reader.getAllCategories();
            });
    });

    it('uses Value category', () => {
        expect(categories[Categories.VALUE]).toBeDefined();
    });

    it('extracts integer number', () => {
        expect(categories[Categories.VALUE]).toContainEqual({name: 'prf-value-one-hundred', value: '100'});
    });

    it('extract float number', () => {
        expect(categories[Categories.VALUE]).toContainEqual({name: 'prf-value-two-thousands', value: '8.8'});
    });

});
