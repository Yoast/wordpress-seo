/** @module researches/imageAltTags */

import imageInText from "../stringProcessing/imageInText";
import imageAlttag from "../stringProcessing/getAlttagContent";
import { findTopicFormsInString } from "../researches/findKeywordFormsInString";

import { isEmpty } from "lodash-es";

/**
 * Checks if a match was found based on different criteria in recalibration and in regular analysis.
 *
 * @param {Object} matchResult The object with the count and percent of words from the keyphrase that were matched.
 *
 * @returns {boolean} Whether a match was found or not.
 */
const matchFound = function( matchResult ) {
	if ( process.env.YOAST_RECALIBRATION === "enabled" ) {
		return matchResult.percentWordMatches >= 50;
	}
	return matchResult.countWordMatches > 0;
};

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {Object} topicForms The object with the keyphrase and the synonyms forms from the paper.
 * @param {string} locale The locale used for transliteration.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
const matchAltProperties = function( imageMatches, topicForms, locale ) {
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
		const keywordMatchedInAltTag = findTopicFormsInString( topicForms, alttag, true, locale );
		if ( matchFound( keywordMatchedInAltTag ) ) {
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
 * @param {Paper} paper The paper to check for images.
 * @param {Researcher} researcher The researcher to use for analysis.
 *
 * @returns {object} Object containing all types of found images
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );

	return matchAltProperties( imageInText( paper.getText() ), topicForms, paper.getLocale() );
}
