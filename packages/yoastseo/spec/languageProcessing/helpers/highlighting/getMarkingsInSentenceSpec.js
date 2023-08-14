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
			position: {
				startOffset: 0,
				endOffset: 4,
				startOffsetBlock: 0,
				endOffsetBlock: 4,
				attributeId: "",
				clientId: "",
				isFirstSection: false,
			},
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
			position: {
				startOffset: 0,
				endOffset: 7,
				startOffsetBlock: 0,
				endOffsetBlock: 7,
				attributeId: "",
				clientId: "",
				isFirstSection: false,
			},
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
				position: {
					startOffset: 0,
					endOffset: 4,
					startOffsetBlock: 0,
					endOffsetBlock: 4,
					attributeId: "",
					clientId: "",
					isFirstSection: false,
				},
			} ),
			new Mark( {
				marked: "<yoastmark class='yoast-text-mark'>This</yoastmark> is a <yoastmark class='yoast-text-mark'>sentence</yoastmark>.",
				original: "This is a sentence.",
				position: {
					startOffset: 10,
					endOffset: 18,
					startOffsetBlock: 10,
					endOffsetBlock: 18,
					attributeId: "",
					clientId: "",
					isFirstSection: false,
				},
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
			position: {
				startOffset: 10,
				endOffset: 14,
				startOffsetBlock: 10,
				endOffsetBlock: 14,
				attributeId: "",
				clientId: "",
				isFirstSection: false,
			},
		} ) ],
	},
	{
		testDescription: "One marking in a sentence that is found in a WordPress block",
		sentence: { text: "This is a sentence.",
			sourceCodeRange: { startOffset: 300, endOffset: 329 },
			tokens: [
				{ text: "This", sourceCodeRange: { startOffset: 300, endOffset: 314 } },
				{ text: " ", sourceCodeRange: { startOffset: 314, endOffset: 315 } },
				{ text: "is", sourceCodeRange: { startOffset: 315, endOffset: 317 } },
				{ text: " ", sourceCodeRange: { startOffset: 317, endOffset: 318 } },
				{ text: "a", sourceCodeRange: { startOffset: 318, endOffset: 319 } },
				{ text: " ", sourceCodeRange: { startOffset: 319, endOffset: 320 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 320, endOffset: 328 } },
				{ text: ".", sourceCodeRange: { startOffset: 328, endOffset: 329 } },
			],
			parentStartOffset: 100,
			parentClientId: "aaaparentid12345678901234567890",
			parentAttributeId: "apparentattributeid12345678901234567",
			isParentFirstSectionOfBlock: true,
		},
		matchesInSentence: [ { sourceCodeRange: { startOffset: 300, endOffset: 314 } } ],
		expectedResult: [ new Mark( {
			marked: "<yoastmark class='yoast-text-mark'>This</yoastmark> is a sentence.",
			original: "This is a sentence.",
			position: {
				startOffset: 300,
				endOffset: 314,
				startOffsetBlock: 200,
				endOffsetBlock: 214,
				attributeId: "apparentattributeid12345678901234567",
				clientId: "aaaparentid12345678901234567890",
				isFirstSection: true,
			},
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
