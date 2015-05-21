/* global describe,it */
'use strict';
//jshint unused:false
var should = require('should');
var fs = require('fs');
var htmlBeautify = require('js-beautify').html;
var angularHtml5 = require('../index');

describe('angular-html5', function () {
    it('should handle a no angular file', function () {
        var filename = './tests/fixtures/noangular.html';
        var htmlify = angularHtml5();

        var testFile = fs.readFileSync(filename, 'utf8');
        htmlify.test(testFile).should.eql(false);
    });

    it('should handle a basic angular app', function () {
        var filename = './tests/fixtures/angular-basic.html';
        var htmlify = angularHtml5();

        var testFile = fs.readFileSync(filename, 'utf8');
        htmlify.test(testFile).should.eql(true);
        var contents = htmlify.replace(testFile);
        //test that data-ng appears
        contents.should.match(/\s+data-ng-app/);
        //test that ng-app doesn't appear
        contents.should.not.match(/\s+ng-app/);
    });

    it('should handle a complex angular app', function () {
        var filename = './tests/fixtures/angular-complex.html';
        var htmlify = angularHtml5();

        var testFile = fs.readFileSync(filename, 'utf8');
        htmlify.test(testFile).should.eql(true);
        var contents = htmlify.replace(testFile);
        //test that data-ng appears
        contents.should.match(/\s+data-ng-app/);
        //test that ng-app doesn't appear
        contents.should.not.match(/\s+ng-app/);
        //test that data-ng-form appears
        contents.should.match(/<data-ng-form/);
        //test that ng-form doesn't appear
        contents.should.not.match(/<ng-form/);
        //test that ng-controller is transformed
        contents.should.match(/\s+data-ng-controller/);
        //test that ng-controller doesn't appear
        contents.should.not.match(/\s+ng-controller/);
        //test that ng-if is transformed
        contents.should.match(/\s+data-ng-if/);
        //test that ng-if doesn't appear
        contents.should.not.match(/\s+ng-if/);
        //handle a <ng-include> directive
        contents.should.match(/<data-ng-include/);
        //test that ng-if doesn't appear
        contents.should.not.match(/<ng-include/);
        //handle a <ng-include> directive
        contents.should.match(/<data-ng-pluralize/);
    });

    it('should not change anything other than angular directives', function () {
        var filename = './tests/fixtures/angular-complex.html';
        var htmlify = angularHtml5();
        var testFile = fs.readFileSync(filename, 'utf8');
        htmlify.test(testFile).should.eql(true);
        //replace ng attributes
        var contents = htmlify.replace(testFile);
        //custom replace back
        contents = contents.replace(/data-ng-/gi, 'ng-');
        htmlBeautify(contents).should.eql(htmlBeautify(testFile));
    });

    it('should work with custom prefixes', function () {
        var filename = './tests/fixtures/angular-custom.html';
        var testFile = fs.readFileSync(filename, 'utf8');
        var htmlify = angularHtml5({
            customPrefixes: ['ui-', 'gijo-']
        });

        htmlify.test(testFile).should.eql(true);

        var contents = htmlify.replace(testFile);
        contents.should.match(/data-ui-router/);
        contents.should.not.match(/[^-]ui-router/);

        //test that data-ng appears
        contents.should.match(/\s+data-gijo-loader/);
        contents.should.not.match(/\s+gijo-loader/);
    });

    it('should not modify ng-template script', function () {
        var filename = './tests/fixtures/angular-templates.html';
        var testFile = fs.readFileSync(filename, 'utf8');
        var htmlify = angularHtml5();

        htmlify.test(testFile).should.eql(true);
        //validate that ng-templates don't change
        var contents = htmlify.replace(testFile);
        contents.should.match(/type="text\/ng-template"/);
    });

    it('should work with custom prefixes with multiple classes', function () {
        var filename = './tests/fixtures/angular-multi-class.html';
        var testFile = fs.readFileSync(filename, 'utf8');
        var htmlify = angularHtml5({
            customPrefixes: ['xyz-']
        });

        htmlify.test(testFile).should.eql(true);

        var contents = htmlify.replace(testFile);
        //test that data-ng appears
        contents.should.match(/\s+data-ng-app/);
        //test that ng-app doesn't appear
        contents.should.not.match(/\s+ng-app/);
        contents.should.not.match(/data-xyz-first/);
        contents.should.not.match(/data-xyz-second/);
        contents.should.match(/data-xyz-attrib-1/);
        contents.should.match(/data-xyz-attrib-2/);
    });

    it('should correctly modify example file', function () {
        var filename = './tests/fixtures/example.html';
        var htmlify = angularHtml5();
        var testFile = fs.readFileSync(filename, 'utf8');
        htmlify.test(testFile).should.eql(true);
        //replace ng attributes
        var contents = htmlify.replace(testFile);
        contents.should.match(/data-ng-app/);
        contents.should.match(/data-ng-repeat/);
        contents.should.match(/data-ng-controller/);
        contents.should.not.match(/[^-]ng-/);
    });

    it('should leave file unmodified when replace and turn back', function () {
        var filename = './tests/fixtures/example.html';
        var htmlify = angularHtml5();
        var testFile = fs.readFileSync(filename, 'utf8');
        htmlify.test(testFile).should.eql(true);
        //replace ng attributes
        var contents = htmlify.replace(testFile);
        //custom replace back
        contents = contents.replace(/data-ng-/gi, 'ng-');
        htmlBeautify(contents).should.eql(htmlBeautify(testFile));
    });

    it('should correctly modify second example file', function () {
        var filename = './tests/fixtures/example2.html';
        var htmlify = angularHtml5();
        var testFile = fs.readFileSync(filename, 'utf8');
        htmlify.test(testFile).should.eql(true);
        //replace ng attributes
        var contents = htmlify.replace(testFile);
        contents.should.match(/data-ng-app/);
        contents.should.match(/data-ng-repeat/);
        contents.should.match(/data-ng-controller/);
        contents.should.not.match(/[^-]ng-/);
    });

    it('should leave example2 unmodified when replace and turn back', function () {
        var filename = './tests/fixtures/example2.html';
        var htmlify = angularHtml5();
        var testFile = fs.readFileSync(filename, 'utf8');
        htmlify.test(testFile).should.eql(true);
        //replace ng attributes
        var contents = htmlify.replace(testFile);
        //custom replace back
        contents = contents.replace(/data-ng-/gi, 'ng-');
        htmlBeautify(contents).should.eql(htmlBeautify(testFile));
    });

    it('should preserve explicitly closed SVG elements', function () {
        var types = ['closed', 'self'];
        for (var i = 0; i < types.length; i++) {
            var filename = './tests/fixtures/angular-svg-' + types[i] + '.html';
            var htmlify = angularHtml5();
            var testFile = fs.readFileSync(filename, 'utf8');
            htmlify.test(testFile).should.eql(true);
            var contents = htmlify.replace(testFile);
            //test that SVG elements are explicitly closed
            contents.should.match(/<path[\s\S]*?([^>]*?\/>|>[\s\S]*?<\/path>)/);
        }
    });

    it('should preserve explicitly closed MathML elements', function () {
        var types = ['closed', 'self'];
        for (var i = 0; i < types.length; i++) {
            var filename = './tests/fixtures/angular-mathml-' + types[i] + '.html';
            var htmlify = angularHtml5();
            var testFile = fs.readFileSync(filename, 'utf8');
            htmlify.test(testFile).should.eql(true);
            var contents = htmlify.replace(testFile);
            //test that SVG elements are explicitly closed
            contents.should.match(/<infinity[\s\S]*?([^>]*?\/>|>[\s\S]*?<\/infinity>)/);
        }
    });

});
