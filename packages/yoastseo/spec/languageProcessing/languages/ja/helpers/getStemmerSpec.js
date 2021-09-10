import getStemmer from "../../../../../src/languageProcessing/languages/ja/helpers/getStemmer";

describe( "Test for the base stemmer where it returns the input word", () => {
	it( "returns the input word", () => {
		expect( getStemmer()( "食べる" ) ).toBe( "食べる" );
	} );
} );
