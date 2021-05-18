import stem from "../../../../../../src/languageProcessing/languages/he/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataHE = getMorphologyData( "he" ).he;

const wordsToStem = [
	// A word that is in the dictionary
	[ "איחרנו", "איחר" ],
	[ "מפרסמים", "פרסם" ],
	// A word with a prefix which is found in the dictionary after removing the prefix
	[ "הציפור", "ציפור" ],
	[ "הכלבים", "כלב" ],
	[ "ששלחה", "שלח" ],
	[ "באהבה", "אהב" ],
	[ "כאמא", "אמא" ],
	[ "לגיהינום", "גיהינום" ],
	[ "מדם", "דם" ],
	[ "ובודדה", "בודד" ],
	// A word with two prefixes which is found in the dictionary after removing both prefixes
	[ "והכלבים", "כלב" ],
	[ "מהחתולים", "חתול" ],
	// A word that is not in the dictionary
	[ "קרואטיה", "קרואטיה" ],
	[ "מורפולוגיה", "מורפולוגיה" ],
	// A word with a prefix removed that is not in the dictionary
	[ "החסידה", "החסידה" ],

];

const paradigms = [
	// A paradigm of a noun (excluding forms with prefixes  "ה", "ו", "כ", "ל", "מ", "ש").
	{ stem: "ילד", forms: [
		"ילד",
		// "ילדי",
		"ילדים",
		"ילדנו",
		"ילדך",
		"ילדו",
		"ילדיך",
		"ילדיו",
		"ילדך",
		// "ילדה",
		// "ילדי",
		"ילדיך",
		"ילדיה",
		// "ילדכם",
		// "ילדם",
		"ילדינו",
		"ילדיכם",
		"ילדיהם",
		// "ילדכן",
		// "ילדן",
		// "ילדיכן",
		// "ילדיהן",
	] },
	// A paradigm of an adjective.
	{ stem: "גדול", forms: [
		"גדול",
		"גדולה",
		"גדולים",
		"גדולות",
	] },
	// A paradigm of a verb.
	{ stem: "אהב",
		forms: [
			"אהבתי",
			"אהבנו",
			"אהבת",
			"אהב",
			"אוהב",
			// "תאהב",
			"יאהב",
			"אהב",
			"לאהב",
			"לאהוב",
			"אהבת",
			"אהבה",
			"אוהבת",
			"אהב",
			"תאהבי",
			// "תאהב",
			// "אהבי",
			"אוהב",
			"אהבתם",
			"אהבו",
			"אוהבים",
			"נאהב",
			// "תאהבו",
			"יאהבו",
			"אהבו",
			// "אהבתן",
			"אוהבות",
		] },
];

describe( "Test for stemming Hebrew words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataHE ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form, morphologyDataHE ) ).toBe( paradigm.stem );
			} );
		}
	}
} );
