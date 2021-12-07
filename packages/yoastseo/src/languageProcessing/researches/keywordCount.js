/** @module analyses/getKeywordCount */

import matchWords from "../helpers/match/matchTextWithArray";
import { uniq as unique } from "lodash-es";
import { flattenDeep } from "lodash-es";
import getSentences from "../helpers/sentence/getSentences";
import { markWordsInSentences } from "../helpers/word/markWordsInSentences";

/**
 * Calculates the keyword count, takes morphology into account. Also calculates the total characters of all the keyword forms
 * that are found in the text if the custom helper for it is available in the researcher.
 *
 * @param {object} paper        The paper containing keyword and text.
 * @param {object} researcher   The researcher.
 *
 * @returns {object} An object containing the count for the keyword occurrences, an array of all the matches,
 * markings and the keyphrase length if the custom helper for it is available in the researcher.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );

	// A helper to calculate the characters length of words in an array that is needed for some languages.
	const keywordCharacterCount = researcher.getHelper( "wordsCharacterCount" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );

	const text = paper.getText();
	const locale = paper.getLocale();

	const sentences = getSentences( text );

	const keywordsFound = {
		count: 0,
		matches: [],
		sentencesWithKeywords: [],
	};

	let charactersCount = 0;

	/*
	 * Count the amount of keyphrase occurrences in the sentences.
	 * An occurrence is counted when all keywords of the keyphrase are contained within the sentence. Each sentence can contain multiple keyphrases.
	 * (e.g. "The apple potato is an apple and a potato." has two occurrences of the keyphrase "apple potato").
	 *
	 * If a custom helper to calculate word characters is available, we also calculate the total characters of all the keyword forms
	 * that are found in the text.
	 */
	sentences.forEach( sentence => {
		const matchesInSentence = topicForms.keyphraseForms.map( keywordForms => matchWords( sentence,
			keywordForms, locale, matchWordCustomHelper ) );

		const hasAllKeywords = matchesInSentence.every( keywordForm => keywordForm.count > 0 );

		if ( hasAllKeywords ) {
			const counts = matchesInSentence.map( match => match.count );
			const foundWords = flattenDeep( matchesInSentence.map( match => match.matches ) );
			// Check if a custom helper to calculate the characters length of all the keyword forms that are found is available.
			if ( keywordCharacterCount ) {
				// If the custom helper is available, also calculate the characters length of all the keyword forms that are found.
				charactersCount += keywordCharacterCount( foundWords );
			}

			keywordsFound.count += Math.min( ...counts );
			keywordsFound.matches.push( foundWords );
			keywordsFound.sentencesWithKeywords.push( sentence );
		}
	} );

	const matches = unique( flattenDeep( keywordsFound.matches ) ).sort( ( a, b ) => b.length - a.length );

	const keywordCountObject = {
		count: keywordsFound.count,
		matches: matches,
		markings: markWordsInSentences( matches, keywordsFound.sentencesWithKeywords, locale, matchWordCustomHelper ),
		length: topicForms.keyphraseForms.length,
	};

	if ( keywordCharacterCount ) {
		keywordCountObject.charactersCount = charactersCount;
	}

	return keywordCountObject;
}
