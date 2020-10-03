import removeNonWord from "../../src/researches/stringProcessing/removeNonWordCharacters.js";

describe( "a test removing spaces from a string", function() {
	it( "returns string without spaces", function() {
		expect( removeNonWord( " test " ) ).toBe( "test" );
		expect( removeNonWord( " test. " ) ).toBe( "test" );
	} );
} );
