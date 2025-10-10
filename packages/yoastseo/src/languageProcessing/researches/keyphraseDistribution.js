import { flattenDeep, max } from "lodash";
import parseSynonyms from "../helpers/sanitize/parseSynonyms";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import getMarkingsInSentence from "../helpers/highlighting/getMarkingsInSentence";
import matchWordFormsWithSentence from "../helpers/match/matchWordFormsWithSentence";
import getSentences from "../helpers/sentence/getSentences";
import { filterShortcodesFromHTML } from "../helpers";
import { markWordsInASentence } from "../helpers/word/markWordsInSentences";

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

// The threshold above which a sentence is considered to contain the topic.
const TOPIC_RELEVANCE_THRESHOLD = 3;

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
	return sentences.map( sentence => {
		// UseExactMatching is always false here because we always want to match different forms of the words in the topic.
		const matchedKeyphrase = topic.map( wordForms => matchWordFormsWithSentence( sentence,
			wordForms, locale, matchWordCustomHelper, false, customSplitIntoTokensHelper ) );
		const foundWords = matchedKeyphrase.reduce( ( count, { count: matchCount } ) => {
			return matchCount > 0 ? count + 1 : count;
		}, 0 );

		const matches = flattenDeep( matchedKeyphrase.map( match => match.matches ) );
		const matchedPercentage = topic.length > 0 ? Math.round( ( foundWords / topic.length ) * 100 ) : 0;

		/*
		 For short topics (less than 4 words) we require a full match to give the highest score.
		 For longer topics (4 words or more) we require at least half of the content words to be present in the sentence.
		 */
		if ( ( isShortTopic && matchedPercentage === 100 ) || ( ! isShortTopic && matchedPercentage >= 50 ) ) {
			return { score: 9, matches };
		}
		return { score: 3, matches: [] };
	} );
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
	// Get the indices of sentences that contain the topic.
	const topicSentenceIndices = sentenceScores
		.map( ( score, index ) => score > TOPIC_RELEVANCE_THRESHOLD ? index : -1 )
		.filter( index => index !== -1 );

	// Early return if there are no topic sentences at all.
	if ( topicSentenceIndices.length === 0 ) {
		return numberOfSentences;
	}

	/*
	 Add boundaries to the array of topic sentence indices to make sure we also consider the text before the first and after the last topic sentence.
	 -1 is added before the first index to represent the position before the first sentence.
	 numberOfSentences is added after the last index to represent the position after the last sentence.
	 This way we can calculate the lengths of the pieces of text before the first topic sentence and after the last topic sentence in the same way
	 as we calculate the lengths of the pieces of text between topic sentences.
	 */
	const topicIndicesWithBoundaries = [ -1, ...topicSentenceIndices, numberOfSentences ];

	/*
	 Calculate the lengths of all pieces of text that do not contain the topic.
	 This is done by calculating the difference between every two subsequent topic sentence indices,
	 subtracting 1 to not include the topic sentence itself.
	 We loop from the second element to the last element and subtract from each the previous element.
	 */
	const distractionsLength = topicIndicesWithBoundaries
		.slice( 1 )
		.map( ( topicIndex, index ) => topicIndex - topicIndicesWithBoundaries[ index ] - 1 );
	return max( distractionsLength );
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
	// Determine whether the language has function words.
	const hasFunctionWords = functionWords.length > 0;

	const sentenceScores = topicFormsInOneArray.map( ( topic, index ) => {
		if ( ! hasFunctionWords ) {
			// For languages without function words apply the full match always.
			return computeScoresPerSentence( topic, sentences, locale, true, matchWordCustomHelper, customSplitIntoTokensHelper );
		}
		// For languages with function words we decide whether to apply full or partial match depending on the topic length.
		/*
		 * If the helper to calculate the character length of all the words in the array is available,
		 * we use this helper to calculate the characters length of the original topic form.
		 * We then use the result and compare it with the topicLengthCriteria.
		 */
		const topicLength = wordsCharacterCount ? wordsCharacterCount( originalTopic[ index ] ) : topic.length;
		const isShortTopic = topicLength < topicLengthCriteria;
		return computeScoresPerSentence( topic, sentences, locale, isShortTopic, matchWordCustomHelper, customSplitIntoTokensHelper );
	} );

	// Maximize scores: Give every sentence a maximal score that it got from analysis of all topics.
	const maximizedSentenceScores = maximizeSentenceScores( sentenceScores );

	// Combine sentences with their scores.
	const sentencesWithMaximizedScores = sentences.map( ( sentence, index ) => {
		const { score, matches } = maximizedSentenceScores[ index ];
		return { sentence, score, matches };
	} );

	// Filter sentences that contain topic words for future highlights.
	const sentencesWithTopic = sentencesWithMaximizedScores.filter( sentenceObject => sentenceObject.score > TOPIC_RELEVANCE_THRESHOLD );

	const sentencesToHighlight = sentencesWithTopic.map( ( { sentence, matches } ) => {
		if ( matchWordCustomHelper ) {
			// Currently, this check is only applicable for Japanese.
			return markWordsInASentence( sentence, matches, matchWordCustomHelper );
		}
		return getMarkingsInSentence( sentence, matches );
	} );

	return {
		maximizedSentenceScores: maximizedSentenceScores.map( sentenceScore => sentenceScore.score ),
		sentencesToHighlight,
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
	const wordsCharacterCount = researcher.getHelper( "wordsCharacterCount" );
	const customSplitIntoTokensHelper = researcher.getHelper( "splitIntoTokensCustom" );
	const customSentenceTokenizer = researcher.getHelper( "memoizedTokenizer" );

	// Custom topic length criteria for languages that don't use the default value to determine whether a topic is long or short.
	const topicLengthCriteria = researcher.getConfig( "topicLength" ).lengthCriteria;

	const text = matchWordCustomHelper
		? filterShortcodesFromHTML( paper.getText(), paper._attributes && paper._attributes.shortcodes )
		: paper.getText();

	// When the custom helper is available, we're using the sentences retrieved from the text for the analysis.
	const sentences = matchWordCustomHelper ? getSentences( text, customSentenceTokenizer ) : getSentencesFromTree( paper.getTree() );
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
