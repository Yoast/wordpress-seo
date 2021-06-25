import stem from "../../../../../../src/languageProcessing/languages/sk/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataSK = getMorphologyData( "sk" ).sk;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// Input a word ending in case suffix -eho.
	[ "teplejšieho", "tep" ],
	// Input a word ending in derivational suffix -obinec.
	[ "", "" ],
	// Input a word ending in derivational suffix -ionár.
	[ "milionár", "mil" ],
	// Input a word ending in derivational suffix -ovisk.
	[ "pracovisk", "prac" ],
	// Input a word ending in derivational suffix -ovstv.
	[ "majstrovstv", "majstr" ],
	// Input a word ending in derivational suffix -ovec.
	[ "bezdomovec", "bezdom" ],
	// Input a word ending in derivational suffix -ások.
	[ "", "" ],
	// Input a word ending in derivational suffix -nosť.
	[ "možnosť", "mož" ],
	// Input a word ending in derivational suffix -enic.
	[ "smolenic", "smol" ],
	// Input a word ending in derivational suffix -inec.
	[ "žrebčinec", "žrebč" ],
	// Input a word ending in derivational suffix -árn.
	[ "", "" ],
	// Input a word ending in derivational suffix -enk.
	[ "podmienk", "podmi" ],
	// Input a word ending in derivational suffix -ián.
	[ "bazilián", "bazil" ],
	// Input a word ending in derivational suffix -och.
	[ "", "" ],
	// Input a word ending in derivational suffix -ost.
	[ "zodpovednost", "zodpovedn" ],
	// Input a word ending in derivational suffix -áč.
	[ "poslucháč", "posluch" ],
	// Input a word ending in derivational suffix -ač.
	[ "prijímač", "prijím" ],
	// Input a word ending in derivational suffix -ec.
	[ "rámec", "rám" ],
	// Input a word ending in derivational suffix -en.
	[ "žiaden", "žiad" ],
	// Input a word ending in derivational suffix -ér.
	[ "manažér", "manaž" ],
	// Input a word ending in derivational suffix -ír.
	[ "krajčír", "krajč" ],
	// Input a word ending in derivational suffix -ic.
	[ "", "" ],
	// Input a word ending in derivational suffix -in.
	[ "", "" ],
	// Input a word ending in derivational suffix -ín.
	[ "", "" ],
	// Input a word ending in derivational suffix -it.
	[ "", "" ],
	// Input a word ending in derivational suffix -iv.
	[ "", "" ],
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

