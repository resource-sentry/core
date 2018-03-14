const ScssReader = require('../../../src/reader/scss');

describe('SCSS Reader. Ignore.', () => {

    let categories;

    beforeAll(() => {
        let reader = new ScssReader({entry: './test/reader/scss/style-ignore.scss'});
        return reader
            .scan()
            .then(() => {
                categories = reader.getAllCategories();
            });
    });

    it('ignores all variables', () => {
        expect(categories).toHaveLength(0);
    });

});
