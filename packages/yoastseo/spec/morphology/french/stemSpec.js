import stem from "../../../src/morphology/french/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataFR = getMorphologyData( "fr" ).fr;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// RV is the region after the third letter if the word begins with two vowels.
	[ "aimer", "aim" ],
	// RV is the region after the first vowel not at the beginning of the word.
	[ "adorer", "ador" ],
	// RV is the end of the word if the previous positions cannot be found.
	[ "voler", "vol" ],
	// RV is the right of par, col, tap for words beginning with those syllables.
	[ "tapis", "tapi" ],
	// Input a word ending in -ci + a2 class suffix.
	[ "cicatrice", "cicatric" ],
	// Input a noun ending in -ance.
	[ "concordances", "concord" ],
	[ "concordance", "concord" ],
	// Input a noun ending in -ique.
	[ "botaniques", "botan" ],
	[ "botanique", "botan" ],
	// Input a noun ending in -isme.
	[ "dualismes", "dualism" ],
	[ "dualisme", "dualism" ],
	// Input a noun ending in -able.
	[ "confortables", "confort" ],
	[ "confortable", "confort" ],
	// Input a noun ending in -iste.
	[ "fatalistes", "fatal" ],
	[ "fataliste", "fatal" ],
	// Input a noun ending in -eux.
	[ "bileux", "bileux" ],
	// Input a noun ending in -atrice.
	[ "curatrices", "curatric" ],
	[ "curatrice", "curatric" ],
	// Input a noun ending in -eur.
	[ "acteurs", "acteur" ],
	// Input a noun ending in -logie.
	[ "analogie", "analog" ],
	[ "analogies", "analog" ],
	// Input a noun ending in -usion.
	[ "autotransfusion", "autotransfu" ],
	[ "autotransfusions", "autotransfu" ],
	// Input a noun ending in -ence.
	[ "différence", "différent" ],
	[ "différences", "différent" ],
	// Input a noun ending in -ité.
	[ "réalité", "réalit" ],
	[ "réalités", "réalit" ],
	// Input a noun ending in -if.
	[ "corrosif", "corros" ],
	[ "corrosives", "corros" ],
	// Input a noun ending in -eaux.
	[ "tableaux", "tableau" ],
	// Input a noun ending in -aux.
	[ "animaux", "animal" ],
	// Input a noun ending in -euse.
	[ "paresseuse", "paress" ],
	[ "paresseuses", "paress" ],
	// Input a noun ending in -issement.
	[ "divertissement", "divert" ],
	[ "divertissements", "divert" ],
	// Input a noun ending in -amment.
	[ "couramment", "cour" ],
	// Input a noun ending in -emment.
	[ "apparemment", "apparent" ],
	// Input a noun ending in -ment.
	[ "clément", "clément" ],
	[ "cléments", "clément" ],
	// Words on the exception list with full forms.
	[ "yeux", "œil" ],
	[ "oeil", "œil" ],
	[ "œil", "œil" ],
	[ "ciels", "ciel" ],
	[ "cieux", "ciel" ],
	[ "fol", "fou" ],
	[ "doucement", "doux" ],
	// Words that have multiple stems.
	[ "favorit", "favor" ],
	[ "fraîch", "frais" ],
	[ "fraich", "frais" ],
	// Plurals ending in -is/-os/-us.
	[ "vrais", "vrai" ],
	[ "numéros", "numéro" ],
	[ "trous", "trou" ],
	// Exceptions for which -is/-os/-us should not be stemmed.
	[ "bis", "bis" ],
	[ "diffus", "diffus" ],
	[ "clos", "clos" ],
];

const paradigms = [
	// A paradigm of a noun.
	{ stem: "acteur", forms: [ "acteurs", "acteur" ] },
	// A paradigm of an adjective.
	{ stem: "import", forms: [
		"important",
		"importante",
		"importants",
		"importantes",
	] },
	// A paradigm of a verb the suffixes of which start with i.
	{ stem: "dorm",
		forms: [
			// "dors",
			// "dort",
			// "dormons",
			"dormez",
			// "dorment",
			"dormais",
			"dormait",
			// "dormions",
			"dormiez",
			"dormaient",
			"dormirai",
			"dormiras",
			"dormira",
			"dormirons",
			"dormirez",
			"dormiront",
			"dormis",
			"dormit",
			"dormîmes",
			"dormîtes",
			"dormirent",
			"dormes",
			"dorme",
			// "dormions",
			"dormiez",
			// "dorment",
			"dormisse",
			"dormisses",
			"dormît",
			"dormissions",
			"dormissiez",
			"dormissent",
			"dormirais",
			"dormirait",
			"dormirions",
			"dormiriez",
			"dormiraient",
			"dormant",
			// "dormons",
			"dormez",
			"dormi",
			"dormir",
		] },
];


describe( "Test for stemming French words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataFR ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form, morphologyDataFR ) ).toBe( paradigm.stem );
			} );
		}
	}
} );
