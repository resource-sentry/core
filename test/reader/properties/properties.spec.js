const Categories = require('../../../src/model/categories');
const PropertiesReader = require('../../../src/reader/properties');

describe('Properties Reader.', () => {

    let categories;

    beforeAll(() => {
        let reader = new PropertiesReader({entry: './test/reader/properties/sample.properties'});
        return reader
            .scan()
            .then(() => {
                categories = reader.getAllCategories();
            });
    });

    it('uses Text category', () => {
        expect(categories[Categories.TEXT]).toBeDefined();
    });

    it('uses Value category', () => {
        expect(categories[Categories.VALUE]).toBeDefined();
    });

    it('ignores empty lines and comments', () => {
        let allFields = [];
        categories.forEach(values => {
            allFields = allFields.concat(values);
        });
        expect(allFields).toHaveLength(6);
    });

    it('extracts initial multi-line text', () => {
        expect(categories[Categories.TEXT]).toContainEqual({name: 'targetCities', value: 'Detroit,Chicago,New York'});
    });

    it('extracts multi-line text', () => {
        expect(categories[Categories.TEXT]).toContainEqual({name: 'twoLines', value: 'Some,Value'});
    });

    it('extracts text with spaces', () => {
        expect(categories[Categories.TEXT]).toContainEqual({name: 'name', value: 'Stephen Strong'});
    });

    it('extracts colon based value', () => {
        expect(categories[Categories.TEXT]).toContainEqual({name: 'master', value: 'Sam'});
    });

    it('extracts colon based with spaces', () => {
        expect(categories[Categories.TEXT]).toContainEqual({name: 'hero', value: 'Oven Strong'});
    });

    it('extracts numeric value', () => {
        expect(categories[Categories.VALUE]).toContainEqual({name: 'simple', value: 8808});
    });

});
