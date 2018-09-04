var parseSynonyms = require( "../../src/stringProcessing/parseSynonyms" );

describe( "A test for parsing a comma-separated list of synonyms into an array of words or phrases", function() {
	it( "Should return an array from a comma-separated string", function() {
		expect( parseSynonyms( "Item 1, item 2, item 3" ) ).toEqual( [ "Item 1", "item 2", "item 3" ] );
		expect( parseSynonyms( "Item 1,item 2,                 item 3" ) ).toEqual( [ "Item 1", "item 2", "item 3" ] );
		expect( parseSynonyms( "Item 1., !item 2, item 3?" ) ).toEqual( [ "Item 1", "item 2", "item 3" ] );
		expect( parseSynonyms( ", ," ) ).toEqual( [] );
		expect( parseSynonyms( "!, ,?" ) ).toEqual( [] );
		expect( parseSynonyms( "To be, or not to be, that is the question:" ) ).toEqual( [ "To be", "or not to be", "that is the question" ] );
		expect( parseSynonyms( "To be,or not to be,that is the question:" ) ).toEqual( [ "To be", "or not to be", "that is the question" ] );
	} );
	it( "Should keep double quotation marks, which are needed to figure out if morphological analysis should be performed", function() {
		expect( parseSynonyms( "\"Item 1\", item 2, item 3" ) ).toEqual( [ "\"Item 1\"", "item 2", "item 3" ] );
	} );
} );
