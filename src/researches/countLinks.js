/** @module analyses/getLinkStatistics */

import getLinks from './getLinks';

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {number} The number of links found in the text.
 */
export default function( paper ) {
	var anchors = getLinks( paper );

	return anchors.length;
};
