import stem from "../../../src/morphology/turkish/stem";

// @todo add actual Turkish morphology data
const morphologyDataTR = {};

const wordsToStem = [
	[ "Kedileriyle", "kedi" ],
];
describe( "Test for stemming Turkish words", () => {
	it( "stems Turkish words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ], morphologyDataTR ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );

