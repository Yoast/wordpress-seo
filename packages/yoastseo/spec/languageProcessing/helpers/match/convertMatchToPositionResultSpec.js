import convertMatchToPositionResult from "../../../../src/languageProcessing/helpers/match/convertMatchToPositionResult";

/* eslint-disable max-len */
const testCases = [
	{
		testDescription: "No matches",
		matches: [],
		sentence: {
			text: "私の猫はかわいいです。",
			tokens: [
				{
					text: "私の猫はかわいいです。",
					sourceCodeRange: { startOffset: 0, endOffset: 12 },
				},
			],
			sourceCodeRange: { startOffset: 0,	endOffset: 12 },
		},
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		expected: {
			primaryMatches: [],
			secondaryMatches: [],
			position: 0,
		},
	},
	{
		testDescription: "Only a primary match consisting of a single token",
		matches:
			[
				{	matches: [ "猫" ] },
			],
		sentence: {
			text: "私の猫はかわいいです。",
			tokens: [
				{
					text: "私の猫はかわいいです。",
					sourceCodeRange: { startOffset: 0, endOffset: 12 },
				},
			],
			sourceCodeRange: { startOffset: 0, endOffset: 12 },
		},
		keyphraseForms: [ [ "猫" ] ],
		locale: "ja",
		expected: {
			primaryMatches: [ [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 2, endOffset: 3 },
				},
			] ],
			secondaryMatches: [],
			position: 0,
		},
	},
	{
		testDescription: "A primary match and a single secondary match",
		matches:
			[
				{	 matches: [ "猫" ] },
				{	 matches: [ "かわいい" ] },
			],
		sentence: {
			text: "私の猫はかわいいですかわいい。",
			tokens: [
				{
					text: "私の猫はかわいいですかわいい。",
					sourceCodeRange: { startOffset: 0, endOffset: 15 },
				},
			],
			sourceCodeRange: { startOffset: 0, endOffset: 15 },
		},
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		expected: {
			primaryMatches: [ [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 2, endOffset: 3 },
				},
				{
					text: "かわいい",
					sourceCodeRange: { startOffset: 4, endOffset: 8 },
				},
			] ],
			secondaryMatches: [ [
				{
					text: "かわいい",
					sourceCodeRange: {
						startOffset: 10, endOffset: 14 },
				},
			] ],
			position: 0,
		},
	},
	{
		testDescription: "Only a primary match consisting of multiple tokens",
		matches:
			[
				{	matches: [ "猫" ] },
				{	 matches: [ "かわいい" ] },
			],
		sentence: {
			text: "私の猫はかわいいです。",
			tokens: [
				{
					text: "私の猫はかわいいです。",
					sourceCodeRange: { startOffset: 0, endOffset: 12 },
				},
			],
			sourceCodeRange: { startOffset: 0,	endOffset: 12 },
		},
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		expected: {
			primaryMatches: [ [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 2, endOffset: 3 },
				},
				{
					text: "かわいい",
					sourceCodeRange: { startOffset: 4, endOffset: 8 },
				},
			] ],
			secondaryMatches: [],
			position: 0,
		},
	},
	{
		testDescription: "A primary match and and a secondary match that is in front of the primary match",
		matches:
			[
				{
					matches: [
						"猫",
					],
				},
				{
					matches: [
						"かわいい",
					],
				},
			],
		sentence: {
			text: "私猫の猫はかわいいです。",
			tokens: [
				{
					text: "私猫の猫はかわいいです。",
					sourceCodeRange: { startOffset: 0, endOffset: 12 },
				},
			],
			sourceCodeRange: { startOffset: 0, endOffset: 12 },
		},
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		expected: {
			primaryMatches: [ [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 3, endOffset: 4 },
				},
				{
					text: "かわいい",
					sourceCodeRange: { startOffset: 5, endOffset: 9 },

				},
			] ],
			secondaryMatches: [ [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 1, endOffset: 2 },
				},
			] ],
			position: 0,
		},
	},
	{
		testDescription: "Multiple primary matches",
		matches:
			[
				{
					matches: [
						"猫",
					],
				},
				{
					matches: [
						"かわいい",
					],
				},
			],
		sentence: {
			text: "私猫のはかわいいで猫かわいいす。",
			tokens: [
				{
					text: "私猫のはかわいいで猫かわいいす。",
					sourceCodeRange: { startOffset: 0, endOffset: 16 },
				},
			],
			sourceCodeRange: { startOffset: 0, endOffset: 16 },
		},
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		expected: {
			primaryMatches: [ [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 1, endOffset: 2 },
				},
				{
					text: "かわいい",
					sourceCodeRange: { startOffset: 4, endOffset: 8 },

				},
			], [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 9, endOffset: 10 },
				},
				{
					text: "かわいい",
					sourceCodeRange: { startOffset: 10, endOffset: 14 },
				},
			] ],
			secondaryMatches: [ ],
			position: 0,
		},
	},
	{
		testDescription: "A single primary match and a seconary match that is in front of the primary match and a secondary match that is after the primary match",
		matches:
			[
				{ matches: [ "猫" ] },
				{ matches: [ "かわいい" ] },
			],
		sentence: {
			text: "私猫の猫はかわいいでかわいいす。",
			tokens: [
				{
					text: "私猫の猫はかわいいでかわいいす。",
					sourceCodeRange: { startOffset: 0, endOffset: 16 },
				},
			],
			sourceCodeRange: { startOffset: 0, endOffset: 16 },
		},
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		expected: {
			primaryMatches: [ [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 3, endOffset: 4 },
				},
				{
					text: "かわいい",
					sourceCodeRange: { startOffset: 5, endOffset: 9 },

				},
			] ],
			secondaryMatches: [ [
				{
					text: "猫",
					sourceCodeRange: { startOffset: 1, endOffset: 2 },
				} ],
			[ {
				text: "かわいい",
				sourceCodeRange: { startOffset: 10, endOffset: 14 },

			},
			] ],
			position: 0,
		},
	},
];
/* eslint-enable max-len */

describe.each( testCases )( "convertMatchToPositionResult", (
	{ testDescription, matches, sentence, keyphraseForms, locale, expected } ) => {
	it( testDescription, () => {
		expect( convertMatchToPositionResult( matches, sentence, keyphraseForms, locale ) ).toEqual( expected );
	} );
} );
