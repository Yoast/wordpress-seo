import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/en/config/wordComplexity";

const configs = {
	wordComplexity: wordComplexityConfig,
};

describe( "a test checking if the word is complex in English",  function() {
	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( configs, "example" ) ).toEqual( false );
	} );

	it( "returns word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( configs, "examples" ) ).toEqual( false );
	} );

	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( configs, "release" ) ).toEqual( false );
	} );

	it( "returns plural word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( configs, "releases" ) ).toEqual( false );
	} );

	it( "returns plural word as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( configs, "refrigerators" ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word starts with capital letter", function() {
		expect( checkIfWordIsComplex( configs, "Tortoiseshell" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "Outsiders" ) ).toEqual( false );
	} );

	it( "returns words as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( configs, "cat" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "rabbit" ) ).toEqual( false );
	} );
} );
