/**
 * @file Main for client
 * @author treelite(c.xinle@gmail.com)
 */

define(function (require) {

    var initialData;

    var DEFALUT_CORE = 'memory';

    /**
     * 存储对象缓存
     *
     * @type {Array}
     */
    var storages = [];

    /**
     * 存储能力检测
     *
     * @inner
     * @param {string} name 存储方式
     * @return {boolean}
     */
    function check(name) {
        try {
            var storage = window[name];
            var key = 'foo';
            var value = 'bar';

            storage.setItem(key, value);
            var support = value === storage.getItem(key);
            storage.removeItem(key);

            return support;
        }
        catch (e) {
            return false;
        }
    }

    /**
     * 存储内核
     *
     * @type {Object}
     */
    var cores = {
        memory: require('./memoryStorage'),
        local: check('localStorage') ? window.localStorage : null,
        session: check('sessionStorage') ? window.sessionStorage : null
    };

    /**
     * 获取存储对象
     *
     * @public
     * @param {string} type 存储类型
     * @return {Object}
     */
    function Storage(type) {
        type = type || DEFALUT_CORE;
        var core = cores[type];

        if (core) {
            var Storage = require('./Storage');
            var storage = new Storage(location.hostname, core, initialData);
            storages.push(storage);
            return storage;
        }
        return core;
    }

    /**
     * 同步初始化数据
     *
     * @public
     * @param {Object} app server
     */
    Storage.sync = function (app) {
        var data = initialData = app.getSyncData('session');

        storages.forEach(function (storage) {
            Object.keys(data).forEach(function (key) {
                storage.setItem(key, data[key]);
            });
        });
    };

    return Storage;

});
