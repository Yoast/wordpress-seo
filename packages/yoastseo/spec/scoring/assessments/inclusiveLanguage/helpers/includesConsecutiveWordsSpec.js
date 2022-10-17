import { includesConsecutiveWords } from "../../../../../src/scoring/assessments/inclusiveLanguage/helpers/includesConsecutiveWords";

describe( "The includesConsecutiveWords helper", () => {
	it( "should check whether an array of words occurs consecutively in another array of words", () => {
		const sentence = "a sentence with some words".split( " " );
		const words = "with some".split( " " );
		expect( includesConsecutiveWords( sentence, words ) ).toEqual( [ 2 ] );
	} );
	it( "should check whether an array of words occurs consecutively multiple times in another array of words", () => {
		const sentence = "a sentence with some words and with some other words".split( " " );
		const words = "with some".split( " " );
		expect( includesConsecutiveWords( sentence, words ) ).toEqual( [ 2, 6 ] );
	} );
	it( "should return an empty array when no consecutive words are found", () => {
		const sentence = "a sentence with some words".split( " " );
		const words = "no other words".split( " " );
		expect( includesConsecutiveWords( sentence, words ) ).toEqual( [] );
	} );
} );
