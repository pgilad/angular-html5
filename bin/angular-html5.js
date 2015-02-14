#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var htmlify = require('../index');
var logSymbols = require('log-symbols');
var stdin = require('get-stdin');
process.title = 'angular-html5';

function collect(val, memo) {
    memo.push(val);
    return memo;
}

program
    .description('Change your ng-attributes to data-ng-attributes for html5 validation')
    .version(require(path.join(__dirname, '../package.json')).version)
    .usage('[options] <file>')
    .option('-c, --custom-prefix [prefixes]', 'Optionally add custom prefixes to the list of converted directives.', collect, [])
    .on('--help', function () {
        console.log('  Examples:');
        console.log('');
        console.log('    $ angular-html5 index.js');
        console.log('    $ angular-html5 --custom-prefix ui --custom-prefix gijo index.js > ./dist/index.js');
        console.log('    $ cat index.js | angular-html5 > ./dist/index.js');
        console.log('');
    })
    .parse(process.argv);

function run(contents, params) {
    params = params || {};
    var customPrefixes = program.customPrefix;
    var app = htmlify({
        customPrefixes: customPrefixes
    });
    if (!app.test(contents)) {
        console.log(logSymbols.success, 'No ng-directives found');
    } else {
        var output = app.replace(contents);
        // use stdout.write to maintain to not add an ending newline
        process.stdout.write(output);
    }
    process.exit(0);
}

function readFiles(files) {
    var file = files[0];
    var _contents = fs.readFileSync(path.resolve(process.cwd(), file), 'utf8');
    run(_contents, {
        file: file
    });
}

if (!process.stdin.isTTY) {
    stdin(run);
    return;
}
if (!program.args.length) {
    program.help();
    return;
}
readFiles(program.args);
