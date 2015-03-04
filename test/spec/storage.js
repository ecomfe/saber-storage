/**
 * @file Test spec
 * @author redmed(qiaogang2003@163.com)
 *         treelite(c.xinle@gmail.com)
 */
define(function () {

    return function (name, storage) {

        var testData = {
            'string'       : 'str',
            0              : 0,
            // undefined value in Object will be omitted by JSON.stringify
            //'undefined'    : undefined,
            'null'         : null,
            'array'        : [0, 1, 2, 3],
            'object'       : {0: 0, 1: 1},
            'complexObject': {0: [1, 2], 1: [3, 4]}
        };

        describe(name, function () {

            storage.clear();

            describe('.setItem(key, value) and .getItem(key)', function () {
                for (key in testData) {
                    (function () {
                        var k = key, v = testData[key];
                        it('Save ' + k + ' success!', function () {
                            storage.setItem(k, v);
                            var value = storage.getItem( k );

                            expect(value).toEqual(v);
                        } );
                    })();
                }
            });

            describe('.key()', function () {
                it('Key items is right!', function () {
                    var keys = Object.keys(testData);

                    expect(storage.key()).toEqual(keys);
                });
            });

            describe('.removeItem(key)', function () {
                it('RemoveItem success!', function () {
                    var key = 'str';
                    storage.removeItem(key);
                    var value = storage.getItem(key);

                    expect(value).toBe(undefined);
                });
            });

            describe('.clear()', function () {
                it('Clear success!', function () {
                    storage.clear();
                    var data = storage.core.getItem(storage.id);
                    expect(!data).toBeTruthy();
                    expect(storage.key()).toEqual([]);
                });
            });

        });
    };
});
