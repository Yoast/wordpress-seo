import { flattenDeep, max, zipWith } from "lodash";
import parseSynonyms from "../helpers/sanitize/parseSynonyms";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import getMarkingsInSentence from "../helpers/highlighting/getMarkingsInSentence";
import matchWordFormsWithSentence from "../helpers/match/matchWordFormsWithSentence";

/**
 * @typedef {import("../../values/Mark").default} Mark
 * @typedef {import("../../values/Paper").default} Paper
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../parse/structure/Sentence").default} Sentence
 */

/**
 * @typedef MaximizedSentenceScore
 * @property {number} score The maximized score of topic relevance for the sentence.
 * @property {string[]} matches An array of all topic word matches in the sentence.
 */

/**
 * @typedef SentenceScoresResult
 * @property {MaximizedSentenceScore[]} maximizedSentenceScores The maximized scores per sentence.
 * @property {Mark[]} sentencesToHighlight An array of markings for sentences that contain topic words.
 */

/**
 * @typedef KeyphraseDistributionResult
 * @property {number} keyphraseDistributionScore The keyphrase distribution score.
 * @property {Mark[]} sentencesToHighlight	An array of markings for sentences that contain topic words.
 */

/**
 * Checks whether all content words from the topic are found within one sentence.
 * Assigns a score to every sentence following the following schema:
 * 9 if all content words from the topic are in the sentence,
 * 3 if not all content words from the topic were found in the sentence.
 *
 * @param {Array}		topic     The word forms of all content words in a keyphrase or a synonym.
 * @param {Sentence[]}  sentences An array of all sentences in the text.
 * @param {string} 		locale    The locale of the paper to analyse.
 * @param {boolean}   isShortTopic Whether the topic is considered short (true) or long (false).
 * @param {function}    matchWordCustomHelper 	The language-specific helper function to match word in text.
 * @param {function}    customSplitIntoTokensHelper A custom helper to split sentences into tokens.
 * @returns {MaximizedSentenceScore[]} The scores per sentence along with the found matches.
 */
const computeScoresPerSentence = function( topic, sentences, locale, isShortTopic = true, matchWordCustomHelper,
	customSplitIntoTokensHelper ) {
	const sentenceScores = [];

	for ( let i = 0; i < sentences.length; i++ ) {
		const currentSentence = sentences[ i ];
		const matchedKeyphrase = topic.map( wordForms => matchWordFormsWithSentence( currentSentence,
			wordForms, locale, matchWordCustomHelper, false, customSplitIntoTokensHelper ) );
		const foundWords = matchedKeyphrase.reduce( ( count, { count: matchCount } ) => {
			return matchCount > 0 ? count + 1 : count;
		}, 0 );

		const matches = flattenDeep( matchedKeyphrase.map( match => match.matches ) );
		let matchedPercentage = 0;
		if ( topic.length > 0 ) {
			matchedPercentage = Math.round( ( foundWords / topic.length ) * 100 );
		}
		if ( ( isShortTopic && matchedPercentage === 100 ) || ( ! isShortTopic && matchedPercentage >= 50 ) ) {
			sentenceScores[ i ] = { score: 9, matches };
		} else {
			sentenceScores[ i ] = { score: 3, matches: [] };
		}
	}
	return sentenceScores;
};

/**
 * Maximizes scores: Give every sentence a maximal score that it got from analysis of all topics
 *
 * @param {MaximizedSentenceScore[]} sentenceScores The scores for every sentence, as assessed per keyphrase and every synonym.
 *
 * @returns {MaximizedSentenceScore[]} Maximal scores of topic relevance per sentence.
 */
const maximizeSentenceScores = function( sentenceScores ) {
	const sentenceScoresTransposed = sentenceScores[ 0 ].map( function( col, i ) {
		return sentenceScores.map( function( row ) {
			return row[ i ];
		} );
	} );

	return sentenceScoresTransposed.map( function( scoresForOneSentence ) {
		return scoresForOneSentence.reduce( ( maxScore, current ) => {
			if ( current.score > maxScore.score ) {
				return {
					score: current.score,
					matches: [ ...maxScore.matches, ...current.matches ],
				};
			}
			return {
				score: maxScore.score,
				matches: [ ...maxScore.matches, ...current.matches ],
			};
		}, { score: -1, matches: [] } );
	} );
};


/**
 * Computes the maximally long piece of text that does not include the topic.
 *
 * @param {number[]} sentenceScores The array of scores per sentence.
 *
 * @returns {number} The maximum number of sentences that do not include the topic.
 */
const getDistraction = function( sentenceScores ) {
	const numberOfSentences = sentenceScores.length;
	const allTopicSentencesIndices = [];

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
 * @param {Sentence[]}  sentences              The sentences to get scores for.
 * @param {Array}       topicFormsInOneArray   The topic phrases forms to search for in the sentences.
 * @param {string}      locale                 The locale to work in.
 * @param {Array}       functionWords           The function words list.
 * @param {function}    matchWordCustomHelper 	The language-specific helper function to match word in text.
 * @param {int}         topicLengthCriteria     The topic length criteria. The default value is 4, where a topic is considered short
 *                                              if it's less than 4 words long, and otherwise long.
 * @param {Array}       originalTopic           The array of the original form of the topic with function words filtered out.
 * @param {function}    wordsCharacterCount     The helper to calculate the character length of all the words in the array.
 * @param {function}    customSplitIntoTokensHelper A custom helper to split sentences into tokens.
 * @returns {{maximizedSentenceScores: number[], sentencesToHighlight: Mark[]}} The maximized scores per sentence and the sentences that contain topic words for future highlights.
 */
const getSentenceScores = function( sentences, topicFormsInOneArray, locale, functionWords, matchWordCustomHelper,
	topicLengthCriteria = 4, originalTopic, wordsCharacterCount, customSplitIntoTokensHelper ) {
	// Compute per-sentence scores of topic-relatedness.
	const topicNumber = topicFormsInOneArray.length;

	const sentenceScores = Array( topicNumber );

	// For languages with function words apply either full match or partial match depending on the topic length.
	if ( functionWords.length > 0 ) {
		for ( let i = 0; i < topicNumber; i++ ) {
			const topic = topicFormsInOneArray[ i ];
			/*
			 * If the helper to calculate the character length of all the words in the array is available,
			 * we use this helper to calculate the characters length of the original topic form.
			 * We then use the result and compare it with the topicLengthCriteria.
			 */
			const topicLength = wordsCharacterCount ? wordsCharacterCount( originalTopic[ i ] ) : topic.length;
			if ( topicLength < topicLengthCriteria ) {
				sentenceScores[ i ] = computeScoresPerSentence( topic, sentences, locale, true, matchWordCustomHelper,
					customSplitIntoTokensHelper );
			} else {
				sentenceScores[ i ] = computeScoresPerSentence( topic, sentences, locale, false, matchWordCustomHelper,
					customSplitIntoTokensHelper );
			}
		}
	} else {
		// For languages without function words apply the full match always.
		for ( let i = 0; i < topicNumber; i++ ) {
			const topic = topicFormsInOneArray[ i ];
			sentenceScores[ i ] = computeScoresPerSentence( topic, sentences, locale, true, matchWordCustomHelper, customSplitIntoTokensHelper );
		}
	}

	// Maximize scores: Give every sentence a maximal score that it got from analysis of all topics
	const maximizedSentenceScores = maximizeSentenceScores( sentenceScores );

	// Zip an array combining each sentence with the associated maximized score.
	const sentencesWithMaximizedScores =  zipWith( sentences, maximizedSentenceScores, ( sentence, sentenceScore ) => {
		const { score, matches } = sentenceScore;
		return { sentence, score, matches };
	} );

	// Filter sentences that contain topic words for future highlights.
	const sentencesWithTopic = sentencesWithMaximizedScores.filter( sentenceObject => sentenceObject.score > 3 );

	return {
		maximizedSentenceScores: maximizedSentenceScores.map( sentenceScore => sentenceScore.score ),
		sentencesToHighlight: sentencesWithTopic.map( ( { sentence, matches } ) => getMarkingsInSentence( sentence, matches ) ),
	};
};

/**
 * Determines which portions of the text did not receive a lot of content words from keyphrase and synonyms.
 *
 * @param {Paper}       paper		The paper to check the keyphrase distribution for.
 * @param {Researcher}  researcher	The researcher to use for analysis.
 *
 * @returns {KeyphraseDistributionResult} The scores of topic relevance per portion of text and an array of all word forms to highlight.
 */
const keyphraseDistributionResearcher = function( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const getContentWordsHelper = researcher.getHelper( "getContentWords" );
	const wordsCharacterCount = researcher.getResearch( "wordsCharacterCount" );
	const customSplitIntoTokensHelper = researcher.getHelper( "splitIntoTokensCustom" );

	// Custom topic length criteria for languages that don't use the default value to determine whether a topic is long or short.
	const topicLengthCriteria = researcher.getConfig( "topicLength" ).lengthCriteria;

	const sentences = getSentencesFromTree( paper.getTree() );
	const topicForms = researcher.getResearch( "morphology" );

	const originalTopic = [];
	if ( getContentWordsHelper ) {
		originalTopic.push( getContentWordsHelper( paper.getKeyword() ) );
		parseSynonyms( paper.getSynonyms() ).forEach( synonym => originalTopic.push( getContentWordsHelper( synonym ) ) );
	}
	const locale = paper.getLocale();
	const topicFormsInOneArray = [ topicForms.keyphraseForms ];
	topicForms.synonymsForms.forEach( function( synonym ) {
		topicFormsInOneArray.push( synonym );
	} );

	// Get per-sentence scores and sentences that have a topic.
	const {
		maximizedSentenceScores,
		sentencesToHighlight,
	} = getSentenceScores( sentences, topicFormsInOneArray, locale, functionWords, matchWordCustomHelper,
		topicLengthCriteria, originalTopic, wordsCharacterCount, customSplitIntoTokensHelper );

	const maxLengthDistraction = getDistraction( maximizedSentenceScores );

	return {
		sentencesToHighlight: flattenDeep( sentencesToHighlight ),
		keyphraseDistributionScore: maxLengthDistraction / sentences.length * 100,
	};
};

export {
	computeScoresPerSentence,
	maximizeSentenceScores,
	keyphraseDistributionResearcher,
	getDistraction,
};

export default keyphraseDistributionResearcher;
