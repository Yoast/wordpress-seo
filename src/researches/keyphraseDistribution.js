import getSentences from "../stringProcessing/getSentences";
import { findWordFormsInString } from "./findKeywordFormsInString";
import { max } from "lodash-es";
import { round } from "lodash-es";
import { sum } from "lodash-es";
import { isUndefined } from "lodash-es";
import { zipWith } from "lodash-es";
import gini from "../helpers/gini";

/**
 * Gets neighbourhood for a sentence. For a sentence checks if there are sentences before and after it and returns a
 * string with the concatenated neighbourhood (previous sentence - current sentence - next sentence).
 *
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {number} index     The index of the sentence to get neighbourhood for.
 *
 * @returns {string} The neighbourhood sentences.
 */
const getNeighbourhood = function( sentences, index ) {
	let neighbourhood = sentences[ index ];

	if ( ! isUndefined( sentences[ index - 1 ] ) ) {
		neighbourhood = sentences[ index - 1 ].concat( " ", neighbourhood );
	}
	if ( ! isUndefined( sentences[ index + 1 ] ) ) {
		neighbourhood = neighbourhood.concat( " ", sentences[ index + 1 ] );
	}

	return neighbourhood;
};

/**
 * Checks whether at least 3 content words from the topic are found within one sentence and the rest within +-1 sentence
 * away from it. Assigns a score to every sentence following the following schema:
 * 9 if all content words from the topic are in the sentence, or at least 3 content words from the topic
 * are in the sentence and the rest are in the neighbour sentences,
 * 6 if only some content words from the topic are found in the sentence but not all,
 * 3 if no content words from the topic were found in the sentence.
 *
 * @param {Array}  topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {string}  locale    The locale of the paper to analyse.
 *
 * @returns {Array} The scores per sentence.
 */
const computeScoresPerSentenceLongTopic = function( topic, sentences, locale ) {
	let sentenceScores = Array( sentences.length );

	for ( let i = 0; i < sentences.length; i++ ) {
		// First search in the current sentence
		const foundInCurrentSentence = findWordFormsInString( topic, sentences[ i ], locale );

		// Then search in the current sentence and on previous and one next sentences.
		const neighbourhood = getNeighbourhood( sentences, i );
		const foundInNeighbourhood = findWordFormsInString( topic, neighbourhood, locale );

		if ( foundInCurrentSentence.countWordMatches >= 3 && foundInNeighbourhood.percentWordMatches === 100 ) {
			sentenceScores[ i ] = 9;
		} else if ( foundInCurrentSentence.percentWordMatches > 0 ) {
			sentenceScores[ i ] = 6;
		} else {
			sentenceScores[ i ] = 0;
		}
	}

	return sentenceScores;
};

/**
 * Checks whether all content words from the topic are found within one sentence.
 * Assigns a score to every sentence following the following schema:
 * 9 if all content words from the topic are in the sentence,
 * 6 if only some content words from the topic are found in the sentence but not all,
 * 3 if no content words from the topic were found in the sentence.
 *
 * @param {Array}  topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Array}  sentences An array of all sentences in the text.
 * @param {string}  locale    The locale of the paper to analyse.
 *
 * @returns {Array} The scores per sentence.
 */
const computeScoresPerSentenceShortTopic = function( topic, sentences, locale ) {
	let sentenceScores = Array( sentences.length );

	for ( let i = 0; i < sentences.length; i++ ) {
		const currentSentence = sentences[ i ];

		const foundInCurrentSentence = findWordFormsInString( topic, currentSentence, locale );
		if  ( foundInCurrentSentence.percentWordMatches === 100 ) {
			sentenceScores[ i ] = 9;
		} else if ( foundInCurrentSentence.percentWordMatches > 0 ) {
			sentenceScores[ i ] = 6;
		} else {
			sentenceScores[ i ] = 0;
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
 * Start with the first third of the text (based on the total number of sentences) and calculate an average score
 * over all sentences in this set. Move down by one sentence, calculate an average score again.
 * Continue until the end of the text is reached.
 *
 * @param {Array} maximizedSentenceScores The maximal scores for every sentence.
 * @param {number} stepSize The number of sentences that should be in every step to average over.
 *
 * @returns {Array} The scores per portion of text.
 */
const step = function( maximizedSentenceScores, stepSize ) {
	const numberOfSteps = maximizedSentenceScores.length - stepSize + 1;

	let result = [];
	let toAnalyze = [];

	for ( let i = 0; i < numberOfSteps; i++ ) {
		toAnalyze = maximizedSentenceScores.slice( i, stepSize + i );
		result.push( sum( toAnalyze ) / stepSize );
	}
	return result;
};


/**
 * Computes the per-sentence scores depending on the length of the topic phrase and maximizes them over all topic phrases.
 *
 * @param {Array}  sentences              The sentences to get scores for.
 * @param {Array}  topicFormsInOneArray   The topic phrases forms to seach for in the sentences.
 * @param {string} locale                 The locale to work in.
 *
 * @returns {Object} An array with maximized score per sentence and an array with all sentences that do not contain the topic.
 */
const getSentenceScores = function( sentences, topicFormsInOneArray, locale ) {
	// Compute per-sentence scores of topic-relatedness.
	const topicNumber = topicFormsInOneArray.length;

	let sentenceScores = Array( topicNumber );

	for ( let i = 0; i < topicNumber; i++ ) {
		const topic = topicFormsInOneArray[ i ];
		if ( topic.length < 4 ) {
			sentenceScores[ i ] = computeScoresPerSentenceShortTopic( topic, sentences, locale );
		} else {
			sentenceScores[ i ] = computeScoresPerSentenceLongTopic( topic, sentences, locale );
		}
	}

	// Maximize scores: Give every sentence a maximal score that it got from analysis of all topics
	const maximizedSentenceScores = maximizeSentenceScores( sentenceScores );

	// Zip an array combining each sentence with the associated maximized score.
	const sentencesWithMaximizedScores =  zipWith( sentences, maximizedSentenceScores, ( sentence, score ) => {
		return { sentence, score };
	} );

	// Filter sentences that contain no topic words.
	const sentencesWithoutTopic = sentencesWithMaximizedScores.filter( sentenceObject => sentenceObject.score < 4 );

	return {
		maximizedSentenceScores: maximizedSentenceScores,
		sentencesWithoutTopic: sentencesWithoutTopic.map( sentenceObject => sentenceObject.sentence ),
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

	// Get per-sentence scores and sentences that do not have topic.
	const sentenceScores = getSentenceScores( sentences, topicFormsInOneArray, locale );

	// Apply step function: to begin with take a third of the text or at least 3 sentences.
	const textPortionScores = step( sentenceScores.maximizedSentenceScores, max( [ round( sentences.length / 10 ), 3 ] ) );

	return {
		// Return Gini coefficient of per-portion scores.
		keyphraseDistributionScore: gini( textPortionScores ),

		/*
	     * Sentences that have a maximized score of 3 are used for marking because these do not contain any topic forms.
	     * Hence these sentences require action most urgently.
	     */
		sentencesToHighlight: sentenceScores.sentencesWithoutTopic,
	};
};

export {
	computeScoresPerSentenceShortTopic,
	computeScoresPerSentenceLongTopic,
	maximizeSentenceScores,
	step,
	keyphraseDistributionResearcher,
};
