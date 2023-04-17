import { flattenDeep, min, flatten } from "lodash-es";
import matchTextWithArray from "../helpers/match/matchTextWithArray";
import matchWordFormsWithTokens from "../helpers/match/matchWordFormsWithTokens";
import getSentencesFromTree from "../helpers/sentence/getSentencesFromTree";
import { collectMarkingsInSentence, markWordsInASentence } from "../helpers/word/markWordsInSentences";
import Mark from "../../values/Mark";

/**
 * Gets the matched keyphrase form(s).
 *
 * @param {string} sentence The sentence to check.
 * @param {Array} keyphraseForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {Array} The array of matched keyphrase form(s).
 */
function getMatchesInSentence( sentence, keyphraseForms, locale,  matchWordCustomHelper ) {
	if ( matchWordCustomHelper ) {
		return keyphraseForms.map( forms => matchTextWithArray( sentence.text,  forms, locale, matchWordCustomHelper ) );
	}

	return keyphraseForms.map( forms => matchWordFormsWithTokens( forms, sentence.tokens ) );
}

/**
 * Gets the Mark objects of all keyphrase matches.
 *
 * @param {string} sentence The sentence to check.
 * @param {Array} matchesInSentence The array of keyphrase matches in the sentence.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {Mark[]}    The array of Mark objects of the keyphrase matches.
 */
function getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper ) {
	const foundWords = flattenDeep( matchesInSentence.map( match => match.matches ) );

	if ( matchWordCustomHelper ) {
		return markWordsInASentence( sentence.text, foundWords, matchWordCustomHelper );
	}

	const wordTexts = foundWords.map( wordB => wordB.text );

	return foundWords.map( word =>
		new Mark(
			{
				position: { startOffset: word.sourceCodeRange.startOffset, endOffset: word.sourceCodeRange.endOffset },
				marked: collectMarkingsInSentence( sentence.text, wordTexts ),
				original: sentence.text,
			} ) );
}

/**
 * Counts the occurrences of the keyphrase in the text and creates the Mark objects for the matches.
 *
 * @param {Array} sentences The sentences to check.
 * @param {Array} topicForms The keyphrase forms.
 * @param {string} locale The locale used in the analysis.
 * @param {function} matchWordCustomHelper  A custom helper to match words with a text.
 *
 * @returns {{markings: Mark[], count: number}} The number of keyphrase occurrences in the text and the Mark objects of the matches.
 */
export function countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper ) {
	return sentences.reduce( ( acc, sentence ) => {
		const matchesInSentence = getMatchesInSentence( sentence, topicForms.keyphraseForms, locale, matchWordCustomHelper );

		/*
		 * Check if all words of the keyphrase are found in the sentence.
		 * One keyphrase occurrence is counted when all words of the keyphrase are contained within the sentence.
		 * Each sentence can contain multiple keyphrases.
	     * (e.g. "The apple potato is an apple and a potato." has two occurrences of the keyphrase "apple potato").
		 */
		const hasAllKeywords = matchesInSentence.every( form => form.count > 0 );

		if ( ! hasAllKeywords ) {
			return acc;
		}
		// Get the Mark objects of all keyphrase occurrences in the sentence.
		const markings = getMarkingsInSentence( sentence, matchesInSentence, matchWordCustomHelper );

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
 * @returns {Object} An object containing an array of all the matches, markings and the keyphrase count.
 */
export default function keyphraseCount( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );

	// A helper to return all the matches for the keyphrase.
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );

	const locale = paper.getLocale();

	const sentences = getSentencesFromTree( paper );
	const keyphraseFound = countKeyphraseInText( sentences, topicForms, locale, matchWordCustomHelper );

	return {
		count: keyphraseFound.count,
		markings: flatten( keyphraseFound.markings ),
		length: topicForms.keyphraseForms.length,
	};
}

/**
 * Calculates the keyphrase count, takes morphology into account.
 *
 * @deprecated Since version 20.8. Use keywordCountInSlug instead.
 *
 * @param {Paper}       paper       The paper containing keyphrase and text.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} An array of all the matches, markings and the keyphrase count.
 */
export function keywordCount( paper, researcher ) {
	console.warn( "This function is deprecated, use keyphraseCount instead." );
	return keyphraseCount( paper, researcher );
}
