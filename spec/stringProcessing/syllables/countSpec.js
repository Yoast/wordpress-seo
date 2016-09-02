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

	it( "returns the number of syllables of words containing subtractSyllables", function () {
		// cial
		expect( countSyllableFunction( "special" ) ).toBe( 2 );

		// tia
		expect( countSyllableFunction( "potential" ) ).toBe( 3 );

		// cius
		expect( countSyllableFunction( "Lucius" ) ).toBe( 2 );

		// giu
		expect( countSyllableFunction( "linguist" ) ).toBe( 2 );

		// ion
		expect( countSyllableFunction( "region" ) ).toBe( 2 );

		// iou
		expect( countSyllableFunction( "delicious" ) ).toBe( 3 );

		// sia$
		expect( countSyllableFunction( "Malaysia" ) ).toBe( 3 );

		// [^aeiuot]{2,}ed$
		expect( countSyllableFunction( "pyjamaed" ) ).toBe( 3 );
		expect( countSyllableFunction( "greed" ) ).toBe( 1 );
		expect( countSyllableFunction( "applied" ) ).toBe( 2 );
		expect( countSyllableFunction( "argued" ) ).toBe( 2 );
		expect( countSyllableFunction( "tangoed" ) ).toBe( 2 );
		expect( countSyllableFunction( "skirted" ) ).toBe( 2 );
		expect( countSyllableFunction( "inched" ) ).toBe( 1 );
		expect( countSyllableFunction( "coughed" ) ).toBe( 1 );

		// [aeiouy][^aeiuoyts]{1,}e$ --> but why t and s? State? Phase?
		expect( countSyllableFunction( "snake" ) ).toBe( 1 );
		expect( countSyllableFunction( "scene" ) ).toBe( 1 );
		expect( countSyllableFunction( "file" ) ).toBe( 1 );
		expect( countSyllableFunction( "home" ) ).toBe( 1 );
		expect( countSyllableFunction( "nuke" ) ).toBe( 1 );
		expect( countSyllableFunction( "style" ) ).toBe( 1 );

		// [a-z]ely$
		expect( countSyllableFunction( "definitely" ) ).toBe( 4 );

		// [cgy]ed$
		expect( countSyllableFunction( "aced" ) ).toBe( 1 );
		expect( countSyllableFunction( "caged" ) ).toBe( 1 );
		expect( countSyllableFunction( "enjoyed" ) ).toBe( 2 );

		// rved$
		expect( countSyllableFunction( "carved" ) ).toBe( 1 );

		// [aeiouy][dt]es?$
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

		// [aeiouy][^aeiouydt]e[sd]?$ --> overlaps quite a bit with [aeiouy][^aeiuoyts]{1,}e$ because of ? after [sd].
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

		// ^[dr]e[aeiou][^aeiou]+$
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [aeouy]rse$
		expect( countSyllableFunction( "hearse" ) ).toBe( 1 );
		expect( countSyllableFunction( "universe" ) ).toBe( 3 );
		expect( countSyllableFunction( "horse" ) ).toBe( 1 );
		expect( countSyllableFunction( "purse" ) ).toBe( 1 );
		expect( countSyllableFunction( "thyrse" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing addSyllables", function () {
		// ia
		expect( countSyllableFunction( "liar" ) ).toBe( 2 );

		// riet
		expect( countSyllableFunction( "variety" ) ).toBe( 4 );

		// dien
		expect( countSyllableFunction( "audience" ) ).toBe( 3 );

		// iu
		expect( countSyllableFunction( "delirium" ) ).toBe( 4 );

		// io
		expect( countSyllableFunction( "interior" ) ).toBe( 4 );

		// ii
		expect( countSyllableFunction( "Hawaii" ) ).toBe( 3 );

		// [aeiouym][bdp]le$  <--------------------------------------------------------
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [aeiou]{3}
		expect( countSyllableFunction( "Saeed" ) ).toBe( 2 );
		expect( countSyllableFunction( "Hawaii" ) ).toBe( 3 );
		expect( countSyllableFunction( "Galilaei" ) ).toBe( 4 );
		expect( countSyllableFunction( "spiraea" ) ).toBe( 3 );
		expect( countSyllableFunction( "archaeology" ) ).toBe( 5 );
		expect( countSyllableFunction( "athenaeum" ) ).toBe( 4 );
		expect( countSyllableFunction( "Gaia" ) ).toBe( 2 );
		expect( countSyllableFunction( "aioli" ) ).toBe( 3 );
		expect( countSyllableFunction( "Gaius" ) ).toBe( 2 );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );
		expect( countSyllableFunction( "" ) ).toBe(  );

		// ^mc Only Scottish surnames?
		expect( countSyllableFunction( "McKenzie" ) ).toBe( 3 );

		// ism$
		expect( countSyllableFunction( "socialism" ) ).toBe( 4 );

		// ([^aeiouy])\1l$
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [^l]lien
		expect( countSyllableFunction( "" ) ).toBe(  );

		// ^coa[dglx].
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [^gq]ua[^auieo]
		expect( countSyllableFunction( "" ) ).toBe(  );

		// dnt$
		expect( countSyllableFunction( "" ) ).toBe(  );

		// uity$
		expect( countSyllableFunction( "" ) ).toBe(  );

		// ie(r|st)
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [aeiouy]ing
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [aeiouw]y[aeiou]
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [^ao]ire[ds]
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [^ao]ire$
		expect( countSyllableFunction( "" ) ).toBe(  );

	} );
} );

describe( "a syllable counter for Dutch text strings", function () {


	it( "returns the number of syllables of words affected by the substractSyllables regex", function () {
		expect( countSyllableFunction( "cue, bridge, beachclub", "nl_NL" ) ).toBe( 4 );
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
			"met": 1,
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

	it( "returns the number of syllables of words affected by the addSyllables regex", function () {
		expect( countSyllableFunction( "Koreaan, bureau, geijl, camaieu, atrium", "nl_NL" ) ).toBe( 13 );
	} );

	it( "returns the number of syllables of more words affected by the addSyllables regex", function () {
		expect( countSyllableFunction( "zionisme, aficionado, Sion, fusion, atrium, duo, player, microbieel", "nl_NL" ) ).toBe( 24 );
	} );

	it( "returns the number of syllables of words affected by the addSyllables regex and containing diacritics", function () {
		expect( countSyllableFunction( "reünie, suède, microbiële", "nl_NL" ) ).toBe( 11 );
	} );

	it( "returns the number of syllables of words affected by the substractSyllables regex:cue", function () {
		expect( countSyllableFunction( "cue", "nl_NL" ) ).toBe( 1 );
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

	it( "returns the number of syllables of words containing addSyllables", function () {
		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

	} );

	it( "returns the number of syllables of words containing subtractSyllables", function () {
		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

		//
		expect( countSyllableFunction( "" ) ).toBe(  );

	} );

	it( "works for german", function() {
		expect( countSyllableFunction( "jupe", "de_DE" ) ).toBe( 1 );
	});

} );

describe( "counting syllables", function () {
	it( "returns the number of syllables in an exclusion word", function () {
		expect( countSyllableFunction( "shoreline" ) ).toBe( 2 );
		expect( countSyllableFunction( "business" ) ).toBe( 2 );
	} );
	it( "returns the number of syllables in normal word", function () {
		expect( countSyllableFunction( "strawberry" ) ).toBe( 3 );
	} )
} );
