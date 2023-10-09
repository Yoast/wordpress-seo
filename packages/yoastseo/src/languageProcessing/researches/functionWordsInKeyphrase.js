import { filter, includes, isEmpty } from "lodash-es";
import getWords from "../helpers/word/getWords";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest";

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

	const areHyphensWordBoundaries = researcher.getConfig( "areHyphensWordBoundaries" );

	/*
     * For keyphrase matching, we want to split words on hyphens and en-dashes, except if in a specific language hyphens
     * shouldn't be treated as word boundaries. For example in Indonesian, hyphens are used to create plural forms of nouns,
     * such as "buku-buku" being a plural form of "buku". We want to treat forms like "buku-buku" as one word, so we shouldn't
     * split words on hyphens in Indonesian.
     * If hyphens should be treated as word boundaries, pass a custom word boundary regex string to the getWords helper
     * that includes hyphens (u002d) and en-dashes (u2013). Otherwise, pass a regex that only includes en-dashes.
     */
	let keyphraseWords;
	if ( getWordsCustomHelper ) {
		keyphraseWords = getWordsCustomHelper( keyphrase );
	} else if ( areHyphensWordBoundaries ) {
		keyphraseWords = getWords( keyphrase, "[\\s\\u2013\\u002d]" );
	} else {
		keyphraseWords = getWords( keyphrase, "[\\s\\u2013]" );
	}

	keyphraseWords = filter( keyphraseWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( keyphraseWords );
}
