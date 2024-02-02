import { includesWordsAtPosition } from "../../../../../src/scoring/assessments/inclusiveLanguage/helpers/includesWordsAtPosition";

describe( "The includesWordsAtPosition helper", () => {
	it( "checks whether an array of words occurs at a given position in another array of words", () => {
		const sentence = "This is a sentence containing some words".split( " " );
		const wordsToFind = "a sentence".split( " " );

		expect( includesWordsAtPosition( wordsToFind, 2, sentence ) ).toBe( true );
	} );
	it( "returns false when an array of words does not occur at a given position", () => {
		const sentence = "This is a sentence containing some words".split( " " );
		const wordsToFind = "a sentence".split( " " );

		// Words occur, but at the wrong position.
		expect( includesWordsAtPosition( wordsToFind, 4, sentence ) ).toBe( false );
	} );
	it( "returns false when an array of words does not occur at all", () => {
		const sentence = "This is a sentence containing some words".split( " " );
		const wordsToFind = "does not occur at all".split( " " );

		// Words do not occur at all.
		expect( includesWordsAtPosition( wordsToFind, 5, sentence ) ).toBe( false );
	} );
} );
