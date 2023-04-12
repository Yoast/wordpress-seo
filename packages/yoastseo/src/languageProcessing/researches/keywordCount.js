import { flattenDeep, flatten } from "lodash-es";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import matchWordFormsWithTokens from "../helpers/match/matchWordFormsWithTokens";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { collectMarkingsInSentence, markWordsInASentence } from "../helpers/word/markWordsInSentences";
import Mark from "../../values/Mark";

/**
 *
 * @param sentences
 * @param topicForms
 * @param matchWordCustomHelper
 * @param locale
 * @return {{markings: *[], count: number}}
 */
function countKeyphraseOccurrences( sentences, topicForms, matchWordCustomHelper, locale ) {
	const result = {
		count: 0,
		markings: [],
	};
	sentences.forEach( sentence => {
		const keyphraseForms = topicForms.keyphraseForms;
		let matchesInSentence;
		if ( matchWordCustomHelper ) {
			/*
			* Count the amount of keyphrase occurrences in the sentences.
			* An occurrence is counted when all keywords of the keyphrase are contained within the sentence.
			* Each sentence can contain multiple keyphrases.
			* (e.g. "The apple potato is an apple and a potato." has two occurrences of the keyphrase "apple potato").
			* */
			matchesInSentence = keyphraseForms.map( forms => matchTextWithArray( sentence.text,
				forms, locale, matchWordCustomHelper ) );
		} else {
			const tokens = sentence.tokens;
			matchesInSentence = keyphraseForms.map( forms => matchWordFormsWithTokens( forms, tokens ) );
		}
		const hasAllKeywords = matchesInSentence.every( form => form.count > 0 );

		if ( hasAllKeywords ) {
			const counts = matchesInSentence.map( match => match.count );
			const foundWords = flattenDeep( matchesInSentence.map( match => match.matches ) );
			result.count += Math.min( ...counts );
			const markings = matchWordCustomHelper
				? markWordsInASentence( sentence.text, foundWords, matchWordCustomHelper )
				: foundWords.map( word => {
					return new Mark(
						{
							position: { startOffset: word.sourceCodeRange.startOffset, endOffset: word.sourceCodeRange.endOffset },
							marked: collectMarkingsInSentence( sentence.text, foundWords.map( wordB => wordB.text ) ),
							original: sentence.text,
						} );
				} );
			result.markings.push( markings );
		}
	} );
	return result;
}

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

	const keywordsFound = countKeyphraseOccurrences( sentences, topicForms, matchWordCustomHelper, locale );

	return {
		count: keywordsFound.count,
		markings: flatten( keywordsFound.markings ),
		length: topicForms.keyphraseForms.length,
	};
}
