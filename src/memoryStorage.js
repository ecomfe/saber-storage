/**
 * @file Memory Storage
 * @author treelite(c.xinle@gmail.com)
 */

define(function () {

    var store = {};

    var exports = {};

    exports.getItem = function (key) {
        return store[key];
    };

    exports.setItem = function (key, value) {
        store[key] = value;
    };

    exports.removeItem = function (key) {
        delete store[key];
    };

    return exports;

});
