/** @module analyses/getKeywordCount */

import matchWords from "../stringProcessing/matchTextWithArray";

import { uniq as unique } from "lodash-es";
import getSentences from "../stringProcessing/getSentences";

/**
 * Calculates the keyword count, takes morphology into account.
 *
 * @param {object} paper The paper containing keyword and text.
 * @param {object} researcher The researcher
 * @returns {number} The keyword count.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const text = paper.getText();
	const locale = paper.getLocale();

	const sentences = getSentences( text );

	let keywordsFound = {
		count: 0,
		matches: []
	};

	sentences.forEach( sentence => {
		let matches = topicForms.keyphraseForms.map( keywordForms => matchWords( sentence, keywordForms, locale ) );
		let hasAllKeywords = matches.every( keywordForm => keywordForm.count > 0 );
		if( hasAllKeywords ) {
			keywordsFound.count += matches.reduce( ( sum, match) => sum + match.count, 0 );
			keywordsFound.matches = matches.reduce( ( arr, match ) => [ ...arr, ...match.matches ] );
		}
	} );

	return {
		count: keywordsFound.count,
		matches: unique( keywordsFound.matches ).sort( ( a, b ) => b.length - a.length ),
	};
}
