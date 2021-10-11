import getStemmer from "../../../../../src/languageProcessing/languages/el/helpers/getStemmer";

describe( "Test for the base stemmer where it returns the input word", () => {
	it( "returns the input word", () => {
		expect( getStemmer()( "γάτες" ) ).toBe( "γάτες" );
	} );
} );
