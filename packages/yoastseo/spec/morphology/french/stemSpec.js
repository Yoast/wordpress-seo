import stem from "../../../src/morphology/french/stem";


const wordsToStem = [
	// Input noun with: singular: -z, plural: -ces
	[ "acteurs", "acteur" ],
];

const paradigms = [
	// A paradigm with various types of diminutive
	{ stem: "acteur", forms: [ "acteurs", "acteur" ] },
];


describe( "Test for stemming French words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ] ) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
	for ( const paradigm of paradigms ) {
		for ( const form of paradigm.forms ) {
			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
				expect( stem( form ) ).toBe( paradigm.stem );
			} );
		}
	}
} );
