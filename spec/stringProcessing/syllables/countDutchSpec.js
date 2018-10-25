import countSyllableFunction from "../../../src/stringProcessing/syllables/count.js";
import { forEach } from "lodash-es";

/**
 * Helper to tests syllable count.
 *
 * @param {array}  testCases List of cases to test.
 * @param {string} locale    Locale to use.
 *
 * @returns {void}
 */
function testCountSyllables( testCases, locale ) {
	forEach( testCases, function( expected, input ) {
		const actual = countSyllableFunction( input, locale );

		expect( actual ).toBe( expected );
	} );
}

describe( "a syllable counter for Dutch text strings", function() {
	it( "returns the number of syllables of words containing the subtract syllable ue$", function() {
		expect( countSyllableFunction( "cue", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable dge+$", function() {
		expect( countSyllableFunction( "bridge", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [tcp]iënt", function() {
		expect( countSyllableFunction( "patiënt", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "recipiënt", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "efficiënt", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ace$", function() {
		expect( countSyllableFunction( "interface", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [br]each", function() {
		expect( countSyllableFunction( "beachboy", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "reachtruck", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [ainpr]tiaal", function() {
		expect( countSyllableFunction( "spatiaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "initiaal", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "potentiaal", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "nuptiaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "martiaal", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [io]tiaan$", function() {
		expect( countSyllableFunction( "Mauritiaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "Laotiaan", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable gua[yc]", function() {
		expect( countSyllableFunction( "Paraguayaan", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "guacamole", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^i]deal", function() {
		expect( countSyllableFunction( "autodealer", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tive$", function() {
		expect( countSyllableFunction( "detective", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable load", function() {
		expect( countSyllableFunction( "download", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^e]coke", function() {
		expect( countSyllableFunction( "parelcokes", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^s]core$", function() {
		expect( countSyllableFunction( "hardcore", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable aä", function() {
		expect( countSyllableFunction( "Kanaäniet", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aeu", function() {
		expect( countSyllableFunction( "linnaeusklokje", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable aie", function() {
		expect( countSyllableFunction( "aaien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ao", function() {
		expect( countSyllableFunction( "aorta", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ë", function() {
		expect( countSyllableFunction( "Indiër", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eo", function() {
		expect( countSyllableFunction( "deodorant", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eú", function() {
		expect( countSyllableFunction( "seúfeest", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ieau", function() {
		expect( countSyllableFunction( "politieauto", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ea$", function() {
		expect( countSyllableFunction( "alinea", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ea[^u]", function() {
		expect( countSyllableFunction( "Koreaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "bureau", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ei[ej]", function() {
		expect( countSyllableFunction( "bemoeien", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "geijkt", "nl_NL" ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words containing the add syllable eu[iu]", function() {
		expect( countSyllableFunction( "geuit", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "geboorteuur", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ï", function() {
		expect( countSyllableFunction( "atheïst", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable iei", function() {
		expect( countSyllableFunction( "persieing", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ienne", function() {
		expect( countSyllableFunction( "julienne", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]ieu[^w]", function() {
		expect( countSyllableFunction( "copieus", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "milieubeheer", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "nieuw", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]ieu$", function() {
		expect( countSyllableFunction( "camaieu", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "milieu", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable i[auiy]", function() {
		expect( countSyllableFunction( "Keniaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "atrium", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "eiig", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "riyal", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable stion", function() {
		expect( countSyllableFunction( "bastion", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^cstx]io", function() {
		expect( countSyllableFunction( "zionisme", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "aficionado", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "pensioen", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "station", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "annexionisme", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^sion", function() {
		expect( countSyllableFunction( "Sion", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "fusion", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable riè", function() {
		expect( countSyllableFunction( "carrière", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable oö", function() {
		expect( countSyllableFunction( "coördinatie", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable oa", function() {
		expect( countSyllableFunction( "arboarts", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeing", function() {
		expect( countSyllableFunction( "boeing", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable oie", function() {
		expect( countSyllableFunction( "dooien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [eu]ü", function() {
		expect( countSyllableFunction( "reünie", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "vacuüm", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^q]u[aeèo]", function() {
		expect( countSyllableFunction( "duaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "actueel", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "suède", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "duo", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "qua", "nl_NL" ) ).toBe( 1 );
		expect( countSyllableFunction( "bouquet", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "quorn", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable uie", function() {
		expect( countSyllableFunction( "buien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bhnpr]ieel", function() {
		expect( countSyllableFunction( "microbieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "parochieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "ceremonieel", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "principieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "prieel", "nl_NL" ) ).toBe( 2 );
	} );


	it( "returns the number of syllables of words containing the add syllable [bhnpr]iël", function() {
		expect( countSyllableFunction( "microbiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "parochiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "ceremoniële", "nl_NL" ) ).toBe( 6 );
		expect( countSyllableFunction( "principiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "notariële", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeolu]y[aeéèoóu]", function() {
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

	it( "returns the number of syllables for a sentence with exclusions", function() {
		var testCases = {
			keynoter: 3,
			keynote: 2,
			keynotes: 2,
			kite: 1,
			kiter: 2,
			breakdance: 2,
			breakdancer: 3,
			race: 1,
			racer: 2,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function() {
		expect( countSyllableFunction( "bye hallo verjaardagscake superbarbecuetang hightea computerupgrades invoice", "nl_NL" ) ).toBe( 22 );
	} );
	it( "returns the number of syllables for a sentence with diacritics words", function() {
		expect( countSyllableFunction( "hé café", "nl_NL" ) ).toBe( 3 );
	} );
	it( "returns the number of syllables for a sentence with add and substract syllables", function() {
		expect( countSyllableFunction( "face bastion", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function() {
		var testCases = {
			fleece: 1,
			fleecedeken: 3,
			image: 2,
			images: 3,
			imagecontract: 4,
			pluimage: 3,
			style: 1,
			styleboek: 2,
			stylen: 2,
			douche: 1,
			douches: 2,
			office: 2,
			officer: 3,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function() {
		var testCases = {
			bye: 1,
			dei: 2,
			lone: 1,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with one-syllable words", function() {
		expect( countSyllableFunction( "dit is een huis", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for two sentences containing one- and multiple-syllable words", function() {
		var testCases = {
			dit: 1,
			zijn: 1,
			twee: 1,
			zinnen: 2,
			die: 1,
			ook: 1,
			langere: 3,
			woorden: 2,
			bevatten: 3,
			eens: 1,
			kijken: 2,
			of: 1,
			dat: 1,
			werkt: 1,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables of words containing diacritics", function() {
		expect( countSyllableFunction( "café, ayó", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words from the exclusion word list", function() {
		expect( countSyllableFunction( "airline, fauteuil, lyceum, vibe", "nl_NL" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words containing words from the exclusion word list at the beginning", function() {
		expect( countSyllableFunction( "airlineticket, fauteuilleer, muzieklyceum, zomervibe", "nl_NL" ) ).toBe( 15 );
	} );

	it( "returns the number of syllables of words containing words from the exclusion word list at the end", function() {
		expect( countSyllableFunction( "budgetairline, clubfauteuil, lyceumleerling, vibeje", "nl_NL" ) ).toBe( 14 );
	} );

	it( "returns the number of syllables of words affected by the substractSyllables regex and containing diacritics", function() {
		expect( countSyllableFunction( "patiënt, recipiënt, deficiënt", "nl_NL" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "voetbalteam, soap, teaktafel", "nl_NL" ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "teaktafel", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "voetbalteam", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of a word that should not be affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "gemeenteambtenaar, ", "nl_NL" ) ).toBe( 6 );
	} );
} );
