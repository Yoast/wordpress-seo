/** @module analyses/getKeywordCount */

import matchWords from "../helpers/match/matchTextWithArray";
import { uniq as unique } from "lodash-es";
import { flattenDeep } from "lodash-es";
import getSentences from "../helpers/sentence/getSentences";
import { markWordsInSentences } from "../helpers/word/markWordsInSentences";

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

	const keywordsFound = {
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
		const matchesInSentence = topicForms.keyphraseForms.map( keywordForms => matchWords( sentence, keywordForms, locale ) );
		const hasAllKeywords = matchesInSentence.every( keywordForm => keywordForm.count > 0 );

		if ( hasAllKeywords ) {
			const counts = matchesInSentence.map( match => match.count );
			const foundWords = flattenDeep( matchesInSentence.map( match => match.matches ) );
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
		length: topicForms.keyphraseForms.length,
	};
}
