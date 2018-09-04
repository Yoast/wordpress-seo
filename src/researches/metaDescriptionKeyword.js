import matchTextWithWord from '../stringProcessing/matchTextWithWord.js';

import { escapeRegExp } from "lodash-es";

/**
 * Matches the keyword in the description if a description and keyword are available.
 * default is -1 if no description and/or keyword is specified
 *
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The number of matches with the keyword
 */
export default function( paper ) {
	if ( paper.getDescription() === "" ) {
		return -1;
	}
	var keyword = escapeRegExp( paper.getKeyword() );
	return matchTextWithWord( paper.getDescription(), keyword, paper.getLocale() ).count;
};

