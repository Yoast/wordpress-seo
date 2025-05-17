import baseStemmer from "../../../../src/languageProcessing/helpers/morphology/baseStemmer";

describe( "Test for the base stemmer where it returns the input word", () => {
	it( "returns the input word", () => {
		expect( baseStemmer( "cats" ) ).toBe( "cats" );
	} );
} );
