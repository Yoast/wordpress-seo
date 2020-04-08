import stem from "../../../src/morphology/russian/stem";

// The first word in each array is the word, the second one is the expected stem.

const wordsToStem = [
	// Words with perfective gerund suffix.
	[ "прочитав", "прочита"],
];


describe( "Test for stemming russian words", () => {
	it( "stems russian words", () => {
		wordsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
