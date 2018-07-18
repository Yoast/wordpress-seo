let matchWordInSentence = require( "../../js/stringProcessing/matchWordInSentence" );
let characterInBoundary = matchWordInSentence.characterInBoundary;
let isWordInSentence = matchWordInSentence.isWordInSentence;

describe( "returns whether the character is in the word boundary list", function() {
	it( "returns true if the character is in the word boundary list", function() {
		let input = ".";
		let expected = true;
		expect( characterInBoundary( input ) ).toEqual( expected );
	} );
	it( "returns false if the character is not in the word boundary list", function() {
		let input = "a";
		let expected = false;
		expect( characterInBoundary( input ) ).toEqual( expected );
	} );
} );

describe( "returns whether a word is in the sentence", function() {
	it( "returns true if the word is in the middle of the sentence", function() {
		let word = "is";
		let sentence = "this is a sentence with a word";
		let expected = true;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
	it( "returns true if the word is at the beginning of the sentence", function() {
		let word = "this";
		let sentence = "this is a sentence with a word";
		let expected = true;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
	it( "returns true if the word is at the end of the sentence", function() {
		let word = "word";
		let sentence = "this is a sentence with a word";
		let expected = true;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
	it( "returns false if the word not the sentence", function() {
		let word = "not";
		let sentence = "this is a sentence with a word";
		let expected = false;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
} );
