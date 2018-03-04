const Es2015Writer = require('./src/writer/es2015'),
      ScssReader   = require('./src/reader/scss');

module.exports = {
    config: {
        input : [
            new ScssReader({
                entry: './test/reader/scss/style-value.scss'
            })
        ],
        output: new Es2015Writer({
            path: './output'
        })
    },

    settings: {
        // Pass Chokidar options, or Boolean
        watch: true
    }
};
