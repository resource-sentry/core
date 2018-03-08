const chalk   = require('chalk'),
      pad     = require('pad'),
      winston = require('winston');

const loggerLevels = require('./logger-levels');

const colors = {
    [loggerLevels.ERROR]  : chalk.red,
    [loggerLevels.WARN]   : chalk.yellow,
    [loggerLevels.INFO]   : chalk.magenta,
    [loggerLevels.VERBOSE]: chalk.white,
    [loggerLevels.DEBUG]  : chalk.green,
    [loggerLevels.SILLY]  : chalk.gray
};

module.exports = (category, level = loggerLevels.SILLY) => {
    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                level    : level,
                timestamp: () => {
                    let date    = new Date(),
                        hours   = date.getHours(),
                        minutes = date.getMinutes(),
                        seconds = date.getSeconds(),
                        ms      = date.getMilliseconds();

                    return [pad(2, hours, '0'), pad(2, minutes, '0'), pad(2, seconds, '0'), pad(3, ms, '0')].join(':');
                },
                formatter: options => {
                    return '[' + options.timestamp() + '][' + category + '] ' + (options.message ? colors[options.level](options.message) : '') +
                        (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
                }
            })
        ]
    });
};
