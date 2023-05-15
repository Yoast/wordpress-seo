import findKeyWordFormsInSentence from "../../../../src/languageProcessing/helpers/match/findKeyWordFormsInSentence";
import JapaneseCustomHelper from "../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";

/* eslint-disable max-len */
const testCases = [
	{
		testDescription: "No matches in sentence",
		sentence: {
			text: "A sentence with notthekeyphrase.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "notthekeyphrase", sourceCodeRange: { startOffset: 16, endOffset: 31 } },
				{ text: ".", sourceCodeRange: { startOffset: 31, endOffset: 32 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: { primaryMatches: [], secondaryMatches: [] },
	},
	{
		testDescription: "should return empty result if KeyphraseForms is empty",
		sentence: {
			text: "A sentence with notthekeyphrase.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "notthekeyphrase", sourceCodeRange: { startOffset: 16, endOffset: 31 } },
				{ text: ".", sourceCodeRange: { startOffset: 31, endOffset: 32 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 32 } },
		keyphraseForms: [ [] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: { primaryMatches: [], secondaryMatches: [] },

	},
	{
		testDescription: "One match in sentence of a single-word keyphrase",
		sentence: {
			text: "A sentence with the keyword.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "the", sourceCodeRange: { startOffset: 16, endOffset: 19 } },
				{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
				{ text: "keyword", sourceCodeRange: { startOffset: 20, endOffset: 27 } },
				{ text: ".", sourceCodeRange: { startOffset: 27, endOffset: 28 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 18 } },
		keyphraseForms: [ [ "keyword", "keywords" ] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: {
			primaryMatches: [ [ { sourceCodeRange: { startOffset: 20, endOffset: 27 }, text: "keyword" } ] ],
			secondaryMatches: [] },
	},
	{
		testDescription: "One match in sentence of a multi word keyphrase",
		sentence: {
			text: "A sentence with the key words.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "the", sourceCodeRange: { startOffset: 16, endOffset: 19 } },
				{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
				{ text: "key", sourceCodeRange: { startOffset: 20, endOffset: 23 } },
				{ text: " ", sourceCodeRange: { startOffset: 23, endOffset: 24 } },
				{ text: "words", sourceCodeRange: { startOffset: 24, endOffset: 29 } },
				{ text: ".", sourceCodeRange: { startOffset: 29, endOffset: 30 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 30 } },
		keyphraseForms: [ [ "key" ], [ "word", "words" ] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: {
			primaryMatches: [
				[ { sourceCodeRange: { endOffset: 23, startOffset: 20 }, text: "key" }, { sourceCodeRange: { endOffset: 29, startOffset: 24 }, text: "words" } ],
			],
			secondaryMatches: [] },
	},
	{
		testDescription: "Two matches of multi word keyphrase in sentence",
		sentence: {
			text: "A sentence with the key words and the key word.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "the", sourceCodeRange: { startOffset: 16, endOffset: 19 } },
				{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
				{ text: "key", sourceCodeRange: { startOffset: 20, endOffset: 23 } },
				{ text: " ", sourceCodeRange: { startOffset: 23, endOffset: 24 } },
				{ text: "words", sourceCodeRange: { startOffset: 24, endOffset: 29 } },
				{ text: " ", sourceCodeRange: { startOffset: 29, endOffset: 30 } },
				{ text: "and", sourceCodeRange: { startOffset: 30, endOffset: 33 } },
				{ text: " ", sourceCodeRange: { startOffset: 33, endOffset: 34 } },
				{ text: "the", sourceCodeRange: { startOffset: 34, endOffset: 37 } },
				{ text: " ", sourceCodeRange: { startOffset: 37, endOffset: 38 } },
				{ text: "key", sourceCodeRange: { startOffset: 38, endOffset: 41 } },
				{ text: " ", sourceCodeRange: { startOffset: 41, endOffset: 42 } },
				{ text: "word", sourceCodeRange: { startOffset: 42, endOffset: 46 } },
				{ text: ".", sourceCodeRange: { startOffset: 46, endOffset: 47 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 47 } },
		keyphraseForms: [ [ "key" ], [ "word", "words" ] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: {
			primaryMatches: [
				[ { sourceCodeRange: { endOffset: 23, startOffset: 20 }, text: "key" }, { sourceCodeRange: { endOffset: 29, startOffset: 24 }, text: "words" } ],
				[ { sourceCodeRange: { endOffset: 41, startOffset: 38 }, text: "key" }, { sourceCodeRange: { endOffset: 46, startOffset: 42 }, text: "word" } ],
			],
			secondaryMatches: [],
		},
	},
	{
		testDescription: "One primary and one secondary match of multi word keyphrase in sentence",
		sentence: {
			text: "A key sentence with a key word.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "key", sourceCodeRange: { startOffset: 2, endOffset: 5 } },
				{ text: " ", sourceCodeRange: { startOffset: 5, endOffset: 6 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 6, endOffset: 14 } },
				{ text: " ", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
				{ text: "with", sourceCodeRange: { startOffset: 15, endOffset: 19 } },
				{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
				{ text: "a", sourceCodeRange: { startOffset: 20, endOffset: 21 } },
				{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "key", sourceCodeRange: { startOffset: 22, endOffset: 25 } },
				{ text: " ", sourceCodeRange: { startOffset: 25, endOffset: 26 } },
				{ text: "word", sourceCodeRange: { startOffset: 26, endOffset: 30 } },
				{ text: ".", sourceCodeRange: { startOffset: 30, endOffset: 31 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 31 } },
		keyphraseForms: [ [ "key" ], [ "word", "words" ] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: {
			primaryMatches: [
				[ { sourceCodeRange: { startOffset: 22, endOffset: 25 }, text: "key" }, { sourceCodeRange: { startOffset: 26, endOffset: 30 }, text: "word" } ],
			],
			secondaryMatches:
				[ { sourceCodeRange: { startOffset: 2, endOffset: 5 }, text: "key" } ],
		},
	},
	{
		testDescription: "No match if a multi word keyphrase is separated with an underscore in the sentence and a secondary match.",
		sentence: {
			text: "A sentence with a key_word.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "key", sourceCodeRange: { startOffset: 18, endOffset: 21 } },
				{ text: "_", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "word", sourceCodeRange: { startOffset: 22, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		keyphraseForms: [ [ "key" ], [ "word", "words" ] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: {
			primaryMatches: [],
			secondaryMatches: [],
		},
	},
	{
		testDescription: "A secondary match if a multi word keyphrase is separated with an underscore in the sentence.",
		sentence: {
			text: "A key sentence with a key_word.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "key", sourceCodeRange: { startOffset: 2, endOffset: 5 } },
				{ text: " ", sourceCodeRange: { startOffset: 5, endOffset: 6 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 6, endOffset: 14 } },
				{ text: " ", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
				{ text: "with", sourceCodeRange: { startOffset: 15, endOffset: 19 } },
				{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
				{ text: "a", sourceCodeRange: { startOffset: 20, endOffset: 21 } },
				{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "key", sourceCodeRange: { startOffset: 22, endOffset: 25 } },
				{ text: "_", sourceCodeRange: { startOffset: 25, endOffset: 26 } },
				{ text: "word", sourceCodeRange: { startOffset: 26, endOffset: 30 } },
				{ text: ".", sourceCodeRange: { startOffset: 30, endOffset: 31 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 31 } },
		keyphraseForms: [ [ "key" ], [ "word", "words" ] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: {
			primaryMatches: [],
			secondaryMatches: [ { sourceCodeRange: { endOffset: 5, startOffset: 2 }, text: "key" } ],
		},
	},
	{
		testDescription: "If there is a secondary match, an empty result is returned.",
		sentence: {
			text: "A sentence with a key.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "key", sourceCodeRange: { startOffset: 18, endOffset: 21 } },
				{ text: ".", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 22 } },
		keyphraseForms: [ [ "key" ], [ "word", "words" ] ],
		locale: "en_US",
		matchWordCustomHelper: false,
		expectedResult: {
			primaryMatches: [],
			secondaryMatches: [],
		},
	},
	{
		testDescription: "Only a primary match in a language that uses a custom helper to match words.",
		sentence: {
			text: "私の猫はかわいいです。",
			tokens: [
				{ text: "私の猫はかわいいです。", sourceCodeRange: { startOffset: 0, endOffset: 12 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 12 } },
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		matchWordCustomHelper: JapaneseCustomHelper,
		expectedResult: {
			position: 0,
			primaryMatches: [ [
				{ sourceCodeRange: { startOffset: 2, endOffset: 3 }, text: "猫" },
				{ sourceCodeRange: { startOffset: 4, endOffset: 8 }, text: "かわいい" },
			] ],
			secondaryMatches: [],
		},
	},
	{
		testDescription: "A primary and secondary match in a language that uses a custom helper to match words.",
		sentence: {
			text: "私の猫はかわいいですかわいい。",
			tokens: [
				{ text: "私の猫はかわいいですかわいい。", sourceCodeRange: { startOffset: 0, endOffset: 15 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 15 } },
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		matchWordCustomHelper: JapaneseCustomHelper,
		expectedResult: {
			position: 0,
			primaryMatches: [ [
				{ sourceCodeRange: { startOffset: 2, endOffset: 3 }, text: "猫" },
				{ sourceCodeRange: { startOffset: 4, endOffset: 8 }, text: "かわいい" } ] ],
			secondaryMatches: [ [
				{ sourceCodeRange: { startOffset: 10, endOffset: 14 }, text: "かわいい" } ] ],
		},
	},
	{
		testDescription: "Only secondary matches in a language that uses a custom helper to match words.",
		sentence: {
			text: "私のはかわいいですかわいい。",
			tokens: [
				{ text: "私のはかわいいですかわいい。", sourceCodeRange: { startOffset: 0, endOffset: 14 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 14 } },
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		matchWordCustomHelper: JapaneseCustomHelper,
		expectedResult: {
			position: -1,
			primaryMatches: [],
			secondaryMatches: [],
		},
	},
	{
		testDescription: "A primary match and a secondary match that is in front of the primary match in a language that uses a custom helper to match words.",
		sentence: {
			text: "私猫の猫はかわいいです。iiii",
			tokens: [
				{ text: "私猫の猫はかわいいです。", sourceCodeRange: { startOffset: 0, endOffset: 12 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 12 } },
		keyphraseForms: [ [ "猫" ], [ "かわいい" ] ],
		locale: "ja",
		matchWordCustomHelper: JapaneseCustomHelper,
		expectedResult: {
			position: 0,
			primaryMatches: [ [
				{ sourceCodeRange: { startOffset: 3, endOffset: 4 }, text: "猫" },
				{ sourceCodeRange: { startOffset: 5, endOffset: 9 }, text: "かわいい" } ] ],
			secondaryMatches: [ [
				{ sourceCodeRange: { startOffset: 1, endOffset: 2 }, text: "猫" } ] ],
		},
	},


	// {
	// 	testDescription: "One marking in sentence with two consecutive matches",
	// },
	// {
	// 	testDescription: "Two markings that are not consecutive in sentence",
	// },
	// {
	// 	testDescription: "One marking in a sentence that has a non-zero startOffset",
	// },
	// {
	// 	testDescription: "One primary and one secondary marking in a sentence",
	// },
	// {
	// 	testDescription: "One primary and two secondary markings in a sentence",
	// },
	// {
	// 	testDescription: "One marking in a sentence in a language that does not have spaces between words",
	// },
	// {
	// 	testDescription: "One marking in a sentence in a language that does not have spaces between words with two consecutive matches",
	// },
	// {
	// 	testDescription: "Two markings that are not consecutive in a sentence in a language that does not have spaces between words",
	// },
];
// eslint-enable max-len

// eslint-disable-next-line max-len
describe.each( testCases )( "findKeyWordFormsInSentence", ( { testDescription, sentence, keyphraseForms, locale, matchWordCustomHelper, expectedResult } ) => {
	it( testDescription, () => {
		expect( findKeyWordFormsInSentence( sentence, keyphraseForms, locale, matchWordCustomHelper ) ).toEqual( expectedResult );
	} );
} );
