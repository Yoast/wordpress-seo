var fleschFunction = require( "../../js/analyses/calculateFleschReading.js" );

describe("a test to calculate the fleschReading score", function(){
	it("returns a score", function(){
		expect( fleschFunction( "A piece of text to calculate scores." ) ).toBe( "78.9" );

		expect( fleschFunction( "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble" )).toBe( "63.9" );
	});
});