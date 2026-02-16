import stripSomeTags from "../helpers/sanitize/stripNonTextTags";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers";
import getAllWordsFromTree from "../helpers/word/getAllWordsFromTree";
import { flattenDeep, isEmpty } from "lodash";
import { matchWordFormsInSentence } from "../helpers/match/matchWordFormsWithSentence";
import getMarkingsInSentence from "../helpers/highlighting/getMarkingsInSentence";
import { markWordsInASentence } from "../helpers/word/markWordsInSentences";

/**
 * @typedef {import("../../languageProcessing/AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 * @typedef {import("../../parse/structure/Node").default } Node
 * @typedef {import("../../parse/structure/Sentence").default } Sentence
 * @typedef {import("../../parse/structure/Token").default } Token
 * @typedef {import("../../parse/structure/Heading").default } Heading
 * @typedef {import("./getWordForms").TopicFormsResult } TopicFormsResult
 */

/**
 * @typedef {Object} SubheadingsWithTopicResult
 * @property {number} numberOfSubheadings The number or subheadings that reflect the topic.
 * @property {Mark[]} markings The markings of the matches in the subheadings that reflect the topic.
 */

/**
 * @typedef {Object} KeyphraseInSubheadingsResult
 * @property {number} count The number of subheadings.
 * @property {SubheadingsWithTopicResult} matches The subheadings that reflect the topic and the markings of the matches in those subheadings.
 * @property {number} percentReflectingTopic The percentage of subheadings reflecting the topic.
 * @property {number} textLength The length of the text that was analyzed in words or in characters depending on the configuration.
 * @property {Heading[]} subheadings An array of objects representing the subheadings, their content and position.
 */

/**
 * Checks if the keyphrase or its synonyms are found in the heading and returns the percentage of the keyphrase words that were matched in the heading by at least one form, the matches and whether the matches are for the keyphrase or a synonym.
 * @param {TopicFormsResult} topicForms The object with word forms of all (content) words from the keyphrase and eventually synonyms.
 * @param {Heading|string} heading The heading node or string to match the word forms against.
 * @param {boolean} useSynonyms Whether to use synonyms as if it was keyphrase or not (depends on the assessment).
 * @param {string} locale The locale of the paper.
 * @param {Node} tree The tree representation of the paper's content, used to find parent nodes of sentences in the heading.
 * @param {Function} matchWordCustomHelper The language-specific helper function to match word in text.
 * @param {Function} customSplitIntoTokensHelper A custom helper to split sentences into tokens, used in some languages to split sentences into words.
 * @returns {{percentWordMatches: number, matches: Token[], keyphraseOrSynonym: string, sentencesWithTopicForms: Sentence[]}} Object containing the percentage of the keyphrase words that were matched in the heading by at least one form, the matches and whether the matches are for the keyphrase or a synonym.
 */
const findTopicFormsInHeading = ( topicForms,
	heading,
	useSynonyms,
	locale,
	tree,
	matchWordCustomHelper,
	customSplitIntoTokensHelper ) => {
	const sentences = [];
	if ( typeof heading === "string" ) {
		sentences.push( heading );
	} else {
		const headingSentences = heading.sentences.map( sentence => {
			sentence.setParentAttributes( heading, tree );
			return sentence;
		} );
		sentences.push( ...headingSentences );
	}
	const sentencesWithTopicForms = [];
	// First check if the keyword is found in the text
	const keyphraseForms = topicForms.keyphraseForms;
	const synonymsForms = topicForms.synonymsForms;
	// For each sentence in the heading, check how many words of the keyphrase are found in the sentence and save the matches.
	// Collect all the matches of the sentences in the heading and calculate the percentage of the keyphrase words found in the heading.
	const keyphraseMatches = [];
	let keyphraseMatchCount = 0;
	sentences.forEach( ( sentence ) => {
		const matchedKeyphrase = keyphraseForms.map( wordForms => matchWordFormsInSentence( sentence,
			wordForms, locale, matchWordCustomHelper, false, customSplitIntoTokensHelper ) );
		const foundWords = matchedKeyphrase.reduce( ( count, { count: matchCount } ) => {
			return matchCount > 0 ? count + 1 : count;
		}, 0 );
		keyphraseMatches.push( matchedKeyphrase  );
		keyphraseMatchCount += foundWords;
		if ( foundWords > 0 ) {
			sentencesWithTopicForms.push( sentence );
		}
	} );


	const matchedPercentage = keyphraseForms.length > 0 ? Math.round( ( keyphraseMatchCount / keyphraseForms.length ) * 100 ) : 0;
	const keyphraseResult = {
		percentWordMatches: matchedPercentage,
		matches: flattenDeep( keyphraseMatches.map( match => match.map( wordFormMatch => wordFormMatch.matches ) ) ),
		sentencesWithTopicForms,
		keyphraseOrSynonym: "keyphrase",
	};

	// If a full match found with the keyword or if no synonyms are supplied or supposed to be used, return the keyphrase search result.
	if ( keyphraseResult.percentWordMatches === 100 || useSynonyms === false || isEmpty( synonymsForms ) ) {
		return keyphraseResult;
	}

	// Loop through the synonyms and check how many words of each synonym are found in the sentences of the heading, save the matches and calculate the percentage of the synonym words found in the heading.
	const synonymResults = synonymsForms.map( synonymForm => {
		const sentencesWithSynonymForms = [];
		const synonymMatches = [];
		let synonymMatchCount = 0;
		sentences.forEach( ( sentence ) => {
			const matchedSynonym = synonymForm.map( wordForms => matchWordFormsInSentence( sentence,
				wordForms, locale, matchWordCustomHelper, false, customSplitIntoTokensHelper ) );
			const foundWords = matchedSynonym.reduce( ( count, { count: matchCount } ) => {
				return matchCount > 0 ? count + 1 : count;
			}, 0 );
			synonymMatches.push( matchedSynonym );
			synonymMatchCount += foundWords;
			if ( foundWords > 0 ) {
				sentencesWithSynonymForms.push( sentence );
			}
		} );

		const synonymMatchedPercentage = synonymForm.length > 0 ? Math.round( ( synonymMatchCount / synonymForm.length ) * 100 ) : 0;

		return {
			percentWordMatches: synonymMatchedPercentage,
			matches: flattenDeep( synonymMatches.map( match => match.map( wordFormMatch => wordFormMatch.matches ) ) ),
			sentencesWithTopicForms: sentencesWithSynonymForms,
		};
	} );


	// Find which synonym occurred most fully.
	const foundSynonyms = synonymResults.map( resultSynonym => resultSynonym.percentWordMatches );
	const bestSynonymIndex = foundSynonyms.indexOf( Math.max( ...foundSynonyms ) );
	const bestSynonymResult = synonymResults[ bestSynonymIndex ];
	// If the best synonym showed lower results than the keyword, return the keyword.
	if ( keyphraseResult.percentWordMatches >= bestSynonymResult.percentWordMatches ) {
		return keyphraseResult;
	}

	// If the best synonym showed better results than the keyword, return the synonym.
	bestSynonymResult.keyphraseOrSynonym = "synonym";

	return bestSynonymResult;
};

/**
 * Checks which subheadings reflect the topic of the paper by matching the keyphrase and its synonyms against the subheadings
 * and returns the number of subheadings that reflect the topic and the markings of the matches in those subheadings.
 *
 * @param {TopicFormsResult}		topicForms      The main key phrase and its synonyms to check.
 * @param {Heading[]|string[]}		subheadings     The subheadings to check.
 * @param {boolean}		useSynonyms     Whether to match synonyms or only main keyphrase.
 * @param {string}		locale          The current locale.
 * @param {string[]}	functionWords	The function words list.
 * @param {Node}		tree            The tree representation of the paper's content, used to find parent nodes of sentences in the subheadings.
 * @param {Function}	matchWordCustomHelper   The language-specific helper function to match word in text.
 * @param {Function}	customSplitIntoTokensHelper A custom helper to split sentences into tokens, used in some languages to split sentences into words.
 *
 * @returns {SubheadingsWithTopicResult} An object containing the number of subheadings that reflect the topic and the markings of the matches in those subheadings.
 */
const getSubheadingsReflectingTopic = ( topicForms,
	subheadings,
	useSynonyms,
	locale,
	functionWords,
	tree,
	matchWordCustomHelper,
	customSplitIntoTokensHelper ) => {
	const subheadingsWithTopics = [];
	const allMatchedTopics = [];
	const sentencesWithTopicForms = [];
	subheadings.forEach( subheading => {
		const matchedTopicForms = findTopicFormsInHeading( topicForms,
			subheading,
			useSynonyms,
			locale,
			tree,
			matchWordCustomHelper,
			customSplitIntoTokensHelper
		);

		if ( ( functionWords.length === 0 && matchedTopicForms.percentWordMatches === 100 ) ||
			matchedTopicForms.percentWordMatches > 50
		) {
			subheadingsWithTopics.push( subheading );
			allMatchedTopics.push( ...matchedTopicForms.matches );
			sentencesWithTopicForms.push( ...matchedTopicForms.sentencesWithTopicForms );
		}
	} );

	const markings = sentencesWithTopicForms.map( sentence => {
		if ( matchWordCustomHelper ) {
			return markWordsInASentence( sentence, flattenDeep( allMatchedTopics ), matchWordCustomHelper );
		}
		return getMarkingsInSentence( sentence, flattenDeep( allMatchedTopics ) );
	} );
	return {
		numberOfSubheadings: subheadingsWithTopics.length,
		markings: flattenDeep( markings ),
	};
};

/**
 * Gets all h2 and h3 subheadings from the paper, excluding those without content.
 *
 * @param {Paper} paper The paper object containing the text and keyword.
 * @param {Node} tree The tree representation of the paper's content, used to find heading nodes.
 *
 * @returns {Heading[]} An array of heading nodes representing the top-level subheadings with content.
 */
const getTopLevelSubheadings = ( paper, tree ) =>{
	const topLevelSubheadings = tree.findAll( node => /h[2-3]/i.test( node.name ) );
	return topLevelSubheadings.filter( subheading => subheading?.sentences.length > 0 );
};

/**
 * Checks if there are any h2 or h3 subheadings in the text and if they have the keyphrase or synonyms in them.
 *
 * @param {Paper}		paper      The paper object containing the text and keyword.
 * @param {Researcher}	researcher The researcher object.
 *
 * @returns {KeyphraseInSubheadingsResult} An object containing the number of subheadings,
 * the number of subheadings reflecting the topic, the percentage of subheadings reflecting the topic and an empty string.
 */
export default function matchKeywordInSubheadings( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );

	// A custom helper to match word in text.
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const customCountLength = researcher.getHelper( "customCountLength" );
	const customSplitIntoTokensHelper = researcher.getHelper( "splitIntoTokensCustom" );

	let textLength = getAllWordsFromTree( paper ).length;
	if ( customCountLength ) {
		let text = paper.getText();
		text = removeHtmlBlocks( text );
		text = filterShortcodesFromHTML( text, paper._attributes && paper._attributes.shortcodes );
		text = stripSomeTags( text );
		textLength = customCountLength( text );
	}
	const topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const tree = paper.getTree();

	const useSynonyms = true;
	const subheadings = getTopLevelSubheadings( paper, tree );
	const subheadingsWithKeyphrase = getSubheadingsReflectingTopic( topicForms,
		subheadings,
		useSynonyms,
		locale,
		functionWords,
		tree,
		matchWordCustomHelper,
		customSplitIntoTokensHelper
	);

	/* @type {KeyphraseInSubheadingsResult} */
	return {
		count: subheadings.length,
		matches: subheadingsWithKeyphrase,
		percentReflectingTopic: subheadings.length ? subheadingsWithKeyphrase / subheadings.length * 100 : 0,
		textLength: textLength,
		subheadings,
	};
}
