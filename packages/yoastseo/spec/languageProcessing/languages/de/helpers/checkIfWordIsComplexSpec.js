import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/de/helpers/checkIfWordIsComplex";

describe( "a test checking if the word is complex in German",  function() {
	it( "returns singular wordform as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( "präsident" ) ).toEqual( false );
	} );

	it( "returns plural word form as non-complex if its singular form is found in the list", function() {
		expect( checkIfWordIsComplex( "Präsidenten" ) ).toEqual( false );
	} );

	it( "returns word as non-complex if it is found in the function words list", function() {
		expect( checkIfWordIsComplex( "verschiedenes" ) ).toEqual( false );
	} );

	it( "returns plural word as complex if it (and it's singular form) are not in the list", function() {
		expect( checkIfWordIsComplex( "optimierungen" ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word is less than 10 characters", function() {
		expect( checkIfWordIsComplex( "boxen" ) ).toEqual( false );
	} );
} );
