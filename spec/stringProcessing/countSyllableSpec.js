var countSyllableFunction = require( "../../js/stringProcessing/countSyllables.js" );

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

	it( "returns the number of syllables of words containing addSyllables", function () {
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

		// [aeiouy][^aeiuoyts]{1,}e$ --> but why t and s? State? phase????????????????????
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
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [aeiouy][^aeiouydt]e[sd]?$
		expect( countSyllableFunction( "" ) ).toBe(  );

		// ^[dr]e[aeiou][^aeiou]+$
		expect( countSyllableFunction( "" ) ).toBe(  );

		// [aeouy]rse$
		expect( countSyllableFunction( "hearse" ) ).toBe( 1 );
		expect( countSyllableFunction( "universe" ) ).toBe( 3 );
		expect( countSyllableFunction( "horse" ) ).toBe( 1 );
		expect( countSyllableFunction( "purse" ) ).toBe( 1 );
		expect( countSyllableFunction( "thyrse" ) ).toBe( 1 );

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
} );

describe( "a syllable counter for Dutch text strings", function () {


	it( "returns the number of syllables of words affected by the substractSyllables regex", function () {
		expect( countSyllableFunction( "cue, bridge, beachclub", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		expect( countSyllableFunction( "keynoter keynote keynotes kite kiter breakdance breakdancer race racer", "nl_NL" ) ).toBe( 18 );
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
		expect( countSyllableFunction( "fleece fleecedeken image images imagecontract pluimage style styleboek stylen douche douches office officer", "nl_NL" ) ).toBe( 29 );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		expect( countSyllableFunction( "bye dei lone", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for a sentence with one-syllable words", function () {
		expect( countSyllableFunction( "dit is een huis", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for two sentences containing one- and multiple-syllable words", function () {
		expect( countSyllableFunction( "Dit zijn twee zinnen met die ook langere woorden bevatten. Eens kijken of dat ook werkt.", "nl_NL" ) ).toBe( 23 );
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
