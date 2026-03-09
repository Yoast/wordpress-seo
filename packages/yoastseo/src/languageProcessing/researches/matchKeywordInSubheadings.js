import stripSomeTags from "../helpers/sanitize/stripNonTextTags";
import removeHtmlBlocks from "../helpers/html/htmlParser";
import { filterShortcodesFromHTML } from "../helpers";
import getAllWordsFromTree from "../helpers/word/getAllWordsFromTree";
import { flattenDeep, isEmpty } from "lodash";
import matchWordFormsWithSentence from "../helpers/match/matchWordFormsWithSentence";
import getMarkingsInSentence from "../helpers/highlighting/getMarkingsInSentence";
import { markWordsInASentence } from "../helpers/word/markWordsInSentences";
import isDoubleQuoted from "../helpers/match/isDoubleQuoted";

/**
 * @typedef {import("../AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 * @typedef {import("../../values/").Mark } Mark
 * @typedef {import("../../parse/structure/Node").default } Node
 * @typedef {import("../../parse/structure/Sentence").default } Sentence
 * @typedef {import("../../parse/structure/Token").default } Token
 * @typedef {import("../../parse/structure/Heading").default } Heading
 * @typedef {import("./getWordForms").TopicFormsResult } TopicFormsResult
 * @typedef {import("../helpers/match/matchWordFormsWithSentence").MatchResult } MatchResult
 */

/**
 * A Heading node that has been enriched with sentences by the language processor.
 *
 * @typedef {Heading & { sentences: Sentence[] }} HeadingWithSentences
 */

/**
 * @typedef {Object} SubheadingsWithTopicResult
 * @property {number} numberOfSubheadings The number of subheadings that reflect the topic.
 * @property {Mark[]} markings The markings of the matches in the subheadings that reflect the topic.
 */

/**
 * @typedef {Object} TopicFormsInSubheadingsResult
 * @property {number} percentWordMatches The percentage of the topic words that were matched in the subheadings by at least one form.
 * @property {Token[]|string[]} matches The matched topic forms in the subheadings.
 * @property {Sentence[]} sentencesWithTopicForms The sentences in the subheadings that contain the matched topic forms.
 */

/**
 * @typedef {Object} MatchedTopicFormsInSentencesResult
 * @property {MatchResult[][]} matches The matched topic forms in the sentences.
 * @property {number} matchCount The number of matched topic forms in the sentences.
 * @property {Sentence[]} sentencesWithMatches The sentences that contain the matched topic forms.
 */

/**
 * @typedef {Object} KeyphraseInSubheadingsResult
 * @property {number} count The number of subheadings.
 * @property {SubheadingsWithTopicResult} matches The subheadings that reflect the topic and the markings of the matches in those subheadings.
 * @property {number} textLength The length of the text that was analyzed in words or in characters depending on the configuration.
 */

/**
 * Extracts sentences from a heading, setting parent attributes if needed.
 *
 * @param {HeadingWithSentences} heading The heading node.
 * @param {Node} tree The tree representation of the paper's content.
 *
 * @returns {Sentence[]} An array of sentences from the heading.
 */
const getSentencesFromHeading = ( heading, tree ) => {
	return heading.sentences.map( sentence => {
		sentence.setParentAttributes( heading, tree );
		return sentence;
	} );
};

/**
 * Matches word forms against sentences and calculates match statistics.
 *
 * @param {Sentence[]} sentences The sentences to match against.
 * @param {string[][]} wordForms The word forms to match.
 * @param {string} locale The locale of the paper.
 * @param {Function} matchWordCustomHelper The language-specific helper function to match word in text.
 * @param {boolean} isExactMatchRequested Whether to match the keyphrase forms exactly.
 * @param {Function} customSplitIntoTokensHelper A custom helper to split sentences into tokens.
 *
 * @returns {MatchedTopicFormsInSentencesResult} The match results.
 */
const matchWordFormsInSentences = ( sentences, wordForms, locale, matchWordCustomHelper, isExactMatchRequested, customSplitIntoTokensHelper ) => {
	/** @type {MatchResult[][]} */
	const allMatches = [];
	let totalMatchCount = 0;
	/** @type {Sentence[]} */
	const sentencesWithMatches = [];

	sentences.forEach( sentence => {
		const sentenceToMatch = matchWordCustomHelper ? sentence.text : sentence;
		const matchedForms = wordForms.map( forms =>
			matchWordFormsWithSentence( sentenceToMatch, forms, locale, matchWordCustomHelper, isExactMatchRequested, customSplitIntoTokensHelper )
		);

		const foundWords = matchedForms.reduce( ( count, { count: matchCount } ) => matchCount > 0 ? count + 1 : count, 0 );

		allMatches.push( matchedForms );
		totalMatchCount += foundWords;

		if ( foundWords > 0 ) {
			sentencesWithMatches.push( sentence );
		}
	} );

	return { matches: allMatches, matchCount: totalMatchCount, sentencesWithMatches };
};

/**
 * Creates a result object from match data.
 *
 * @param {MatchedTopicFormsInSentencesResult} matchedTopicData The data containing matches, match count and sentences with matches.
 * @param {number} topicLength The total number of words in the topic (keyphrase or synonym).
 *
 * @returns {TopicFormsInSubheadingsResult} The result object.
 */
const createMatchResult = ( matchedTopicData, topicLength ) => {
	const { matches, matchCount, sentencesWithMatches } = matchedTopicData;
	const percentWordMatches = topicLength > 0 ? Math.round( ( matchCount / topicLength ) * 100 ) : 0;
	/* @type {Token[]|string[]} */
	const flattenedMatches = flattenDeep( matches.map( match => match.map( wordFormMatch => wordFormMatch.matches ) ) );
	return {
		percentWordMatches,
		matches: flattenedMatches,
		sentencesWithTopicForms: sentencesWithMatches,
	};
};

/**
 * Finds the best synonym match from all synonym results.
 *
 * @param {TopicFormsInSubheadingsResult[]} synonymResults The results from matching all synonyms.
 * @param {TopicFormsInSubheadingsResult} keyphraseResult The result from matching the keyphrase.
 *
 * @returns {TopicFormsInSubheadingsResult} The best result (either keyphrase or the best synonym).
 */
const getBestSynonymMatch = ( synonymResults, keyphraseResult ) => {
	const foundSynonyms = synonymResults.map( result => result.percentWordMatches );
	const bestSynonymIndex = foundSynonyms.indexOf( Math.max( ...foundSynonyms ) );
	const bestSynonymResult = synonymResults[ bestSynonymIndex ];

	if ( keyphraseResult.percentWordMatches >= bestSynonymResult.percentWordMatches ) {
		return keyphraseResult;
	}

	return bestSynonymResult;
};

/**
 * Checks if the keyphrase or its synonyms are found in the heading and returns the percentage of the keyphrase words
 * that were matched in the heading by at least one form, the matches and whether the matches are for the keyphrase or a synonym.
 *
 * @param {TopicFormsResult} topicForms The object with word forms of all (content) words from the keyphrase and eventually synonyms.
 * @param {HeadingWithSentences} heading The heading node to match the word forms against.
 * @param {boolean} useSynonyms Whether to use synonyms as if it was keyphrase or not (depends on the assessment).
 * @param {string} locale The locale of the paper.
 * @param {Node} tree The tree representation of the paper's content, used to find parent nodes of sentences in the heading.
 * @param {Function} matchWordCustomHelper The language-specific helper function to match word in text.
 * @param {Function} customSplitIntoTokensHelper A custom helper to split sentences into tokens, used in some languages to split sentences into words.
 * @param {boolean} isExactMatchRequested Whether to match the keyphrase forms exactly or not, based on whether the keyphrase is enclosed in double quotes.
 *
 * @returns {TopicFormsInSubheadingsResult} An object containing the percentage of matched words, the matches and the sentences with matched topic forms in the heading.
 */
const findTopicFormsInHeading = ( topicForms,
	heading,
	useSynonyms,
	locale,
	tree,
	matchWordCustomHelper,
	customSplitIntoTokensHelper,
	isExactMatchRequested ) => {
	const sentences = getSentencesFromHeading( heading, tree );
	const { keyphraseForms, synonymsForms } = topicForms;

	// Match keyphrase forms against sentences.
	const keyphraseMatchData = matchWordFormsInSentences(
		sentences, keyphraseForms, locale, matchWordCustomHelper, isExactMatchRequested, customSplitIntoTokensHelper
	);
	const keyphraseResult = createMatchResult( keyphraseMatchData, keyphraseForms.length );

	// Return early if full match found, synonyms not used, or no synonyms available.
	if ( keyphraseResult.percentWordMatches === 100 || useSynonyms === false || isEmpty( synonymsForms ) ) {
		return keyphraseResult;
	}

	// Match each synonym against sentences and find the best result.
	const synonymResults = synonymsForms.map( synonymForm => {
		const synonymMatchData = matchWordFormsInSentences(
			sentences, synonymForm, locale, matchWordCustomHelper, isExactMatchRequested, customSplitIntoTokensHelper
		);
		return createMatchResult( synonymMatchData, synonymForm.length );
	} );

	return getBestSynonymMatch( synonymResults, keyphraseResult );
};

/**
 * Checks which sentences in the subheadings contain the matched topics and returns the markings of the matches in those sentences.
 *
 * @param {Sentence[]} sentences The sentences to check for the matched topics.
 * @param {Token[]|string[]} matchedTopics The matched topics to check for in the sentences.
 * @param {Function} matchWordCustomHelper The language-specific helper function to match word in text.
 *
 * @returns {Mark[]} An array of markings of the matches in the sentences.
 */
const getMarkingsInSentences = ( sentences, matchedTopics, matchWordCustomHelper ) => {
	const markings = sentences.map( sentence => {
		if ( matchWordCustomHelper ) {
			return markWordsInASentence( sentence.text, flattenDeep( matchedTopics ), matchWordCustomHelper );
		}
		// Don't get the marking for the sentence if the matched topics are not found in this sentence.
		const sentencePosition = sentence.sourceCodeRange;
		const sentenceStartOffset = sentencePosition.startOffset;
		const sentenceEndOffset = sentencePosition.endOffset;
		// Filter the matched topics to only include those that are found in the current sentence based on their position in the source code.
		const matchedTopicsInSentence = flattenDeep( matchedTopics ).filter( matchedTopic => {
			const matchedTopicPosition = matchedTopic.sourceCodeRange;
			return matchedTopicPosition.startOffset >= sentenceStartOffset && matchedTopicPosition.endOffset <= sentenceEndOffset;
		} );
		if ( matchedTopicsInSentence.length === 0 ) {
			return null;
		}
		return getMarkingsInSentence( sentence, matchedTopicsInSentence );
	} ).filter( Boolean );

	return flattenDeep( markings );
};

/**
 * Checks which subheadings reflect the topic of the paper by matching the keyphrase and its synonyms against the subheadings
 * and returns the number of subheadings that reflect the topic and the markings of the matches in those subheadings.
 *
 * @param {TopicFormsResult}	topicForms      The main key phrase and its synonyms to check.
 * @param {HeadingWithSentences[]} subheadings The subheadings to check.
 * @param {boolean}		useSynonyms     Whether to match synonyms or only main keyphrase.
 * @param {string}		locale          The current locale.
 * @param {string[]}	functionWords	The function words list.
 * @param {Node}		tree            The tree representation of the paper's content, used to find parent nodes of sentences in the subheadings.
 * @param {Function}	matchWordCustomHelper   	The language-specific helper function to match word in text.
 * @param {Function}	customSplitIntoTokensHelper A custom helper to split sentences into tokens, used in some languages to split sentences into words.
 * @param {boolean}		isExactMatchRequested 		Whether to match the keyphrase forms exactly or not, based on whether the keyphrase is enclosed in double quotes.
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
	customSplitIntoTokensHelper,
	isExactMatchRequested ) => {
	const subheadingsWithTopics = [];
	/** @type {Token[]} */
	const allMatchedTopics = [];
	/** @type {Sentence[]} */
	const sentencesWithTopicForms = [];

	subheadings.forEach( subheading => {
		const matchedTopicForms = findTopicFormsInHeading( topicForms,
			subheading,
			useSynonyms,
			locale,
			tree,
			matchWordCustomHelper,
			customSplitIntoTokensHelper,
			isExactMatchRequested
		);

		if ( ( functionWords.length === 0 && matchedTopicForms.percentWordMatches === 100 ) ||
			( functionWords.length > 0 && matchedTopicForms.percentWordMatches > 50 )
		) {
			subheadingsWithTopics.push( subheading );
			allMatchedTopics.push( ...matchedTopicForms.matches );
			sentencesWithTopicForms.push( ...matchedTopicForms.sentencesWithTopicForms );
		}
	} );

	const markings = getMarkingsInSentences( sentencesWithTopicForms, allMatchedTopics, matchWordCustomHelper );

	return {
		numberOfSubheadings: subheadingsWithTopics.length,
		markings,
	};
};

/**
 * Gets all h2 and h3 subheadings from the paper, excluding those without content.
 *
 * @param {Node} tree The tree representation of the paper's content, used to find heading nodes.
 *
 * @returns {HeadingWithSentences[]} An array of heading nodes representing the top-level subheadings with content.
 */
const getTopLevelSubheadings = ( tree ) =>{
	const topLevelSubheadings = tree.findAll( node => /h[2-3]/i.test( node.name ) );
	return topLevelSubheadings.filter( subheading => subheading?.sentences.length > 0 );
};

/**
 * Checks if there are any h2 or h3 subheadings in the text and if they have the keyphrase or synonyms in them.
 *
 * @param {Paper}		paper      The paper object containing the text and keyword.
 * @param {Researcher}	researcher The researcher object.
 *
 * @returns {KeyphraseInSubheadingsResult} An object containing the number of subheadings, the subheadings that reflect the topic, and the length of the text that was analyzed.
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
		text = filterShortcodesFromHTML( text, ( paper._attributes && paper._attributes.shortcodes ) || [] );
		text = stripSomeTags( text );
		textLength = customCountLength( text );
	}
	const topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const tree = paper.getTree();
	// Exact matching is requested when the keyphrase is enclosed in double quotes.
	const isExactMatchRequested = isDoubleQuoted( paper.getKeyword() );

	const useSynonyms = true;
	const subheadings = getTopLevelSubheadings( tree );
	const subheadingsWithKeyphrase = getSubheadingsReflectingTopic( topicForms,
		subheadings,
		useSynonyms,
		locale,
		functionWords,
		tree,
		matchWordCustomHelper,
		customSplitIntoTokensHelper,
		isExactMatchRequested
	);

	/* @type {KeyphraseInSubheadingsResult} */
	return {
		count: subheadings.length,
		matches: subheadingsWithKeyphrase,
		textLength: textLength,
	};
}
