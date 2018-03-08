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

const timestamp = () => {
    let date    = new Date(),
        hours   = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        ms      = date.getMilliseconds();

    return [pad(2, hours, '0'), pad(2, minutes, '0'), pad(2, seconds, '0'), pad(3, ms, '0')].join(':');
};

module.exports = (category, level = loggerLevels.SILLY) => {
    return winston.createLogger({
        level     : level,
        format    : winston.format.printf(options => {
            return `[${timestamp()}][${category}] ${colors[options.level](options.message)}`;
        }),
        transports: [new winston.transports.Console()]
    });
};
