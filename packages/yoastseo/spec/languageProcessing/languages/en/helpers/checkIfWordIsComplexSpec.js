import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/en/config/wordComplexity";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const premiumData = getMorphologyData( "en" ).en;

describe( "a test checking if the word is complex in English",  function() {
	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "example", premiumData ) ).toEqual( false );
	} );

	it( "returns word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "examples", premiumData ) ).toEqual( false );
	} );

	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "release", premiumData ) ).toEqual( false );
	} );

	it( "returns plural word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "releases", premiumData ) ).toEqual( false );
	} );

	it( "returns plural (with phonetical) change word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "opportunities", premiumData ) ).toEqual( false );
	} );

	it( "returns long irregular plural word as complex if its singular version is not found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "metamorphoses", premiumData ) ).toEqual( true );
	} );

	it( "returns long plural word as complex if its singular version is not found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "anesthesias", premiumData ) ).toEqual( true );
	} );

	it( "returns plural word as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "refrigerators", premiumData ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word starts with capital letter", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Tortoiseshell", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "Outsiders", premiumData ) ).toEqual( false );
	} );

	it( "returns words as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "cat", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "rabbit", premiumData ) ).toEqual( false );
	} );

	it( "returns words as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "cat", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "rabbit", premiumData ) ).toEqual( false );
	} );
} );
