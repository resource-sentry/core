const EventEmitter = require('eventemitter3'),
      fs           = require('fs'),
      glob         = require('fast-glob'),
      path         = require('path'),
      Promise      = require('bluebird');

const Categories     = require('../../model/categories'),
      Events         = require('../../model/events'),
      Logger         = require('../../util/logger'),
      TransformBasic = require('./transform-basic');

class SvgReader extends EventEmitter {
    constructor(config) {
        super();
        this.logger = Logger(this.constructor.name);
        this.config = config;
        this.categories = [];
        this.transforms = this.createTransformList(config.transform);
        this.eventTarget = {target: this};
    }

    addValue(categories, category, name, value) {
        let categoryData = categories[category] || [];
        categoryData.push({name, value});
        categories[category] = categoryData;
    }

    createTransformList(directives) {
        let transform;
        let result = [];
        let knownTransforms = {};

        if (directives !== undefined) {
            directives.forEach(directive => {
                transform = knownTransforms[directive];
                if (transform !== undefined) {
                    result.push(new transform());
                }
            });
        }

        // The main transform always the last
        // It gives opportunity for custom transforms to do their unique operations
        result.push(new TransformBasic());

        return result;
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

                    this.transforms.forEach(transform => {
                        content = transform.getResult(content);
                    });

                    this.addValue(this.categories, Categories.GRAPHIC, key, content);
                });
            })
            .then(() => this.emit(Events.READER_DATA_DID_CHANGE, this.eventTarget));
    }
}

module.exports = SvgReader;
