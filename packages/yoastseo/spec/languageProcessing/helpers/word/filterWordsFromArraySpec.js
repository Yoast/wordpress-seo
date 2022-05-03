import filterWordsFromArray from "../../../../src/languageProcessing/helpers/word/filterWordsFromArray.js";

describe( "A test for filtering out certain words from an array of words", function() {
	it( "returns the original array with the certain words filtered out", function() {
		const filteredArray = filterWordsFromArray( [ "the", "most", "beautiful", "cat" ], [ "the", "most", "beautiful" ] );
		expect( filteredArray ).toEqual( [ "cat" ]  );
	} );

	it( "returns the original array when there is no list of certain words to filter out", function() {
		const filteredArray = filterWordsFromArray( [ "I", "am", "going", "for", "a", "walk" ] );
		expect( filteredArray ).toEqual( [ "I", "am", "going", "for", "a", "walk" ] );
	} );

	it( "returns an empty array when both the original array and the array of certain words to filter out are empty ", function() {
		const filteredArray = filterWordsFromArray( [] );
		expect( filteredArray ).toEqual( [] );
	} );
} );
