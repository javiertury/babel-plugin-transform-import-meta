import { smart } from '@babel/template';
import type { PluginObj, NodePath } from '@babel/core';
import type { Statement, MemberExpression } from '@babel/types';

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
      Program (path) {
        const metas: Array<NodePath<MemberExpression>> = [];

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
              metas.push(memberExpPath);
            }
          }
        });

        if (metas.length === 0) {
          return;
        }

        for (const meta of metas) {
          meta.replaceWith(smart.ast`require('url').pathToFileURL(__filename).toString()` as Statement);
        }
      }
    }
  };
}
