import importMetaSyntax from '@babel/plugin-syntax-import-meta';
import template from '@babel/template';

const ast = template.ast;

/**
 * Rewrites `import.meta`[1] into an import for a module named "meta". It will
 * provide an object with a `url`[2] property for the "meta" dependency.
 *
 * [1]: https://github.com/tc39/proposal-import-meta
 * [2]: https://html.spec.whatwg.org/#hostgetimportmetaproperties
 */
export default function () {
  return {
    name: 'transform-import-meta',
    inherits: importMetaSyntax,

    visitor: {
      Program(path) {
        const metas = [];
        const identifiers = new Set();

        path.traverse({
          MetaProperty(path) {
            const node = path.node;
            if (node.meta && node.meta.name === 'import' &&
                node.property.name === 'meta') {
              metas.push(path);
              for (const name of Object.keys(path.scope.getAllBindings())) {
                identifiers.add(name);
              }
            }
          }
        });

        if (metas.length === 0) {
          return;
        }

        let metaId = 'meta';
        while (identifiers.has(metaId)) {
          metaId = path.scope.generateUidIdentifier('meta').name;
        }

        path.node.body.unshift(ast`const ${metaId} = Object.freeze({ url: require('url').pathToFileURL(__filename) });`);
        for (const meta of metas) {
          meta.replaceWith(ast`${metaId}`);
        }
      },
    }
  };
};
