import getMarkingsInSentence from "../../../../src/languageProcessing/helpers/highlighting/getMarkingsInSentence";
import Mark from "../../../../src/values/Mark";

const testCases = [
	{
		testDescription: "No markings in sentence",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		matchesInSentence: [],
		locale: "en_US",
		expectedResult: [],
	},
	{
		testDescription: "One marking in sentence",
		sentence: { text: "This is a sentence.", sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		matchesInSentence: [ { sourceCodeRange: { startOffset: 0, endOffset: 4 } } ],
		locale: "en_US",
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
		locale: "en_US",
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
		locale: "en_US",
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
		locale: "en_US",
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
		locale: "en_US",
		expectedResult: [
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>This is a</yoastmark> sentence.",
				original: "This is a sentence.",
				position: { endOffset: 9, startOffset: 0 },
			} ),
		],
	},
];

describe.each( testCases )( "a test for getting the marks from a sentence", ( {
	testDescription,
	sentence,
	matchesInSentence,
	locale,
	expectedResult } ) => {
	it( testDescription, () => {
		expect( getMarkingsInSentence( sentence, matchesInSentence, locale ) ).toEqual( expectedResult );
	} );
} );
