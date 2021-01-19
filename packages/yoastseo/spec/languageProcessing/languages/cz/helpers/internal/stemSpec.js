import stem from "../../../../../../src/languageProcessing/languages/cz/helpers/internal/stem";
// import getMorphologyData from "../../../../../specHelpers/getMorphologyData";

// const morphologyDataCZ = getMorphologyData( "cz" ).cz;

// The first word in each array is the word, the second one is the expected stem.
const wordsToStem = [
	// RV is the region after the third letter if the word begins with two vowels.
	[ "velobinec", "vel" ],
];

// const paradigms = [
// 	// A paradigm of a noun.
// 	{ stem: "", forms: [ "", "" ] },
// 	// A paradigm of an adjective.
// 	{ stem: "", forms: [
// 		] },
// ];


describe( "Test for stemming Czech words", () => {
	for ( let i = 0; i < wordsToStem.length; i++ ) {
		const wordToCheck = wordsToStem[ i ];
		it( "stems the word " + wordToCheck[ 0 ], () => {
			expect( stem( wordToCheck[ 0 ]) ).toBe( wordToCheck[ 1 ] );
		} );
	}
} );

// describe( "Test to make sure all forms of a paradigm get stemmed to the same stem", () => {
// 	for ( const paradigm of paradigms ) {
// 		for ( const form of paradigm.forms ) {
// 			it( "correctly stems the word: " + form + " to " + paradigm.stem, () => {
// 				expect( stem( form ) ).toBe( paradigm.stem );
// 			} );
// 		}
// 	}
// } );
