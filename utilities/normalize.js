const _ = require('lodash');
const escape = require('css.escape');

module.exports = name => `.${escape(_.trimStart(name, '.'))}`;;
