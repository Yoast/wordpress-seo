import getMarkingsInSentence from "../../../../src/languageProcessing/helpers/highlighting/getMarkingsInSentence";
import Mark from "../../../../src/values/Mark";

const sentenceTokens = [
	{ text: "This", sourceCodeRange: { startOffset: 0, endOffset: 4 } },
	{ text: " ", sourceCodeRange: { startOffset: 4, endOffset: 5 } },
	{ text: "is", sourceCodeRange: { startOffset: 5, endOffset: 7 } },
	{ text: " ", sourceCodeRange: { startOffset: 7, endOffset: 8 } },
	{ text: "a", sourceCodeRange: { startOffset: 8, endOffset: 9 } },
	{ text: " ", sourceCodeRange: { startOffset: 9, endOffset: 10 } },
	{ text: "sentence", sourceCodeRange: { startOffset: 10, endOffset: 18 } },
	{ text: ".", sourceCodeRange: { startOffset: 18, endOffset: 19 } },
];

const testCases = [
	{
		testDescription: "No markings in sentence",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 },
			tokens: sentenceTokens,
		},
		matchesInSentence: [],
		expectedResult: [],
	},
	{
		testDescription: "One marking in sentence",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 },
			tokens: sentenceTokens,
		},
		matchesInSentence: [ { sourceCodeRange: { startOffset: 0, endOffset: 4 } } ],
		expectedResult: [ new Mark( {
			marked: "<yoastmark class='yoast-text-mark'>This</yoastmark> is a sentence.",
			original: "This is a sentence.",
			position: { endOffset: 4, startOffset: 0 },
		} ) ],
	},
	{
		testDescription: "One marking in sentence with two consecutive matches",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 },
			tokens: sentenceTokens,
		},
		matchesInSentence: [ { sourceCodeRange: { startOffset: 0, endOffset: 4 } }, { sourceCodeRange: { startOffset: 5, endOffset: 7 } } ],
		expectedResult: [ new Mark( {
			marked: "<yoastmark class='yoast-text-mark'>This is</yoastmark> a sentence.",
			original: "This is a sentence.",
			position: { endOffset: 7, startOffset: 0 },
		} ) ],
	},
	{
		testDescription: "Two markings that are not consecutive in sentence",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 },
			tokens: sentenceTokens,
		},
		matchesInSentence: [ { sourceCodeRange: { startOffset: 0, endOffset: 4 } }, { sourceCodeRange: { startOffset: 10, endOffset: 18 } } ],
		expectedResult: [
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>This</yoastmark> is a <yoastmark class='yoast-text-mark'>sentence</yoastmark>.",
				original: "This is a sentence.",
				position: { endOffset: 4, startOffset: 0 },
			} ),
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>This</yoastmark> is a <yoastmark class='yoast-text-mark'>sentence</yoastmark>.",
				original: "This is a sentence.",
				position: { endOffset: 18, startOffset: 10 },
			} ),
		],
	},
	{
		testDescription: "One marking in a sentence that has a non-zero startOffset",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 10, endOffset: 38 },
			tokens: [
				{ text: "This", sourceCodeRange: { startOffset: 10, endOffset: 14 } },
				{ text: " ", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
				{ text: "is", sourceCodeRange: { startOffset: 15, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "a", sourceCodeRange: { startOffset: 18, endOffset: 19 } },
				{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 20, endOffset: 28 } },
				{ text: ".", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
			],
		},
		matchesInSentence: [ { sourceCodeRange: { startOffset: 10, endOffset: 14 } } ],
		expectedResult: [ new Mark( {
			marked: "<yoastmark class='yoast-text-mark'>This</yoastmark> is a sentence.",
			original: "This is a sentence.",
			position: { endOffset: 14, startOffset: 10 },
		} ) ],
	},
];

describe.each( testCases )( "a test for getting the marks from a sentence", ( {
	testDescription,
	sentence,
	matchesInSentence,
	expectedResult } ) => {
	it( testDescription, () => {
		expect( getMarkingsInSentence( sentence, matchesInSentence ) ).toEqual( expectedResult );
	} );
} );
