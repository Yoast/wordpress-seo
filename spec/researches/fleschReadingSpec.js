var fleschFunction = require( "../../js/researches/calculateFleschReading.js" );
var Paper = require( "../../js/values/Paper.js" );

describe("a test to calculate the fleschReading score", function(){
	it("returns a score", function(){

		var mockPaper = new Paper( "A piece of text to calculate scores." );
		expect( fleschFunction( mockPaper ) ).toBe( "78.9" );
/*
// todo This spec is currently disabled, because the fleschreading still runs a cleantext, that removes capitals. This is fixed in #496 of YoastSEO
		mockPaper = new Paper( "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble" );
		expect( fleschFunction( mockPaper )).toBe( "63.9" );
*/
		mockPaper = new Paper( "" );
		expect( fleschFunction( mockPaper ) ).toBe( 0 );
	});
});
