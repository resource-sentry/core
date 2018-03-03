const Categories = require('./categories');

let names = [];
names[Categories.COLOR] = 'Color';
names[Categories.DIMENSION] = 'Dimension';
names[Categories.TEXT] = 'Text';
names[Categories.VALUE] = 'Value';

module.exports = Object.freeze(names);
