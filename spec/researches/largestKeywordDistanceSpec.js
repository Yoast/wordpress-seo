import { computeScoresPerSentenceShortTopic } from "../../src/researches/largestKeywordDistance.js";
import { computeScoresPerSentenceLongTopic } from "../../src/researches/largestKeywordDistance.js";
import { maximizeSentenceScores } from "../../src/researches/largestKeywordDistance.js";
import { step } from "../../src/researches/largestKeywordDistance.js";
import { largestKeywordDistanceResearcher } from "../../src/researches/largestKeywordDistance.js";
import Paper from "../../src/values/Paper.js";
import Researcher from "../../src/researcher";
import morphologyData from "../../src/morphology/morphologyData.json";

describe( "Test for maximizing sentence scores", function() {
	it( "returns the largest score per sentence over all topics", function() {
		const inputArray = [
			[ 1, 2, 3 ],
			[ 10, 0, -3 ],
			[ 4, 5, 6 ],
			[ 100, 2, 0 ],
			[ 7, 8, 9 ],
		];

		const expectedOutput = [ 100, 8, 9 ];

		expect( maximizeSentenceScores( inputArray ) ).toEqual( expectedOutput );
	} );

	it( "returns the largest score per sentence over all topics", function() {
		const inputArray = [
			[ 0, 0, 0 ],
			[ 5, 4, 1 ],
			[ 2, 10, -3 ],
		];

		const expectedOutput = [ 5, 10, 1 ];

		expect( maximizeSentenceScores( inputArray ) ).toEqual( expectedOutput );
	} );
} );

const sentences = [
	"How remarkable!",
	"Remarkable is a funny word.",
	"I have found a key and a remarkable word.",
	"And again a key something.",
	"Here comes something that has nothing to do with a keyword.",
	"Ha, a key!",
	"Again nothing!",
	"Words, words, words, how boring!",
];

const topicShort = [
	[ "key", "keys" ],
	[ "word", "words" ],
];

const topicLong = [
	[ "key", "keys" ],
	[ "word", "words" ],
	[ "remarkable", "remarkables", "remarkably" ],
	[ "something", "somethings" ],
];


describe( "Test for computing the sentence score", function() {
	it( "for a short topic", function () {
		expect(computeScoresPerSentenceShortTopic( topicShort, sentences, "en_EN" ) ).toEqual( [ 3, 6, 9, 6, 3, 6, 3, 6 ] );
	} );

	it( "for a long topic", function () {
		expect(computeScoresPerSentenceLongTopic( topicLong, sentences, "en_EN" ) ).toEqual( [ 6, 6, 9, 6, 6, 6, 3, 6 ] );
	} );
} );

const inputSentenceScores = [ 1, 5, 7, 2, 4, 9, 1, 1, 1, 4, 1, 9 ];
describe( "Test for computing the step function", function() {
	it( "Returns the scores for the hypothetical text with a 3-sentence window", function () {
		expect(step( inputSentenceScores, 3 ) ).toEqual( [ 13/3, 14/3, 13/3, 15/3, 14/3, 11/3, 3/3, 6/3, 6/3, 14/3 ] );
	} );
	it( "Returns the scores for the hypothetical text with a 5-sentence window", function () {
		expect(step( inputSentenceScores, 5 ) ).toEqual( [  19/5, 27/5, 23/5, 17/5, 16/5, 16/5, 8/5, 16/5 ] );
	} );
} );

const wordForms = [ "word", "words", "word's", "words's", "words'", "wording", "worded", "wordly", "worder", "wordest",
	"word‘s", "word’s", "word‛s", "word`s", "words‘s", "words’s", "words‛s", "words`s", "words‘", "words’", "words‛", "words`" ];
const keyForms = [ "key", "keys", "key's", "keys's", "keys'", "keying", "keyed", "keyly", "keyer", "keyest", "key‘s",
	"key’s", "key‛s", "key`s", "keys‘s", "keys’s", "keys‛s", "keys`s", "keys‘", "keys’", "keys‛", "keys`" ];
const remarkableForms = [ "remarkable", "remarkables", "remarkable's", "remarkables's", "remarkables'", "remarkabling",
	"remarkabled", "remarkably", "remarkable‘s", "remarkable’s", "remarkable‛s", "remarkable`s", "remarkables‘s",
	"remarkables’s", "remarkables‛s", "remarkables`s", "remarkables‘", "remarkables’", "remarkables‛", "remarkables`" ];
const somethingForms = [ "something", "somethings", "something's", "somethings's", "somethings'", "someth",
	"someths", "somethed", "somethingly", "something‘s", "something’s", "something‛s", "something`s", "somethings‘s",
	"somethings’s","somethings‛s", "somethings`s", "somethings‘", "somethings’", "somethings‛", "somethings`" ];

describe( "Test for a step-function research", function() {
	it( "returns an average score over all sentences and all topic forms ", function () {
		const paper = new Paper(
			sentences.join( " " ),
			{
				locale: "en_EN",
				keyword: "key word",
				synonyms: "remarkable, something, word",

			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );

		expect( largestKeywordDistanceResearcher( paper, researcher ) ).toEqual( {
			averageScore: 7.8,
			formsToHighlight: keyForms.concat( wordForms, remarkableForms, somethingForms ),
		} )
	} );
} );