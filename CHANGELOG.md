# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.3.3](https://github.com/javiertury/babel-plugin-transform-import-meta/compare/v2.3.2...v2.3.3) (2025-06-03)

## [2.3.2](https://github.com/javiertury/babel-plugin-transform-import-meta/compare/v2.3.1...v2.3.2) (2025-01-03)

## [2.3.1](https://github.com/javiertury/babel-plugin-transform-import-meta/compare/v2.3.0...v2.3.1) (2025-01-03)

## [2.3.0](https://github.com/javiertury/babel-plugin-transform-import-meta/compare/v2.2.1...v2.3.0) (2025-01-03)


### Features

* add support for additional meta apis ([e011988](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/e011988664ea3893f852e0d5b511cb060985a90d))
* new import.meta apis ([185992a](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/185992a12fe1086924e75040dac2e73b28998137))
* update eslint, rollup and other dependencies ([5ea0a08](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/5ea0a08e8a3d7fe732358c5821797602519e59d3))

### [2.2.1](https://github.com/javiertury/babel-plugin-transform-import-meta/compare/v2.2.0...v2.2.1) (2023-08-04)

## [2.2.0](https://github.com/javiertury/babel-plugin-transform-import-meta/compare/v2.1.1...v2.2.0) (2022-06-21)


### Features

* add support for ES6 targets ([77f855a](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/77f855af8d2f15d94ec711fbe1c312a445e5f777)), closes [#5](https://github.com/javiertury/babel-plugin-transform-import-meta/issues/5)

### [2.1.1](https://github.com/javiertury/babel-plugin-transform-import-meta/compare/v2.1.0...v2.1.1) (2022-02-03)


### Bug Fixes

* import ast from smart instead of default export of @babel/template ([88e058f](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/88e058f4b4bc5ba3048a815b0b9fe3edcb43f8de))

## [2.1.0](https://github.com/javiertury/babel-plugin-transform-import-meta/compare/v2.0.0...v2.1.0) (2021-09-10)


### Features

* switch to pnpm ([22e8ab9](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/22e8ab91c2fcc8efb33f154ae7f8469f6b0e20e7))


### Bug Fixes

* "package.json#exports" and "mjs" extension ([f4597ea](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/f4597eafb9d4668f1ae283ba879d8d6cc86820de))
* **release:** publish only files in lib ([0d152b7](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/0d152b7d08bff80279fc6907a69b6d8134d22d4b))

## 2.0.0 (2021-04-21)


### ⚠ BREAKING CHANGES

* import.meta on its own is no longer transpiled.
* unknown import.meta properties are no longer transpiled.

### Features

* create plugin ([dd1a3f7](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/dd1a3f7ddf3a55acfe4f76859443cd9cec8ed5b2))


### Bug Fixes

* compatibility with transformers of unknown properties ([383053c](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/383053c2d1e976d1431229096e2157e2344bbd51)), closes [#2](https://github.com/javiertury/babel-plugin-transform-import-meta/issues/2)
* make some dependencies dev dependencies ([4decc60](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/4decc609a72eaef2ade16f83fc65415b8dc2c499))
* rename prepare script ([ea9f8db](https://github.com/javiertury/babel-plugin-transform-import-meta/commit/ea9f8db2c45744bed3578e8ea1db05162209e886))
