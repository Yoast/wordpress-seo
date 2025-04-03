import countSyllableFunction from "../../../../../src/languageProcessing/helpers/syllables/countSyllables.js";
import italianSyllables from "../../../../../src/languageProcessing/languages/it/config/syllables.json";

describe( "a syllable counter for Italian text strings", function() {
	// I cannot find an example for 'aí', but theoretically this combination would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable a[íúeo]", function() {
		expect( countSyllableFunction( "aí", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "paúra", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "paese", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "faraone", italianSyllables ) ).toBe( 4 );
	} );

	// I cannot find an example for 'eí' and 'eú', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable e[íúao]", function() {
		expect( countSyllableFunction( "eí", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "eú", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "realtà", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "preoccupa", italianSyllables ) ).toBe( 4 );
	} );

	// I cannot find an example for 'oí' and 'oú', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable o[íúaeè]", function() {
		expect( countSyllableFunction( "oí", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "oú", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "radioattivo", italianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "coeditare", italianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "cioè", italianSyllables ) ).toBe( 2 );
	} );

	// I cannot find an example for 'ío', but theoretically this combination would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable í[aeo]", function() {
		expect( countSyllableFunction( "gía", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "míe", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "ío", italianSyllables ) ).toBe( 2 );
	} );

	// I cannot find an example for 'úa', 'úe' and 'úo', but theoretically these combinations would be 2 syllables.
	it( "returns the number of syllables of words containing the subtract syllable ú[aeo]", function() {
		expect( countSyllableFunction( "úa", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "úe", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "úo", italianSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ai[aeou]", function() {
		expect( countSyllableFunction( "carbonaia", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "aiere", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "abbaio", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "aiuto", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable àii", function() {
		expect( countSyllableFunction( "omàiiade", italianSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable aiì", function() {
		expect( countSyllableFunction( "hawaiìte", italianSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable au[eé]", function() {
		expect( countSyllableFunction( "sauerkraut", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "pauése", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ei[aàeèé]", function() {
		expect( countSyllableFunction( "pompeianése", italianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "proculeiàno", italianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "biedermeier", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "deiètto", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "breiése", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable èia", function() {
		expect( countSyllableFunction( "batèia", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ia[èiì]", function() {
		expect( countSyllableFunction( "aliaèto", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "liaison", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "gravegliaìte", italianSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable iài", function() {
		expect( countSyllableFunction( "acciàio", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oi[aàeèoó]", function() {
		expect( countSyllableFunction( "boianése", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "annoiàre", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "boièra", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "dolicoierìa", italianSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "edoiorrèa", italianSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable òia", function() {
		expect( countSyllableFunction( "acròia", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable óio", function() {
		expect( countSyllableFunction( "accecatóio", italianSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable uí", function() {
		expect( countSyllableFunction( "suíno", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ui[aàó]", function() {
		expect( countSyllableFunction( "equiaffinità", italianSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "abbuiàre", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "buióso", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ùio", function() {
		expect( countSyllableFunction( "bùio", italianSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ouï", function() {
		expect( countSyllableFunction( "chaouïa", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable coo[cmnpr]", function() {
		expect( countSyllableFunction( "cooccorrènza", italianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "coomologìa", italianSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "coonestràre", italianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "cooperaménto", italianSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "coordinànte", italianSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable lcool", function() {
		expect( countSyllableFunction( "alcool", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable coòf", function() {
		expect( countSyllableFunction( "arcoòforo", italianSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeuioìùèéàò]y[aeuioíìùèàó]", function() {
		expect( countSyllableFunction( "ayatollah", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "bayerìte", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "ayurvèda", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "fadayin", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "nuovayorkése", italianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "donnayìte", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "cayùga", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "payèna", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "hinayàna", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "freyalìte", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "beyerìte", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "peyotìna", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "neyíte", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "cleyèra", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "cayleyàno", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "tuyau", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "zabuyelìte", italianSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "guyot", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "masuyìte", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "bruyère", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "peguyàno", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "kuffiya", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "keffiyeh", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "piyùma", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "kaffiyèh", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "chutiyà", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "flamboyant", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "foyer", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "chetoyobirìna", italianSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "moyìte", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "royèna", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "coyóte", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "avokàya", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "làyia", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "abéyas", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "amberlèya", italianSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "elgèyo", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "dìya", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "wìyot", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "fitzròya", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "mòyo", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "pùya", italianSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "kikùyu", italianSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "cucùyo", italianSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ìa$", function() {
		expect( countSyllableFunction( "abadìa", italianSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable èa$", function() {
		expect( countSyllableFunction( "ampelidèa", italianSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable aoi", function() {
		expect( countSyllableFunction( "demaoìzzazióne", italianSyllables ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words containing the add syllable aoì", function() {
		expect( countSyllableFunction( "maoista", italianSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioe", function() {
		expect( countSyllableFunction( "medioevo", italianSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable riae", function() {
		expect( countSyllableFunction( "riaeràto", italianSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ïa$", function() {
		expect( countSyllableFunction( "chaouïa", italianSyllables ) ).toBe( 3 );
	} );
} );
