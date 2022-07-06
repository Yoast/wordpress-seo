import checkIfWordIsComplex from "../../../../../src/languageProcessing/languages/en/helpers/checkIfWordIsComplex";

describe( "a test checking if the word is complex in English",  function() {
	it( "returns word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( "examples" ) ).toEqual(
			false
		);
	} );
	it( "returns word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( "example" ) ).toEqual(
			false
		);
	} );
	it( "returns word as non-complex if its singular version is found in the list", function() {
		expect( checkIfWordIsComplex( "characters" ) ).toEqual(
			false
		);
	} );
	it( "returns word as non-complex if it is found in the list", function() {
		expect( checkIfWordIsComplex( "character" ) ).toEqual(
			false
		);
	} );
	it( "returns word as complex if it ends on -s and is not in the list", function() {
		expect( checkIfWordIsComplex( "refrigerators" ) ).toEqual(
			true
		);
	} );
} );
