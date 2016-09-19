var countSyllableFunction = require( "../../../js/stringProcessing/syllables/count.js" );
var forEach = require( "lodash/forEach" );

function testCountSyllables( testCases, locale ) {
	forEach( testCases, function( expected, input ) {
		var actual = countSyllableFunction( input, locale );

		expect( actual ).toBe( expected );
	});
}

describe( "a syllable counter for English text strings", function () {
	it( "returns the number of syllables", function () {
		expect( countSyllableFunction( "this is a text string" ) ).toBe( 5 );

		expect( countSyllableFunction( "human beings" ) ).toBe( 4 );

		expect( countSyllableFunction( "along the shoreline" ) ).toBe( 5 );

		expect( countSyllableFunction( "A piece of text to calculate scores" ) ).toBe( 9 );

		expect( countSyllableFunction( "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite" ) ).toBe( 63 );

		expect( countSyllableFunction( "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble." ) ).toBe( 65 );

		expect( countSyllableFunction( "Bridger Pass is a mountain pass in Carbon County, Wyoming on the Continental Divide near the south Great Divide Basin bifurcation point, i.e., the point at which the divide appears to split and envelop the basin." ) ).toBe( 57 );

		expect( countSyllableFunction( "A test based on exclusion words for syllable count" ) ).toBe( 13 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable cial", function () {

		expect( countSyllableFunction( "special" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tia", function () {
		expect( countSyllableFunction( "potential" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable cius", function () {
		expect( countSyllableFunction( "Lucius" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable gui", function () {
		expect( countSyllableFunction( "linguist" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ion", function () {
		expect( countSyllableFunction( "region" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^bdnprv]iou", function () {
		expect( countSyllableFunction( "delicious" ) ).toBe( 3 );
		expect( countSyllableFunction( "dubious" ) ).toBe( 3 );
		expect( countSyllableFunction( "odious" ) ).toBe( 3 );
		expect( countSyllableFunction( "parsimonious" ) ).toBe( 5 );
		expect( countSyllableFunction( "pious" ) ).toBe( 2 );
		expect( countSyllableFunction( "spurious" ) ).toBe( 3 );
		expect( countSyllableFunction( "obvious" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable sia$", function () {
		expect( countSyllableFunction( "Malaysia" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^aeiuot]{2,}ed$", function () {
		expect( countSyllableFunction( "pyjamaed" ) ).toBe( 3 );
		expect( countSyllableFunction( "greed" ) ).toBe( 1 );
		expect( countSyllableFunction( "applied" ) ).toBe( 2 );
		expect( countSyllableFunction( "argued" ) ).toBe( 2 );
		expect( countSyllableFunction( "tangoed" ) ).toBe( 2 );
		expect( countSyllableFunction( "skirted" ) ).toBe( 2 );
		expect( countSyllableFunction( "inched" ) ).toBe( 1 );
		expect( countSyllableFunction( "coughed" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][^aeiuoyts]{1,}e$", function () {
		expect( countSyllableFunction( "snake" ) ).toBe( 1 );
		expect( countSyllableFunction( "scene" ) ).toBe( 1 );
		expect( countSyllableFunction( "file" ) ).toBe( 1 );
		expect( countSyllableFunction( "home" ) ).toBe( 1 );
		expect( countSyllableFunction( "nuke" ) ).toBe( 1 );
		expect( countSyllableFunction( "style" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [a-z]ely$", function () {
		expect( countSyllableFunction( "definitely" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [cgy]ed$", function () {
		expect( countSyllableFunction( "aced" ) ).toBe( 1 );
		expect( countSyllableFunction( "caged" ) ).toBe( 1 );
		expect( countSyllableFunction( "enjoyed" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable rved$", function () {
		expect( countSyllableFunction( "carved" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][dt]es?$", function () {
		expect( countSyllableFunction( "states" ) ).toBe( 1 );
		expect( countSyllableFunction( "state" ) ).toBe( 1 );
		expect( countSyllableFunction( "athletes" ) ).toBe( 2 );
		expect( countSyllableFunction( "althlete" ) ).toBe( 2 );
		expect( countSyllableFunction( "bites" ) ).toBe( 1 );
		expect( countSyllableFunction( "bite" ) ).toBe( 1 );
		expect( countSyllableFunction( "notes" ) ).toBe( 1 );
		expect( countSyllableFunction( "note" ) ).toBe( 1 );
		expect( countSyllableFunction( "minutes" ) ).toBe( 2 );
		expect( countSyllableFunction( "minute" ) ).toBe( 2 );
		expect( countSyllableFunction( "bytes" ) ).toBe( 1 );
		expect( countSyllableFunction( "byte" ) ).toBe( 1 );
		expect( countSyllableFunction( "grades" ) ).toBe( 1 );
		expect( countSyllableFunction( "grade" ) ).toBe( 1 );
		expect( countSyllableFunction( "Swede" ) ).toBe( 1 );
		expect( countSyllableFunction( "Swedes" ) ).toBe( 1 );
		expect( countSyllableFunction( "guides" ) ).toBe( 1 );
		expect( countSyllableFunction( "guide" ) ).toBe( 1 );
		expect( countSyllableFunction( "episodes" ) ).toBe( 3 );
		expect( countSyllableFunction( "episode" ) ).toBe( 3 );
		expect( countSyllableFunction( "dudes" ) ).toBe( 1 );
		expect( countSyllableFunction( "dude" ) ).toBe( 1 );
		expect( countSyllableFunction( "formaldehydes" ) ).toBe( 4 );
		expect( countSyllableFunction( "formaldehyde" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable eau", function () {
		// Compensates for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "beautiful" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ieu", function () {
		// Compensates for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "lieutenant" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oeu", function () {
		// Compensate for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "manoeuvre" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][^aeiouydt]e[sd]?$", function () {
		expect( countSyllableFunction( "caves" ) ).toBe( 1 );
		expect( countSyllableFunction( "caved" ) ).toBe( 1 );
		expect( countSyllableFunction( "cave" ) ).toBe( 1 );
		expect( countSyllableFunction( "believes" ) ).toBe( 2 );
		expect( countSyllableFunction( "believed" ) ).toBe( 2 );
		expect( countSyllableFunction( "believe" ) ).toBe( 2 );
		expect( countSyllableFunction( "lines" ) ).toBe( 1 );
		expect( countSyllableFunction( "lined" ) ).toBe( 1 );
		expect( countSyllableFunction( "line" ) ).toBe( 1 );
		expect( countSyllableFunction( "bores" ) ).toBe( 1 );
		expect( countSyllableFunction( "bored" ) ).toBe( 1 );
		expect( countSyllableFunction( "bore" ) ).toBe( 1 );
		expect( countSyllableFunction( "rebukes" ) ).toBe( 2 );
		expect( countSyllableFunction( "rebuked" ) ).toBe( 2 );
		expect( countSyllableFunction( "rebuke" ) ).toBe( 2 );
		expect( countSyllableFunction( "hypes" ) ).toBe( 1 );
		expect( countSyllableFunction( "hyped" ) ).toBe( 1 );
		expect( countSyllableFunction( "hype" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeouy]rse$", function () {
		expect( countSyllableFunction( "hearse" ) ).toBe( 1 );
		expect( countSyllableFunction( "universe" ) ).toBe( 3 );
		expect( countSyllableFunction( "horse" ) ).toBe( 1 );
		expect( countSyllableFunction( "purse" ) ).toBe( 1 );
		expect( countSyllableFunction( "thyrse" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^eye", function () {
		expect( countSyllableFunction( "eye" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable ia", function () {
		expect( countSyllableFunction( "liar" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable iu", function () {
		expect( countSyllableFunction( "delirium" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable io", function () {
		expect( countSyllableFunction( "interior" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ii", function () {
		expect( countSyllableFunction( "Hawaii" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeio][aeiou]{2}", function () {
		// In subtract syllables -1 for eau, ieu and oeu.
		expect( countSyllableFunction( "Saeed" ) ).toBe( 2 );
		expect( countSyllableFunction( "Hawaii" ) ).toBe( 3 );
		expect( countSyllableFunction( "Galilaei" ) ).toBe( 4 );
		expect( countSyllableFunction( "spiraea" ) ).toBe( 3 );
		expect( countSyllableFunction( "archaeology" ) ).toBe( 5 );
		expect( countSyllableFunction( "athenaeum" ) ).toBe( 4 );
		expect( countSyllableFunction( "Gaia" ) ).toBe( 2 );
		expect( countSyllableFunction( "aioli" ) ).toBe( 3 );
		expect( countSyllableFunction( "Gaius" ) ).toBe( 2 );
		expect( countSyllableFunction( "Curaçaoan" ) ).toBe( 4 );
		expect( countSyllableFunction( "logaoedic" ) ).toBe( 4 );
		expect( countSyllableFunction( "Maoist" ) ).toBe( 2 );
		expect( countSyllableFunction( "lauan" ) ).toBe( 2 );
		expect( countSyllableFunction( "sauerkraut" ) ).toBe( 3 );
		expect( countSyllableFunction( "maui" ) ).toBe( 2 );
		expect( countSyllableFunction( "tauon" ) ).toBe( 2 );
		expect( countSyllableFunction( "araceae" ) ).toBe( 4 );
		expect( countSyllableFunction( "agreeable" ) ).toBe( 4 );
		expect( countSyllableFunction( "sightseeing" ) ).toBe( 3 );
		expect( countSyllableFunction( "onomatopoeia" ) ).toBe( 6 );
		expect( countSyllableFunction( "pompeii" ) ).toBe( 3 );
		expect( countSyllableFunction( "meiosis" ) ).toBe( 3 );
		expect( countSyllableFunction( "paleoanthropology" ) ).toBe( 8 );
		expect( countSyllableFunction( "rodeoed" ) ).toBe( 3 );
		expect( countSyllableFunction( "nucleoid" ) ).toBe( 3 );
		expect( countSyllableFunction( "neoorthodoxy" ) ).toBe( 6 );
		expect( countSyllableFunction( "gorgeous" ) ).toBe( 3 );
		expect( countSyllableFunction( "striae" ) ).toBe( 2 );
		expect( countSyllableFunction( "liaison" ) ).toBe( 3 );
		expect( countSyllableFunction( "semiautomatic" ) ).toBe( 6 );
		expect( countSyllableFunction( "boogieing" ) ).toBe( 3 );
		expect( countSyllableFunction( "radioactive" ) ).toBe( 5 );
		expect( countSyllableFunction( "bioethics" ) ).toBe( 4 );
		expect( countSyllableFunction( "opioid" ) ).toBe( 3 );
		expect( countSyllableFunction( "bioorganic" ) ).toBe( 5 );
		expect( countSyllableFunction( "glorious" ) ).toBe( 3 );
		expect( countSyllableFunction( "hypoaesthesia" ) ).toBe( 5 );
		expect( countSyllableFunction( "autoaim" ) ).toBe( 3 );
		expect( countSyllableFunction( "coauthor" ) ).toBe( 3 );
		expect( countSyllableFunction( "apnoea" ) ).toBe( 3 );
		expect( countSyllableFunction( "boeing" ) ).toBe( 2 );
		expect( countSyllableFunction( "homoeostasis" ) ).toBe( 5 );
		expect( countSyllableFunction( "paranoia" ) ).toBe( 4 );
		expect( countSyllableFunction( "wooable" ) ).toBe( 3 );
		expect( countSyllableFunction( "gooey" ) ).toBe( 2 );
		expect( countSyllableFunction( "wooing" ) ).toBe( 2 );
		expect( countSyllableFunction( "homoousian" ) ).toBe( 5 );
		expect( countSyllableFunction( "zouave" ) ).toBe( 2 );
		expect( countSyllableFunction( "pirouetting" ) ).toBe( 4 );
		expect( countSyllableFunction( "louisiana" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiou]ing", function () {
		expect( countSyllableFunction( "subpoenaing" ) ).toBe( 4 );
		expect( countSyllableFunction( "being" ) ).toBe( 2 );
		expect( countSyllableFunction( "skiing" ) ).toBe( 2 );
		expect( countSyllableFunction( "doing" ) ).toBe( 2 );
		expect( countSyllableFunction( "continuing" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^aeiou]ying", function () {
		expect( countSyllableFunction( "flying" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ui[aeou]", function () {
		expect( countSyllableFunction( "colloquial" ) ).toBe( 4 );
		expect( countSyllableFunction( "quiet" ) ).toBe( 2 );
		expect( countSyllableFunction( "sesquioxide" ) ).toBe( 4 );
		expect( countSyllableFunction( "colloquium" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^ree[jmnpqrsx]", function () {
		expect( countSyllableFunction( "reeject" ) ).toBe( 3 );
		expect( countSyllableFunction( "reemit" ) ).toBe( 3 );
		expect( countSyllableFunction( "reenact" ) ).toBe( 3 );
		expect( countSyllableFunction( "reepithelialization" ) ).toBe( 9 );
		expect( countSyllableFunction( "reequipe" ) ).toBe( 3 );
		expect( countSyllableFunction( "reerect" ) ).toBe( 3 );
		expect( countSyllableFunction( "reescalate" ) ).toBe( 4 );
		expect( countSyllableFunction( "reexamine" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^reele", function () {
		expect( countSyllableFunction( "reelect" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^reeva", function () {
		expect( countSyllableFunction( "reevaluate" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable riet", function () {
		expect( countSyllableFunction( "variety" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable dien", function () {
		expect( countSyllableFunction( "audience" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiouym][bdp]le$", function () {
		expect( countSyllableFunction( "able" ) ).toBe( 2 );
		expect( countSyllableFunction( "cradle" ) ).toBe( 2 );
		expect( countSyllableFunction( "staple" ) ).toBe( 2 );
		expect( countSyllableFunction( "feeble" ) ).toBe( 2 );
		expect( countSyllableFunction( "needle" ) ).toBe( 2 );
		expect( countSyllableFunction( "steeple" ) ).toBe( 2 );
		expect( countSyllableFunction( "mandible" ) ).toBe( 3 );
		expect( countSyllableFunction( "idle" ) ).toBe( 2 );
		expect( countSyllableFunction( "multiple" ) ).toBe( 3 );
		expect( countSyllableFunction( "noble" ) ).toBe( 2 );
		expect( countSyllableFunction( "poodle" ) ).toBe( 2 );
		expect( countSyllableFunction( "people" ) ).toBe( 2 );
		expect( countSyllableFunction( "double" ) ).toBe( 2 );
		expect( countSyllableFunction( "caudle" ) ).toBe( 2 );
		expect( countSyllableFunction( "couple" ) ).toBe( 2 );
		expect( countSyllableFunction( "ensemble" ) ).toBe( 3 );
		expect( countSyllableFunction( "simple" ) ).toBe( 2 );
	} );


	it( "returns the number of syllables of words containing the add syllable uei", function () {
		expect( countSyllableFunction( "blueish" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable uou", function () {
		expect( countSyllableFunction( "ambiguous" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^mc", function () {
		expect( countSyllableFunction( "McKenzie" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ism$", function () {
		expect( countSyllableFunction( "socialism" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]lien", function () {
		expect( countSyllableFunction( "alien" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^coa[dglx]", function () {
		expect( countSyllableFunction( "coadjutor" ) ).toBe( 4 );
		expect( countSyllableFunction( "coagulate" ) ).toBe( 4 );
		expect( countSyllableFunction( "coalescent" ) ).toBe( 4 );
		expect( countSyllableFunction( "coaxial" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^gqauieo]ua[^auieo]", function () {
		expect( countSyllableFunction( "dual" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable dn't$", function () {
		expect( countSyllableFunction( "hadn't" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable uity$", function () {
		expect( countSyllableFunction( "ambiguity" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ie(r|st)", function () {
		expect( countSyllableFunction( "carrier" ) ).toBe( 3 );
		expect( countSyllableFunction( "happiest" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiouw]y[aeiou]", function () {
		expect( countSyllableFunction( "papaya" ) ).toBe( 3 );
		expect( countSyllableFunction( "abeyance" ) ).toBe( 3 );
		expect( countSyllableFunction( "teriyaki" ) ).toBe( 4 );
		expect( countSyllableFunction( "loyal" ) ).toBe( 2 );
		expect( countSyllableFunction( "guyana" ) ).toBe( 3 );
		expect( countSyllableFunction( "wyandot" ) ).toBe( 3 );
		expect( countSyllableFunction( "prayer" ) ).toBe( 2 );
		expect( countSyllableFunction( "foyer" ) ).toBe( 2 );
		expect( countSyllableFunction( "buyer" ) ).toBe( 2 );
		expect( countSyllableFunction( "saying" ) ).toBe( 2 );
		expect( countSyllableFunction( "obeying" ) ).toBe( 3 );
		expect( countSyllableFunction( "tiyin" ) ).toBe( 2 );
		expect( countSyllableFunction( "boyish" ) ).toBe( 2 );
		expect( countSyllableFunction( "buying" ) ).toBe( 2 );
		expect( countSyllableFunction( "layout" ) ).toBe( 2 );
		expect( countSyllableFunction( "beyond" ) ).toBe( 2 );
		expect( countSyllableFunction( "coyotes" ) ).toBe( 3 );
		expect( countSyllableFunction( "buyout" ) ).toBe( 2 );
		expect( countSyllableFunction( "wyoming" ) ).toBe( 3 );
		expect( countSyllableFunction( "ayurvedic" ) ).toBe( 4 );
		expect( countSyllableFunction( "oyu" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^ao]ire[ds]", function () {
		expect( countSyllableFunction( "tires" ) ).toBe( 2 );
		expect( countSyllableFunction( "tired" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^ao]ire$", function () {
		expect( countSyllableFunction( "tire" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable eoa", function () {
		expect( countSyllableFunction( "paleoanthropology" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words containing the add syllable eoo", function () {
		expect( countSyllableFunction( "neoorthodoxy" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioa", function () {
		expect( countSyllableFunction( "radioactive" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioe", function () {
		expect( countSyllableFunction( "bioethics" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioo", function () {
		expect( countSyllableFunction( "bioorganic" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables in an exclusion word", function () {
		expect( countSyllableFunction( "shoreline" ) ).toBe( 2 );
		expect( countSyllableFunction( "business" ) ).toBe( 2 );
	} );
} );

describe( "a syllable counter for Dutch text strings", function () {
	it( "returns the number of syllables of words containing the subtract syllable ue$", function () {
		expect( countSyllableFunction( "cue", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable dge+$", function () {
		expect( countSyllableFunction( "bridge", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [tcp]iënt", function () {
		expect( countSyllableFunction( "patiënt", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "recipiënt", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "efficiënt", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ace$", function () {
		expect( countSyllableFunction( "interface", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [br]each", function () {
		expect( countSyllableFunction( "beachboy", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "reachtruck", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [ainpr]tiaal", function () {
		expect( countSyllableFunction( "spatiaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "initiaal", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "potentiaal", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "nuptiaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "martiaal", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [io]tiaan$", function () {
		expect( countSyllableFunction( "Mauritiaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "Laotiaan", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable gua[yc]", function () {
		expect( countSyllableFunction( "Paraguayaan", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "guacamole", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^i]deal", function () {
		expect( countSyllableFunction( "autodealer", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tive$", function () {
		expect( countSyllableFunction( "detective", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable load", function () {
		expect( countSyllableFunction( "download", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^e]coke", function () {
		expect( countSyllableFunction( "parelcokes", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^s]core$", function () {
		expect( countSyllableFunction( "hardcore", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable aä", function () {
		expect( countSyllableFunction( "Kanaäniet", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aeu", function () {
		expect( countSyllableFunction( "linnaeusklokje", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable aie", function () {
		expect( countSyllableFunction( "aaien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ao", function () {
		expect( countSyllableFunction( "aorta", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ë", function () {
		expect( countSyllableFunction( "Indiër", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eo", function () {
		expect( countSyllableFunction( "deodorant", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eú", function () {
		expect( countSyllableFunction( "seúfeest", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ieau", function () {
		expect( countSyllableFunction( "politieauto", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ea$", function () {
		expect( countSyllableFunction( "alinea", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ea[^u]", function () {
		expect( countSyllableFunction( "Koreaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "bureau", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ei[ej]", function () {
		expect( countSyllableFunction( "bemoeien", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "geijkt", "nl_NL" ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words containing the add syllable eu[iu]", function () {
		expect( countSyllableFunction( "geuit", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "geboorteuur", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ï", function () {
		expect( countSyllableFunction( "atheïst", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable iei", function () {
		expect( countSyllableFunction( "persieing", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ienne", function () {
		expect( countSyllableFunction( "julienne", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]ieu[^w]", function () {
		expect( countSyllableFunction( "copieus", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "milieubeheer", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "nieuw", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]ieu$", function () {
		expect( countSyllableFunction( "camaieu", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "milieu", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable i[auiy]", function () {
		expect( countSyllableFunction( "Keniaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "atrium", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "eiig", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "riyal", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable stion", function () {
		expect( countSyllableFunction( "bastion", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^cstx]io", function () {
		expect( countSyllableFunction( "zionisme", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "aficionado", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "pensioen", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "station", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "annexionisme", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^sion", function () {
		expect( countSyllableFunction( "Sion", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "fusion", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable riè", function () {
		expect( countSyllableFunction( "carrière", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable oö", function () {
		expect( countSyllableFunction( "coördinatie", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable oa", function () {
		expect( countSyllableFunction( "arboarts", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeing", function () {
		expect( countSyllableFunction( "boeing", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable oie", function () {
		expect( countSyllableFunction( "dooien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [eu]ü", function () {
		expect( countSyllableFunction( "reünie", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "vacuüm", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^q]u[aeèo]", function () {
		expect( countSyllableFunction( "duaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "actueel", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "suède", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "duo", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "qua", "nl_NL" ) ).toBe( 1 );
		expect( countSyllableFunction( "bouquet", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "quorn", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable uie", function () {
		expect( countSyllableFunction( "buien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bhnpr]ieel", function () {
		expect( countSyllableFunction( "microbieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "parochieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "ceremonieel", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "principieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "prieel", "nl_NL" ) ).toBe( 2 );
	} );


	it( "returns the number of syllables of words containing the add syllable [bhnpr]iël", function () {
		expect( countSyllableFunction( "microbiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "parochiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "ceremoniële", "nl_NL" ) ).toBe( 6 );
		expect( countSyllableFunction( "principiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "notariële", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeolu]y[aeéèoóu]", function () {
		expect( countSyllableFunction( "papaya", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "cayenne", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "mayonaise", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "ayó", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "ayurveda", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "hockeyacademie", "nl_NL" ) ).toBe( 6 );
		expect( countSyllableFunction( "erlenmeyer", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "foeyonghai", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "reclameyup", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "chatoyant", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "foyer", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "employé", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "coyote", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "shoyu", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "polyacetyleen", "nl_NL" ) ).toBe( 6 );
		expect( countSyllableFunction( "flyer", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "lyofiel", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "polyurethaan", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "bruyant", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "appuyeren", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "gruyère", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "golauyoek", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		var testCases = {
			"keynoter": 3,
			"keynote": 2,
			"keynotes": 2,
			"kite": 1,
			"kiter": 2,
			"breakdance": 2,
			"breakdancer": 3,
			"race": 1,
			"racer": 2,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		expect( countSyllableFunction( "bye hallo verjaardagscake superbarbecuetang hightea computerupgrades invoice", "nl_NL" ) ).toBe( 22 );
	} );
	it( "returns the number of syllables for a sentence with diacritics words", function () {
		expect( countSyllableFunction( "hé café", "nl_NL" ) ).toBe( 3 );
	} );
	it( "returns the number of syllables for a sentence with add and substract syllables", function () {
		expect( countSyllableFunction( "face bastion", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		var testCases = {
			"fleece": 1,
			"fleecedeken": 3,
			"image": 2,
			"images": 3,
			"imagecontract": 4,
			"pluimage": 3,
			"style": 1,
			"styleboek": 2,
			"stylen": 2,
			"douche": 1,
			"douches": 2,
			"office": 2,
			"officer": 3,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		var testCases = {
			"bye": 1,
			"dei": 2,
			"lone": 1,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with one-syllable words", function () {
		expect( countSyllableFunction( "dit is een huis", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for two sentences containing one- and multiple-syllable words", function () {
		var testCases = {
			"dit": 1,
			"zijn": 1,
			"twee": 1,
			"zinnen": 2,
			"die": 1,
			"ook": 1,
			"langere": 3,
			"woorden": 2,
			"bevatten": 3,
			"eens": 1,
			"kijken": 2,
			"of": 1,
			"dat": 1,
			"werkt": 1,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables of words containing diacritics", function () {
		expect( countSyllableFunction( "café, ayó", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words from the exclusion word list", function () {
		expect( countSyllableFunction( "airline, fauteuil, lyceum, vibe", "nl_NL" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words containing words from the exclusion word list at the beginning", function () {
		expect( countSyllableFunction( "airlineticket, fauteuilleer, muzieklyceum, zomervibe", "nl_NL" ) ).toBe( 15 );
	} );

	it( "returns the number of syllables of words containing words from the exclusion word list at the end", function () {
		expect( countSyllableFunction( "budgetairline, clubfauteuil, lyceumleerling, vibeje", "nl_NL" ) ).toBe( 14 );
	} );

	it( "returns the number of syllables of words affected by the substractSyllables regex and containing diacritics", function () {
		expect( countSyllableFunction( "patiënt, recipiënt, deficiënt", "nl_NL" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function () {
		expect( countSyllableFunction( "voetbalteam, soap, teaktafel", "nl_NL" ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function () {
		expect( countSyllableFunction( "teaktafel", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function () {
		expect( countSyllableFunction( "voetbalteam", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of a word that should not be affected by the exclusionCompound regex", function () {
		expect( countSyllableFunction( "gemeenteambtenaar, ", "nl_NL" ) ).toBe( 6 );
	} );
} );

describe( "a syllable counter for German text strings", function () {
	it( "returns the number of syllables of words containing the subtract syllable ouil", function () {
		expect( countSyllableFunction( "bouillon", "de_DE" ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable deaux", function () {
		expect( countSyllableFunction( "bordeauxfarben", "de_DE" ) ).toBe( 4 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable deau$", function () {
		expect( countSyllableFunction( "bordeau", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oard", function () {
		expect( countSyllableFunction( "keyboard", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable äthiop", function () {
		expect( countSyllableFunction( "äthiopisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable euil", function () {
		expect( countSyllableFunction( "fauteuil", "de_DE" ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable veau", function () {
		expect( countSyllableFunction( "niveau", "de_DE" ) ).toBe( 2 );
	} );

	// Compensates for "e[äaoö]" in add syllables
	it( "returns the number of syllables of words containing the subtract syllable eau$", function () {
		expect( countSyllableFunction( "bandeau", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ueue", function () {
		expect( countSyllableFunction( "billardqueue", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable lienisch", function () {
		expect( countSyllableFunction( "italienisch", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ance$", function () {
		expect( countSyllableFunction( "ambiance", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ence$", function () {
		expect( countSyllableFunction( "absence", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable time$", function () {
		expect( countSyllableFunction( "halftime", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable once$", function () {
		expect( countSyllableFunction( "annonce", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ziat", function () {
		expect( countSyllableFunction( "benefiziat", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable guette", function () {
		expect( countSyllableFunction( "baguette", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ête$", function () {
		expect( countSyllableFunction( "tête", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ôte$", function () {
		expect( countSyllableFunction( "côte", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [hp]omme$", function () {
		expect( countSyllableFunction( "Gentilhomme", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "pomme", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [qdscn]ue$", function () {
		expect( countSyllableFunction( "cheque", "de_DE" ) ).toBe( 1 );
		expect( countSyllableFunction( "fondue", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "tissue", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "autocue", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "avenue", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable aire$", function () {
		expect( countSyllableFunction( "affaire", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ture$", function () {
		expect( countSyllableFunction( "couture", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable êpe$", function () {
		expect( countSyllableFunction( "crêpe", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^q]ui$", function () {
		expect( countSyllableFunction( "ennui", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "blanqui", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tiche$", function () {
		expect( countSyllableFunction( "pastiche", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable vice$", function () {
		expect( countSyllableFunction( "service", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oile$", function () {
		expect( countSyllableFunction( "voile", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable zial", function () {
		expect( countSyllableFunction( "asozial", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable cruis", function () {
		expect( countSyllableFunction( "cruisen", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable leas", function () {
		expect( countSyllableFunction( "geleast", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable coa[ct]", function () {
		expect( countSyllableFunction( "coach", "de_DE" ) ).toBe( 1 );
		expect( countSyllableFunction( "coating", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^i]deal", function () {
		expect( countSyllableFunction( "drogendealer", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [fw]eat", function () {
		expect( countSyllableFunction( "beefeater", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "sweater", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [lsx]ed$", function () {
		expect( countSyllableFunction( "overstyled", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "overdressed", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "mixed", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable aau", function () {
		expect( countSyllableFunction( "extraausgabe", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable a[äöüo]", function () {
		expect( countSyllableFunction( "klimaänderung", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "aöde", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "gammaübergang", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "aorta", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable äue", function () {
		expect( countSyllableFunction( "abgesäuert", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable äeu", function () {
		expect( countSyllableFunction( "mäeutisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aei", function () {
		expect( countSyllableFunction( "kameraeinstellung", "de_DE" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable aue", function () {
		expect( countSyllableFunction( "mauer", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable aeu", function () {
		expect( countSyllableFunction( "Gammaeule", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ael", function () {
		expect( countSyllableFunction( "ismael", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ai[aeo]", function () {
		expect( countSyllableFunction( "kaianlage", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "dubaier", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "gaio", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable saik", function () {
		expect( countSyllableFunction( "mosaik", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aismus", function () {
		expect( countSyllableFunction( "archaismus", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ä[aeoi]", function () {
		expect( countSyllableFunction( "mäandrisch", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "achäer", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "äolisch", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "achäisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable auä", function () {
		expect( countSyllableFunction( "stauänderung", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable éa", function () {
		expect( countSyllableFunction( "orléans", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable e[äaoö]", function () {
		expect( countSyllableFunction( "abgeäst", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "reaktor", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "abgeordnet", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "beölt", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ei[eo]", function () {
		expect( countSyllableFunction( "abfeiern", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "beiordnen", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ee[aeiou]", function () {
		expect( countSyllableFunction( "schneealge", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "kleeernte", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "abgeeist", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "seeoffizier", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "seeunfall", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eu[aäe]", function () {
		expect( countSyllableFunction( "neuanfang", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "efeuähnlich", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "abenteuer", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eum$", function () {
		expect( countSyllableFunction( "museum", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eü", function () {
		expect( countSyllableFunction( "geübt", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable o[aäöü]", function () {
		expect( countSyllableFunction( "fotoalbum", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "proärese", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "makroökonomie", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "saldoübertrag", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable poet", function () {
		expect( countSyllableFunction( "poetisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oo[eo]", function () {
		expect( countSyllableFunction( "zooerastie", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "zooorganisation", "de_DE" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable oie", function () {
		expect( countSyllableFunction( "hanoier", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oei[^l]", function () {
		expect( countSyllableFunction( "nettoeinkommen", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "oeil", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeu[^f]", function () {
		expect( countSyllableFunction( "indoeuropäer", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "boeuf", "de_DE" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable öa", function () {
		expect( countSyllableFunction( "euböa", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [fgrz]ieu", function () {
		expect( countSyllableFunction( "geografieunterricht", "de_DE" ) ).toBe( 7 );
		expect( countSyllableFunction( "energieumwandlung", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "exterieur", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "pharmazieunternehmen", "de_DE" ) ).toBe( 7 );
		expect( countSyllableFunction( "milieu", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable mieun", function () {
		expect( countSyllableFunction( "chemieunfall", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable tieur", function () {
		expect( countSyllableFunction( "garantieurkunde", "de_DE" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable ieum", function () {
		expect( countSyllableFunction( "knieumschwung", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable i[aiuü]", function () {
		expect( countSyllableFunction( "material", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "hawaii", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "abecedarium", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "freiübung", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]iä", function () {
		expect( countSyllableFunction( "diärese", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "familiär", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^s]chien", function () {
		expect( countSyllableFunction( "tschechien", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "schienend", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable io[bcdfhjkmpqtuvwx]", function () {
		expect( countSyllableFunction( "folioblatt", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "biochemie", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "diode", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "idiofon", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "soziohormon", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "radiojodtest", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "biblioklast", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "angiom", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "agiopapier", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "studioqualität", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "agiotierend", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "biniou", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "audiovision", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "iowa", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "dioxin", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bdhmprv]ion", function () {
		expect( countSyllableFunction( "symbiontisch", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "audion", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "chionograf", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "camion", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "ausspionert", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "chorion", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "alluvion", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [lr]ior", function () {
		expect( countSyllableFunction( "amelioriert", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "apriori", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^g]io[gs]", function () {
		expect( countSyllableFunction( "abiose", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "arteriogramm", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "angiogram", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "irreligiosität", "de_DE" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable [dr]ioz", function () {
		expect( countSyllableFunction( "propriozeptiv", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "radiozeit", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable elioz", function () {
		expect( countSyllableFunction( "heliozentrisch", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable zioni", function () {
		expect( countSyllableFunction( "antizionist", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable bio[lnorz]", function () {
		expect( countSyllableFunction( "biologie", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bionik", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "biooptik", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bioreaktor", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "biozid", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable iö[^s]", function () {
		expect( countSyllableFunction( "diözese", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "biliös", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ie[ei]", function () {
		expect( countSyllableFunction( "bespieen", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "beieinander", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable rier$", function () {
		expect( countSyllableFunction( "agrarier", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable öi[eg]", function () {
		expect( countSyllableFunction( "onomatopöie", "de_DE" ) ).toBe( 6 );
		expect( countSyllableFunction( "böig", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^r]öisch", function () {
		expect( countSyllableFunction( "euböisch", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "färöisch", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^gqv]u[aeéioöuü]", function () {
		expect( countSyllableFunction( "zuarbeiten", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "abbauen", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "habitué", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "abluiert", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "abbauort", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "affektuös", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "andauung", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "neuübergang", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bilinguisch", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "aalquappe", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "vuota", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable quie$", function () {
		expect( countSyllableFunction( "reliquie", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable quie[^s]", function () {
		expect( countSyllableFunction( "requiem", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "quieszieren", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable uäu", function () {
		expect( countSyllableFunction( "zuäußerst", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^us-", function () {
		expect( countSyllableFunction( "us-senat", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^it-", function () {
		expect( countSyllableFunction( "it-experte", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable üe", function () {
		expect( countSyllableFunction( "grüezi", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable naiv", function () {
		expect( countSyllableFunction( "naivität", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aisch$", function () {
		expect( countSyllableFunction( "fuldaisch", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable aische$", function () {
		expect( countSyllableFunction( "inkaische", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aische[nrs]$", function () {
		expect( countSyllableFunction( "inkaischen", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "inkaischer", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "inkaisches", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [lst]ien", function () {
		expect( countSyllableFunction( "familien", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "asien", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "aktien", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable dien$", function () {
		expect( countSyllableFunction( "indien", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable gois", function () {
		expect( countSyllableFunction( "egoist", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^g]rient", function () {
		expect( countSyllableFunction( "abiturient", "de_DE" ) ).toBe( 5 );
		expect( countSyllableFunction( "gegrient", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiou]y[aeiou]", function () {
		expect( countSyllableFunction( "ayatollah", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bayer", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "essayistin", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "bayonne", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "ayurveda", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "hochseeyacht", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "erlenmeyer", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "kaffeeyoghurt", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "riyal", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "flamboyant", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "foyer", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "employiert", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "caloyos", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "guyana", "de_DE" ) ).toBe( 3 );
		expect( countSyllableFunction( "ennuyieren", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "guyot", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable byi", function () {
		expect( countSyllableFunction( "hobbyist", "de_DE" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable yä", function () {
		expect( countSyllableFunction( "polyäthylen", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [a-z]y[ao]", function () {
		expect( countSyllableFunction( "polyacryl", "de_DE" ) ).toBe( 4 );
		expect( countSyllableFunction( "amphiktyonisch", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable yau", function () {
		expect( countSyllableFunction( "fantasyautor", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable koor", function () {
		expect( countSyllableFunction( "koordinate", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable scient", function () {
		expect( countSyllableFunction( "scientologin", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable eriel", function () {
		expect( countSyllableFunction( "bakteriell", "de_DE" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [dg]oing", function () {
		expect( countSyllableFunction( "doing", "de_DE" ) ).toBe( 2 );
		expect( countSyllableFunction( "going", "de_DE" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable eauü", function () {
		expect( countSyllableFunction( "niveauübergang", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioi", function () {
		expect( countSyllableFunction( "radioindikator", "de_DE" ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioo", function () {
		expect( countSyllableFunction( "varioobjektiv", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioa", function () {
		expect( countSyllableFunction( "radioaktiv", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable iii", function () {
		expect( countSyllableFunction( "hawaiiinsel", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable oai", function () {
		expect( countSyllableFunction( "samoainseln", "de_DE" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable eueu", function () {
		expect( countSyllableFunction( "treueurlaub", "de_DE" ) ).toBe( 4 );
	} );
} );
