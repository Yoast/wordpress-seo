import countSyllableFunction from '../../../src/stringProcessing/syllables/count.js';
import { forEach } from "lodash-es";

/**
 * Helper to test syllable count.
 *
 * @param {array}  testCases List of cases to test.
 * @param {string} locale    Locale to use.
 *
 * @returns {void}
 */
function testCountSyllables( testCases, locale ) {
	forEach( testCases, function( expected, input ) {
		let actual = countSyllableFunction( input, locale );

		expect( actual ).toBe( expected );
	} );
}

describe( "a syllable counter for French text strings", function() {
	it( "returns the number of syllables of words containing the subtract syllable [ptf]aon(ne)?s?$", function() {
		expect( countSyllableFunction( "taons", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "faon", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "paonne", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "paonnes", "fr_FR" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable aoul", function() {
		expect( countSyllableFunction( "saoul", "fr_FR" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^eéiou]e(s|nt)?$", function() {
		expect( countSyllableFunction( "chance", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "chances", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "dormirent", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^eéiou]e(s|nt)?$", function() {
		expect( countSyllableFunction( "chance", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "chances", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "dormirent", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [qg]ue(s|nt)?$", function() {
		expect( countSyllableFunction( "manque", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "masques", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "manquent", "fr_FR" ) ).toBe( 1 );
		expect( countSyllableFunction( "fatigue", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "analogues", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "fatiguent", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable a[eéèïüo]", function() {
		expect( countSyllableFunction( "maestro", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "aéroporte", "fr_FR" ) ).toBe( 4 );
		expect( countSyllableFunction( "aère", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "haïs", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "capharnaüm", "fr_FR" ) ).toBe( 4 );
		expect( countSyllableFunction( "extraordinaire", "fr_FR" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable é[aâéîiuo]", function() {
		expect( countSyllableFunction( "idéal", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "théâtre", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "agréés", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "obéir", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "réunit", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "vidéo", "fr_FR" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable o[ëaéèï]", function() {
		expect( countSyllableFunction( "noël", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "oasis", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "poétique", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "poème", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "coïncider", "fr_FR" ) ).toBe( 4 );
		expect( countSyllableFunction( "taoïsme", "fr_FR" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ii[oe]", function() {
		expect( countSyllableFunction( "oubliions", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "riiez", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ii[oe]", function() {
		expect( countSyllableFunction( "oubliions", "fr_FR" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ouaoua", function() {
		expect( countSyllableFunction( "ouaouaron", "fr_FR" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeéuo]y[aâeéèoui]", function() {
		expect( countSyllableFunction( "moyen", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "ennuyé", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "tuyau", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable coe", function() {
		expect( countSyllableFunction( "coexiste", "fr_FR" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable zoo", function() {
		expect( countSyllableFunction( "zoologique", "fr_FR" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable coop", function() {
		expect( countSyllableFunction( "coopérer", "fr_FR" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable coord", function() {
		expect( countSyllableFunction( "coordination", "fr_FR" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable poly[ae]", function() {
		expect( countSyllableFunction( "polyester", "fr_FR" ) ).toBe( 4 );
		expect( countSyllableFunction( "polyamide", "fr_FR" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bcd]ry[oa]", function() {
		expect( countSyllableFunction( "embryon", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "cryogénie", "fr_FR" ) ).toBe( 4 );
		expect( countSyllableFunction( "dryade", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bcdfgptv][rl](ou|u|i)[aéèouâ]", function() {
		expect( countSyllableFunction( "afflua", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "pliât", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "oublié", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "ouvrière", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "crions", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "obstrué", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "flouant", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ouez", function() {
		expect( countSyllableFunction( "louez", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [blmnt]uio", function() {
		expect( countSyllableFunction( "distribuions", "fr_FR" ) ).toBe( 4 );
		expect( countSyllableFunction( "excluions", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "continuions", "fr_FR" ) ).toBe( 4 );
		expect( countSyllableFunction( "remuions", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "tuions", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable uoia", function() {
		expect( countSyllableFunction( "séquoia", "fr_FR" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ment$", function() {
		expect( countSyllableFunction( "heureusement", "fr_FR" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable yua", function() {
		expect( countSyllableFunction( "yuan", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bcdfgptv][rl](i|u|eu)e([ltz]|r[s]?$|n[^t])",
		function() {
			expect( countSyllableFunction( "bleuette", "fr_FR" ) ).toBe( 2 );
			expect( countSyllableFunction( "crier", "fr_FR" ) ).toBe( 2 );
			expect( countSyllableFunction( "obstruez", "fr_FR" ) ).toBe( 3 );
			expect( countSyllableFunction( "tabliers", "fr_FR" ) ).toBe( 3 );
			expect( countSyllableFunction( "cruelles", "fr_FR" ) ).toBe( 2 );
			expect( countSyllableFunction( "tabliers", "fr_FR" ) ).toBe( 3 );
			expect( countSyllableFunction( "fluence", "fr_FR" ) ).toBe( 2 );
		} );

	it( "returns the number of syllables of words containing the add syllable [^aeiuyàâéèêëîïûüùôæœqg]uie[rz]$", function() {
		expect( countSyllableFunction( "saluiez", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "insinuiez", "fr_FR" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for a sentence with exclusions in the full category", function() {
		var testCases = {
			eyeliner: 3,
			que: 1,
			remuons: 3,
			argent: 2,
			lent: 1,
			animent: 2,
			août: 1,
			es: 1,
			oye: 1,
		};

		testCountSyllables( testCases, "fr_FR" );
	} );

	it( "returns the number of syllables for a word containing a string from the full exceptions category", function() {
		expect( countSyllableFunction( "aoûtien", "fr_FR" ) ).toBe( 3 );
		expect( countSyllableFunction( "phrases", "fr_FR" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables for a sentence with exclusions in the global category", function() {
		var testCases = {
			business: 2,
			businesswoman: 4,
			skate: 1,
			skateboard: 2,
			board: 1,
			zoom: 1,
			zoomez: 2,
			tatoueur: 3,
			tatoueuse: 3,
		};

		testCountSyllables( testCases, "fr_FR" );
	} );

	it( "returns the number of syllables of words containing words from the exclusion word list at the beginning", function() {
		expect( countSyllableFunction( "roast, taï", "fr_FR" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing words from the exclusion word list at the end", function() {
		expect( countSyllableFunction( "écrouer, clouer", "fr_FR" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "hétaïre", "fr_FR" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function() {
		expect( countSyllableFunction( "cloueront", "fr_FR" ) ).toBe( 2 );
		expect( countSyllableFunction( "écroueront", "fr_FR" ) ).toBe( 3 );
	} );
} );
