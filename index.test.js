const postcss = require('postcss');
const plugin = require('./');

function run(input, config = {}) {
  return postcss([plugin(config)]).process(input);
}

test('selectors with invalid characters do not need to be manually escaped', () => {
  const input = `
    .a\\:1\\/2 { color: red; }
    .b { @insert .a:1/2; }
  `;

  const expected = `
    .a\\:1\\/2 { color: red; }
    .b { color: red; }
  `;

  return run(input).then(result => {
    expect(result.css).toEqual(expected);
    expect(result.warnings().length).toBe(0);
  });
});

test('it does not remove !important by default', () => {
  const input = `
    .a { color: red !important; }
    .b { @insert .a; }
  `;

  const expected = `
    .a { color: red !important; }
    .b { color: red !important; }
  `;

  return run(input).then(result => {
    expect(result.css).toEqual(expected);
    expect(result.warnings().length).toBe(0);
  });
});

test('it strips !important via stripImportant: true option', () => {
  const input = `
    .a { color: red !important; }
    .b { @insert .a; }
  `;

  const expected = `
    .a { color: red !important; }
    .b { color: red; }
  `;

  return run(input, { stripImportant: true }).then(result => {
    expect(result.css).toEqual(expected);
    expect(result.warnings().length).toBe(0);
  });
});

test('it fails if the class does not exist', () => {
  return run('.b { @insert .a; }').catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' });
  });
});

test('injecting classes defined in media queries fails with allowFromMediaQueries set to false', () => {
  const input = `
    @media (min-width: 300px) {
      .a { color: blue; }
    }
    .b {
      @insert .a;
    }
  `;

  expect.assertions(1);
  return run(input, { allowFromMediaQueries: false }).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' });
  });
});

test('injecting classes defined in media queries allowed by default', () => {
  const input = `
    @media (min-width: 300px) { .a { color: blue; } }
    .b { @insert .a; }
  `;

  const expected = `
    @media (min-width: 300px) { .a { color: blue; } }
    .b { color: blue; }
  `;

  return run(input).then(result => {
    expect(result.css).toEqual(expected);
    expect(result.warnings().length).toBe(0);
  });
});

test('it does not match classes that include pseudo-selectors', () => {
  const input = `
    .a:hover {
      color: red;
    }
    .b {
      @insert .a;
    }
  `;

  expect.assertions(1);
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' });
  });
});

test('it does not match classes that have multiple rules', () => {
  const input = `
    .a {
      color: red;
    }
    .b {
      @insert .a;
    }
    .a {
      color: blue;
    }
  `;

  expect.assertions(1);
  return run(input).catch(e => {
    expect(e).toMatchObject({ name: 'CssSyntaxError' });
  });
});
