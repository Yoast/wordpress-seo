var floatingPointSpec = require( "../../js/helpers/fixFloatingPoint.js" );

describe("a test to round numbers to two decimal places", function(){
	it("returns a rounded number", function(){
		expect( floatingPointSpec( 9.7895437583789573 ) ).toBe( 9.79 );
		expect( floatingPointSpec( 3.032434432432 )).toBe( 3.03 );
		expect( floatingPointSpec( 4.5600000000000005 )).toBe( 4.56 );
		expect( floatingPointSpec( 4 )).toBe( 4.00 );
			});
});
