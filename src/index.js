const Core         = require('./core'),
      Es2015Writer = require('./writer/es2015'),
      ScssReader   = require('./reader/scss/scss-reader');

global.DEBUG = true;

const config = {
    input : [
        new ScssReader({
            entry: './test.scss'
        })
    ],
    output: new Es2015Writer({
        path: './output'
    })
};

new Core().start(config);
