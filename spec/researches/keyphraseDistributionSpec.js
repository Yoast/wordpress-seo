import { computeScoresPerSentenceShortTopic } from "../../src/researches/keyphraseDistribution.js";
import { computeScoresPerSentenceLongTopic } from "../../src/researches/keyphraseDistribution.js";
import { maximizeSentenceScores } from "../../src/researches/keyphraseDistribution.js";
import { step } from "../../src/researches/keyphraseDistribution.js";
import { keyphraseDistributionResearcher } from "../../src/researches/keyphraseDistribution.js";
import Paper from "../../src/values/Paper.js";
import Mark from "../../src/values/Mark";
import Researcher from "../../src/researcher";
import morphologyData from "../../premium-configuration/data/morphologyData.json";

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
		expect( computeScoresPerSentenceShortTopic( topicShort, sentences, "en_EN" ) ).toEqual( [ 3, 6, 9, 6, 3, 6, 3, 6 ] );
	} );

	it( "for a long topic", function() {
		expect( computeScoresPerSentenceLongTopic( topicLong, sentences, "en_EN" ) ).toEqual( [ 6, 6, 9, 6, 6, 6, 3, 6 ] );
	} );

	it( "for a short topic for a language that doesn't support morphology", function() {
		expect( computeScoresPerSentenceShortTopic( topicShortIT, sentencesIT, "it_IT" ) ).toEqual( [ 3, 6, 9, 6, 3, 6, 3, 6 ] );
	} );

	it( "for a long topic for a language that doesn't support morphology", function() {
		expect( computeScoresPerSentenceLongTopic( topicLongIT, sentencesIT, "it_IT" ) ).toEqual( [ 6, 6, 9, 6, 6, 6, 3, 6 ] );
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
	it( "returns an average score over all sentences and all topic forms; returns markers for sentences that contain the topic", function() {
		const paper = new Paper(
			sentences.join( " " ),
			{
				locale: "en_EN",
				keyword: "key word",
				synonyms: "remarkable, something, word",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.08865248226950355,
			sentencesToHighlight: [
				new Mark( {
					marked: "How <yoastmark class='yoast-text-mark'>remarkable</yoastmark>!",
					original: "How remarkable!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Remarkable</yoastmark> is a funny <yoastmark class='yoast-text-mark'>word</yoastmark>.",
					original: "Remarkable is a funny word.",
				} ),
				new Mark( {
					marked: "I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>remarkable word</yoastmark>.",
					original: "I have found a key and a remarkable word.",
				} ),
				new Mark( {
					marked: "And again a <yoastmark class='yoast-text-mark'>key something</yoastmark>.",
					original: "And again a key something.",
				} ),
				new Mark( {
					marked: "Here comes <yoastmark class='yoast-text-mark'>something</yoastmark> that has nothing to do with a keyword.",
					original: "Here comes something that has nothing to do with a keyword.",
				} ),
				new Mark( {
					marked: "Ha, a <yoastmark class='yoast-text-mark'>key</yoastmark>!",
					original: "Ha, a key!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: "Words, words, words, how boring!",
				} ),
			],
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
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.08865248226950355,
			sentencesToHighlight: [
				new Mark( {
					marked: "How <yoastmark class='yoast-text-mark'>remarkable</yoastmark>!",
					original: "How remarkable!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Remarkable</yoastmark> is a funny <yoastmark class='yoast-text-mark'>word</yoastmark>.",
					original: "Remarkable is a funny word.",
				} ),
				new Mark( {
					marked: "I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>remarkable word</yoastmark>.",
					original: "I have found a key and a remarkable word.",
				} ),
				new Mark( {
					marked: "And again a <yoastmark class='yoast-text-mark'>key something</yoastmark>.",
					original: "And again a key something.",
				} ),
				new Mark( {
					marked: "Here comes <yoastmark class='yoast-text-mark'>something</yoastmark> that has nothing to do with a keyword.",
					original: "Here comes something that has nothing to do with a keyword.",
				} ),
				new Mark( {
					marked: "Ha, a <yoastmark class='yoast-text-mark'>key</yoastmark>!",
					original: "Ha, a key!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: "Words, words, words, how boring!",
				} ),
			],
		} );
	} );

	it( "returns an average score (for a language without morphology support) over all sentences and all topic forms; returns markers for sentences that contain the topic", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
			{
				locale: "it_IT",
				keyword: "parola chiave",
				synonyms: "straordinaria, qualcosa, parola",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.08865248226950355,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>parola</yoastmark> strana.",
					original: "Straordinaria è una parola strana.",
				} ),
				new Mark( {
					marked: "Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>parola straordinaria</yoastmark>.",
					original: "Ho trovato una chiave e una parola straordinaria.",
				} ),
				new Mark( {
					marked: "E ancora una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e <yoastmark class='yoast-text-mark'>qualcosa</yoastmark>.",
					original: "E ancora una chiave e qualcosa.",
				} ),
				new Mark( {
					marked: "È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: "È qualcosa che non ha niente da fare con questo che cerchiamo.",
				} ),
				new Mark( {
					marked: "Ah, una <yoastmark class='yoast-text-mark'>chiave</yoastmark>!",
					original: "Ah, una chiave!",
				} ),
				new Mark( {
					marked: "Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
				} ),
			],
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
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.08865248226950355,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>parola</yoastmark> strana.",
					original: "Straordinaria è una parola strana.",
				} ),
				new Mark( {
					marked: "Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>parola straordinaria</yoastmark>.",
					original: "Ho trovato una chiave e una parola straordinaria.",
				} ),
				new Mark( {
					marked: "E ancora una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e <yoastmark class='yoast-text-mark'>qualcosa</yoastmark>.",
					original: "E ancora una chiave e qualcosa.",
				} ),
				new Mark( {
					marked: "È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: "È qualcosa che non ha niente da fare con questo che cerchiamo.",
				} ),
				new Mark( {
					marked: "Ah, una <yoastmark class='yoast-text-mark'>chiave</yoastmark>!",
					original: "Ah, una chiave!",
				} ),
				new Mark( {
					marked: "Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
				} ),
			],
		} );
	} );

	it( "when the topic words don't contain function words and the function words for this locale are not defined, returns the same score", function() {
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
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.08865248226950355,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>parola</yoastmark> strana.",
					original: "Straordinaria è una parola strana.",
				} ),
				new Mark( {
					marked: "Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>parola straordinaria</yoastmark>.",
					original: "Ho trovato una chiave e una parola straordinaria.",
				} ),
				new Mark( {
					marked: "E ancora una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e <yoastmark class='yoast-text-mark'>qualcosa</yoastmark>.",
					original: "E ancora una chiave e qualcosa.",
				} ),
				new Mark( {
					marked: "È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: "È qualcosa che non ha niente da fare con questo che cerchiamo.",
				} ),
				new Mark( {
					marked: "Ah, una <yoastmark class='yoast-text-mark'>chiave</yoastmark>!",
					original: "Ah, una chiave!",
				} ),
				new Mark( {
					marked: "Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
				} ),
			],
		} );
	} );

	it( "when the topic words don't contain function words and the function words for this locale are not defined, returns a different score", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
			{
				// Fictitious locale that doesn't have function word support.
				locale: "xx_XX",
				keyword: "la parola chiave",
				// The added function words are now analyzed as content words, so the score changes.
				synonyms: "tanta straordinaria, qualcosa, molto parola",
			}
		);

		const researcher = new Researcher( paper );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 0.09166666666666667,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>parola</yoastmark> strana.",
					original: "Straordinaria è una parola strana.",
				} ),
				new Mark( {
					marked: "Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>parola straordinaria</yoastmark>.",
					original: "Ho trovato una chiave e una parola straordinaria.",
				} ),
				new Mark( {
					marked: "E ancora una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e <yoastmark class='yoast-text-mark'>qualcosa</yoastmark>.",
					original: "E ancora una chiave e qualcosa.",
				} ),
				new Mark( {
					marked: "È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: "È qualcosa che non ha niente da fare con questo che cerchiamo.",
				} ),
				new Mark( {
					marked: "Ah, una <yoastmark class='yoast-text-mark'>chiave</yoastmark>!",
					original: "Ah, una chiave!",
				} ),
				new Mark( {
					marked: "Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
				} ),
			],
		} );
	} );
} );
