/** @module researches/imageAltTags */

import imageInText from "../helpers/image/imageInText";
import imageAlttag from "../helpers/image/getAlttagContent";
import { findTopicFormsInString } from "../helpers/match/findKeywordFormsInString";
import { isEmpty } from "lodash-es";

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array}       imageMatches        	Array with all the matched images in the text
 * @param {Object}      topicForms          	The object with the keyphrase and the synonyms forms from the paper.
 * @param {string}      locale              	The locale used for transliteration.
 * @param {function}    matchWordCustomHelper 	A language-specific helper function to match word in text.
 *
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
const matchAltProperties = function( imageMatches, topicForms, locale, matchWordCustomHelper ) {
	const altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0,
	};

	for ( let i = 0; i < imageMatches.length; i++ ) {
		const alttag = imageAlttag( imageMatches[ i ] );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
			continue;
		}

		// If no keyword is set, but the alt-tag is
		if ( isEmpty( topicForms.keyphraseForms ) ) {
			altProperties.withAlt++;
			continue;
		}

		// If the keyword is matched in the alt tag
		const keywordMatchedInAltTag = findTopicFormsInString( topicForms, alttag, true, locale, matchWordCustomHelper );
		if ( keywordMatchedInAltTag.percentWordMatches >= 50 ) {
			altProperties.withAltKeyword++;
			continue;
		}

		altProperties.withAltNonKeyword++;
	}

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
	const topicForms = researcher.getResearch( "morphology" );
	const matchWordCustomHelper = researcher.getHelper( "matchWordCustomHelper" );

	return matchAltProperties( imageInText( paper.getText() ), topicForms, paper.getLocale(), matchWordCustomHelper );
}
