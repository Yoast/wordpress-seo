import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/de/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/de/config/wordComplexity";
import functionWords from "../../../../../src/languageProcessing/languages/de/config/functionWords";

describe( "a test checking if the word is complex in German",  function() {
	it( "returns singular word form as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "präsident", functionWords.all ) ).toEqual( false );
	} );

	it( "returns plural word form as non-complex if its singular form is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Verstärkungen", functionWords.all ) ).toEqual( false );
	} );

	it( "returns plural word form as non-complex if its singular form is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Gouverneure", functionWords.all ) ).toEqual( false );
	} );
	it( "returns word as non-complex if it is found in the function words list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "verschiedenes", functionWords.all ) ).toEqual( false );
	} );

	it( "returns plural word as complex if it (and its singular form) are not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "optimierungen", functionWords.all ) ).toEqual( true );
	} );

	it( "returns word longer than 10 characters as complex if it's not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "architektonisch", functionWords.all ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word is less than 10 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "boxen", functionWords.all ) ).toEqual( false );
	} );

	it( "recognized contractions when the contraction uses ’ (right single quotation mark) instead of ' (apostrophe)", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l’histoire", functionWords.all ) ).toEqual( false );
	} );
} );
