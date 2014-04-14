define( function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 99 * 1000;

    var Storage = require( 'saber-storage' );

    var storage = new Storage();

    var testData = {
        'string'       : 'str',
        0              : 0,
        //undefined value in Object will be omitted by JSON.stringify
//        'undefined'    : undefined,
        'null'         : null,
        'array'        : [0, 1, 2, 3],
        'object'       : {0: 0, 1: 1},
        'complexObject': {0: [1, 2], 1: [3, 4]}
    };

    storage.clear();

    describe( 'Storage', function () {
        describe( '.isSupport()', function () {
            it( 'Support localStorage', function () {
                expect( storage.isSupport() ).toBe( true );
            } );
        } );

        describe( '.setItem( key, value ) and .getItem( key )', function () {
            for (key in testData) {
                (function () {
                    var k = key, v = testData[key];
                    it( 'Save ' + k + ' success!', function () {
                        storage.setItem( k, v );
                        var value = storage.getItem( k );

                        expect( value ).toEqual( v );
                    } );
                })();
            }
        } );

        describe( '.key()', function () {
            it( 'Key items is right!', function () {
                var keys = Object.keys( testData );

                expect( storage.key() ).toEqual( keys );
            } );
        } );

        describe( '.removeItem( key )', function () {
            it( 'RemoveItem success!', function () {
                var key = 'str';
                storage.removeItem( key );
                var value = storage.getItem( key );

                expect( value ).toBe( undefined );
            } );
        } );

        describe( '.clear()', function () {
            it( 'Clear success!', function () {
                storage.clear();
                var value = storage._getData();

                expect( value ).toEqual( {} );
            } );
        } );


        describe( '.on(Storage.Event.OUT_OF_LIMIT, function(err) {} )', function () {

            storage.clear();

            var overLimit = false;

            it( 'Event emit success!', function ( done ) {
                storage.on( Storage.Event.OUT_OF_LIMIT, function ( error ) {
                    overLimit = true;
                    expect( overLimit ).toEqual( true );
                    done();
                } );
            } );

            var n10b = '0123456789';
            var n100b = repeat( n10b, 10 );
            var n1kib = repeat( n100b, 10 );
            var n10kib = repeat( n1kib, 10 );
            var n100kib = repeat( n10kib, 10 );
            var n1mib = repeat( n100kib, 10 );
            var n10mib = repeat( n1mib, 10 );

            var values = [n10b, n100b, n1kib, n10kib, n100kib, n1mib, n10mib];

            iterationsData = [];
            for (var majorIndex = 1; majorIndex < values.length; majorIndex ++) {
                var major = values[majorIndex];
                var minor = values[majorIndex - 1];
                for (var i = 1; i < 10; i ++) {
                    for (var j = 0; j < 10; j ++) {
                        iterationsData.push( [major, minor, i, j] );
                    }
                }
            }

            var index = 0;
            var oldLength = 0;

            function iteration() {
                var data = iterationsData[index];

                major = data[0];
                minor = data[1];
                i = data[2];
                j = data[3];

                var string = repeat( major, i ) + repeat( minor, j );
                var length = '' + string.length;

                if (storage.setItem( 't', string )) {
                    console.log( length + ' characters were stored successfully.' );
                } else {
                    console.log( oldLength + ' characters were stored successfully,  but ' + length + ' weren\'t.' );
                    return;
                }
                oldLength = length;

                index ++;
                if (index < iterationsData.length) {
                    setTimeout( iteration, 0 );
                }
                /* else {
                 console.log( oldLength + ' characters were saved successfully, test is stopped.' );
                 it( oldLength + ' characters were saved successfully, test is stopped.', function () {
                 expect( 1 ).toBe( 1 );
                 } );
                 }*/
            }


            iteration();

            function repeat( string, count ) {
                var array = [];
                while (count --) {
                    array.push( string );
                }
                return array.join( '' );
            }

            storage.clear();
        } );
    } );
} );