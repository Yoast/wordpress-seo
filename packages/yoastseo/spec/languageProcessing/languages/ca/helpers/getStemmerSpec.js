import getStemmer from "../../../../../src/languageProcessing/languages/ca/helpers/getStemmer";

describe( "Test for the base stemmer where it returns the input word", () => {
	it( "returns the input word", () => {
		expect( getStemmer()( "gats" ) ).toBe( "gats" );
	} );
} );
