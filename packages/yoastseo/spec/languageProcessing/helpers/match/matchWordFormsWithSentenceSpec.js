import customWordMatchingHelperJapanese from "../../../../src/languageProcessing/languages/ja/helpers/matchTextWithWord";
import matchWordFormsWithSentence from "../../../../src/languageProcessing/helpers/match/matchWordFormsWithSentence";
import customSplitIntoTokensIndonesian from "../../../../src/languageProcessing/languages/id/helpers/splitIntoTokensCustom";


const testCases = [
	{
		testDescription: "returns no match when no word form is found the sentence",
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
		wordForms: [ "keyword", "keywords" ],
		expectedResult: { count: 0, matches: [] },
	},
	{
		testDescription: "returns no match when no word forms are available for matching",
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
		wordForms: [],
		expectedResult: { count: 0, matches: [] },
	},
	{
		testDescription: "returns one match whe the same word form is found in the sentence",
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
			sourceCodeRange: { startOffset: 0, endOffset: 28 } },
		wordForms: [ "keyword", "keywords" ],
		expectedResult: { count: 1, matches: [ { sourceCodeRange: { startOffset: 20, endOffset: 27 }, text: "keyword" } ] },
	},
	{
		testDescription: "returns matches for all word forms if all forms are found in the sentence",
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
		wordForms: [ "word", "words" ],
		expectedResult: {
			count: 2,
			matches: [
				{ sourceCodeRange: { endOffset: 46, startOffset: 42 }, text: "word" },
				{ sourceCodeRange: { endOffset: 29, startOffset: 24 }, text: "words" },
			],
		},
	},
	{
		testDescription: "returns a match of 'key' in 'key-word'",
		sentence: {
			text: "A sentence with a key-word.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "key-word", sourceCodeRange: { startOffset: 18, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "key", "keys" ],
		expectedResult: { count: 1, matches: [ { sourceCodeRange: { endOffset: 26, startOffset: 18 }, text: "key-word" } ] },
	},
	{
		testDescription: "returns a match for word form separated by an underscore",
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
				{ text: "key_word", sourceCodeRange: { startOffset: 18, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "key_word", "key_words" ],
		expectedResult: { count: 1,
			matches: [
				{ sourceCodeRange: { endOffset: 26, startOffset: 18 }, text: "key_word" },
			] },
	},
	{
		testDescription: "returns a match for word form occurrence regardless of capitalization",
		sentence: {
			text: "A sentence with a KEY WORD.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "KEY", sourceCodeRange: { startOffset: 18, endOffset: 21 } },
				{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "WORD", sourceCodeRange: { startOffset: 22, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "word", "words" ],
		expectedResult: { count: 1, matches: [
			{ sourceCodeRange: { endOffset: 26, startOffset: 22 }, text: "WORD" },
		] },
	},
	{
		testDescription: "correctly matches if the form is the last word in the sentence.",
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
		wordForms: [ "key" ],
		expectedResult: { count: 1, matches: [ { sourceCodeRange: { endOffset: 21, startOffset: 18 }, text: "key" } ] },
	},
	{
		testDescription: "returns a match if the keyphrase in the text ends with an underscore.",
		sentence: {
			text: "A sentence with a key_",
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
			],
			sourceCodeRange: { startOffset: 0, endOffset: 22 } },
		wordForms: [ "key", "keys" ],
		expectedResult: { count: 1, matches: [ { sourceCodeRange: { startOffset: 18, endOffset: 21 }, text: "key" } ] },
	},
	{
		testDescription: "returns a match if the keyphrase in the text ends with a dash.",
		sentence: {
			text: "A sentence with a key-",
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
				{ text: "-", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 22 } },
		wordForms: [ "key" ],
		expectedResult: { count: 1, matches: [ { sourceCodeRange: { startOffset: 18, endOffset: 21 }, text: "key" } ] },
	},
	{
		testDescription: "matches the occurrence in the sentence which is immediately followed by an exclamation mark",
		sentence: {
			text: "A sentence with a key!",
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
				{ text: "!", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 22 } },
		wordForms: [ "key" ],
		expectedResult: { count: 1, matches: [ { sourceCodeRange: { startOffset: 18, endOffset: 21 }, text: "key" } ] },
	},
	{
		testDescription: "Matches a keyphrase with an apostrophe.",
		sentence: {
			text: "All the keyphrase's forms should be matched.",
			tokens: [
				{ text: "All", sourceCodeRange: { startOffset: 0, endOffset: 3 } },
				{ text: " ", sourceCodeRange: { startOffset: 3, endOffset: 4 } },
				{ text: "the", sourceCodeRange: { startOffset: 4, endOffset: 7 } },
				{ text: " ", sourceCodeRange: { startOffset: 7, endOffset: 8 } },
				{ text: "keyphrase's", sourceCodeRange: { startOffset: 8, endOffset: 19 } },
				{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
				{ text: "forms", sourceCodeRange: { startOffset: 20, endOffset: 25 } },
				{ text: " ", sourceCodeRange: { startOffset: 25, endOffset: 26 } },
				{ text: "should", sourceCodeRange: { startOffset: 26, endOffset: 32 } },
				{ text: " ", sourceCodeRange: { startOffset: 32, endOffset: 33 } },
				{ text: "be", sourceCodeRange: { startOffset: 34, endOffset: 36 } },
				{ text: " ", sourceCodeRange: { startOffset: 36, endOffset: 37 } },
				{ text: "matched", sourceCodeRange: { startOffset: 37, endOffset: 44 } },
				{ text: ".", sourceCodeRange: { startOffset: 44, endOffset: 45 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 45 } },
		wordForms: [ "keyphrase", "keyphrases", "keyphrase's" ],
		expectedResult: { count: 1, matches: [
			{ text: "keyphrase's", sourceCodeRange: { startOffset: 8, endOffset: 19 } },
		] },
	},
];

describe.each( testCases )( "find word forms in sentence in English: non-exact matching", ( {
	testDescription,
	sentence,
	wordForms,
	expectedResult,
} ) => {
	const locale = "en_US";
	it( testDescription, () => {
		expect( matchWordFormsWithSentence( sentence, wordForms, locale, false, false, false ) ).toEqual( expectedResult );
	} );
} );

const exactMatchingTestCases = [
	{
		testDescription: "with exact matching, a single word keyphrase should match with a single word.",
		sentence: {
			text: "A sentence with a keyphrase.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "keyphrase", sourceCodeRange: { startOffset: 18, endOffset: 27 } },
				{ text: ".", sourceCodeRange: { startOffset: 27, endOffset: 28 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 28 } },
		wordForms: [ "keyphrase" ],
		expectedResult: { count: 1, matches: [
			{ text: "keyphrase", sourceCodeRange: { startOffset: 18, endOffset: 27 } },
		] },
	},
	{
		testDescription: "with exact matching, a singular single word keyphrase should not match with the plural form in the text.",
		sentence: {
			text: "A sentence with keyphrases.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "keyphrases", sourceCodeRange: { startOffset: 16, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "keyphrase" ],
		expectedResult: { count: 0, matches: [] },
	},
	{
		testDescription: "with exact matching, a plural word keyphrase should not match wih a singular form in the text.",
		sentence: {
			text: "A sentence with a keyphrase.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "keyphrase", sourceCodeRange: { startOffset: 18, endOffset: 27 } },
				{ text: ".", sourceCodeRange: { startOffset: 27, endOffset: 28 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 28 } },
		wordForms: [ "keyphrases" ],
		expectedResult: { count: 0, matches: [] },
	},
	{
		testDescription: "with exact matching, a multi word keyphrase should match the same multi word phrase in the text.",
		sentence: {
			text: "A sentence with a key phrase.",
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
				{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "phrase", sourceCodeRange: { startOffset: 22, endOffset: 28 } },
				{ text: ".", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 29 } },
		wordForms: [ "key phrase" ],
		expectedResult: { count: 1, matches: [
			{ text: "key", sourceCodeRange: { startOffset: 18, endOffset: 21 } },
			{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
			{ text: "phrase", sourceCodeRange: { startOffset: 22, endOffset: 28 } },
		] },
	},
	{
		testDescription: "with exact matching, a multi word keyphrase should not match a multi word phrase if it is in a different order.",
		sentence: {
			text: "A sentence with a phrase key.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "phrase", sourceCodeRange: { startOffset: 18, endOffset: 24 } },
				{ text: " ", sourceCodeRange: { startOffset: 24, endOffset: 25 } },
				{ text: "key", sourceCodeRange: { startOffset: 25, endOffset: 28 } },
				{ text: ".", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 29 } },
		wordForms: [ "key phrase" ],
		expectedResult: { count: 0, matches: [] },
	},
	{
		testDescription: "with exact matching, a the matching should be insensitive to case.",
		sentence: {
			text: "A sentence with a KeYphRaSe.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "KeYphRaSe", sourceCodeRange: { startOffset: 18, endOffset: 28 } },
				{ text: ".", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 29 } },
		wordForms: [ "keyphrase" ],
		expectedResult: { count: 1, matches: [
			{ text: "KeYphRaSe", sourceCodeRange: { startOffset: 18, endOffset: 28 } },
		] },
	},
	{
		testDescription: "with exact matching, it should match a full stop if it is part of the keyphrase and directly precedes the keyphrase.",
		sentence: {
			text: "A .sentence with a keyphrase.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: ".", sourceCodeRange: { startOffset: 2, endOffset: 3 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 3, endOffset: 11 } },
				{ text: " ", sourceCodeRange: { startOffset: 11, endOffset: 12 } },
				{ text: "with", sourceCodeRange: { startOffset: 12, endOffset: 16 } },
				{ text: " ", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: "a", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: " ", sourceCodeRange: { startOffset: 18, endOffset: 19 } },
				{ text: "keyphrase", sourceCodeRange: { startOffset: 19, endOffset: 28 } },
				{ text: ".", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 29 } },
		wordForms: [ ".sentence" ],
		expectedResult: { count: 1, matches: [
			{ text: ".", sourceCodeRange: { startOffset: 2, endOffset: 3 } },
			{ text: "sentence", sourceCodeRange: { startOffset: 3, endOffset: 11 } },
		] },
	},
	{
		testDescription: "with exact matching, it should match a full stop if it is part of the keyphrase and directly follows the keyphrase.",
		sentence: {
			text: "A sentence with a keyphrase.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "keyphrase", sourceCodeRange: { startOffset: 18, endOffset: 27 } },
				{ text: ".", sourceCodeRange: { startOffset: 27, endOffset: 28 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 28 } },
		wordForms: [ "keyphrase." ],
		expectedResult: { count: 1, matches: [
			{ text: "keyphrase", sourceCodeRange: { startOffset: 18, endOffset: 27 } },
			{ text: ".", sourceCodeRange: { startOffset: 27, endOffset: 28 } },
		] },
	},
	{
		testDescription: "with exact matching, it should match a full stop if it is part of the keyphrase and is not surrounded by spaces.",
		sentence: {
			text: "A sentence with a key.phrase.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "key.phrase", sourceCodeRange: { startOffset: 18, endOffset: 28 } },
				{ text: ".", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 29 } },
		wordForms: [ "key.phrase" ],
		expectedResult: { count: 1, matches: [
			{ text: "key.phrase", sourceCodeRange: { startOffset: 18, endOffset: 28 } },
		] },
	},
	{
		testDescription: "matches a keyphrase with a dash when the keyphrase occurs with a dash in the text",
		sentence: {
			text: "A sentence with a key-word.",
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
				{ text: "-", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "word", sourceCodeRange: { startOffset: 22, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "key-word" ],
		expectedResult: {
			count: 1,
			matches: [ { sourceCodeRange: { endOffset: 21, startOffset: 18 }, text: "key" },
				{ sourceCodeRange: { endOffset: 22, startOffset: 21 }, text: "-" },
				{ sourceCodeRange: { endOffset: 26, startOffset: 22 }, text: "word" } ] },
	},
	{
		testDescription: "does not match keyphrase with a dash when the keyphrase occurs without a dash in the text",
		sentence: {
			text: "A sentence with a key word.",
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
				{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "word", sourceCodeRange: { startOffset: 22, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "key-word" ],
		expectedResult: { count: 0, matches: [] },
	},
];

describe.each( exactMatchingTestCases )( "find keyphrase forms in sentence when exact matching is requested", ( {
	testDescription,
	sentence,
	wordForms,
	expectedResult,
} ) => {
	const locale = "en_US";
	it( testDescription, () => {
		expect( matchWordFormsWithSentence( sentence, wordForms, locale, false, true, false  ) ).toEqual( expectedResult );
	} );
} );


const japaneseTestCases = [
	{
		testDescription: "matches one occurrence of word form in the sentence",
		sentence: "私の猫はかわいいです。",
		wordForms: [ "猫" ],
		expectedResult: { count: 1, matches: [ "猫" ] },
	},
	{
		testDescription: "matches all occurrences of two word forms in the sentence",
		sentence: "昨日会った猫はちょうかわいかった、今日も会いたい。",
		wordForms: [ "会っ", "会い" ],
		expectedResult: { count: 2, matches: [ "会っ", "会い" ] },
	},
	{
		testDescription: "matches all occurrences of one word form in the sentence",
		sentence: "これによって少しでも夏休み明けの感染者数を抑えたいという事だけど、どうなるかな,感染者数が実際に増えるのか減るのかは知らない。",
		wordForms: [ "感染" ],
		expectedResult: { count: 2, matches: [ "感染", "感染" ] },
	},
];
describe.each( japaneseTestCases )( "test for matching word forms for Japanese: non-exact matching", ( {
	testDescription,
	sentence,
	wordForms,
	expectedResult,
} ) => {
	it( testDescription, () => {
		const locale = "ja";
		expect( matchWordFormsWithSentence( sentence, wordForms, locale, customWordMatchingHelperJapanese, false, true ) ).toEqual( expectedResult );
	} );
} );

const exactMatchJapaneseData = [
	{
		testDescription: "matches only the exact form of the word forms in the sentence with the same word order",
		sentence: "一日一冊の本を読むのはできるかどうかやってみます。",
		wordForms: [ "『一冊の本を読む』" ],
		expectedResult: { count: 1, matches: [ "一冊の本を読む" ] },
	},
	{
		testDescription: "doesn't match the occurrence of the word forms in the sentence with different word order",
		sentence: "一日一冊の面白い本を買って読んでるのはできるかどうかやってみます。",
		wordForms: [ "『一冊の本を読む』" ],
		expectedResult: { count: 0, matches: [] },
	},
];
describe.each( exactMatchJapaneseData )( "test for matching word forms for Japanese: exact matching", ( {
	testDescription,
	sentence,
	wordForms,
	expectedResult,
} ) => {
	it( testDescription, () => {
		const locale = "ja";
		expect( matchWordFormsWithSentence( sentence, wordForms, locale, customWordMatchingHelperJapanese, true, true ) ).toEqual( expectedResult );
	} );
} );

const exactMatchIndonesianData = [
	{
		testDescription: "matches a keyphrase with a dash when the keyphrase occurs with a dash in the text",
		sentence: {
			text: "A sentence with a key-word.",
			tokens: [
				{ text: "A", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
				{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
				{ text: "sentence", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
				{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
				{ text: "with", sourceCodeRange: { startOffset: 11, endOffset: 15 } },
				{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
				{ text: "a", sourceCodeRange: { startOffset: 16, endOffset: 17 } },
				{ text: " ", sourceCodeRange: { startOffset: 17, endOffset: 18 } },
				{ text: "key-word", sourceCodeRange: { startOffset: 18, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "key-word" ],
		expectedResult: {
			count: 1,
			matches: [ { sourceCodeRange: { endOffset: 26, startOffset: 18 }, text: "key-word" } ],
		},
	},
	{
		testDescription: "doesn't match a keyphrase occurrence without a hyphen if the keyphrase contains a hyphen",
		sentence: {
			text: "A sentence with a key word.",
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
				{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "word", sourceCodeRange: { startOffset: 22, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "key-word" ],
		expectedResult: {
			count: 0,
			matches: [],
		},
	},
	{
		testDescription: "doesn't match a keyphrase occurrence that uses a different type of hyphen/dash than the one in the keyphrase",
		sentence: {
			text: "A sentence with a key—word.",
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
				{ text: "-", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
				{ text: "word", sourceCodeRange: { startOffset: 22, endOffset: 26 } },
				{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
			],
			sourceCodeRange: { startOffset: 0, endOffset: 27 } },
		wordForms: [ "key—word" ],
		expectedResult: {
			count: 0,
			matches: [],
		},
	},
];
describe.each( exactMatchIndonesianData )( "test for matching word forms for Indonesian: exact matching", ( {
	testDescription,
	sentence,
	wordForms,
	expectedResult,
} ) => {
	it( testDescription, () => {
		const locale = "id";
		expect( matchWordFormsWithSentence( sentence, wordForms, locale, false, true, customSplitIntoTokensIndonesian ) ).toEqual( expectedResult );
	} );
} );


