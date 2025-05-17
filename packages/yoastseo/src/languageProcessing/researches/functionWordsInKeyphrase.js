import { filter, includes, isEmpty } from "lodash";
import getWords from "../helpers/word/getWords";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import { WORD_BOUNDARY_WITH_HYPHEN } from "../../config/wordBoundariesWithoutPunctuation";

/**
 * Checks if the keyphrase contains of function words only.
 *
 * @param {object} paper The paper containing the keyword.
 * @param {Researcher} researcher The researcher.
 *
 * @returns {boolean} Whether the keyphrase contains of content words only.
 */
export default function( paper, researcher ) {
	const functionWords = researcher.getConfig( "functionWords" );

	// A helper to get words from the keyphrase for languages that don't use the default way.
	const getWordsCustomHelper = researcher.getHelper( "getWordsCustomHelper" );
	const keyphrase = paper.getKeyword();

	// Return false if there are double quotes around the keyphrase.
	if ( processExactMatchRequest( keyphrase ).exactMatchRequested ) {
		return false;
	}

	/*
     * We use a word boundary regex that includes whitespaces, en-dashes, and hyphens for all languages.
     * This means that we also consider keyphrases that consist of function words separated by hyphens (e.g. 'two-year-old')
     * as containing only function words. Since many hyphenated phrases can also be written without hyphens, this way the
     * behavior for hyphenated phrases matches the behavior for unhyphenated phrases.
     * In Indonesian we normally don't want to treat hyphens as word boundaries, but in this case it makes sense because
     * in Indonesian you can also have function words seperated by hyphens (e.g. 'dua-lima').
     * As a downside, single function words containing hyphens (e.g. 'vis-à-vis') won't be automatically matched, but we
     * are solving this by adding each word from such function words as separate entries in the function words lists.
     */
	let keyphraseWords = getWordsCustomHelper ? getWordsCustomHelper( keyphrase )
		: getWords( keyphrase, WORD_BOUNDARY_WITH_HYPHEN );

	keyphraseWords = filter( keyphraseWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( keyphraseWords );
}
