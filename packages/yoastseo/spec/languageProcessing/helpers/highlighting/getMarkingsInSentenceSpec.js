import getMarkingsInSentence from "../../../../src/languageProcessing/helpers/highlighting/getMarkingsInSentence";
import Mark from "../../../../src/values/Mark";

const testCases = [
	{
		testDescription: "No markings in sentence",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		matchesInSentence: [],
		useSpace: true,
		expectedResult: [],
	},
	{
		testDescription: "One marking in sentence",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		matchesInSentence: [ { sourceCodeRange: { startOffset: 0, endOffset: 4 } } ],
		useSpace: true,
		expectedResult: [ new Mark( {
			marked: "<yoastmark class='yoast-text-mark'>This</yoastmark> is a sentence.",
			original: "This is a sentence.",
			position: { endOffset: 4, startOffset: 0 },
		} ) ],
	},
	{
		testDescription: "One marking in sentence with two consecutive matches",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		matchesInSentence: [ { sourceCodeRange: { startOffset: 0, endOffset: 4 } }, { sourceCodeRange: { startOffset: 5, endOffset: 7 } } ],
		useSpace: true,
		expectedResult: [ new Mark( {
			marked: "<yoastmark class='yoast-text-mark'>This is</yoastmark> a sentence.",
			original: "This is a sentence.",
			position: { endOffset: 7, startOffset: 0 },
		} ) ],
	},
	{
		testDescription: "Two markings that are not consecutive in sentence",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		matchesInSentence: [ { sourceCodeRange: { startOffset: 0, endOffset: 4 } }, { sourceCodeRange: { startOffset: 10, endOffset: 18 } } ],
		useSpace: true,
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
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 10, endOffset: 38 } },
		matchesInSentence: [ { sourceCodeRange: { startOffset: 10, endOffset: 14 } } ],
		useSpace: true,
		expectedResult: [ new Mark( {
			marked: "<yoastmark class='yoast-text-mark'>This</yoastmark> is a sentence.",
			original: "This is a sentence.",
			position: { endOffset: 14, startOffset: 10 },
		} ) ],
	},
	{
		testDescription: "Two markings that overlap",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		matchesInSentence: [ { sourceCodeRange: { startOffset: 0, endOffset: 7 } }, { sourceCodeRange: { startOffset: 5, endOffset: 9 } } ],
		useSpace: true,
		expectedResult: [
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>This is a</yoastmark> sentence.",
				original: "This is a sentence.",
				position: { endOffset: 9, startOffset: 0 },
			} ),
		],
	},
	{
		testDescription: "Two markings that overlap in a sentence that doesn't use space",
		sentence: { text: "彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。", sourceCodeRange: { startOffset: 0, endOffset: 31 } },
		matchesInSentence: [ { sourceCodeRange: { startOffset: 12, endOffset: 13 } }, { sourceCodeRange: { startOffset: 13, endOffset: 16 } } ],
		useSpace: false,
		expectedResult: [
			new Mark( {
				marked: "彼女はオンラインストアで<yoastmark class='yoast-text-mark'>黒の長袖</yoastmark>マキシドレスを購入したかった。",
				original: "彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。",
				position: { endOffset: 16, startOffset: 12 },
			} ),
		],
	},
];

describe.each( testCases )( "a test for getting the marks from a sentence", ( {
	testDescription,
	sentence,
	matchesInSentence,
	useSpace,
	expectedResult } ) => {
	it( testDescription, () => {
		expect( getMarkingsInSentence( sentence, matchesInSentence, useSpace ) ).toEqual( expectedResult );
	} );
} );
