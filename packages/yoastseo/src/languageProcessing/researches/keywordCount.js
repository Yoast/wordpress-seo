import { flattenDeep, min, flatten } from "lodash-es";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import matchWordFormsWithTokens from "../helpers/match/matchWordFormsWithTokens";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { collectMarkingsInSentence, markWordsInASentence } from "../helpers/word/markWordsInSentences";
import Mark from "../../values/Mark";

function getMatchesInSentence( sentence, matchWordCustomHelper, keyphraseForms, locale ) {
	if ( matchWordCustomHelper ) {
		/*
		* Count the amount of keyphrase occurrences in the sentences.
		* An occurrence is counted when all keywords of the keyphrase are contained within the sentence.
		* Each sentence can contain multiple keyphrases.
		* (e.g. "The apple potato is an apple and a potato." has two occurrences of the keyphrase "apple potato").
		* */
		return keyphraseForms.map( forms => matchTextWithArray( sentence.text,  forms, locale, matchWordCustomHelper ) );
	}

	const tokens = sentence.tokens;
	return keyphraseForms.map( forms => matchWordFormsWithTokens( forms, tokens ) );
}

function getMarkings( sentence, matchWordCustomHelper, matchesInSentence ) {
	const foundWords = flattenDeep( matchesInSentence.map( match => match.matches ) );

	if ( matchWordCustomHelper ) {
		return markWordsInASentence( sentence.text, foundWords, matchWordCustomHelper );
	}

	const wordTexts = foundWords.map( wordB => wordB.text );

	return  foundWords.map( word =>
		new Mark(
			{
				position: { startOffset: word.sourceCodeRange.startOffset, endOffset: word.sourceCodeRange.endOffset },
				marked: collectMarkingsInSentence( sentence.text, wordTexts ),
				original: sentence.text,
			} ) );
}
/**
 *
 * @param sentences
 * @param topicForms
 * @param matchWordCustomHelper
 * @param locale
 * @returns {{markings: *[], count: number}}
 */
function countKeyphraseOccurrences( sentences, topicForms, matchWordCustomHelper, locale ) {
	return sentences.reduce( ( sentence, acc ) => {
		const matchesInSentence = getMatchesInSentence( sentence, matchWordCustomHelper, topicForms.keyphraseForms, locale );

		const hasAllKeywords = matchesInSentence.every( form => form.count > 0 );

		if ( ! hasAllKeywords ) {
			return acc;
		}

		const markings = getMarkings( sentence, matchWordCustomHelper, matchesInSentence );

		return {
			count: acc.count + min( matchesInSentence.map( match => match.count ) ),
			markings: acc.markings.concat( markings ),
		};
	}, {
		count: 0,
		markings: [],
	} );
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
