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

describe( "a test for getting the marks from a sentence with merged list items", () => {
	it( "correctly returns the marking of a keyphrase match in the merged list items", () => {
		const sentence = { text: "This is the first sentence This is a second sentence with keyphrase.",
			sourceCodeRange: { startOffset: 300, endOffset: 389 },
			tokens: [
				{ text: "This", sourceCodeRange: { startOffset: 300, endOffset: 314 } },
				{ text: " ", sourceCodeRange: { startOffset: 314, endOffset: 315 } },
				{ text: "is", sourceCodeRange: { startOffset: 315, endOffset: 317 } },
				{ text: " ", sourceCodeRange: { startOffset: 317, endOffset: 318 } },
				{ text: "the", sourceCodeRange: { startOffset: 318, endOffset: 321 } },
				{ text: " ", sourceCodeRange: { startOffset: 321, endOffset: 322 } },
				{ text: "first", sourceCodeRange: { startOffset: 322, endOffset: 327 } },
				{ text: " ", sourceCodeRange: { startOffset: 327, endOffset: 328 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 328, endOffset: 336 } },
				{ text: "This", sourceCodeRange: { startOffset: 345, endOffset: 350 } },
				{ text: " ", sourceCodeRange: { startOffset: 350, endOffset: 351 } },
				{ text: "is", sourceCodeRange: { startOffset: 351, endOffset: 353 } },
				{ text: " ", sourceCodeRange: { startOffset: 353, endOffset: 354 } },
				{ text: "a", sourceCodeRange: { startOffset: 354, endOffset: 355 } },
				{ text: " ", sourceCodeRange: { startOffset: 355, endOffset: 356 } },
				{ text: "second", sourceCodeRange: { startOffset: 356, endOffset: 362 } },
				{ text: " ", sourceCodeRange: { startOffset: 362, endOffset: 363 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 363, endOffset: 371 } },
				{ text: " ", sourceCodeRange: { startOffset: 371, endOffset: 372 } },
				{ text: "with", sourceCodeRange: { startOffset: 372, endOffset: 376 } },
				{ text: " ", sourceCodeRange: { startOffset: 376, endOffset: 377 } },
				{ text: "keyphrase", sourceCodeRange: { startOffset: 377, endOffset: 386 } },
				{ text: ".", sourceCodeRange: { startOffset: 386, endOffset: 387 } },
			],
			sentenceParentNode: [
				{
					sourceCodeLocation: {
						startOffset: 296,
						endOffset: 341,
						startTag: { startOffset: 296, endOffset: 300 },
						endTag: { startOffset: 337, endOffset: 341 },
					},
					clientId: "firstmergedlistitemid12345678901234567",
				},
				{
					sourceCodeLocation: {
						startOffset: 341,
						endOffset: 392,
						startTag: { startOffset: 337, endOffset: 341 },
						endTag: { startOffset: 388, endOffset: 392 },
					},
					clientId: "secondmergedlistitemid1234567890123456",
				},
			],
			parentAttributeId: "",
			isParentFirstSectionOfBlock: false,
			parentStartOffset: null,
			parentClientId: null,
		};
		const matchesInSentence = [ { sourceCodeRange: { startOffset: 377, endOffset: 386 } } ];
		const expectedResult = [ new Mark( {
			marked: "This is the first sentenceThis is a second sentence with <yoastmark class='yoast-text-mark'>keyphrase</yoastmark>.",
			original: "This is the first sentence This is a second sentence with keyphrase.",
			position: {
				startOffset: 377,
				endOffset: 386,
				startOffsetBlock: 36,
				endOffsetBlock: 45,
				attributeId: "",
				clientId: "secondmergedlistitemid1234567890123456",
				isFirstSection: false,
			},
		} ) ];

		expect( getMarkingsInSentence( sentence, matchesInSentence, true ) ).toEqual( expectedResult );
	} );
	it( "correctly returns the marking when the keyphrase match is not the merged list items", () => {
		// The parent node is now just a single node representing a paragraph.
		const sentence = { text: "This is the first sentence with keyphrase.",
			sourceCodeRange: { startOffset: 300, endOffset: 352 },
			tokens: [
				{ text: "This", sourceCodeRange: { startOffset: 300, endOffset: 314 } },
				{ text: " ", sourceCodeRange: { startOffset: 314, endOffset: 315 } },
				{ text: "is", sourceCodeRange: { startOffset: 315, endOffset: 317 } },
				{ text: " ", sourceCodeRange: { startOffset: 317, endOffset: 318 } },
				{ text: "the", sourceCodeRange: { startOffset: 318, endOffset: 321 } },
				{ text: " ", sourceCodeRange: { startOffset: 321, endOffset: 322 } },
				{ text: "first", sourceCodeRange: { startOffset: 322, endOffset: 327 } },
				{ text: " ", sourceCodeRange: { startOffset: 327, endOffset: 328 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 328, endOffset: 336 } },
				{ text: " ", sourceCodeRange: { startOffset: 336, endOffset: 337 } },
				{ text: "with", sourceCodeRange: { startOffset: 337, endOffset: 341 } },
				{ text: " ", sourceCodeRange: { startOffset: 341, endOffset: 342 } },
				{ text: "keyphrase", sourceCodeRange: { startOffset: 342, endOffset: 351 } },
				{ text: ".", sourceCodeRange: { startOffset: 351, endOffset: 352 } },
			],
			sentenceParentNode: {
				sourceCodeLocation: {
					startOffset: 300,
					endOffset: 352,
					startTag: { startOffset: 296, endOffset: 300 },
					endTag: { startOffset: 352, endOffset: 357 },
				},
			},
			parentAttributeId: "",
			isParentFirstSectionOfBlock: false,
			parentStartOffset: 300,
			parentClientId: null,
		};
		const matchesInSentence = [ { sourceCodeRange: { startOffset: 342, endOffset: 351 } } ];
		const expectedResult = [ new Mark( {
			marked: "This is the first sentence with <yoastmark class='yoast-text-mark'>keyphrase</yoastmark>.",
			original: "This is the first sentence with keyphrase.",
			position: {
				startOffset: 342,
				endOffset: 351,
				startOffsetBlock: 42,
				endOffsetBlock: 51,
				attributeId: "",
				clientId: "",
				isFirstSection: false,
			},
		} ) ];

		expect( getMarkingsInSentence( sentence, matchesInSentence, true ) ).toEqual( expectedResult );
	} );
} );
