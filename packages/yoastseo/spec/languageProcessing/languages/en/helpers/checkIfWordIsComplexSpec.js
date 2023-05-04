import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/en/config/wordComplexity";

describe( "a test checking if the word is complex in English",  function() {
	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "example" ) ).toEqual( false );
	} );

	it( "returns word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "examples" ) ).toEqual( false );
	} );

	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "release" ) ).toEqual( false );
	} );

	it( "returns plural word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "releases" ) ).toEqual( false );
	} );

	it( "returns plural word as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "refrigerators" ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word starts with capital letter", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Tortoiseshell" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "Outsiders" ) ).toEqual( false );
	} );

	it( "returns words as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "cat" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "rabbit" ) ).toEqual( false );
	} );
} );
