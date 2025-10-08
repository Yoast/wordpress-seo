import {
	computeScoresPerSentenceShortTopic,
	computeScoresPerSentenceLongTopic,
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
			{ score: 100, matches: [ "a", "b", "c"  ] },
			{ score: 8, matches: [ "a", "b" ] },
			{ score: 9, matches: [ "a", "b" ] },
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
			{ score: 10, matches: [ "a", "b" ] },
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
	{ text: "How remarkable!", tokens: [ "How", " ", "remarkable", "!" ] },
	{ text: "Remarkable is a funny word.", tokens: [ "Remarkable", " ", "is", " ", "a", " ", "funny", " ", "word", "." ] },
	{ text: "I have found a key and a remarkable word.", tokens: [ "I", " ", "have", " ", "found", " ", "a", " ", "key", " ", "and", " ", "a", " ", "remarkable", " ", "word", "." ] },
	{ text: "And again a key something.", tokens: [ "And", " ", "again", " ", "a", " ", "key", " ", "something", "." ] },
	{ text: "Here comes something that has nothing to do with a keyword.", tokens: [ "Here", " ", "comes", " ", "something", " ", "that", " ", "has", " ", "nothing", " ", "to", " ", "do", " ", "with", " ", "a", " ", "keyword", "." ] },
	{ text: "Ha, a key!", tokens: [ "Ha", ",", " ", "a", " ", "key", "!" ] },
	{ text: "Again nothing!", tokens: [ "Again", " ", "nothing", "!" ] },
	{ text: "Words, words, words, how boring!", tokens: [ "Words", ",", " ", "words", ",", " ", "words", ",", " ", "how", " ", "boring", "!" ] },
];

const sentencesIT = [
	{ text: "Che cosa straordinaria!", tokens: [ "Che", " ", "cosa", " ", "straordinaria", "!" ] },
	{ text: "Straordinaria è una parola strana.", tokens: [ "Straordinaria", " ", "è", " ", "una", " ", "parola", " ", "strana", "." ] },
	{ text: "Ho trovato una chiave e una parola straordinaria.", tokens: [ "Ho", " ", "trovato", " ", "una", " ", "chiave", " ", "e", " ", "una", " ", "parola", " ", "straordinaria", "." ] },
	{ text: "E ancora una chiave e qualcosa.", tokens: [ "E", " ", "ancora", " ", "una", " ", "chiave", " ", "e", " ", "qualcosa", "." ] },
	{ text: "È qualcosa che non ha niente da fare con questo che cerchiamo.", tokens: [ "È", " ", "qualcosa", " ", "che", " ", "non", " ", "ha", " ", "niente", " ", "da", " ", "fare", " ", "con", " ", "questo", " ", "che", " ", "cerchiamo", "." ] },
	{ text: "Ah, una chiave!", tokens: [ "Ah", ",", " ", "una", " ", "chiave", "!" ] },
	{ text: "Ancora niente!", tokens: [ "Ancora", " ", "niente", "!" ] },
	{ text: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!", tokens: [ "Una", " ", "parola", " ", "e", " ", "ancora", " ", "un'altra", " ", "e", " ", "poi", " ", "un'altra", " ", "ancora", ",", " ", "che", " ", "schifo", "!" ] },
];


const testCasesSentenceScore = [
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
			{ score: 3, matches: [ "word" ] },
			{ score: 9, matches: [ "key", "word" ] },
			{ score: 3, matches: [ "key" ] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [ "key" ] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [ "Words", "words", "words" ] },
		],
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
			{ score: 3, matches: [ "remarkable" ] },
			{ score: 9, matches: [ "word", "Remarkable" ] },
			{ score: 9, matches: [ "key", "word", "remarkable" ] },
			{ score: 9, matches: [ "key", "something" ] },
			{ score: 3, matches: [ "something" ] },
			{ score: 3, matches: [ "key" ] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [ "Words", "words", "words" ] },
		],
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
			{ score: 3, matches: [ "parola" ] },
			{ score: 9, matches: [ "parola", "chiave" ] },
			{ score: 3, matches: [ "chiave" ] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [ "chiave" ] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [ "parola" ] },
		],
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
			{ score: 3, matches: [ "straordinaria" ] },
			{ score: 9, matches: [ "parola", "Straordinaria" ] },
			{ score: 9, matches: [ "parola", "chiave", "straordinaria" ] },
			{ score: 9, matches: [ "chiave", "qualcosa" ] },
			{ score: 3, matches: [ "qualcosa" ] },
			{ score: 3, matches: [ "chiave" ] },
			{ score: 3, matches: [] },
			{ score: 3, matches: [ "parola" ] },
		],
	},
];

describe.each( testCasesSentenceScore )( "Test for computing sentence scores", ( {
	description, topic, sentences, locale, expected,
} ) => {
	if ( description.includes( "short topic" ) ) {
		it( description, () => {
			expect( computeScoresPerSentenceShortTopic( topic, sentences, locale ) ).toEqual( expected );
		} );
	} else {
		it( description, () => {
			expect( computeScoresPerSentenceLongTopic( topic, sentences, locale ) ).toEqual( expected );
		} );
	}
} );

describe( "Test for the research", function() {
	it( "returns a score over all sentences and all topic forms; returns markers for sentences that contain the topic", function() {
		const paper = new Paper(
			sentencesEN.map( sentence => sentence.text ).join( " " ),
			{
				locale: "en_EN",
				keyword: "key word",
				synonyms: "remarkable, something, word",
			}
		);

		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 25,
			sentencesToHighlight: [
				new Mark( {
					marked: "How <yoastmark class='yoast-text-mark'>remarkable</yoastmark>!",
					original: "How remarkable!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Remarkable</yoastmark> is a funny <yoastmark class='yoast-text-mark'>" +
						"word</yoastmark>.",
					original: "Remarkable is a funny word.",
				} ),
				new Mark( {
					marked: "I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>" +
						"remarkable word</yoastmark>.",
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
					marked: "<yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, " +
						"<yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: "Words, words, words, how boring!",
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
			keyphraseDistributionScore: 25,
			sentencesToHighlight: [
				new Mark( {
					marked: "How <yoastmark class='yoast-text-mark'>remarkable</yoastmark>!",
					original: "How remarkable!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Remarkable</yoastmark> is a funny <yoastmark class='yoast-text-mark'>" +
						"word</yoastmark>.",
					original: "Remarkable is a funny word.",
				} ),
				new Mark( {
					marked: "I have found a <yoastmark class='yoast-text-mark'>key</yoastmark> and a <yoastmark class='yoast-text-mark'>" +
						"remarkable word</yoastmark>.",
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
					marked: "<yoastmark class='yoast-text-mark'>Words</yoastmark>, <yoastmark class='yoast-text-mark'>words</yoastmark>, " +
						"<yoastmark class='yoast-text-mark'>words</yoastmark>, how boring!",
					original: "Words, words, words, how boring!",
				} ),
			],
		} );
	} );

	// It’s the same as the English one above it, excepts the locale is Italian. But still the English morphology data is added.

	/* it( "returns a score (for a language without morphology support) over all sentences and all topic forms; returns markers for " +
		"sentences that contain the topic", function() {
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
			keyphraseDistributionScore: 25,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: "Straordinaria è una parola strana.",
				} ),
				new Mark( {
					marked: "Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: "Ho trovato una chiave e una parola straordinaria.",
				} ),
				new Mark( {
					marked: "E ancora una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e <yoastmark class='yoast-text-mark'>" +
						"qualcosa</yoastmark>.",
					original: "E ancora una chiave e qualcosa.",
				} ),
				new Mark( {
					marked: "È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: "È qualcosa che non ha niente da fare con questo che cerchiamo.",
				} ),
				new Mark( {
					marked: "Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
				} ),
			],
		} );
	} );
*/
	/*
	 * The following Italian tests are not language specific as they are an example of languages in general
	 * that have no morphology support.
	 */
	it( "returns the same score when function words are added (for a language without morphological support, but with function words, " +
		"e.g. Italian in Free)", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
			{
				locale: "it_IT",
				keyword: "la parola chiave",
				synonyms: "tanta straordinaria, qualcosa, molto parola",
			}
		);

		const researcher = new ItalianResearcher( paper );
		buildTree( paper, researcher );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 25,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: "Straordinaria è una parola strana.",
				} ),
				new Mark( {
					marked: "Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: "Ho trovato una chiave e una parola straordinaria.",
				} ),
				new Mark( {
					marked: "E ancora una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e <yoastmark class='yoast-text-mark'>" +
						"qualcosa</yoastmark>.",
					original: "E ancora una chiave e qualcosa.",
				} ),
				new Mark( {
					marked: "È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: "È qualcosa che non ha niente da fare con questo che cerchiamo.",
				} ),
				new Mark( {
					marked: "Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
				} ),
			],
		} );
	} );
	it( "when the topic words don't contain function words and the function words for this locale are not available, " +
		"returns the same score", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
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
			keyphraseDistributionScore: 25,
			sentencesToHighlight: [
				new Mark( {
					marked: "Che cosa <yoastmark class='yoast-text-mark'>straordinaria</yoastmark>!",
					original: "Che cosa straordinaria!",
				} ),
				new Mark( {
					marked: "<yoastmark class='yoast-text-mark'>Straordinaria</yoastmark> è una <yoastmark class='yoast-text-mark'>" +
						"parola</yoastmark> strana.",
					original: "Straordinaria è una parola strana.",
				} ),
				new Mark( {
					marked: "Ho trovato una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e una <yoastmark class='yoast-text-mark'>" +
						"parola straordinaria</yoastmark>.",
					original: "Ho trovato una chiave e una parola straordinaria.",
				} ),
				new Mark( {
					marked: "E ancora una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e <yoastmark class='yoast-text-mark'>" +
						"qualcosa</yoastmark>.",
					original: "E ancora una chiave e qualcosa.",
				} ),
				new Mark( {
					marked: "È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: "È qualcosa che non ha niente da fare con questo che cerchiamo.",
				} ),
				new Mark( {
					marked: "Una <yoastmark class='yoast-text-mark'>parola</yoastmark> e ancora un'altra e poi un'altra ancora, che schifo!",
					original: "Una parola e ancora un'altra e poi un'altra ancora, che schifo!",
				} ),
			],
		} );
	} );

	it( "when the topic words don't contain function words and the function words for this locale are not available, " +
		"returns a different score", function() {
		const paper = new Paper(
			sentencesIT.join( " " ),
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
			keyphraseDistributionScore: 37.5,
			sentencesToHighlight: [
				new Mark( {
					marked: "E ancora una <yoastmark class='yoast-text-mark'>chiave</yoastmark> e <yoastmark class='yoast-text-mark'>" +
						"qualcosa</yoastmark>.",
					original: "E ancora una chiave e qualcosa.",
				} ),
				new Mark( {
					marked: "È <yoastmark class='yoast-text-mark'>qualcosa</yoastmark> che non ha niente da fare con questo che cerchiamo.",
					original: "È qualcosa che non ha niente da fare con questo che cerchiamo.",
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

	const paragraphWithKeyphrase1 = "<p>Lorem ipsum keyphrase dolor sit amet, consectetur adipiscing elit." +
		"In sit amet semper sem, id faucibus massa.</p>\n";

	const paragraphWithKeyphrase2 = "<p>Nam sit keyphrase amet eros faucibus, malesuada purus at, mollis libero." +
		"Praesent at ante sit amet elit sollicitudin lobortis.</p>";

	it( "calculates keyphrase distribution score correctly for content with plain text structure", function() {
		const fruits = [ "apple", "pear", "mango", "kiwi", "papaya", "pineapple", "banana" ];
		const fruitString = fruits.join( " " );

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

		// Test that the score is reasonable (expected 33.33...)
		expect( result.keyphraseDistributionScore ).toEqual( 33.33333333333333 );
	} );

	it( "calculates keyphrase distribution score correctly for content with HTML list structure", function() {
		const fruits = [ "apple", "pear", "mango", "kiwi", "papaya", "pineapple", "banana" ];
		const fruitList = "<ul>\n" + fruits.map( fruit => "<li>" + fruit + "</li>\n" ).join( "" ) + "</ul>";

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

		// Test that the score is reasonable (not 77.77...)
		expect( result.keyphraseDistributionScore ).toEqual( 33.33333333333333 );
	} );


	xit( "doesn't return a skewed result when there is a list with many single-word list items - " +
		"a list with single words should not be treated differently than if that list were a long string of words", function() {
		const fruits = [ "apple", "pear", "mango", "kiwi", "papaya", "pineapple", "banana" ];

		const fruitList = "<ul>\n" + fruits.map( fruit => "<li>" + fruit + "</li>\n" ).join( "" ) + "</ul>";
		const fruitString = fruits.join( " " );

		const paperWithList = new Paper(
			paragraphWithKeyphrase1 + fruitList + paragraphWithKeyphrase2,
			{
				locale: "en_EN",
				keyword: "keyphrase",
			}
		);

		const paperWithWords = new Paper(
			paragraphWithKeyphrase1 + fruitString + paragraphWithKeyphrase2,
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

	it( "returns the same result for a a real world example list including various html tags as it does for version of that" +
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

		const researcherListCondition = new Researcher( paperWithList );
		buildTree( paperWithList, researcherListCondition );
		researcherListCondition.addResearchData( "morphology", morphologyData );

		const researcherWordsCondition = new Researcher( paperWithWords );
		buildTree( paperWithWords, researcherWordsCondition );
		researcherWordsCondition.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paperWithList, researcherListCondition ).keyphraseDistributionScore ).toEqual(
			keyphraseDistributionResearcher( paperWithWords, researcherWordsCondition ).keyphraseDistributionScore );
	} );

	it( "returns the same result for a a real world example with nested lists as it does for a string version of that" +
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

	it( "returns the result for long topic", function() {
		const paper = new Paper(
			"This is a text with a long topic keyphrase1 or synonyms1. It is about search engine optimization tips",
			{
				// Fictitious locale that doesn't have function word support.
				locale: "en_EN",
				keyword: "search engine optimization tips",
				// The added function words are now analyzed as content words, so the score changes.
				synonyms: "synonym",
			}
		);

		const researcher = new Researcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyData );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "It is about <yoastmark class='yoast-text-mark'>search engine optimization tips</yoastmark>",
					original: "It is about search engine optimization tips",
				} ) ],
		} );
	} );
} );

const testData = [
	{
		description: "keyphrase in uppercase with a period 'ASP.NET' and its exact match is found in the text",
		text: "An example text. What is ASP.NET.",
		keyphrase: "ASP.NET",
		expected: {
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "What is <yoastmark class='yoast-text-mark'>ASP.NET</yoastmark>.",
					original: "What is ASP.NET.",
				} ) ],
		},
	},
	{
		description: "keyphrase in uppercase with a period 'ASP.NET' and its match in different case 'ASP.net' is found in the text",
		text: "An example text. What is ASP.net.",
		keyphrase: "ASP.NET",
		expected: {
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "What is <yoastmark class='yoast-text-mark'>ASP.net</yoastmark>.",
					original: "What is ASP.net.",
				} ) ],
		},
	},
	{
		description: "keyphrase in uppercase with a period 'ASP.NET' and its match in different case 'asp.NET' is found in the text",
		text: "An example text. What is asp.NET?",
		keyphrase: "ASP.NET",
		expected: {
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "What is <yoastmark class='yoast-text-mark'>asp.NET</yoastmark>?",
					original: "What is asp.NET?",
				} ) ],
		},

	},
	{
		description: "keyphrase in uppercase with a period 'ASP.NET' and its match in different case 'asp.net' is found in the text",
		text: "An example text. What is asp.net.",
		keyphrase: "ASP.NET",
		expected: {
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "What is <yoastmark class='yoast-text-mark'>asp.net</yoastmark>.",
					original: "What is asp.net.",
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
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "What is <yoastmark class='yoast-text-mark'>ASP.NET</yoastmark>.",
					original: "What is ASP.NET.",
				} ) ],
		},
	},
	{
		description: "keyphrase in double quote with a period '\"ASP.NET\"' and its match in different case 'ASP.net' is found in the text",
		text: "An example text. What is ASP.net.",
		keyphrase: "\"ASP.NET\"",
		expected: {
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "What is <yoastmark class='yoast-text-mark'>ASP.net</yoastmark>.",
					original: "What is ASP.net.",
				} ) ],
		},
	},
	{
		description: "keyphrase in double quote with a period '\"ASP.NET\"' and its match in different case 'asp.NET' is found in the text",
		text: "An example text. What is asp.NET?",
		keyphrase: "\"ASP.NET\"",
		expected: {
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "What is <yoastmark class='yoast-text-mark'>asp.NET</yoastmark>?",
					original: "What is asp.NET?",
				} ) ],
		},
	},
	{
		description: "keyphrase in double quote with a period '\"ASP.NET\"' and its match in different case 'asp.net' is found in the text",
		text: "An example text. What is asp.net.",
		keyphrase: "\"ASP.NET\"",
		expected: {
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "What is <yoastmark class='yoast-text-mark'>asp.net</yoastmark>.",
					original: "What is asp.net.",
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

// Did not remove Japanese tests below as they test the function with different helpers as well as japaneseTopicLength.

describe( "Test for the research for Japanese language", function() {
	const japaneseSentences = "私はペットとして2匹の猫を飼っています。" +
		"どちらもとても可愛くて甘い猫で、猫の餌を食べるのが大好きです。" +
		"彼らが好きなタイプの猫用フードは新鮮なものです。" +
		"加工が少ない猫用食品の一種。";
	it( "returns a score over all sentences and all topic forms (short topic); returns markers for sentences that contain the topic " +
		"(when morphology data is available)", function() {
		const paper = new Paper(
			japaneseSentences,
			{
				locale: "ja",
				keyword: "猫餌",
				synonyms: "猫用フード, 猫用食品",
			}
		);

		const researcher = new JapaneseResearcher( paper );
		buildTree( paper, researcher );
		researcher.addResearchData( "morphology", morphologyDataJA );

		expect( keyphraseDistributionResearcher( paper, researcher ) ).toEqual( {
			keyphraseDistributionScore: 50,
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
			keyphraseDistributionScore: 0,
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
			keyphraseDistributionScore: 0,
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
			keyphraseDistributionScore: 25,
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

	it( "returns the result for long topic", function() {
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
			keyphraseDistributionScore: 50,
			sentencesToHighlight: [
				new Mark( {
					marked: "彼女はオンラインストアで<yoastmark class='yoast-text-mark'>黒</yoastmark>の<yoastmark class='yoast-text-mark'>長袖</yoastmark>" +
						"<yoastmark class='yoast-text-mark'>マキシドレス</yoastmark>を購入したかった。",
					original: "彼女はオンラインストアで黒の長袖マキシドレスを購入したかった。",
				} ),
			],
		} );
	} );
} );

