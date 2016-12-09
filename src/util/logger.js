const chalk   = require('chalk'),
      winston = require('winston');

const colors = {
    'error'  : chalk.red,
    'warn'   : chalk.yellow,
    'info'   : chalk.magenta,
    'verbose': chalk.white,
    'debug'  : chalk.green,
    'silly'  : chalk.gray
};

module.exports = function (category, level = 'silly') {

    function pad(value, length, padChar) {
        let result = value.toString();
        return repeat(padChar, length - result.length) + result;
    }

    function repeat(char, times) {
        if (times == 0) {
            return '';
        } else if (times == 1) {
            return char;
        } else if (times == 2) {
            return char + char;
        }
    }

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                level    : level,
                timestamp: function () {
                    let date    = new Date(),
                        hours   = date.getHours(),
                        minutes = date.getMinutes(),
                        seconds = date.getSeconds(),
                        ms      = date.getMilliseconds();

                    return [pad(hours, 2, '0'), pad(minutes, 2, '0'), pad(seconds, 2, '0'), pad(ms, 3, '0')].join(':');
                },
                formatter: function (options) {
                    return '[' + options.timestamp() + '][' + category + '] ' + (options.message ? colors[options.level](options.message) : '') +
                        (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
                }
            })
        ]
    });
};
