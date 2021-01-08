import removeNonWord from "../../../../src/languageProcessing/helpers/sanitize/removeNonWordCharacters.js";

describe( "a test for removing non-word characters from a string", function() {
	it( "returns string without spaces", function() {
		expect( removeNonWord( " test " ) ).toBe( "test" );
		expect( removeNonWord( " test. " ) ).toBe( "test" );
	} );

	it( "returns string without non-word characters", function() {
		expect( removeNonWord( "(test)" ) ).toBe( "test" );
		expect( removeNonWord( "test?" ) ).toBe( "test" );
	} );
} );
