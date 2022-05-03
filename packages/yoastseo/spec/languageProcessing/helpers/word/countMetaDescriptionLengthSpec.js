import metaDescriptionLength from "../../../../src/languageProcessing/helpers/word/countMetaDescriptionLength";

describe( "the meta description length research", function() {
	it( "returns the length of the description when the date is empty", function() {
		const result = metaDescriptionLength( "", "a description with a word" );
		expect( result ).toBe( 25 );
	} );

	it( "returns the length of the description when the date is not empty", function() {
		const result = metaDescriptionLength( "9 September 2021", "a description with a word" );
		expect( result ).toBe( 44 );
	} );

	it( "returns the length (0) of the description", function() {
		const result = metaDescriptionLength( "", "" );
		expect( result ).toBe( 0 );
	} );
} );
