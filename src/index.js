const core       = require('./core'),
      ScssReader = require('./reader/scss/scss-reader');

global.DEBUG = true;

const config = {
    input: [
        new ScssReader({
            entry: './test.scss'
        })
    ]
};

core.start(config);
