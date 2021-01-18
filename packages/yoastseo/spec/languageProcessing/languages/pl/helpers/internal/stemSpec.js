import stem from "../../../../../../src/languageProcessing/languages/pl/helpers/internal/stem";
import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

const morphologyDataPL = getMorphologyData( "pl" ).pl;

const wordsToStem = [
	// Words that are in the dictionary stemmer and are not stemmed further in the rule-base stemmer.
	[ "boże", "bóg" ],
	[ "powrotu", "powrót" ],
	[ "psa", "pies" ],
	[ "domu", "dom" ],
	[ "imieniu", "imię" ],
	// Words that are in the dictionary stemmer and that undergo further stemming by the rule-based stemmer.
	[ "śpisz", "sp" ],
	[ "dzieci", "dziec" ],
	[ "najdroższa", "droż" ],
	[ "niebezpieczni", "bezp" ],
	// Words that are not in the dictionary stemmer and are only stemmed by the rule-based stemmer.
	[ "moczenie", "mocz" ],
	[ "garbaty", "garbat" ],
	[ "zajączek", "zającz" ],
];

describe( "Test for stemming Polish words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyDataPL ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

