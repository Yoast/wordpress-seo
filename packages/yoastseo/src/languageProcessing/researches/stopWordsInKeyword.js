/** @module researches/stopWordsInKeyword */
import { escapeRegExp } from "lodash-es";

import wordsInText from "../helpers/word/wordsInText";

/**
 * Checks for the amount of stop words in the keyword.
 *
 * @param {Object}     paper      The paper object containing the text and keyword.
 * @param {Researcher} researcher The researcher object.
 *
 * @returns {Array} All the stopwords that were found in the keyword.
 */
export default function( paper, researcher ) {
	const stopWords = researcher.getConfig( "stopWords" );
	const keyword   = escapeRegExp( paper.getKeyword() );
	return wordsInText( keyword, stopWords );
}
