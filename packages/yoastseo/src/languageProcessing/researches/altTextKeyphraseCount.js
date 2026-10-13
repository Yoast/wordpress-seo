import { isEmpty } from "lodash";

import getImagesInScope from "../helpers/image/getImagesInScope";
import getAltAttribute from "../helpers/image/getAltAttribute";
import getImageIdentifier from "../helpers/image/getImageIdentifier";
import matchWords from "../helpers/match/matchTextWithArray";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest";
import getSentences from "../helpers/sentence/getSentences";

/**
 * @typedef {import("../AbstractResearcher").default } Researcher
 * @typedef {import("../../values/").Paper } Paper
 */

/**
 * The number of keyphrase and synonym occurrences in the alt text of one image.
 *
 * @typedef {Object} AltTextKeyphraseCount
 * @property {string|number} identifier The identifier of the image, see `getImageIdentifier`.
 * @property {number}        count      The number of full keyphrase and synonym matches in its alt text.
 */

/**
 * Counts the full matches of one topic phrase (the keyphrase or one synonym) in a text, and removes the matched
 * words from the text, so the next topic phrase cannot match the same words again.
 *
 * A full match is a match of every word of the topic phrase, so the number of full matches is the lowest count
 * among its words.
 *
 * @param {string}     text                  The text to search.
 * @param {string[][]} topicPhraseForms      The forms of each word of the topic phrase.
 * @param {string}     locale                The locale, for transliteration.
 * @param {function}   matchWordCustomHelper The language-specific helper to match a word in a text.
 *
 * @returns {{count: number, remainingText: string}} The number of full matches and the text without them.
 */
const countTopicPhrase = ( text, topicPhraseForms, locale, matchWordCustomHelper ) => {
	if ( isEmpty( topicPhraseForms ) ) {
		return { count: 0, remainingText: text };
	}

	const wordMatches = topicPhraseForms.map( wordForms => matchWords( text, wordForms, locale, matchWordCustomHelper ) );
	const count = Math.min( ...wordMatches.map( match => match.count ) );

	let remainingText = text;
	wordMatches.forEach( wordMatch =>
		wordMatch.matches.slice( 0, count ).forEach( match => {
			remainingText = remainingText.replace( match, "" );
		} )
	);

	return { count, remainingText };
};

/**
 * Counts how often the keyphrase and its synonyms occur in the alt text of each image in scope.
 *
 * The images in scope are the images in the text, unless the Paper carries a `providedImages` attribute
 * (see `getImagesInScope`). Images without alt text are skipped. The keyphrase and the synonyms are summed, so an
 * alt text that has the keyphrase once and a synonym once counts 2. Each topic phrase only matches words that the
 * ones before it did not match, so overlapping synonyms do not count the same words twice.
 *
 * The alt text is counted per sentence, like the keyphrase in the meta description, so the words of a keyphrase
 * that are spread over different sentences do not form a match.
 *
 * Exact matching (a keyphrase in double quotes) is already applied by the morphology research, which then returns
 * the quoted phrase as a single form. It is still reported here, because it changes how many occurrences count as
 * stuffing.
 *
 * @param {Paper}      paper      The paper to check for images.
 * @param {Researcher} researcher The researcher, for the keyphrase forms and the language-specific helper.
 *
 * @returns {{exactMatchRequested: boolean, images: AltTextKeyphraseCount[]}} Whether exact matching is requested,
 *                                                                           and the count for each image with alt text.
 */
export default function altTextKeyphraseCount( paper, researcher ) {
	const result = {
		exactMatchRequested: processExactMatchRequest( paper.getKeyword() ).exactMatchRequested,
		images: [],
	};

	const topicForms = researcher.getResearch( "morphology" );
	if ( isEmpty( topicForms.keyphraseForms ) ) {
		return result;
	}

	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );
	const memoizedTokenizer = researcher.getHelper( "memoizedTokenizer" );
	const locale = paper.getLocale();
	const topicPhrases = [ topicForms.keyphraseForms, ...topicForms.synonymsForms ];

	getImagesInScope( paper ).forEach( image => {
		const altText = getAltAttribute( image );

		if ( altText === "" ) {
			return;
		}

		let count = 0;
		getSentences( altText, memoizedTokenizer ).forEach( sentence => {
			let remainingText = sentence;
			topicPhrases.forEach( topicPhraseForms => {
				const topicPhraseResult = countTopicPhrase( remainingText, topicPhraseForms, locale, matchWordCustomHelper );
				count += topicPhraseResult.count;
				remainingText = topicPhraseResult.remainingText;
			} );
		} );

		result.images.push( { identifier: getImageIdentifier( image ), count } );
	} );

	return result;
}
