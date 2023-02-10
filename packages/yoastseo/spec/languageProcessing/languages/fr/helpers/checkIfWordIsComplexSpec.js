import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/fr/helpers/checkIfWordIsComplex";
import wordComplexityConfig from "../../../../../src/languageProcessing/languages/fr/config/wordComplexity";
import functionWords from "../../../../../src/languageProcessing/languages/fr/config/functionWords";

const configs = {
	wordComplexity: wordComplexityConfig,
	functionWords: functionWords.all,
};

describe( "a test checking if the word is complex in French",  function() {
	it( "returns singular words as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( configs, "résidence" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "signature" ) ).toEqual( false );
	} );

	it( "returns a plural words as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( configs,  "résidences" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "signatures" ) ).toEqual( false );
	} );

	it( "returns plural words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( configs, "dictionnaires" ) ).toEqual( true );
	} );

	it( "returns singular words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( configs, "dictionnaire" ) ).toEqual( true );
	} );

	it( "returns plural words longer than 9 characters as non complex if the words start with capital letter", function() {
		expect( checkIfWordIsComplex( configs, "Opérations" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "Éclairage" ) ).toEqual( false );
	} );

	it( "returns function words longer than 9 characters as non complex", function() {
		expect( checkIfWordIsComplex( configs, "continuellement" ) ).toEqual( false );
	} );

	it( "returns words as non complex if the words are less than 9 characters", function() {
		expect( checkIfWordIsComplex( configs, "chanson" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "ouvrir" ) ).toEqual( false );
	} );

	it( "returns words longer than 9 characters preceded by article l' or preposition d' as non complex if the words are in the list", function() {
		expect( checkIfWordIsComplex( configs, "l'ambassadeur" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "d'échantillon" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "s'appartient" ) ).toEqual( false );
	} );

	it( "returns word shorter than 9 characters as non complex even when it's preceded by an l' article or " +
		"a contracted preposition that increases its length", function() {
		expect( checkIfWordIsComplex( configs, "l'occident" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "d'extension" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "c'extension" ) ).toEqual( false );
	} );

	it( "returns word longer than 9 characters which starts with capital letter as non complex even when it's preceded by an l' article " +
		"or a contracted preposition", function() {
		expect( checkIfWordIsComplex( configs, "l'Orthodoxie" ) ).toEqual( false );
		expect( checkIfWordIsComplex( configs, "c'Égalisation" ) ).toEqual( false );
	} );
} );
