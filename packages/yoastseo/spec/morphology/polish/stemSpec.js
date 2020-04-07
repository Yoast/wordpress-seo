import stem from "../../../src/morphology/polish/stem";

const wordsToStem = [
	[ "", "" ],
	[ "", "" ],
];

describe( "Test for stemming Polish words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ] ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );
