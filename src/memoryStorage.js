define(function (require, exports, module) {
    /**
     * @file Memory Storage
     * @author treelite(c.xinle@gmail.com)
     */

    var store = {};

    exports.getItem = function (key) {
        return store[key];
    };

    exports.setItem = function (key, value) {
        store[key] = value;
    };

    exports.removeItem = function (key) {
        delete store[key];
    };
});
