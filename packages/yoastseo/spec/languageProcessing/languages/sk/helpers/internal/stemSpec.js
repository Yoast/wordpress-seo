import stem from "../../../../../../src/languageProcessing/languages/sk/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataSK = getMorphologyData( "sk" ).sk;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// Input a word ending in case suffix -eho.
	[ "teplejšieho", "tep" ],
	// Input a word ending in case suffix -atoch
	// [ "demokratoch", "demokrat" ],
	[ "sampionatoch", "sampio" ],
	// Input a word ending in case suffix -aťom
	[ "arcikniežaťom", "arcikniež" ],
	// Input a word ending in case suffix -aťom
	[ "arcikniežaťom", "arcikniež" ],
	// Input a word ending in case suffix -och
	[ "mesiacoch", "mesia" ],
	// Input a word ending in case suffix -ému
	[ "samotnému", "samot" ],
	// Input a word ending in case suffix -ých
	[ "ktorých", "ktor" ],
	// Input a word ending in case suffix -ých and a derivational suffix -č
	[ "zahraničných", "zahrani" ],
	// Input a word ending in case suffix -ata
	[ "zvierata", "zvier" ],
	// Input a word ending in case suffix -om and a derivational suffix -ob
	[ "spôsobom", "spôs" ],
	// Input a word ending in case suffix -om
	[ "ľuďom", "ľuď" ],
	// Input a word ending in case suffix -es
	[ "najdes", "naj" ],
	// Input a word ending in case suffix -ím
	[ "hovorím", "hov" ],
	// Input a word ending in case suffix -úm
	[ "chartúm", "char" ],
	// Input a word ending in case suffix -ej
	[ "súčasnej", "súčas" ],
	// Input a word ending in possessive suffix -ov
	[ "problémov", "problém" ],
	// Input a word ending in possessive suffix -in
	[ "problémin", "problém" ],
	// Input a word ending in comparative suffix -ejš
	[ "mokrejš", "mokr" ],
	// Input a word ending in a case suffix -í and comparative suffix -ejš
	[ "skúpejší", "skúp" ],
	// Input a word ending in a case suffix -í and comparative suffix -ějš
	[ "nejkrásnější", "nejkrás" ],
];

const paradigms = [
	{ stem: "tep", forms: [
		"teplý",
		"teplého",
		"teplému",
		"teplém",
		"teplým",
		"teplá",
		"teplé",
		"teplou",
		"teplí",
		"teplých",
		"teplými",
	] },
	// Paradigm of a verb
	{ stem: "pochop", forms: [
		// "pochopiť",
		// "pochopiac",
		// "pochopiaci",
		// "pochopiaca",
		// "pochopiace",
		"pochopený",
		"pochopená",
		"pochopené",
		"pochopení",
		// "pochopím",
		// "pochopíš",
		"pochopí",
		// "pochopíme",
		// "pochopíte",
		// "pochopia",
		// "pochopili",
		// "pochopil",
		// "pochopila",
		// "pochopilo",
		// "pochopme",
		"pochopte",
		// "pochopenie",
	] },
];

describe( "Test for stemming Slovak words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataSK ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form, morphologyDataSK ) ).toBe( paradigm.stem );
			} );
		}
	}
} );

