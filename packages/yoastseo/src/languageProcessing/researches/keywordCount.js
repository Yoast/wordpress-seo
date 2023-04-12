import { flattenDeep, uniq as unique } from "lodash-es";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import matchWordFormsWithTokens from "../helpers/match/matchWordFormsWithTokens";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { markWordsInASentence } from "../helpers/word/markWordsInSentences";

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {object} An array of all the matches, markings and the keyphrase count.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );

	// A helper to return all the matches for the keyphrase.
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );

	const locale = paper.getLocale();

	const sentences = getSentencesFromTree( paper );

	const keywordsFound = {
		count: 0,
		matches: [],
		markings: [],
	};

	sentences.forEach( sentence => {
		const keyphraseForms = topicForms.keyphraseForms;
		const tokens = sentence.tokens.map( token => token.text );
		// eslint-disable-next-line no-warning-comments

		if ( matchWordCustomHelper ) {
			/*
		     * Count the amount of keyphrase occurrences in the sentences.
		     * An occurrence is counted when all keywords of the keyphrase are contained within the sentence.
		     * Each sentence can contain multiple keyphrases.
		     * (e.g. "The apple potato is an apple and a potato." has two occurrences of the keyphrase "apple potato").
		    */
			const matchesInSentence = topicForms.keyphraseForms.map( keywordForms => matchTextWithArray( sentence.text,
				keywordForms, locale, matchWordCustomHelper ) );
			const hasAllKeywords = matchesInSentence.every( keywordForm => keywordForm.count > 0 );

			if ( hasAllKeywords ) {
				const counts = matchesInSentence.map( match => match.count );
				const foundWords = flattenDeep( matchesInSentence.map( match => match.matches ) );
				// eslint-disable-next-line no-warning-comments
				keywordsFound.count += Math.min( ...counts );
				keywordsFound.matches.push( foundWords );
				keywordsFound.markings.push( markWordsInASentence( sentence.text, keyphraseForms, matchWordCustomHelper ) );
			}
		} else {
			const matchesInSentence = topicForms.keyphraseForms.map( forms => matchWordFormsWithTokens( forms, tokens ) );
			const hasAllKeywords = matchesInSentence.every( keywordForm => keywordForm.count > 0 );

			if ( hasAllKeywords ) {
				const counts = matchesInSentence.map( match => match.count );
				const foundWords = flattenDeep( matchesInSentence.map( match => match.matches ) );
				// eslint-disable-next-line no-warning-comments
				// TODO: create a new helper for adding marking to tokens
				keywordsFound.count += Math.min( ...counts );
				keywordsFound.matches.push( foundWords );
			}
		}
	} );

	const matches = unique( flattenDeep( keywordsFound.matches ) ).sort( ( a, b ) => b.length - a.length );

	return {
		count: keywordsFound.count,
		matches: matches,
		markings: keywordsFound.markings,
		length: topicForms.keyphraseForms.length,
	};
}
