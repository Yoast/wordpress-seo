var formatNumberSpec = require( "../../js/helpers/formatNumber.js" );

describe("a test to round numbers to two decimal places", function(){
	it("returns a rounded number", function(){
		expect( formatNumberSpec( 9.7895437583789573 ) ).toBe( 9.8 );
		expect( formatNumberSpec( 3.032434432432 )).toBe( 3.0 );
		expect( formatNumberSpec( 4.5600000000000005 )).toBe( 4.6 );
		expect( formatNumberSpec( 4 )).toBe( 4 );
			});
});
