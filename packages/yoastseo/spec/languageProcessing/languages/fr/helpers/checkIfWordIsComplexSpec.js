import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/fr/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/fr/config/wordComplexity";
import functionWords from "../../../../../src/languageProcessing/languages/fr/config/functionWords";

describe( "a test checking if the word is complex in French",  function() {
	it( "returns singular words as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "résidence", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "signature", functionWords.all ) ).toEqual( false );
	} );

	it( "returns a plural words as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig,  "résidences", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "signatures", functionWords.all ) ).toEqual( false );
	} );

	it( "returns plural words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "dictionnaires", functionWords.all ) ).toEqual( true );
	} );

	it( "returns singular words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "dictionnaire", functionWords.all ) ).toEqual( true );
	} );

	it( "returns plural words longer than 9 characters as non complex if the words start with capital letter", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "Opérations", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "Éclairage", functionWords.all ) ).toEqual( false );
	} );

	it( "returns function words longer than 9 characters as non complex", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "continuellement", functionWords.all ) ).toEqual( false );
	} );

	it( "returns words as non complex if the words are less than 9 characters", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "chanson", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "ouvrir", functionWords.all ) ).toEqual( false );
	} );

	it( "returns words longer than 9 characters preceded by article l' or preposition d' as non complex if the words are in the list", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'ambassadeur", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "d'échantillon", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "s'appartient", functionWords.all ) ).toEqual( false );
	} );

	it( "returns word shorter than 9 characters as non complex even when it's preceded by an l' article or " +
		"a contracted preposition that increases its length", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'occident", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "d'extension", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "c'extension", functionWords.all ) ).toEqual( false );
	} );

	it( "returns word longer than 9 characters which starts with capital letter as non complex even when it's preceded by an l' article " +
		"or a contracted preposition", function() {
		expect( checkIfWordIsComplex( wordComplexityConfig, "l'Orthodoxie", functionWords.all ) ).toEqual( false );
		expect( checkIfWordIsComplex( wordComplexityConfig, "c'Égalisation", functionWords.all ) ).toEqual( false );
	} );
} );
