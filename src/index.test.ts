import * as babelCore from '@babel/core';
import dedent from 'ts-dedent';
import importMetaPlugin from './index';
import type { PluginOptions } from './index';

const unknownKeysSpec = (
  pluginOptions?: PluginOptions | undefined
) => {
  test('does not transform non-meta property', () => {
    const input = dedent(`
      console.log(foo.import.meta);
    `);

    const expected = dedent(`
      console.log(foo.import.meta);
    `);
    const result = babelCore.transform(input, {
      plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });

  test('does not transform import.meta if known property is not specified', () => {
    const input = dedent(`
      console.log(import.meta);
    `);

    const expected = dedent(`
      console.log(import.meta);
    `);
    const result = babelCore.transform(input, {
      plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });

  test('does not transform unknown meta properties', () => {
    const input = dedent(`
      console.log(import.meta.foo);
    `);

    const expected = dedent(`
      console.log(import.meta.foo);
    `);
    const result = babelCore.transform(input, {
      plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
    })?.code ?? '';
    expect(result.trim()).toEqual(expected.trim());
  });
};

describe('babel-plugin-import-meta', () => {
  describe('ES5', () => {
    const pluginOptions: PluginOptions | undefined = undefined;

    test('transforms import.meta.url', () => {
      const input = dedent(`
        console.log(import.meta.url);
      `);

      const expected = dedent(`
        console.log(require('url').pathToFileURL(__filename).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    unknownKeysSpec(pluginOptions);
  });

  describe('ES6', () => {
    const pluginOptions: PluginOptions | undefined = { module: 'ES6' };

    test('transforms import.meta.url', () => {
      const input = dedent(`
        console.log(import.meta.url);
      `);

      const expected = dedent(`
        import url from 'url';
        console.log(url.pathToFileURL(__filename).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('injects import at the top of the file', () => {
      const input = dedent(`
        import path from 'path';

        console.log('foo');
        console.log(import.meta.url);
      `);

      const expected = dedent(`
        import url from 'url';
        import path from 'path';
        console.log('foo');
        console.log(url.pathToFileURL(__filename).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    unknownKeysSpec(pluginOptions);
  });
});
