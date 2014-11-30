'use strict';
var cheerio = require('cheerio');
var defaultPrefix = 'ng-';

module.exports = function (params) {
    params = params || {};
    //find ng-something by default
    var customPrefixes = params.customPrefixes || [];
    if (customPrefixes && !Array.isArray(customPrefixes)) {
        customPrefixes = [customPrefixes];
    }
    var prefixes = [defaultPrefix].concat(customPrefixes);
    var rPrefix = new RegExp('^(' + prefixes.join('|') + ')', 'ig');

    return {
        test: function (str) {
            var $ = cheerio.load(str, {
                recognizeSelfClosing: true
            });
            var foundPrefix = false;
            $('*').each(function (i, el) {
                // check tagName
                rPrefix.lastIndex = 0;
                foundPrefix = rPrefix.test(el.tagName);
                // early exit
                if (foundPrefix) {
                    return false;
                }

                // check attributes
                var attrs = Object.keys($(el).attr()).filter(function (attr) {
                    rPrefix.lastIndex = 0;
                    return rPrefix.test(attr);
                });
                foundPrefix = attrs.length > 0;
                // early exit
                if (foundPrefix) {
                    return false;
                }
            });
            return foundPrefix;
        },
        replace: function (str) {
            var $ = cheerio.load(str, {
                xmlMode: false,
                decodeEntities: false,
                normalizeWhitespace: false,
                recognizeSelfClosing: true
            });
            $('*').each(function (i, el) {
                var $el = $(el);
                Object.keys($el.attr()).forEach(function (attr) {
                    rPrefix.lastIndex = 0;
                    if (!rPrefix.test(attr)) {
                        return;
                    }
                    $el.attr('data-' + attr, $el.attr(attr));
                    $el.removeAttr(attr);
                });

                // check tagName
                rPrefix.lastIndex = 0;
                if (rPrefix.test(el.tagName)) {
                    $el.replaceWith(function () {
                        return $('<data-' + el.tagName + '/>').attr($el.attr()).append($el.html());
                    });
                }
            });

            return $.html();
        }
    };
};
