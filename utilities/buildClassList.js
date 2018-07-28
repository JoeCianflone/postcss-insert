const _ = require('lodash');

module.exports = css => {
  const classes = {};

  css.walkRules(rule => {
    if (!_.has(classes, rule.selector)) {
      classes[rule.selector] = [];
    }

    classes[rule.selector].push(rule);
  });

  return classes;
}
