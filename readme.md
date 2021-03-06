# angular-html5

> Change your ng-attributes to data-ng-attributes for HTML5 validation

[![NPM Version](http://img.shields.io/npm/v/angular-html5.svg?style=flat)](https://npmjs.org/package/angular-html5)
[![NPM Downloads](http://img.shields.io/npm/dm/angular-html5.svg?style=flat)](https://npmjs.org/package/angular-html5)
[![Build Status](http://img.shields.io/travis/pgilad/angular-html5.svg?style=flat)](https://travis-ci.org/pgilad/angular-html5)

Ever tried to run an Angular HTML page into w3c validator? Yeah it's a mess.

HTML5 has a preset definition of valid tag elements, and also allows data-attributes.
Angular, being as great as it is, allows you set set custom directives, that don't pass the
w3c validations. Angular default directives come with an option to be named `data-something`.

If you are like me, it isn't fun using `data-ng-include` or `data-ng-switch` and prefer to use the shorter
versions. Using this module, you can easily convert the HTML attributes of Angular (and custom prefixes you want) to
valid HTML5 tags that start with `data-something`.

**Turn this:**
```html
<html ng-app="myApp">
...
<body ng-controller="MainCtrl">
</body>
</html>
```

**Into this:**
```html
<html data-ng-app="myApp">
...
<body data-ng-controller="MainCtrl">
</body>
</html>
```
#### <img src="http://www.w3.org/html/logo/downloads/HTML5_Logo_256.png" alt="HTML5 Valid" width="64" height="64"/>

**angular-html5** looks for `ng-` directives by default and can handle the following cases:
```html
<!-- attribute -->
<ANY ng-directive>
<!-- regular element -->
<ng-directive></ng-directive>
<!-- self closing element -->
<ng-directive />
<!-- custom directive prefix -->
<ui-router></ui-router>
<!-- your name prefix -->
<gilad-cool-loader></gilad-cool-loader>
```

You can add additional prefixes using the option `customPrefixes`.

This plugin plays nice with `type="text/ng-template"` and won't break it.

## Install

### Global

```bash
$ npm install --global angular-html5
```

### Usage

```bash
❯ angular-html5 --help

  Usage: angular-html5 [options] <file>

  Options:

    -h, --help                      output usage information
    -V, --version                   output the version number
    -c, --custom-prefix [prefixes]  Optionally add custom prefixes to the list of converted directives.

  Examples:

    $ angular-html5 index.js
    $ angular-html5 --custom-prefix ui --custom-prefix gijo index.js > ./dist/index.js
    $ cat index.js | angular-html5 > ./dist/index.js
```

### Programmatic

Install with [npm](https://npmjs.org/package/angular-html5)

```bash
$ npm install --save-dev angular-html5
```

### Usage

```js
var htmlify = require('angular-html5')();

var str = fs.readFileSync('angular.html', 'utf8');

// test if contents need replacing (testing is quick, replacing is slower)
var needsReplace = htmlify.test(str);
if (needsReplace) {
    // get the transformed html string with data- attributes
    str = htmlify.replace(str);
}
```

## Usage in build tools

#### [Gulp](https://github.com/gulpjs/gulp) - [gulp-angular-htmlify](https://github.com/pgilad/gulp-angular-htmlify)

#### [Grunt](http://gruntjs.com/) - [grunt-angular-htmlify](https://github.com/pgilad/grunt-angular-htmlify)

## API

```js
var htmlify = require('angular-html5')(params);
```

### API Methods

#### .test(str)

Test whether a string containing HTML has `ng-attributes` that can be transformed
to `data-ng-attributes`.

**Usage**: `htmlify.test(str)`

**Accepts**: `string`

**Returns**: `Boolean`

#### .replace(str)

Return a transformed string that contains `data-ng-attributes` or relevant transformed attributes
for `customPrefixes`.

**Usage**: `htmlify.replace(str)`

**Accepts**: `string`

**Returns**: `string`

### API Params

`params` is an object that contains the following settings:

#### customPrefixes

**Type**: `Array`

**Default**: `[ ]`

An array to optionally add custom prefixes to the list of converted directives.

For example: `['ui-', 'gijo-']`

By default only `ng-` prefixes are are handled. Any items you add here will be handled as well.

*Note: for this to work - you will need to make sure your directives can load with a `data-` prefix.*

**Example Usage:**
```js
var str = require('angular-html5')({customPrefixes: ['ui-']}).replace(oldStr);
```

## License

MIT © [Gilad Peleg](https://www.giladpeleg.com)
