/**
 * @file Storage for mobile
 * @author qiaogang2003@163.com
 * 接口标准参考: http://www.w3.org/TR/webstorage/
 */
define(function (require) {
    var isSupportLocalStorage;
    var stringify;
    var parse;
    var storage;

    var STORAGE_ID = '_SABER';
    var EVENT = {
        OUT_OF_LIMIT: 'Out of space limit'
    };

    isSupportLocalStorage = (function () {
        try {
            var support = 'localStorage' in window && window['localStorage'] !== null;

            var test = {
                k: 'test key',
                v: 'test value'
            };
            if (support) {
                localStorage.setItem(test.k, test.v);
                support = test.v === localStorage.getItem(test.k);
                localStorage.removeItem(test.k);
            }
            return support;
        }
        catch (e) {
            return false;
        }
    })();

    stringify = function (v) {
        return JSON.stringify(v);
    };

    parse = function (v) {
        try {
            v = JSON.parse(v);
        }
        catch (e) {}
        return v;
    };

    storage = {
        data: {},
        setItem: function (k, v) {
            this.data[k] = v;
        },

        getItem: function (k) {
            return this.data[k];
        },

        removeItem: function (k) {
            delete this.data[k];
        }
    };

    /**
     * 实现简单的事件派发机制，用于Event中事件的派发
     */
    var SimpleEmitter = function () {
    };

    SimpleEmitter.prototype = {
        on: function (event, listener) {
            if (typeof listener !== 'function') {
                return;
            }

            var events = this.events || (this.events = {});
            events[ event ] = events[ event ] || [];
            events[ event ].push(listener);

            return this;
        },

        emit: function (event) {
            var events = this.events || (this.events = {});
            var listeners = events[ event ];
            var args = Array.prototype.slice.call(arguments, 1);

            if (listeners) {
                listeners = listeners.slice(0);
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[ i ].apply(this, args);
                }
            }

            return this;
        }
    };

    SimpleEmitter.mixin = function (obj) {
        var keys = Object.keys(SimpleEmitter.prototype);

        keys.forEach(function (key) {
            obj[key] = SimpleEmitter.prototype[key];
        });

        return obj;
    };

    /**
     * 构造函数
     *
     * @param {Object} options 配置项
     * @param {String} options.storageId 存储命名空间，默认存储在_SABER命名空间下
     * @param {Boolean} options.memoryCache 是否开启内存级别缓存，即只存储至内存变量中，而不持久化数据。默认false。
     * @constructor
     */
    var LocalStorage = function (options) {
        options = options || {};
        this.storageId = options.storageId || STORAGE_ID;
        this.memoryCache = !!options.memoryCache;
        this.storage = (isSupportLocalStorage && !this.memoryCache) ? window.localStorage : storage;
    };

    LocalStorage.Event = LocalStorage.prototype.Event = EVENT;

    LocalStorage.prototype = {
        /**
         * 判断是否支持本地存储
         *
         * @return {Boolean}
         */
        isSupport: function () {
            return isSupportLocalStorage;
        },

        /**
         * 存入数据
         *
         * @param {String} key
         * @param {Object} val
         * @return {Boolean} 存储成功返回true；存储失败返回false，并抛出Stroage.Event.OUT_OF_LIMIT事件
         * 注意：value会使用环境内置的JSON.stringify方法序列化。其中undefined在Object结构下会被忽略，在Array结构下会被转换为null，使用时请注意！
         */
        setItem: function (key, val) {
            var data = this._getData();
            data[key] = val;
            try {
                localStorage.setItem(this.storageId, stringify(data));
                return true;
            }
            catch (err) {
                this.emit(EVENT.OUT_OF_LIMIT, err);
                return false;
            }
        },

        /**
         * 根据key返回数据
         *
         * @param {String} key
         * @returns {Object}
         */
        getItem: function (key) {
            return this._getData()[key];
        },

        /**
         * 移除某键位下的数据
         *
         * @param {String} key
         */
        removeItem: function (key) {
            var data = this._getData();
            delete data[key];
            this.storage.setItem(this.storageId, stringify(data));
        },

        /**
         * 清空已持久化的数据
         *
         */
        clear: function () {
            this.storage.removeItem(this.storageId);
        },

        /**
         * 获得持久化数据的key
         *
         * @returns {Array}
         */
        key: function () {
            return Object.keys(this._getData());
        },

        /**
         * 获取存于STORAGE_ID下的数据
         * @return {Object}
         *
         * @private
         */
        _getData: function () {
            var data = this.storage.getItem(this.storageId);
            return data ? parse(data) : {};
        }
    };

    SimpleEmitter.mixin(LocalStorage.prototype);

    return LocalStorage;

});
