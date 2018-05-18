var sanitizeString = require( "../../js/stringProcessing/sanitizeString.js" );

describe( "Test for removing unwanted characters", function() {
	it( "returns cleaned string", function() {
		// Because regexes are now properly escaped, there is no need to strip characters like * from the keyword.
		expect( sanitizeString( "keyword*?!.+-[]()<>«»:;/\\‹›" ) ).toBe( "keyword*?!.+-[]()<>«»:;/\\‹›" );
		expect( sanitizeString( "keyword<p></p>" ) ).toBe( "keyword" );
	} );
	it( "returns cleaned string containing /", function() {
		expect( sanitizeString( "50/50" ) ).toBe( "50/50" );
		expect( sanitizeString( "<p>50/50</p>" ) ).toBe( "50/50" );
	} );
} );
