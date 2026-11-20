import { countTopicPhrasesInSentence } from "../helpers/match/matchWordFormsWithSentence.js";
import getSentences from "../helpers/sentence/getSentences.js";
import splitIntoTokens from "../helpers/word/splitIntoTokens.js";

/**
 * @typedef {import("../AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * Counts the number of full keyphrase matches in the description. Takes synonyms into account.
 *
 * @param {Paper}      paper      The paper object containing the description.
 * @param {Researcher} researcher The researcher object to gather researchers from.
 *
 * @returns {number} The number of keyphrase matches for the entire description.
 */
export default function( paper, researcher ) {
	const description = paper.getDescription();
	const locale = paper.getLocale();

	const topicForms = researcher.getResearch( "morphology" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const splitter = researcher.getHelper( "splitIntoTokensCustom" ) || splitIntoTokens;
	const topicPhrases = [ topicForms.keyphraseForms, ...( topicForms.synonymsForms || [] ) ];

	const sentences = getSentences( description, memoizedTokenizer );

	return sentences.reduce( ( sum, sentence ) =>
		sum + countTopicPhrasesInSentence( sentence, topicPhrases, locale, matchWordCustomHelper, splitter ), 0 );
}

