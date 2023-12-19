import transformWordsWithHyphens from "../../../../src/languageProcessing/helpers/transform/transformWordsWithHyphens";

describe( "a test for transforming words in an array with hyphens", () => {
	it( "should split words on hyphens and add the split words to the array if they are not yet there", () => {
		expect( transformWordsWithHyphens( [ "via", "vis-à-vis", "without", "ago" ] ) ).toEqual(
			[ "via", "vis-à-vis", "without", "ago", "vis", "à", "vis" ]
		);
	} );
	it( "should split words on hyphens but should not add the split words to the array if they are already in the list", () => {
		expect( transformWordsWithHyphens( [ "so-called", "so", "called", "mainly", "mostly" ] ) ).toEqual(
			[ "so-called", "so", "called", "mainly", "mostly" ]
		);
	} );
} );
