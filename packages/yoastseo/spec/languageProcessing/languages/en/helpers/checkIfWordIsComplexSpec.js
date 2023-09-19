import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/en/config/wordComplexity";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "en" ).en;

describe( "a test checking if the word is complex in English",  function() {
	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "example", morphologyData ) ).toEqual( false );
	} );

	it( "returns word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "examples", morphologyData ) ).toEqual( false );
	} );

	it( "returns singular word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "release", morphologyData ) ).toEqual( false );
	} );

	it( "returns plural word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "releases", morphologyData ) ).toEqual( false );
	} );

	it( "returns plural (with phonetical) change word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "opportunities" ) ).toEqual( true );
		expect( checkIfWordIsComplex( wordComplexityConfig, "opportunities", morphologyData ) ).toEqual( false );
	} );

	it( "returns long irregular plural word as complex if its singular version is not found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "metamorphoses", morphologyData ) ).toEqual( true );
	} );

	it( "returns long plural word as complex if its singular version is not found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "anesthesias", morphologyData ) ).toEqual( true );
	} );

	it( "returns plural word as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "refrigerators", morphologyData ) ).toEqual( true );
	} );

	it( "returns plural word as non complex if the word starts with capital letter", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Tortoiseshell", morphologyData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "Outsiders", morphologyData ) ).toEqual( false );
	} );

	it( "returns words as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "cat", morphologyData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "rabbit", morphologyData ) ).toEqual( false );
	} );

	it( "returns words as non complex if the word is less than 7 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "cat", morphologyData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "rabbit", morphologyData ) ).toEqual( false );
	} );
} );
