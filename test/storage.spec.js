define(function(){
    var storage = require( 'saber-storage' );

    var testData = {
        key : 'key',
        value : 'value'
    };

    describe( 'Storage', function() {
        describe( '.set( key, value ) and .get( key )', function() {
            it( 'save success!', function() {
                storage.set( testData.key, testData.value );
                var value = storage.get( testData.key );

                expect( value ).toBe( testData.value );
            } );
        });

        describe( '.remove( key )', function() {
            it( 'remove success!', function() {
                storage.set( testData.key, testData.value );
                storage.remove( testData.key );
                var value = storage.get( testData.key );

                expect( value ).toBe( undefined );
            } );
        });

        describe( '.clear()', function() {
            it( 'clear success!', function() {
                storage.set(testData.key, testData.value);
                storage.clear();
                var value = storage._getData();

                expect( value ).toEqual( {} );
            } );
        });
    });
});