const Categories = require('../../../src/model/categories');
const ScssReader = require('../../../src/reader/scss');

describe('SCSS Reader. Color.', () => {

    let reader;
    let categories;

    beforeAll(done => {
        reader = new ScssReader({entry: './test/reader/scss/style-color.scss'});
        reader.initWithWatch({}, () => {
            categories = reader.getAllCategories();
            done();
        });
    });

    it('uses Color category', done => {
        reader.initWithWatch({}, () => {
            expect(categories[Categories.COLOR]).toBeDefined();
            done();
        });
    });

    it('extracts HEX color', done => {
        reader.initWithWatch({}, () => {
            expect(categories[Categories.COLOR]).toContainEqual({name: 'primaryColor', value: 'eeffcc'});
            done();
        });
    });

    it('converts basic web color', done => {
        reader.initWithWatch({}, () => {
            expect(categories[Categories.COLOR]).toContainEqual({name: 'message-color', value: '0000FF'});
            done();
        });
    });


    it('converts extended web color', done => {
        reader.initWithWatch({}, () => {
            expect(categories[Categories.COLOR]).toContainEqual({name: 'headerColor', value: 'D2691E'});
            done();
        });
    });
});
