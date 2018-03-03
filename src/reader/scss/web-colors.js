/**
 * https://www.w3.org/TR/css-color-3/
 * CSS (Cascading Style Sheets) is a language for describing the rendering of HTML and XML documents on screen, on paper,
 * in speech, etc. It uses color-related properties and values to color the text, backgrounds, borders,
 * and other parts of elements in a document.
 * This specification describes color values and properties for foreground color and group opacity.
 * These include properties and values from CSS level 2 and new values.
 *
 * @type {Object}
 */
let colors = {};

// Basic
colors['black'] = '#000000';
colors['silver'] = '#C0C0C0';
colors['gray'] = '#808080';
colors['white'] = '#FFFFFF';
colors['maroon'] = '#800000';
colors['red'] = '#FF0000';
colors['purple'] = '#800080';
colors['fuchsia'] = '#FF00FF';
colors['green'] = '#008000';
colors['lime'] = '#00FF00';
colors['olive'] = '#808000';
colors['yellow'] = '#FFFF00';
colors['navy'] = '#000080';
colors['blue'] = '#0000FF';
colors['teal'] = '#008080';
colors['aqua'] = '#00FFFF';

// Extended. X11

module.exports = Object.freeze(colors);
