import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/fr/helpers/checkIfWordIsComplex";

describe( "a test checking if the word is complex in French",  function() {
	it( "returns singular words as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( "résidence" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "signature" ) ).toEqual( false );
	} );

	it( "returns a plural words as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( "résidences" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "signatures" ) ).toEqual( false );
	} );

	it( "returns plural words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( "dictionnaires" ) ).toEqual( true );
	} );

	it( "returns singular words longer than 9 characters as complex if it is not in the list", function() {
		expect( checkIfWordIsComplex( "dictionnaire" ) ).toEqual( true );
	} );

	it( "returns plural words longer than 9 characters as non complex if the words start with capital letter", function() {
		expect( checkIfWordIsComplex( "Opérations" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "Éclairage" ) ).toEqual( false );
	} );

	it( "returns function words longer than 9 characters as non complex", function() {
		expect( checkIfWordIsComplex( "continuellement" ) ).toEqual( false );
	} );

	it( "returns words as non complex if the words are less than 9 characters", function() {
		expect( checkIfWordIsComplex( "chanson" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "ouvrir" ) ).toEqual( false );
	} );

	it( "returns words longer than 9 characters preceded by article l' or preposition d' as non complex if the words are in the list", function() {
		expect( checkIfWordIsComplex( "l'ambassadeur" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "d'échantillon" ) ).toEqual( false );
	} );

	it( "returns word shorter than 9 characters as non complex even when it's preceded by an l' article or " +
		"a preposition d' that increases its length", function() {
		expect( checkIfWordIsComplex( "l'occident" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "d'extension" ) ).toEqual( false );
	} );

	it( "returns word longer than 9 characters which starts with capital letter as non complex even when it's preceded by an l' article " +
		"or a preposition d'", function() {
		expect( checkIfWordIsComplex( "l'Orthodoxie" ) ).toEqual( false );
		expect( checkIfWordIsComplex( "d'Égalisation" ) ).toEqual( false );
	} );
} );
