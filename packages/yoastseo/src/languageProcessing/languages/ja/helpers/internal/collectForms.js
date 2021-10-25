import { escapeRegExp }  from "lodash-es";
import { StemOriginalPair, TopicPhrase } from "../../../../helpers/morphology/buildTopicStems";
import getWords from "./../getWords";
import functionWords from "./../../config/functionWords";

/**
 * Analyzes the focus keyword string or one synonym phrase.
 * Checks if morphology is requested or if the user wants to match exact string.
 * If morphology is required the module finds a stem for all words (if no function words list available) or
 * for all content words (i.e., excluding prepositions, articles, conjunctions, if the function words list is available).
 *
 * @param {string}   keyphrase             The keyphrase of the paper (or a synonym phrase) to get stem for.
 * @param {Function} createWordForms       The created language-specific word forms.
 *
 * @returns {TopicPhrase} Object with an array of StemOriginalPairs of all (content) words in the keyphrase or synonym
 * phrase and information about whether the keyphrase/synonym should be matched exactly.
 */
const buildForms = function( keyphrase, createWordForms ) {
	if ( isUndefined( keyphrase ) || keyphrase === "" ) {
		return new TopicPhrase();
	}

	// If the keyphrase is embedded in double quotation marks, return keyword itself, without outer-most quotation marks.
	const doubleQuotes = [ "「", "」", "『", "』", "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( doubleQuotes.includes( keyphrase[ 0 ] ) && doubleQuotes.includes( keyphrase[ keyphrase.length - 1 ] ) ) {
		keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		return new TopicPhrase(
			[ new StemOriginalPair( escapeRegExp( keyphrase ), keyphrase ) ],
			true
		);
	}

	let keyphraseWords = getWords( keyphrase );

	// Filter function words from keyphrase. Don't filter if the keyphrase only consists of function words.
	const wordsWithoutFunctionWords = keyphraseWords.filter( ( word ) => ! functionWords.includes( word ) );
	if ( wordsWithoutFunctionWords.length > 0 ) {
		keyphraseWords = wordsWithoutFunctionWords;
	}

	// Return a created form-original pair.
	const stemOriginalPairs = keyphraseWords.map( word => {
		return new StemOriginalPair( createWordForms( word ), word );
	} );

	return new TopicPhrase( stemOriginalPairs );
};

/**
 * Builds stems of words of the keyphrase and of each synonym phrase.
 *
 * @param {string}   keyphrase             The paper's keyphrase.
 * @param {string[]} synonyms              The paper's synonyms.
 * @param {Function} createWordForms       The created language-specific word forms.
 *
 * @returns {Object} Object with an array of stems of words in the keyphrase and an array of arrays of stems of words in the synonyms.
 */
export default function collectKeyphraseAndSynonymsForms( keyphrase, synonyms, createWordForms ) {
	const keyphraseForms = buildForms( keyphrase, createWordForms );
	const synonymsForms = synonyms.map( synonym => buildForms( synonym, createWordForms ) );

	return {
		keyphraseForms,
		synonymsForms,
	};
};
