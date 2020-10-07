/** @module researches/stopWordsInKeyword */
import { escapeRegExp } from "lodash-es";

import getStopWords from "../config/stopwords";
import wordsInText from "../../../helpers/word/wordsInText";
const stopwords = getStopWords();

/**
 * Checks for the amount of stop words in the keyword.
 * @param {Paper} paper The Paper object to be checked against.
 * @returns {Array} All the stopwords that were found in the keyword.
 */
export default function( paper ) {
	var keyword = escapeRegExp( paper.getKeyword() );
	return wordsInText( keyword, stopwords );
}
