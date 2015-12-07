var stringPosition = require ( "../../js/stringProcessing/stringPosition.js" );

describe( "A function to determine the position of a word in a string", function(){
	it("returns the position", function(){
		expect( stringPosition("keyword in a string", "keyword")).toBe( 0 );
		expect( stringPosition("keyword in a string", "none")).toBe( -1 );
		expect( stringPosition("string with keyword", "keyword")).toBe( 12 );
	});
});
