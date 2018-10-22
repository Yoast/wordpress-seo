import getSentences from "../stringProcessing/getSentences";
import { findWordFormsInString } from "./findKeywordFormsInString";
import { max, uniq as unique } from "lodash-es";
import { zipWith } from "lodash-es";
import { flattenDeep } from "lodash-es";
import { indexOf } from "lodash-es";
import { markWordsInSentences } from "../stringProcessing/markWordsInSentences";
import getLanguage from "../helpers/getLanguage";

/**
 * Checks whether at least half of the content words from the topic are found within the sentence.
 * Assigns a score to every sentence following the following schema:
 * 9 if at least half of the content words from the topic are in the sentence,
 * 3 otherwise.
 *
 * @param {Array}  topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {string} locale    The locale of the paper to analyse.
 *
 * @returns {Array} The scores per sentence.
 */
const computeScoresPerSentenceLongTopic = function( topic, sentences, locale ) {
	const sentenceScores = Array( sentences.length );

	for ( let i = 0; i < sentences.length; i++ ) {
		const foundInCurrentSentence = findWordFormsInString( topic, sentences[ i ], locale );

		if ( foundInCurrentSentence.percentWordMatches >= 50 ) {
			sentenceScores[ i ] = 9;
		} else {
			sentenceScores[ i ] = 3;
		}
	}

	return sentenceScores;
};


/**
 * Checks whether all content words from the topic are found within one sentence.
 * Assigns a score to every sentence following the following schema:
 * 9 if all content words from the topic are in the sentence,
 * 3 if not all content words from the topic were found in the sentence.
 *
 * @param {Array}  topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {string} locale    The locale of the paper to analyse.
 *
 * @returns {Array} The scores per sentence.
 */
const computeScoresPerSentenceShortTopic = function( topic, sentences, locale ) {
	const sentenceScores = Array( sentences.length );

	for ( let i = 0; i < sentences.length; i++ ) {
		const currentSentence = sentences[ i ];
		const foundInCurrentSentence = findWordFormsInString( topic, currentSentence, locale );
		if ( foundInCurrentSentence.percentWordMatches === 100 ) {
			sentenceScores[ i ] = 9;
		} else {
			sentenceScores[ i ] = 3;
		}
	}
	return sentenceScores;
};

/**
 * Maximizes scores: Give every sentence a maximal score that it got from analysis of all topics
 *
 * @param {Array} sentenceScores The scores for every sentence, as assessed per keyphrase and every synonym.
 *
 * @returns {Array} Maximal scores of topic relevance per sentence.
 */
const maximizeSentenceScores = function( sentenceScores ) {
	const sentenceScoresTransposed = sentenceScores[ 0 ].map( function( col, i ) {
		return sentenceScores.map( function( row ) {
			return row[ i ];
		} );
	} );

	return sentenceScoresTransposed.map( function( scoresForOneSentence ) {
		return max( scoresForOneSentence );
	} );
};


/**
 * Computes the maximally long piece of text that does not include the topic.
 *
 * @param {Array} sentenceScores The array of scores per sentence.
 *
 * @returns {number} The maximum number of sentences that do not include the topic.
 */
const getDistraction = function( sentenceScores ) {
	const numberOfSentences = sentenceScores.length;
	let allTopicSentencesIndices = [];

	for ( let i = 0; i < numberOfSentences; i++ ) {
		if ( sentenceScores[ i ] > 3 ) {
			allTopicSentencesIndices.push( i );
		}
	}

	const numberOfTopicSentences = allTopicSentencesIndices.length;

	if ( numberOfTopicSentences === 0 ) {
		return numberOfSentences;
	}

	/**
	 * Add fake topic sentences at the very beginning and at the very end
	 * to account for cases when the text starts or ends with a train of distraction.
	 */
	allTopicSentencesIndices.unshift( -1 );
	allTopicSentencesIndices.push( numberOfSentences );

	const distances = [];

	for ( let i = 1; i < numberOfTopicSentences + 2; i++ ) {
		distances.push( allTopicSentencesIndices[ i ] - allTopicSentencesIndices[ i - 1 ] - 1 );
	}

	return max( distances );
};

/**
 * Computes the per-sentence scores depending on the length of the topic phrase and maximizes them over all topic phrases.
 *
 * @param {Array}  sentences              The sentences to get scores for.
 * @param {Array}  topicFormsInOneArray   The topic phrases forms to search for in the sentences.
 * @param {string} locale                 The locale to work in.
 *
 * @returns {Object} An array with maximized score per sentence and an array with all sentences that do not contain the topic.
 */
const getSentenceScores = function( sentences, topicFormsInOneArray, locale ) {
	// Compute per-sentence scores of topic-relatedness.
	const topicNumber = topicFormsInOneArray.length;

	const sentenceScores = Array( topicNumber );

	// Determine whether the language has function words.
	const language = getLanguage( locale );

	// For languages with function words apply either full match or partial match depending on topic length
	if ( indexOf( [ "en", "de", "nl", "fr", "es", "it", "pt", "ru", "pl" ], language  ) >= 0 ) {
		for ( let i = 0; i < topicNumber; i++ ) {
			const topic = topicFormsInOneArray[ i ];
			if ( topic.length < 4 ) {
				sentenceScores[ i ] = computeScoresPerSentenceShortTopic( topic, sentences, locale );
			} else {
				sentenceScores[ i ] = computeScoresPerSentenceLongTopic( topic, sentences, locale );
			}
		}
	} else {
		// For languages without function words apply the full match always
		for ( let i = 0; i < topicNumber; i++ ) {
			const topic = topicFormsInOneArray[ i ];
			sentenceScores[ i ] = computeScoresPerSentenceShortTopic( topic, sentences, locale );
		}
	}

	// Maximize scores: Give every sentence a maximal score that it got from analysis of all topics
	const maximizedSentenceScores = maximizeSentenceScores( sentenceScores );

	// Zip an array combining each sentence with the associated maximized score.
	const sentencesWithMaximizedScores =  zipWith( sentences, maximizedSentenceScores, ( sentence, score ) => {
		return { sentence, score };
	} );

	// Filter sentences that contain topic words for future highlights.
	const sentencesWithTopic = sentencesWithMaximizedScores.filter( sentenceObject => sentenceObject.score > 3 );

	return {
		maximizedSentenceScores: maximizedSentenceScores,
		sentencesWithTopic: sentencesWithTopic.map( sentenceObject => sentenceObject.sentence ),
	};
};


/**
 * Determines which portions of the text did not receive a lot of content words from keyphrase and synonyms.
 *
 * @param {Paper}       paper       The paper to check the keyphrase distribution for.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {Object} The scores of topic relevance per portion of text and an array of all word forms to highlight.
 */
const keyphraseDistributionResearcher = function( paper, researcher ) {
	const sentences = getSentences( paper.getText() );
	const topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const topicFormsInOneArray = [ topicForms.keyphraseForms ];

	topicForms.synonymsForms.forEach( function( synonym ) {
		topicFormsInOneArray.push( synonym );
	} );

	const allTopicWords = unique( flattenDeep( topicFormsInOneArray ) ).sort( ( a, b ) => b.length - a.length );

	// Get per-sentence scores and sentences that have topic.
	const sentenceScores = getSentenceScores( sentences, topicFormsInOneArray, locale );
	const maximizedSentenceScores = sentenceScores.maximizedSentenceScores;
	const maxLengthDistraction = getDistraction( maximizedSentenceScores );

	return {
		sentencesToHighlight: markWordsInSentences( allTopicWords, sentenceScores.sentencesWithTopic, locale ),
		keyphraseDistributionScore: maxLengthDistraction / sentences.length * 100,
	};
};

export {
	computeScoresPerSentenceShortTopic,
	computeScoresPerSentenceLongTopic,
	maximizeSentenceScores,
	keyphraseDistributionResearcher,
	getDistraction,
};
