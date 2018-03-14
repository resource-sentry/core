const Categories = require('../../../src/model/categories');
const ScssReader = require('../../../src/reader/scss');

describe('SCSS Reader. Formula.', () => {

    let categories;

    beforeAll(() => {
        let reader = new ScssReader({entry: './test/reader/scss/style-formula.scss'});
        return reader
            .scan()
            .then(() => {
                categories = reader.getAllCategories();
            });
    });

    it('uses Dimension category', () => {
        expect(categories[Categories.DIMENSION]).toBeDefined();
    });

    it('uses Value category', () => {
        expect(categories[Categories.VALUE]).toBeDefined();
    });

    it('computes simple value operation', () => {
        expect(categories[Categories.VALUE]).toContainEqual({name: 'computeDiff', value: 100});
    });

    it('computes extra styled formula', () => {
        expect(categories[Categories.VALUE]).toContainEqual({name: 'fancyDiff', value: 400});
    });

    it('preserves dimension', () => {
        expect(categories[Categories.DIMENSION]).toContainEqual({name: 'fontDiff', value: 14 / 16});
    });
});
