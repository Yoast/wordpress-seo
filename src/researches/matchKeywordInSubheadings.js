/* @module analyses/matchKeywordInSubheadings */

import stripSomeTags from "../stringProcessing/stripNonTextTags.js";

import subheadingMatch from "../stringProcessing/subheadingsMatch.js";
import { getSubheadingContents } from "../stringProcessing/getSubheadings.js";

import { escapeRegExp } from "lodash-es";

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {object} paper The paper object containing the text and keyword.
 * @returns {object} the result object.
 */
export default function( paper ) {
	var text = paper.getText();
	var keyword = escapeRegExp( paper.getKeyword() );
	var locale = paper.getLocale();
	var result = { count: 0 };
	text = stripSomeTags( text );
	var matches = getSubheadingContents( text );

	if ( 0 !== matches.length ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword, locale );
	}

	return result;
}

