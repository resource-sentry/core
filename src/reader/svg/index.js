const EventEmitter = require('eventemitter3'),
      fs           = require('fs'),
      glob         = require('fast-glob'),
      path         = require('path'),
      Promise      = require('bluebird');

const Categories = require('../../model/categories');
const Events = require('../../model/events');
const Logger = require('../../util/logger');

class SvgReader extends EventEmitter {
    constructor(config) {
        super();
        this.logger = Logger(this.constructor.name);
        this.config = config;
        this.categories = [];
        this.eventTarget = {target: this};
    }

    addValue(categories, category, name, value) {
        let categoryData = categories[category] || [];
        categoryData.push({name, value});
        categories[category] = categoryData;
    }

    dispose() {
    }

    getAllCategories() {
        return this.categories;
    }

    getEntry() {
        return this.config.entry;
    }

    scan() {
        let entry = path.resolve(process.cwd(), this.getEntry());

        return Promise
            .resolve()
            .then(() => {
                return glob('**/*.svg', {
                    cwd: entry
                });
            })
            .then(files => {
                return Promise.map(files, filePath => {
                    let content = fs.readFileSync(path.resolve(entry, filePath), 'utf8');
                    let key = filePath.replace(path.sep, '_').replace('.svg', '');

                    this.logger.verbose(key);

                    this.addValue(this.categories, Categories.GRAPHIC, key, content);
                });
            })
            .then(() => this.emit(Events.READER_DATA_DID_CHANGE, this.eventTarget));
    }
}

module.exports = SvgReader;
