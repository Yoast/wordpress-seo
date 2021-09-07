import checkVerbStemModifications from "../../../../../../src/languageProcessing/languages/es/helpers/internal/checkVerbStemModifications";
import getMorphologyData from "../../../../../../spec/specHelpers/getMorphologyData.js";

const morphologyDataES = getMorphologyData( "es" ).es;

const wordsToStem = [
	// Qu -> c
	[ "apliques", "aplic" ],
	[ "ataquemos", "atac" ],
	// Qu -> c + ue -> o
	[ "trueque", "troc" ],
	// Ij -> g
	[ "dirijo", "dirig" ],
	[ "exijamos", "exig" ],
	// Zc -> c
	[ "conozco", "conoc" ],
	[ "traduzcamos", "traduc" ],
	// I -> e
	[ "sintió", "sent" ],
	[ "sugiriese", "suger" ],
	// U -> o
	[ "murieron", "mor" ],
	[ "durmió", "dorm" ],
	// Ue -> o
	[ "recuerdan", "record" ],
	[ "resuelves", "resolv" ],
	// Ie -> e
	[ "cierno", "cern" ],
	[ "aciertas", "acert" ],
];

describe( "Test for stemming Spanish words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( checkVerbStemModifications( wordToCheck[ 0 ], morphologyDataES ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );
