import unifyWhitespace from "../../../../src/languageProcessing/helpers/sanitize/unifyWhitespace.js";

describe( "A test to check if the whitespaces are filtered correctly.", function() {
	it( "returns a string with uniform whitespaces", function() {
		expect( unifyWhitespace.unifyNonBreakingSpace( "A text&nbsp;string." ) ).toBe( "A text string." );
		expect( unifyWhitespace.unifyEmDash( "A\u2014text\u2014string." ) ).toBe( "A text string." );
		expect( unifyWhitespace.unifyWhiteSpace( "A\u0020text\u0020string." ) ).toBe( "A text string." );
		expect( unifyWhitespace.unifyAllSpaces( "A&nbsp;text\u0020string\u2014that's nice." ) ).toBe( "A text string that's nice." );
	} );
} );
