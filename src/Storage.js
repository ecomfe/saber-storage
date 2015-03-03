define(function (require, exports, module) {
    /**
     * @file Storage
     * @author treelite(c.xinle@gmail.com)
     */

    var extend = require('saber-lang').extend;

    function getData(storage) {
        var core = storage.core;
        var data = core.getItem(storage.id) || '{}';
        return JSON.parse(data);
    }

    function setData(storage, data) {
        var core = storage.core;
        core.setItem(storage.id, JSON.stringify(data));
    }

    function removeData(storage) {
        var core = storage.core;
        core.removeItem(storage.id);
    }

    function Storage(id, core, data) {
        this.id = (id || '') + '_SABER';
        this.core = core;
        this.keys = {}
        // 填充初始化数据
        if (data) {
            setData(this, extend(getData(this), data));
        }
    }

    Storage.prototype.setItem = function (key, value) {
        var data = getData(this);
        data[key] = value;
        setData(this, data);
    };

    Storage.prototype.getItem = function (key) {
        var data = getData(this);
        return data[key];
    };

    Storage.prototype.removeItem = function (key) {
        var data = getData(this);
        if (data.hasOwnProperty(key)) {
            delete data[key];
            setData(this, data);
        }
    };

    Storage.prototype.clear = function () {
        removeData(this);
    };

    Storage.prototype.key = function () {
        var data = getData(this);
        return Object.keys(data);
    };

    module.exports = Storage;
});
