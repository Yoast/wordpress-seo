import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/de/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/de/config/wordComplexity";
import functionWords from "../../../../../src/languageProcessing/languages/de/config/functionWords";

const configs = {
	wordComplexity: wordComplexityConfig,
	functionWords: functionWords.all,
};

describe( "a test checking if the word is complex in German",  function() {
	it( "returns singular word form as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( configs, "präsident" ) ).toEqual( false );
	} );

	it( "returns plural word form as non-complex if its singular form is found in the list", function() {
		expect( checkIfWordIsComplex( configs, "Verstärkungen" ) ).toEqual( false );
	} );

	it( "returns plural word form as non-complex if its singular form is found in the list", function() {
		expect( checkIfWordIsComplex( configs, "Gouverneure" ) ).toEqual( false );
	} );
	it( "returns word as non-complex if it is found in the function words list", function() {
		expect( checkIfWordIsComplex( configs, "verschiedenes" ) ).toEqual( false );
	} );

	it( "returns plural word as complex if it (and its singular form) are not in the list", function() {
		expect( checkIfWordIsComplex( configs, "optimierungen" ) ).toEqual( true );
	} );

	it( "returns word longer than 10 characters as complex if it's not in the list", function() {
		expect( checkIfWordIsComplex( configs, "architektonisch" ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word is less than 10 characters", function() {
		expect( checkIfWordIsComplex( configs, "boxen" ) ).toEqual( false );
	} );

	it( "recognized contractions when the contraction uses ’ (right single quotation mark) instead of ' (apostrophe)", function() {
		expect( checkIfWordIsComplex( configs, "l’histoire" ) ).toEqual( false );
	} );
} );
