import { isEmpty } from "lodash";

import getImagesInScope from "../helpers/image/getImagesInScope.js";
import getAltAttribute from "../helpers/image/getAltAttribute.js";
import getImageIdentifier from "../helpers/image/getImageIdentifier.js";
import { countTopicPhrasesInSentence } from "../helpers/match/matchWordFormsWithSentence.js";
import processExactMatchRequest from "../helpers/match/processExactMatchRequest.js";
import getSentences from "../helpers/sentence/getSentences.js";
import splitIntoTokens from "../helpers/word/splitIntoTokens.js";

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
 * Counts how often the keyphrase and its synonyms occur in the alt text of each image in scope.
 *
 * The images in scope are the images in the text, unless the Paper carries a `providedImages` attribute
 * (see `getImagesInScope`). Images without alt text are skipped. The keyphrase and the synonyms are summed, so an
 * alt text that has the keyphrase once and a synonym once counts 2. Each topic phrase only matches words that the
 * ones before it did not match, so overlapping synonyms do not count the same words twice.
 *
 * The alt text is counted per sentence, like the keyphrase in the meta description, so the words of a keyphrase
 * that are spread over different sentences do not form a match. Within a sentence, each word is matched as a token,
 * so a word that the keyphrase repeats ("bora bora") needs a token for every repetition.
 *
 * Exact matching (a keyphrase in double quotes) is already applied by the morphology research, which then returns
 * the quoted phrase as a single form. It is still reported here, because it changes how many occurrences count as
 * stuffing.
 *
 * @param {Paper}      paper      The paper to check for images.
 * @param {Researcher} researcher The researcher, for the keyphrase forms and the language-specific helpers.
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
	const splitter = researcher.getHelper( "splitIntoTokensCustom" ) || splitIntoTokens;
	const locale = paper.getLocale();
	const topicPhrases = [ topicForms.keyphraseForms, ...topicForms.synonymsForms ];

	getImagesInScope( paper ).forEach( image => {
		const altText = getAltAttribute( image );

		if ( altText === "" ) {
			return;
		}

		const count = getSentences( altText, memoizedTokenizer ).reduce( ( total, sentence ) =>
			total + countTopicPhrasesInSentence( sentence, topicPhrases, locale, matchWordCustomHelper, splitter ), 0 );

		result.images.push( { identifier: getImageIdentifier( image ), count } );
	} );

	return result;
}
