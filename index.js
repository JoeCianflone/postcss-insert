const postcss = require('postcss');
const _ = require('lodash');
const find = require('./utilities/find');
const normalize = require('./utilities/normalize');
const buildClassList = require('./utilities/buildClassList');

const defaultOptions = {
  allowFromMediaQueries: true,
  stripImportant: false,
};

module.exports = postcss.plugin('postcss-insert', options => {
  return css => {
    options = Object.assign({}, defaultOptions, options);
    const lookup = buildClassList(css);

    css.walkRules(rule => {
      rule.walkAtRules('insert', atRule => {
        const classesAndProps = postcss.list.space(atRule.params);
        let decls = _(classesAndProps);

        if (options.stripImportant) {
          decls = decls
            .reject(cssClass => cssClass === '!important')
            .flatMap(cssClass =>
              find(normalize(cssClass), lookup, options, message => atRule.error(message))
            )
            .value();

          _.tap(_.last(classesAndProps) === '!important', important => {
            decls.forEach(decl => (decl.important = important));
          });
        } else {
          decls = decls
            .flatMap(cssClass =>
              find(normalize(cssClass), lookup, options, message => atRule.error(message))
            )
            .value();
        }

        atRule.before(decls).remove();
      });
    });
  };
});
