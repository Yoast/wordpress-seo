import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/es/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/es/config/wordComplexity";
import functionWords from "../../../../../src/languageProcessing/languages/es/config/functionWords";

describe( "a test checking if the word is complex in Spanish",  function() {
	it( "returns singular word form as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex(  wordComplexityConfig, "original", functionWords.all ) ).toEqual( false );
	} );

	// eslint-disable-next-line max-len
	it( "returns plural word form as non-complex if its singular form is found in the list when the singular word form ends with a consonant", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "originales", functionWords.all ) ).toEqual( false );
	} );

	// eslint-disable-next-line max-len
	it( "returns plural word form as non-complex if its singular form is found in the list when the singular word form ends with a vowel", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "parecidos", functionWords.all ) ).toEqual( false );
	} );

	it( "returns word as non-complex if it starts with a capital (even if non capitalized form is complex)", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Alhambra", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "alhambra", functionWords.all ) ).toEqual( true );
	} );


	it( "returns word as non-complex if it is found in the function words list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "diecisiete", functionWords.all ) ).toEqual( false );
	} );

	it( "returns plural word as complex if it (and its singular form) are not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "situados", functionWords.all ) ).toEqual( true );
	} );

	it( "returns word longer than 7 characters as complex if it's not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "contemplada", functionWords.all ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "cosas", functionWords.all ) ).toEqual( false );
	} );
} );
