import { computeScoresPerSentenceShortTopic } from "../../src/researches/keyphraseDistribution.js";
import { computeScoresPerSentenceLongTopic } from "../../src/researches/keyphraseDistribution.js";
import { maximizeSentenceScores } from "../../src/researches/keyphraseDistribution.js";
import { step } from "../../src/researches/keyphraseDistribution.js";
import { keyphraseDistributionResearcher } from "../../src/researches/keyphraseDistribution.js";
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

const sentencesIT = [
	"Che cosa straordinaria!",
	"Straordinaria è una parola strana.",
	"Ho trovato una chiave e una parola straordinaria.",
	"E ancora una chiave e qualcosa.",
	"È qualcosa che non ha niente da fare con questo che cerchiamo.",
	"Ah, una chiave!",
	"Ancora niente!",
	"Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
];

const topicShortIT = [
	[ "parola" ],
	[ "chiave" ],
];

const topicLongIT = [
	[ "parola" ],
	[ "chiave" ],
	[ "straordinaria" ],
	[ "qualcosa" ],
];


describe( "Test for computing the sentence score", function() {
	it( "for a short topic", function() {
		expect( computeScoresPerSentenceShortTopic( topicShort, sentences, "en_EN" ) ).toEqual( [ 0, 6, 9, 6, 0, 6, 0, 6 ] );
	} );

	it( "for a long topic", function() {
		expect( computeScoresPerSentenceLongTopic( topicLong, sentences, "en_EN" ) ).toEqual( [ 6, 6, 9, 6, 6, 6, 0, 6 ] );
	} );

	it( "for a short topic for a language that doesn't support morphology", function() {
		expect( computeScoresPerSentenceShortTopic( topicShortIT, sentencesIT, "it_IT" ) ).toEqual( [ 0, 6, 9, 6, 0, 6, 0, 6 ] );
	} );

	it( "for a long topic for a language that doesn't support morphology", function() {
		expect( computeScoresPerSentenceLongTopic( topicLongIT, sentencesIT, "it_IT" ) ).toEqual( [ 6, 6, 9, 6, 6, 6, 0, 6 ] );
	} );
} );

const inputSentenceScores = [ 1, 5, 7, 2, 4, 9, 1, 1, 1, 4, 1, 9 ];
describe( "Test for computing the step function", function() {
	it( "Returns the scores for the hypothetical text with a 3-sentence window", function() {
		expect( step( inputSentenceScores, 3 ) ).toEqual( [ 13 / 3, 14 / 3, 13 / 3, 15 / 3, 14 / 3, 11 / 3, 3 / 3, 6 / 3, 6 / 3, 14 / 3 ] );
	} );
	it( "Returns the scores for the hypothetical text with a 5-sentence window", function() {
		expect( step( inputSentenceScores, 5 ) ).toEqual( [  19 / 5, 27 / 5, 23 / 5, 17 / 5, 16 / 5, 16 / 5, 8 / 5, 16 / 5 ] );
	} );
} );

describe( "Test for a step-function research", function() {
	it( "returns an average score over all sentences and all topic forms; returns markers for sentences that don't contain the topic at all", function() {
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

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.12222222222222222,
			sentencesToHighlight: [ "Again nothing!" ],
		} );
	} );

	it( "returns the same score when function words are added", function() {
		const paper = new Paper(
			sentences.join( " " ),
			{
				locale: "en_EN",
				keyword: "the key word",
				/*
				 * No function word has been added to something; something is already a function word. In topics
				 * that solely consist of function words, these words are not filtered. Therefore adding another
				 * function word to "something" would change the result because it would get analyzed like a content word.
				 */
				synonyms: "such remarkable, something, very word",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.12222222222222222,
			sentencesToHighlight: [ "Again nothing!" ],
		} );
	} );

	it( "returns an average score (for a language without morphology support) over all sentences and all topic forms; returns markers for sentences that don't contain the topic at all", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
			{
				locale: "it_IT",
				keyword: "parola chiave",
				synonyms: "straordinaria, qualcosa, parola",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.12222222222222222,
			sentencesToHighlight: [ "Ancora niente!" ],
		} );
	} );

	it( "returns the same score when function words are added (for a language without morphological support, but with function words)", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
			{
				locale: "it_IT",
				keyword: "la parola chiave",
				synonyms: "tanta straordinaria, qualcosa, molto parola",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.12222222222222222,
			sentencesToHighlight: [ "Ancora niente!" ],
		} );
	} );

	it( "when the topic words don't contain function words, returns the same score for a language without morphological support when that language is set to a locale without function words ", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
			{
				// Fictitious locale that doesn't have function word support.
				locale: "xx_XX",
				keyword: "parola chiave",
				/*
				 * Since there are only content words the score doesn't change.
				 * (Qualcosa is technically a function word but is analyzed as a content word here since it's the
				 * only word in the synonym.)
				 */
				synonyms: "straordinaria, qualcosa, parola",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.12222222222222222,
			sentencesToHighlight: [ "Ancora niente!" ],
		} );
	} );

	it( "when the topic words contain function words, returns a different score for a language without morphological support when that language is set to a locale without function words", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
			{
				// Fictitious locale that doens't have function word support.
				locale: "xx_XX",
				keyword: "la parola chiave",
				// The added function words are now analyzed as content words, so the score changes.
				synonyms: "tanta straordinaria, qualcosa, molto parola",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchDataProvider( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.13157894736842105,
			sentencesToHighlight: [ "Ancora niente!" ],
		} );
	} );
} );
