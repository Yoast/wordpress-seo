import regex from "./../../../../src/researches/hungarian/passiveVoice/regex.js";
const verbsEndingWithVe = regex().verbsEndingWithVe;
const verbsEndingWithVa = regex().verbsEndingWithVa;
const verbsEndingWithOdni1 = regex().verbsEndingWithOdni1;
const verbsEndingWithOdni2 = regex().verbsEndingWithOdni2;

describe( "Matches verbs with the verb regexes for Hungarian.", function() {
	it( "returns the matched verb ending with -ve", function() {
		expect( verbsEndingWithVe( "festve" ) ).toEqual( [ "festve" ] );
	} );

	it( "returns the matched verb ending with -va", function() {
		expect( verbsEndingWithVa( "takarva" ) ).toEqual( [ "takarva" ] );
	} );

	it( "returns the matched verb ending with -ódni", function() {
		expect( verbsEndingWithOdni1( "állítódni" ) ).toEqual( [ "állítódni" ] );
	} );

	it( "returns the matched verb ending with -ődni", function() {
		expect( verbsEndingWithOdni2( "intéződni" ) ).toEqual( [ "intéződni" ] );
	} );

	it( "returns an empty array when nothing is matched with the verbsEndingWithVe regex", function() {
		expect( verbsEndingWithVe( "játszik" ) ).toEqual( [ ] );
	} );

	it( "returns an empty array when nothing is matched with the verbsEndingWithVa regex", function() {
		expect( verbsEndingWithVa( "játszik" ) ).toEqual( [ ] );
	} );

	it( "returns an empty array when nothing is matched with the verbsEndingWithOdni1 regex", function() {
		expect( verbsEndingWithOdni1( "játszik" ) ).toEqual( [ ] );
	} );
	it( "returns an empty array when nothing is matched with the verbsEndingWithOdni2 regex", function() {
		expect( verbsEndingWithOdni2( "játszik" ) ).toEqual( [ ] );
	} );
} );
