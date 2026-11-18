import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/fr/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/fr/config/wordComplexity";
import getMorphologyData from "../../../../specHelpers/getMorphologyData";
const premiumData = getMorphologyData( "fr" ).fr;

describe( "a test checking if the word is complex in French",  function() {
	it( "returns singular words as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "résidence", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "signature", premiumData ) ).toEqual( false );
	} );

	it( "returns a plural words as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig,  "résidences", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "signatures", premiumData ) ).toEqual( false );
	} );

	it( "returns plural words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "dictionnaires", premiumData ) ).toEqual( true );
	} );

	it( "returns singular words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "dictionnaire", premiumData ) ).toEqual( true );
	} );

	it( "returns plural words longer than 9 characters as non complex if the words start with capital letter", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Opérations", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "Éclairage", premiumData ) ).toEqual( false );
	} );

	it( "returns words as non complex if the words are less than 9 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "chanson", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "ouvrir", premiumData ) ).toEqual( false );
	} );

	it( "returns irregular plural as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig,  "principaux", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "principal", premiumData ) ).toEqual( false );
	} );

	it( "returns irregular plural words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "expérimentaux", premiumData ) ).toEqual( true );
	} );

	it( "returns an -x plural as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig,  "vaisseaux", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "vaisseau", premiumData ) ).toEqual( false );
	} );

	it( "returns words longer than 9 characters preceded by article l' or preposition d' as non complex if the words are in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'ambassadeur", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "d'échantillon", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "s'appartient", premiumData ) ).toEqual( false );
	} );

	it( "returns word shorter than 9 characters as non complex even when it's preceded by an l' article or " +
		"a contracted preposition that increases its length", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'occident", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "d'extension", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "c'extension", premiumData ) ).toEqual( false );
	} );

	it( "returns word longer than 9 characters which starts with capital letter as non complex even when it's preceded by an l' article " +
		"or a contracted preposition", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'Orthodoxie", premiumData ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "c'Égalisation", premiumData ) ).toEqual( false );
	} );
} );
