import checkIfWordIsFunction from "../../../../../src/languageProcessing/languages/de/helpers/checkIfWordIsFunction";

describe( "a test for checking if the word is a function word in German",  function() {
	it( "returns true if the word is a function word in lowercase", function() {
		expect( checkIfWordIsFunction( "verhältnismäßig" ) ).toEqual( true );
	} );

	it( "returns true if the word is a function word in uppercase", function() {
		expect( checkIfWordIsFunction( "Wahrscheinlichkeit" ) ).toEqual( true );
	} );

	it( "returns false if the word is not found in the list", function() {
		expect( checkIfWordIsFunction( "gebildeten" ) ).toEqual( false );
	} );
} );
