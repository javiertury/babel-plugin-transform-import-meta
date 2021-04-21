import * as babelCore from '@babel/core';
import stripIndent from 'strip-indent';
import importMetaPlugin from './index';

describe('babel-plugin-import-meta', () => {
  test('transforms import.meta.url', () => {
    const input = stripIndent(`
      console.log(import.meta.url);
    `);

    const expected = stripIndent(`
      console.log(require('url').pathToFileURL(__filename).toString());
    `);
    const result = babelCore.transform(input, {
      plugins: [importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });

  test('does not transform non-meta property', () => {
    const input = stripIndent(`
      console.log(foo.import.meta);
    `);

    const expected = stripIndent(`
      console.log(foo.import.meta);
    `);
    const result = babelCore.transform(input, {
      plugins: [importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });

  test('does not transform import.meta if known property is not specified', () => {
    const input = stripIndent(`
      console.log(import.meta);
    `);

    const expected = stripIndent(`
      console.log(import.meta);
    `);
    const result = babelCore.transform(input, {
      plugins: [importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });

  test('does not transform unknown meta properties', () => {
    const input = stripIndent(`
      console.log(import.meta.foo);
    `);

    const expected = stripIndent(`
      console.log(import.meta.foo);
    `);
    const result = babelCore.transform(input, {
      plugins: [importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });
});
