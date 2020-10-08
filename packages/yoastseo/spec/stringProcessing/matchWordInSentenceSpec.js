import matchWordInSentence from "../../src/stringProcessing/matchWordInSentence";
const characterInBoundary = matchWordInSentence.characterInBoundary;
const isWordInSentence = matchWordInSentence.isWordInSentence;

describe( "returns whether the character is in the word boundary list", function() {
	it( "returns true if the character is in the word boundary list", function() {
		const input = ".";
		const expected = true;
		expect( characterInBoundary( input ) ).toEqual( expected );
	} );
	it( "returns false if the character is not in the word boundary list", function() {
		const input = "a";
		const expected = false;
		expect( characterInBoundary( input ) ).toEqual( expected );
	} );
	it( "recognizes special quotation marks as word boundaries", function() {
		const input = "‟";
		const expected = true;
		expect( characterInBoundary( input ) ).toEqual( expected );
	} );
} );

describe( "returns whether a word is in the sentence", function() {
	it( "returns true if the word is in the middle of the sentence", function() {
		const word = "is";
		const sentence = "this is a sentence with a word";
		const expected = true;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
	it( "returns true if the word is at the beginning of the sentence", function() {
		const word = "this";
		const sentence = "this is a sentence with a word";
		const expected = true;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
	it( "returns true if the word is at the end of the sentence", function() {
		const word = "word";
		const sentence = "this is a sentence with a word";
		const expected = true;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
	it( "returns false if the word not the sentence", function() {
		const word = "not";
		const sentence = "this is a sentence with a word";
		const expected = false;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
} );

describe( "returns whether a word is in the sentence in RTL languages with special punctuation", function() {
	it( "returns true if the word is followed by Urdu-specific punctuation mark", function() {
		const word = "گئے";
		const sentence = "اس دوران میں وہ حملے کرتے رہے اور آخرکار شکست کھا گئے۔";
		const expected = true;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );

	it( "returns true if the word is followed by an Arabic-specific punctuation mark", function() {
		const word = "الجيدة";
		const sentence = "ما هي المقالات الجيدة؟";
		const expected = true;
		expect( isWordInSentence( word, sentence ) ).toEqual( expected );
	} );
} );

