import isValueTooLong from '../../src/helpers/isValueTooLong.js';

describe( "Checks whether a value is too long", function() {
	it( "returns false, because the value is smaller than the given maximum", function() {
		var value = 27;
		var maxValue = 50;
		expect( isValueTooLong( maxValue, value ) ).toBe( false );
	} );
	it( "returns true, because the value is larger than the given maximum", function() {
		var value = 93;
		var maxValue = 50;
		expect( isValueTooLong( maxValue, value ) ).toBe( true );
	} );
	it( "returns false, because the value is equal to the given maximum", function() {
		var value = 50;
		var maxValue = 50;
		expect( isValueTooLong( maxValue, value ) ).toBe( false );
	} );
} );


