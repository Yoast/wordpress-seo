import { parseTextIntoSentences } from "../../../../src/parsedPaper/build/linguisticParsing/parseText";
import { forEach } from "lodash";
import Sentence from "../../../../src/parsedPaper/build/linguisticParsing/Sentence";

/**
 * Helper to test sentence detection.
 *
 * @param {array} testCases Cases to test.
 *
 * @returns {void}
 */
function testGetSentences( testCases ) {
	forEach( testCases, function( testCase ) {
		expect( parseTextIntoSentences( testCase.input ) ).toEqual( testCase.expected );
	} );
}

describe( "Get sentences from text that has bee cleaned of all HTML or other mark-up", function() {
	it( "returns sentences", function() {
		const testCases = [
			{
				input: "Hello. How are you? Bye",
				expected: [
					new Sentence( "Hello.", 0, 5 ),
					new Sentence( "How are you?", 7, 18 ),
					new Sentence( "Bye", 20, 22 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "returns sentences with digits", function() {
		const testCases = [
			{
				input: "Hello. 123 Bye",
				expected: [
					new Sentence( "Hello.", 0, 5 ),
					new Sentence( "123 Bye", 7, 13 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "returns sentences with abbreviations", function() {
		const testCases = [
			{
				input: "It was a lot. Approx. two hundred",
				expected: [
					new Sentence( "It was a lot.", 0, 12 ),
					new Sentence( "Approx. two hundred", 14, 32 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "returns sentences with a ! in it (should not be converted to . )", function() {
		const testCases = [
			{
				input: "It was a lot. Approx! two hundred",
				expected: [
					new Sentence( "It was a lot.", 0, 12 ),
					new Sentence( "Approx!", 14, 20 ),
					new Sentence( "two hundred", 22, 32 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "returns sentences with multiple sentence delimiters at the end", function() {
		const testCases = [
			{
				input: "Was it a lot!?!??! Yes, it was!",
				expected: [
					new Sentence( "Was it a lot!?!??!", 0, 17 ),
					new Sentence( "Yes, it was!", 19, 30 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "returns sentences with multiple periods at the end", function() {
		const testCases = [
			{
				input: "It was a lot... Approx. two hundred.",
				expected: [
					new Sentence( "It was a lot...", 0, 14 ),
					new Sentence( "Approx. two hundred.", 16, 35 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "returns sentences, with :", function() {
		const testCases = [
			{
				input: "One. Two. Three: Four! Five.",
				expected: [
					new Sentence( "One.", 0, 3 ),
					new Sentence( "Two.", 5, 8 ),
					new Sentence( "Three: Four!", 10, 21 ),
					new Sentence( "Five.", 23, 27 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "can detect sentences in parentheses", function() {
		const testCases = [
			{
				input: "First sentence. (Second sentence.) [Third sentence.]",
				expected: [
					new Sentence( "First sentence.", 0, 14 ),
					new Sentence( "(Second sentence.)", 16, 33 ),
					new Sentence( "[Third sentence.]", 35, 51 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should not split on parentheses", function() {
		const testCases = [
			{
				input: "A sentence with (parentheses).",
				expected: [
					new Sentence( "A sentence with (parentheses).", 0, 29 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "can detect sentences in brackets", function() {
		const testCases = [
			{
				input: "First sentence. Second sentence.] Third sentence",
				expected: [
					// NOTE: originally was parsed as "[First sentence."
					new Sentence( "First sentence.", 0, 14 ),
					new Sentence( "Second sentence.]", 16, 32 ),
					new Sentence( "Third sentence", 34, 47 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "ignores decimals with dots in them", function() {
		const testCases = [
			{
				input: "This is 1.0 complete sentence",
				expected: [
					new Sentence( "This is 1.0 complete sentence", 0, 28 ),
				],
			},
			{
				input: "This is 255.255.255.255 complete sentence",
				expected: [
					new Sentence( "This is 255.255.255.255 complete sentence", 0, 40 ),
				],
			},
			{
				input: "This is an IP (127.0.0.1) 1 sentence",
				expected: [
					new Sentence( "This is an IP (127.0.0.1) 1 sentence", 0, 35 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should not break on colons", function() {
		const testCases = [
			{
				input: "This should be: one sentence",
				expected: [
					new Sentence( "This should be: one sentence", 0, 27 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should always break on ;, ? and ! even when there is no capital letter", function() {
		const testCases = [
			{
				input: "First sentence; second sentence! third sentence? fourth sentence",
				expected: [
					new Sentence( "First sentence;", 0, 14 ),
					new Sentence( "second sentence!", 16, 31 ),
					new Sentence( "third sentence?", 33, 47 ),
					new Sentence( "fourth sentence", 49, 63 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should match correctly with quotation", function() {
		const testCases = [
			{
				input: "First sentence. \"Second sentence\"",
				expected: [
					new Sentence( "First sentence.", 0, 14 ),
					new Sentence( "\"Second sentence\"", 16, 32 ),
				],
			},
			{
				input: "First sentence. 'Second sentence'",
				expected: [
					new Sentence( "First sentence.", 0, 14 ),
					new Sentence( "'Second sentence'", 16, 32 ),
				],
			},
			{
				input: "First sentence. ¿Second sentence?",
				expected: [
					new Sentence( "First sentence.", 0, 14 ),
					new Sentence( "¿Second sentence?", 16, 32 ),
				],
			},
			{
				input: "First sentence. ¡Second sentence!",
				expected: [
					new Sentence( "First sentence.", 0, 14 ),
					new Sentence( "¡Second sentence!", 16, 32 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "should accept the horizontal ellipsis as sentence terminator", function() {
		var testCases = [
			{
				input: "This is the first sentence… Followed by a second one.",
				expected: [
					new Sentence( "This is the first sentence…", 0, 26 ),
					new Sentence( "Followed by a second one.", 28, 52 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "correctly parses sentences with blockends", function() {
		var testCases = [
			{
				input: "This is a sentence (with blockends.) and is still one sentence.",
				expected: [
					new Sentence( "This is a sentence (with blockends.) and is still one sentence.", 0, 62 ),
				],
			},
			{
				input: "This is a sentence (with blockends.). This is a second sentence.",
				expected: [
					new Sentence( "This is a sentence (with blockends.).", 0, 36 ),
					new Sentence( "This is a second sentence.", 38, 63 ),
				],
			},
			{
				input: "This is a sentence (with blockends.) This is a second sentence.",
				expected: [
					new Sentence( "This is a sentence (with blockends.)", 0, 35 ),
					new Sentence( "This is a second sentence.", 37, 62 ),
				],
			},
			{
				input: "This is a sentence (with blockends) This is a second sentence.",
				expected: [
					new Sentence( "This is a sentence (with blockends)", 0, 34 ),
					new Sentence( "This is a second sentence.", 36, 61 ),
				],
			},
			{
				input: "This is a sentence (with blockends.). this is a second sentence.",
				expected: [
					new Sentence( "This is a sentence (with blockends.). this is a second sentence.", 0, 63 ),
				],
			},
			{
				input: "This is a sentence (with blockends.). 1 this is a second sentence.",
				expected: [
					new Sentence( "This is a sentence (with blockends.).", 0, 36 ),
					new Sentence( "1 this is a second sentence.", 38, 65 ),
				],
			},
		];

		testGetSentences( testCases );
	} );

	it( "Correctly gets sentences with a '<' signs in the middle or at the start.", function() {
		const testCases = [
			{
				input: "This is a sentence with a < and is still one sentence.",
				expected: [
					new Sentence( "This is a sentence with a < and is still one sentence.", 0, 53 ),
				],
			},
			{
				input: "This is a < sentence < with three '<' signs. This is another sentence.",
				expected: [
					new Sentence( "This is a < sentence < with three '<' signs.", 0, 43 ),
					new Sentence( "This is another sentence.", 45, 69  ),
				],
			},
			{
				input: "This is a 10 < 20 signs. This is another sentence.",
				expected: [
					new Sentence( "This is a 10 < 20 signs.", 0, 23 ),
					new Sentence( "This is another sentence.", 25, 49 ),
				],
			},
			{
				input: "This is a sentence <. This is another sentence.",
				expected: [
					new Sentence( "This is a sentence <.", 0, 20 ),
					new Sentence( "This is another sentence.", 22, 46 ),
				],
			},
			{
				input: "<",
				expected: [
					new Sentence( "<", 0, 0 ),
				],
			},
			{
				input: "Hey you! Obviously, 20.0 < 25.0 and 50.0 > 30.0. Do not tell anyone, it is a secret.",
				expected: [
					new Sentence( "Hey you!", 0, 7 ),
					new Sentence( "Obviously, 20.0 < 25.0 and 50.0 > 30.0.", 9, 47 ),
					new Sentence( "Do not tell anyone, it is a secret.", 49, 83 ),
				],
			},
			{
				input: "Hey 40 < 50. However, 40 > 50.",
				expected: [
					new Sentence( "Hey 40 < 50.", 0, 11 ),
					new Sentence( "However, 40 > 50.", 13, 29 ),
				],
			},
		];

		testGetSentences( testCases );
	} );
} );
