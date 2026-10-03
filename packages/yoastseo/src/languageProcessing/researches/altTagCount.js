/** @module researches/imageAltTags */

import imageAltAttribute from "../helpers/image/getAltAttribute";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString";
import { isEmpty } from "lodash";
import getImagesInTree from "../helpers/image/getImagesInTree";

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array}       imageNodes        		Array with all the image nodes in the text
 * @param {Object}      topicForms          	The object with the keyphrase and the synonyms forms from the paper.
 * @param {string}      locale              	The locale used for transliteration.
 * @param {function}    matchWordCustomHelper 	A language-specific helper function to match word in text.
 *
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
const matchAltProperties = function( imageNodes, topicForms, locale, matchWordCustomHelper ) {
	const altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0,
	};

	imageNodes.forEach( imageNode => {
		const alttag = imageAltAttribute( imageNode );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
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
	const images = getImagesInTree( paper );

	const topicForms = researcher.getResearch( "morphology" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );

	return matchAltProperties( images, topicForms, paper.getLocale(), matchWordCustomHelper );
}
