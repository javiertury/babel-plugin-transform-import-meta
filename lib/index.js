"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _pluginSyntaxImportMeta = _interopRequireDefault(require("@babel/plugin-syntax-import-meta"));

var _template = _interopRequireDefault(require("@babel/template"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _templateObject2() {
  var data = _taggedTemplateLiteral(["", ""]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral(["const ", " = Object.freeze({ url: require('url').pathToFileURL(__filename) });"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var ast = _template["default"].ast;
/**
 * Rewrites `import.meta`[1] into an import for a module named "meta". It will
 * provide an object with a `url`[2] property for the "meta" dependency.
 *
 * [1]: https://github.com/tc39/proposal-import-meta
 * [2]: https://html.spec.whatwg.org/#hostgetimportmetaproperties
 */

function _default() {
  return {
    name: 'transform-import-meta',
    inherits: _pluginSyntaxImportMeta["default"],
    visitor: {
      Program: function Program(path) {
        var metas = [];
        var identifiers = new Set();
        path.traverse({
          MetaProperty: function MetaProperty(path) {
            var node = path.node;

            if (node.meta && node.meta.name === 'import' && node.property.name === 'meta') {
              metas.push(path);

              for (var _i = 0, _Object$keys = Object.keys(path.scope.getAllBindings()); _i < _Object$keys.length; _i++) {
                var name = _Object$keys[_i];
                identifiers.add(name);
              }
            }
          }
        });

        if (metas.length === 0) {
          return;
        }

        var metaId = 'meta';

        while (identifiers.has(metaId)) {
          metaId = path.scope.generateUidIdentifier('meta').name;
        }

        path.node.body.unshift(ast(_templateObject(), metaId));

        for (var _i2 = 0, _metas = metas; _i2 < _metas.length; _i2++) {
          var meta = _metas[_i2];
          meta.replaceWith(ast(_templateObject2(), metaId));
        }
      }
    }
  };
}

;