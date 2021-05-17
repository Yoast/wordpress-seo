import stripNumbers from "../../../../src/languageProcessing/helpers/sanitize/stripNumbers.js";

describe( "A test to check if all words comprised only of numbers are removed.", function() {
	it( "returns a string with only 'numberonly' words removed", function() {
		expect( stripNumbers( "this is a text" ) ).toBe( "this is a text" );
		expect( stripNumbers( "this is a text 1983" ) ).toBe( "this is a text" );
		expect( stripNumbers( "this is a text1234" ) ).toBe( "this is a text1234" );
	} );

	it( "doesn't return a single full stop", function() {
		expect( stripNumbers( "1234." ) ).toBe( "" );
	} );
} );
