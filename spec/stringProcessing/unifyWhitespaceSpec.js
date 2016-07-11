var unifyWhitespace = require( "../../js/stringProcessing/unifyWhitespace.js" );

describe( "A test to check if the whitespaces are filtered correctly", function() {
	it( "returns a string with uniform whitespaces", function() {
		expect( unifyWhitespace.unifyNonBreakingSpace( "A text&nbsp;string." ) ).toBe( "A text string." );
		expect( unifyWhitespace.unifyWhiteSpace( "A\u0020text\u0020string." ) ).toBe( "A text string." );
		expect( unifyWhitespace.unifyAllSpaces( "A&nbsp;text\u0020string." ) ).toBe( "A text string." );
	} )
} );
