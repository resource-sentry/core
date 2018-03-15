const Categories = require('../../../src/model/categories');
const ScssReader = require('../../../src/reader/scss');

describe('SCSS Reader. Variable.', () => {

    let categories;

    beforeAll(() => {
        let reader = new ScssReader({entry: './test/reader/scss/style-variable.scss'});
        return reader
            .scan()
            .then(() => {
                categories = reader.getAllCategories();
            });
    });

    it('inherits dimension type', () => {
        expect(categories[Categories.DIMENSION]).toHaveLength(4);
    });

    it('references another variable', () => {
        expect(categories[Categories.DIMENSION]).toContainEqual({name: 'padding-xs', value: 4});
    });

    it('references via pre-operation', () => {
        expect(categories[Categories.DIMENSION]).toContainEqual({name: 'padding-s', value: 8});
    });

    it('references via post-operation', () => {
        expect(categories[Categories.DIMENSION]).toContainEqual({name: 'padding-m', value: 12});
    });

});
