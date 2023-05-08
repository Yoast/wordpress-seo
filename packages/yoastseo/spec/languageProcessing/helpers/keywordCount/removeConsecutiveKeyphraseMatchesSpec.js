import removeConsecutiveKeyphraseMatches from "../../../../src/languageProcessing/helpers/keywordCount/removeConsecutiveKeyphraseMatches";

/*
The following cases are tested:

This case is consecutive.
keyword
This is a nice string with a keyword keyword keyword.

This case is not consecutive.
key word
This is a nice string with a key word key word key word.

This case is not consecutive.
keyword
This is a nice string with a keyword keywords keyword.

This case is not consecutive.
keyword
This is a nice string with a keyword keyword nonkeyword keyword.
 */

/* eslint-disable max-len */
const testCases = [
	[
		"keyphrases are consecutive when they have length one and occur after each other 3 or more times",
		"keyword",
		{ primaryMatches: [
			[ { text: "keyword", sourceCodeRange: { startOffset: 0, endOffset: 7 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 8, endOffset: 15 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 16, endOffset: 23 } } ],
		] },
		{ primaryMatches: [
			[ { text: "keyword", sourceCodeRange: { startOffset: 0, endOffset: 7 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 8, endOffset: 15 } } ],
		] },
	],
	[
		"keyphrase matches are not consecutive when they consist of multiple tokens",
		"key word",
		{ primaryMatches: [
			[ { text: "key", sourceCodeRange: { startOffset: 0, endOffset: 3 } }, { text: "word", sourceCodeRange: { startOffset: 3, endOffset: 7 } } ],
			[ { text: "key", sourceCodeRange: { startOffset: 8, endOffset: 11 } }, { text: "word", sourceCodeRange: { startOffset: 11, endOffset: 15 } } ],
			[ { text: "key", sourceCodeRange: { startOffset: 16, endOffset: 19 } }, { text: "word", sourceCodeRange: { startOffset: 19, endOffset: 23 } } ],
		] },
		{ primaryMatches: [
			[ { text: "key", sourceCodeRange: { startOffset: 0, endOffset: 3 } }, { text: "word", sourceCodeRange: { startOffset: 3, endOffset: 7 } } ],
			[ { text: "key", sourceCodeRange: { startOffset: 8, endOffset: 11 } }, { text: "word", sourceCodeRange: { startOffset: 11, endOffset: 15 } } ],
			[ { text: "key", sourceCodeRange: { startOffset: 16, endOffset: 19 } }, { text: "word", sourceCodeRange: { startOffset: 19, endOffset: 23 } } ],
		] },
	],
	[
		"keyphrase matches are not consecutive when they are the same word but in a different form (morphology doesn't count)",
		"keyword",
		{ primaryMatches: [
			[ { text: "keyword", sourceCodeRange: { startOffset: 0, endOffset: 7 } } ],
			[ { text: "keywords", sourceCodeRange: { startOffset: 8, endOffset: 16 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 17, endOffset: 24 } } ],
		] },
		{ primaryMatches: [
			[ { text: "keyword", sourceCodeRange: { startOffset: 0, endOffset: 7 } } ],
			[ { text: "keywords", sourceCodeRange: { startOffset: 8, endOffset: 16 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 17, endOffset: 24 } } ],
		] },
	],
	[
		"keyphrase matches are not consecutive when they do not occur right after each other",
		"keyword",
		{ primaryMatches: [
			[ { text: "keyword", sourceCodeRange: { startOffset: 0, endOffset: 7 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 8, endOffset: 15 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 27, endOffset: 34 } } ],
		] },
		{ primaryMatches: [
			[ { text: "keyword", sourceCodeRange: { startOffset: 0, endOffset: 7 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 8, endOffset: 15 } } ],
			[ { text: "keyword", sourceCodeRange: { startOffset: 27, endOffset: 34 } } ],
		] },
	],
];
/* eslint-enable max-len */

describe.each( testCases )( "removeConsecutiveKeyPhraseMatches",
	( descriptor, keyphrase, result, expected ) => {
		it( descriptor, () => {
			expect( removeConsecutiveKeyphraseMatches( result ) ).toStrictEqual( expected );
		} );
	} );
