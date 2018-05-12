const Categories = require('../../../src/model/categories');
const SvgReader = require('../../../src/reader/svg');

describe('SVG Reader.', () => {

    let categories;

    beforeAll(() => {
        let reader = new SvgReader({entry: './test/reader/svg'});
        return reader
            .scan()
            .then(() => {
                categories = reader.getAllCategories();
            });
    });

    it('uses Graphic category', () => {
        expect(categories[Categories.GRAPHIC]).toBeDefined();
    });

    it('finds recursively assets', () => {
        expect(categories[Categories.GRAPHIC]).toHaveLength(3);
    });
});
