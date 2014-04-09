define(function (require) {
    var STORAGE_ID = '_SABER',

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
        })(),

        stringify = function ( v ) {
            return JSON.stringify( v );
        },

        parse = function ( v ) {
            try {
                v = JSON.parse( v );
            } catch (e) {}
            return v;
        },

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

    var LocalStorage = function ( options ) {
        options = options || {};
        this.storageId = options.storageId || STORAGE_ID;
        this.options = options;
        this.storage = isSupportLocalStorage ? window.localStorage : storage;
    };

    LocalStorage.prototype = {
        set: function ( k, v, expires ) {
            var data = this._getData();
            data[k] = v;
            localStorage.setItem( this.storageId, stringify( data ) );
        },

        get: function ( k ) {
            return this._getData()[k];
        },

        remove: function ( k ) {
            var data = this._getData();
            delete data[k];
            this.storage.setItem( this.storageId, stringify( data ) );
        },

        clear: function () {
            this.storage.removeItem( this.storageId );
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

    return new LocalStorage();
});