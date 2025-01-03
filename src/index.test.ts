/* eslint-disable @typescript-eslint/no-unnecessary-condition -- wiggle room */
import * as babelCore from '@babel/core';
import dedent from 'ts-dedent';
import importMetaPlugin from './index';
import type { PluginOptions } from './index';

const unknownKeysSpec = (
  pluginOptions?: PluginOptions
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
  test('throws when target is invalid', () => {
    const input = dedent(`
      console.log(import.meta.url);
    `);

    expect(() => babelCore.transform(input, {
      plugins: [[importMetaPlugin, { module: 'no-module' }]]
    })).toThrow('Invalid target, must be one of: "CommonJS" or "ES6"');
  });

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
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.filename', () => {
      const input = dedent(`
        console.log(import.meta.filename);
      `);

      const expected = dedent(`
        console.log(__filename);
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.dirname', () => {
      const input = dedent(`
        console.log(import.meta.dirname);
      `);

      const expected = dedent(`
        console.log(__dirname);
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.resolve()', () => {
      const input = dedent(`
        console.log(import.meta.resolve(myCustomFunction('path', 'file')));
      `);

      const expected = dedent(`
        console.log(require('url').pathToFileURL(require.resolve(myCustomFunction('path', 'file'))).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.resolve?.()', () => {
      const input = dedent(`
        console.log(import.meta.resolve?.(myCustomFunction('path', 'file')));
      `);

      const expected = dedent(`
        console.log(require('url').pathToFileURL(require.resolve(myCustomFunction('path', 'file'))).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
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
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('injects import at the top of the file (import.meta.url)', () => {
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
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.filename', () => {
      const input = dedent(`
        console.log(import.meta.filename);
      `);

      const expected = dedent(`
        console.log(__filename);
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.dirname', () => {
      const input = dedent(`
        console.log(import.meta.dirname);
      `);

      const expected = dedent(`
        console.log(__dirname);
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.resolve()', () => {
      const input = dedent(`
        console.log(import.meta.resolve(myCustomFunction('path', 'file')));
      `);

      const expected = dedent(`
        import { createRequire } from 'module';
        import url from 'url';
        console.log(url.pathToFileURL(createRequire(url.pathToFileURL(__filename).toString()).resolve(myCustomFunction('path', 'file'))).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('transforms import.meta.resolve?.()', () => {
      const input = dedent(`
        console.log(import.meta.resolve?.(myCustomFunction('path', 'file')));
      `);

      const expected = dedent(`
        import { createRequire } from 'module';
        import url from 'url';
        console.log(url.pathToFileURL(createRequire(url.pathToFileURL(__filename).toString()).resolve(myCustomFunction('path', 'file'))).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('injects import at the top of the file (import.meta.resolve())', () => {
      const input = dedent(`
        import path from 'path';

        console.log(import.meta.resolve(myCustomFunction('path', 'file')));
      `);

      const expected = dedent(`
        import { createRequire } from 'module';
        import url from 'url';
        import path from 'path';
        console.log(url.pathToFileURL(createRequire(url.pathToFileURL(__filename).toString()).resolve(myCustomFunction('path', 'file'))).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('injects import at the top of the file (import.meta.resolve?.())', () => {
      const input = dedent(`
        import path from 'path';

        console.log(import.meta.resolve?.(myCustomFunction('path', 'file')));
      `);

      const expected = dedent(`
        import { createRequire } from 'module';
        import url from 'url';
        import path from 'path';
        console.log(url.pathToFileURL(createRequire(url.pathToFileURL(__filename).toString()).resolve(myCustomFunction('path', 'file'))).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    test('uses unique import names, when url and createRequire are already defined', () => {
      const input = dedent(`
        import path from 'path';

        const url = '123';
        const createRequire = () => {};
        console.log(import.meta.resolve(myCustomFunction('path', 'file')));
      `);

      const expected = dedent(`
        import { createRequire as _createRequire } from 'module';
        import _url from 'url';
        import path from 'path';
        const url = '123';

        const createRequire = () => {};

        console.log(_url.pathToFileURL(_createRequire(_url.pathToFileURL(__filename).toString()).resolve(myCustomFunction('path', 'file'))).toString());
      `);
      const result = babelCore.transform(input, {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- comfort shortcut
        plugins: [pluginOptions ? [importMetaPlugin, pluginOptions] : importMetaPlugin]
      })?.code ?? '';
      expect(result.trim()).toEqual(expected.trim());
    });

    unknownKeysSpec(pluginOptions);
  });
});
