import stripSpaces from "../../../../src/languageProcessing/helpers/sanitize/stripSpaces.js";

describe( "A test to check if multiple spaces are replaced with single space.", function() {
	it( "replaces multiple spaces with single space", function() {
		expect( stripSpaces( "A  text with  spaces." ) ).toBe( "A text with spaces." );
	} );
} );

describe( "A test to check if spaces followed by a period and spaces in the beginning or ending of a string" +
	" are correctly removed.", function() {
	it( "removes the space when followed by period", function() {
		expect( stripSpaces( "A text with spaces ." ) ).toBe( "A text with spaces." );
	} );

	it( "removes first/last character if space", function() {
		expect( stripSpaces( " A text with spaces. " ) ).toBe( "A text with spaces." );
	} );
} );
