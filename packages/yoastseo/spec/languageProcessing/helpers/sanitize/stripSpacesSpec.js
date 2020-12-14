import stripSpaces from "../../../../src/languageProcessing/helpers/sanitize/stripSpaces.js";

describe( "A test to check if multiple spaces are replaced with single space", function() {
	it( "Replaces multiple spaces with single space.", function() {
		expect( stripSpaces( "A  text with  spaces." ) ).toBe( "A text with spaces." );
	} );
} );

describe( "A test to check if spaces followed by a period and spaces in the beginning or ending of a string" +
	" are correctly removed.", function() {
	it( "Replace spaces followed by periods with only the period.", function() {
		expect( stripSpaces( "A text with spaces ." ) ).toBe( "A text with spaces." );
	} );

	it( "Removes first/last character if space.", function() {
		expect( stripSpaces( " A text with spaces. " ) ).toBe( "A text with spaces." );
	} );
} );
