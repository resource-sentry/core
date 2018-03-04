global.DEBUG = true;
global.Promise = require('bluebird');

const Core         = require('./core'),
      Es2015Writer = require('./writer/es2015'),
      ScssReader   = require('./reader/scss');

const config = {
    input : [
        new ScssReader({
            entry: './test/reader/scss/style-value.scss'
        })
    ],
    output: new Es2015Writer({
        path: './output'
    })
};

new Core().start(config, {
    // Pass Chokidar options, or Boolean
    watch: true
});
