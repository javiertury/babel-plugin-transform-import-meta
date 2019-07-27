# babel-plugin-transform-import-meta

Transforms import.meta for nodejs environments.

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
