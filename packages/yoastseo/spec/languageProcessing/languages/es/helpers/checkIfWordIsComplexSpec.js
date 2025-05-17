import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/es/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/es/config/wordComplexity";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";
const premiumData = getMorphologyData( "es" ).es;

describe( "a test checking if the word is complex in Spanish",  function() {
	it( "returns singular word form as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "original", premiumData ) ).toEqual( false );
	} );

	it( "returns plural word form as non-complex if its singular form is found in the list when the singular word form ends with a consonant", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "originales", premiumData ) ).toEqual( false );
	} );

	it( "returns plural word form as non-complex if its singular form is found in the list when the singular word form ends with a vowel", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "parecidos", premiumData ) ).toEqual( false );
	} );

	it( "returns word as non-complex if it starts with a capital (even if non capitalized form is complex)", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Alhambra", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "alhambra", premiumData ) ).toEqual( true );
	} );

	it( "returns plural word as complex if it (and its singular form) are not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "situados", premiumData ) ).toEqual( true );
	} );

	it( "returns word longer than 7 characters as complex if it's not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "contemplada", premiumData ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "cosas", premiumData ) ).toEqual( false );
	} );
} );
