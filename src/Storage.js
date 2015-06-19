define(function (require, exports, module) {
    /**
     * @file Storage
     * @author treelite(c.xinle@gmail.com)
     */

    var extend = require('saber-lang').extend;

    /**
     * 获取所有数据
     *
     * @inner
     * @param {Storage} storage 存储对象
     * @return {Object}
     */
    function getData(storage) {
        var core = storage.core;
        var data = core.getItem(storage.id) || '{}';
        return JSON.parse(data);
    }

    /**
     * 保存数据
     *
     * @inner
     * @param {Storage} storage 存储数据
     * @param {Object} data 数据
     */
    function setData(storage, data) {
        var core = storage.core;
        core.setItem(storage.id, JSON.stringify(data));
    }

    /**
     * 删除数据
     *
     * @inner
     * @param {Storage} storage 存储对象
     */
    function removeData(storage) {
        var core = storage.core;
        core.removeItem(storage.id);
    }

    /**
     * Storage
     *
     * @class
     * @param {string} id Key
     * @param {Object} core 存储核心
     * @param {Object=} data 初始化数据
     */
    function Storage(id, core, data) {
        this.id = (id || '') + '_SABER';
        this.core = core;
        this.keys = {};
        // 填充初始化数据
        if (data) {
            setData(this, extend(getData(this), data));
        }
    }

    /**
     * 设置数据
     *
     * @public
     * @param {string} key 键
     * @param {*} value 值
     */
    Storage.prototype.setItem = function (key, value) {
        var data = getData(this);
        data[key] = value;
        setData(this, data);
    };

    /**
     * 获取数据
     *
     * @public
     * @param {string} key 键
     * @return {*}
     */
    Storage.prototype.getItem = function (key) {
        var data = getData(this);
        return data[key];
    };

    /**
     * 删除数据
     *
     * @public
     * @param {string} key 键
     */
    Storage.prototype.removeItem = function (key) {
        var data = getData(this);
        if (data.hasOwnProperty(key)) {
            delete data[key];
            setData(this, data);
        }
    };

    /**
     * 清除所有数据
     *
     * @public
     */
    Storage.prototype.clear = function () {
        removeData(this);
    };

    /**
     * 获取所有的存储键
     *
     * @public
     * @return {Array.<string>}
     */
    Storage.prototype.key = function () {
        var data = getData(this);
        return Object.keys(data);
    };

    /**
     * 获取所有存储的数据
     *
     * @public
     * @return {Object}
     */
    Storage.prototype.getAllItems = function () {
        return getData(this);
    };

    module.exports = Storage;
});
