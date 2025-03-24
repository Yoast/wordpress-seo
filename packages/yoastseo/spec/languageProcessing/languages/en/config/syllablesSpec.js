import countSyllableFunction from "../../../../../src/languageProcessing/helpers/syllables/countSyllables.js";
import englishSyllables from "../../../../../src/languageProcessing/languages/en/config/syllables.json";

describe( "a syllable counter for English text strings", function() {
	it( "returns the number of syllables of words containing the subtract syllable cial", function() {
		expect( countSyllableFunction( "special", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tia", function() {
		expect( countSyllableFunction( "potential", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable cius", function() {
		expect( countSyllableFunction( "Lucius", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable gui", function() {
		expect( countSyllableFunction( "linguist", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ion", function() {
		expect( countSyllableFunction( "region", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^bdnprv]iou", function() {
		expect( countSyllableFunction( "delicious", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "dubious", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "odious", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "parsimonious", englishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "pious", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "spurious", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "obvious", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable sia$", function() {
		expect( countSyllableFunction( "Malaysia", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^aeiuot]{2,}ed$", function() {
		expect( countSyllableFunction( "pyjamaed", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "greed", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "applied", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "argued", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "tangoed", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "skirted", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "inched", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "coughed", englishSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][^aeiuoyts]{1,}e$", function() {
		expect( countSyllableFunction( "snake", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "scene", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "file", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "home", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "nuke", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "style", englishSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [a-z]ely$", function() {
		expect( countSyllableFunction( "definitely", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [cgy]ed$", function() {
		expect( countSyllableFunction( "aced", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "caged", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "enjoyed", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable rved$", function() {
		expect( countSyllableFunction( "carved", englishSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][dt]es?$", function() {
		expect( countSyllableFunction( "states", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "state", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "athletes", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "althlete", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "bites", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "bite", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "notes", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "note", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "minutes", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "minute", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "bytes", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "byte", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "grades", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "grade", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "Swede", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "Swedes", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "guides", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "guide", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "episodes", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "episode", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "dudes", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "dude", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "formaldehydes", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "formaldehyde", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable eau", function() {
		// Compensates for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "beautiful", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ieu", function() {
		// Compensates for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "lieutenant", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oeu", function() {
		// Compensate for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "manoeuvre", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][^aeiouydt]e[sd]?$", function() {
		expect( countSyllableFunction( "caves", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "caved", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "cave", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "believes", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "believed", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "believe", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "lines", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "lined", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "line", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "bores", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "bored", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "bore", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "rebukes", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "rebuked", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "rebuke", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "hypes", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "hyped", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "hype", englishSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeouy]rse$", function() {
		expect( countSyllableFunction( "hearse", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "universe", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "horse", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "purse", englishSyllables ) ).toBe( 1 );
		expect( countSyllableFunction( "thyrse", englishSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^eye", function() {
		expect( countSyllableFunction( "eye", englishSyllables ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable ia", function() {
		expect( countSyllableFunction( "liar", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable iu", function() {
		expect( countSyllableFunction( "delirium", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable io", function() {
		expect( countSyllableFunction( "interior", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ii", function() {
		expect( countSyllableFunction( "Hawaii", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeio][aeiou]{2}", function() {
		// In subtract syllables -1 for eau, ieu and oeu.
		expect( countSyllableFunction( "Saeed", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "Hawaii", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "Galilaei", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "spiraea", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "archaeology", englishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "athenaeum", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "Gaia", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "aioli", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "Gaius", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "Curaçaoan", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "logaoedic", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "Maoist", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "lauan", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "sauerkraut", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "maui", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "tauon", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "araceae", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "agreeable", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "sightseeing", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "onomatopoeia", englishSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "pompeii", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "meiosis", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "paleoanthropology", englishSyllables ) ).toBe( 8 );
		expect( countSyllableFunction( "rodeoed", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "nucleoid", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "neoorthodoxy", englishSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "gorgeous", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "striae", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "liaison", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "semiautomatic", englishSyllables ) ).toBe( 6 );
		expect( countSyllableFunction( "boogieing", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "radioactive", englishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "bioethics", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "opioid", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "bioorganic", englishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "glorious", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "hypoaesthesia", englishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "autoaim", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "coauthor", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "apnoea", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "boeing", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "homoeostasis", englishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "paranoia", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "wooable", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "gooey", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "wooing", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "homoousian", englishSyllables ) ).toBe( 5 );
		expect( countSyllableFunction( "zouave", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "pirouetting", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "louisiana", englishSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiou]ing", function() {
		expect( countSyllableFunction( "subpoenaing", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "being", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "skiing", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "doing", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "continuing", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^aeiou]ying", function() {
		expect( countSyllableFunction( "flying", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ui[aeou]", function() {
		expect( countSyllableFunction( "colloquial", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "quiet", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "sesquioxide", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "colloquium", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^ree[jmnpqrsx]", function() {
		expect( countSyllableFunction( "reeject", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "reemit", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "reenact", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "reepithelialization", englishSyllables ) ).toBe( 9 );
		expect( countSyllableFunction( "reequipe", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "reerect", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "reescalate", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "reexamine", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^reele", function() {
		expect( countSyllableFunction( "reelect", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^reeva", function() {
		expect( countSyllableFunction( "reevaluate", englishSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable riet", function() {
		expect( countSyllableFunction( "variety", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable dien", function() {
		expect( countSyllableFunction( "audience", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiouym][bdp]le$", function() {
		expect( countSyllableFunction( "able", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "cradle", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "staple", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "feeble", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "needle", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "steeple", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "mandible", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "idle", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "multiple", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "noble", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "poodle", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "people", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "double", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "caudle", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "couple", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "ensemble", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "simple", englishSyllables ) ).toBe( 2 );
	} );


	it( "returns the number of syllables of words containing the add syllable uei", function() {
		expect( countSyllableFunction( "blueish", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable uou", function() {
		expect( countSyllableFunction( "ambiguous", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^mc", function() {
		expect( countSyllableFunction( "McKenzie", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ism$", function() {
		expect( countSyllableFunction( "socialism", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]lien", function() {
		expect( countSyllableFunction( "alien", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^coa[dglx]", function() {
		expect( countSyllableFunction( "coadjutor", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "coagulate", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "coalescent", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "coaxial", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^gqauieo]ua[^auieo]", function() {
		expect( countSyllableFunction( "dual", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable dn't$", function() {
		expect( countSyllableFunction( "hadn't", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable uity$", function() {
		expect( countSyllableFunction( "ambiguity", englishSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ie(r|st)", function() {
		expect( countSyllableFunction( "carrier", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "happiest", englishSyllables ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiouw]y[aeiou]", function() {
		expect( countSyllableFunction( "papaya", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "abeyance", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "teriyaki", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "loyal", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "guyana", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "wyandot", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "prayer", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "foyer", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "buyer", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "saying", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "obeying", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "tiyin", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "boyish", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "buying", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "layout", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "beyond", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "coyotes", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "buyout", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "wyoming", englishSyllables ) ).toBe( 3 );
		expect( countSyllableFunction( "ayurvedic", englishSyllables ) ).toBe( 4 );
		expect( countSyllableFunction( "oyu", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^ao]ire[ds]", function() {
		expect( countSyllableFunction( "tires", englishSyllables ) ).toBe( 2 );
		expect( countSyllableFunction( "tired", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^ao]ire$", function() {
		expect( countSyllableFunction( "tire", englishSyllables ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable eoa", function() {
		expect( countSyllableFunction( "paleoanthropology", englishSyllables ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words containing the add syllable eoo", function() {
		expect( countSyllableFunction( "neoorthodoxy", englishSyllables ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioa", function() {
		expect( countSyllableFunction( "radioactive", englishSyllables ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioe", function() {
		expect( countSyllableFunction( "bioethics", englishSyllables ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioo", function() {
		expect( countSyllableFunction( "bioorganic", englishSyllables ) ).toBe( 5 );
	} );
} );
