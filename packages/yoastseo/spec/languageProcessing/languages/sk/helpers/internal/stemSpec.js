import stem from "../../../../../../src/languageProcessing/languages/sk/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataSK = getMorphologyData( "sk" ).sk;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// Input a word ending in case suffix -eho.
	[ "teplejšieho", "tep" ],

];

const paradigms = [
	// A paradigm of a masculine animate noun (hard declension).
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

