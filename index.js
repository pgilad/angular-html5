'use strict';
var defaultPrefix = 'ng-';

module.exports = function (params) {
    params = params || {};
    //find ng-something by default
    var prefix = defaultPrefix;
    var customPrefixes = params.customPrefixes;
    //optionally add custom prefixes
    if (Array.isArray(customPrefixes) && customPrefixes.length) {
        prefix += '|' + customPrefixes.join('|');
    }

    //wrap around to insert into replace str later
    prefix = '(' + prefix + '){1}';

    //handle the following:
    //1. ' ng-'
    //2. '<ng-'
    //3. '</ng-'
    var allowedPreChars = '(\\s|<|<\/|["\']){1}';
    //build find/replace regex
    //$1 -> allowable pre-chars
    //$2 -> prefix match
    //$3 -> actual directive (partially)
    var replaceRegex = new RegExp(allowedPreChars + prefix + '(\\w+)', 'ig');

    //replace with data-ng-something
    var replaceStr = '$1data-$2$3';

    return {
        test: function (str) {
            //see http://stackoverflow.com/questions/2141974/javascript-regex-literal-with-g-used-multiple-times
            replaceRegex.lastIndex = 0;
            return replaceRegex.test(str);
        },
        replace: function (str) {
            //see http://stackoverflow.com/questions/2141974/javascript-regex-literal-with-g-used-multiple-times
            replaceRegex.lastIndex = 0;
            return str.replace(replaceRegex, replaceStr);
        }
    };
};
