/** @module researches/imageAltTags */

import imageAltAttribute from "../helpers/image/getAltAttribute";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString";
import { isEmpty } from "lodash";
import getImagesInScope from "../helpers/image/getImagesInScope";
import getImageIdentifier from "../helpers/image/getImageIdentifier";

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * `flagged` lists the identifier of every image without alt text, each once, so a consumer can point at those images.
 * An image without an identifier cannot be pointed at and is left out, so `flagged` can be shorter than `noAlt`.
 *
 * @param {Array}       imageNodes        		Array with all the image nodes in the text
 * @param {Object}      topicForms          	The object with the keyphrase and the synonyms forms from the paper.
 * @param {string}      locale              	The locale used for transliteration.
 * @param {function}    matchWordCustomHelper 	A language-specific helper function to match word in text.
 *
 * @returns {{noAlt: number, withAlt: number, withAltKeyword: number, withAltNonKeyword: number,
 *   flagged: Array<string|number>}} altProperties Object with all alt-tags that were found.
 */
const matchAltProperties = function( imageNodes, topicForms, locale, matchWordCustomHelper ) {
	const altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0,
		flagged: [],
	};

	imageNodes.forEach( imageNode => {
		const alttag = imageAltAttribute( imageNode );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
			const identifier = getImageIdentifier( imageNode );
			if ( identifier !== "" && ! altProperties.flagged.includes( identifier ) ) {
				altProperties.flagged.push( identifier );
			}
			return;
		}

		// If no keyword is set, but the alt-tag is
		if ( isEmpty( topicForms.keyphraseForms ) ) {
			altProperties.withAlt++;
			return;
		}

		// If the keyword is matched in the alt tag
		const keywordMatchedInAltTag = findTopicFormsInString( topicForms, alttag, true, locale, matchWordCustomHelper );
		if ( keywordMatchedInAltTag.percentWordMatches >= 50 ) {
			altProperties.withAltKeyword++;
			return;
		}

		altProperties.withAltNonKeyword++;
	} );

	return altProperties;
};

/**
 * Checks the text for images, checks the type of each image and alt attributes for containing keywords
 *
 * @param {Paper}       paper       The paper to check for images.
 * @param {Researcher}  researcher  The researcher to use for analysis.
 *
 * @returns {object} Object containing all types of found images
 */
export default function altTagCount( paper, researcher ) {
	const images = getImagesInScope( paper );

	const topicForms = researcher.getResearch( "morphology" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );

	return matchAltProperties( images, topicForms, paper.getLocale(), matchWordCustomHelper );
}
