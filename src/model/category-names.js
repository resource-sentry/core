const {DIMENSION, TEXT, VALUE} = require('./categories');

let names = [];
names[DIMENSION] = 'Dimension';
names[TEXT] = 'Text';
names[VALUE] = 'Value';

module.exports = Object.freeze(names);
