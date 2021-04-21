import { __makeTemplateObject } from 'tslib';
import template from '@babel/template';

var ast = template.ast;
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
function index () {
    return {
        name: 'transform-import-meta',
        visitor: {
            Program: function (path) {
                var metas = [];
                path.traverse({
                    MemberExpression: function (memberExpPath) {
                        var node = memberExpPath.node;
                        if (node.object.type === 'MetaProperty' &&
                            node.object.meta.name === 'import' &&
                            node.object.property.name === 'meta' &&
                            node.property.type === 'Identifier' &&
                            node.property.name === 'url') {
                            metas.push(memberExpPath);
                        }
                    }
                });
                if (metas.length === 0) {
                    return;
                }
                for (var _i = 0, metas_1 = metas; _i < metas_1.length; _i++) {
                    var meta = metas_1[_i];
                    meta.replaceWith(ast(templateObject_1 || (templateObject_1 = __makeTemplateObject(["require('url').pathToFileURL(__filename).toString()"], ["require('url').pathToFileURL(__filename).toString()"]))));
                }
            }
        }
    };
}
var templateObject_1;

export default index;
