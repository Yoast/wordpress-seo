var countSyllableFunction = require( "../../../js/stringProcessing/syllables/count.js" );
var forEach = require( "lodash/forEach" );

function testCountSyllables( testCases, locale ) {
	forEach( testCases, function( expected, input ) {
		var actual = countSyllableFunction( input, locale );

		expect( actual ).toBe( expected );
	});
}

describe( "a syllable counter for textstrings", function () {
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
} );

describe( "a syllable counter for Dutch textstrings", function () {


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
