# babel-plugin-transform-import-meta

Transforms import.meta for nodejs environments. This plugin replaces any occurrence of `import.meta.url`.

```js
console.log(import.meta.url);
```

And outputs code compatible with CommonJS

```js
console.log(require('url').pathToFileURL(__filename).toString());
```

## Installation

```javascript
npm install --save-dev babel-plugin-transform-import-meta
```

After the plugin is installed, configure it in `package.json`

```
  "babel": {
    "presets": [
      "@babel/preset-env",
    ],
    "plugins": [
      "babel-plugin-transform-import-meta"
    ]
  },
```

## Credits

Based on a previous project "babel-plugin-import-meta" by The Polymer Authors
