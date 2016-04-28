var subheadingPresence = require( "../../js/researches/getSubheadingPresence.js" );
var Paper = require( "../../js/values/Paper.js" );

describe( "checks if there is a subheading in text", function() {

	it( "returns 0", function() {
		var paper = new Paper( "this is text" );
		expect( subheadingPresence( paper ) ).toBe( 0 );
	} );

	it( "returns 1", function() {
		paper = new Paper( "<h2>this is text</h2>" );
		expect( subheadingPresence( paper ) ).toBe( 1 );
	} );

	it( "returns 2", function() {
		paper = new Paper( "<h2>this is text</h2><h1>this is more text</h1>" );
		expect( subheadingPresence( paper ) ).toBe( 2 );
	} );

	it( "returns 0", function() {
		paper = new Paper( "<h2>this is text</h3>" );
		expect( subheadingPresence( paper ) ).toBe( 0 );
	} );
} );
