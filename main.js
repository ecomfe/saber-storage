/**
 * @file Main for node
 * @author treelite(c.xinle@gmail.com)
 */

var Storage = require('./lib/Storage');
var extend = require('saber-lang').extend;

// 默认的存储核心为内存
var core = require('./lib/memoryStorage');

/**
 * 获取存储对象
 *
 * @public
 * @return {Object}
 */
module.exports = function () {
    return new Storage('REBAS', core);
};

/**
 * Plugin for Rebas
 *
 * @public
 * @param {Object} app server
 * @param {Object=} options session配置
 */
module.exports.rebas = function (app, options) {
    var session = require('express-session');

    // 启用session
    app.before(session(
        extend(
            {
                secret: 'rebas',
                resave: false,
                saveUninitialized: false,
                genid: function (req) {
                    return req.uid;
                }
            },
            options
        )
    ));

    // 同步session数据
    app.after(function (req, res, next) {
        var storage = module.exports();
        res.syncData.session = storage.getAllItems();
        next();
    });

    // 获取当前的session对象
    function getSession() {
        var context = app.getContext();
        return context.req.session;
    }

    // 重载存储核心为session
    core = {
        getItem: function (key) {
            var session = getSession();
            return session[key];
        },
        setItem: function (key, value) {
            var session = getSession();
            session[key] = value;
        },
        removeItem: function (key) {
            var session = getSession();
            delete session[key];
        }
    };
};
