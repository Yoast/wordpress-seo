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

	/*
	 * Whether we want to split words on hyphens depends on the language. In most languages, we do want to consider
	 * hyphens (and en-dashes) word boundaries. But for example in Indonesian, hyphens are used to form plural forms
	 * of nouns, e.g. 'buku' is the singular form for 'book' and 'buku-buku' is the plural form. So it makes sense to
	 * not split words on hyphens in Indonesian and consider 'buku-buku' as one word rather than two.
	 */
	const areHyphensWordBoundaries = researcher.getConfig( "areHyphensWordBoundaries" );

	let keyphraseWords;
	if ( getWordsCustomHelper ) {
		keyphraseWords = getWordsCustomHelper( keyphrase );
	} else if ( areHyphensWordBoundaries ) {
		keyphraseWords = getWords( keyphrase, "[\\s\\u2013\\u002d]" );
	} else {
		keyphraseWords = getWords( keyphrase );
	}

	keyphraseWords = filter( keyphraseWords, function( word ) {
		return ( ! includes( functionWords, word.trim().toLocaleLowerCase() ) );
	} );

	return isEmpty( keyphraseWords );
}
