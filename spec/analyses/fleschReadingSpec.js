var fleschFunction = require( "../../js/analyses/fleschReading.js" );

describe("a test to calculate the fleschReading score", function(){
	it("returns a score", function(){
		expect( fleschFunction( "A piece of text to calculate scores." ) ).toBe( "78.9" );
	});
});