import filterFunctionWordsFromArray from "../../src/languageProcessing/helpers/_todo/filterFunctionWordsFromArray.js";

describe( "A test for filtering out function words from an array of words for a given language", function() {
	it( "returns the array of content words for absent locale", function() {
		const filteredArray = filterFunctionWordsFromArray( [ "I", "am", "going", "for", "a", "walk" ] );
		expect( filteredArray ).toEqual( [].concat( "walk" ) );
	} );

	it( "returns the array of content words for an empty language as if it was English", function() {
		const filteredArray = filterFunctionWordsFromArray( [ "I", "am", "going", "for", "a", "walk" ], "" );
		expect( filteredArray ).toEqual( [].concat( "walk" ) );
	} );

	it( "returns the original array of words for a non-existing language", function() {
		const filteredArray = filterFunctionWordsFromArray( [ "I", "am", "going", "for", "a", "walk" ], "yep" );
		expect( filteredArray ).toEqual( [ "I", "am", "going", "for", "a", "walk" ] );
	} );

	it( "returns the array of content words for English", function() {
		const filteredArray = filterFunctionWordsFromArray( [ "I", "am", "going", "for", "a", "walk" ], "en" );
		expect( filteredArray ).toEqual( [].concat( "walk" ) );
	} );

	it( "returns the array of content words for French", function() {
		const filteredArray = filterFunctionWordsFromArray( [ "Je", "ne", "vais", "pas", "rire" ], "fr" );
		expect( filteredArray ).toEqual( [].concat( "rire" ) );
	} );

	it( "returns the array of content words for Spanish", function() {
		const filteredArray = filterFunctionWordsFromArray( [ "Como", "hacer", "guacamole", "como", "los", "mexicanos" ], "es" );
		expect( filteredArray ).toEqual( [].concat( "guacamole", "mexicanos" ) );
	} );
} );
