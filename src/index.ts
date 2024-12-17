import { smart } from '@babel/template';
import type { PluginObj, NodePath } from '@babel/core';
import type { Statement, MemberExpression, CallExpression, OptionalCallExpression, ArgumentPlaceholder, JSXNamespacedName, SpreadElement, Expression } from '@babel/types';

export interface PluginOptions {
  module?: 'CommonJS' | 'ES6' | undefined
}

/**
 * Rewrites known `import.meta`[1] properties into equivalent non-module node.js
 * expressions. In order to maintain compatibility with plugins transforming
 * non-standard properties, this plugin transforms only known properties and
 * does not touch expressions with unknown or without member property access.
 * Properties known to this plugin:
 *
 * - `url`[2]
 *
 * [1]: https://github.com/tc39/proposal-import-meta
 * [2]: https://html.spec.whatwg.org/#hostgetimportmetaproperties
 */
export default function (): PluginObj {
  return {
    name: 'transform-import-meta',

    visitor: {
      Program (path, state) {
        const { module: target = 'CommonJS' } = (state.opts as PluginOptions | undefined) ?? {};
        if (target !== 'CommonJS' && target !== 'ES6') {
          throw new Error('Invalid target, must be one of: "CommonJS" or "ES6"');
        }
        const urlMetas: Array<NodePath<MemberExpression>> = [];
        const filenameMetas: Array<NodePath<MemberExpression>> = [];
        const dirnameMetas: Array<NodePath<MemberExpression>> = [];
        const resolveMetas: Array<NodePath<CallExpression> | NodePath<OptionalCallExpression>> = [];

        const urlScopeIdentifiers = new Set<string>();
        const resolveScopeIdentifiers = new Set<string>();

        // Gather all of the relevant data for import.meta's that we're going to replace later.
        path.traverse({
          MemberExpression (memberExpPath) {
            const { node } = memberExpPath;

            if (
              node.object.type === 'MetaProperty' &&
              node.object.meta.name === 'import' &&
              node.object.property.name === 'meta' &&
              node.property.type === 'Identifier' &&
              node.property.name === 'url'
            ) {
              urlMetas.push(memberExpPath);
              for (const name of Object.keys(memberExpPath.scope.getAllBindings())) {
                urlScopeIdentifiers.add(name);
              }
            }

            if (
              node.object.type === 'MetaProperty' &&
              node.object.meta.name === 'import' &&
              node.object.property.name === 'meta' &&
              node.property.type === 'Identifier' &&
              node.property.name === 'filename'
            ) {
              filenameMetas.push(memberExpPath);
            }

            if (
              node.object.type === 'MetaProperty' &&
              node.object.meta.name === 'import' &&
              node.object.property.name === 'meta' &&
              node.property.type === 'Identifier' &&
              node.property.name === 'dirname'
            ) {
              dirnameMetas.push(memberExpPath);
            }
          },
          CallExpression (callExpPath) {
            const { node } = callExpPath;

            if (
              node.type === 'CallExpression' &&
              node.callee.type === 'MemberExpression' &&
              node.callee.object.type === 'MetaProperty' &&
              node.callee.object.meta.name === 'import' &&
              node.callee.object.property.name === 'meta' &&
              node.callee.property.type === 'Identifier' &&
              node.callee.property.name === 'resolve'
            ) {
              resolveMetas.push(callExpPath);
              for (const name of Object.keys(callExpPath.scope.getAllBindings())) {
                resolveScopeIdentifiers.add(name);
              }
            }
          },
          OptionalCallExpression (callExpPath) {
            const { node } = callExpPath;

            if (
              node.type === 'OptionalCallExpression' &&
              node.callee.type === 'MemberExpression' &&
              node.callee.object.type === 'MetaProperty' &&
              node.callee.object.meta.name === 'import' &&
              node.callee.object.property.name === 'meta' &&
              node.callee.property.type === 'Identifier' &&
              node.callee.property.name === 'resolve'
            ) {
              resolveMetas.push(callExpPath);
              for (const name of Object.keys(callExpPath.scope.getAllBindings())) {
                resolveScopeIdentifiers.add(name);
              }
            }
          }
        });

        // For url and resolve, we'll potentially need to add imports, depending on the target.
        if ((urlMetas.length !== 0) || (resolveMetas.length !== 0)) {
          let metaUrlReplacement: Statement;
          let metaResolveReplacement: ((args: Array<ArgumentPlaceholder | JSXNamespacedName | SpreadElement | Expression>) => Statement);

          switch (target) {
            case 'CommonJS': {
              metaUrlReplacement = smart.ast`require('url').pathToFileURL(__filename).toString()` as Statement;
              metaResolveReplacement = (args) => smart.ast`require('url').pathToFileURL(require.resolve(${args})).toString()` as Statement;
              break;
            }
            case 'ES6': {
              let urlId = 'url';
              let createRequireId = 'createRequire';

              while (urlScopeIdentifiers.has(urlId) || resolveScopeIdentifiers.has(urlId)) {
                urlId = path.scope.generateUidIdentifier('url').name;
              }

              while (resolveScopeIdentifiers.has(createRequireId)) {
                createRequireId = path.scope.generateUidIdentifier('createRequire').name;
              }

              path.node.body.unshift(smart.ast`import ${urlId} from 'url';` as Statement);
              if (resolveMetas.length !== 0) {
                path.node.body.unshift(smart.ast`import { createRequire as ${createRequireId} } from 'module';` as Statement);
              }
              metaUrlReplacement = smart.ast`${urlId}.pathToFileURL(__filename).toString()` as Statement;
              metaResolveReplacement = (args) => smart.ast`${urlId}.pathToFileURL(${createRequireId}(${urlId}.pathToFileURL(__filename).toString()).resolve(${args})).toString()` as Statement;
              break;
            }
          }

          for (const meta of urlMetas) {
            meta.replaceWith(metaUrlReplacement);
          }

          for (const meta of resolveMetas) {
            meta.replaceWith(metaResolveReplacement(meta.node.arguments));
          }
        }

        const metaFilenameReplacement: Statement = smart.ast`__filename` as Statement;
        const metaDirnameReplacement: Statement = smart.ast`__dirname` as Statement;

        for (const meta of filenameMetas) {
          meta.replaceWith(metaFilenameReplacement);
        }

        for (const meta of dirnameMetas) {
          meta.replaceWith(metaDirnameReplacement);
        }
      }
    }
  };
}
