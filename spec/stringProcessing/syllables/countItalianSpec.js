let countSyllableFunction = require( "../../../src/stringProcessing/syllables/count.js" );

describe( "a syllable counter for Italian text strings", function() {
	// I cannot find an example for 'aí', but theoretically this combination would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable a[íúeo]", function() {
		expect( countSyllableFunction( "aí", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "paúra", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "paese", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "faraone", "it_IT" ) ).toBe( 4 );
	} );

	// I cannot find an example for 'eí' and 'eú', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable e[íúao]", function() {
		expect( countSyllableFunction( "eí", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "eú", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "realtà", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "preoccupa", "it_IT" ) ).toBe( 4 );
	} );

	// I cannot find an example for 'oí' and 'oú', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable o[íúaeè]", function() {
		expect( countSyllableFunction( "oí", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "oú", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "radioattivo", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "coeditare", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "cioè", "it_IT" ) ).toBe( 2 );
	} );

	// I cannot find an example for 'ío', but theoretically this combination would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable í[aeo]", function() {
		expect( countSyllableFunction( "gía", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "míe", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "ío", "it_IT" ) ).toBe( 2 );
	} );

	// I cannot find an example for 'úa', 'úe' and 'úo', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable ú[aeo]", function() {
		expect( countSyllableFunction( "úa", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "úe", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "úo", "it_IT" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ai[aeou]", function() {
		expect( countSyllableFunction( "carbonaia", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "aiere", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "abbaio", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "aiuto", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable àii", function() {
		expect( countSyllableFunction( "omàiiade", "it_IT" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable aiì", function() {
		expect( countSyllableFunction( "hawaiìte", "it_IT" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable au[eé]", function() {
		expect( countSyllableFunction( "sauerkraut", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "pauése", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ei[aàeèé]", function() {
		expect( countSyllableFunction( "pompeianése", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "proculeiàno", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "biedermeier", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "deiètto", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "breiése", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable èia", function() {
		expect( countSyllableFunction( "batèia", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ia[èiì]", function() {
		expect( countSyllableFunction( "aliaèto", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "liaison", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "gravegliaìte", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable iài", function() {
		expect( countSyllableFunction( "acciàio", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oi[aàeèoó]", function() {
		expect( countSyllableFunction( "boianése", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "annoiàre", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "boièra", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "dolicoierìa", "it_IT" ) ).toBe( 6 );
		expect( countSyllableFunction( "edoiorrèa", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable òia", function() {
		expect( countSyllableFunction( "acròia", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable óio", function() {
		expect( countSyllableFunction( "accecatóio", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable uí", function() {
		expect( countSyllableFunction( "suíno", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ui[aàó]", function() {
		expect( countSyllableFunction( "equiaffinità", "it_IT" ) ).toBe( 6 );
		expect( countSyllableFunction( "abbuiàre", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "buióso", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ùio", function() {
		expect( countSyllableFunction( "bùio", "it_IT" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ouï", function() {
		expect( countSyllableFunction( "chaouïa", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable coo[cmnpr]", function() {
		expect( countSyllableFunction( "cooccorrènza", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "coomologìa", "it_IT" ) ).toBe( 6 );
		expect( countSyllableFunction( "coonestràre", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "cooperaménto", "it_IT" ) ).toBe( 6 );
		expect( countSyllableFunction( "coordinànte", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable lcool", function() {
		expect( countSyllableFunction( "alcool", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable coòf", function() {
		expect( countSyllableFunction( "arcoòforo", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeuioìùèéàò]y[aeuioíìùèàó]", function() {
		expect( countSyllableFunction( "ayatollah", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "bayerìte", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "ayurvèda", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "fadayin", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "nuovayorkése", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "donnayìte", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "cayùga", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "payèna", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "hinayàna", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "freyalìte", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "beyerìte", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "peyotìna", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "neyíte", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "cleyèra", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "cayleyàno", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "tuyau", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "zabuyelìte", "it_IT" ) ).toBe( 5 );
		expect( countSyllableFunction( "guyot", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "masuyìte", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "bruyère", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "peguyàno", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "kuffiya", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "keffiyeh", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "piyùma", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "kaffiyèh", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "chutiyà", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "flamboyant", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "foyer", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "chetoyobirìna", "it_IT" ) ).toBe( 6 );
		expect( countSyllableFunction( "moyìte", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "royèna", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "coyóte", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "avokàya", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "làyia", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "abéyas", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "amberlèya", "it_IT" ) ).toBe( 4 );
		expect( countSyllableFunction( "elgèyo", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "dìya", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "wìyot", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "fitzròya", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "mòyo", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "pùya", "it_IT" ) ).toBe( 2 );
		expect( countSyllableFunction( "kikùyu", "it_IT" ) ).toBe( 3 );
		expect( countSyllableFunction( "cucùyo", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ìa$", function() {
		expect( countSyllableFunction( "abadìa", "it_IT" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable èa$", function() {
		expect( countSyllableFunction( "ampelidèa", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable aoi", function() {
		expect( countSyllableFunction( "demaoìzzazióne", "it_IT" ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words containing the add syllable aoì", function() {
		expect( countSyllableFunction( "maoista", "it_IT" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioe", function() {
		expect( countSyllableFunction( "medioevo", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable riae", function() {
		expect( countSyllableFunction( "riaeràto", "it_IT" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ïa$", function() {
		expect( countSyllableFunction( "chaouïa", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words from the exclusion full words list", function() {
		expect( countSyllableFunction( "coke, frame, mouse, coon", "it_IT" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing words from the global fragments", function() {
		expect( countSyllableFunction( "incruènto, cheerleader, breakfast", "it_IT" ) ).toBe( 9 );
	} );

	it( "returns the number of syllables of words containing words from the global fragments at the end", function() {
		expect( countSyllableFunction( "megabyte", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing words from the global fragments at the beginning", function() {
		expect( countSyllableFunction( "cheeseburger", "it_IT" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing words from the global fragments at the beginning or end", function() {
		expect( countSyllableFunction( "teamwork, mainstream", "it_IT" ) ).toBe( 4 );
	} );
} );
