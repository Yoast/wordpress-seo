import {
	computeScoresPerSentence,
	maximizeSentenceScores,
	keyphraseDistributionResearcher,
	getDistraction,
} from "../../../src/languageProcessing/researches/keyphraseDistribution.js";
import Paper from "../../../src/values/Paper.js";
import Mark from "../../../src/values/Mark";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";
import ItalianResearcher from "../../../src/languageProcessing/languages/it/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import JapaneseResearcher from "../../../src/languageProcessing/languages/ja/Researcher";
import getMorphologyData from "../../specHelpers/getMorphologyData";
import { realWorldULExample1, realWorldULExample2 } from "../helpers/sanitize/mergeListItemsSpec";
import buildTree from "../../specHelpers/parse/buildTree";
import { primeLanguageSpecificData } from "../../../src/languageProcessing/helpers/morphology/buildTopicStems";

const morphologyData = getMorphologyData( "en" );
const morphologyDataJA = getMorphologyData( "ja" );

describe( "Test for maximizing sentence scores", function() {
	it( "returns the largest score per sentence over all topics", function() {
		const inputArray = [
			[
				{ score: 1, matches: [] },
				{ score: 2, matches: [] },
				{ score: 3, matches: [] },
			],
			[
				{ score: 4, matches: [ "a" ] },
				{ score: 5, matches: [ "a" ] },
				{ score: 6, matches: [ "a", "b" ] },
			],
			[
				{ score: 100, matches: [ "a", "b", "c" ] },
				{ score: 2, matches: [] },
				{ score: 0, matches: [] },
			],
			[
				{ score: 7, matches: [ "a", "b" ] },
				{ score: 8, matches: [ "a", "b" ] },
				{ score: 9, matches: [ "a", "b" ] },
			],
		];

		const expectedOutput = [
			{ score: 100, matches: [ "a", "a", "b", "c", "a", "b"  ] },
			{ score: 8, matches: [ "a", "a", "b" ] },
			{ score: 9, matches: [ "a", "b", "a", "b" ] },
		];

		expect( maximizeSentenceScores( inputArray ) ).toEqual( expectedOutput );
	} );

	it( "returns the largest score per sentence over all topics", function() {
		const inputArray = [
			[
				{ score: 0, matches: [] },
				{ score: 0, matches: [] },
				{ score: 0, matches: [] },
			],
			[
				{ score: 5, matches: [ "a" ] },
				{ score: 4, matches: [ "a" ] },
				{ score: 1, matches: [] },
			],
			[
				{ score: 2, matches: [] },
				{ score: 10, matches: [ "a", "b" ] },
				{ score: -3, matches: [] },
			],
		];

		const expectedOutput = [
			{ score: 5, matches: [ "a" ] },
			{ score: 10, matches: [ "a", "a", "b" ] },
			{ score: 1, matches: [] },
		];

		expect( maximizeSentenceScores( inputArray ) ).toEqual( expectedOutput );
	} );
} );

describe( "Test for finding the longest distraction trains", function() {
	it( "returns the largest distraction train in the middle of the text", function() {
		const sentenceScores = [ 3, 3, 6, 9, 3, 3, 9, 6, 6, 9, 6, 3, 3, 3, 3, 3, 3, 3, 3, 6, 9, 6, 3 ];

		expect( getDistraction( sentenceScores ) ).toEqual( 8 );
	} );

	it( "returns the largest distraction train in the middle of the text", function() {
		const sentenceScores = [ 6, 3, 3, 6, 9, 3, 3, 9, 6, 6, 9, 6, 3, 3, 3, 3, 3, 3, 3, 3, 6, 9, 6, 3, 9 ];

		expect( getDistraction( sentenceScores ) ).toEqual( 8 );
	} );

	it( "returns the largest distraction train in the end of the text", function() {
		const sentenceScores = [ 6, 3, 3, 6, 9, 3, 3, 9, 6, 6, 9, 6, 3, 3, 3, 3, 3, 3, 3, 3 ];

		expect( getDistraction( sentenceScores ) ).toEqual( 8 );
	} );


	it( "returns the largest distraction train in the beginning of the text", function() {
		const sentenceScores = [ 3, 3, 3, 3, 3, 3, 3, 3, 6, 3, 3, 6, 9, 3, 3, 9, 6, 6, 9, 6, 3, 3, 3, 3 ];

		expect( getDistraction( sentenceScores ) ).toEqual( 8 );
	} );

	it( "returns the largest distraction train in the text without topic", function() {
		const sentenceScores = [ 3, 3, 3 ];

		expect( getDistraction( sentenceScores ) ).toEqual( 3 );
	} );

	it( "returns the largest distraction train in the text with topic only", function() {
		const sentenceScores = [ 6, 9, 9, 6 ];

		expect( getDistraction( sentenceScores ) ).toEqual( 0 );
	} );
} );

const sentencesEN = [
	{ text: "How remarkable!", tokens: [
		{ text: "How", sourceCodeRange: { startOffset: 0, endOffset: 3 } },
		{ text: " ", sourceCodeRange: { startOffset: 3, endOffset: 4 } },
		{ text: "remarkable", sourceCodeRange: { startOffset: 4, endOffset: 14 } },
		{ text: "!", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
	] },
	{ text: "Remarkable is a funny word.", tokens: [
		{ text: "Remarkable", sourceCodeRange: { startOffset: 0, endOffset: 10 } },
		{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
		{ text: "is", sourceCodeRange: { startOffset: 11, endOffset: 13 } },
		{ text: " ", sourceCodeRange: { startOffset: 13, endOffset: 14 } },
		{ text: "a", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
		{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
		{ text: "funny", sourceCodeRange: { startOffset: 16, endOffset: 21 } },
		{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
		{ text: "word", sourceCodeRange: { startOffset: 22, endOffset: 26 } },
		{ text: ".", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
	] },
	{ text: "I have found a key and a remarkable word.", tokens: [
		{ text: "I", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
		{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
		{ text: "have", sourceCodeRange: { startOffset: 2, endOffset: 6 } },
		{ text: " ", sourceCodeRange: { startOffset: 6, endOffset: 7 } },
		{ text: "found", sourceCodeRange: { startOffset: 7, endOffset: 12 } },
		{ text: " ", sourceCodeRange: { startOffset: 12, endOffset: 13 } },
		{ text: "a", sourceCodeRange: { startOffset: 13, endOffset: 14 } },
		{ text: " ", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
		{ text: "key", sourceCodeRange: { startOffset: 15, endOffset: 18 } },
		{ text: " ", sourceCodeRange: { startOffset: 18, endOffset: 19 } },
		{ text: "and", sourceCodeRange: { startOffset: 19, endOffset: 22 } },
		{ text: " ", sourceCodeRange: { startOffset: 22, endOffset: 23 } },
		{ text: "a", sourceCodeRange: { startOffset: 23, endOffset: 24 } },
		{ text: " ", sourceCodeRange: { startOffset: 24, endOffset: 25 } },
		{ text: "remarkable", sourceCodeRange: { startOffset: 25, endOffset: 35 } },
		{ text: " ", sourceCodeRange: { startOffset: 35, endOffset: 36 } },
		{ text: "word", sourceCodeRange: { startOffset: 36, endOffset: 40 } },
		{ text: ".", sourceCodeRange: { startOffset: 40, endOffset: 41 } },
	] },
	{ text: "And again a key something.", tokens: [
		{ text: "And", sourceCodeRange: { startOffset: 0, endOffset: 3 } },
		{ text: " ", sourceCodeRange: { startOffset: 3, endOffset: 4 } },
		{ text: "again", sourceCodeRange: { startOffset: 4, endOffset: 9 } },
		{ text: " ", sourceCodeRange: { startOffset: 9, endOffset: 10 } },
		{ text: "a", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
		{ text: " ", sourceCodeRange: { startOffset: 11, endOffset: 12 } },
		{ text: "key", sourceCodeRange: { startOffset: 12, endOffset: 15 } },
		{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
		{ text: "something", sourceCodeRange: { startOffset: 16, endOffset: 25 } },
		{ text: ".", sourceCodeRange: { startOffset: 25, endOffset: 26 } },
	] },
	{ text: "Here comes something that has nothing to do with a keyword.", tokens: [
		{ text: "Here", sourceCodeRange: { startOffset: 0, endOffset: 4 } },
		{ text: " ", sourceCodeRange: { startOffset: 4, endOffset: 5 } },
		{ text: "comes", sourceCodeRange: { startOffset: 5, endOffset: 10 } },
		{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
		{ text: "something", sourceCodeRange: { startOffset: 11, endOffset: 20 } },
		{ text: " ", sourceCodeRange: { startOffset: 20, endOffset: 21 } },
		{ text: "that", sourceCodeRange: { startOffset: 21, endOffset: 25 } },
		{ text: " ", sourceCodeRange: { startOffset: 25, endOffset: 26 } },
		{ text: "has", sourceCodeRange: { startOffset: 26, endOffset: 29 } },
		{ text: " ", sourceCodeRange: { startOffset: 29, endOffset: 30 } },
		{ text: "nothing", sourceCodeRange: { startOffset: 30, endOffset: 37 } },
		{ text: " ", sourceCodeRange: { startOffset: 37, endOffset: 38 } },
		{ text: "to", sourceCodeRange: { startOffset: 38, endOffset: 40 } },
		{ text: " ", sourceCodeRange: { startOffset: 40, endOffset: 41 } },
		{ text: "do", sourceCodeRange: { startOffset: 41, endOffset: 43 } },
		{ text: " ", sourceCodeRange: { startOffset: 43, endOffset: 44 } },
		{ text: "with", sourceCodeRange: { startOffset: 44, endOffset: 48 } },
		{ text: " ", sourceCodeRange: { startOffset: 48, endOffset: 49 } },
		{ text: "a", sourceCodeRange: { startOffset: 49, endOffset: 50 } },
		{ text: " ", sourceCodeRange: { startOffset: 50, endOffset: 51 } },
		{ text: "keyword", sourceCodeRange: { startOffset: 51, endOffset: 58 } },
		{ text: ".", sourceCodeRange: { startOffset: 58, endOffset: 59 } },
	] },
	{ text: "Ha, a key!", tokens: [
		{ text: "Ha", sourceCodeRange: { startOffset: 0, endOffset: 2 } },
		{ text: ",", sourceCodeRange: { startOffset: 2, endOffset: 3 } },
		{ text: " ", sourceCodeRange: { startOffset: 3, endOffset: 4 } },
		{ text: "a", sourceCodeRange: { startOffset: 4, endOffset: 5 } },
		{ text: " ", sourceCodeRange: { startOffset: 5, endOffset: 6 } },
		{ text: "key", sourceCodeRange: { startOffset: 6, endOffset: 9 } },
		{ text: "!", sourceCodeRange: { startOffset: 9, endOffset: 10 } },
	] },
	{ text: "Again nothing!", tokens: [
		{ text: "Again", sourceCodeRange: { startOffset: 0, endOffset: 5 } },
		{ text: " ", sourceCodeRange: { startOffset: 5, endOffset: 6 } },
		{ text: "nothing", sourceCodeRange: { startOffset: 6, endOffset: 13 } },
		{ text: "!", sourceCodeRange: { startOffset: 13, endOffset: 14 } },
	] },
	{ text: "Words, words, words, how boring!", tokens: [
		{ text: "Words", sourceCodeRange: { startOffset: 0, endOffset: 5 } },
		{ text: ",", sourceCodeRange: { startOffset: 5, endOffset: 6 } },
		{ text: " ", sourceCodeRange: { startOffset: 6, endOffset: 7 } },
		{ text: "words", sourceCodeRange: { startOffset: 7, endOffset: 12 } },
		{ text: ",", sourceCodeRange: { startOffset: 12, endOffset: 13 } },
		{ text: " ", sourceCodeRange: { startOffset: 13, endOffset: 14 } },
		{ text: "words", sourceCodeRange: { startOffset: 14, endOffset: 19 } },
		{ text: ",", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
		{ text: " ", sourceCodeRange: { startOffset: 20, endOffset: 21 } },
		{ text: "how", sourceCodeRange: { startOffset: 21, endOffset: 24 } },
		{ text: " ", sourceCodeRange: { startOffset: 24, endOffset: 25 } },
		{ text: "boring", sourceCodeRange: { startOffset: 25, endOffset: 31 } },
		{ text: "!", sourceCodeRange: { startOffset: 31, endOffset: 32 } },
	] },
];

const sentencesIT = [
	{ text: "Che cosa straordinaria!", tokens: [
		{ text: "Che", sourceCodeRange: { startOffset: 0, endOffset: 3 } },
		{ text: " ", sourceCodeRange: { startOffset: 3, endOffset: 4 } },
		{ text: "cosa", sourceCodeRange: { startOffset: 4, endOffset: 8 } },
		{ text: " ", sourceCodeRange: { startOffset: 8, endOffset: 9 } },
		{ text: "straordinaria", sourceCodeRange: { startOffset: 9, endOffset: 22 } },
		{ text: "!", sourceCodeRange: { startOffset: 22, endOffset: 23 } },
	] },
	{ text: "Straordinaria è una parola strana.", tokens: [
		{ text: "Straordinaria", sourceCodeRange: { startOffset: 0, endOffset: 13 } },
		{ text: " ", sourceCodeRange: { startOffset: 13, endOffset: 14 } },
		{ text: "è", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
		{ text: " ", sourceCodeRange: { startOffset: 15, endOffset: 16 } },
		{ text: "una", sourceCodeRange: { startOffset: 16, endOffset: 19 } },
		{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
		{ text: "parola", sourceCodeRange: { startOffset: 20, endOffset: 26 } },
		{ text: " ", sourceCodeRange: { startOffset: 26, endOffset: 27 } },
		{ text: "strana", sourceCodeRange: { startOffset: 27, endOffset: 33 } },
		{ text: ".", sourceCodeRange: { startOffset: 33, endOffset: 34 } },
	] },
	{ text: "Ho trovato una chiave e una parola straordinaria.", tokens: [
		{ text: "Ho", sourceCodeRange: { startOffset: 0, endOffset: 2 } },
		{ text: " ", sourceCodeRange: { startOffset: 2, endOffset: 3 } },
		{ text: "trovato", sourceCodeRange: { startOffset: 3, endOffset: 10 } },
		{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
		{ text: "una", sourceCodeRange: { startOffset: 11, endOffset: 14 } },
		{ text: " ", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
		{ text: "chiave", sourceCodeRange: { startOffset: 15, endOffset: 21 } },
		{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
		{ text: "e", sourceCodeRange: { startOffset: 22, endOffset: 23 } },
		{ text: " ", sourceCodeRange: { startOffset: 23, endOffset: 24 } },
		{ text: "una", sourceCodeRange: { startOffset: 24, endOffset: 27 } },
		{ text: " ", sourceCodeRange: { startOffset: 27, endOffset: 28 } },
		{ text: "parola", sourceCodeRange: { startOffset: 28, endOffset: 34 } },
		{ text: " ", sourceCodeRange: { startOffset: 34, endOffset: 35 } },
		{ text: "straordinaria", sourceCodeRange: { startOffset: 35, endOffset: 48 } },
		{ text: ".", sourceCodeRange: { startOffset: 48, endOffset: 49 } },
	] },
	{ text: "E ancora una chiave e qualcosa.", tokens: [
		{ text: "E", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
		{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
		{ text: "ancora", sourceCodeRange: { startOffset: 2, endOffset: 8 } },
		{ text: " ", sourceCodeRange: { startOffset: 8, endOffset: 9 } },
		{ text: "una", sourceCodeRange: { startOffset: 9, endOffset: 12 } },
		{ text: " ", sourceCodeRange: { startOffset: 12, endOffset: 13 } },
		{ text: "chiave", sourceCodeRange: { startOffset: 13, endOffset: 19 } },
		{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
		{ text: "e", sourceCodeRange: { startOffset: 20, endOffset: 21 } },
		{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
		{ text: "qualcosa", sourceCodeRange: { startOffset: 22, endOffset: 30 } },
		{ text: ".", sourceCodeRange: { startOffset: 30, endOffset: 31 } },
	] },
	{ text: "È qualcosa che non ha niente da fare con questo che cerchiamo.", tokens: [
		{ text: "È", sourceCodeRange: { startOffset: 0, endOffset: 1 } },
		{ text: " ", sourceCodeRange: { startOffset: 1, endOffset: 2 } },
		{ text: "qualcosa", sourceCodeRange: { startOffset: 2, endOffset: 10 } },
		{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
		{ text: "che", sourceCodeRange: { startOffset: 11, endOffset: 14 } },
		{ text: " ", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
		{ text: "non", sourceCodeRange: { startOffset: 15, endOffset: 18 } },
		{ text: " ", sourceCodeRange: { startOffset: 18, endOffset: 19 } },
		{ text: "ha", sourceCodeRange: { startOffset: 19, endOffset: 21 } },
		{ text: " ", sourceCodeRange: { startOffset: 21, endOffset: 22 } },
		{ text: "niente", sourceCodeRange: { startOffset: 22, endOffset: 28 } },
		{ text: " ", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
		{ text: "da", sourceCodeRange: { startOffset: 29, endOffset: 31 } },
		{ text: " ", sourceCodeRange: { startOffset: 31, endOffset: 32 } },
		{ text: "fare", sourceCodeRange: { startOffset: 32, endOffset: 36 } },
		{ text: " ", sourceCodeRange: { startOffset: 36, endOffset: 37 } },
		{ text: "con", sourceCodeRange: { startOffset: 37, endOffset: 40 } },
		{ text: " ", sourceCodeRange: { startOffset: 40, endOffset: 41 } },
		{ text: "questo", sourceCodeRange: { startOffset: 41, endOffset: 47 } },
		{ text: " ", sourceCodeRange: { startOffset: 47, endOffset: 48 } },
		{ text: "che", sourceCodeRange: { startOffset: 48, endOffset: 51 } },
		{ text: " ", sourceCodeRange: { startOffset: 51, endOffset: 52 } },
		{ text: "cerchiamo", sourceCodeRange: { startOffset: 52, endOffset: 61 } },
		{ text: ".", sourceCodeRange: { startOffset: 61, endOffset: 62 } },
	] },
	{ text: "Ah, una chiave!", tokens: [
		{ text: "Ah", sourceCodeRange: { startOffset: 0, endOffset: 2 } },
		{ text: ",", sourceCodeRange: { startOffset: 2, endOffset: 3 } },
		{ text: " ", sourceCodeRange: { startOffset: 3, endOffset: 4 } },
		{ text: "una", sourceCodeRange: { startOffset: 4, endOffset: 7 } },
		{ text: " ", sourceCodeRange: { startOffset: 7, endOffset: 8 } },
		{ text: "chiave", sourceCodeRange: { startOffset: 8, endOffset: 14 } },
		{ text: "!", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
	] },
	{ text: "Ancora niente!", tokens: [
		{ text: "Ancora", sourceCodeRange: { startOffset: 0, endOffset: 7 } },
		{ text: " ", sourceCodeRange: { startOffset: 7, endOffset: 8 } },
		{ text: "niente", sourceCodeRange: { startOffset: 8, endOffset: 14 } },
		{ text: "!", sourceCodeRange: { startOffset: 14, endOffset: 15 } },
	] },
	{ text: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!", tokens: [
		{ text: "Una", sourceCodeRange: { startOffset: 0, endOffset: 3 } },
		{ text: " ", sourceCodeRange: { startOffset: 3, endOffset: 4 } },
		{ text: "parola", sourceCodeRange: { startOffset: 4, endOffset: 10 } },
		{ text: " ", sourceCodeRange: { startOffset: 10, endOffset: 11 } },
		{ text: "e", sourceCodeRange: { startOffset: 11, endOffset: 12 } },
		{ text: " ", sourceCodeRange: { startOffset: 12, endOffset: 13 } },
		{ text: "ancora", sourceCodeRange: { startOffset: 13, endOffset: 19 } },
		{ text: " ", sourceCodeRange: { startOffset: 19, endOffset: 20 } },
		{ text: "un'altra", sourceCodeRange: { startOffset: 20, endOffset: 28 } },
		{ text: " ", sourceCodeRange: { startOffset: 28, endOffset: 29 } },
		{ text: "e", sourceCodeRange: { startOffset: 29, endOffset: 30 } },
		{ text: " ", sourceCodeRange: { startOffset: 30, endOffset: 31 } },
		{ text: "poi", sourceCodeRange: { startOffset: 31, endOffset: 34 } },
		{ text: " ", sourceCodeRange: { startOffset: 34, endOffset: 35 } },
		{ text: "un'altra", sourceCodeRange: { startOffset: 35, endOffset: 43 } },
		{ text: " ", sourceCodeRange: { startOffset: 43, endOffset: 44 } },
		{ text: "ancora", sourceCodeRange: { startOffset: 44, endOffset: 50 } },
		{ text: ",", sourceCodeRange: { startOffset: 50, endOffset: 51 } },
		{ text: " ", sourceCodeRange: { startOffset: 51, endOffset: 52 } },
		{ text: "che", sourceCodeRange: { startOffset: 52, endOffset: 55 } },
		{ text: " ", sourceCodeRange: { startOffset: 55, endOffset: 56 } },
		{ text: "schifo", sourceCodeRange: { startOffset: 56, endOffset: 62 } },
		{ text: "!", sourceCodeRange: { startOffset: 62, endOffset: 63 } },
	] },
];

const testCasesSentenceScore = [
	{
		description: "English, empty topic",
		topic: [],
		sentences: sentencesEN,
		locale: "en_US",
		expected: [
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
		],
		isFullMatchRequired: true,
	},
	{
		description: "English, short topic, morphology data",
		topic: [
			[ "key", "keys" ],
			[ "word", "words" ],
		],
		sentences: sentencesEN,
		locale: "en_US",
		expected: [
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 9, matches: [
				{ text: "key", sourceCodeRange: { startOffset: 15, endOffset: 18 } },
				{ text: "word", sourceCodeRange: { startOffset: 36, endOffset: 40 } },
			] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
		],
		isFullMatchRequired: true,
	},
	{
		description: "English, long topic, morphology data",
		topic: [
			[ "key", "keys" ],
			[ "word", "words" ],
			[ "remarkable", "remarkables", "remarkably" ],
			[ "something", "somethings" ],
		],
		sentences: sentencesEN,
		locale: "en_US",
		expected: [
			{ score: 3, matches: [] },
			{ score: 9, matches: [
				{ text: "word", sourceCodeRange: { startOffset: 22, endOffset: 26 } },
				{ text: "Remarkable", sourceCodeRange: { startOffset: 0, endOffset: 10 } },
			] },
			{ score: 9, matches: [
				{ text: "key", sourceCodeRange: { startOffset: 15, endOffset: 18 } },
				{ text: "word", sourceCodeRange: { startOffset: 36, endOffset: 40 } },
				{ text: "remarkable", sourceCodeRange: { startOffset: 25, endOffset: 35 } },
			] },
			{ score: 9, matches: [
				{ text: "key", sourceCodeRange: { startOffset: 12, endOffset: 15 } },
				{ text: "something", sourceCodeRange: { startOffset: 16, endOffset: 25 } },
			] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
		],
		isFullMatchRequired: false,
	},
	{
		description: "Italian, short topic, no morphology data",
		topic: [
			[ "parola" ],
			[ "chiave" ],
		],
		sentences: sentencesIT,
		locale: "it_IT",
		expected: [
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 9, matches: [
				{ text: "parola", sourceCodeRange: { startOffset: 28, endOffset: 34 } },
				{ text: "chiave", sourceCodeRange: { startOffset: 15, endOffset: 21 } },
			] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
		],
		isFullMatchRequired: true,
	},
	{
		description: "Italian, long topic, no morphology data",
		topic: [
			[ "parola" ],
			[ "chiave" ],
			[ "straordinaria" ],
			[ "qualcosa" ],
		],
		sentences: sentencesIT,
		locale: "it_IT",
		expected: [
			{ score: 3, matches: [] },
			{ score: 9, matches: [
				{ text: "parola", sourceCodeRange: { startOffset: 20, endOffset: 26 } },
				{ text: "Straordinaria", sourceCodeRange: { startOffset: 0, endOffset: 13 } },
			] },
			{ score: 9, matches: [
				{ text: "parola", sourceCodeRange: { startOffset: 28, endOffset: 34 } },
				{ text: "chiave", sourceCodeRange: { startOffset: 15, endOffset: 21 } },
				{ text: "straordinaria", sourceCodeRange: { startOffset: 35, endOffset: 48 } },
			] },
			{ score: 9, matches: [
				{ text: "chiave", sourceCodeRange: { startOffset: 13, endOffset: 19 } },
				{ text: "qualcosa", sourceCodeRange: { startOffset: 22, endOffset: 30 } },
			] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [] },
		],
		isFullMatchRequired: false,
	},
];

describe.each( testCasesSentenceScore )( "Test for computing sentence scores", ( {
	description, topic, sentences, locale, expected, isFullMatchRequired,
} ) => {
	it( description, () => {
		expect( computeScoresPerSentence( topic, sentences, locale, isFullMatchRequired   ) ).toEqual( expected );
	} );
} );

describe( "Test for the research", function() {
	it( "should not find a match for a two-word topic (short topic less than 4) and only one of the words is present", () => {
		const paper = new Paper(
			"And again a key something.",
			{
				locale: "en_US",
				keyword: "key word",
			}
		);
		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 100,
			sentencesToHighlight: [],
		} );
	} );
	it( "should only match and return the marking for the synonym when only the synonym is found", () => {
		// Only "something" should be marked. This is because only one of the words in the keyphrase is present: "key".
		// Before the assessment is using HTML Parser, both "key" and "something" were marked, which was incorrect.
		const paper = new Paper(
			"And again a key something. No keyphrase is found. This is the third sentence.",
			{
				locale: "en_US",
				keyword: "key word",
				synonyms: "remarkable, something, word",
			}
		);
		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "And again a key <yoastmark class='yoast-text-mark'>something</yoastmark>.",
					original: "And again a key something.",
					position: {
						attributeId: "", clientId: "", endOffset: 25, endOffsetBlock: 25, isFirstSection: false, startOffset: 16, startOffsetBlock: 16,
					},
				} ),
			],
		} );
	} );
	it( "should match and returns the markings for both the keyword and the synonym in a short topic", () => {
		// Both "key" and "remarkable word" should be marked.
		const paper = new Paper(
			"I have found a key and a remarkable word. No keyphrase is found. This is the third sentence.",
			{
				locale: "en_US",
				keyword: "key word",
				synonyms: "remarkable, something, word",
			}
		);
		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>" +
						"remarkable word</yoastmark>.",
					original: "I have found a key and a remarkable word.",
					position: {
						attributeId: "", clientId: "", endOffset: 18, endOffsetBlock: 18, isFirstSection: false, startOffset: 15, startOffsetBlock: 15,
					},
				} ),
				new Mark( {
					marked: "I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>" +
						"remarkable word</yoastmark>.",
					original: "I have found a key and a remarkable word.",
					position: {
						attributeId: "", clientId: "", endOffset: 40, endOffsetBlock: 40, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ),
			],
		} );
	} );
	it( "returns a score over all sentences and all topic forms; returns markers for sentences that contain the topic", function() {
		const paper = new Paper(
			sentencesEN.map( sentence => sentence.text ).join( " " ),
			{
				locale: "en_US",
				keyword: "key word",
				synonyms: "remarkable, something, word",
			}
		);

		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "How <yoastmark class='yoast-text-mark'>remarkable</yoastmark>!",
					original: "How remarkable!",
					position: {
						attributeId: "", clientId: "", endOffset: 14, endOffsetBlock: 14, isFirstSection: false, startOffset: 4, startOffsetBlock: 4,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Remarkable</yoastmark> is a funny <yoastmark class='yoast-text-mark'>word</yoastmark>.",
					original: " Remarkable is a funny word.",
					position: {
						attributeId: "", clientId: "", endOffset: 26, endOffsetBlock: 26, isFirstSection: false, startOffset: 16, startOffsetBlock: 16,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Remarkable</yoastmark> is a funny <yoastmark class='yoast-text-mark'>word</yoastmark>.",
					original: " Remarkable is a funny word.",
					position: {
						attributeId: "", clientId: "", endOffset: 42, endOffsetBlock: 42, isFirstSection: false, startOffset: 38, startOffsetBlock: 38,
					},
				} ),
				new Mark( {
					marked: " I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>" +
						"remarkable word</yoastmark>.",
					original: " I have found a key and a remarkable word.",
					position: {
						attributeId: "", clientId: "", endOffset: 62, endOffsetBlock: 62, isFirstSection: false, startOffset: 59, startOffsetBlock: 59,
					},
				} ),
				new Mark( {
					marked: " I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>" +
						"remarkable word</yoastmark>.",
					original: " I have found a key and a remarkable word.",
					position: {
						attributeId: "", clientId: "", endOffset: 84, endOffsetBlock: 84, isFirstSection: false, startOffset: 69, startOffsetBlock: 69,
					},
				} ),
				new Mark( {
					marked: " And again a key <yoastmark class='yoast-text-mark'>something</yoastmark>.",
					original: " And again a key something.",
					position: {
						attributeId: "", clientId: "", endOffset: 111, endOffsetBlock: 111, isFirstSection: false, startOffset: 102, startOffsetBlock: 102,
					},
				} ),
				new Mark( {
					marked: " Here comes <yoastmark class='yoast-text-mark'>something</yoastmark> that has nothing to do with a keyword.",
					original: " Here comes something that has nothing to do with a keyword.",
					position: {
						attributeId: "", clientId: "", endOffset: 133, endOffsetBlock: 133, isFirstSection: false, startOffset: 124, startOffsetBlock: 124,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, " +
						"<yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: " Words, words, words, how boring!",
					position: {
						attributeId: "", clientId: "", endOffset: 204, endOffsetBlock: 204, isFirstSection: false, startOffset: 199, startOffsetBlock: 199,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, " +
						"<yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: " Words, words, words, how boring!",
					position: {
						attributeId: "", clientId: "", endOffset: 211, endOffsetBlock: 211, isFirstSection: false, startOffset: 206, startOffsetBlock: 206,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, " +
						"<yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: " Words, words, words, how boring!",
					position: {
						attributeId: "", clientId: "", endOffset: 218, endOffsetBlock: 218, isFirstSection: false, startOffset: 213, startOffsetBlock: 213,
					},
				} ),
			],
		} );
	} );

	it( "returns the same score when function words are added", function() {
		const paper = new Paper(
			sentencesEN.map( sentence => sentence.text ).join( " " ),
			{
				locale: "en_EN",
				keyword: "the key word",
				/*
				 * No function word has been added to something; something is already a function word. In topics
				 * that solely consist of function words, these words are not filtered. Therefore, adding another
				 * function word to "something" would change the result because it would get analyzed like a content word.
				 */
				synonyms: "such remarkable, something, very word",
			}
		);

		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "How <yoastmark class='yoast-text-mark'>remarkable</yoastmark>!",
					original: "How remarkable!",
					position: {
						attributeId: "", clientId: "", endOffset: 14, endOffsetBlock: 14, isFirstSection: false, startOffset: 4, startOffsetBlock: 4,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Remarkable</yoastmark> is a funny <yoastmark class='yoast-text-mark'>word</yoastmark>.",
					original: " Remarkable is a funny word.",
					position: {
						attributeId: "", clientId: "", endOffset: 26, endOffsetBlock: 26, isFirstSection: false, startOffset: 16, startOffsetBlock: 16,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Remarkable</yoastmark> is a funny <yoastmark class='yoast-text-mark'>word</yoastmark>.",
					original: " Remarkable is a funny word.",
					position: {
						attributeId: "", clientId: "", endOffset: 42, endOffsetBlock: 42, isFirstSection: false, startOffset: 38, startOffsetBlock: 38,
					},
				} ),
				new Mark( {
					marked: " I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>" +
						"remarkable word</yoastmark>.",
					original: " I have found a key and a remarkable word.",
					position: {
						attributeId: "", clientId: "", endOffset: 62, endOffsetBlock: 62, isFirstSection: false, startOffset: 59, startOffsetBlock: 59,
					},
				} ),
				new Mark( {
					marked: " I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>" +
						"remarkable word</yoastmark>.",
					original: " I have found a key and a remarkable word.",
					position: {
						attributeId: "", clientId: "", endOffset: 84, endOffsetBlock: 84, isFirstSection: false, startOffset: 69, startOffsetBlock: 69,
					},
				} ),
				new Mark( {
					marked: " And again a key <yoastmark class='yoast-text-mark'>something</yoastmark>.",
					original: " And again a key something.",
					position: {
						attributeId: "", clientId: "", endOffset: 111, endOffsetBlock: 111, isFirstSection: false, startOffset: 102, startOffsetBlock: 102,
					},
				} ),
				new Mark( {
					marked: " Here comes <yoastmark class='yoast-text-mark'>something</yoastmark> that has nothing to do with a keyword.",
					original: " Here comes something that has nothing to do with a keyword.",
					position: {
						attributeId: "", clientId: "", endOffset: 133, endOffsetBlock: 133, isFirstSection: false, startOffset: 124, startOffsetBlock: 124,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, " +
						"<yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: " Words, words, words, how boring!",
					position: {
						attributeId: "", clientId: "", endOffset: 204, endOffsetBlock: 204, isFirstSection: false, startOffset: 199, startOffsetBlock: 199,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, " +
						"<yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: " Words, words, words, how boring!",
					position: {
						attributeId: "", clientId: "", endOffset: 211, endOffsetBlock: 211, isFirstSection: false, startOffset: 206, startOffsetBlock: 206,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, " +
						"<yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: " Words, words, words, how boring!",
					position: {
						attributeId: "", clientId: "", endOffset: 218, endOffsetBlock: 218, isFirstSection: false, startOffset: 213, startOffsetBlock: 213,
					},
				} ),
			],
		} );
	} );

	it( "returns a score (for a language without morphology support) over all sentences and all topic forms; returns markers for " +
		"sentences that contain the topic", function() {
		const paper = new Paper(
			sentencesIT.map( sentence => sentence.text ).join( " " ),
			{
				locale: "jv_ID",
				keyword: "parola chiave",
				synonyms: "straordinaria, qualcosa, parola",
			}
		);

		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
					position: {
						attributeId: "", clientId: "", endOffset: 22, endOffsetBlock: 22, isFirstSection: false, startOffset: 9, startOffsetBlock: 9,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: " Straordinaria è una parola strana.",
					position: {
						attributeId: "", clientId: "", endOffset: 37, endOffsetBlock: 37, isFirstSection: false, startOffset: 24, startOffsetBlock: 24,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: " Straordinaria è una parola strana.",
					position: {
						attributeId: "", clientId: "", endOffset: 50, endOffsetBlock: 50, isFirstSection: false, startOffset: 44, startOffsetBlock: 44,
					},
				} ),
				new Mark( {
					marked: " Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: " Ho trovato una chiave e una parola straordinaria.",
					position: {
						attributeId: "", clientId: "", endOffset: 80, endOffsetBlock: 80, isFirstSection: false, startOffset: 74, startOffsetBlock: 74,
					},
				} ),
				new Mark( {
					marked: " Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: " Ho trovato una chiave e una parola straordinaria.",
					position: {
						attributeId: "", clientId: "", endOffset: 107, endOffsetBlock: 107, isFirstSection: false, startOffset: 87, startOffsetBlock: 87,
					},
				} ),
				new Mark( {
					marked: " E ancora una chiave e <yoastmark class='yoast-text-mark'>qualcosa</yoastmark>.",
					original: " E ancora una chiave e qualcosa.",
					position: {
						attributeId: "", clientId: "", endOffset: 139, endOffsetBlock: 139, isFirstSection: false, startOffset: 131, startOffsetBlock: 131,
					},
				} ),
				new Mark( {
					marked: " È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: " È qualcosa che non ha niente da fare con questo che cerchiamo.",
					position: {
						attributeId: "", clientId: "", endOffset: 151, endOffsetBlock: 151, isFirstSection: false, startOffset: 143, startOffsetBlock: 143,
					},
				} ),
				new Mark( {
					marked: " Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: " Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
					position: {
						attributeId: "", clientId: "", endOffset: 245, endOffsetBlock: 245, isFirstSection: false, startOffset: 239, startOffsetBlock: 239,
					},
				} ),
			],
		} );
	} );

	/*
	 * The following Italian tests are not language-specific as they are an example of languages in general
	 * that have no morphology support.
	 */
	it( "returns the same score when function words are added (for a language without morphological support, but with function words, " +
		"e.g. Italian in Free)", function() {
		primeLanguageSpecificData.cache.clear();

		const paper = new Paper(
			"Che cosa straordinaria! Straordinaria è una parola strana. Ho trovato una chiave e una parola straordinaria. " +
			"E ancora una chiave e qualcosa. È qualcosa che non ha niente da fare con questo che cerchiamo. " +
			"Ah, una chiave! Ancora niente! Una parola e ancora un'altra e poi un'altra ancora, che schifo!\n",
			{
				locale: "it_IT",
				keyword: "la parola chiave",
				synonyms: "tanta straordinaria, qualcosa, molto parola",
			}
		);

		const researcher = new ItalianResearcher( paper );
		buildTree( paper, researcher );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
					position: {
						attributeId: "", clientId: "", endOffset: 22, endOffsetBlock: 22, isFirstSection: false, startOffset: 9, startOffsetBlock: 9,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: " Straordinaria è una parola strana.",
					position: {
						attributeId: "", clientId: "", endOffset: 37, endOffsetBlock: 37, isFirstSection: false, startOffset: 24, startOffsetBlock: 24,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: " Straordinaria è una parola strana.",
					position: {
						attributeId: "", clientId: "", endOffset: 50, endOffsetBlock: 50, isFirstSection: false, startOffset: 44, startOffsetBlock: 44,
					},
				} ),
				new Mark( {
					marked: " Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: " Ho trovato una chiave e una parola straordinaria.",
					position: {
						attributeId: "", clientId: "", endOffset: 80, endOffsetBlock: 80, isFirstSection: false, startOffset: 74, startOffsetBlock: 74,
					},
				} ),
				new Mark( {
					marked: " Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: " Ho trovato una chiave e una parola straordinaria.",
					position: {
						attributeId: "", clientId: "", endOffset: 107, endOffsetBlock: 107, isFirstSection: false, startOffset: 87, startOffsetBlock: 87,
					},
				} ),
				new Mark( {
					marked: " E ancora una chiave e <yoastmark class='yoast-text-mark'>qualcosa</yoastmark>.",
					original: " E ancora una chiave e qualcosa.",
					position: {
						attributeId: "", clientId: "", endOffset: 139, endOffsetBlock: 139, isFirstSection: false, startOffset: 131, startOffsetBlock: 131,
					},
				} ),
				new Mark( {
					marked: " È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: " È qualcosa che non ha niente da fare con questo che cerchiamo.",
					position: {
						attributeId: "", clientId: "", endOffset: 151, endOffsetBlock: 151, isFirstSection: false, startOffset: 143, startOffsetBlock: 143,
					},
				} ),
				new Mark( {
					marked: " Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: " Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
					position: {
						attributeId: "", clientId: "", endOffset: 245, endOffsetBlock: 245, isFirstSection: false, startOffset: 239, startOffsetBlock: 239,
					},
				} ),
			],
		} );
	} );
	it( "when the topic words don't contain function words and the function words for this locale are not available, " +
		"returns the same score", function() {
		const paper = new Paper(
			sentencesIT.map( sentence => sentence.text ).join( " " ),
			{
				// Fictitious locale that doesn't have function word support.
				locale: "xx_XX",
				keyword: "parola chiave",
				/*
				 * Since there are only content words, the score doesn't change.
				 * (Qualcosa is technically a function word but is analyzed as a content word here since it's the
				 * only word in the synonym.)
				 */
				synonyms: "straordinaria, qualcosa, parola",
			}
		);

		const researcher = new DefaultResearcher( paper );
		buildTree( paper, researcher );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
					position: {
						attributeId: "", clientId: "", endOffset: 22, endOffsetBlock: 22, isFirstSection: false, startOffset: 9, startOffsetBlock: 9,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: " Straordinaria è una parola strana.",
					position: {
						attributeId: "", clientId: "", endOffset: 37, endOffsetBlock: 37, isFirstSection: false, startOffset: 24, startOffsetBlock: 24,
					},
				} ),
				new Mark( {
					marked: " <yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: " Straordinaria è una parola strana.",
					position: {
						attributeId: "", clientId: "", endOffset: 50, endOffsetBlock: 50, isFirstSection: false, startOffset: 44, startOffsetBlock: 44,
					},
				} ),
				new Mark( {
					marked: " Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: " Ho trovato una chiave e una parola straordinaria.",
					position: {
						attributeId: "", clientId: "", endOffset: 80, endOffsetBlock: 80, isFirstSection: false, startOffset: 74, startOffsetBlock: 74,
					},
				} ),
				new Mark( {
					marked: " Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: " Ho trovato una chiave e una parola straordinaria.",
					position: {
						attributeId: "", clientId: "", endOffset: 107, endOffsetBlock: 107, isFirstSection: false, startOffset: 87, startOffsetBlock: 87,
					},
				} ),
				new Mark( {
					marked: " E ancora una chiave e <yoastmark class='yoast-text-mark'>qualcosa</yoastmark>.",
					original: " E ancora una chiave e qualcosa.",
					position: {
						attributeId: "", clientId: "", endOffset: 139, endOffsetBlock: 139, isFirstSection: false, startOffset: 131, startOffsetBlock: 131,
					},
				} ),
				new Mark( {
					marked: " È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: " È qualcosa che non ha niente da fare con questo che cerchiamo.",
					position: {
						attributeId: "", clientId: "", endOffset: 151, endOffsetBlock: 151, isFirstSection: false, startOffset: 143, startOffsetBlock: 143,
					},
				} ),
				new Mark( {
					marked: " Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: " Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
					position: {
						attributeId: "", clientId: "", endOffset: 245, endOffsetBlock: 245, isFirstSection: false, startOffset: 239, startOffsetBlock: 239,
					},
				} ),
			],
		} );
	} );

	it( "when the topic words don't contain function words and the function words for this locale are not available, " +
		"returns a different score", function() {
		// The word that is matched here is "qualcosa".
		const paper = new Paper(
			sentencesIT.map( sentence => sentence.text ).join( " " ),
			{
				// Fictitious locale that doesn't have function word support.
				locale: "xx_XX",
				// The added function words are now analyzed as content words, so the score changes.
				// Note that we use lorem/ipsum/dolor here as additional "content words" to prevent cache hits from the tests above.
				keyword: "lorem parola chiave",
				synonyms: "ipsum straordinaria, qualcosa, dolor parola",
			}
		);

		const defaultResearcher = new DefaultResearcher( paper );
		buildTree( paper, defaultResearcher );

		expect( keyphraseDistributionResearcher( paper, defaultResearcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " E ancora una chiave e <yoastmark class='yoast-text-mark'>" +
						"qualcosa</yoastmark>.",
					original: " E ancora una chiave e qualcosa.",
					position: {
						attributeId: "", clientId: "", endOffset: 139, endOffsetBlock: 139, isFirstSection: false, startOffset: 131, startOffsetBlock: 131,
					},
				} ),
				new Mark( {
					marked: " È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: " È qualcosa che non ha niente da fare con questo che cerchiamo.",
					position: {
						attributeId: "", clientId: "", endOffset: 151, endOffsetBlock: 151, isFirstSection: false, startOffset: 143, startOffsetBlock: 143,
					},
				} ),
			],
		} );
	} );

	it( "when no keyphrase or synonyms is used in the text at all", function() {
		const paper = new Paper(
			"This is a text without keyphrase1 or synonyms1",
			{
				// Fictitious locale that doesn't have function word support.
				locale: "en_EN",
				keyword: "keyphrase",
				// The added function words are now analyzed as content words, so the score changes.
				synonyms: "synonym",
			}
		);

		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 100,
			sentencesToHighlight: [],
		} );
	} );

	it( "returns the score 100 when the keyphrase is used inside an element we want to exclude from the analysis", function() {
		const paper = new Paper(
			"This is a text with a <code>keyphrase</code> that doesn't count",
			{
				locale: "en_EN",
				keyword: "keyphrase",
				synonyms: "synonym",
			}
		);

		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 100,
			sentencesToHighlight: [],
		} );
	} );

	it( "returns the score 100 when the keyphrase is a shortcode", function() {
		const paper = new Paper(
			"This is a text with a [keyphrase]that doesn't count",
			{
				locale: "en_EN",
				keyword: "keyphrase",
				synonyms: "synonym",
				shortcodes: [ "keyphrase" ],
			}
		);

		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 100,
			sentencesToHighlight: [],
		} );
	} );

	const paragraphWithKeyphrase1 = "<p>Lorem ipsum keyphrase dolor sit amet, consectetur adipiscing elit. " +
		"In sit amet semper sem, id faucibus massa. Nam varius bibendum tellus eget scelerisque. Morbi sit amet odio dui." +
		" Cras aliquam ipsum vitae porttitor porta. Fusce rhoncus massa lacinia ligula dignissim tempor. Ut tempor placerat" +
		" erat vitae pretium. Nam at erat posuere, suscipit dui auctor, sagittis ipsum. Fusce tristique aliquet tortor, " +
		"id dapibus ligula ullamcorper non. </p>\n";

	const paragraphWithKeyphrase2 = "<p>Nam sit keyphrase amet eros faucibus, malesuada purus at, mollis libero. " +
		"Praesent at ante sit amet elit sollicitudin lobortis. Mauris sit amet pulvinar nulla, ut iaculis ante. Vivamus" +
		" nulla velit, dignissim quis orci vitae, volutpat luctus neque. Aliquam elementum libero nec faucibus lobortis." +
		" Nullam magna nunc, vulputate et metus et, pulvinar tempor magna. Mauris lectus arcu, efficitur sit amet rutrum" +
		" rhoncus, tincidunt non lacus. Cras eget lectus venenatis, varius massa eu, lobortis dui. </p>";

	it( "calculates keyphrase distribution score correctly for content with plain text structure", function() {
		const fruits = [ "apple", "pear", "mango", "kiwi", "papaya", "pineapple", "banana" ];
		const fruitString = fruits.join( " " );

		// The text has 18 sentences and a maximum distraction of 9 sentences. The fruitsString is a separate sentence.
		const paperWithWords = new Paper(
			paragraphWithKeyphrase1 + fruitString + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const researcherWordsCondition = new Researcher( paperWithWords );
		buildTree( paperWithWords, researcherWordsCondition );
		researcherWordsCondition.addResearchData( "morphology", morphologyData );

		const result = keyphraseDistributionResearcher( paperWithWords, researcherWordsCondition );

		// Test that the score is correct (9/18*100 = 50).
		expect( result.keyphraseDistributionScore ).toEqual( 50 );
	} );

	it( "calculates keyphrase distribution score for content with HTML list structure with single word list items", function() {
		const fruits = [ "apple", "pear", "mango", "kiwi", "papaya", "pineapple", "banana" ];
		const fruitList = "<ul>\n" + fruits.map( fruit => "<li>" + fruit + "</li>\n" ).join( "" ) + "</ul>";

		// The text has 18 sentences and a maximum distraction of 9 sentences. The items in the list are merged into one
		// sentence since they don't end with a sentence delimiter.
		const paperWithList = new Paper(
			paragraphWithKeyphrase1 + fruitList + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const researcherListCondition = new Researcher( paperWithList );
		buildTree( paperWithList, researcherListCondition );
		researcherListCondition.addResearchData( "morphology", morphologyData );

		const result = keyphraseDistributionResearcher( paperWithList, researcherListCondition );

		// Test that the score is correct (9/18*100 = 50).
		expect( result.keyphraseDistributionScore ).toEqual( 50 );
	} );

	it( "calculates keyphrase distribution score for content with HTML list structure with short phrases as the list items", function() {
		const listItems = [
			"<li>List item one</li>",
			"<li>List item two.</li>",
			"<li>List item three keyphrase.</li>",
		];
		// The text has 19 sentences and a maximum distraction of 9 sentences. The first and second list items are merged
		// into one sentence since the first list item doesn't end with a sentence delimiter.
		const paper = new Paper( paragraphWithKeyphrase1 + "<ul>" + listItems.join( "" ) + "</ul>" + paragraphWithKeyphrase2,
			{
				locale: "en_US",
				keyword: "keyphrase",
			}
		);
		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		const result = keyphraseDistributionResearcher( paper, researcher );

		// Test that the score is correct (9/19*100 = 47.368421052631575).
		expect( result.keyphraseDistributionScore ).toEqual( 47.368421052631575 );
	} );

	it( "calculates keyphrase distribution score for content with HTML list structure with full sentences as the list items", function() {
		const fruitStatements = [
			"This is an apple.",
			"This is a pear.",
			"This is a mango.",
			"This is a kiwi.",
			"This is a papaya.",
			"This is a pineapple.",
			"This is a banana." ];

		const fruitStatementList =  "<ul>\n" + fruitStatements.map( fruitStatement => "<li>" + fruitStatement + "</li>\n" ).join( "" ) + "</ul>";

		// The text has 24 sentences and a maximum distraction of 15 sentences. The list items are all treated as separate
		// sentences because they end with a sentence delimiter.
		const paperWithList = new Paper(
			paragraphWithKeyphrase1 + fruitStatementList + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const researcherListCondition = new Researcher( paperWithList );
		buildTree( paperWithList, researcherListCondition );
		researcherListCondition.addResearchData( "morphology", morphologyData );

		const result = keyphraseDistributionResearcher( paperWithList, researcherListCondition );

		// Test that the score is correct (15/24*100 = 62.5 ).
		expect( result.keyphraseDistributionScore ).toEqual( 62.5 );
	} );

	it( "returns the same result for a list of sentences as it does for a string of sentences", function() {
		const fruitStatements = [
			"This is an apple.",
			"This is a pear.",
			"This is a mango.",
			"This is a kiwi.",
			"This is a papaya.",
			"This is a pineapple.",
			"This is a banana." ];

		const fruitStatementList = "<ul>\n" + fruitStatements.map( fruitStatement => "<li>" + fruitStatement + "</li>\n" ).join( "" ) + "</ul>";
		const fruitStatementString = fruitStatements.join( " " );

		const paperWithList = new Paper(
			paragraphWithKeyphrase1 + fruitStatementList + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const paperWithWords = new Paper(
			paragraphWithKeyphrase1 + fruitStatementString + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const researcherListCondition = new Researcher( paperWithList );
		buildTree( paperWithList, researcherListCondition );
		researcherListCondition.addResearchData( "morphology", morphologyData );

		const researcherWordsCondition = new Researcher( paperWithWords );
		buildTree( paperWithWords, researcherWordsCondition );
		researcherWordsCondition.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paperWithList, researcherListCondition ).keyphraseDistributionScore ).toEqual(
			keyphraseDistributionResearcher( paperWithWords, researcherWordsCondition ).keyphraseDistributionScore );
	} );

	it( "returns the same result for a list of paragraphs as it does for a string of paragraphs", function() {
		const paragraphs = [
			"<p>This is step 1a of an instruction. This is step 1b of an instruction.</p>",
			"<p>This is step 2a. This is step 2b.</p>",
			"<p>This is step 3a. This is step 3b.</p>",
			"<p>This is step 4a. This is step 4b.</p>",
		];

		const paragraphsList = "<ul>\n" + paragraphs.map( paragraph => "<li>" + paragraph + "</li>\n" ).join( "" ) + "</ul>";
		const paragraphsString = paragraphs.join( " " );

		const paperWithList = new Paper(
			paragraphWithKeyphrase1 + paragraphsList + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const paperWithWords = new Paper(
			paragraphWithKeyphrase1 + paragraphsString + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const researcherListCondition = new Researcher( paperWithList );
		buildTree( paperWithList, researcherListCondition );
		researcherListCondition.addResearchData( "morphology", morphologyData );

		const researcherWordsCondition = new Researcher( paperWithWords );
		buildTree( paperWithWords, researcherWordsCondition );
		researcherWordsCondition.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paperWithList, researcherListCondition ).keyphraseDistributionScore ).toEqual(
			keyphraseDistributionResearcher( paperWithWords, researcherWordsCondition ).keyphraseDistributionScore );
	} );

	it( "returns the same result for a mixed list of paragraphs and sentences as it does for a string of paragraphs and sentences", function() {
		const paragraphsAndSentences = [
			"<p>This is step 1a of an instruction. This is step 1b of an instruction.</p>",
			"This is the short step 2.",
			"This is the short step 3.",
			"<p>This is step 4a. This is step 4b.</p>",
		];

		const paragraphsAndSentencesList = "<ul>\n" + paragraphsAndSentences.map( item => "<li>" + item + "</li>\n" ).join( "" ) + "</ul>";
		const paragraphsAndSentencesString = paragraphsAndSentences.join( " " );

		const paperWithList = new Paper(
			paragraphWithKeyphrase1 + paragraphsAndSentencesList + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const paperWithWords = new Paper(
			paragraphWithKeyphrase1 + paragraphsAndSentencesString + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const researcherListCondition = new Researcher( paperWithList );
		buildTree( paperWithList, researcherListCondition );
		researcherListCondition.addResearchData( "morphology", morphologyData );

		const researcherWordsCondition = new Researcher( paperWithWords );
		buildTree( paperWithWords, researcherWordsCondition );
		researcherWordsCondition.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paperWithList, researcherListCondition ).keyphraseDistributionScore ).toEqual(
			keyphraseDistributionResearcher( paperWithWords, researcherWordsCondition ).keyphraseDistributionScore );
	} );

	it( "returns the same result for a real world example list including various html tags as it does for version of that" +
		"text where all lists have been manually removed", function() {
		const realWordULExample1NoLists = "<p>Besides all of these great developments, you really should use the block editor" +
			" now and stop using the classic editor. Let me give you an overview of simple and clear reasons. With" +
			" the block editor:</p> You will be able to build layouts that you can’t make in TinyMCE." +
			" Most of the stuff we did for our" +
			"<a href=\"https://developer.yoast.com/digital-storytelling-in-the-age-of-blocks/\">recent digital story</a>" +
			" required <em>no coding</em>. Plugins like <a href=\"https://wordpress.org/plugins/grids/\">Grids</a> " +
			"make it even easier to make very smooth designs.  You can make FAQs and HowTo’s that’ll look awesome " +
			"in search results. <span style=\", sans-serif\">Our Yoast SEO Schema blocks are already providing an SEO " +
			"advantage that is unmatched. For instance, check out our free" +
			" <a href=\"https://yoast.com/how-to-build-an-faq-page/\">FAQ</a> and" +
			" <a href=\"https://yoast.com/wordpress/plugins/seo/howto-schema-content-block/\">How-to</a> blocks." +
			"</span>  Simple things like images next to paragraphs and other things that could be painful " +
			"in TinyMCE have become so much better in Gutenberg. Want multiple columns? You can have them, like that, " +
			"without extra coding.  Speaking of things you couldn’t do without plugins before: you can now embed" +
			" tables in your content, just by adding a table block. No plugins required.  Creating custom blocks" +
			" is relatively simple, and allows people to do 90% of the custom things they would do with plugins in the " +
			"past, but easier. It becomes even easier when you use a plugin like " +
			"<a href=\"https://www.advancedcustomfields.com/pro/\">ACF Pro</a> or <a href=\"https://getblocklab.com\">" +
			"Block Lab</a> to build those custom blocks.  Custom blocks, or blocks you’ve added with plugins, " +
			"can be easily found by users just by clicking the + sign in the editor. Shortcodes, in the classic editor, " +
			"didn’t have such a discovery method.  Re-usable blocks allow you to easily create content you can " +
			"re-use across posts or pages, see this" +
			" <a href=\"https://www.wpbeginner.com/beginners-guide/how-to-create-a-reusable-block-in-wordpress/\">nice " +
			"tutorial on WP Beginner</a>. <p>There are many more nice features; please share yours in the comments!</p>";

		const paperWithList = new Paper(
			realWorldULExample1,
			{
				locale: "en_EN",
				keyword: "block editor",
			}
		);
		const paperWithWords = new Paper(
			realWordULExample1NoLists,
			{
				locale: "en_EN",
				keyword: "block editor",
			}
		);
		// console.log( { text2: paperWithWords.getText() } );
		const researcherListCondition = new Researcher( paperWithList );
		buildTree( paperWithList, researcherListCondition );
		researcherListCondition.addResearchData( "morphology", morphologyData );

		const researcherWordsCondition = new Researcher( paperWithWords );
		buildTree( paperWithWords, researcherWordsCondition );
		researcherWordsCondition.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paperWithList, researcherListCondition ).keyphraseDistributionScore ).toEqual(
			keyphraseDistributionResearcher( paperWithWords, researcherWordsCondition ).keyphraseDistributionScore );
	} );

	it( "returns the same result for a real world example with nested lists as it does for a string version of that" +
		"text where all lists have been manually removed", function() {
		const realWordULExample2NoLists = " On the <strong>General</strong> tab: Make sure your store address is " +
			"correct and that you’ve limited selling to your country and location  Enable or disable tax calculation if" +
			" needed  Enable or disable the use of coupon codes if needed  Pick the correct currency " +
			"  On the <strong>Product</strong> tab: Select the page where you want the shop to appear " +
			" Want users to leave reviews on your product? Activate that option here " +
			" On Inventory: Disable stock management unless you need it  " +
			" On the <strong>Payments</strong> tab: Pick an easy payment option, like cash on delivery or bank" +
			" transfer  If needed, you can add more complex payment providers like PayPal  " +
			" On the <strong>Accounts</strong> tab: Allow guest checkout " +
			" Allow account creation if needed  Select the Privacy policy " +
			" Review the other options on this page carefully, you may need them " +
			"  On the <strong>Emails</strong> tab: Check the different email templates and activate" +
			" the ones you want to use. For every email, change the text to match what you want to say " +
			" Scroll down to check the sender options  Also adapt the email template to fit your brand " +
			"  Skip the <strong>Integrations</strong> tab  On the <strong>Advanced</strong> tab:" +
			" Map the essential pages for your shop, i.e. the cart, checkout, account page and terms and conditions." +
			" You can make these pages in WordPress: Add the `[woocommerce_cart]` shortcode to the cart page " +
			" Add the `[woocommerce_checkout]` shortcode to the checkout page  Place the " +
			"`[woocommerce_my_account]`  shortcode to the account page   ";

		const paperWithList = new Paper(
			realWorldULExample2,
			{
				locale: "en_EN",
				keyword: "shop",
			}
		);

		const paperWithWords = new Paper(
			realWordULExample2NoLists,
			{
				locale: "en_EN",
				keyword: "shop",
			}
		);

		const researcherListCondition = new Researcher( paperWithList );
		buildTree( paperWithList, researcherListCondition );
		researcherListCondition.addResearchData( "morphology", morphologyData );

		const researcherWordsCondition = new Researcher( paperWithWords );
		buildTree( paperWithWords, researcherWordsCondition );
		researcherWordsCondition.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paperWithList, researcherListCondition ).keyphraseDistributionScore ).toEqual(
			keyphraseDistributionResearcher( paperWithWords, researcherWordsCondition ).keyphraseDistributionScore );
	} );
} );

describe( "a test for exact match of keyphrase in English", () => {
	const exactMatchSentences = [
		"Giant pandas conservation efforts have significantly improved their survival prospects over the past few decades.",
		"These giant pandas conservation efforts include the creation of more than 60 protected reserves in China. The reserves safeguard essential bamboo forest habitats.",
		"Breeding programs, habitat restoration, and international partnerships are all key components of the conservation efforts of giant pandas. They help to boost both wild and captive populations.",
		"The Chinese government, along with global wildlife organizations, continues to prioritize these initiatives. This will help to ensure long-term species stability.",
		"As a result of sustained conservation efforts of giant pandas, the IUCN reclassified the species from “Endangered” to “Vulnerable” in 2016.",
		"Ongoing monitoring and community engagement remain crucial to maintaining this conservation success. In 2020, the giant panda population of the new national park was already above 1,800 individuals. " +
		"That's roughly 80 percent of the entire panda population in China. Establishing the new protected area in the Sichuan Province also gives various other endangered or threatened species, like the Siberian tiger, the possibility to improve their living conditions by offering them a habitat. " +
		"Other species who benefit from the protection of its habitat include the snow leopard, the golden snub-nosed monkey, the red panda and the complex-toothed flying squirrel. " +
		"In July 2021, Chinese conservation authorities announced that giant pandas are no longer endangered in the wild following years of conservation efforts, with a population in the wild exceeding 1,800." +
		" China has received international praise for its conservation of the species, which has also helped the country establish itself as a leader in endangered species conservation.",
	];
	it( "should only match the exact keyphrase in the text when the focus keyphrase is in double quotes", function() {
		const text = exactMatchSentences.join( " " );
		// The paper contains 15 sentences and a maximum distraction of 13 sentences.
		const paper = new Paper( text, { keyword: "\"giant pandas conservation efforts\"" } );
		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			// 13/15*100 = 86.66666666666667.
			keyphraseDistributionScore: 86.66666666666667,
			sentencesToHighlight: [
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Giant pandas conservation efforts</yoastmark> have significantly improved their survival prospects over the past few decades.",
					original: "Giant pandas conservation efforts have significantly improved their survival prospects over the past few decades.",
					position: {
						attributeId: "", clientId: "", endOffset: 33, endOffsetBlock: 33, isFirstSection: false, startOffset: 0, startOffsetBlock: 0,
					},
				} ),
				new Mark( {
					marked: " These <yoastmark class='yoast-text-mark'>giant pandas conservation efforts</yoastmark> include the creation of more than 60 protected reserves in China.",
					original: " These giant pandas conservation efforts include the creation of more than 60 protected reserves in China.",
					position: {
						attributeId: "", clientId: "", endOffset: 153, endOffsetBlock: 153, isFirstSection: false, startOffset: 120, startOffsetBlock: 120,
					},
				} ) ],
		} );
	} );
	it( "should match all forms of the keyphrase in the text when the focus keyphrase is not in double quotes", function() {
		const text = exactMatchSentences.join( " " );
		// The paper contains 15 sentences and a maximum distraction of 3 sentences.
		const paper = new Paper( text, { keyword: "giant pandas conservation efforts" } );
		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			// 3/15*100 = 20.
			keyphraseDistributionScore: 20,
			sentencesToHighlight: [
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Giant pandas conservation efforts</yoastmark> have significantly improved their survival prospects over the past few decades.",
					original: "Giant pandas conservation efforts have significantly improved their survival prospects over the past few decades.",
					position: {
						attributeId: "", clientId: "", endOffset: 33, endOffsetBlock: 33, isFirstSection: false, startOffset: 0, startOffsetBlock: 0,
					},
				} ),
				new Mark( {
					marked: " These <yoastmark class='yoast-text-mark'>giant pandas conservation efforts</yoastmark> include the creation of more than 60 protected reserves in China.",
					original: " These giant pandas conservation efforts include the creation of more than 60 protected reserves in China.",
					position: {
						attributeId: "", clientId: "", endOffset: 153, endOffsetBlock: 153, isFirstSection: false, startOffset: 120, startOffsetBlock: 120,
					},
				} ),
				new Mark( {
					marked: " Breeding programs, habitat restoration, and international partnerships are all key components of the <yoastmark class='yoast-text-mark'>conservation efforts</yoastmark> of <yoastmark class='yoast-text-mark'>giant pandas</yoastmark>.",
					original: " Breeding programs, habitat restoration, and international partnerships are all key components of the conservation efforts of giant pandas.",
					position: {
						attributeId: "", clientId: "", endOffset: 398, endOffsetBlock: 398, isFirstSection: false, startOffset: 378, startOffsetBlock: 378,
					},
				} ),
				new Mark( {
					marked: " Breeding programs, habitat restoration, and international partnerships are all key components of the <yoastmark class='yoast-text-mark'>conservation efforts</yoastmark> of <yoastmark class='yoast-text-mark'>giant pandas</yoastmark>.",
					original: " Breeding programs, habitat restoration, and international partnerships are all key components of the conservation efforts of giant pandas.",
					position: {
						attributeId: "", clientId: "", endOffset: 414, endOffsetBlock: 414, isFirstSection: false, startOffset: 402, startOffsetBlock: 402,
					},
				} ),
				new Mark( {
					marked: " As a result of sustained <yoastmark class='yoast-text-mark'>conservation efforts</yoastmark> of <yoastmark class='yoast-text-mark'>giant pandas</yoastmark>, the IUCN reclassified the species from “Endangered” to “Vulnerable” in 2016.",
					original: " As a result of sustained conservation efforts of giant pandas, the IUCN reclassified the species from “Endangered” to “Vulnerable” in 2016.",
					position: {
						attributeId: "", clientId: "", endOffset: 678, endOffsetBlock: 678, isFirstSection: false, startOffset: 658, startOffsetBlock: 658,
					},
				} ),
				new Mark( {
					marked: " As a result of sustained <yoastmark class='yoast-text-mark'>conservation efforts</yoastmark> of <yoastmark class='yoast-text-mark'>giant pandas</yoastmark>, the IUCN reclassified the species from “Endangered” to “Vulnerable” in 2016.",
					original: " As a result of sustained conservation efforts of giant pandas, the IUCN reclassified the species from “Endangered” to “Vulnerable” in 2016.",
					position: {
						attributeId: "", clientId: "", endOffset: 694, endOffsetBlock: 694, isFirstSection: false, startOffset: 682, startOffsetBlock: 682,
					},
				} ),
				new Mark( {
					marked: " In 2020, the <yoastmark class='yoast-text-mark'>giant panda</yoastmark> population of the new national park was already above 1,800 individuals.",
					original: " In 2020, the giant panda population of the new national park was already above 1,800 individuals.",
					position: {
						attributeId: "", clientId: "", endOffset: 898, endOffsetBlock: 898, isFirstSection: false, startOffset: 887, startOffsetBlock: 887,
					},
				} ),
				new Mark( {
					marked: " In July 2021, Chinese <yoastmark class='yoast-text-mark'>conservation</yoastmark> authorities announced that <yoastmark class='yoast-text-mark'>giant pandas</yoastmark> are no longer endangered in the wild following years of <yoastmark class='yoast-text-mark'>conservation efforts</yoastmark>, with a population in the wild exceeding 1,800.",
					original: " In July 2021, Chinese conservation authorities announced that giant pandas are no longer endangered in the wild following years of conservation efforts, with a population in the wild exceeding 1,800.",
					position: {
						attributeId: "", clientId: "", endOffset: 1468, endOffsetBlock: 1468, isFirstSection: false, startOffset: 1456, startOffsetBlock: 1456,
					},
				} ),
				new Mark( {
					marked: " In July 2021, Chinese <yoastmark class='yoast-text-mark'>conservation</yoastmark> authorities announced that <yoastmark class='yoast-text-mark'>giant pandas</yoastmark> are no longer endangered in the wild following years of <yoastmark class='yoast-text-mark'>conservation efforts</yoastmark>, with a population in the wild exceeding 1,800.",
					original: " In July 2021, Chinese conservation authorities announced that giant pandas are no longer endangered in the wild following years of conservation efforts, with a population in the wild exceeding 1,800.",
					position: {
						attributeId: "", clientId: "", endOffset: 1508, endOffsetBlock: 1508, isFirstSection: false, startOffset: 1496, startOffsetBlock: 1496,
					},
				} ),
				new Mark( {
					marked: " In July 2021, Chinese <yoastmark class='yoast-text-mark'>conservation</yoastmark> authorities announced that <yoastmark class='yoast-text-mark'>giant pandas</yoastmark> are no longer endangered in the wild following years of <yoastmark class='yoast-text-mark'>conservation efforts</yoastmark>, with a population in the wild exceeding 1,800.",
					original: " In July 2021, Chinese conservation authorities announced that giant pandas are no longer endangered in the wild following years of conservation efforts, with a population in the wild exceeding 1,800.",
					position: {
						attributeId: "", clientId: "", endOffset: 1585, endOffsetBlock: 1585, isFirstSection: false, startOffset: 1565, startOffsetBlock: 1565,
					},
				} ),
			],
		} );
	} );
} );


const testData = [
	{
		description: "keyphrase in uppercase with a period 'ASP.NET' and its exact match is found in the text",
		text: "An example text. What is ASP.NET.",
		keyphrase: "ASP.NET",
		expected: {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " What is <yoastmark class='yoast-text-mark'>ASP.NET</yoastmark>.",
					original: " What is ASP.NET.",
					position: {
						attributeId: "", clientId: "", endOffset: 32, endOffsetBlock: 32, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ) ],
		},
	},
	{
		description: "keyphrase in uppercase with a period 'ASP.NET' and its match in different case 'ASP.net' is found in the text",
		text: "An example text. What is ASP.net.",
		keyphrase: "ASP.NET",
		expected: {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " What is <yoastmark class='yoast-text-mark'>ASP.net</yoastmark>.",
					original: " What is ASP.net.",
					position: {
						attributeId: "", clientId: "", endOffset: 32, endOffsetBlock: 32, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ) ],
		},
	},
	{
		description: "keyphrase in uppercase with a period 'ASP.NET' and its match in different case 'asp.NET' is found in the text",
		text: "An example text. What is asp.NET?",
		keyphrase: "ASP.NET",
		expected: {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " What is <yoastmark class='yoast-text-mark'>asp.NET</yoastmark>?",
					original: " What is asp.NET?",
					position: {
						attributeId: "", clientId: "", endOffset: 32, endOffsetBlock: 32, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ) ],
		},

	},
	{
		description: "keyphrase in uppercase with a period 'ASP.NET' and its match in different case 'asp.net' is found in the text",
		text: "An example text. What is asp.net.",
		keyphrase: "ASP.NET",
		expected: {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " What is <yoastmark class='yoast-text-mark'>asp.net</yoastmark>.",
					original: " What is asp.net.",
					position: {
						attributeId: "", clientId: "", endOffset: 32, endOffsetBlock: 32, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ) ],
		},
	},
];

describe.each( testData )( "a test for keyphrase containing a period", ( { description, text, keyphrase, expected } ) => {
	const testDescription = `returns the result for ${description}`;
	it( testDescription, () => {
		const paper = new Paper( text, { keyword: keyphrase } );
		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( expected );
	} );
} );

const testDataExactMatch = [
	{
		description: "keyphrase in double quote with a period '\"ASP.NET\"' and its exact match is found in the text",
		text: "An example text. What is ASP.NET.",
		keyphrase: "\"ASP.NET\"",
		expected: {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " What is <yoastmark class='yoast-text-mark'>ASP.NET</yoastmark>.",
					original: " What is ASP.NET.",
					position: {
						attributeId: "", clientId: "", endOffset: 32, endOffsetBlock: 32, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ) ],
		},
	},
	{
		description: "keyphrase in double quote with a period '\"ASP.NET\"' and its match in different case 'ASP.net' is found in the text",
		text: "An example text. What is ASP.net.",
		keyphrase: "\"ASP.NET\"",
		expected: {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " What is <yoastmark class='yoast-text-mark'>ASP.net</yoastmark>.",
					original: " What is ASP.net.",
					position: {
						attributeId: "", clientId: "", endOffset: 32, endOffsetBlock: 32, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ) ],
		},
	},
	{
		description: "keyphrase in double quote with a period '\"ASP.NET\"' and its match in different case 'asp.NET' is found in the text",
		text: "An example text. What is asp.NET?",
		keyphrase: "\"ASP.NET\"",
		expected: {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " What is <yoastmark class='yoast-text-mark'>asp.NET</yoastmark>?",
					original: " What is asp.NET?",
					position: {
						attributeId: "", clientId: "", endOffset: 32, endOffsetBlock: 32, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ) ],
		},
	},
	{
		description: "keyphrase in double quote with a period '\"ASP.NET\"' and its match in different case 'asp.net' is found in the text",
		text: "An example text. What is asp.net.",
		keyphrase: "\"ASP.NET\"",
		expected: {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: " What is <yoastmark class='yoast-text-mark'>asp.net</yoastmark>.",
					original: " What is asp.net.",
					position: {
						attributeId: "", clientId: "", endOffset: 32, endOffsetBlock: 32, isFirstSection: false, startOffset: 25, startOffsetBlock: 25,
					},
				} ) ],
		},
	},
];
describe.each( testDataExactMatch )( "a test for keyphrase containing a period in double quotation marks", ( { description, text, keyphrase, expected } ) => {
	const testDescription = `returns the result for ${description}`;
	it( testDescription, () => {
		const paper = new Paper( text, { keyword: keyphrase } );
		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( expected );
	} );
} );

describe( "Test for the research for Japanese language", function() {
	const japaneseSentences = "私はペットとして2匹の猫を飼っています。" +
		"どちらもとても可愛くて甘い猫で、猫の餌を食べるのが大好きです。" +
		"彼らが好きなタイプの猫用フードは新鮮なものです。" +
		"加工が少ない猫用食品の一種。会リレメミ育1世び梨思少愛レニ年訴野公キエ艦渡トわ顔来レミ情1心み保職ヌカワフ食掲じ責写ち昭北ほせ提権責岳犠ぶれラつ。" +
		"移田検紀りてべ歩読ツマワ交地ナシ西気にご周県ッっラえ余全ぎぜ刊出セホウメ毎知んも目治フヤトレ社2目ー情申し説病花飛便まレづ。" +
		"創ノヘヤセ番置ニ色康23最夜ごげぎお上点けぞーも扱員ノソユ津勢ょ再患レテミ属込オ語1阜賢取うつフね。" +
		"団ざぐぴ積5系け驚記次ゆ横室ヌ宗越ぶ野号よつドみ県69続ちそレ文披メオトナ試提キ降何徳リでうぎ。" +
		"抵らべ三書け保的びせ給初サリ新向クはお横麻はい文載ぐやご区治じふ山検えクべ人再ウ新免どほみ治編ヘ残東74具央紹舞72霊載3思近友批曜ゆ。" +
		"一山ヱリケラ秒削和ヱホ通質ムロカ養問ヌワフレ属一に大井ネ間冷哲ロ東三はごえ朴年拡ス稼力ろえル渡急ルサ基光キミリ反孝レぶ。" +
		"以ヨ弁南ば開存ゆ表続ユ崩気ドわな蔵問レ万24行芸レ旅持れき弾育ト度窃90北よくつ受幅採洋敢ぶづさ。" +
		"帯うごじほ変事めむいラ育壁レでや玲場たぱわ界軽社こづが上問故7更テ化方をラクな津真ゅふー面毎処かーゅげ。" +
		"禁アロカヲ能力思ぶず禁政ぴむあぞ真定カノハ外端ろド品世ょゆ記図能退ゃやスれ加近ツクヒタ優的シヘセ済邦ミ年重ユマル以庁えかざ。" +
		"能ムヒテ文使ぜで体室ずスッ特飛大メフレ坂連減ラひせ記羊ヒテユヱ界機あずはぼ時場が転稲よ利置生なゆ多多ド確覧ぴレが界華ム季必イルゃ良政厳ぜずす井転リ訪也極番技しぎぴ。" +
		"部ンへ大罪こ明技チルメ一挙ヌハ覚教うあせル年故点タル杖1課れでリ闘変だ充個記ヒフタ発58景離派28討ラ円庫提阪タ摘焦茂急けやちッ。";

	it( "returns a score over all sentences and all topic forms (short topic); returns markers for sentences that contain the topic " +
		"(when morphology data is available)", function() {
		// The text has 15 sentences and a maximum distraction of 11 sentences.
		const paper = new Paper(
			japaneseSentences,
			{
				locale: "ja",
				keyword: "猫餌",
				synonyms: "猫用フード, 猫用食品",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		researcher.addResearchData( "morphology", morphologyDataJA );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			// 11/15*100 = 73.33333333333333.
			keyphraseDistributionScore: 73.33333333333333,
			sentencesToHighlight: [
				new Mark( {
					marked: "彼らが好きなタイプの<yoastmark class='yoast-text-mark'>猫用</yoastmark><yoastmark class='yoast-text-mark'>フード</yoastmark>は新鮮なものです。",
					original: "彼らが好きなタイプの猫用フードは新鮮なものです。",
				} ),
				new Mark( {
					marked: "加工が少ない<yoastmark class='yoast-text-mark'>猫用</yoastmark><yoastmark class='yoast-text-mark'>食品</yoastmark>の一種。",
					original: "加工が少ない猫用食品の一種。",
				} ),
			],
		} );
	} );

	it( "returns the same score when function words are added", function() {
		const paper = new Paper(
			japaneseSentences,
			{
				locale: "ja",
				keyword: "猫の餌",
				synonyms: "猫用フード, 猫用食品",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 73.33333333333333,
			sentencesToHighlight: [
				new Mark( {
					marked: "どちらもとても可愛くて甘い<yoastmark class='yoast-text-mark'>猫</yoastmark>で、<yoastmark class='yoast-text-mark'>猫</yoastmark>" +
						"の<yoastmark class='yoast-text-mark'>餌</yoastmark>を食べるのが大好きです。",
					original: "どちらもとても可愛くて甘い猫で、猫の餌を食べるのが大好きです。",
				} ),
				new Mark( {
					marked: "彼らが好きなタイプの<yoastmark class='yoast-text-mark'>猫用</yoastmark><yoastmark class='yoast-text-mark'>フード</yoastmark>は新鮮なものです。",
					original: "彼らが好きなタイプの猫用フードは新鮮なものです。",
				} ),
				new Mark( {
					marked: "加工が少ない<yoastmark class='yoast-text-mark'>猫用</yoastmark><yoastmark class='yoast-text-mark'>食品</yoastmark>の一種。",
					original: "加工が少ない猫用食品の一種。",
				} ),
			],
		} );
	} );

	const japaneseSentencesExactMatch = "猫餌猫が食べるものです。" +
		"どちらもとても可愛くて甘い猫で、のような猫猫用フード。" +
		"彼らが好きなタイプの猫用フードは新鮮なものです。" +
		"加工が少ない猫用食品の一種。";


	it( "returns a score over all sentences and all topic forms (short topic); returns markers for sentences that contain the keyphrase " +
		"in single quotation marks", function() {
		const paper = new Paper(
			japaneseSentencesExactMatch,
			{
				locale: "ja",
				keyword: "「猫餌」",
				synonyms: "「猫用フード」,「猫用食品」",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyDataJA );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>猫餌</yoastmark>猫が食べるものです。",
					original: "猫餌猫が食べるものです。",
				} ),
				new Mark( {
					marked: "どちらもとても可愛くて甘い猫で、のような猫<yoastmark class='yoast-text-mark'>猫用フード</yoastmark>。",
					original: "どちらもとても可愛くて甘い猫で、のような猫猫用フード。",
				} ),
				new Mark( {
					marked: "彼らが好きなタイプの<yoastmark class='yoast-text-mark'>猫用フード</yoastmark>は新鮮なものです。",
					original: "彼らが好きなタイプの猫用フードは新鮮なものです。",
				} ),
				new Mark( {
					marked: "加工が少ない<yoastmark class='yoast-text-mark'>猫用食品</yoastmark>の一種。",
					original: "加工が少ない猫用食品の一種。",
				} ),
			],
		} );
	} );

	it( "returns a score over all sentences and all topic forms (short topic); returns markers for sentences that contain the keyphrase " +
		"in double quotation marks", function() {
		const paper = new Paper(
			japaneseSentencesExactMatch,
			{
				locale: "ja",
				keyword: "『猫餌』",
				synonyms: "『猫用フード』,『猫用食品』",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyDataJA );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>猫餌</yoastmark>猫が食べるものです。",
					original: "猫餌猫が食べるものです。",
				} ),
				new Mark( {
					marked: "どちらもとても可愛くて甘い猫で、のような猫<yoastmark class='yoast-text-mark'>猫用フード</yoastmark>。",
					original: "どちらもとても可愛くて甘い猫で、のような猫猫用フード。",
				} ),
				new Mark( {
					marked: "彼らが好きなタイプの<yoastmark class='yoast-text-mark'>猫用フード</yoastmark>は新鮮なものです。",
					original: "彼らが好きなタイプの猫用フードは新鮮なものです。",
				} ),
				new Mark( {
					marked: "加工が少ない<yoastmark class='yoast-text-mark'>猫用食品</yoastmark>の一種。",
					original: "加工が少ない猫用食品の一種。",
				} ),
			],
		} );
	} );

	it( "doesn't count non-exact matches of a keyphrase when an exact match is requested", function() {
		const paper = new Paper(
			"小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。野生のハーブの刺繡。",
			{
				locale: "ja",
				keyword: "『小さい花の刺繍』",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyDataJA );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 100,
			sentencesToHighlight: [],
		} );
	} );

	it( "doesn't count non-exact matches of a synonym when an exact match is requested", function() {
		const paper = new Paper(
			"小さくて可愛い花の刺繍に関する一般一般の記事です。私は美しい猫を飼っています。野生のハーブの刺繡。",
			{
				locale: "ja",
				keyword: "犬",
				synonyms: "『小さい花の刺繍』",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyDataJA );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 100,
			sentencesToHighlight: [],
		} );
	} );

	it( "when no keyphrase or synonyms is used in the text at all", function() {
		const paper = new Paper(
			japaneseSentences,
			{
				locale: "ja",
				keyword: "香りのよい花",
				synonyms: "香り花",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 100,
			sentencesToHighlight: [],
		} );
	} );

	it( "returns the result for long topic (longer than 7 characters)", function() {
		const paper = new Paper(
			"彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。しかし、それは在庫切れでした。",
			{
				locale: "ja",
				keyword: "黒の長袖マキシドレス",
				synonyms: "シノニム",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 10,
			sentencesToHighlight: [
				new Mark( {
					marked: "彼女はオンラインストアで<yoastmark class='yoast-text-mark'>黒</yoastmark>の<yoastmark class='yoast-text-mark'>長袖</yoastmark>" +
						"<yoastmark class='yoast-text-mark'>マキシドレス</yoastmark>を購入したかった。",
					original: "彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。",
				} ),
			],
		} );
	} );

	it( "returns the result for keyword with 5 characters, all characters should be present to be considered a match", function() {
		// All the characters in the keyphrase are present in the first sentence, but not in the second sentence.
		const paper = new Paper(
			"彼は新しい車を買いました。その車はとても速いです。",
			{
				locale: "ja",
				keyword: "新しい車",
				synonyms: "シノニム",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		expect( keyphraseDistributionResearcher( paper, researcher ).keyphraseDistributionScore ).toEqual( 10 );
	} );

	it( "returns the result for keyword longer than 7 characters but shorter than 4 words: at least 50% of the keyphrase should be found", function() {
		// Not all the characters in the keyphrase are present in either sentence.
		const paper = new Paper(
			"彼は新しい車を買いました。レッサーパンダの保護。",
			{
				locale: "ja",
				keyword: "世界におけるレッサーパンダの保護",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		expect( keyphraseDistributionResearcher( paper, researcher ).keyphraseDistributionScore ).toEqual( 10 );
	} );
} );

