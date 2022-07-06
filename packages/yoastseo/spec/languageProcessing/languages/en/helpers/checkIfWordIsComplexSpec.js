import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";

describe( "a test checking if the word is complex in English",  function() {
	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( "example" ) ).toEqual( false );
	} );

	it( "returns word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( "examples" ) ).toEqual( false );
	} );

	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( "release" ) ).toEqual( false );
	} );

	it( "returns plural word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( "releases" ) ).toEqual( false );
	} );

	it( "returns plural word as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( "refrigerators" ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word starts with capital letter", function() {
		expect( checkIfWordIsComplex( "Tortoiseshell" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "Outsiders" ) ).toEqual( false );
	} );

	it( "returns plural word as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( "cat" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "rabbit" ) ).toEqual( false );
	} );
} );
