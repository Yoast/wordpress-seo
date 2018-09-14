import getSentences from "../stringProcessing/getSentences";
import { findWordFormsInString } from "./findKeywordFormsInString";
import { max } from "lodash-es";
import { round } from "lodash-es";
import { sum } from "lodash-es";
import { isUndefined } from "lodash-es";
import { zipWith } from "lodash-es";

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
		const currentSentence = sentences[ i ];
		const foundInCurrentSentence = findWordFormsInString( topic, currentSentence, locale );

		let neighbourhood = currentSentence;
		if ( ! isUndefined( sentences[ i - 1 ] ) ) {
			neighbourhood = sentences[ i - 1 ].concat( " ", neighbourhood );
		}
		if ( ! isUndefined( sentences[ i + 1 ] ) ) {
			neighbourhood = neighbourhood.concat( " ", sentences[ i + 1 ] );
		}
		const foundInNeighbourhood = findWordFormsInString( topic, neighbourhood, locale );

		if ( foundInCurrentSentence.countWordMatches >= 3 && foundInNeighbourhood.percentWordMatches === 100 ) {
			sentenceScores[ i ] = 9;
		} else if ( foundInCurrentSentence.percentWordMatches > 0 ) {
			sentenceScores[ i ] = 6;
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
 * Determines which portions of the text did not receive a lot of content words from keyphrase and synonyms.
 *
 * @param {Paper} paper The paper to check the keyword distance for.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {Object} The scores of topic relevance per portion of text and an array of all word forms to highlight
 */
const largestKeywordDistanceResearcher = function( paper, researcher ) {
	const sentences = getSentences( paper.getText() );
	const topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const topicFormsInOneArray = [ topicForms.keyphraseForms ];

	topicForms.synonymsForms.forEach( function( synonym ) {
		topicFormsInOneArray.push( synonym );
	} );

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

	// An array combining each sentence with the associated maximized score.
	const sentencesWithMaximizedScores = zipWith( sentences, maximizedSentenceScores, ( sentence, score ) => {
		return { sentence, score };
		} );

	/*
	 * Sentences that have a maximized score of 3 are used for marking because these do not contain any topic forms.
	 * Hence these sentences require action most urgently.
	 */
	const sentencesWithoutTopic = sentencesWithMaximizedScores.filter( sentenceObject => sentenceObject.score < 4 );

	// Apply step function: to begin with take a third of the text or at least 3 sentences.
	const textPortionScores = step( maximizedSentenceScores, max( [ round( sentences.length / 3 ), 3 ] ) );

	return {
		averageScore: round( sum( textPortionScores ) / textPortionScores.length, 1 ),
		sentencesToHighlight: sentencesWithoutTopic.map( sentenceObject => sentenceObject.sentence ),
	};
};

export {
	computeScoresPerSentenceShortTopic,
	computeScoresPerSentenceLongTopic,
	maximizeSentenceScores,
	step,
	largestKeywordDistanceResearcher,
};
