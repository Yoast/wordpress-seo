import stem from "../../../src/languageProcessing/languages/fr/helpers/internal/stem";
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
	// Input a noun ending in -ition.
	[ "opposition", "oppos" ],
	[ "oppositions", "oppos" ],
	[ "acquisition", "acquer" ],
	[ "acquisitions", "acquer" ],
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
	[ "curatrices", "cur" ],
	[ "curatrice", "cur" ],
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
	[ "accident", "accident" ],
	[ "accidents", "accident" ],
	[ "testament", "testament" ],
	[ "testaments", "testament" ],
	[ "coefficient", "coefficient" ],
	[ "coefficients", "coefficient" ],
	[ "filament", "filament" ],
	[ "filaments", "filament" ],
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
	// Words with the plural suffix -x.
	[ "baux", "bau" ],
	[ "feux", "feu" ],
	[ "cailloux", "caillou" ],
	[ "étaux", "étau" ],
	// Plurals ending in -is/-os/-us.
	[ "vrais", "vrai" ],
	[ "numéros", "numéro" ],
	[ "trous", "trou" ],
	// Exceptions for which -is/-os/-us should not be stemmed.
	[ "bis", "bis" ],
	[ "diffus", "diffus" ],
	[ "clos", "clos" ],
	// Short words that should be stemmed.
	[ "ardemment", "ardent" ],
	[ "ours", "our" ],
	[ "action", "act" ],
	[ "actions", "act" ],
	[ "âme", "âm" ],
	[ "âmes", "âm" ],
	// Verbs with multiple stems.
	[ "acquit", "acquer" ],
	[ "astrein", "astreindr" ],
	[ "vécu", "vivr" ],
	// Verbs with multiple stems ending in -s. (Removed from list of verbs ending in -s that shouldn't be stemmed.)
	[ "acquis", "acquer" ],
	[ "appris", "apprendr" ],
	[ "assis", "asseoir" ],
	// Verbs with suffix -ons.
	[ "chantons", "chant" ],
	[ "dessinons", "dessin" ],
	[ "nettoyons", "nettoi" ],
	// -Ons is not stemmed if preceded by i.
	[ "questions", "question" ],
	[ "stations", "station" ],
	// Two-syllable verbs that start with a vowel and end on -ons.
	[ "aidons", "aid" ],
	[ "aimons", "aim" ],
	// Non-verbs ending on -ons where only -s should be stemmed.
	[ "chansons", "chanson" ],
	[ "potirons", "potiron" ],
	[ "taille-crayons", "taille-crayon" ],
	// Irregular verbs added to the full forms.
	[ "prirent", "prend" ],
	[ "croiraient", "croi" ],
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
			"dorment",
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
