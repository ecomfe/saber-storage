/**
 * @file Storage for mobile
 * @author qiaogang@baidu.com
 * 接口标准参考: http://www.w3.org/TR/webstorage/
 */
define( function ( require ) {
    var STORAGE_ID, EVENT, isSupportLocalStorage, stringify, parse, storage;

    STORAGE_ID = '_SABER';
    EVENT = {
        OUT_OF_SPACE: 'Out of space limit'
    };

    isSupportLocalStorage = (function () {
        try {
            var support = 'localStorage' in window && window['localStorage'] !== null,

                test = {
                    k: 'test key',
                    v: 'test value'
                };
            if (support) {
                localStorage.setItem( test.k, test.v );
                support = test.v === localStorage.getItem( test.k );
                localStorage.removeItem( test.k );
            }
            return support;
        } catch (e) {
            return false;
        }
    })();

    stringify = function ( v ) {
        return JSON.stringify( v );
    };

    parse = function ( v ) {
        try {
            v = JSON.parse( v );
        } catch (e) {}
        return v;
    };

    storage = {
        data   : {},
        setItem: function ( k, v ) {
            this.data[k] = v;
        },

        getItem: function ( k ) {
            return this.data[k];
        },

        removeItem: function ( k ) {
            delete this.data[k];
        }
    };

    /**
     * 实现简单的事件派发机制
     */
    var SimpleEmitter = function () { };

    SimpleEmitter.prototype = {
        on: function ( event, listener ) {
            if (typeof listener != 'function') return;

            var events = this.events || (this.events = {});
            events[ event ] = events[ event ] || [];
            events[ event ].push( listener );

            return this;
        },

        emit: function ( event ) {
            var events, listeners, args;
            events = this.events || (this.events = {});
            listeners = events[ event ];
            args = Array.prototype.slice.call( arguments, 1 );

            if (listeners) {
                listeners = listeners.slice( 0 );
                for (var i = 0, len = listeners.length; i < len; i ++) {
                    listeners[ i ].apply( this, args );
                }
            }

            return this;
        }
    };

    SimpleEmitter.mixin = function ( obj ) {
        for (var key in SimpleEmitter.prototype) {
            obj[ key ] = SimpleEmitter.prototype[ key ];
        }

        return obj;
    };

    var LocalStorage = function ( options ) {
        options = options || {};
        this.storageId = options.storageId || STORAGE_ID;
        this.options = options;
        this.storage = isSupportLocalStorage ? window.localStorage : storage;
    };

    LocalStorage.Event = EVENT;

    LocalStorage.prototype = {
        isSupport: function() {
            return isSupportLocalStorage;
        },
        /**
         *
         * @param key
         * @param val
         */
        setItem: function ( key, val ) {
            var data = this._getData();
            data[key] = val;
            try {
                localStorage.setItem( this.storageId, stringify( data ) );
                return true;
            } catch (err) {
                this.emit( EVENT.OUT_OF_SPACE, err );
                return false;
            }
        },

        getItem: function ( key ) {
            return this._getData()[key];
        },

        removeItem: function ( key ) {
            var data = this._getData();
            delete data[key];
            this.storage.setItem( this.storageId, stringify( data ) );
        },

        clear: function () {
            this.storage.removeItem( this.storageId );
        },

        key: function () {
            return Object.keys( this._getData() );
        },

        length: function () {
            return this.key().length;
        },

        /**
         * 将全部的数据存于localStorage的一个key下
         * @return {Object}
         * @private
         */
        _getData: function () {
            var data = this.storage.getItem( this.storageId );
            return data ? parse( data ) : {};
        }
    };

    SimpleEmitter.mixin( LocalStorage.prototype );

    return LocalStorage;

} );