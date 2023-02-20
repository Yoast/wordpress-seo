import checkIfWordIsFunction from "../../../../../src/languageProcessing/languages/de/helpers/checkIfWordIsFunction";

describe( "a test checking if the word is function in German",  function() {
	it( "return word if function if word in lower case", function() {
		expect( checkIfWordIsFunction( "verhältnismäßig" ) ).toEqual( true );
	} );

	it( "return word if function if word in upper case", function() {
		expect( checkIfWordIsFunction( "Wahrscheinlichkeit" ) ).toEqual( true );
	} );

	it( "returns word is not funtion if word is not in the function words list", function() {
		expect( checkIfWordIsFunction( "gebildeten" ) ).toEqual( false );
	} );
} );
