/** @module analyses/getKeywordCount */

import matchWords from "../stringProcessing/matchTextWithArray";
import { uniq as unique } from "lodash-es";
import { flattenDeep } from "lodash-es";
import getSentences from "../stringProcessing/getSentences";
import { markWordsInSentences } from "../stringProcessing/markWordsInSentences";

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
		matches: [],
		sentencesWithKeywords: [],
	};

	/*
	 * Count the amount of key phrase occurrences in the sentences.
	 * An occurrence is counted when all keywords of the key phrase are contained within the sentence.
	 * Each sentence can contain multiple key phrases
	 * (e.g. "The apple potato is an apple and a potato." has two occurrences of the key phrase "apple potato").
	 */
	sentences.forEach( sentence => {
		let matches = topicForms.keyphraseForms.map( keywordForms => matchWords( sentence, keywordForms, locale ) );
		let hasAllKeywords = matches.every( keywordForm => keywordForm.count > 0 );

		if( hasAllKeywords ) {
			let counts = matches.map( match => match.count );
			let foundWords = flattenDeep( matches.map( match => match.matches ) );
			keywordsFound.count += Math.min( ...counts );
			keywordsFound.matches.push( foundWords );
			keywordsFound.sentencesWithKeywords.push( sentence );
		}
	} );

	const matches = unique( flattenDeep( keywordsFound.matches ) ).sort( ( a, b ) => b.length - a.length );

	return {
		count: keywordsFound.count,
		matches: matches,
		markings: markWordsInSentences( matches, keywordsFound.sentencesWithKeywords, locale ),
	};
}
