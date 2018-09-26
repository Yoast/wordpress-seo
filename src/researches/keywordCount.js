/** @module analyses/getKeywordCount */

import getSentences from "../stringProcessing/getSentences";
import { findTopicFormsInString } from "./findKeywordFormsInString";

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

	let keywordCount = 0;

	/*
	 	Count the amount of key phrase occurrences in the sentences.
	 	An occurrence is counted when all keywords of the key phrase are contained within the sentence.
	 	Each sentence can contain multiple key phrases
	 	(e.g. "The apple potato is an apple and a potato." has two occurrences of the key phrase "apple potato").
	*/
	sentences.forEach( sentence => {
		let matches = findTopicFormsInString( topicForms, sentence, true, locale );
		if( matches.percentWordMatches === 100 ) {
			keywordCount += matches.countWordMatches;
		}
	} );

	return keywordCount;
}
