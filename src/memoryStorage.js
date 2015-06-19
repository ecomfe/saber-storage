define(function (require, exports, module) {
    /**
     * @file Memory Storage
     * @author treelite(c.xinle@gmail.com)
     */

    /**
     * 数据容器
     *
     * @type {Object}
     */
    var store = {};

    /**
     * 获取数据
     *
     * @public
     * @param {string} key 键
     * @return {*}
     */
    exports.getItem = function (key) {
        return store[key];
    };

    /**
     * 设置数据
     *
     * @public
     * @param {string} key 键
     * @param {*} value 值
     */
    exports.setItem = function (key, value) {
        store[key] = value;
    };

    /**
     * 删除数据
     *
     * @public
     * @param {string} key 键
     */
    exports.removeItem = function (key) {
        delete store[key];
    };
});
