import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/fr/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/fr/config/wordComplexity";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "fr" ).fr;

describe( "a test checking if the word is complex in French",  function() {
	it( "returns singular words as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "résidence" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "signature" ) ).toEqual( false );
	} );

	it( "returns a plural words as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig,  "résidences", morphologyData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "signatures", morphologyData ) ).toEqual( false );
	} );

	it( "returns plural words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "dictionnaires", morphologyData ) ).toEqual( true );
	} );

	it( "returns singular words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "dictionnaire" ) ).toEqual( true );
	} );

	it( "returns words longer than 9 characters (including plurals) as non complex if the words start with capital letter", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Opérations", morphologyData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "Éclairage" ) ).toEqual( false );
	} );

	it( "returns words as non complex if the words are less than 9 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "chanson" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "ouvrir" ) ).toEqual( false );
	} );
	it( "returns irregular plural as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig,  "principaux", morphologyData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "principal", morphologyData ) ).toEqual( false );
	} );

	it( "returns irregular plural words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "expérimentaux", morphologyData ) ).toEqual( true );
	} );

	it( "returns an -x plural as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig,  "vaisseaux", morphologyData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "vaisseau", morphologyData ) ).toEqual( false );
	} );

	it( "returns words longer than 9 characters preceded by article l' or preposition d' as non complex if the words are in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'ambassadeur" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "d'échantillon" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "s'appartient" ) ).toEqual( false );
	} );

	it( "returns word shorter than 9 characters as non complex even when it's preceded by an l' article or " +
		"a contracted preposition that increases its length", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'occident" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "d'extension" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "c'extension" ) ).toEqual( false );
	} );

	it( "returns word longer than 9 characters which starts with capital letter as non complex even when it's preceded by an l' article " +
		"or a contracted preposition", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'Orthodoxie" ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "c'Égalisation" ) ).toEqual( false );
	} );
} );
