import stem from "../../../src/morphology/norwegian/stem";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyData = getMorphologyData( "nn" ).nn;

const wordsToStem = [
	// Stem words end in suffixes in step 1
	[ "aabakken", "aabakk" ],
	[ "aabakkens", "aabakk" ],
	[ "analysert", "analyser" ],
	[ "arbeids", "arbeid" ],
	// Stem words end in suffixes step 2
	[ "anvendt", "anvend" ],
	[ "attraktivt", "attraktiv" ],
	// Stem words end in suffixes step 3
	[ "forsikringsvirksomhetsloven", "forsikringsvirksom" ],
	[ "brukareige", "brukar" ],
];

describe( "Test for stemming Norwegian words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ], morphologyData ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

