let countSyllableFunction = require( "../../../js/stringProcessing/syllables/count.js" );

describe( "a syllable counter for Italian text strings", function () {
	// I cannot find an example for 'aí', but theoretically this combination would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable a[íúeo]", function () {
		expect( countSyllableFunction( "aí", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "paúra", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "paese", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "faraone", "it_IT" ) ).toBe( 4 );
	} );

	// I cannot find an example for 'eí' and 'eú', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable e[íúao]", function () {
		expect( countSyllableFunction( "eí", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "eú", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "realtà", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "preoccupa", "it_IT" ) ).toBe( 4 );
	} );

	// I cannot find an example for 'oí' and 'oú', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable o[íúaeè]", function () {
		expect( countSyllableFunction( "oí", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "oú", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "radioattivo", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "coeditare", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "cioè", "it_IT" ) ).toBe( 2 );
	} );

	// I cannot find an example for 'ío', but theoretically this combination would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable í[aeo]", function () {
		expect( countSyllableFunction( "gía", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "míe", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "ío", "it_IT" ) ).toBe( 2 );
	} );

	// I cannot find an example for 'úa', 'úe' and 'úo', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable ú[aeo]", function () {
 		expect( countSyllableFunction( "úa", "it_IT" ) ).toBe( 2 );
 		expect( countSyllableFunction( "úe", "it_IT" ) ).toBe( 2 );
 		expect( countSyllableFunction( "úo", "it_IT" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ai[aeou]", function () {
		expect( countSyllableFunction( "carbonaia", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "aiere", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "abbaio", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "aiuto", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable àii", function () {
		expect( countSyllableFunction( "omàiiade", "it_IT" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable aiì", function () {
		expect( countSyllableFunction( "hawaiìte", "it_IT" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable au[eé]", function () {
		expect( countSyllableFunction( "sauerkraut", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "pauése", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ei[aàeèé]", function () {
		expect( countSyllableFunction( "pompeianése", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "proculeiàno", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "biedermeier", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "deiètto", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "breiése", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable èia", function () {
		expect( countSyllableFunction( "batèia", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ia[èiì]", function () {
		expect( countSyllableFunction( "aliaèto", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "liaison", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "gravegliaìte", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable iài", function () {
		expect( countSyllableFunction( "acciàio", "it_IT" ) ).toBe( 3 );
	} );

} );
